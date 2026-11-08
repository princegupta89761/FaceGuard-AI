import React from 'react';
import {
  Bell,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  X,
  Radio,
  Camera,
  ExternalLink,
} from 'lucide-react';
import { SecurityAlert, VisitorRecord } from '../types';

interface NotificationPanelProps {
  alerts: SecurityAlert[];
  visitors: VisitorRecord[];
  isOpen: boolean;
  onClose: () => void;
  onNavigateToSecurity: () => void;
  onNavigateToVisitors: () => void;
}

export const NotificationPanel: React.FC<NotificationPanelProps> = ({
  alerts,
  visitors,
  isOpen,
  onClose,
  onNavigateToSecurity,
  onNavigateToVisitors,
}) => {
  if (!isOpen) return null;

  const unresolvedAlerts = alerts.filter((a) => !a.resolved);
  const activeVisitors = visitors.filter((v) => v.status === 'Checked In');

  return (
    <aside className="w-80 bg-white border-l border-slate-200/80 flex flex-col justify-between shrink-0 select-none h-full overflow-hidden animate-fadeIn shadow-xl">
      {/* Panel Header */}
      <div className="p-4 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center">
            <Bell className="w-4 h-4" />
          </div>
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Sentinel Monitor
          </h2>
          {unresolvedAlerts.length > 0 && (
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-500 text-white font-bold">
              {unresolvedAlerts.length}
            </span>
          )}
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Main Content Feeds */}
      <div className="p-4 space-y-5 flex-1 overflow-y-auto">
        {/* Threat Condition Box */}
        <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200/70 space-y-1.5">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-emerald-900 font-bold">STATUS:</span>
            <span className="text-emerald-700 font-black flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              ARMED / ACTIVE
            </span>
          </div>
          <div className="text-[11px] text-emerald-800 leading-snug font-normal">
            All 4 edge camera nodes transmitting 1080p telemetry with zero frame drops.
          </div>
        </div>

        {/* Security Alerts Section */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-bold uppercase tracking-wider text-[11px]">
              Sentinel Incidents
            </span>
            <button
              onClick={onNavigateToSecurity}
              className="text-indigo-600 hover:text-indigo-800 font-bold text-[11px] cursor-pointer"
            >
              All Alerts
            </button>
          </div>

          {unresolvedAlerts.length === 0 ? (
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-center text-xs text-slate-500">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
              No active security incidents flagged.
            </div>
          ) : (
            unresolvedAlerts.slice(0, 4).map((alert) => (
              <div
                key={alert.id}
                className={`p-3 rounded-2xl border text-xs space-y-1.5 transition-all ${
                  alert.severity === 'critical'
                    ? 'bg-rose-50/70 border-rose-200 text-rose-900'
                    : 'bg-amber-50/70 border-amber-200 text-amber-900'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold flex items-center gap-1.5">
                    <ShieldAlert
                      className={`w-3.5 h-3.5 ${
                        alert.severity === 'critical' ? 'text-rose-600' : 'text-amber-600'
                      }`}
                    />
                    <span className="truncate">{alert.type}</span>
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">{alert.timeStr}</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-snug line-clamp-2 font-normal">
                  {alert.details}
                </p>
              </div>
            ))
          )}
        </div>

        {/* Active Visitors Onsite */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-bold uppercase tracking-wider text-[11px]">
              Active Guests Onsite
            </span>
            <button
              onClick={onNavigateToVisitors}
              className="text-amber-600 hover:text-amber-800 font-bold text-[11px] cursor-pointer"
            >
              View VMS
            </button>
          </div>

          <div className="space-y-2">
            {activeVisitors.slice(0, 3).map((v) => (
              <div
                key={v.id}
                className="p-2.5 rounded-2xl bg-slate-50 border border-slate-200/70 flex items-center justify-between text-xs hover:border-slate-300 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <img
                    src={v.snapshotUrl}
                    alt={v.name}
                    className="w-8 h-8 rounded-full object-cover border border-slate-200"
                  />
                  <div>
                    <div className="font-bold text-slate-900 text-[11px]">{v.name}</div>
                    <div className="text-[10px] text-slate-500">{v.company}</div>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-200">
                  {v.visitorId}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer System Diagnostics */}
      <div className="p-4 border-t border-slate-100 text-[11px] font-mono text-slate-500 space-y-1 bg-slate-50/50">
        <div className="flex justify-between">
          <span>ENCRYPTION:</span>
          <span className="text-slate-900 font-bold">AES-256</span>
        </div>
        <div className="flex justify-between">
          <span>LATENCY:</span>
          <span className="text-emerald-600 font-bold">32.4 MS</span>
        </div>
      </div>
    </aside>
  );
};
