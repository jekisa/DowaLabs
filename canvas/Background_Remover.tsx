import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Upload,
  Image as ImageIcon,
  Download,
  Trash2,
  RotateCcw,
  Sparkles,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Maximize2,
  X,
  History,
  Wand2,
  ShieldCheck,
  Scissors,
  Eye,
  EyeOff,
  Zap,
} from 'lucide-react';

type UploadedImage = {
  file: File | null;
  preview: string | null;
  name: string;
  size: number;
};

type HistoryItem = {
  id: number;
  preview: string;
  name: string;
  createdAt: string;
};

const MAX_HISTORY = 5;
const STORAGE_KEY = 'dowalabs_bg_remover_history_v1';

const emptyImage: UploadedImage = {
  file: null,
  preview: null,
  name: '',
  size: 0,
};

const statusSteps = [
  'Analyzing subject...',
  'Detecting background...',
  'Removing background...',
  'Refining subject edges...',
  'Finalizing transparent PNG...',
];

const formatBytes = (bytes: number) => {
  if (!bytes) return '0 MB';
  const mb = bytes / (1024 * 1024);
  return `${mb.toFixed(2)} MB`;
};

const loadImage = (src: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });

function Header() {
  return (
    <header className="h-16 shrink-0 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl px-5 lg:px-7 flex items-center justify-between z-30">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
          <Scissors className="w-4.5 h-4.5 text-white" />
        </div>
        <div>
          <h1 className="text-sm font-bold text-white tracking-tight">DOWALABS</h1>
          <p className="text-[10px] text-slate-400 -mt-0.5">Background Remover</p>
        </div>
      </div>

      <div className="hidden md:flex items-center gap-2 text-[11px] text-slate-400">
        <span className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 flex items-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> No backend demo
        </span>
        <span className="px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 flex items-center gap-2">
          <Zap className="w-3.5 h-3.5" /> Remove photo backgrounds in one click
        </span>
      </div>
    </header>
  );
}

function LoadingOverlay({ progress, status }: { progress: number; status: string }) {
  return (
    <div className="absolute inset-0 z-20 bg-slate-950/80 backdrop-blur-md flex items-center justify-center rounded-3xl border border-white/10">
      <div className="w-[86%] max-w-md rounded-3xl bg-slate-900/90 border border-white/10 p-6 shadow-2xl">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-11 h-11 rounded-2xl bg-indigo-500/15 border border-indigo-500/25 flex items-center justify-center">
            <Loader2 className="w-5 h-5 text-indigo-300 animate-spin" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">Processing image</p>
            <p className="text-xs text-slate-400">{status}</p>
          </div>
        </div>

        <div className="h-2 rounded-full bg-slate-800 overflow-hidden border border-white/5">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500">
          <span>AI subject isolation</span>
          <span>{progress}%</span>
        </div>
      </div>
    </div>
  );
}

