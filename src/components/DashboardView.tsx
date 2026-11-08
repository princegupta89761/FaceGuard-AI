import React from 'react';
import {
  Users,
  CalendarCheck,
  ShieldAlert,
  Target,
  Activity,
  Camera,
  ArrowRight,
  Download,
  UserPlus,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Building,
  Sparkles,
} from 'lucide-react';
import { AttendanceRecord, RecognitionLog, SecurityAlert, User } from '../types';

interface DashboardViewProps {
  registeredUsers: User[];
  attendanceRecords: AttendanceRecord[];
  recognitionLogs: RecognitionLog[];
  securityAlerts: SecurityAlert[];
  onNavigateToLive: () => void;
  onNavigateToAttendance: () => void;
  onNavigateToHistory: () => void;
  onOpenEnroll: () => void;
  onExportAttendance: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  registeredUsers,
  attendanceRecords,
  recognitionLogs,
  securityAlerts,
  onNavigateToLive,
  onNavigateToAttendance,
  onNavigateToHistory,
  onOpenEnroll,
  onExportAttendance,
}) => {
  const today = new Date().toISOString().split('T')[0];
  const todayAttendance = attendanceRecords.filter((r) => r.date === today);
  const unknownLogs = recognitionLogs.filter((r) => r.isUnknown);
  const unresolvedAlerts = securityAlerts.filter((a) => !a.resolved);

  // Compute average confidence of known recognitions
  const knownLogs = recognitionLogs.filter((r) => !r.isUnknown);
  const avgConfidence =
    knownLogs.length > 0
      ? (knownLogs.reduce((acc, l) => acc + l.confidence, 0) / knownLogs.length).toFixed(1)
      : '98.4';

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-fadeIn">
      {/* Top Banner / Hero HUD Summary */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-8 rounded-3xl bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 text-white shadow-xl shadow-indigo-500/10">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs uppercase tracking-wider font-extrabold px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white border border-white/30">
              Surveillance Console · CAM-01 Active
            </span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-white">
            FaceGuard AI Identity Terminal
          </h1>
          <p className="text-xs text-white/90 mt-1.5 max-w-2xl font-normal leading-relaxed">
            Real-time biometric face detection, 128-D Euclidean feature matching, automated attendance registry, and intruder security monitoring.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onNavigateToLive}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-bold bg-white text-indigo-700 hover:bg-slate-50 transition-all cursor-pointer shadow-lg shadow-black/10 active:scale-98"
          >
            <Camera className="w-4 h-4 text-indigo-600" />
            <span>Launch Live Scanner</span>
          </button>
          <button
            onClick={onExportAttendance}
            className="flex items-center gap-2 px-4 py-3 rounded-2xl text-xs font-bold bg-white/20 hover:bg-white/30 text-white border border-white/30 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4 text-white" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* 6 Primary Multi-Colored Dashboard Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* Widget 1: Registered Users (Blue Gradient) */}
        <div className="p-5 rounded-3xl bg-gradient-to-br from-indigo-50 to-blue-50/60 border border-indigo-200/80 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between text-indigo-900 text-xs font-bold mb-2">
            <span>Enrolled Faces</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black font-mono text-indigo-950 tabular-nums">
            {registeredUsers.length}
          </div>
          <div className="text-[11px] text-indigo-700 font-semibold mt-1 flex items-center justify-between">
            <span>Biometric Templates</span>
            <span className="font-mono font-bold">128-D</span>
          </div>
        </div>

        {/* Widget 2: Today's Attendance (Green Gradient) */}
        <div className="p-5 rounded-3xl bg-gradient-to-br from-emerald-50 to-teal-50/60 border border-emerald-200/80 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between text-emerald-900 text-xs font-bold mb-2">
            <span>Today Attendance</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <CalendarCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black font-mono text-emerald-800 tabular-nums">
            {todayAttendance.length}
          </div>
          <div className="text-[11px] text-emerald-700 font-semibold mt-1 flex items-center justify-between">
            <span>Of {registeredUsers.length} Enrolled</span>
            <span className="font-mono font-bold">
              {registeredUsers.length > 0 ? Math.round((todayAttendance.length / registeredUsers.length) * 100) : 0}%
            </span>
          </div>
        </div>

        {/* Widget 3: Unknown Faces (Rose / Pink Gradient) */}
        <div className="p-5 rounded-3xl bg-gradient-to-br from-rose-50 to-pink-50/60 border border-rose-200/80 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between text-rose-900 text-xs font-bold mb-2">
            <span>Unknown Faces</span>
            <div className="w-8 h-8 rounded-xl bg-rose-600 text-white flex items-center justify-center shadow-xs">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black font-mono text-rose-700 tabular-nums">
            {unknownLogs.length}
          </div>
          <div className="text-[11px] text-rose-700 font-semibold mt-1 flex items-center justify-between">
            <span>Snapshots Logged</span>
            <span className="font-mono font-bold">{unresolvedAlerts.length} Active</span>
          </div>
        </div>

        {/* Widget 4: Recognition Accuracy (Purple Gradient) */}
        <div className="p-5 rounded-3xl bg-gradient-to-br from-purple-50 to-violet-50/60 border border-purple-200/80 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between text-purple-900 text-xs font-bold mb-2">
            <span>System Accuracy</span>
            <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-xs">
              <Target className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black font-mono text-purple-900 tabular-nums">
            {avgConfidence}%
          </div>
          <div className="text-[11px] text-purple-700 font-semibold mt-1 flex items-center justify-between">
            <span>Euclidean Margin</span>
            <span className="font-mono font-bold">&lt; 0.38</span>
          </div>
        </div>

        {/* Widget 5: Total Scans (Sky / Cyan Gradient) */}
        <div className="p-5 rounded-3xl bg-gradient-to-br from-sky-50 to-cyan-50/60 border border-sky-200/80 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between text-sky-900 text-xs font-bold mb-2">
            <span>Total Face Scans</span>
            <div className="w-8 h-8 rounded-xl bg-sky-600 text-white flex items-center justify-center shadow-xs">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black font-mono text-sky-950 tabular-nums">
            {recognitionLogs.length}
          </div>
          <div className="text-[11px] text-sky-700 font-semibold mt-1 flex items-center justify-between">
            <span>Frame Rate</span>
            <span className="font-mono font-bold">30 FPS</span>
          </div>
        </div>

        {/* Widget 6: Camera Status (Amber / Orange Gradient) */}
        <div className="p-5 rounded-3xl bg-gradient-to-br from-amber-50 to-orange-50/60 border border-amber-200/80 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between text-amber-900 text-xs font-bold mb-2">
            <span>Optical Node</span>
            <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <div className="text-2xl font-black text-emerald-800 font-mono mt-1">
            ONLINE
          </div>
          <div className="text-[11px] text-amber-800 font-semibold mt-1 flex items-center justify-between">
            <span>CAM-01 [Main]</span>
            <span className="font-mono font-bold">1080p</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Live Terminal Showcase & Today's Attendance Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Live Vision Monitor Preview */}
        <div className="lg:col-span-2 rounded-3xl bg-white border border-slate-200/80 p-7 space-y-5 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
                <Camera className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900">Live Camera Recognition Feed</h2>
                <span className="text-[11px] font-mono text-slate-400">Node CAM-01 · 1920x1080 30 FPS</span>
              </div>
            </div>
            <button
              onClick={onNavigateToLive}
              className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800 cursor-pointer"
            >
              <span>Full Screen Scanner</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Interactive Live Stream Teaser Frame */}
          <div
            onClick={onNavigateToLive}
            className="group relative aspect-video bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 cursor-pointer flex items-center justify-center shadow-md"
          >
            {/* Grid overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#334155_1px,transparent_1px),linear-gradient(to_bottom,#334155_1px,transparent_1px)] bg-[size:32px_32px] opacity-30 pointer-events-none" />

            {/* Radar Sweep Effect */}
            <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-radar-sweep pointer-events-none" />

            {/* Simulated Bounding Box in Center */}
            <div className="relative z-10 w-44 h-56 border-2 border-cyan-400 rounded-xl flex flex-col justify-between p-2.5 shadow-[0_0_25px_rgba(6,182,212,0.3)] group-hover:scale-105 transition-transform duration-300">
              {/* Corner brackets */}
              <div className="absolute -top-1 -left-1 w-3.5 h-3.5 border-t-2 border-l-2 border-cyan-400" />
              <div className="absolute -top-1 -right-1 w-3.5 h-3.5 border-t-2 border-r-2 border-cyan-400" />
              <div className="absolute -bottom-1 -left-1 w-3.5 h-3.5 border-b-2 border-l-2 border-cyan-400" />
              <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 border-b-2 border-r-2 border-cyan-400" />

              <div className="flex items-center justify-between text-[10px] font-mono text-cyan-300 bg-black/60 px-2 py-0.5 rounded">
                <span>DETECTING</span>
                <span className="tabular-nums font-bold">98.4%</span>
              </div>
              <div className="text-center font-mono text-[11px] text-white bg-black/75 py-1.5 rounded">
                <div className="font-bold">Dr. Elena Rostova</div>
                <div className="text-[9px] text-emerald-400 font-bold">VERIFIED KNOWN</div>
              </div>
            </div>

            {/* Hover overlay hint */}
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
              <span className="px-5 py-2.5 rounded-xl bg-white/95 text-slate-900 text-xs font-bold border border-white shadow-xl backdrop-blur-sm group-hover:scale-105 transition-all">
                Click to Open Webcam Scanner
              </span>
            </div>

            {/* Bottom HUD metadata strip */}
            <div className="absolute bottom-3 inset-x-3 flex items-center justify-between text-[11px] font-mono text-slate-300 bg-black/75 px-4 py-2 rounded-xl backdrop-blur-md">
              <div className="flex items-center gap-3">
                <span className="text-cyan-400 font-bold">CAM-01 ACTIVE</span>
                <span>RES: 1920x1080</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-emerald-400 font-bold">EUCLIDEAN DIST: 0.18</span>
                <span>FPS: 30.0</span>
              </div>
            </div>
          </div>

          {/* Quick instructions strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70">
              <div className="text-slate-900 font-bold mb-0.5">1. Optical Positioning</div>
              <p className="text-[11px] text-slate-500">Stand 0.5m to 2.0m under ambient indoor lighting.</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70">
              <div className="text-slate-900 font-bold mb-0.5">2. Vector Matching</div>
              <p className="text-[11px] text-slate-500">128-D Euclidean distance computed in under 40ms.</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70">
              <div className="text-slate-900 font-bold mb-0.5">3. Cooldown Shield</div>
              <p className="text-[11px] text-slate-500">5-min cooldown stops duplicate check-in records.</p>
            </div>
          </div>
        </div>

        {/* Right Col: Today's Recent Scans & Activity Stream */}
        <div className="rounded-3xl bg-white border border-slate-200/80 p-7 flex flex-col justify-between space-y-5 shadow-xs">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <Clock className="w-4 h-4" />
                </div>
                <h2 className="text-sm font-bold text-slate-900">Live Activity Stream</h2>
              </div>
              <button
                onClick={onNavigateToAttendance}
                className="text-xs text-indigo-600 hover:text-indigo-800 font-bold cursor-pointer"
              >
                View Table
              </button>
            </div>

            <div className="space-y-3">
              {recognitionLogs.slice(0, 5).map((log) => (
                <div
                  key={log.id}
                  className="p-3 rounded-2xl bg-slate-50 border border-slate-200/70 flex items-center justify-between text-xs hover:border-slate-300 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={log.snapshotUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face'}
                      alt={log.personName}
                      className="w-10 h-10 rounded-xl object-cover border border-slate-200"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face';
                      }}
                    />
                    <div>
                      <div className="font-bold text-slate-900">{log.personName}</div>
                      <div className="text-[11px] text-slate-500 font-medium">{log.actionTaken}</div>
                      <div className="text-[10px] font-mono text-slate-400 mt-0.5">{log.timeStr}</div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span
                      className={`text-[10px] font-mono px-2.5 py-1 rounded-full font-bold ${
                        log.isUnknown
                          ? 'bg-rose-100 text-rose-700 border border-rose-200'
                          : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                      }`}
                    >
                      {log.confidence.toFixed(1)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Enrolled Faces Strip */}
          <div className="pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between mb-2.5 text-xs">
              <span className="text-slate-600 font-bold">Registered Personnel</span>
              <button
                onClick={onOpenEnroll}
                className="text-[11px] text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-1 cursor-pointer"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>+ Add Face</span>
              </button>
            </div>
            <div className="flex items-center -space-x-2 overflow-hidden">
              {registeredUsers.slice(0, 6).map((user) => (
                <img
                  key={user.id}
                  src={user.avatarUrl}
                  alt={user.name}
                  title={`${user.name} (${user.department})`}
                  className="inline-block h-9 w-9 rounded-full ring-2 ring-white object-cover cursor-pointer hover:scale-110 transition-transform shadow-xs"
                />
              ))}
              {registeredUsers.length > 6 && (
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-200 text-[10px] font-mono font-bold text-slate-700 ring-2 ring-white">
                  +{registeredUsers.length - 6}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
