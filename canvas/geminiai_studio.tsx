import React, { useState, useEffect, useRef } from 'react';
import { 
  Upload, Image as ImageIcon, Settings, Wand2, Download, Copy, 
  Archive, History, Loader2, Sparkles, Trash2, X, AlertCircle, Camera, CheckCircle2, User, ChevronDown,
  Bell, Coins, ChevronRight, ChevronUp, Heart, RefreshCw, Layers, Share2, Zap, ArrowRight, Play
} from 'lucide-react';

// === CONFIGURATION & CONSTANTS ===
const STYLES = [
  "Studio Clean", "Luxury Premium", "Minimalist", 
  "Korean Style", "Dark Moody", "Bright Ecommerce", "Outdoor Lifestyle"
];

const RATIOS = [
  "1:1 (1080x1080)",
  "3:4 (1080x1440)",
  "4:3 (1440x1080)",
  "4:5 (1080x1350)",
  "9:16 (1080x1920)",
  "16:9 (1920x1080)",
  "1.91:1 (1080x566)"
];

const PHOTO_ANGLES = [
  "Front view studio",
  "45 degree angle",
  "Close-up detail shot",
  "Lifestyle usage shot",
  "Top view flatlay",
  "Premium advertising cinematic shot"
];

const VIDEO_ANGLES = [
  "UGC presenter intro shot, facing camera naturally with friendly smile",
  "UGC presenter slightly tilting head while holding product near chest as if starting to explain",
  "UGC presenter holding product near face, mouth slightly open as if speaking naturally",
  "UGC presenter gently turning the product to show the front side clearly",
  "UGC presenter pointing to product features while presenting",
  "UGC presenter gesturing with a natural persuasive hand pose while keeping the product visible",
  "UGC presenter showing product slightly closer to camera for emphasis",
  "UGC presenter ending pose with confident smile and product clearly visible"
];

const FEMALE_FEATURES = [
  "French-Korean beauty model with warm glowing skin, elegant soft brown waves, gentle smile",
  "Scandinavian fashion model with light blonde sleek bob, striking blue eyes, neutral expression",
  "Brazilian-Italian fashion model with sun-kissed tan skin, rich hazel eyes, wavy dark hair",
  "Japanese commercial model with sleek black glass hair, sharp modern features, elegant composure",
  "Ethiopian-American beauty model with gorgeous natural afro, glowing dark skin, warm expression",
  "Indian model with almond-shaped dark eyes, silky long black hair, elegant professional commercial look"
];

const MALE_FEATURES = [
  "British-Japanese model with sharp jawline, messy dark hair, expressive brown eyes",
  "Italian lifestyle model with light stubble, wavy dark brown hair, sophisticated warm gaze",
  "African-American commercial model with neat fade haircut, confident charismatic smile, radiant skin",
  "Korean fashion model with soft-parted black hair, clean minimalist features, stylish look",
  "Spanish model with sun-kissed features, athletic build, short dark curls, warm eyes",
  "Canadian model with neat short beard, deep blue eyes, rugged yet polished corporate look"
];

const KIDS_FEATURES = [
  "Cheerful East Asian child with a cute bright smile, sparkling eyes, active energy",
  "Adorably happy European child with curly light-brown hair, rosy cheeks, playful grin",
  "Lovely Hispanic child with big expressive brown eyes, sweet innocent laughter",
  "Polite African-American kid with neat braids, cheerful dimples, joyful expression",
  "Charming mixed-heritage child with soft wavy hair, bright friendly smile",
  "Happy kid with bright hazel eyes, high energy, laughing naturally"
];

const NEGATIVE_PROMPT = "blurry, low quality, extra fingers, duplicated fingers, bad anatomy, malformed hands, unrealistic hand, extra hand, duplicate hand, duplicate arm, extra limb, floating hand, detached hand, broken wrist, two left hands, too many hands, mutated hands, distorted product, duplicate object, watermark, cropped product, wrong logo, changed product shape, changed packaging, changed brand color, giant product, oversized product, unrealistic scale, bad perspective, product covering too much of the model unnecessarily";

const STYLE_VARIATIONS = {
  "Studio Clean": [
    "clean white seamless studio background, sharp commercial lighting, minimal shadows",
    "bright studio setup with softbox lighting, premium ecommerce look",
    "ultra clean product photography with neutral background and crisp highlights"
  ],
  "Luxury Premium": [
    "luxury editorial lighting, elegant shadows, premium high-end brand mood",
    "dramatic premium studio lighting with sophisticated composition",
    "rich luxury commercial atmosphere with polished reflections and upscale styling"
  ],
  "Minimalist": [
    "minimal background, airy composition, subtle elegant lighting",
    "simple clean setup with negative space and modern commercial feel",
    "refined minimalist aesthetic with muted tones and balanced framing"
  ],
  "Korean Style": [
    "soft korean commercial aesthetic, bright skin-friendly light, pastel background",
    "clean korean beauty campaign mood with soft glow and elegant freshness",
    "airy korean studio atmosphere with soft highlights and youthful premium feel"
  ],
  "Dark Moody": [
    "dark moody cinematic lighting with dramatic contrast",
    "deep shadow commercial setup with premium mood and focused highlights",
    "cinematic low-key lighting with elegant dark luxury atmosphere"
  ],
  "Bright Ecommerce": [
    "bright ecommerce lighting with clear product visibility and clean white look",
    "high-key commercial setup optimized for marketplace display",
    "clean bright catalog style with soft shadows and strong product readability"
  ],
  "Outdoor Lifestyle": [
    "natural outdoor lifestyle atmosphere with sunlight and authentic candid energy",
    "fresh outdoor commercial look with warm daylight and realistic environment",
    "lifestyle scene with natural light, soft breeze mood, and organic composition"
  ]
};

const MOTION_VARIANTS = [
  "motion-ugc-bob",
  "motion-present-left",
  "motion-present-right",
  "motion-product-show"
];

// === UTILITIES ===
const fileToBase64 = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result.split(',')[1]);
  reader.onerror = error => reject(error);
});

const fetchWithRetry = async (url, options, retries = 5) => {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url, options);
      if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
      return await res.json();
    } catch (e) {
      if (i === retries - 1) throw e;
      await new Promise(r => setTimeout(r, Math.pow(2, i) * 1000));
    }
  }
};

const loadJSZip = () => new Promise((resolve) => {
  if (window.JSZip) return resolve(window.JSZip);
  const script = document.createElement('script');
  script.src = "https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js";
  script.onload = () => resolve(window.JSZip);
  document.head.appendChild(script);
});

const pickRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

const extractJsonBlock = (raw) => {
  if (!raw) return null;
  const match = raw.match(/\{[\s\S]*\}/);
  if (!match) return null;
  try { return JSON.parse(match[0]); } catch { return null; }
};

const getProductScaleRule = (productType = "", scaleClass = "medium") => {
  const type = String(productType || "").toLowerCase();
  const scale = String(scaleClass || "medium").toLowerCase();

  if (/(watch|bracelet|ring|earring|necklace|jewelry)/.test(type)) {
    return "SIZE SYNC RULE: This is a small wearable product. Keep it realistically small relative to the human body. If worn on the wrist, neck, or fingers, it must appear naturally sized, never oversized. In lifestyle shots it should occupy about 8%-16% of the frame. In close-up shots it may occupy 20%-30% of the frame, while still looking realistic.";
  }
  if (/(bag|handbag|shoulder bag|tote|backpack|purse|wallet)/.test(type)) {
    return "SIZE SYNC RULE: This is a bag or fashion carry item. Match real-world bag proportions. The bag should look naturally sized when held in the hand, worn on the shoulder, or placed near the model. In lifestyle shots it should occupy about 20%-35% of the frame. In studio product-focused shots it may occupy 35%-50% of the frame, but must never look giant.";
  }
  if (/(camera|dslr|mirrorless|lens|phone|smartphone|tablet|gadget|headphone|earbuds)/.test(type)) {
    return "SIZE SYNC RULE: This is a handheld tech product. Keep it at realistic handheld size. It should fit naturally in one hand or two hands depending on the product. In lifestyle shots it should occupy about 15%-28% of the frame. In studio shots it may occupy 28%-40% of the frame, but must never appear too large compared to the face or torso.";
  }
  if (/(skincare|serum|cream|lotion|cleanser|beauty|cosmetic|perfume|bottle|tube|jar|makeup|lipstick)/.test(type)) {
    return "SIZE SYNC RULE: This is a beauty or skincare product. Keep the bottle, tube, or jar at realistic palm-sized scale. It must fit naturally in one hand. In lifestyle shots it should occupy about 12%-22% of the frame. In studio or close-up shots it may occupy 25%-38% of the frame, while still looking real and not oversized.";
  }
  if (scale === 'tiny') {
    return "SIZE SYNC RULE: Keep this product very small and realistic. In lifestyle shots it should occupy about 8%-16% of the frame. In studio shots it may occupy 18%-28% of the frame.";
  }
  if (scale === 'small') {
    return "SIZE SYNC RULE: Keep this product small and naturally handheld. In lifestyle shots it should occupy about 12%-22% of the frame. In studio shots it may occupy 22%-35% of the frame.";
  }
  if (scale === 'large') {
    return "SIZE SYNC RULE: Keep this product large but realistic. In lifestyle shots it should occupy about 22%-38% of the frame. In studio shots it may occupy 35%-55% of the frame.";
  }
  return "SIZE SYNC RULE: Keep the product at realistic real-world size and naturally proportional to the model. In lifestyle shots it should occupy about 15%-30% of the frame. In studio shots it may occupy 30%-45% of the frame. Never make the product appear giant.";
};

