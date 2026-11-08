import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  Camera,
  CameraOff,
  RefreshCw,
  Sliders,
  Volume2,
  VolumeX,
  ShieldAlert,
  UserCheck,
  UserPlus,
  Maximize2,
  Eye,
  Crosshair,
  AlertOctagon,
  Sparkles,
} from 'lucide-react';
import {
  AttendanceRecord,
  DetectedFace,
  RecognitionLog,
  SecurityAlert,
  SystemSettings,
  User,
} from '../types';
import {
  detectFacesInVideo,
  extractFaceSnapshot,
} from '../utils/faceEngine';
import { playAlertChime, playCameraShutter, playSuccessBeep } from '../utils/audio';

interface LiveRecognitionViewProps {
  registeredUsers: User[];
  settings: SystemSettings;
  onUpdateSettings: (newSettings: Partial<SystemSettings>) => void;
  onRecordAttendance: (record: Omit<AttendanceRecord, 'id' | 'timestamp'>) => void;
  onAddRecognitionLog: (log: Omit<RecognitionLog, 'id' | 'timestamp'>) => void;
  onAddSecurityAlert: (alert: Omit<SecurityAlert, 'id' | 'timestamp'>) => void;
  onOpenEnroll: () => void;
  onQuickEnrollUnknown: (snapshotUrl: string) => void;
  fps: number;
  setFps: (fps: number) => void;
}

