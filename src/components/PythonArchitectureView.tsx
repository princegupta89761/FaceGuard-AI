import React, { useState } from 'react';
import {
  Code2,
  Copy,
  Check,
  Download,
  FolderTree,
  Terminal,
  FileCode,
  FileText,
  Sparkles,
} from 'lucide-react';
import {
  MODULAR_PYTHON_FILES,
  SQLITE_DATABASE_SCHEMA,
  STREAMLIT_SINGLE_FILE_CODE,
} from '../data/pythonCodeSnippets';

export const PythonArchitectureView: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<string>('streamlit_faceguard.py');
  const [copied, setCopied] = useState<boolean>(false);

  const fileKeys = [
    'streamlit_faceguard.py',
    'sqlite_schema.sql',
    ...Object.keys(MODULAR_PYTHON_FILES),
  ];

  const getActiveCode = () => {
    if (selectedTab === 'streamlit_faceguard.py') {
      return STREAMLIT_SINGLE_FILE_CODE;
    }
    if (selectedTab === 'sqlite_schema.sql') {
      return SQLITE_DATABASE_SCHEMA;
    }
    return MODULAR_PYTHON_FILES[selectedTab as keyof typeof MODULAR_PYTHON_FILES] || '';
  };

  const handleCopy = () => {
    const code = getActiveCode();
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const code = getActiveCode();
    const filename = selectedTab.includes('/') ? selectedTab.split('/').pop()! : selectedTab;
    const blob = new Blob([code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Code2 className="w-4 h-4 text-violet-600" />
            <span className="text-xs font-bold uppercase tracking-wider text-violet-700">
              Source Code &amp; Python Architecture Hub
            </span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">
            FaceGuard AI Python &amp; Streamlit Implementation
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Complete standalone Python scripts including the single-file Streamlit application, modular OpenCV pipeline, and production deployment guide.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 transition-all cursor-pointer shadow-xs"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied to Clipboard' : 'Copy Code'}</span>
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:shadow-md transition-all cursor-pointer shadow-xs whitespace-nowrap"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download {selectedTab.split('/').pop()}</span>
          </button>
        </div>
      </div>

      {/* Directory Tree Structure Callout */}
      <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-violet-100 text-violet-700 flex items-center justify-center shrink-0">
            <FolderTree className="w-5 h-5" />
          </div>
          <div>
            <span className="font-bold text-slate-900">Target Folder Architecture:</span>
            <div className="text-[11px] text-slate-500 font-mono mt-0.5">
              FaceGuardAI/ [assets, known_faces, unknown_faces, attendance, logs, screenshots, models]
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[11px] font-mono bg-slate-100 px-3.5 py-2 rounded-xl border border-slate-200">
          <Terminal className="w-3.5 h-3.5 text-emerald-600" />
          <span className="text-slate-500 font-bold">Run:</span>
          <span className="text-indigo-700 font-bold">streamlit run streamlit_faceguard.py</span>
        </div>
      </div>

      {/* File Navigation Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-slate-200">
        {fileKeys.map((key) => {
          const isSelected = selectedTab === key;
          const isStreamlit = key === 'streamlit_faceguard.py';

          return (
            <button
              key={key}
              onClick={() => setSelectedTab(key)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-mono font-bold transition-all whitespace-nowrap cursor-pointer border-t border-x ${
                isSelected
                  ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                  : 'bg-white text-slate-500 border-transparent hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {isStreamlit ? (
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              ) : key.endsWith('.py') ? (
                <FileCode className="w-3.5 h-3.5 text-indigo-400" />
              ) : (
                <FileText className="w-3.5 h-3.5 text-slate-400" />
              )}
              <span>{key}</span>
            </button>
          );
        })}
      </div>

      {/* Code Editor Preview Window */}
      <div className="rounded-3xl bg-slate-950 border border-slate-800 overflow-hidden shadow-xl">
        <div className="flex items-center justify-between px-5 py-3 bg-slate-900/90 border-b border-slate-800 text-xs font-mono text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-500/80" />
            <span className="w-3 h-3 rounded-full bg-amber-500/80" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
            <span className="ml-2 text-slate-200 font-bold">{selectedTab}</span>
          </div>
          <span>Python 3.10+ / Streamlit 1.28+</span>
        </div>

        <pre className="p-6 text-xs font-mono text-slate-300 overflow-x-auto leading-relaxed max-h-[600px] select-all">
          <code>{getActiveCode()}</code>
        </pre>
      </div>
    </div>
  );
};