const getHandAnatomyRule = (productType = "", angle = "") => {
  const type = String(productType || "").toLowerCase();
  const ang = String(angle || "").toLowerCase();

  if (/(watch|bracelet|ring|earring|necklace|jewelry)/.test(type)) {
    return "HAND ANATOMY RULE: Show anatomically correct hands only. Maximum 1 or 2 visible hands total. For watches or jewelry, prefer one natural wrist/hand wearing the product. No duplicate wrists, no extra hands, no extra fingers, and no broken finger anatomy.";
  }
  if (/(skincare|serum|cream|lotion|cleanser|beauty|cosmetic|perfume|bottle|tube|jar|makeup|lipstick)/.test(type)) {
    return "HAND ANATOMY RULE: Show only natural, elegant, anatomically correct hands. Maximum 2 visible hands total. If applying or holding the product, use one or two realistic hands only. No duplicate hands, no extra fingers, no detached fingers, and no floating hand near the face.";
  }
  if (/(camera|dslr|mirrorless|lens|phone|smartphone|tablet|gadget|headphone|earbuds)/.test(type)) {
    return "HAND ANATOMY RULE: Show realistic hand interaction with the device. Maximum 2 visible hands total. Grip must be believable and ergonomic. No duplicate hands, no extra fingers, and no impossible hand positions.";
  }
  if (/(bag|handbag|shoulder bag|tote|backpack|purse|wallet)/.test(type)) {
    return "HAND ANATOMY RULE: If the bag is worn or carried, use natural arm and hand placement. Maximum 2 visible hands total. No duplicated arms or hands. Do not create extra holding hands around the bag.";
  }
  if (ang.includes('close-up')) {
    return "HAND ANATOMY RULE: Because this is a close-up composition, hand anatomy must be especially clean. Maximum 2 visible hands total, anatomically correct fingers, no duplicate hands, no extra fingers, no distorted nails or knuckles.";
  }
  return "HAND ANATOMY RULE: Show natural, anatomically correct human hands only. Maximum 2 visible hands total. No duplicate hands, no extra fingers, no extra limbs, no broken wrists, and no impossible finger positions.";
};

const getVideoPresentationRule = (productType = "") => {
  const type = String(productType || "").toLowerCase();

  if (/(watch|bracelet|ring|earring|necklace|jewelry)/.test(type)) {
    return "VIDEO PRESENTER RULE: Create a silent UGC affiliate-style presenter shot. The model faces the camera naturally as if explaining the product. Show the product clearly near the face or upper chest. Use one natural hand or wrist to display the product. Expression should feel friendly, persuasive, and conversational, like a creator recommending the item.";
  }
  if (/(skincare|serum|cream|lotion|cleanser|beauty|cosmetic|perfume|bottle|tube|jar|makeup|lipstick)/.test(type)) {
    return "VIDEO PRESENTER RULE: Create a silent UGC affiliate-style beauty presenter shot. The model faces the camera like a creator reviewing the product. Hold the skincare product clearly beside the face or in front of the chest with one natural hand. Optional second hand may point gently toward the product. The pose should feel like she is talking and demonstrating the product benefits.";
  }
  if (/(camera|dslr|mirrorless|lens|phone|smartphone|tablet|gadget|headphone|earbuds)/.test(type)) {
    return "VIDEO PRESENTER RULE: Create a silent UGC affiliate-style tech presenter shot. The model faces the camera while clearly showing the product with one or two natural hands. The pose should resemble someone explaining product features in a short vertical review video. Keep the product visible and hero-focused, with a confident presenter vibe.";
  }
  if (/(bag|handbag|shoulder bag|tote|backpack|purse|wallet)/.test(type)) {
    return "VIDEO PRESENTER RULE: Create a silent UGC affiliate-style fashion presenter shot. The model faces the camera and clearly showcases the bag by carrying it naturally on the shoulder, holding it by the handle, or lightly presenting it near the torso. The pose should feel like she is introducing and recommending the bag in a short vertical video.";
  }
  return "VIDEO PRESENTER RULE: Create a silent UGC affiliate-style presenter shot. The model faces the camera naturally, clearly shows the product, and poses as if explaining or recommending it in a short vertical review video. The expression should feel friendly and persuasive. Product visibility is critical.";
};

function pcmToWav(pcmBase64, sampleRate = 24000) {
  const buffer = Uint8Array.from(atob(pcmBase64), c => c.charCodeAt(0));
  const wavHeader = new ArrayBuffer(44);
  const view = new DataView(wavHeader);
  
  const writeString = (view, offset, string) => {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  };

  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + buffer.length, true);
  writeString(view, 8, 'WAVE');
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true); 
  view.setUint16(22, 1, true); 
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true); 
  view.setUint16(32, 2, true); 
  view.setUint16(34, 16, true); 
  writeString(view, 36, 'data');
  view.setUint32(40, buffer.length, true);
  
  const blob = new Blob([wavHeader, buffer], { type: 'audio/wav' });
  return URL.createObjectURL(blob);
}

// === VIDEO EXPORT UTILITIES ===
const loadImageElement = (src) => new Promise((resolve, reject) => {
  const img = new Image();
  img.crossOrigin = "anonymous";
  img.onload = () => resolve(img);
  img.onerror = () => reject(new Error("Gagal memuat frame video."));
  img.src = src;
});

const drawCoverImage = (ctx, img, canvasWidth, canvasHeight, scale = 1, offsetX = 0, offsetY = 0) => {
  const imgRatio = img.width / img.height;
  const canvasRatio = canvasWidth / canvasHeight;

  let drawWidth;
  let drawHeight;

  if (imgRatio > canvasRatio) {
    drawHeight = canvasHeight * scale;
    drawWidth = drawHeight * imgRatio;
  } else {
    drawWidth = canvasWidth * scale;
    drawHeight = drawWidth / imgRatio;
  }

  const x = (canvasWidth - drawWidth) / 2 + offsetX;
  const y = (canvasHeight - drawHeight) / 2 + offsetY;

  ctx.drawImage(img, x, y, drawWidth, drawHeight);
};

const createNaturalMotionVideo = async ({
  frames, width = 1080, height = 1920, fps = 30, secondsPerFrame = 0.9, mimeType = "video/webm;codecs=vp9"
}) => {
  if (!window.MediaRecorder) throw new Error("Browser ini belum mendukung MediaRecorder.");
  if (!frames || frames.length === 0) throw new Error("Tidak ada frame video untuk dibuat.");

  const supportedMimeType = MediaRecorder.isTypeSupported(mimeType)
    ? mimeType : MediaRecorder.isTypeSupported("video/webm;codecs=vp8")
      ? "video/webm;codecs=vp8" : "video/webm";

  const images = await Promise.all(frames.map(loadImageElement));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d", { alpha: false });
  const stream = canvas.captureStream(fps);
  const recorder = new MediaRecorder(stream, { mimeType: supportedMimeType });
  const chunks = [];

  recorder.ondataavailable = (event) => {
    if (event.data && event.data.size > 0) chunks.push(event.data);
  };

  const recordingDone = new Promise((resolve, reject) => {
    recorder.onstop = () => resolve(new Blob(chunks, { type: "video/webm" }));
    recorder.onerror = () => reject(new Error("Gagal merekam video."));
  });

  recorder.start();
  const totalFramesPerImage = Math.max(1, Math.floor(secondsPerFrame * fps));

  for (let i = 0; i < images.length; i++) {
    const current = images[i];
    const next = images[Math.min(i + 1, images.length - 1)] || images[i];

    for (let f = 0; f < totalFramesPerImage; f++) {
      const t = f / totalFramesPerImage;
      const eased = 0.5 - Math.cos(t * Math.PI) / 2;

      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, width, height);

      const zoom = 1.02 + Math.sin(eased * Math.PI) * 0.03;
      drawCoverImage(ctx, current, width, height, zoom, 0, 0);

      if (next && next !== current && t > 0.62) {
        const fade = Math.min(1, (t - 0.62) / 0.38);
        ctx.globalAlpha = fade;
        drawCoverImage(ctx, next, width, height, 1.018, 0, 0);
        ctx.globalAlpha = 1;
      }
      await new Promise(resolve => setTimeout(resolve, 1000 / fps));
    }
  }

  recorder.stop();
  return await recordingDone;
};

