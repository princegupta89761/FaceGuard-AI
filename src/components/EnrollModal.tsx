import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  X,
  Camera,
  Upload,
  UserCheck,
  Fingerprint,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import { User } from '../types';
import { extractEmbeddingFromImageData } from '../utils/faceEngine';
import { playCameraShutter, playSuccessBeep } from '../utils/audio';

interface EnrollModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEnrollUser: (user: User) => void;
  initialSnapshotUrl?: string;
}

export const EnrollModal: React.FC<EnrollModalProps> = ({
  isOpen,
  onClose,
  onEnrollUser,
  initialSnapshotUrl,
}) => {
  const [name, setName] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [department, setDepartment] = useState('Engineering');
  const [role, setRole] = useState('Software Engineer');
  const [photoUrl, setPhotoUrl] = useState<string | null>(initialSnapshotUrl || null);
  const [isCameraActive, setIsCameraActive] = useState<boolean>(true);
  const [extractedEmbedding, setExtractedEmbedding] = useState<number[] | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Sync initial snapshot if provided
  useEffect(() => {
    if (initialSnapshotUrl) {
      setPhotoUrl(initialSnapshotUrl);
      setIsCameraActive(false);
      // Generate synthetic embedding for quick snapshot
      const synth = new Array(128).fill(0).map((_, i) => Math.sin(i * 0.1));
      setExtractedEmbedding(synth);
    }
  }, [initialSnapshotUrl]);

  // Start enrollment webcam
  const startEnrollmentCamera = useCallback(async () => {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 480, height: 480, facingMode: 'user' },
          audio: false,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
          setIsCameraActive(true);
        }
      }
    } catch {
      setIsCameraActive(false);
    }
  }, []);

  const stopEnrollmentCamera = useCallback(() => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
      setIsCameraActive(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen && !photoUrl) {
      startEnrollmentCamera();
    }
    return () => {
      stopEnrollmentCamera();
    };
  }, [isOpen, photoUrl, startEnrollmentCamera, stopEnrollmentCamera]);

  const handleCaptureFromCamera = () => {
    if (!videoRef.current) return;

    playCameraShutter();
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 400;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(videoRef.current, 0, 0, 400, 400);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
    setPhotoUrl(dataUrl);

    // Extract actual 128-D vector
    const embedding = extractEmbeddingFromImageData(
      ctx,
      { x: 0, y: 0, width: 400, height: 400 },
      400,
      400
    );
    setExtractedEmbedding(embedding);

    stopEnrollmentCamera();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setPhotoUrl(result);
      stopEnrollmentCamera();

      // Process image to extract embedding
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 300;
        canvas.height = 300;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, 300, 300);
          const emb = extractEmbeddingFromImageData(
            ctx,
            { x: 0, y: 0, width: 300, height: 300 },
            300,
            300
          );
          setExtractedEmbedding(emb);
        }
      };
      img.src = result;
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    playSuccessBeep();

    const fallbackEmbedding = new Array(128).fill(0).map(() => Math.random() * 0.2 - 0.1);
    const finalEmbedding = extractedEmbedding || fallbackEmbedding;

    const newUser: User = {
      id: `usr-${Date.now()}`,
      employeeId: employeeId.trim() || `EMP-${Math.floor(1000 + Math.random() * 9000)}`,
      name: name.trim(),
      department,
      role: role.trim() || 'Team Member',
      avatarUrl:
        photoUrl ||
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=face',
      embedding: finalEmbedding,
      registeredAt: new Date().toISOString().split('T')[0],
      status: 'Active',
    };

    onEnrollUser(newUser);
    onClose();

    // Reset state
    setName('');
    setEmployeeId('');
    setPhotoUrl(null);
    setExtractedEmbedding(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-lg rounded-3xl bg-white border border-slate-200 shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-7 py-5 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
              <Fingerprint className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Enroll Face Biometrics
              </h2>
              <p className="text-[11px] text-slate-400">
                Register new identity with 128-D Euclidean embedding
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-7 space-y-5">
          {/* Photo Viewfinder */}
          <div className="flex flex-col items-center space-y-3">
            <div className="relative w-48 h-48 rounded-2xl overflow-hidden bg-slate-900 border-2 border-indigo-500 shadow-inner flex items-center justify-center">
              {photoUrl ? (
                <img src={photoUrl} alt="Captured face" className="w-full h-full object-cover" />
              ) : (
                <video
                  ref={videoRef}
                  playsInline
                  muted
                  autoPlay
                  className="w-full h-full object-cover"
                />
              )}

              {/* Target reticle */}
              <div className="absolute inset-4 border border-dashed border-cyan-400/60 rounded-xl pointer-events-none" />

              {extractedEmbedding && (
                <div className="absolute bottom-2 inset-x-2 bg-black/80 backdrop-blur-xs px-2 py-1 rounded text-[10px] font-mono text-emerald-400 text-center font-bold">
                  128-D EMBEDDING EXTRACTED
                </div>
              )}
            </div>

            {/* Photo capture buttons */}
            <div className="flex items-center gap-2">
              {!photoUrl ? (
                <button
                  type="button"
                  onClick={handleCaptureFromCamera}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition-colors cursor-pointer shadow-xs"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Snap Biometric Photo</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setPhotoUrl(null);
                    setExtractedEmbedding(null);
                    startEnrollmentCamera();
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200 hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Retake Photo</span>
                </button>
              )}

              <label className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200 hover:bg-slate-200 transition-colors cursor-pointer">
                <Upload className="w-3.5 h-3.5" />
                <span>Upload File</span>
                <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
              </label>
            </div>
          </div>

          {/* Form fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
            <div className="space-y-1">
              <label className="text-slate-700 font-bold">Full Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Dr. John Carter"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 focus:outline-none focus:border-indigo-600 focus:bg-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-700 font-bold">Employee / Student ID</label>
              <input
                type="text"
                placeholder="e.g. EMP-1042"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 focus:outline-none focus:border-indigo-600 focus:bg-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-700 font-bold">Department</label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 focus:outline-none focus:border-indigo-600 cursor-pointer"
              >
                <option value="Computer Science">Computer Science</option>
                <option value="AI Vision Lab">AI Vision Lab</option>
                <option value="Engineering">Engineering</option>
                <option value="HR & Operations">HR &amp; Operations</option>
                <option value="Security & Access">Security &amp; Access</option>
                <option value="Executive Board">Executive Board</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-slate-700 font-bold">Role / Title</label>
              <input
                type="text"
                placeholder="e.g. Senior Researcher"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 focus:outline-none focus:border-indigo-600 focus:bg-white"
              />
            </div>
          </div>

          {/* Submit */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white text-xs font-bold hover:shadow-md hover:shadow-indigo-500/20 active:scale-98 transition-all cursor-pointer shadow-xs"
            >
              <UserCheck className="w-4 h-4" />
              <span>Register Biometric Profile</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
