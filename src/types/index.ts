export type EmotionType = 'Happy' | 'Sad' | 'Angry' | 'Neutral' | 'Fear' | 'Surprise';

export type LivenessStatus = 'LIVE HUMAN VERIFIED' | 'SPOOF DETECTED' | 'VERIFYING BIOMETRICS...';

export type RoleType = 'Security Administrator' | 'Chief Security Officer' | 'HR Director' | 'Kiosk Terminal';

export interface User {
  id: string;
  name: string;
  employeeId: string;
  department: string;
  role: string;
  avatarUrl: string;
  registeredAt: string;
  embedding: number[];
  status: 'Active' | 'Suspended';
}

export interface FaceBoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface FaceLandmarks {
  leftEye: [number, number];
  rightEye: [number, number];
  nose: [number, number];
  mouthLeft: [number, number];
  mouthRight: [number, number];
  jawCenter: [number, number];
}

export interface DetectedFace {
  id: string;
  box: FaceBoundingBox;
  confidence: number;
  landmarks?: FaceLandmarks;
  matchedUser?: User;
  isUnknown: boolean;
  distance: number;
  snapshotUrl?: string;
  detectedAt: number;
  // Anti-spoofing & Emotion
  emotion: EmotionType;
  emotionConfidence: number;
  isLive: boolean;
  livenessStatus: LivenessStatus;
  livenessScore: number; // 0-100%
  eyeAspectRatio: number; // EAR value e.g. 0.28
  blinkCount: number;
}

export interface AttendanceRecord {
  id: string;
  userId: string;
  personName: string;
  employeeId: string;
  department: string;
  date: string;
  time: string;
  timestamp: number;
  status: 'Present' | 'Late' | 'VIP Access';
  confidence: number;
  cameraId: string;
  emotion?: EmotionType;
  livenessVerified: boolean;
}

export interface RecognitionLog {
  id: string;
  personName: string;
  isUnknown: boolean;
  confidence: number;
  timestamp: number;
  dateStr: string;
  timeStr: string;
  snapshotUrl: string;
  cameraId: string;
  actionTaken: string;
  department?: string;
  emotion?: EmotionType;
  livenessStatus?: LivenessStatus;
}

export interface SecurityAlert {
  id: string;
  timestamp: number;
  timeStr: string;
  dateStr: string;
  type: 'Unknown Person' | 'Spoof Attack Attempt' | 'Multiple Unknowns' | 'Access Denied' | 'Camera Obscured';
  severity: 'low' | 'medium' | 'high' | 'critical';
  details: string;
  snapshotUrl?: string;
  resolved: boolean;
  resolvedBy?: string;
}

export interface VisitorRecord {
  id: string;
  visitorId: string;
  name: string;
  company: string;
  purpose: 'Client Meeting' | 'Technical Audit' | 'Job Interview' | 'Vendor Delivery' | 'VIP Guest' | 'Maintenance';
  hostEmployee: string;
  phone: string;
  entryTime: string;
  exitTime?: string;
  date: string;
  status: 'Checked In' | 'Checked Out' | 'Overstay Alert';
  snapshotUrl: string;
  badgeIssued: boolean;
}

export interface EmailIncident {
  id: string;
  timestamp: number;
  timeStr: string;
  recipient: string;
  subject: string;
  threatLevel: 'low' | 'medium' | 'high' | 'critical';
  personSnapshot?: string;
  status: 'Delivered' | 'Queued' | 'Sent';
  details: string;
}

export interface SystemSettings {
  confidenceThreshold: number; // e.g. 72 (%)
  duplicateCooldownMinutes: number; // e.g. 5 minutes
  soundEnabled: boolean;
  autoSnapshotUnknown: boolean;
  cameraDeviceId: string;
  isSimulated: boolean;
  activeSimulationPreset: 'office_entrance' | 'campus_gate' | 'high_security';
  alertEmail: string;
  targetFps: number;
  // Advanced features
  antiSpoofingEnabled: boolean;
  antiSpoofSensitivity: number; // 50-95%
  emotionDetectionEnabled: boolean;
  voiceAssistantEnabled: boolean;
  smtpServer: string;
  smtpPort: number;
  emailAlertsEnabled: boolean;
}

export type AppStage = 'landing' | 'login' | 'features' | 'app';

export interface AuthUser {
  email: string;
  name: string;
  role: RoleType;
  avatarUrl: string;
}

export type ActiveScreen =
  | 'dashboard'
  | 'live-recognition'
  | 'attendance'
  | 'registered-users'
  | 'visitors'
  | 'timeline'
  | 'emotion-analytics'
  | 'security-center'
  | 'history'
  | 'settings'
  | 'python-hub';