const downloadBlob = (blob, filename) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

// === COMPONENT: UGC VIDEO PLAYER ===
function UGCVideoPlayer({ img, idx, onDownloadVideo }) {
  const [frameIndex, setFrameIndex] = useState(0);
  const motionClass = img.motionClass || "motion-ugc-bob";
  const frames = img.frames && img.frames.length ? img.frames : (img.url ? [img.url] : []);

  useEffect(() => {
    if (frames.length <= 1) return;
    const timer = setInterval(() => {
      setFrameIndex(prev => (prev + 1) % frames.length);
    }, 1200);
    return () => clearInterval(timer);
  }, [frames.length]);

  const activeFrame = frames[frameIndex] || img.url;

  return (
    <div className="group break-inside-avoid mb-6 flex flex-col bg-slate-900/40 backdrop-blur-md rounded-2xl overflow-hidden border border-white/5 hover:border-indigo-500/30 transition-all hover:shadow-[0_8px_30px_rgb(99,102,241,0.15)] relative">
      <div className="aspect-[9/16] bg-slate-900 relative overflow-hidden flex items-center justify-center">
        {activeFrame ? (
          <img 
            src={activeFrame}
            alt={img.angle} 
            className={`w-full h-full object-cover ${motionClass} transition-opacity duration-500`}
          />
        ) : (
          <div className="text-xs text-red-400">Gagal memuat visual</div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 flex flex-col justify-between p-4 pointer-events-none select-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="flex justify-between items-center">
            <span className="bg-red-600/90 backdrop-blur-md text-[8px] font-bold tracking-wider px-2 py-0.5 rounded text-white flex items-center gap-1 uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" /> Silent UGC
            </span>
          </div>

          <div className="flex flex-col gap-3 absolute right-4 bottom-24 pointer-events-auto">
             <button className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white transition-all hover:scale-110">
               <Heart className="w-4 h-4" />
             </button>
             <button onClick={() => onDownloadVideo?.(img, idx)} className="w-10 h-10 rounded-full bg-indigo-500 hover:bg-indigo-400 shadow-lg shadow-indigo-500/30 flex items-center justify-center text-white transition-all hover:scale-110">
               <Download className="w-4 h-4" />
             </button>
             <button className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white transition-all hover:scale-110">
               <Share2 className="w-4 h-4" />
             </button>
          </div>

          <div className="absolute bottom-0 inset-x-0 h-1 bg-white/20">
            <div className="h-full bg-gradient-to-r from-pink-500 to-rose-500 motion-progress" />
          </div>
        </div>
      </div>
      <div className="p-4 bg-slate-900/60 backdrop-blur-lg border-t border-white/5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-slate-200 truncate">{img.angle}</p>
            <p className="text-[10px] text-slate-500 mt-0.5">UGC Motion Frame • {frames.length} frames</p>
          </div>
          <button onClick={() => onDownloadVideo?.(img, idx)} className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors">
            WEBM
          </button>
        </div>
      </div>
    </div>
  );
}

// === MAIN APPLICATION ===
export default function App() {
  const apiKey = ""; 

  // -- State Management --
  const [productImage, setProductImage] = useState({ file: null, preview: null, base64: null, mimeType: null });
  const [characterImage, setCharacterImage] = useState({ file: null, preview: null, base64: null, mimeType: null });
  const [logoImage, setLogoImage] = useState({ file: null, preview: null, base64: null, mimeType: null });
  
  const [selectedStyle, setSelectedStyle] = useState(STYLES[0]);
  const [selectedRatio, setSelectedRatio] = useState(RATIOS[4]);
  const [selectedPreset, setSelectedPreset] = useState("Shopee Style");
  const [customPrompt, setCustomPrompt] = useState("");
  const [customCharacter, setCustomCharacter] = useState("");
  
  const [outputFormat, setOutputFormat] = useState("photo"); 
  const [selectedVoice, setSelectedVoice] = useState("Kore"); 
  const [subtitleStyle, setSubtitleStyle] = useState("yellow"); 

  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("");
  
  const [generatedImages, setGeneratedImages] = useState([]); 
  const [detectedCategory, setDetectedCategory] = useState("");
  
  const [history, setHistory] = useState([]);
  const [activePromptPreview, setActivePromptPreview] = useState(null);
  
  // UI States for Collapsible sidebars
  const [sections, setSections] = useState({ asset: true, config: true, prompt: true });
  const [isPresetOpen, setIsPresetOpen] = useState(false);

  const fileInputRef = useRef(null);
  const characterInputRef = useRef(null);
  const logoInputRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem('ai_photoshoot_history_v2');
    if (saved) {
      try { setHistory(JSON.parse(saved)); } catch (e) { console.error(e); }
    }
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsPresetOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const saveToHistory = (newEntry) => {
    const updated = [newEntry, ...history].slice(0, 15); 
    setHistory(updated);
    localStorage.setItem('ai_photoshoot_history_v2', JSON.stringify(updated));
  };

  const toggleSection = (sec) => setSections(prev => ({ ...prev, [sec]: !prev[sec] }));

  // -- Handlers --
  const handleFileUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;
    const base64 = await fileToBase64(file);
    const obj = { file, preview: URL.createObjectURL(file), base64, mimeType: file.type };
    if (type === 'product') setProductImage(obj);
    else if (type === 'character') setCharacterImage(obj);
    else setLogoImage(obj);
  };

  const copyText = (text) => {
    try {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    } catch (e) { console.error("Copy failed", e); }
  };

  // -- API Logic --
  const enhancePrompt = async () => {
    if (!customPrompt) return;
    setIsEnhancing(true);
    try {
      const prompt = `Enhance this product photography prompt to be highly professional, commercial, and cinematic. Do not change the core subject, just improve the photographic terminology. Return ONLY the enhanced prompt text: "${customPrompt}"`;
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;
      const res = await fetchWithRetry(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
      });
      const enhanced = res.candidates?.[0]?.content?.parts?.[0]?.text;
      if (enhanced) setCustomPrompt(enhanced.trim());
    } catch (e) { console.error(e); } 
    finally { setIsEnhancing(false); }
  };

  const autoDetectProductProfile = async (base64Img) => {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;
    const promptText = `Analyze this uploaded product image and return STRICT JSON only with this shape: {"category":"male fashion|female fashion|kids product|skincare / beauty|gadget|food / drink|generic product","productType":"short product name","scaleClass":"tiny|small|medium|large"}. Determine the product's most likely type and its real-world size class. Return only valid JSON.`;

    try {
      const res = await fetchWithRetry(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: promptText }, { inlineData: { mimeType: "image/jpeg", data: base64Img } }] }]
        })
      });

      const raw = res.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
      const parsed = extractJsonBlock(raw) || {};
      return { category: parsed.category || "generic product", productType: parsed.productType || "product", scaleClass: parsed.scaleClass || "medium" };
    } catch (e) {
      return { category: "generic product", productType: "product", scaleClass: "medium" };
    }
  };

  const generateUGCScript = async (category, angle) => {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;
    const promptText = `Buatlah 1 kalimat naskah promosi iklan UGC (User Generated Content) pendek, santai, ekspresif, berenergi tinggi, sangat natural (gaya TikTok/Instagram Reels) dalam bahasa Indonesia untuk mempromosikan produk kategori "${category}" dengan menampilkan sudut pandang kamera "${angle}". Jangan berikan kalimat pengantar. Langsung teks naskahnya saja.`;
    
    try {
      const res = await fetchWithRetry(url, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ contents: [{ parts: [{ text: promptText }] }] })
      });
      return res.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "Guys, kalian wajib banget punya produk ini karena kualitasnya se-premium itu!";
    } catch (e) { return "Guys, kalian wajib banget punya produk ini karena kualitasnya se-premium itu!"; }
  };

  const generateVoiceover = async (textScript, voiceChar) => {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent?key=${apiKey}`;
    let prependedMood = "Say cheerfully and enthusiastically in Indonesian: ";
    if (voiceChar === "Leda") prependedMood = "Say in a soft, premium, elegant tone in Indonesian: ";
    else if (voiceChar === "Zephyr") prependedMood = "Say in an excited, high-energy male tone in Indonesian: ";

    const payload = {
      contents: [{ parts: [{ text: `${prependedMood}${textScript}` }] }],
      generationConfig: { responseModalities: ["AUDIO"], speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: voiceChar } } } },
      model: "gemini-2.5-flash-preview-tts"
    };

    const res = await fetchWithRetry(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    const pcmBase64 = res.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!pcmBase64) throw new Error("Voiceover synthesis failed");
    return pcmToWav(pcmBase64, 24000); 
  };

  const buildAnglePrompt = (profile, angle, angleIndex) => {
    const category = profile?.category || "generic product";
    const productType = profile?.productType || "product";
    const scaleClass = profile?.scaleClass || "medium";
    
    let characterRules = "";
    if (category.includes('skincare') || category.includes('beauty')) {
      const feature = FEMALE_FEATURES[angleIndex % FEMALE_FEATURES.length];
      characterRules = `Use a clean beauty commercial style. Naturally attractive beauty model described as: ${feature}. Soft elegant expression, elegant hand pose. Clean premium skincare aesthetic, Korean beauty mood. Minimal premium props, soft beige/cream/white/light pastel premium backgrounds, gentle studio lighting, fresh, trustworthy, premium brand mood.`;
    } else if (category.includes('male fashion')) {
      const feature = MALE_FEATURES[angleIndex % MALE_FEATURES.length];
      characterRules = `Use a stylish modern male model described as: ${feature}. Match outfit mood with the product, fashion editorial yet commercial look, natural and unique high-fashion stance.`;
    } else if (category.includes('female fashion')) {
      const feature = FEMALE_FEATURES[angleIndex % FEMALE_FEATURES.length];
      characterRules = `Use a stylish modern female model described as: ${feature}. Elegant, clean, commercial fashion look, sophisticated model posture.`;
    } else if (category.includes('kids')) {
      const feature = KIDS_FEATURES[angleIndex % KIDS_FEATURES.length];
      characterRules = `Use child-friendly, cheerful, safe, clean visual style. Joyful child model described as: ${feature}. Playful, natural expressions.`;
    } else if (category.includes('gadget')) {
      const feature = (angleIndex % 2 === 0 ? MALE_FEATURES : FEMALE_FEATURES)[angleIndex % 6];
      characterRules = `Use modern lifestyle model described as: ${feature}. Clean tech aesthetic, premium modern setup, naturally holding and showcasing the product.`;
    } else if (category.includes('food') || category.includes('drink')) {
      characterRules = "No human face model, only professional hand talent if necessary. Strong focus on appetizing composition, realistic serving environment.";
    } else {
      const feature = (angleIndex % 2 === 0 ? MALE_FEATURES : FEMALE_FEATURES)[angleIndex % 6];
      characterRules = `Neutral lifestyle setup, professional framing. Featuring a professional lifestyle model described as: ${feature}.`;
    }

    const activeCharacterRule = characterImage.base64
      ? `MODEL RULE: Use the uploaded face reference as the locked model identity.`
      : customCharacter ? `USER SPECIFIED MODEL/CHARACTER (CRITICAL): "${customCharacter}".` : `CATEGORY CONTEXT: ${characterRules}`;

    const faceReferenceRule = characterImage.base64 ? `FACE IDENTITY LOCK (ABSOLUTE RULE): Use the uploaded face reference as the exact same person. Preserve the same face identity.` : "";
    const logoRule = logoImage.base64 ? "BRAND LOGO INCORPORATION (CRITICAL): A brand logo image reference has been provided. You MUST realistically map this logo onto the product." : "";

    const masterConstraint = "MASTER RULE: Create a professional commercial product photoshoot using the uploaded product image as the main reference. Keep the product shape, logo, branding, colors exactly identical to the original. Generate ultra realistic photography with professional lighting, realistic shadows, premium composition, detailed texture, sharp focus, ecommerce ready, cinematic photography. Hands must be anatomically correct.";
    
    const scalingRules = getProductScaleRule(productType, scaleClass);
    const handRules = getHandAnatomyRule(productType, angle);
    const videoPresentationRule = outputFormat === "video" ? getVideoPresentationRule(productType) : "";

    const cleanRatio = selectedRatio.split(' ')[0];
    const styleVariation = pickRandom(STYLE_VARIATIONS[selectedStyle] || ["professional commercial photography"]);

    return `${masterConstraint}\n\n${scalingRules}\n\nTARGET ANGLE: ${angle}\n${activeCharacterRule}\n${faceReferenceRule}\n${logoRule}\nVISUAL STYLE: ${selectedStyle}\nSTYLE VARIATION: ${styleVariation}\nPRESET: ${selectedPreset}\nASPECT RATIO: ${cleanRatio}\nCUSTOM REQUEST: ${customPrompt ? customPrompt : 'None'}\n\nNEGATIVE PROMPT: ${NEGATIVE_PROMPT}`;
  };

  const buildVideoSequencePrompt = (profile, shot, shotIndex) => {
    const basePrompt = buildAnglePrompt(profile, shot, shotIndex);
    const presenterRule = `SILENT VIDEO FRAME RULE: This output is one frame from a short affiliate-style presenter sequence. The same exact person and same exact product must remain consistent across all sequence frames. The presenter should face the camera like a creator introducing the product. Show subtle variation in pose and facial expression.`;

    const shotRules = [
      "FRAME 1 RULE: Intro pose. Presenter faces camera, friendly smile, product visible near torso, natural introduction vibe.",
      "FRAME 2 RULE: Presenter holds product nearer to face or chest with mouth slightly open, as if explaining benefits naturally.",
      "FRAME 3 RULE: Presenter uses a natural pointing or demonstrating gesture toward the product while keeping anatomy clean and realistic.",
      "FRAME 4 RULE: Presenter brings the product slightly closer to the camera for emphasis, while maintaining realistic product scale and natural expression."
    ];

    return `${basePrompt}\n${presenterRule}\n${shotRules[shotIndex] || ""}\nSEQUENCE CONSISTENCY RULE: keep the same wardrobe, same background style, same face identity, same product identity, and same lighting mood across all frames.`;
  };

  const generateSingleImage = async (promptText, imageBase64, imageMime, logoBase64, logoMime, charBase64, charMime) => {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image-preview:generateContent?key=${apiKey}`;
    const parts = [{ text: promptText }];
    if (imageBase64) parts.push({ inlineData: { mimeType: imageMime || "image/jpeg", data: imageBase64 } });
    if (charBase64) parts.push({ inlineData: { mimeType: charMime || "image/jpeg", data: charBase64 } });
    if (logoBase64) parts.push({ inlineData: { mimeType: logoMime || "image/png", data: logoBase64 } });
    
    const payload = { contents: [{ parts }], generationConfig: { responseModalities: ["TEXT", "IMAGE"] } };
    const res = await fetchWithRetry(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });

    const outputBase64 = res.candidates?.[0]?.content?.parts?.find(p => p.inlineData)?.inlineData?.data;
    if (!outputBase64) throw new Error("Gagal membuat gambar.");
    return `data:image/jpeg;base64,${outputBase64}`;
  };

  const handleGenerateJob = async () => {
    if (!productImage.base64) return;
    setIsGenerating(true); setGeneratedImages([]); setProgress(5); setStatusText("Menganalisis kategori produk..."); setActivePromptPreview(null);

    try {
      const profile = await autoDetectProductProfile(productImage.base64);
      setDetectedCategory(profile.category); setProgress(15);
      const angles = outputFormat === "video" ? ["UGC Presenter Sequence"] : PHOTO_ANGLES;
      setStatusText(`Terdeteksi: ${profile.category} / ${profile.productType}. Membuat ${angles.length} output...`);

      const prompts = angles.map((angle, idx) => buildAnglePrompt(profile, angle, idx));
      const results = [];

      for (let i = 0; i < prompts.length; i++) {
        setStatusText(`Membuat output ${i + 1}/${prompts.length}: ${angles[i]}...`);
        try {
          let resultObj;
          if (outputFormat === "video") {
            setStatusText(`Membuat 1 video UGC clean dengan lebih banyak frame presenter produk...`);
            const framePrompts = VIDEO_ANGLES.map((shot, shotIndex) => buildVideoSequencePrompt(profile, shot, shotIndex));
            const frames = [];
            for (let j = 0; j < framePrompts.length; j++) {
              setStatusText(`Membuat frame video ${j + 1}/${framePrompts.length}...`);
              const frameUrl = await generateSingleImage(framePrompts[j], productImage.base64, productImage.mimeType, logoImage.base64, logoImage.mimeType, characterImage.base64, characterImage.mimeType);
              frames.push(frameUrl);
            }
            resultObj = { angle: "UGC Presenter Sequence", url: frames[0] || null, frames, prompt: framePrompts.join("\n\n---FRAME BREAK---\n\n"), script: "", audioUrl: null, motionClass: pickRandom(MOTION_VARIANTS), error: false };
          } else {
            const imgUrl = await generateSingleImage(prompts[i], productImage.base64, productImage.mimeType, logoImage.base64, logoImage.mimeType, characterImage.base64, characterImage.mimeType);
            resultObj = { angle: angles[i], url: imgUrl, prompt: prompts[i], script: "", audioUrl: null, motionClass: pickRandom(MOTION_VARIANTS), error: false };
          }
          results.push(resultObj);
          setGeneratedImages(prev => [...prev, resultObj]);
        } catch (err) {
          console.error(`Error generating ${angles[i]}:`, err);
          const errorObj = { angle: angles[i], url: null, prompt: prompts[i], error: true };
          results.push(errorObj);
          setGeneratedImages(prev => [...prev, errorObj]);
        }
        setProgress(15 + Math.floor(((i + 1) / prompts.length) * 85));
      }

      setStatusText("Sesi Produksi Kreatif Selesai!");
      saveToHistory({
        id: Date.now(), timestamp: new Date().toLocaleString(), category: profile.category, productType: profile.productType, scaleClass: profile.scaleClass,
        style: selectedStyle, ratio: selectedRatio, preset: selectedPreset, outputFormat, selectedVoice, subtitleStyle, customPrompt, customCharacter, results
      });
    } catch (error) {
      console.error(error); setStatusText("Terjadi kesalahan sistem saat pemrosesan.");
    } finally {
      setTimeout(() => { setIsGenerating(false); setProgress(0); }, 3000);
    }
  };

  const downloadSingle = (url, name) => {
    if(!url) return;
    const a = document.createElement('a'); a.href = url; a.download = `AI_Photoshoot_${name.replace(/\s+/g, '_')}.jpg`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
  };

  const downloadZip = async () => {
    try {
      setIsGenerating(true); setProgress(0); setStatusText("Memulai proses ZIP...");
      const JSZip = await loadJSZip(); const zip = new JSZip();
      
      generatedImages.forEach((img, idx) => {
        if(img.url && !img.error) {
          const b64Data = img.url.split(',')[1];
          zip.file(`${idx + 1}_${img.angle.replace(/\s+/g, '_')}.jpg`, b64Data, {base64: true});
        }
      });
      
      const content = await zip.generateAsync({ type: "blob", compression: "STORE" }, (metadata) => {
        setProgress(metadata.percent); setStatusText(`Membungkus file ZIP... ${Math.round(metadata.percent)}%`);
      });
      
      const a = document.createElement('a'); a.href = URL.createObjectURL(content); a.download = `AI_Photoshoot_Batch_${Date.now()}.zip`; a.click();
      setStatusText("File ZIP berhasil diunduh!");
      setTimeout(() => { setStatusText(""); setProgress(0); setIsGenerating(false); }, 2000);
    } catch (e) {
      console.error(e); setStatusText("Gagal membuat berkas ZIP."); setIsGenerating(false);
    }
  };

  const downloadUGCVideo = async (img, idx) => {
    try {
      if (!img?.frames || img.frames.length === 0) { setStatusText("Tidak ada frame video untuk diunduh."); return; }
      if (!window.MediaRecorder) { setStatusText("Browser tidak support MediaRecorder. Gunakan Chrome terbaru."); return; }

      setIsGenerating(true); setProgress(10); setStatusText("Membuat file video WEBM 9:16 dari frame UGC...");

      const videoBlob = await createNaturalMotionVideo({ frames: img.frames, width: 1080, height: 1920, fps: 30, secondsPerFrame: 0.9 });
      setProgress(95); downloadBlob(videoBlob, `AI_UGC_Video_${idx + 1}_${Date.now()}.webm`);
      setStatusText("Video berhasil diunduh."); setProgress(100);
      setTimeout(() => { setIsGenerating(false); setProgress(0); setStatusText(""); }, 1500);
    } catch (error) {
      console.error(error); setStatusText(error?.message || "Gagal membuat file video."); setIsGenerating(false); setProgress(0);
    }
  };

  const changeOutputFormat = (format) => {
    setOutputFormat(format);
    if (format === "video") setSelectedRatio("9:16 (1080x1920)");
  };

  return (
    <div className="flex flex-col h-screen bg-slate-950 text-slate-200 font-sans overflow-hidden selection:bg-indigo-500/30">
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes ugcBob { 0% { transform: scale(1.05) translateY(6px); } 50% { transform: scale(1.08) translateY(-6px); } 100% { transform: scale(1.06) translateY(4px); } }
        @keyframes presentLeft { 0% { transform: scale(1.08) translateX(10px) translateY(4px); } 100% { transform: scale(1.12) translateX(-14px) translateY(-6px); } }
        @keyframes presentRight { 0% { transform: scale(1.08) translateX(-10px) translateY(4px); } 100% { transform: scale(1.12) translateX(14px) translateY(-6px); } }
        @keyframes productShow { 0% { transform: scale(1.02); } 50% { transform: scale(1.1) translateY(-4px); } 100% { transform: scale(1.06) translateY(6px); } }
        @keyframes progressbar { 0% { width: 0%; } 100% { width: 100%; } }
        @keyframes shimmer { 100% { transform: translateX(100%); } }
        @keyframes float { 0% { transform: translateY(0px); } 50% { transform: translateY(-10px); } 100% { transform: translateY(0px); } }
        @keyframes slideRight { 0% { transform: translateX(-5px); opacity: 0; } 50% { opacity: 1; } 100% { transform: translateX(5px); opacity: 0; } }
        .motion-ugc-bob { animation: ugcBob 6.5s ease-in-out infinite; }
        .motion-present-left { animation: presentLeft 7s ease-in-out infinite alternate; }
        .motion-present-right { animation: presentRight 7s ease-in-out infinite alternate; }
        .motion-product-show { animation: productShow 6.8s ease-in-out infinite; }
        .motion-progress { animation: progressbar 8s linear infinite; }
        .glass-panel { background: rgba(15, 23, 42, 0.4); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .arrow-anim { animation: slideRight 1.5s infinite; }
      `}} />
      
      {/* HEADER - Premium Top Navigation */}
      <header className="h-16 flex-shrink-0 z-50 glass-panel border-b border-white/10 px-6 flex items-center justify-between">
        <div className="flex items-center gap-3 w-[300px]">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Camera className="w-4 h-4 text-white" />
          </div>
          <span className="text-sm font-bold text-white tracking-tight">AI Product Studio</span>
        </div>

        {/* Workflow Stepper */}
        <div className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-500">
          <span className={`flex items-center gap-2 transition-colors ${productImage.preview ? 'text-indigo-400' : 'text-slate-300'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${productImage.preview ? 'bg-indigo-500/20' : 'bg-slate-800'}`}>1</span> Upload
          </span>
          <ChevronRight className="w-3 h-3 text-slate-700" />
          <span className={`flex items-center gap-2 transition-colors ${selectedStyle ? 'text-indigo-400' : 'text-slate-500'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${selectedStyle ? 'bg-indigo-500/20' : 'bg-slate-800'}`}>2</span> Configure
          </span>
          <ChevronRight className="w-3 h-3 text-slate-700" />
          <span className={`flex items-center gap-2 transition-colors ${isGenerating ? 'text-purple-400' : 'text-slate-500'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${isGenerating ? 'bg-purple-500/20' : 'bg-slate-800'}`}>3</span> Generate
          </span>
          <ChevronRight className="w-3 h-3 text-slate-700" />
          <span className={`flex items-center gap-2 transition-colors ${generatedImages.length > 0 ? 'text-emerald-400' : 'text-slate-500'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${generatedImages.length > 0 ? 'bg-emerald-500/20' : 'bg-slate-800'}`}>4</span> Export
          </span>
        </div>

        <div className="flex items-center justify-end gap-4 w-[300px]">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium">
            <Coins className="w-3.5 h-3.5 text-amber-400" /> 1,240 Credits
          </div>
          <button className="relative p-2 text-slate-400 hover:text-white transition-colors">
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-pink-500 rounded-full border-2 border-slate-950"></span>
          </button>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 border border-white/10 overflow-hidden cursor-pointer">
            <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=Felix`} alt="User" className="w-full h-full object-cover" />
          </div>
        </div>
      </header>

      {/* 3-COLUMN LAYOUT */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* LEFT SIDEBAR - Configuration (320px) */}
        <aside className="w-full md:w-[320px] flex-shrink-0 flex flex-col h-full border-r border-white/10 glass-panel bg-slate-950/50 z-20">
          <div className="flex-1 overflow-y-auto hide-scrollbar pb-24">
            
            {/* 1. Asset Photo */}
            <div className="p-4 border-b border-white/5">
              <button onClick={() => toggleSection('asset')} className="flex items-center justify-between w-full text-xs font-bold text-indigo-400 uppercase tracking-wider mb-4">
                <span className="flex items-center gap-2"><ImageIcon className="w-3.5 h-3.5" /> 1. Asset Photo</span>
                {sections.asset ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
              
              {sections.asset && (
                <div className="space-y-3">
                  {/* Product Upload */}
                  <div 
                    className={`relative group overflow-hidden border border-dashed rounded-xl transition-all h-[100px] flex flex-col items-center justify-center cursor-pointer ${productImage.preview ? 'border-indigo-500/50 bg-indigo-500/5' : 'border-slate-700 hover:border-indigo-500/40 bg-slate-900/50'}`}
                    onClick={() => !productImage.preview && fileInputRef.current?.click()}
                  >
                    {productImage.preview ? (
                      <>
                        <img src={productImage.preview} alt="Product" className="absolute inset-0 w-full h-full object-contain p-2" />
                        <div className="absolute inset-0 bg-slate-950/85 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5">
                          <button type="button" onClick={(e) => { e.stopPropagation(); setProductImage({file:null, preview:null, base64:null, mimeType:null}); if (fileInputRef.current) fileInputRef.current.value = ""; }} className="p-2 bg-red-500/20 hover:bg-red-500/40 text-red-400 rounded-full transition-all"><Trash2 className="w-3.5 h-3.5" /></button>
                        </div>
                      </>
                    ) : (
                      <div className="text-center space-y-1"><Upload className="w-4 h-4 text-indigo-400 mx-auto" /><p className="text-[10px] font-medium text-slate-300">Upload Product Image *</p></div>
                    )}
                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'product')} />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {/* Character Upload */}
                    <div 
                      className={`relative group overflow-hidden border border-dashed rounded-xl transition-all h-[80px] flex flex-col items-center justify-center cursor-pointer ${characterImage.preview ? 'border-purple-500/50 bg-purple-500/5' : 'border-slate-700 hover:border-purple-500/40 bg-slate-900/50'}`}
                      onClick={() => !characterImage.preview && characterInputRef.current?.click()}
                    >
                      {characterImage.preview ? (
                        <>
                          <img src={characterImage.preview} alt="Model" className="absolute inset-0 w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-slate-950/85 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"><button type="button" onClick={(e) => { e.stopPropagation(); setCharacterImage({file:null, preview:null, base64:null, mimeType:null}); if (characterInputRef.current) characterInputRef.current.value = ""; }} className="p-1.5 bg-red-500/20 hover:bg-red-500/40 text-red-400 rounded-full transition-all"><Trash2 className="w-3 h-3" /></button></div>
                        </>
                      ) : (
                        <div className="text-center"><User className="w-3.5 h-3.5 text-purple-400 mx-auto mb-1" /><p className="text-[9px] text-slate-400">Model Face</p></div>
                      )}
                      <input type="file" ref={characterInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'character')} />
                    </div>

                    {/* Logo Upload */}
                    <div 
                      className={`relative group overflow-hidden border border-dashed rounded-xl transition-all h-[80px] flex flex-col items-center justify-center cursor-pointer ${logoImage.preview ? 'border-teal-500/50 bg-teal-500/5' : 'border-slate-700 hover:border-teal-500/40 bg-slate-900/50'}`}
                      onClick={() => !logoImage.preview && logoInputRef.current?.click()}
                    >
                      {logoImage.preview ? (
                        <>
                          <img src={logoImage.preview} alt="Logo" className="absolute inset-0 w-full h-full object-contain p-2" />
                          <div className="absolute inset-0 bg-slate-950/85 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"><button type="button" onClick={(e) => { e.stopPropagation(); setLogoImage({file:null, preview:null, base64:null, mimeType:null}); if (logoInputRef.current) logoInputRef.current.value = ""; }} className="p-1.5 bg-red-500/20 hover:bg-red-500/40 text-red-400 rounded-full transition-all"><Trash2 className="w-3 h-3" /></button></div>
                        </>
                      ) : (
                        <div className="text-center"><Settings className="w-3.5 h-3.5 text-teal-400 mx-auto mb-1" /><p className="text-[9px] text-slate-400">Brand Logo</p></div>
                      )}
                      <input type="file" ref={logoInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'logo')} />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 2. Configuration */}
            <div className="p-4 border-b border-white/5 relative">
              <button onClick={() => toggleSection('config')} className="flex items-center justify-between w-full text-xs font-bold text-indigo-400 uppercase tracking-wider mb-4">
                <span className="flex items-center gap-2"><Settings className="w-3.5 h-3.5" /> 2. Configuration</span>
                {sections.config ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
              
              {sections.config && (
                <div className="space-y-5">
                  {/* Output Format */}
                  <div>
                    <label className="text-[10px] font-semibold text-slate-500 uppercase block mb-2">Output Format</label>
                    <div className="flex bg-slate-900/50 p-1 rounded-xl border border-white/5">
                      <button onClick={() => changeOutputFormat("photo")} className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all ${outputFormat === "photo" ? 'bg-indigo-500/20 text-indigo-300 shadow-md' : 'text-slate-500 hover:text-slate-300'}`}>📸 Photo</button>
                      <button onClick={() => changeOutputFormat("video")} className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all ${outputFormat === "video" ? 'bg-pink-500/20 text-pink-300 shadow-md' : 'text-slate-500 hover:text-slate-300'}`}>🎥 Video</button>
                    </div>
                  </div>

                  {/* Aspect Ratio */}
                  <div>
                    <label className="text-[10px] font-semibold text-slate-500 uppercase block mb-2">Aspect Ratio</label>
                    <div className="grid grid-cols-2 gap-1.5">
                      {RATIOS.map(ratio => (
                        <button key={ratio} onClick={() => setSelectedRatio(ratio)} className={`py-1.5 rounded-lg text-[10px] font-medium transition-all border ${selectedRatio === ratio ? 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30' : 'bg-slate-900/30 text-slate-400 border-transparent hover:bg-slate-800'}`}>
                          {ratio.split(' ')[0]}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Visual Style Cards */}
                  <div>
                    <label className="text-[10px] font-semibold text-slate-500 uppercase block mb-2">Visual Style</label>
                    <div className="grid grid-cols-2 gap-2">
                      {STYLES.map(style => (
                        <button key={style} onClick={() => setSelectedStyle(style)} className={`relative flex flex-col items-center justify-center p-3 rounded-xl border transition-all overflow-hidden group ${selectedStyle === style ? 'bg-indigo-500/10 border-indigo-500/50 shadow-[0_0_15px_rgba(99,102,241,0.15)]' : 'bg-slate-900/40 border-white/5 hover:border-white/20'}`}>
                          <div className={`absolute inset-0 bg-gradient-to-br opacity-20 ${selectedStyle === style ? 'from-indigo-500 to-purple-600' : 'from-slate-700 to-slate-800'}`}></div>
                          <span className={`relative z-10 text-[10px] font-medium text-center leading-tight ${selectedStyle === style ? 'text-indigo-200' : 'text-slate-400 group-hover:text-slate-300'}`}>{style}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Presets */}
                  <div className="relative" ref={dropdownRef}>
                    <label className="text-[10px] font-semibold text-slate-500 uppercase block mb-2">Quick Preset</label>
                    <button onClick={() => setIsPresetOpen(!isPresetOpen)} className="w-full bg-slate-900/50 border border-white/5 rounded-xl p-2.5 text-xs text-slate-300 flex items-center justify-between hover:border-indigo-500/30 transition-all">
                      <span className="font-medium text-indigo-300">{selectedPreset}</span>
                      <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isPresetOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isPresetOpen && (
                      <div className="absolute z-30 mt-2 w-full max-h-[250px] overflow-y-auto bg-slate-900 border border-white/10 rounded-xl shadow-2xl p-2 space-y-1">
                        {["Shopee Style", "Tokopedia Style", "Instagram Feed", "Instagram Ads Campaign", "TikTok Shop Style", "TikTok Viral Video Frame", "YouTube Thumbnail Style", "Fashion Campaign", "Beauty Commercial", "Luxury Brand Shoot"].map(preset => (
                          <button key={preset} onClick={() => { setSelectedPreset(preset); setIsPresetOpen(false); }} className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-all ${selectedPreset === preset ? 'bg-indigo-500/20 text-indigo-300' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`}>{preset}</button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* 3. Instructions */}
            <div className="p-4 border-b border-white/5">
              <button onClick={() => toggleSection('prompt')} className="flex items-center justify-between w-full text-xs font-bold text-indigo-400 uppercase tracking-wider mb-4">
                <span className="flex items-center gap-2"><Wand2 className="w-3.5 h-3.5" /> 3. Instructions</span>
                {sections.prompt ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
              
              {sections.prompt && (
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-semibold text-slate-500 uppercase block mb-2">Custom Character</label>
                    <input type="text" value={customCharacter} onChange={(e) => setCustomCharacter(e.target.value)} placeholder="e.g., Asian female, 25 years old..." className="w-full bg-slate-900/50 border border-white/5 rounded-xl p-2.5 text-xs text-slate-300 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50 transition-all" />
                  </div>
                  <div className="relative">
                    <label className="text-[10px] font-semibold text-slate-500 uppercase block mb-2">Custom Prompt</label>
                    <textarea value={customPrompt} onChange={(e) => setCustomPrompt(e.target.value)} placeholder="e.g., product placed on a wooden table..." className="w-full bg-slate-900/50 border border-white/5 rounded-xl p-2.5 text-xs text-slate-300 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50 transition-all min-h-[80px] resize-none pb-10" />
                    <button onClick={enhancePrompt} disabled={!customPrompt || isEnhancing} className="absolute bottom-2 right-2 px-2 py-1 bg-indigo-500/20 hover:bg-indigo-500/40 text-indigo-300 disabled:opacity-50 text-[10px] font-medium rounded-md flex items-center gap-1 transition-all">
                      {isEnhancing ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />} Enhance
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sticky Generate Button */}
          <div className="absolute bottom-0 left-0 w-full p-4 bg-slate-950/80 backdrop-blur-md border-t border-white/10">
            <button onClick={handleGenerateJob} disabled={!productImage.preview || isGenerating} className="w-full relative flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:from-slate-800 disabled:to-slate-800 disabled:text-slate-500 text-white font-semibold py-3.5 rounded-xl shadow-[0_0_30px_rgba(99,102,241,0.2)] disabled:shadow-none transition-all overflow-hidden group">
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
              <span className="relative z-10 flex items-center gap-2 text-sm">
                {isGenerating ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating...</> : <><Sparkles className="w-4 h-4" /> {outputFormat === "video" ? "Generate Video" : "Generate 6 Photos"} <span className="opacity-60 text-[10px] ml-1">(10 Cr)</span></>}
              </span>
            </button>
          </div>
        </aside>

        {/* CENTER WORKSPACE - Preview & Gallery (Flexible) */}
        <main className="flex-1 flex flex-col h-full overflow-y-auto bg-[#0a0f1c] relative z-10 hide-scrollbar">
          
          <div className="max-w-[1200px] mx-auto w-full p-6 lg:p-8 space-y-10">
            
            {/* AI Preview Flow Container */}
            <div className="w-full flex flex-col items-center justify-center min-h-[300px] relative mt-4">
              {!productImage.preview && generatedImages.length === 0 ? (
                // Empty State
                <div className="flex flex-col items-center text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <div className="w-40 h-40 mb-8 relative" style={{animation: 'float 6s ease-in-out infinite'}}>
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-full blur-3xl"></div>
                    <div className="w-full h-full border border-white/10 rounded-3xl bg-slate-900/50 backdrop-blur-xl flex items-center justify-center shadow-2xl">
                       <Zap className="w-16 h-16 text-indigo-400 opacity-80" />
                    </div>
                  </div>
                  <h2 className="text-3xl font-bold text-white mb-3 tracking-tight">Start Creating</h2>
                  <p className="text-sm text-slate-400 max-w-[340px] leading-relaxed">Upload your product and let AI create commercial-quality visuals in seconds.</p>
                </div>
              ) : (
                // Preview Flow
                <div className="w-full glass-panel border border-white/5 rounded-3xl p-8 flex items-center justify-between gap-4 max-w-[800px] mx-auto shadow-2xl">
                  {/* Original Box */}
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-24 h-24 rounded-2xl bg-slate-900 border border-white/10 flex items-center justify-center overflow-hidden">
                      {productImage.preview ? <img src={productImage.preview} alt="Origin" className="w-full h-full object-cover"/> : <ImageIcon className="w-6 h-6 text-slate-700"/>}
                    </div>
                    <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">Original</span>
                  </div>
                  
                  <div className="flex-1 flex items-center justify-center opacity-50"><div className="h-[1px] w-full bg-gradient-to-r from-transparent via-indigo-500 to-transparent relative"><ArrowRight className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-400 arrow-anim"/></div></div>

                  {/* Config Box */}
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-24 h-24 rounded-2xl bg-slate-900 border border-white/10 flex flex-col items-center justify-center p-2 text-center">
                       <Settings className="w-5 h-5 text-indigo-400 mb-2"/>
                       <span className="text-[9px] text-slate-300 truncate w-full">{selectedStyle}</span>
                       <span className="text-[8px] text-slate-500">{selectedRatio.split(' ')[0]}</span>
                    </div>
                    <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">Style applied</span>
                  </div>

                  <div className="flex-1 flex items-center justify-center opacity-50"><div className="h-[1px] w-full bg-gradient-to-r from-transparent via-purple-500 to-transparent relative"><ArrowRight className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400 arrow-anim"/></div></div>

                  {/* Target Box */}
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-24 h-24 rounded-2xl border border-white/10 flex items-center justify-center overflow-hidden relative shadow-[0_0_20px_rgba(99,102,241,0.2)]">
                      {isGenerating ? (
                        <div className="absolute inset-0 bg-slate-800 animate-pulse flex items-center justify-center"><Loader2 className="w-5 h-5 animate-spin text-indigo-400"/></div>
                      ) : generatedImages.length > 0 && generatedImages[0].url ? (
                        <img src={generatedImages[0].url} alt="Result" className="w-full h-full object-cover"/>
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 backdrop-blur-md"></div>
                      )}
                    </div>
                    <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">AI Result</span>
                  </div>
                </div>
              )}
            </div>

            {/* Gallery Section */}
            {generatedImages.length > 0 && (
              <div className="space-y-6 animate-in fade-in duration-500">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                    Recent Generations <span className="text-xs font-medium px-2 py-0.5 bg-white/5 rounded-md text-slate-400">{generatedImages.length} items</span>
                  </h3>
                  {!isGenerating && (
                    <button onClick={downloadZip} className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white text-xs font-semibold rounded-lg transition-colors border border-white/10">
                      <Archive className="w-3.5 h-3.5" /> Download All
                    </button>
                  )}
                </div>

                {/* Masonry Grid */}
                <div className="columns-1 md:columns-2 xl:columns-3 gap-6 space-y-6">
                  {generatedImages.map((img, idx) => (
                    outputFormat === "video" ? (
                      <UGCVideoPlayer key={idx} img={img} idx={idx} onDownloadVideo={downloadUGCVideo} />
                    ) : (
                      <div key={idx} className="break-inside-avoid group flex flex-col bg-slate-900/40 backdrop-blur-md rounded-2xl overflow-hidden border border-white/5 hover:border-indigo-500/30 transition-all hover:shadow-[0_8px_30px_rgb(99,102,241,0.15)] relative">
                        <div className="relative overflow-hidden w-full">
                          {img.url ? (
                            <img src={img.url} alt={img.angle} className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-[1.02]" />
                          ) : img.error ? (
                            <div className="aspect-[4/5] flex items-center justify-center text-xs text-red-400"><AlertCircle className="w-5 h-5 mr-2" /> Error</div>
                          ) : (
                            <div className="aspect-[4/5] flex items-center justify-center text-slate-500"><Loader2 className="w-6 h-6 animate-spin text-indigo-500" /></div>
                          )}
                          
                          {/* Hover Overlay Cards */}
                          {img.url && (
                            <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4 backdrop-blur-[2px]">
                               <div className="flex justify-end gap-2">
                                 <button className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white transition-all"><Heart className="w-3.5 h-3.5" /></button>
                                 <button className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white transition-all"><Share2 className="w-3.5 h-3.5" /></button>
                               </div>
                               <div className="flex justify-center gap-3 items-center translate-y-4 group-hover:translate-y-0 transition-transform duration-300 ease-out">
                                 <button className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white transition-all hover:scale-110" title="Regenerate"><RefreshCw className="w-4 h-4" /></button>
                                 <button onClick={() => downloadSingle(img.url, img.angle)} className="w-12 h-12 rounded-full bg-indigo-500 hover:bg-indigo-400 shadow-lg shadow-indigo-500/30 flex items-center justify-center text-white transition-all hover:scale-110" title="Download"><Download className="w-5 h-5" /></button>
                                 <button className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white transition-all hover:scale-110" title="Compare"><Layers className="w-4 h-4" /></button>
                               </div>
                               <div className="text-center">
                                 <button onClick={() => setActivePromptPreview(activePromptPreview === idx ? null : idx)} className="text-[10px] font-medium text-white/70 hover:text-white underline decoration-white/30 underline-offset-4">View Prompt</button>
                               </div>
                            </div>
                          )}
                        </div>
                        
                        <div className="p-4 bg-slate-900/60 backdrop-blur-lg border-t border-white/5">
                          <p className="text-sm font-bold text-slate-200 truncate">{img.angle}</p>
                          <p className="text-[10px] text-slate-500 mt-1 flex items-center gap-2">
                             <span>{selectedStyle}</span> • <span>{selectedRatio.split(' ')[0]}</span>
                          </p>
                        </div>

                        {activePromptPreview === idx && img.prompt && (
                          <div className="absolute inset-x-0 bottom-0 bg-slate-950/95 backdrop-blur-xl p-4 border-t border-indigo-500/30 overflow-y-auto max-h-[60%] animate-in slide-in-from-bottom-2 z-10 shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
                            <div className="flex justify-between items-center mb-3">
                              <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">Engine Prompt</span>
                              <button onClick={() => setActivePromptPreview(null)}><X className="w-4 h-4 text-slate-400 hover:text-white" /></button>
                            </div>
                            <p className="text-[10px] text-slate-300 leading-relaxed font-mono whitespace-pre-wrap">{img.prompt}</p>
                          </div>
                        )}
                      </div>
                    )
                  ))}
                  
                  {isGenerating && Array.from({ length: Math.max(0, 6 - generatedImages.length) }).map((_, i) => (
                    <div key={`skel-${i}`} className="break-inside-avoid mb-6 bg-slate-900/40 rounded-2xl overflow-hidden border border-white/5 animate-pulse flex flex-col">
                      <div className="aspect-[4/5] bg-slate-800/50 relative overflow-hidden">
                         <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
                      </div>
                      <div className="p-4"><div className="h-4 bg-slate-800 rounded w-2/3"></div></div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Pad bottom for scrolling */}
            <div className="h-10 w-full"></div>
          </div>
        </main>

        {/* RIGHT SIDEBAR - Timeline, History, Assistant (320px) */}
        <aside className="hidden lg:flex w-[320px] flex-shrink-0 flex-col h-full border-l border-white/10 glass-panel bg-slate-950/50 z-20">
          <div className="flex-1 overflow-y-auto hide-scrollbar p-5 space-y-8">
            
            {/* Timeline */}
            <div>
              <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-5 flex items-center gap-2"><Sparkles className="w-3.5 h-3.5" /> Activity Timeline</h3>
              <div className="space-y-4 pl-2 border-l border-white/10 ml-2">
                <div className="relative pl-5">
                  <div className={`absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full border-2 ${productImage.preview ? 'bg-indigo-500 border-indigo-500' : 'bg-slate-900 border-slate-600'}`}></div>
                  <p className={`text-xs font-medium ${productImage.preview ? 'text-slate-200' : 'text-slate-500'}`}>Asset Uploaded</p>
                </div>
                <div className="relative pl-5">
                  <div className={`absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full border-2 ${productImage.preview && selectedStyle ? 'bg-indigo-500 border-indigo-500' : 'bg-slate-900 border-slate-600'}`}></div>
                  <p className={`text-xs font-medium ${productImage.preview && selectedStyle ? 'text-slate-200' : 'text-slate-500'}`}>Style Applied</p>
                </div>
                <div className="relative pl-5">
                  <div className={`absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full border-2 ${isGenerating ? 'bg-purple-500 border-purple-500 animate-pulse' : generatedImages.length>0 ? 'bg-indigo-500 border-indigo-500' : 'bg-slate-900 border-slate-600'}`}></div>
                  <p className={`text-xs font-medium ${isGenerating ? 'text-purple-300' : generatedImages.length>0 ? 'text-slate-200' : 'text-slate-500'}`}>{isGenerating ? 'Generating...' : 'Generation'}</p>
                  {isGenerating && <p className="text-[10px] text-purple-400/70 mt-1">{statusText}</p>}
                </div>
                <div className="relative pl-5">
                  <div className={`absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full border-2 ${generatedImages.length > 0 && !isGenerating ? 'bg-emerald-500 border-emerald-500' : 'bg-slate-900 border-slate-600'}`}></div>
                  <p className={`text-xs font-medium ${generatedImages.length > 0 && !isGenerating ? 'text-emerald-400' : 'text-slate-500'}`}>Export Ready</p>
                </div>
              </div>
            </div>

            <hr className="border-white/5" />

            {/* History */}
            <div>
              <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-4 flex items-center gap-2"><History className="w-3.5 h-3.5" /> History</h3>
              {history.length === 0 ? (
                <p className="text-[10px] text-slate-500 text-center py-4 bg-slate-900/30 rounded-xl border border-white/5">No previous projects found.</p>
              ) : (
                <div className="space-y-3">
                  {history.slice(0, 3).map((item) => (
                    <div key={item.id} className="bg-slate-900/40 border border-white/5 rounded-xl p-3 hover:bg-slate-900 transition-colors cursor-pointer group">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[9px] font-bold text-indigo-300 bg-indigo-500/10 px-1.5 py-0.5 rounded">{item.category || "Project"}</span>
                        <span className="text-[8px] text-slate-500">{item.timestamp.split(',')[0]}</span>
                      </div>
                      <div className="flex gap-1 overflow-hidden rounded mb-2">
                         {item.results.slice(0,4).map((r, i) => (
                           r.url ? <img key={i} src={r.url} alt="" className="w-8 h-8 object-cover rounded-[2px]" /> : <div key={i} className="w-8 h-8 bg-slate-800 rounded-[2px]"></div>
                         ))}
                      </div>
                      <button onClick={() => {
                          setGeneratedImages(item.results); setDetectedCategory(item.category); setSelectedStyle(item.style); setSelectedPreset(item.preset); setSelectedRatio(item.ratio);
                          if(item.outputFormat) setOutputFormat(item.outputFormat);
                          setCustomPrompt(item.customPrompt || ""); setCustomCharacter(item.customCharacter || "");
                      }} className="text-[9px] font-semibold text-slate-400 group-hover:text-white transition-colors w-full text-left">Load Project &rarr;</button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <hr className="border-white/5" />

            {/* AI Assistant */}
            <div>
              <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-4 flex items-center gap-2"><Sparkles className="w-3.5 h-3.5" /> AI Assistant</h3>
              <div className="space-y-2">
                <button onClick={() => setSelectedStyle(pickRandom(STYLES))} className="w-full py-2.5 px-3 bg-slate-900/50 hover:bg-indigo-500/10 border border-white/5 hover:border-indigo-500/30 rounded-xl text-xs font-medium text-slate-300 text-left flex items-center justify-between transition-all group">
                   Suggest Visual Style <ChevronRight className="w-3 h-3 text-slate-600 group-hover:text-indigo-400 transition-colors" />
                </button>
                <button onClick={enhancePrompt} disabled={isEnhancing} className="w-full py-2.5 px-3 bg-slate-900/50 hover:bg-purple-500/10 border border-white/5 hover:border-purple-500/30 rounded-xl text-xs font-medium text-slate-300 text-left flex items-center justify-between transition-all group disabled:opacity-50">
                   Improve Current Prompt <ChevronRight className="w-3 h-3 text-slate-600 group-hover:text-purple-400 transition-colors" />
                </button>
                <button onClick={handleGenerateJob} disabled={!productImage.preview || isGenerating} className="w-full py-2.5 px-3 bg-slate-900/50 hover:bg-emerald-500/10 border border-white/5 hover:border-emerald-500/30 rounded-xl text-xs font-medium text-slate-300 text-left flex items-center justify-between transition-all group disabled:opacity-50">
                   Generate Variations <ChevronRight className="w-3 h-3 text-slate-600 group-hover:text-emerald-400 transition-colors" />
                </button>
              </div>
            </div>

          </div>
        </aside>
      </div>

    </div>
  );
}