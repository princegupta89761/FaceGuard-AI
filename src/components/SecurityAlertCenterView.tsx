import React, { useState } from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Send,
  Mail,
  UserX,
  Radio,
  Clock,
  ShieldCheck,
  FileWarning,
  X,
} from 'lucide-react';
import { EmailIncident, SecurityAlert } from '../types';
import { playSuccessBeep } from '../utils/audio';

interface SecurityAlertCenterViewProps {
  alerts: SecurityAlert[];
  emailIncidents: EmailIncident[];
  onResolveAlert: (alertId: string) => void;
  onSendEmailAlert: (incident: EmailIncident) => void;
  adminEmail: string;
}

export const SecurityAlertCenterView: React.FC<SecurityAlertCenterViewProps> = ({
  alerts,
  emailIncidents,
  onResolveAlert,
  onSendEmailAlert,
  adminEmail,
}) => {
  const [selectedAlertForEmail, setSelectedAlertForEmail] = useState<SecurityAlert | null>(null);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailDetails, setEmailDetails] = useState('');
  const [dispatchedGuardToast, setDispatchedGuardToast] = useState<string | null>(null);

  const unresolvedAlerts = alerts.filter((a) => !a.resolved);
  const criticalCount = alerts.filter((a) => a.severity === 'critical' && !a.resolved).length;

  const currentThreatLevel =
    criticalCount > 0 ? 'CRITICAL THREAT' : unresolvedAlerts.length > 2 ? 'ELEVATED' : 'NORMAL';

  const handleOpenEmailModal = (alert: SecurityAlert) => {
    setSelectedAlertForEmail(alert);
    setEmailSubject(`[SECURITY ALERT] ${alert.type} Flagged at CAM-01`);
    setEmailDetails(alert.details);
  };

  const handleDispatchEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAlertForEmail) return;

    playSuccessBeep();
    const newIncident: EmailIncident = {
      id: `inc-${Date.now()}`,
      timestamp: Date.now(),
      timeStr: new Date().toLocaleTimeString(),
      recipient: adminEmail,
      subject: emailSubject,
      threatLevel: selectedAlertForEmail.severity,
      personSnapshot: selectedAlertForEmail.snapshotUrl,
      status: 'Delivered',
      details: emailDetails,
    };

    onSendEmailAlert(newIncident);
    setSelectedAlertForEmail(null);
  };

  const handleDispatchGuard = (alertId: string) => {
    playSuccessBeep();
    setDispatchedGuardToast(`Security Team Dispatched to Camera Node for incident ${alertId}!`);
    setTimeout(() => setDispatchedGuardToast(null), 3500);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6 animate-fadeIn">
      {/* Toast */}
      {dispatchedGuardToast && (
        <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-900 text-xs font-bold flex items-center gap-2 shadow-md">
          <Radio className="w-4 h-4 text-indigo-600 animate-pulse" />
          <span>{dispatchedGuardToast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ShieldAlert className="w-4 h-4 text-rose-600" />
            <span className="text-xs font-bold uppercase tracking-wider text-rose-700">
              Module 06 · Security Sentinel Command
            </span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">
            AI Security Alert Center
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time intrusion monitoring, anti-spoofing defense triggers, automated security incidents, and guard dispatch.
          </p>
        </div>

        {/* Threat Level Badge */}
        <div className="flex items-center gap-3">
          <div
            className={`px-4 py-2 rounded-2xl border flex items-center gap-2.5 font-mono text-xs font-bold shadow-xs ${
              currentThreatLevel === 'CRITICAL THREAT'
                ? 'bg-rose-100 text-rose-800 border-rose-300 animate-pulse'
                : currentThreatLevel === 'ELEVATED'
                ? 'bg-amber-100 text-amber-800 border-amber-300'
                : 'bg-emerald-100 text-emerald-800 border-emerald-300'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-current animate-ping" />
            <span>THREAT LEVEL: {currentThreatLevel}</span>
          </div>
        </div>
      </div>

      {/* Threat Summary Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-gradient-to-br from-rose-50 to-pink-50/60 border border-rose-200/80 shadow-xs">
          <span className="text-xs font-bold text-rose-900">Active Unresolved Alerts</span>
          <div className="text-3xl font-black font-mono text-rose-700 mt-1 tabular-nums">
            {unresolvedAlerts.length}
          </div>
          <div className="text-[11px] text-rose-600 mt-1 font-semibold">Immediate attention required</div>
        </div>

        <div className="p-5 rounded-3xl bg-gradient-to-br from-emerald-50 to-teal-50/60 border border-emerald-200/80 shadow-xs">
          <span className="text-xs font-bold text-emerald-900">Spoof Attacks Intercepted</span>
          <div className="text-3xl font-black font-mono text-emerald-800 mt-1 tabular-nums">
            {alerts.filter((a) => a.type === 'Spoof Attack Attempt').length}
          </div>
          <div className="text-[11px] text-emerald-600 mt-1 font-bold font-mono">100% neutralized</div>
        </div>

        <div className="p-5 rounded-3xl bg-gradient-to-br from-amber-50 to-orange-50/60 border border-amber-200/80 shadow-xs">
          <span className="text-xs font-bold text-amber-900">Total Security Incidents</span>
          <div className="text-3xl font-black font-mono text-amber-950 mt-1 tabular-nums">
            {alerts.length}
          </div>
          <div className="text-[11px] text-amber-700 mt-1 font-semibold">Across all camera nodes</div>
        </div>

        <div className="p-5 rounded-3xl bg-gradient-to-br from-sky-50 to-blue-50/60 border border-sky-200/80 shadow-xs">
          <span className="text-xs font-bold text-sky-900">Email Dispatches Delivered</span>
          <div className="text-3xl font-black font-mono text-sky-700 mt-1 tabular-nums">
            {emailIncidents.length}
          </div>
          <div className="text-[11px] text-sky-600 mt-1 font-semibold">SMTP Server Connected</div>
        </div>
      </div>

      {/* Security Incidents Table */}
      <div className="rounded-3xl bg-white border border-slate-200/80 shadow-xs p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h2 className="text-sm font-bold text-slate-900">Live Incident Log &amp; Triage</h2>
          <span className="text-xs font-mono text-slate-400 font-bold">Real-Time Threat Stream</span>
        </div>

        <div className="space-y-3">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-4 rounded-2xl border flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all ${
                alert.resolved
                  ? 'bg-slate-50 border-slate-200/80 opacity-60'
                  : alert.severity === 'critical'
                  ? 'bg-rose-50/70 border-rose-200'
                  : 'bg-white border-slate-200/80 shadow-xs'
              }`}
            >
              <div className="flex items-start gap-3.5">
                {alert.snapshotUrl ? (
                  <img
                    src={alert.snapshotUrl}
                    alt={alert.type}
                    className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0 shadow-xs"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-rose-100 flex items-center justify-center text-rose-600 shrink-0">
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                )}

                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900">{alert.type}</span>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                        alert.severity === 'critical'
                          ? 'bg-rose-500 text-white'
                          : alert.severity === 'high'
                          ? 'bg-amber-500 text-white'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {alert.severity.toUpperCase()}
                    </span>
                    {alert.resolved && (
                      <span className="text-[10px] text-emerald-700 font-mono font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Resolved
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 mt-1 font-normal">{alert.details}</p>
                  <div className="text-[10px] font-mono text-slate-400 mt-1">
                    Logged: {alert.dateStr} · {alert.timeStr}
                    {alert.resolvedBy && ` · Resolved by: ${alert.resolvedBy}`}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0">
                {!alert.resolved && (
                  <>
                    <button
                      onClick={() => handleDispatchGuard(alert.id)}
                      className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors cursor-pointer"
                    >
                      Dispatch Guard
                    </button>
                    <button
                      onClick={() => handleOpenEmailModal(alert)}
                      className="px-3.5 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold border border-indigo-200 transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>Email Incident</span>
                    </button>
                    <button
                      onClick={() => onResolveAlert(alert.id)}
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold border border-emerald-200 transition-colors cursor-pointer"
                    >
                      Resolve
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Email Alert Dispatch History */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4">
        <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Mail className="w-4 h-4 text-indigo-600" />
          <span>Email Alert Dispatch Audit Log</span>
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Subject</th>
                <th className="py-3 px-4">Recipient</th>
                <th className="py-3 px-4">Severity</th>
                <th className="py-3 px-4">Time</th>
                <th className="py-3 px-4 text-right">Delivery Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {emailIncidents.map((inc) => (
                <tr key={inc.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-900">{inc.subject}</td>
                  <td className="py-3 px-4 font-mono text-slate-600">{inc.recipient}</td>
                  <td className="py-3 px-4 font-mono font-bold text-rose-600">{inc.threatLevel.toUpperCase()}</td>
                  <td className="py-3 px-4 font-mono text-slate-500">{inc.timeStr}</td>
                  <td className="py-3 px-4 text-right">
                    <span className="text-[10px] font-mono px-2.5 py-1 rounded-full font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                      {inc.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Email Alert Modal */}
      {selectedAlertForEmail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fadeIn">
          <div className="relative w-full max-w-lg rounded-3xl bg-white border border-slate-200 p-7 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center">
                  <Mail className="w-4 h-4" />
                </div>
                <span>Dispatch Incident Alert to Security Admin</span>
              </h2>
              <button
                onClick={() => setSelectedAlertForEmail(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleDispatchEmail} className="space-y-3.5 text-xs">
              <div>
                <label className="text-slate-700 font-bold block mb-1">To: Recipient</label>
                <input
                  type="email"
                  disabled
                  value={adminEmail}
                  className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-600 font-mono"
                />
              </div>

              <div>
                <label className="text-slate-700 font-bold block mb-1">Subject</label>
                <input
                  type="text"
                  required
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 focus:outline-none focus:border-indigo-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="text-slate-700 font-bold block mb-1">Incident Report Body</label>
                <textarea
                  rows={4}
                  required
                  value={emailDetails}
                  onChange={(e) => setEmailDetails(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-slate-800 focus:outline-none focus:border-indigo-600 focus:bg-white"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setSelectedAlertForEmail(null)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:text-slate-900 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold hover:shadow-md cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Transmit Security Alert</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
