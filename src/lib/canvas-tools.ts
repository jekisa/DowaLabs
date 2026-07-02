export interface CanvasLinks {
  productStudio: string | null;
  backgroundRemover: string | null;
  colorGrading: string | null;
  portraitStyle: string | null;
  promptAi: string | null;
}

export type CanvasToolKey = keyof CanvasLinks;

export const CANVAS_TOOLS: Array<{
  key: CanvasToolKey;
  label: string;
  description: string;
}> = [
  {
    key: "productStudio",
    label: "Product Studio",
    description: "Visual produk premium",
  },
  {
    key: "backgroundRemover",
    label: "Background Remover",
    description: "Hapus latar produk",
  },
  {
    key: "colorGrading",
    label: "Color Grading",
    description: "Warna yang konsisten",
  },
  {
    key: "portraitStyle",
    label: "Potrait Style",
    description: "Gaya portrait kreatif",
  },
  {
    key: "promptAi",
    label: "5000 Prompt AI",
    description: "Library prompt siap pakai",
  },
];

export const EMPTY_CANVAS_LINKS: CanvasLinks = {
  productStudio: null,
  backgroundRemover: null,
  colorGrading: null,
  portraitStyle: null,
  promptAi: null,
};