function UploadPanel({
  image,
  warning,
  error,
  isProcessing,
  onUpload,
  onRemove,
  onProcess,
  onDownload,
  canDownload,
}: {
  image: UploadedImage;
  warning: string;
  error: string;
  isProcessing: boolean;
  onUpload: (file: File) => void;
  onRemove: () => void;
  onProcess: () => void;
  onDownload: () => void;
  canDownload: boolean;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragOver(false);
    const file = event.dataTransfer.files?.[0];
    if (file) onUpload(file);
  };

  return (
    <aside className="w-full lg:w-[340px] shrink-0 border-r border-white/10 bg-slate-950/70 backdrop-blur-xl flex flex-col">
      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        <div>
          <p className="text-[11px] font-bold text-indigo-300 uppercase tracking-[0.18em] mb-3">Upload portrait</p>
          <div
            onClick={() => inputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            className={`relative min-h-[250px] rounded-3xl border border-dashed cursor-pointer overflow-hidden transition-all ${
              dragOver
                ? 'border-indigo-400 bg-indigo-500/10'
                : image.preview
                  ? 'border-indigo-500/40 bg-slate-900/70'
                  : 'border-slate-700 bg-slate-900/40 hover:border-indigo-500/40 hover:bg-indigo-500/5'
            }`}
          >
            {image.preview ? (
              <>
                <img src={image.preview} alt="Uploaded portrait" className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-sm font-semibold text-white truncate">{image.name}</p>
                  <p className="text-[11px] text-slate-300 mt-0.5">{formatBytes(image.size)}</p>
                </div>
              </>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                <div className="w-16 h-16 rounded-3xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-4 animate-pulse">
                  <Upload className="w-7 h-7 text-indigo-300" />
                </div>
                <p className="text-sm font-semibold text-white">Upload 1 photo</p>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">Drag and drop or click to upload a portrait photo with background.</p>
                <p className="text-[10px] text-slate-600 mt-4">PNG, JPG, WEBP accepted</p>
              </div>
            )}
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) onUpload(file);
                event.currentTarget.value = '';
              }}
            />
          </div>
        </div>

        {error && (
          <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-3 flex gap-2 text-xs text-red-200">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {warning && (
          <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-3 flex gap-2 text-xs text-amber-100">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{warning}</span>
          </div>
        )}

        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-4 space-y-3">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.18em]">Action</p>
          <button
            onClick={onProcess}
            disabled={!image.preview || isProcessing}
            className="w-full h-12 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 disabled:from-slate-800 disabled:to-slate-800 disabled:text-slate-500 text-white text-sm font-semibold flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-500/15 disabled:shadow-none"
          >
            {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
            Remove Background
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={onDownload}
              disabled={!canDownload}
              className="h-11 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 disabled:bg-slate-900/50 disabled:border-white/5 disabled:text-slate-600 text-emerald-300 text-xs font-semibold flex items-center justify-center gap-2 transition-all"
            >
              <Download className="w-3.5 h-3.5" /> PNG
            </button>
            <button
              onClick={onRemove}
              disabled={!image.preview || isProcessing}
              className="h-11 rounded-2xl bg-white/5 border border-white/10 hover:bg-red-500/10 hover:border-red-500/20 disabled:opacity-40 text-slate-300 hover:text-red-200 text-xs font-semibold flex items-center justify-center gap-2 transition-all"
            >
              <Trash2 className="w-3.5 h-3.5" /> Reset
            </button>
          </div>
        </div>

        <div className="rounded-3xl border border-indigo-500/15 bg-indigo-500/[0.06] p-4">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4 text-indigo-300" />
            </div>
            <div>
              <p className="text-xs font-semibold text-indigo-100">Demo mode</p>
              <p className="text-[11px] text-slate-400 leading-relaxed mt-1">
                This Canvas version simulates background removal visually. Connect remove.bg, ClipDrop, Replicate, or @imgly/background-removal for real processing.
              </p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

function Checkerboard({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-900"
      style={{
        backgroundImage:
          'linear-gradient(45deg, rgba(255,255,255,0.08) 25%, transparent 25%), linear-gradient(-45deg, rgba(255,255,255,0.08) 25%, transparent 25%), linear-gradient(45deg, transparent 75%, rgba(255,255,255,0.08) 75%), linear-gradient(-45deg, transparent 75%, rgba(255,255,255,0.08) 75%)',
        backgroundSize: '28px 28px',
        backgroundPosition: '0 0, 0 14px, 14px -14px, -14px 0px',
      }}
    >
      {children}
    </div>
  );
}

function BeforeAfterPanel({
  image,
  processed,
  compareMode,
}: {
  image: UploadedImage;
  processed: boolean;
  compareMode: boolean;
}) {
  if (!image.preview) {
    return (
      <div className="min-h-[520px] rounded-[2rem] border border-white/10 bg-slate-900/40 backdrop-blur-xl flex items-center justify-center p-8 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(99,102,241,0.18),transparent_35%),radial-gradient(circle_at_80%_80%,rgba(168,85,247,0.14),transparent_30%)]" />
        <div className="relative z-10 flex flex-col items-center max-w-sm">
          <div className="w-28 h-28 rounded-[2rem] bg-white/5 border border-white/10 flex items-center justify-center mb-6 animate-bounce">
            <ImageIcon className="w-12 h-12 text-indigo-300" />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Upload a portrait photo to remove the background</h2>
          <p className="text-sm text-slate-400 mt-3 leading-relaxed">One photo only. The workspace will show before and after previews here.</p>
        </div>
      </div>
    );
  }

  if (compareMode) {
    return (
      <div className="min-h-[520px] rounded-[2rem] border border-white/10 bg-slate-900/40 backdrop-blur-xl p-4 lg:p-6 relative overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
          <div className="rounded-3xl overflow-hidden bg-slate-950 border border-white/10 relative min-h-[430px] flex items-center justify-center">
            <div className="absolute top-4 left-4 z-10 px-3 py-1.5 rounded-full bg-slate-950/70 border border-white/10 text-[11px] font-semibold text-slate-200">Before</div>
            <img src={image.preview} alt="Before" className="max-w-full max-h-[500px] object-contain" />
          </div>

          <Checkerboard>
            <div className="relative min-h-[430px] flex items-center justify-center">
              <div className="absolute top-4 left-4 z-10 px-3 py-1.5 rounded-full bg-slate-950/70 border border-white/10 text-[11px] font-semibold text-slate-200">After</div>
              <img
                src={image.preview}
                alt="After simulated transparent"
                className={`max-w-full max-h-[500px] object-contain transition-all duration-700 ${processed ? 'drop-shadow-2xl scale-[0.94]' : 'opacity-35 grayscale'}`}
                style={processed ? { filter: 'drop-shadow(0 30px 50px rgba(0,0,0,0.45))' } : undefined}
              />
              {processed && <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-indigo-500/10 via-transparent to-transparent" />}
            </div>
          </Checkerboard>
        </div>
      </div>
    );
  }

  return (
    <Checkerboard>
      <div className="min-h-[520px] flex items-center justify-center p-4 lg:p-6 relative">
        <div className="absolute top-5 left-5 z-10 px-3 py-1.5 rounded-full bg-slate-950/70 border border-white/10 text-[11px] font-semibold text-slate-200">
          {processed ? 'Processed Preview' : 'Waiting for process'}
        </div>
        <img
          src={image.preview}
          alt="Preview"
          className={`max-w-full max-h-[560px] object-contain transition-all duration-700 ${processed ? 'scale-[0.92]' : 'opacity-45 grayscale'}`}
          style={processed ? { filter: 'drop-shadow(0 35px 60px rgba(0,0,0,0.5))' } : undefined}
        />
        {!processed && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-slate-950/75 border border-white/10 text-xs text-slate-300">
            Click Remove Background to generate preview
          </div>
        )}
      </div>
    </Checkerboard>
  );
}

function HistoryStrip({ history, onRestore, onClear }: { history: HistoryItem[]; onRestore: (item: HistoryItem) => void; onClear: () => void }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-indigo-300" />
          <p className="text-xs font-bold text-slate-300 uppercase tracking-[0.16em]">Recent results</p>
        </div>
        <button onClick={onClear} disabled={!history.length} className="text-[11px] text-slate-500 hover:text-red-300 disabled:opacity-30 transition-all">
          Clear
        </button>
      </div>

      {history.length === 0 ? (
        <p className="text-xs text-slate-500">No recent images yet.</p>
      ) : (
        <div className="flex gap-3 overflow-x-auto pb-1">
          {history.map((item) => (
            <button
              key={item.id}
              onClick={() => onRestore(item)}
              className="w-24 shrink-0 rounded-2xl overflow-hidden border border-white/10 bg-slate-900 hover:border-indigo-500/40 transition-all text-left"
            >
              <img src={item.preview} alt={item.name} className="w-full h-20 object-cover" />
              <div className="p-2">
                <p className="text-[10px] text-slate-300 truncate">{item.name || 'image'}</p>
                <p className="text-[9px] text-slate-600 truncate">{item.createdAt}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function FullscreenPreview({ image, processed, onClose }: { image: UploadedImage; processed: boolean; onClose: () => void }) {
  if (!image.preview) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-xl p-4 lg:p-8 flex items-center justify-center">
      <button onClick={onClose} className="absolute top-5 right-5 w-11 h-11 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 flex items-center justify-center text-white">
        <X className="w-5 h-5" />
      </button>
      <div className="w-full max-w-5xl">
        <Checkerboard>
          <div className="min-h-[75vh] flex items-center justify-center p-6">
            <img
              src={image.preview}
              alt="Fullscreen preview"
              className={`max-w-full max-h-[78vh] object-contain ${processed ? 'scale-[0.94]' : 'opacity-50 grayscale'}`}
              style={processed ? { filter: 'drop-shadow(0 35px 70px rgba(0,0,0,0.55))' } : undefined}
            />
          </div>
        </Checkerboard>
      </div>
    </div>
  );
}

function PreviewWorkspace({
  image,
  processed,
  isProcessing,
  progress,
  status,
  compareMode,
  setCompareMode,
  onDownload,
  onReset,
  history,
  onRestore,
  onClearHistory,
}: {
  image: UploadedImage;
  processed: boolean;
  isProcessing: boolean;
  progress: number;
  status: string;
  compareMode: boolean;
  setCompareMode: (value: boolean) => void;
  onDownload: () => void;
  onReset: () => void;
  history: HistoryItem[];
  onRestore: (item: HistoryItem) => void;
  onClearHistory: () => void;
}) {
  const [fullscreen, setFullscreen] = useState(false);

  return (
    <main className="flex-1 min-w-0 overflow-y-auto bg-[#080d18] p-4 lg:p-7">
      <div className="max-w-7xl mx-auto space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <p className="text-[11px] font-bold text-indigo-300 uppercase tracking-[0.2em]">AI Workspace</p>
            <h2 className="text-2xl lg:text-3xl font-bold text-white tracking-tight mt-1">Background removal preview</h2>
            <p className="text-sm text-slate-400 mt-1">Before and after preview for one uploaded portrait photo.</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setCompareMode(!compareMode)}
              disabled={!image.preview}
              className="h-10 px-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 disabled:opacity-40 text-xs font-semibold text-slate-300 flex items-center gap-2 transition-all"
            >
              {compareMode ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              {compareMode ? 'Single View' : 'Compare View'}
            </button>
            <button
              onClick={() => setFullscreen(true)}
              disabled={!image.preview}
              className="h-10 px-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 disabled:opacity-40 text-xs font-semibold text-slate-300 flex items-center gap-2 transition-all"
            >
              <Maximize2 className="w-3.5 h-3.5" /> Fullscreen
            </button>
            <button
              onClick={onReset}
              disabled={!image.preview}
              className="h-10 px-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 disabled:opacity-40 text-xs font-semibold text-slate-300 flex items-center gap-2 transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset
            </button>
            <button
              onClick={onDownload}
              disabled={!processed}
              className="h-10 px-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 disabled:opacity-40 text-xs font-semibold text-emerald-300 flex items-center gap-2 transition-all"
            >
              <Download className="w-3.5 h-3.5" /> Download PNG
            </button>
          </div>
        </div>

        <div className="relative">
          <BeforeAfterPanel image={image} processed={processed} compareMode={compareMode} />
          {isProcessing && <LoadingOverlay progress={progress} status={status} />}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-5">
          <HistoryStrip history={history} onRestore={onRestore} onClear={onClearHistory} />

          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-4">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <p className="text-xs font-bold text-slate-300 uppercase tracking-[0.16em]">Output status</p>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-400">
                <span>Uploaded image</span>
                <span className={image.preview ? 'text-emerald-300' : 'text-slate-600'}>{image.preview ? 'Ready' : 'Empty'}</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Background removed</span>
                <span className={processed ? 'text-emerald-300' : 'text-slate-600'}>{processed ? 'Simulated' : 'Not yet'}</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Download format</span>
                <span className="text-slate-300">PNG</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {fullscreen && <FullscreenPreview image={image} processed={processed} onClose={() => setFullscreen(false)} />}
    </main>
  );
}

export default function App() {
  const [image, setImage] = useState<UploadedImage>(emptyImage);
  const [processed, setProcessed] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState(statusSteps[0]);
  const [error, setError] = useState('');
  const [warning, setWarning] = useState('');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [compareMode, setCompareMode] = useState(true);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setHistory(JSON.parse(saved));
    } catch {
      setHistory([]);
    }
  }, []);

  const canDownload = useMemo(() => Boolean(image.preview && processed), [image.preview, processed]);

  const saveHistory = (item: HistoryItem) => {
    const next = [item, ...history.filter((h) => h.preview !== item.preview)].slice(0, MAX_HISTORY);
    setHistory(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const handleUpload = (file: File) => {
    setError('');
    setWarning('');

    if (!file.type.startsWith('image/')) {
      setError('File harus berupa gambar. Upload PNG, JPG, atau WEBP.');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setWarning('Ukuran gambar lebih dari 10MB. Masih bisa dipakai, tapi preview atau download mungkin lebih lambat.');
    }

    const preview = URL.createObjectURL(file);
    setImage({ file, preview, name: file.name, size: file.size });
    setProcessed(false);
    setProgress(0);
    setStatus(statusSteps[0]);
  };

  const handleRemove = () => {
    if (image.preview) URL.revokeObjectURL(image.preview);
    setImage(emptyImage);
    setProcessed(false);
    setError('');
    setWarning('');
    setProgress(0);
  };

  const handleProcess = () => {
    if (!image.preview || isProcessing) return;

    setIsProcessing(true);
    setProcessed(false);
    setProgress(0);
    setStatus(statusSteps[0]);

    let current = 0;
    const timer = window.setInterval(() => {
      current += Math.floor(Math.random() * 12) + 7;
      const safeProgress = Math.min(current, 100);
      setProgress(safeProgress);
      const stepIndex = Math.min(Math.floor((safeProgress / 100) * statusSteps.length), statusSteps.length - 1);
      setStatus(statusSteps[stepIndex]);

      if (safeProgress >= 100) {
        window.clearInterval(timer);
        setTimeout(() => {
          setIsProcessing(false);
          setProcessed(true);
          if (image.preview) {
            saveHistory({
              id: Date.now(),
              preview: image.preview,
              name: image.name || 'portrait.png',
              createdAt: new Date().toLocaleString(),
            });
          }
        }, 450);
      }
    }, 280);
  };

  const handleDownload = async () => {
    if (!image.preview || !processed) return;

    try {
      const img = await loadImage(image.preview);
      const canvas = document.createElement('canvas');
      const maxSide = 1600;
      const ratio = Math.min(1, maxSide / Math.max(img.width, img.height));
      canvas.width = Math.max(1, Math.round(img.width * ratio));
      canvas.height = Math.max(1, Math.round(img.height * ratio));

      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas unavailable');

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      canvas.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'dowalabs-bg-removed.png';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 'image/png');
    } catch {
      setError('Gagal membuat file PNG. Coba upload gambar lain.');
    }
  };

  const handleRestore = (item: HistoryItem) => {
    setImage({ file: null, preview: item.preview, name: item.name, size: 0 });
    setProcessed(true);
    setError('');
    setWarning('');
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <div className="h-screen bg-slate-950 text-slate-200 font-sans overflow-hidden selection:bg-indigo-500/30">
      <style>{`
        @keyframes softFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes glowPulse {
          0%, 100% { opacity: .35; transform: scale(1); }
          50% { opacity: .7; transform: scale(1.08); }
        }
        .animate-soft-float { animation: softFloat 5s ease-in-out infinite; }
        .animate-glow-pulse { animation: glowPulse 4s ease-in-out infinite; }
        *::-webkit-scrollbar { width: 8px; height: 8px; }
        *::-webkit-scrollbar-track { background: rgba(15, 23, 42, .4); }
        *::-webkit-scrollbar-thumb { background: rgba(99, 102, 241, .35); border-radius: 999px; }
      `}</style>

      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-glow-pulse" />
        <div className="absolute bottom-0 right-0 w-[34rem] h-[34rem] bg-violet-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 h-full flex flex-col">
        <Header />
        <div className="flex-1 min-h-0 flex flex-col lg:flex-row overflow-hidden">
          <UploadPanel
            image={image}
            warning={warning}
            error={error}
            isProcessing={isProcessing}
            onUpload={handleUpload}
            onRemove={handleRemove}
            onProcess={handleProcess}
            onDownload={handleDownload}
            canDownload={canDownload}
          />

          <PreviewWorkspace
            image={image}
            processed={processed}
            isProcessing={isProcessing}
            progress={progress}
            status={status}
            compareMode={compareMode}
            setCompareMode={setCompareMode}
            onDownload={handleDownload}
            onReset={handleRemove}
            history={history}
            onRestore={handleRestore}
            onClearHistory={clearHistory}
          />
        </div>
      </div>
    </div>
  );
}
