import React, { useState, useMemo } from 'react';
import {
  Download,
  Search,
  History,
  ShieldAlert,
  UserCheck,
  UserPlus,
  Clock,
  Eye,
  Filter,
} from 'lucide-react';
import { RecognitionLog } from '../types';

interface HistoryViewProps {
  logs: RecognitionLog[];
  onExportCsv: () => void;
  onQuickEnrollUnknown: (snapshotUrl: string) => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  logs,
  onExportCsv,
  onQuickEnrollUnknown,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'All' | 'Known' | 'Unknown'>('All');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const matchesSearch =
        log.personName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.cameraId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.actionTaken.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesType =
        filterType === 'All'
          ? true
          : filterType === 'Known'
          ? !log.isUnknown
          : log.isUnknown;

      return matchesSearch && matchesType;
    });
  }, [logs, searchQuery, filterType]);

  const unknownCount = logs.filter((l) => l.isUnknown).length;
  const knownCount = logs.filter((l) => !l.isUnknown).length;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6 animate-fadeIn">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <History className="w-4 h-4 text-indigo-600" />
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-700">
              Module 04 &amp; 05 · Recognition History &amp; Snapshots
            </span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">
            Face Recognition Audit Log
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Timestamped facial recognition history with cropped snapshot evidence and unknown person intrusion store.
          </p>
        </div>

        <button
          onClick={onExportCsv}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-indigo-600 to-blue-600 text-white hover:shadow-md hover:shadow-indigo-500/20 active:scale-98 transition-all cursor-pointer whitespace-nowrap"
        >
          <Download className="w-4 h-4" />
          <span>Export history.csv</span>
        </button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-3xl bg-gradient-to-br from-indigo-50 to-blue-50/60 border border-indigo-200/80 shadow-xs">
          <span className="text-xs font-bold text-indigo-900">Total Scans Recorded</span>
          <div className="text-3xl font-black font-mono text-indigo-950 mt-1 tabular-nums">
            {logs.length}
          </div>
        </div>
        <div className="p-5 rounded-3xl bg-gradient-to-br from-emerald-50 to-teal-50/60 border border-emerald-200/80 shadow-xs">
          <span className="text-xs font-bold text-emerald-900">Verified Known Faces</span>
          <div className="text-3xl font-black font-mono text-emerald-800 mt-1 tabular-nums">
            {knownCount}
          </div>
        </div>
        <div className="p-5 rounded-3xl bg-gradient-to-br from-rose-50 to-pink-50/60 border border-rose-200/80 shadow-xs">
          <span className="text-xs font-bold text-rose-900">Unknown Intruder Captures</span>
          <div className="text-3xl font-black font-mono text-rose-700 mt-1 tabular-nums">
            {unknownCount}
          </div>
        </div>
      </div>

      {/* Filter and View toggles */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search recognition logs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:bg-white transition-all"
          />
        </div>

        {/* Filter Segmented Control & View Switcher */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          {/* Segmented Filter */}
          <div className="flex items-center p-1 bg-slate-100 rounded-xl text-xs font-bold">
            <button
              onClick={() => setFilterType('All')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                filterType === 'All' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              All ({logs.length})
            </button>
            <button
              onClick={() => setFilterType('Known')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                filterType === 'Known' ? 'bg-emerald-100 text-emerald-800 font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Known ({knownCount})
            </button>
            <button
              onClick={() => setFilterType('Unknown')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                filterType === 'Unknown' ? 'bg-rose-100 text-rose-800 font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Unknown ({unknownCount})
            </button>
          </div>

          {/* Grid vs Table View Toggle */}
          <div className="flex items-center p-1 bg-slate-100 rounded-xl text-xs font-bold">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                viewMode === 'grid' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-850'
              }`}
            >
              Cards
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                viewMode === 'table' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-850'
              }`}
            >
              Table
            </button>
          </div>
        </div>
      </div>

      {/* Snapshot Cards Grid View */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredLogs.length === 0 ? (
            <div className="col-span-full py-14 text-center text-slate-400 bg-white rounded-3xl border border-slate-200/80 shadow-xs">
              No recognition records found.
            </div>
          ) : (
            filteredLogs.map((log) => (
              <div
                key={log.id}
                className={`rounded-3xl border p-5 flex flex-col justify-between space-y-3.5 transition-all shadow-xs ${
                  log.isUnknown
                    ? 'bg-rose-50/60 border-rose-200 hover:border-rose-300'
                    : 'bg-white border-slate-200/80 hover:border-indigo-300'
                }`}
              >
                {/* Snapshot Image Container */}
                <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-xs">
                  <img
                    src={log.snapshotUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300&h=300&fit=crop&crop=face'}
                    alt={log.personName}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300&h=300&fit=crop&crop=face';
                    }}
                  />

                  {/* Corner Badge */}
                  <div className="absolute top-2.5 left-2.5">
                    <span
                      className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full shadow-xs ${
                        log.isUnknown
                          ? 'bg-rose-500 text-white'
                          : 'bg-emerald-500 text-white'
                      }`}
                    >
                      {log.isUnknown ? 'UNKNOWN' : 'VERIFIED'}
                    </span>
                  </div>

                  <div className="absolute top-2.5 right-2.5">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-black/75 text-white backdrop-blur-xs">
                      {log.confidence.toFixed(1)}%
                    </span>
                  </div>

                  <div className="absolute bottom-2 inset-x-2 bg-black/75 backdrop-blur-xs px-2.5 py-1 rounded-xl text-[10px] font-mono text-slate-200 flex items-center justify-between">
                    <span>{log.cameraId}</span>
                    <span>{log.timeStr}</span>
                  </div>
                </div>

                {/* Details */}
                <div>
                  <h3 className="font-bold text-sm text-slate-900 truncate">
                    {log.personName}
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-snug font-normal">
                    {log.actionTaken}
                  </p>
                  <div className="text-[10px] font-mono text-slate-400 mt-2 flex items-center justify-between">
                    <span>{log.dateStr}</span>
                    <span className="text-slate-600 font-bold">{log.department || 'External Visitor'}</span>
                  </div>
                </div>

                {/* Action for Unknown: Quick Enroll */}
                {log.isUnknown && (
                  <button
                    onClick={() => onQuickEnrollUnknown(log.snapshotUrl)}
                    className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-800 text-xs font-bold border border-rose-200 transition-colors cursor-pointer"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Enroll as Known User</span>
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      ) : (
        /* Table View */
        <div className="rounded-3xl bg-white border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-3.5 px-5">Snapshot</th>
                  <th className="py-3.5 px-5">Person / Identity</th>
                  <th className="py-3.5 px-5">Status</th>
                  <th className="py-3.5 px-5">Confidence</th>
                  <th className="py-3.5 px-5">Date &amp; Time</th>
                  <th className="py-3.5 px-5">Camera</th>
                  <th className="py-3.5 px-5">Action Logged</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-5">
                      <img
                        src={log.snapshotUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face'}
                        alt={log.personName}
                        className="w-10 h-10 rounded-xl object-cover border border-slate-200 shadow-xs"
                      />
                    </td>
                    <td className="py-3 px-5 font-bold text-slate-900">
                      {log.personName}
                    </td>
                    <td className="py-3 px-5">
                      <span
                        className={`text-[10px] font-mono px-2.5 py-1 rounded-full font-bold ${
                          log.isUnknown
                            ? 'bg-rose-100 text-rose-800 border border-rose-200'
                            : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        }`}
                      >
                        {log.isUnknown ? 'UNKNOWN' : 'KNOWN'}
                      </span>
                    </td>
                    <td className="py-3 px-5 font-mono font-bold text-indigo-600 tabular-nums">
                      {log.confidence.toFixed(1)}%
                    </td>
                    <td className="py-3 px-5 font-mono text-slate-500">
                      {log.dateStr} {log.timeStr}
                    </td>
                    <td className="py-3 px-5 font-mono text-slate-600">
                      {log.cameraId}
                    </td>
                    <td className="py-3 px-5 text-slate-600">
                      {log.actionTaken}
                    </td>
                    <td className="py-3 px-5 text-right">
                      {log.isUnknown ? (
                        <button
                          onClick={() => onQuickEnrollUnknown(log.snapshotUrl)}
                          className="px-3 py-1.5 rounded-xl bg-rose-100 text-rose-800 hover:bg-rose-200 text-xs font-bold border border-rose-200 cursor-pointer"
                        >
                          Enroll Face
                        </button>
                      ) : (
                        <span className="text-[11px] text-slate-400 font-mono">Archived</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
