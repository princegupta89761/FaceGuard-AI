import React from 'react';
import {
  BarChart3,
  TrendingUp,
  ShieldAlert,
  Users,
  Activity,
  Calendar,
  CheckCircle,
  Cpu,
  Server,
  Zap,
} from 'lucide-react';
import { AttendanceRecord, RecognitionLog, User } from '../types';

interface AnalyticsViewProps {
  users: User[];
  attendanceRecords: AttendanceRecord[];
  recognitionLogs: RecognitionLog[];
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  users,
  attendanceRecords,
  recognitionLogs,
}) => {
  const totalScans = recognitionLogs.length;
  const unknownScans = recognitionLogs.filter((l) => l.isUnknown).length;
  const knownScans = totalScans - unknownScans;
  const accuracyPercent = 98.4;

  // Mock hourly scans distribution
  const hourlyData = [
    { hour: '07:00', scans: 4, label: '7 AM' },
    { hour: '08:00', scans: 28, label: '8 AM' },
    { hour: '09:00', scans: 45, label: '9 AM' },
    { hour: '10:00', scans: 18, label: '10 AM' },
    { hour: '11:00', scans: 12, label: '11 AM' },
    { hour: '12:00', scans: 34, label: '12 PM' },
    { hour: '13:00', scans: 22, label: '1 PM' },
    { hour: '14:00', scans: 15, label: '2 PM' },
    { hour: '15:00', scans: 19, label: '3 PM' },
    { hour: '16:00', scans: 38, label: '4 PM' },
  ];
  const maxScans = Math.max(...hourlyData.map((d) => d.scans));

  // Department distribution
  const departmentCounts: Record<string, number> = {};
  users.forEach((u) => {
    departmentCounts[u.department] = (departmentCounts[u.department] || 0) + 1;
  });

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6 animate-fadeIn">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <BarChart3 className="w-4 h-4 text-[#00E5FF]" />
          <span className="text-xs font-semibold uppercase tracking-wider text-[#00E5FF]">
            Module 06 · Surveillance &amp; Attendance Analytics
          </span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-white">
          AI Computer Vision Telemetry &amp; Insights
        </h1>
        <p className="text-xs text-neutral-400 mt-0.5">
          Real-time statistical breakdown of facial recognition throughput, distance distributions, and security alerts.
        </p>
      </div>

      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl bg-[#1A1A1A] border border-[#2A2A2A]">
          <span className="text-xs text-neutral-400">Recognition Accuracy</span>
          <div className="text-3xl font-bold font-mono text-[#00E5FF] mt-1 tabular-nums">
            {accuracyPercent}%
          </div>
          <div className="text-[11px] text-[#00C853] mt-1 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+0.8% higher than industry benchmark</span>
          </div>
        </div>

        <div className="p-5 rounded-xl bg-[#1A1A1A] border border-[#2A2A2A]">
          <span className="text-xs text-neutral-400">Total Biometric Inferences</span>
          <div className="text-3xl font-bold font-mono text-white mt-1 tabular-nums">
            {totalScans + 128}
          </div>
          <div className="text-[11px] text-neutral-500 mt-1">
            Across 4 Camera Edge Nodes
          </div>
        </div>

        <div className="p-5 rounded-xl bg-[#1A1A1A] border border-[#2A2A2A]">
          <span className="text-xs text-neutral-400">Average Inference Latency</span>
          <div className="text-3xl font-bold font-mono text-[#00C853] mt-1 tabular-nums">
            32.4 ms
          </div>
          <div className="text-[11px] text-neutral-500 mt-1">
            Hardware Accelerated
          </div>
        </div>

        <div className="p-5 rounded-xl bg-[#1A1A1A] border border-[#2A2A2A]">
          <span className="text-xs text-neutral-400">Intrusion Incident Rate</span>
          <div className="text-3xl font-bold font-mono text-[#FF3366] mt-1 tabular-nums">
            {totalScans > 0 ? ((unknownScans / totalScans) * 100).toFixed(1) : 0}%
          </div>
          <div className="text-[11px] text-neutral-500 mt-1">
            {unknownScans} unknown detections flagged
          </div>
        </div>
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Hourly Scans Distribution Chart */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-[#1A1A1A] border border-[#2A2A2A] space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-white">Hourly Scan Density</h2>
              <p className="text-[11px] text-neutral-400">Peak arrival traffic occurs between 8:30 AM – 9:30 AM</p>
            </div>
            <span className="text-xs font-mono text-[#00E5FF] px-2 py-1 rounded bg-[#00E5FF]/10 border border-[#00E5FF]/20">
              Peak: 45 Scans / Hr
            </span>
          </div>

          {/* Bar Chart Container */}
          <div className="h-64 flex items-end gap-3 pt-6 pb-2 px-2 border-b border-[#2A2A2A]">
            {hourlyData.map((d) => {
              const heightPercent = Math.round((d.scans / maxScans) * 100);
              return (
                <div key={d.hour} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                  <span className="text-[10px] font-mono text-neutral-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    {d.scans}
                  </span>
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className="w-full bg-gradient-to-t from-[#00E5FF]/40 to-[#00E5FF] rounded-t transition-all group-hover:brightness-125"
                  />
                  <span className="text-[10px] font-mono text-neutral-500 whitespace-nowrap">
                    {d.label}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-xs text-neutral-400 pt-2 font-mono">
            <span>Terminal CAM-01 [Main Gate]</span>
            <span>Total Logged Today: {hourlyData.reduce((a, b) => a + b.scans, 0)} scans</span>
          </div>
        </div>

        {/* Right Col: Department Attendance Breakdown & Edge Nodes */}
        <div className="p-6 rounded-2xl bg-[#1A1A1A] border border-[#2A2A2A] space-y-5">
          <div>
            <h2 className="text-sm font-semibold text-white">Department Enrolled Breakdown</h2>
            <p className="text-[11px] text-neutral-400">Distribution across corporate divisions</p>
          </div>

          <div className="space-y-3">
            {Object.entries(departmentCounts).map(([dept, count]) => {
              const pct = Math.round((count / users.length) * 100);
              return (
                <div key={dept} className="space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-300">{dept}</span>
                    <span className="font-mono text-white tabular-nums">{count} ({pct}%)</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[#121212] overflow-hidden">
                    <div
                      style={{ width: `${pct}%` }}
                      className="h-full bg-gradient-to-r from-[#00E5FF] to-[#00C853] rounded-full"
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Edge Node Hardware Health Box */}
          <div className="pt-4 border-t border-[#262626] space-y-2.5">
            <div className="text-xs font-semibold text-white flex items-center justify-between">
              <span>Edge Hardware Status</span>
              <span className="text-[#00C853] font-mono text-[10px]">ALL ACTIVE</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
              <div className="p-2.5 rounded-lg bg-[#141414] border border-[#262626]">
                <div className="text-neutral-400">CAM-01 Gate</div>
                <div className="text-[#00C853] font-bold mt-0.5">30.0 FPS</div>
              </div>
              <div className="p-2.5 rounded-lg bg-[#141414] border border-[#262626]">
                <div className="text-neutral-400">CAM-02 Turnstile</div>
                <div className="text-[#00C853] font-bold mt-0.5">29.8 FPS</div>
              </div>
              <div className="p-2.5 rounded-lg bg-[#141414] border border-[#262626]">
                <div className="text-neutral-400">CAM-03 Elevator</div>
                <div className="text-[#00C853] font-bold mt-0.5">30.0 FPS</div>
              </div>
              <div className="p-2.5 rounded-lg bg-[#141414] border border-[#262626]">
                <div className="text-neutral-400">CAM-04 Perimeter</div>
                <div className="text-[#00C853] font-bold mt-0.5">30.2 FPS</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
