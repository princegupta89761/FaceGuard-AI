import React from 'react';
import {
  Shield,
  Camera,
  Volume2,
  VolumeX,
  UserPlus,
  Radio,
  Mic,
  MicOff,
  UserCheck,
  Bell,
  LogOut,
  Sparkles,
  ChevronDown,
} from 'lucide-react';
import { ActiveScreen, RoleType, SystemSettings } from '../types';

interface HeaderProps {
  activeScreen: ActiveScreen;
  onNavigate: (screen: ActiveScreen) => void;
  settings: SystemSettings;
  onUpdateSettings: (newSettings: Partial<SystemSettings>) => void;
  onOpenEnroll: () => void;
  fps: number;
  cameraActive: boolean;
  isListening: boolean;
  onToggleVoice: () => void;
  activeVoiceCommand: string | null;
  activeRole: RoleType;
  onChangeRole: (role: RoleType) => void;
  onLogout: () => void;
  onOpenFeatures: () => void;
  onToggleNotifications: () => void;
  isNotificationsOpen: boolean;
  unreadAlertCount: number;
  userName: string;
}

export const Header: React.FC<HeaderProps> = ({
  activeScreen,
  onNavigate,
  settings,
  onUpdateSettings,
  onOpenEnroll,
  fps,
  cameraActive,
  isListening,
  onToggleVoice,
  activeVoiceCommand,
  activeRole,
  onChangeRole,
  onLogout,
  onOpenFeatures,
  onToggleNotifications,
  isNotificationsOpen,
  unreadAlertCount,
  userName,
}) => {
  return (
    <header className="flex items-center justify-between gap-6 px-6 py-3.5 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shrink-0 sticky top-0 z-30 shadow-xs">
      {/* Zone 1: Brand wordmark & Title */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
          <Shield className="w-5 h-5" />
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="text-base font-black tracking-tight text-slate-900 whitespace-nowrap">
              FaceGuard AI
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
              v2.4
            </span>
          </div>
          <span className="text-[11px] text-slate-500 hidden sm:inline font-medium">
            Biometric Recognition &amp; Security Intelligence
          </span>
        </div>
      </div>

      {/* Zone 2: Telemetry & Quick Toggles */}
      <div className="hidden lg:flex items-center gap-5 text-xs text-slate-600 font-medium">
        <div className="flex items-center gap-2 font-mono">
          <span className="flex h-2 w-2 relative">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${cameraActive ? 'bg-emerald-400 opacity-75' : 'bg-amber-400 opacity-75'}`}></span>
            <span className={`relative inline-flex rounded-full h-2 w-2 ${cameraActive ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
          </span>
          <span className="text-slate-400">NODE:</span>
          <span className="text-slate-900 font-bold">CAM-01 [Main Gate]</span>
          <span className="text-slate-300">|</span>
          <span className="text-slate-400">FPS:</span>
          <span className="text-indigo-600 font-bold tabular-nums">{cameraActive ? `${fps} FPS` : 'STANDBY'}</span>
        </div>

        <div className="h-4 w-[1px] bg-slate-200" />

        {/* Voice Assistant Mic Button */}
        <button
          onClick={onToggleVoice}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
            isListening
              ? 'bg-purple-100 text-purple-700 border-purple-300 shadow-sm animate-pulse'
              : 'bg-slate-50 text-slate-600 border-slate-200 hover:text-slate-900 hover:border-slate-300'
          }`}
          title="Toggle Hands-Free Voice Assistant ('Start Camera', 'Register User', etc.)"
        >
          {isListening ? <Mic className="w-3.5 h-3.5 text-purple-600" /> : <MicOff className="w-3.5 h-3.5 text-slate-400" />}
          <span>{isListening ? 'Voice Active' : 'Voice Assistant'}</span>
        </button>

        {activeVoiceCommand && (
          <span className="text-[11px] font-mono font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-200 truncate max-w-[140px]">
            &quot;{activeVoiceCommand}&quot;
          </span>
        )}

        <div className="h-4 w-[1px] bg-slate-200" />

        {/* Audio Toggle */}
        <button
          onClick={() => onUpdateSettings({ soundEnabled: !settings.soundEnabled })}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
            settings.soundEnabled
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
              : 'bg-slate-50 text-slate-600 border-slate-200 hover:text-slate-900'
          }`}
          title={settings.soundEnabled ? 'Mute audio cues' : 'Enable audio cues'}
        >
          {settings.soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-emerald-600" /> : <VolumeX className="w-3.5 h-3.5 text-slate-400" />}
          <span>{settings.soundEnabled ? 'Audio On' : 'Muted'}</span>
        </button>

        {/* Features Hub Jump */}
        <button
          onClick={onOpenFeatures}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border bg-slate-50 text-slate-700 border-slate-200 hover:border-indigo-300 hover:text-indigo-600 cursor-pointer shadow-xs"
          title="Return to 10-Module Features Hub & Onboarding"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Module Hub</span>
        </button>

        {/* Role Switcher */}
        <div className="flex items-center gap-1.5 text-xs">
          <span className="text-slate-400 font-semibold">Role:</span>
          <select
            value={activeRole}
            onChange={(e) => onChangeRole(e.target.value as RoleType)}
            className="bg-slate-50 border border-slate-200 text-slate-800 font-bold text-[11px] rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-indigo-600 cursor-pointer"
          >
            <option value="Security Administrator">Admin</option>
            <option value="Chief Security Officer">Security Chief</option>
            <option value="HR Director">HR Director</option>
            <option value="Kiosk Terminal">Kiosk Mode</option>
          </select>
        </div>
      </div>

      {/* Zone 3: Actions, Sentinel Bell, Enroll & Logout */}
      <div className="flex items-center gap-2.5 shrink-0">
        {/* Notification Bell */}
        <button
          onClick={onToggleNotifications}
          className={`relative p-2.5 rounded-xl border transition-all cursor-pointer ${
            isNotificationsOpen
              ? 'bg-rose-50 text-rose-600 border-rose-200 shadow-sm'
              : 'bg-slate-50 text-slate-600 border-slate-200 hover:text-slate-900 hover:border-slate-300'
          }`}
          title="Toggle Sentinel Notifications Panel"
        >
          <Bell className="w-4 h-4" />
          {unreadAlertCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white font-mono text-[9px] flex items-center justify-center font-bold shadow-xs">
              {unreadAlertCount}
            </span>
          )}
        </button>

        {/* Enroll Button */}
        <button
          onClick={onOpenEnroll}
          className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 hover:shadow-md hover:shadow-indigo-500/20 active:scale-98 rounded-xl transition-all whitespace-nowrap cursor-pointer"
        >
          <UserPlus className="w-4 h-4 text-white" />
          <span>Enroll Face</span>
        </button>

        {/* Logout Button */}
        <button
          onClick={onLogout}
          className="p-2.5 rounded-xl bg-slate-50 hover:bg-rose-50 text-slate-500 hover:text-rose-600 border border-slate-200 hover:border-rose-200 transition-colors cursor-pointer"
          title={`Sign out of ${userName} and return to Landing Page`}
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