export const LiveRecognitionView: React.FC<LiveRecognitionViewProps> = ({
  registeredUsers,
  settings,
  onUpdateSettings,
  onRecordAttendance,
  onAddRecognitionLog,
  onAddSecurityAlert,
  onOpenEnroll,
  onQuickEnrollUnknown,
  fps,
  setFps,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const offscreenCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const [streamActive, setStreamActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [detectedFaces, setDetectedFaces] = useState<DetectedFace[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [liveEvents, setLiveEvents] = useState<Array<{ id: string; name: string; isUnknown: boolean; time: string; confidence: number; snapshot?: string }>>([]);
  const [flashEffect, setFlashEffect] = useState<boolean>(false);
  const [testSpoofMode, setTestSpoofMode] = useState<boolean>(false);

  // Cooldown tracker for attendance and alerts to prevent event spam
  const lastMarkedTimesRef = useRef<Record<string, number>>({});
  const lastUnknownAlertTimeRef = useRef<number>(0);
  const animationFrameIdRef = useRef<number | null>(null);
  const lastFpsCalcTimeRef = useRef<number>(performance.now());
  const frameCountRef = useRef<number>(0);

  // Initialize Offscreen Canvas
  useEffect(() => {
    if (!offscreenCanvasRef.current) {
      offscreenCanvasRef.current = document.createElement('canvas');
    }
  }, []);

  // Request & Start Real Webcam Stream
  const startCamera = useCallback(async () => {
    setCameraError(null);
    try {
      if (settings.isSimulated) {
        setStreamActive(true);
        return;
      }

      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 1280 },
            height: { ideal: 720 },
            facingMode: 'user',
          },
          audio: false,
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
          setStreamActive(true);
        }
      } else {
        setCameraError('Webcam access not supported in this browser environment. Switched to Simulation Mode.');
        onUpdateSettings({ isSimulated: true });
        setStreamActive(true);
      }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Camera permission denied or camera device in use.';
      console.warn('Camera error:', errorMsg);
      setCameraError('Camera access unavailable. Operating in Automated Biometric Simulation Mode.');
      onUpdateSettings({ isSimulated: true });
      setStreamActive(true);
    }
  }, [settings.isSimulated, onUpdateSettings]);

  // Stop Webcam Stream
  const stopCamera = useCallback(() => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setStreamActive(false);
    setDetectedFaces([]);
  }, []);

  // Handle stream lifecycle
  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, [startCamera, stopCamera]);

  // Handle Snapshot Capture
  const handleManualSnapshot = () => {
    if (settings.soundEnabled) {
      playCameraShutter();
    }
    setFlashEffect(true);
    setTimeout(() => setFlashEffect(false), 150);

    const video = videoRef.current;
    if (video && detectedFaces.length > 0) {
      const primaryFace = detectedFaces[0];
      const snapshot = extractFaceSnapshot(video, primaryFace.box, 240);
      if (snapshot) {
        const now = new Date();
        const timeStr = now.toLocaleTimeString();
        const dateStr = now.toISOString().split('T')[0];

        onAddRecognitionLog({
          personName: primaryFace.matchedUser ? primaryFace.matchedUser.name : 'Unknown Snapshot',
          isUnknown: primaryFace.isUnknown,
          confidence: primaryFace.confidence,
          dateStr,
          timeStr,
          snapshotUrl: snapshot,
          cameraId: 'CAM-01 Main Gate',
          actionTaken: 'Manual High-Resolution Snapshot Captured',
        });
      }
    }
  };

  // Main Detection Loop (Video Frame or Simulation)
  useEffect(() => {
    let isSubscribed = true;

    const processLoop = async () => {
      if (!isSubscribed) return;

      const now = performance.now();
      frameCountRef.current++;
      if (now - lastFpsCalcTimeRef.current >= 1000) {
        setFps(frameCountRef.current);
        frameCountRef.current = 0;
        lastFpsCalcTimeRef.current = now;
      }

      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');

      // 1. Simulation Mode (if camera is disabled or simulated mode is on)
      if (settings.isSimulated || !videoRef.current || !streamActive) {
        if (canvas && ctx) {
          const w = canvas.width || 800;
          const h = canvas.height || 480;

          // Clear Canvas
          ctx.clearRect(0, 0, w, h);

          // Draw Simulated Video Background
          const grad = ctx.createLinearGradient(0, 0, w, h);
          grad.addColorStop(0, '#101418');
          grad.addColorStop(1, '#182026');
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, w, h);

          // Grid lines
          ctx.strokeStyle = '#1f2937';
          ctx.lineWidth = 1;
          for (let x = 0; x < w; x += 40) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, h);
            ctx.stroke();
          }
          for (let y = 0; y < h; y += 40) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(w, y);
            ctx.stroke();
          }

          // Generate dynamic simulated movement based on time
          const t = Date.now() * 0.001;
          const user1 = registeredUsers[0];
          const user2 = registeredUsers[1];

          const simFaces: DetectedFace[] = [
            {
              id: 'sim-face-1',
              box: {
                x: w * 0.25 + Math.sin(t * 1.2) * 30,
                y: h * 0.2 + Math.cos(t * 0.9) * 20,
                width: 170,
                height: 220,
              },
              confidence: 96.8,
              matchedUser: user1,
              isUnknown: false,
              distance: 0.22,
              detectedAt: Date.now(),
              emotion: 'Happy',
              emotionConfidence: 94.5,
              isLive: !testSpoofMode,
              livenessStatus: testSpoofMode ? 'SPOOF DETECTED' : 'LIVE HUMAN VERIFIED',
              livenessScore: testSpoofMode ? 22 : 94,
              eyeAspectRatio: testSpoofMode ? 0.35 : 0.27 + Math.sin(t * 3) * 0.05,
              blinkCount: 8,
              landmarks: {
                leftEye: [w * 0.25 + 50, h * 0.2 + 80],
                rightEye: [w * 0.25 + 120, h * 0.2 + 80],
                nose: [w * 0.25 + 85, h * 0.2 + 120],
                mouthLeft: [w * 0.25 + 60, h * 0.2 + 165],
                mouthRight: [w * 0.25 + 110, h * 0.2 + 165],
                jawCenter: [w * 0.25 + 85, h * 0.2 + 205],
              },
            },
            {
              id: 'sim-face-2',
              box: {
                x: w * 0.62 + Math.cos(t * 1.5) * 25,
                y: h * 0.28 + Math.sin(t * 1.1) * 15,
                width: 160,
                height: 200,
              },
              confidence: 43.5,
              matchedUser: undefined,
              isUnknown: true,
              distance: 0.81,
              detectedAt: Date.now(),
              emotion: 'Neutral',
              emotionConfidence: 89.0,
              isLive: true,
              livenessStatus: 'LIVE HUMAN VERIFIED',
              livenessScore: 88,
              eyeAspectRatio: 0.29,
              blinkCount: 6,
              landmarks: {
                leftEye: [w * 0.62 + 45, h * 0.28 + 75],
                rightEye: [w * 0.62 + 115, h * 0.28 + 75],
                nose: [w * 0.62 + 80, h * 0.28 + 110],
                mouthLeft: [w * 0.62 + 55, h * 0.28 + 150],
                mouthRight: [w * 0.62 + 105, h * 0.28 + 150],
                jawCenter: [w * 0.62 + 80, h * 0.28 + 185],
              },
            },
          ];

          setDetectedFaces(simFaces);
          drawHudOverlays(ctx, simFaces, w, h);
          handleFaceEvents(simFaces, canvas);
        }

        animationFrameIdRef.current = requestAnimationFrame(processLoop);
        return;
      }

      // 2. Real Video Stream Processing
      const video = videoRef.current;
      if (video && video.readyState >= 2 && offscreenCanvasRef.current && canvas && ctx) {
        // Sync canvas resolution with actual video dimensions
        if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
        }

        const faces = await detectFacesInVideo(
          video,
          offscreenCanvasRef.current,
          registeredUsers,
          settings.confidenceThreshold
        );

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawHudOverlays(ctx, faces, canvas.width, canvas.height);
        setDetectedFaces(faces);
        handleFaceEvents(faces, video);
      }

      animationFrameIdRef.current = requestAnimationFrame(processLoop);
    };

    animationFrameIdRef.current = requestAnimationFrame(processLoop);

    return () => {
      isSubscribed = false;
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, [streamActive, settings.isSimulated, registeredUsers, settings.confidenceThreshold]);

  // Handle Event Triggers (Attendance auto-mark & Unknown alerts)
  const handleFaceEvents = useCallback(
    (faces: DetectedFace[], sourceElement: HTMLVideoElement | HTMLCanvasElement) => {
      const now = Date.now();
      const nowStr = new Date();
      const dateStr = nowStr.toISOString().split('T')[0];
      const timeStr = nowStr.toLocaleTimeString();

      faces.forEach((face) => {
        // Known Face Recognition
        if (!face.isUnknown && face.matchedUser) {
          const user = face.matchedUser;
          const lastMark = lastMarkedTimesRef.current[user.id] || 0;
          const cooldownMs = settings.duplicateCooldownMinutes * 60 * 1000;

          if (now - lastMark > cooldownMs) {
            lastMarkedTimesRef.current[user.id] = now;

            if (settings.soundEnabled) {
              playSuccessBeep();
            }

            const snapshot = extractFaceSnapshot(sourceElement, face.box, 160);

            // Record attendance
            onRecordAttendance({
              userId: user.id,
              personName: user.name,
              employeeId: user.employeeId,
              department: user.department,
              date: dateStr,
              time: timeStr,
              status: 'Present',
              confidence: face.confidence,
              cameraId: 'CAM-01 Main Gate',
              emotion: face.emotion,
              livenessVerified: face.isLive,
            });

            // Add Recognition Log
            onAddRecognitionLog({
              personName: user.name,
              isUnknown: false,
              confidence: face.confidence,
              dateStr,
              timeStr,
              snapshotUrl: snapshot || user.avatarUrl,
              cameraId: 'CAM-01 Main Gate',
              actionTaken: 'Attendance Automatically Verified',
              department: user.department,
              emotion: face.emotion,
              livenessStatus: face.livenessStatus,
            });

            // Append to live feed
            setLiveEvents((prev) => [
              {
                id: `evt-${now}-${user.id}`,
                name: user.name,
                isUnknown: false,
                time: timeStr,
                confidence: face.confidence,
                snapshot: snapshot || user.avatarUrl,
              },
              ...prev.slice(0, 15),
            ]);
          }
        }

        // Unknown Intruder Detection
        if (face.isUnknown) {
          // Alert cooldown: once every 6 seconds
          if (now - lastUnknownAlertTimeRef.current > 6000) {
            lastUnknownAlertTimeRef.current = now;

            if (settings.soundEnabled) {
              playAlertChime();
            }

            const snapshot = extractFaceSnapshot(sourceElement, face.box, 200);

            onAddSecurityAlert({
              timeStr: timeStr,
              dateStr: dateStr,
              type: face.livenessStatus === 'SPOOF DETECTED' ? 'Spoof Attack Attempt' : 'Unknown Person',
              severity: face.livenessStatus === 'SPOOF DETECTED' ? 'critical' : 'medium',
              details:
                face.livenessStatus === 'SPOOF DETECTED'
                  ? 'Anti-spoofing filter flagged static photo/screen presentation attack at CAM-01.'
                  : `Unregistered individual detected at CAM-01 (Confidence: ${face.confidence}%).`,
              snapshotUrl: snapshot,
              resolved: false,
            });

            onAddRecognitionLog({
              personName: face.livenessStatus === 'SPOOF DETECTED' ? 'Spoof Attack Attacker' : 'Unidentified Person',
              isUnknown: true,
              confidence: face.confidence,
              dateStr,
              timeStr,
              snapshotUrl: snapshot,
              cameraId: 'CAM-01 Main Gate',
              actionTaken:
                face.livenessStatus === 'SPOOF DETECTED'
                  ? 'Intercepted by Anti-Spoof Sentinel · Access Blocked'
                  : 'Flagged by Security Sentinel · Snapshot Saved',
              emotion: face.emotion,
              livenessStatus: face.livenessStatus,
            });

            setLiveEvents((prev) => [
              {
                id: `evt-unk-${now}`,
                name: 'Unidentified Individual',
                isUnknown: true,
                time: timeStr,
                confidence: face.confidence,
                snapshot,
              },
              ...prev.slice(0, 15),
            ]);
          }
        }
      });
    },
    [settings, onRecordAttendance, onAddRecognitionLog, onAddSecurityAlert]
  );

  // Draw Futuristic Computer Vision HUD Bounding Boxes on Canvas
  const drawHudOverlays = (
    ctx: CanvasRenderingContext2D,
    faces: DetectedFace[],
    width: number,
    height: number
  ) => {
    // 1. Tech crosshairs in center of screen
    const cx = width / 2;
    const cy = height / 2;
    ctx.strokeStyle = 'rgba(0, 229, 255, 0.2)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(cx, cy, 32, 0, Math.PI * 2);
    ctx.stroke();

    // 2. Render each detected face
    faces.forEach((face) => {
      const { x, y, width: boxW, height: boxH } = face.box;
      const isKnown = !face.isUnknown;

      // Color palette
      const primaryColor = isKnown ? '#00C853' : '#FF3366'; // Green for known, Red for unknown
      const cornerBracketLen = Math.min(boxW, boxH) * 0.22;

      ctx.save();

      // Soft glow
      ctx.shadowColor = primaryColor;
      ctx.shadowBlur = 10;
      ctx.strokeStyle = primaryColor;
      ctx.lineWidth = 2.5;

      // Corner Brackets
      // Top-Left
      ctx.beginPath();
      ctx.moveTo(x, y + cornerBracketLen);
      ctx.lineTo(x, y);
      ctx.lineTo(x + cornerBracketLen, y);
      ctx.stroke();

      // Top-Right
      ctx.beginPath();
      ctx.moveTo(x + boxW - cornerBracketLen, y);
      ctx.lineTo(x + boxW, y);
      ctx.lineTo(x + boxW, y + cornerBracketLen);
      ctx.stroke();

      // Bottom-Left
      ctx.beginPath();
      ctx.moveTo(x, y + boxH - cornerBracketLen);
      ctx.lineTo(x, y + boxH);
      ctx.lineTo(x + cornerBracketLen, y + boxH);
      ctx.stroke();

      // Bottom-Right
      ctx.beginPath();
      ctx.moveTo(x + boxW - cornerBracketLen, y + boxH);
      ctx.lineTo(x + boxW, y + boxH);
      ctx.lineTo(x + boxW, y + boxH - cornerBracketLen);
      ctx.stroke();

      // Semi-transparent target box outline
      ctx.strokeStyle = isKnown ? 'rgba(0, 200, 83, 0.25)' : 'rgba(255, 51, 102, 0.25)';
      ctx.lineWidth = 1;
      ctx.strokeRect(x, y, boxW, boxH);

      // Draw Facial Landmarks (Mesh Points)
      if (face.landmarks) {
        ctx.fillStyle = primaryColor;
        const pts: [number, number][] = [
          face.landmarks.leftEye,
          face.landmarks.rightEye,
          face.landmarks.nose,
          face.landmarks.mouthLeft,
          face.landmarks.mouthRight,
          face.landmarks.jawCenter,
        ];
        pts.forEach(([px, py]) => {
          ctx.beginPath();
          ctx.arc(px, py, 2.5, 0, Math.PI * 2);
          ctx.fill();
        });

        // Subtle connecting mesh line
        ctx.strokeStyle = 'rgba(0, 229, 255, 0.2)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(face.landmarks.leftEye[0], face.landmarks.leftEye[1]);
        ctx.lineTo(face.landmarks.rightEye[0], face.landmarks.rightEye[1]);
        ctx.lineTo(face.landmarks.nose[0], face.landmarks.nose[1]);
        ctx.closePath();
        ctx.stroke();
      }

      // Label background plate with emotion & liveness
      const isSpoof = face.livenessStatus === 'SPOOF DETECTED';
      const labelText = isKnown && face.matchedUser
        ? face.matchedUser.name
        : isSpoof
        ? 'SPOOF THREAT FLAGGED'
        : 'UNKNOWN PERSON';

      const emoText = face.emotion ? ` · ${face.emotion} (${face.emotionConfidence.toFixed(0)}%)` : '';
      const subLabel = `${face.confidence.toFixed(1)}% MATCH${emoText}`;
      const livenessLabel = isSpoof ? 'SPOOF DETECTED (STATIC MEDIA)' : 'LIVE HUMAN VERIFIED';

      ctx.font = 'bold 12px Plus Jakarta Sans, sans-serif';
      const textMetrics = ctx.measureText(labelText);
      const plateW = Math.max(boxW, Math.max(textMetrics.width + 24, 210));
      const plateH = 56;
      const plateY = Math.max(10, y - plateH - 8);

      ctx.fillStyle = 'rgba(18, 18, 18, 0.92)';
      ctx.fillRect(x, plateY, plateW, plateH);
      ctx.strokeStyle = isSpoof ? '#FF3366' : primaryColor;
      ctx.lineWidth = 1;
      ctx.strokeRect(x, plateY, plateW, plateH);

      // Identity text
      ctx.fillStyle = '#FFFFFF';
      ctx.fillText(labelText, x + 8, plateY + 16);

      // Sublabel text (Emotion & Match)
      ctx.font = '500 10px JetBrains Mono, monospace';
      ctx.fillStyle = isSpoof ? '#FF3366' : '#00E5FF';
      ctx.fillText(subLabel, x + 8, plateY + 31);

      // Liveness verification banner
      ctx.font = 'bold 9px JetBrains Mono, monospace';
      ctx.fillStyle = isSpoof ? '#FF3366' : '#00C853';
      ctx.fillText(`[${livenessLabel}]`, x + 8, plateY + 46);

      ctx.restore();
    });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-fadeIn">
      {/* Camera Alert / Error Toast if any */}
      {cameraError && (
        <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between text-xs text-amber-300">
          <div className="flex items-center gap-2">
            <AlertOctagon className="w-4 h-4 text-amber-400" />
            <span>{cameraError}</span>
          </div>
          <button
            onClick={() => onUpdateSettings({ isSimulated: false })}
            className="px-2.5 py-1 rounded bg-amber-500/20 text-white font-medium hover:bg-amber-500/30 transition-colors cursor-pointer"
          >
            Retry Webcam
          </button>
        </div>
      )}

      {/* Top Controls Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-3xl bg-white border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-slate-900 font-bold">CAM-01 [Main Gate]</span>
            <span className="text-slate-300">|</span>
            <span className="text-indigo-600 font-bold tabular-nums">{fps} FPS</span>
            <span className="text-slate-300">|</span>
            <span className="text-slate-700 font-bold">
              {detectedFaces.length} {detectedFaces.length === 1 ? 'Face' : 'Faces'}
            </span>
          </div>

          <div className="text-xs text-slate-500 hidden sm:flex items-center gap-2 font-medium">
            <span>Threshold:</span>
            <span className="font-mono text-indigo-600 font-bold">{settings.confidenceThreshold}%</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Simulation Toggle */}
          <button
            onClick={() => {
              const next = !settings.isSimulated;
              onUpdateSettings({ isSimulated: next });
              if (!next) startCamera();
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
              settings.isSimulated
                ? 'bg-amber-100 text-amber-900 border-amber-300 shadow-xs'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>{settings.isSimulated ? 'Simulation Mode' : 'Webcam Mode'}</span>
          </button>

          {/* Anti-Spoof Test Button */}
          <button
            onClick={() => setTestSpoofMode(!testSpoofMode)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
              testSpoofMode
                ? 'bg-rose-100 text-rose-800 border-rose-300 animate-pulse'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:text-slate-900 hover:bg-slate-100'
            }`}
            title="Simulate presenting a mobile screen or photo printout"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />
            <span>{testSpoofMode ? 'Spoof Test ON' : 'Test Anti-Spoof'}</span>
          </button>

          {/* Manual Snapshot */}
          <button
            onClick={handleManualSnapshot}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 transition-colors cursor-pointer"
            title="Take instantaneous snapshot crop"
          >
            <Camera className="w-3.5 h-3.5 text-indigo-600" />
            <span>Snapshot</span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={() => onUpdateSettings({ soundEnabled: !settings.soundEnabled })}
            className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 transition-colors cursor-pointer"
            title={settings.soundEnabled ? 'Mute' : 'Unmute'}
          >
            {settings.soundEnabled ? (
              <Volume2 className="w-4 h-4 text-emerald-600" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-400" />
            )}
          </button>
        </div>
      </div>

      {/* Main Dual-Column Feed & Activity Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left 3 Columns: Real-Time Video Terminal */}
        <div className="lg:col-span-3 space-y-3">
          <div className="relative aspect-video rounded-2xl bg-[#0D0D0D] border-2 border-[#2A2A2A] overflow-hidden shadow-2xl flex items-center justify-center">
            {/* Flash Effect on Snapshot */}
            {flashEffect && <div className="absolute inset-0 bg-white/60 z-30 pointer-events-none" />}

            {/* Video Element */}
            <video
              ref={videoRef}
              playsInline
              muted
              autoPlay
              className={`w-full h-full object-cover ${settings.isSimulated ? 'hidden' : 'block'}`}
            />

            {/* Canvas HUD Overlay */}
            <canvas
              ref={canvasRef}
              className="absolute inset-0 w-full h-full object-cover z-10 pointer-events-none"
            />

            {/* Laser Line Scanning Effect */}
            <div className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#00E5FF]/80 to-transparent animate-radar-sweep pointer-events-none z-20" />

            {/* Top HUD Telemetry Corner Elements */}
            <div className="absolute top-4 left-4 z-20 flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-[#333] text-[11px] font-mono text-neutral-300">
              <Crosshair className="w-3.5 h-3.5 text-[#00E5FF]" />
              <span>FACIAL GEOMETRY ENGINE:</span>
              <span className="text-[#00C853]">LOCK ON</span>
            </div>

            <div className="absolute top-4 right-4 z-20 flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-[#333] text-[11px] font-mono">
              <span className="text-neutral-400">DETECTED:</span>
              <span className="text-white font-bold">{detectedFaces.length}</span>
            </div>

            {/* Bottom HUD Bar */}
            <div className="absolute bottom-4 inset-x-4 z-20 flex items-center justify-between bg-black/75 backdrop-blur-md px-4 py-2 rounded-xl border border-[#333] text-xs font-mono text-neutral-300">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5 text-[#00C853]">
                  <span className="w-2 h-2 rounded-full bg-[#00C853] animate-pulse" />
                  REAL-TIME PIPELINE ACTIVE
                </span>
                <span className="hidden sm:inline text-neutral-500">|</span>
                <span className="hidden sm:inline text-neutral-400">FPS: {fps}</span>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-neutral-400">
                  CONFIDENCE MIN: <span className="text-[#00E5FF]">{settings.confidenceThreshold}%</span>
                </span>
              </div>
            </div>
          </div>

          {/* Quick HUD legend */}
          <div className="flex items-center justify-between text-[11px] text-neutral-400 px-2 font-mono">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#00C853]" />
                <span className="text-white font-medium">Green</span> = Known Registered Person
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#FF3366]" />
                <span className="text-white font-medium">Red</span> = Unknown Intruder / Flagged
              </span>
            </div>
            <div>
              <span>Automatic attendance cooldown: {settings.duplicateCooldownMinutes}m</span>
            </div>
          </div>
        </div>

        {/* Right 1 Column: Real-Time Detection Feed Sidebar */}
        <div className="rounded-3xl bg-white border border-slate-200/80 shadow-xs p-5 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center">
                  <Eye className="w-4 h-4" />
                </div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Live Scan Stream
                </h3>
              </div>
              <span className="text-[10px] font-mono text-slate-400 font-bold">AUTO-LOGGED</span>
            </div>

            <div className="space-y-3 mt-3 max-h-[500px] overflow-y-auto pr-1">
              {liveEvents.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400 font-medium">
                  <Camera className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  Point webcam at face to initiate recognition stream.
                </div>
              ) : (
                liveEvents.map((evt) => (
                  <div
                    key={evt.id}
                    className={`p-3.5 rounded-2xl border text-xs transition-all ${
                      evt.isUnknown
                        ? 'bg-rose-50/70 border-rose-200 text-rose-900'
                        : 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {evt.snapshot ? (
                        <img
                          src={evt.snapshot}
                          alt={evt.name}
                          className="w-11 h-11 rounded-xl object-cover border border-slate-200 shadow-xs shrink-0"
                        />
                      ) : (
                        <div className="w-11 h-11 rounded-xl bg-white border border-slate-200 flex items-center justify-center shrink-0">
                          {evt.isUnknown ? (
                            <ShieldAlert className="w-5 h-5 text-rose-600" />
                          ) : (
                            <UserCheck className="w-5 h-5 text-emerald-600" />
                          )}
                        </div>
                      )}

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900 truncate text-xs">
                            {evt.name}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400">
                            {evt.time}
                          </span>
                        </div>

                        <div className="flex items-center justify-between mt-1 text-[11px]">
                          <span
                            className={`font-mono font-bold text-[10px] ${
                              evt.isUnknown ? 'text-rose-700' : 'text-emerald-700'
                            }`}
                          >
                            {evt.isUnknown ? 'UNKNOWN INTRUDER' : 'ATTENDANCE MARKED'}
                          </span>
                          <span className="font-mono text-[10px] font-bold text-slate-700">
                            {evt.confidence.toFixed(1)}%
                          </span>
                        </div>

                        {evt.isUnknown && evt.snapshot && (
                          <button
                            onClick={() => onQuickEnrollUnknown(evt.snapshot!)}
                            className="mt-2 w-full flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-800 text-[11px] font-bold border border-rose-200 transition-colors cursor-pointer"
                          >
                            <UserPlus className="w-3.5 h-3.5" />
                            <span>Quick Register This Person</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quick Enrolled summary button */}
          <div className="pt-3 border-t border-slate-100">
            <button
              onClick={onOpenEnroll}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 text-white text-xs font-bold hover:shadow-md transition-all cursor-pointer shadow-xs"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Enroll New Face via Camera</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
