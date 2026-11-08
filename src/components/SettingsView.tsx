import React, { useState } from 'react';
import {
  Settings,
  Sliders,
  Volume2,
  VolumeX,
  ShieldAlert,
  Camera,
  Mail,
  RotateCcw,
  Check,
  Save,
} from 'lucide-react';
import { SystemSettings } from '../types';

interface SettingsViewProps {
  settings: SystemSettings;
  onUpdateSettings: (newSettings: Partial<SystemSettings>) => void;
  onResetDemoData: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  onUpdateSettings,
  onResetDemoData,
}) => {
  const [localSettings, setLocalSettings] = useState<SystemSettings>(settings);
  const [savedToast, setSavedToast] = useState(false);

  const handleSave = () => {
    onUpdateSettings(localSettings);
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2000);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Settings className="w-4 h-4 text-indigo-600" />
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-700">
              System Configuration
            </span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">
            FaceGuard AI System Parameters
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure biometric thresholds, attendance duplicate suppression, security alerts, and video feed options.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-md hover:shadow-indigo-500/20 active:scale-98 transition-all cursor-pointer shadow-xs"
        >
          {savedToast ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          <span>{savedToast ? 'Settings Saved' : 'Save Changes'}</span>
        </button>
      </div>

      {/* Main Settings Sections */}
      <div className="space-y-6">
        {/* Section 1: Biometric Recognition Thresholds */}
        <div className="p-7 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Biometric Confidence Threshold</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Minimum similarity score required to mark a face as "Known". Faces below this threshold are flagged as "Unknown".
              </p>
            </div>
            <span className="text-lg font-mono font-black text-indigo-600">
              {localSettings.confidenceThreshold}%
            </span>
          </div>

          <div className="space-y-2">
            <input
              type="range"
              min="50"
              max="95"
              step="1"
              value={localSettings.confidenceThreshold}
              onChange={(e) =>
                setLocalSettings({ ...localSettings, confidenceThreshold: Number(e.target.value) })
              }
              className="w-full accent-indigo-600 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] font-mono text-slate-400">
              <span>50% (Permissive / High Recall)</span>
              <span>72% (Recommended Enterprise Default)</span>
              <span>95% (Strict / High Precision)</span>
            </div>
          </div>
        </div>

        {/* Section 2: Attendance Duplicate Cooldown */}
        <div className="p-7 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Duplicate Attendance Cooldown</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Suppresses repeated attendance marks when a registered person stands in front of the camera.
              </p>
            </div>
            <span className="text-lg font-mono font-black text-emerald-600">
              {localSettings.duplicateCooldownMinutes} min
            </span>
          </div>

          <div className="space-y-2">
            <input
              type="range"
              min="1"
              max="30"
              step="1"
              value={localSettings.duplicateCooldownMinutes}
              onChange={(e) =>
                setLocalSettings({ ...localSettings, duplicateCooldownMinutes: Number(e.target.value) })
              }
              className="w-full accent-emerald-600 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] font-mono text-slate-400">
              <span>1 Minute</span>
              <span>5 Minutes (Standard)</span>
              <span>30 Minutes</span>
            </div>
          </div>
        </div>

        {/* Section 3: Audio & Snapshot Alerts */}
        <div className="p-7 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 pb-3 border-b border-slate-100">
            Audio &amp; Snapshot Behavior
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Audio Toggle */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-slate-900">Audio Feedback Cues</div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Plays success chimes on match and security pulses on unknown.
                </div>
              </div>
              <input
                type="checkbox"
                checked={localSettings.soundEnabled}
                onChange={(e) =>
                  setLocalSettings({ ...localSettings, soundEnabled: e.target.checked })
                }
                className="w-5 h-5 accent-indigo-600 cursor-pointer rounded"
              />
            </div>

            {/* Auto Snapshot Unknown */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-slate-900">Auto-Capture Unknowns</div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Saves face crop into unknown_faces/ directory on intrusion.
                </div>
              </div>
              <input
                type="checkbox"
                checked={localSettings.autoSnapshotUnknown}
                onChange={(e) =>
                  setLocalSettings({ ...localSettings, autoSnapshotUnknown: e.target.checked })
                }
                className="w-5 h-5 accent-indigo-600 cursor-pointer rounded"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Security Notification Dispatch */}
        <div className="p-7 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 pb-3 border-b border-slate-100">
            Security Alert Dispatch Email
          </h2>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-600">Security Officer Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={localSettings.alertEmail}
                onChange={(e) => setLocalSettings({ ...localSettings, alertEmail: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-600 focus:bg-white"
              />
            </div>
          </div>
        </div>

        {/* Section 5: Reset Demo Data */}
        <div className="p-7 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Reset Demo Pipeline Data</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Restores initial 6 sample employees, resets today's attendance logs, and clears unknown intruder snapshots.
            </p>
          </div>
          <button
            onClick={onResetDemoData}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer whitespace-nowrap"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Data</span>
          </button>
        </div>
      </div>
    </div>
  );
};
