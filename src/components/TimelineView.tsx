import React, { useState, useMemo } from 'react';
import {
  History,
  Search,
  Filter,
  Download,
  ShieldAlert,
  UserCheck,
  Calendar,
  Clock,
  Sparkles,
  Camera,
  ArrowUpDown,
} from 'lucide-react';
import { RecognitionLog } from '../types';
import { downloadCsvFile } from '../utils/exportCsv';

interface TimelineViewProps {
  logs: RecognitionLog[];
}

export const TimelineView: React.FC<TimelineViewProps> = ({ logs }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<'All' | 'Known' | 'Unknown'>('All');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');

  const filteredLogs = useMemo(() => {
    return logs
      .filter((l) => {
        const matchSearch =
          l.personName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          l.cameraId.toLowerCase().includes(searchQuery.toLowerCase()) ||
          l.actionTaken.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (l.emotion && l.emotion.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchStatus =
          selectedStatus === 'All'
            ? true
            : selectedStatus === 'Known'
            ? !l.isUnknown
            : l.isUnknown;
        return matchSearch && matchStatus;
      })
      .sort((a, b) => (sortOrder === 'newest' ? b.timestamp - a.timestamp : a.timestamp - b.timestamp));
  }, [logs, searchQuery, selectedStatus, sortOrder]);

  const handleExportTimeline = () => {
    const headers = ['Log ID', 'Person Name', 'Identity Classification', 'Confidence %', 'Emotion', 'Liveness Verification', 'Camera Node', 'Date', 'Time', 'Action Taken'];
    const rows = filteredLogs.map((l) => [
      `"${l.id}"`,
      `"${l.personName}"`,
      `"${l.isUnknown ? 'Unknown' : 'Known'}"`,
      `"${l.confidence}%"`,
      `"${l.emotion || 'Neutral'}"`,
      `"${l.livenessStatus || 'LIVE HUMAN VERIFIED'}"`,
      `"${l.cameraId}"`,
      `"${l.dateStr}"`,
      `"${l.timeStr}"`,
      `"${l.actionTaken}"`,
    ]);
    const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    downloadCsvFile(csv, `recognition_timeline_${new Date().toISOString().split('T')[0]}.csv`);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Clock className="w-4 h-4 text-teal-600" />
            <span className="text-xs font-bold uppercase tracking-wider text-teal-700">
              Module 07 · Chronological Audit Feed
            </span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">
            Recognition Event Timeline
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time chronological timeline tracking every biometric inference, emotion state, and security action.
          </p>
        </div>

        <button
          onClick={handleExportTimeline}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 transition-all cursor-pointer shadow-xs whitespace-nowrap"
        >
          <Download className="w-4 h-4 text-slate-400" />
          <span>Export Timeline CSV</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search timeline events, person, emotion..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-teal-600 focus:bg-white transition-all"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          {/* Status Filter */}
          <div className="flex items-center p-1 bg-slate-100 rounded-xl text-xs font-bold">
            <button
              onClick={() => setSelectedStatus('All')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                selectedStatus === 'All' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              All Events ({logs.length})
            </button>
            <button
              onClick={() => setSelectedStatus('Known')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                selectedStatus === 'Known' ? 'bg-emerald-100 text-emerald-800 font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Known Faces
            </button>
            <button
              onClick={() => setSelectedStatus('Unknown')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                selectedStatus === 'Unknown' ? 'bg-rose-100 text-rose-800 font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Unknown / Alert
            </button>
          </div>

          {/* Sort button */}
          <button
            onClick={() => setSortOrder(sortOrder === 'newest' ? 'oldest' : 'newest')}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 hover:bg-white transition-colors cursor-pointer"
          >
            <ArrowUpDown className="w-3.5 h-3.5 text-teal-600" />
            <span>{sortOrder === 'newest' ? 'Newest First' : 'Oldest First'}</span>
          </button>
        </div>
      </div>

      {/* Timeline Stream */}
      <div className="relative pl-6 md:pl-8 border-l-2 border-slate-200 space-y-6">
        {filteredLogs.length === 0 ? (
          <div className="py-14 text-center text-slate-400 bg-white rounded-3xl border border-slate-200/80 shadow-xs">
            No timeline events match your filter.
          </div>
        ) : (
          filteredLogs.map((log) => {
            const isKnown = !log.isUnknown;
            const isSpoof = log.livenessStatus === 'SPOOF DETECTED';

            return (
              <div key={log.id} className="relative group">
                {/* Timeline node icon */}
                <div
                  className={`absolute -left-[33px] md:-left-[41px] top-5 w-6 h-6 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-bold shadow-xs ${
                    isSpoof
                      ? 'bg-rose-500 text-white'
                      : isKnown
                      ? 'bg-emerald-500 text-white'
                      : 'bg-amber-500 text-white'
                  }`}
                >
                  {isSpoof ? '!' : isKnown ? '✓' : '?'}
                </div>

                {/* Event Card */}
                <div
                  className={`p-5 rounded-3xl border transition-all ${
                    isSpoof
                      ? 'bg-rose-50/70 border-rose-200 shadow-xs'
                      : isKnown
                      ? 'bg-white border-slate-200/80 shadow-xs hover:border-slate-300'
                      : 'bg-amber-50/70 border-amber-200 shadow-xs'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-slate-100">
                    <div className="flex items-center gap-3.5">
                      <img
                        src={log.snapshotUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&h=120&fit=crop&crop=face'}
                        alt={log.personName}
                        className="w-12 h-12 rounded-2xl object-cover border border-slate-200 shrink-0 shadow-xs"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-sm text-slate-900">{log.personName}</h3>
                          <span
                            className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full font-bold ${
                              isSpoof
                                ? 'bg-rose-100 text-rose-800 border border-rose-200'
                                : isKnown
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                : 'bg-amber-100 text-amber-800 border border-amber-200'
                            }`}
                          >
                            {isSpoof ? 'SPOOF DETECTED' : isKnown ? 'KNOWN PERSONNEL' : 'UNKNOWN VISITOR'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5 font-normal">{log.actionTaken}</p>
                      </div>
                    </div>

                    <div className="text-left sm:text-right font-mono text-xs">
                      <div className="text-indigo-600 font-bold">{log.confidence.toFixed(1)}% Match</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        {log.dateStr} · {log.timeStr}
                      </div>
                    </div>
                  </div>

                  {/* Badges footer */}
                  <div className="pt-3 flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-slate-500">
                    <div className="flex items-center gap-3">
                      <span>Node: <strong className="text-slate-800">{log.cameraId}</strong></span>
                      {log.emotion && (
                        <span className="flex items-center gap-1 text-purple-700 font-bold">
                          Emotion: <strong>{log.emotion}</strong>
                        </span>
                      )}
                    </div>
                    <span
                      className={`text-[11px] font-bold ${
                        isSpoof ? 'text-rose-600' : 'text-emerald-600'
                      }`}
                    >
                      {log.livenessStatus || 'LIVE HUMAN VERIFIED'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
