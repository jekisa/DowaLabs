"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Banknote, Link2, Loader2, Save } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface SettingsData {
  canvasUrl: string;
  backgroundRemoverUrl: string;
  colorGradingUrl: string;
  portraitStyleUrl: string;
  promptAiUrl: string;
  adminWhatsapp: string;
  proPrice: number;
  bankName: string;
  bankAccountNumber: string;
  bankAccountHolder: string;
}

export function SettingsForm({ initial }: { initial: SettingsData }) {
  const [form, setForm] = useState<SettingsData>(initial);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function update<K extends keyof SettingsData>(
    key: K,
    value: SettingsData[K]
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setErrors({});
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          canvasUrl: form.canvasUrl,
          backgroundRemoverUrl: form.backgroundRemoverUrl,
          colorGradingUrl: form.colorGradingUrl,
          portraitStyleUrl: form.portraitStyleUrl,
          promptAiUrl: form.promptAiUrl,
          adminWhatsapp: form.adminWhatsapp,
          proPrice: Number(form.proPrice),
          bankName: form.bankName,
          bankAccountNumber: form.bankAccountNumber,
          bankAccountHolder: form.bankAccountHolder,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        if (data.details && typeof data.details === "object")
          setErrors(data.details);
        toast.error(data.error || "Gagal menyimpan pengaturan");
        return;
      }
      toast.success("Pengaturan tersimpan");
    } catch {
      toast.error("Terjadi kesalahan jaringan");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <Card className="rounded-[24px] border-white/[0.06] bg-white/[0.028] shadow-[0_24px_70px_rgba(0,0,0,0.2)]">
        <CardHeader className="border-b border-white/[0.05] p-6 sm:p-7">
          <div className="flex items-center gap-3"><span className="grid h-11 w-11 place-items-center rounded-2xl bg-indigo-400/10 text-indigo-300"><Link2 className="h-5 w-5" /></span><div><CardTitle className="text-xl">Gemini Canvas Tools</CardTitle>
          <CardDescription>
            Lima link tool hanya dibuka untuk member aktif.
          </CardDescription></div></div>
        </CardHeader>
        <CardContent className="grid gap-5 p-6 sm:grid-cols-2 sm:p-7">
          <Field
            label="Product Studio URL"
            id="canvasUrl"
            value={form.canvasUrl}
            placeholder="https://..."
            error={errors.canvasUrl}
            onChange={(v) => update("canvasUrl", v)}
          />
          <Field
            label="Background Remover URL"
            id="backgroundRemoverUrl"
            value={form.backgroundRemoverUrl}
            placeholder="https://..."
            error={errors.backgroundRemoverUrl}
            onChange={(v) => update("backgroundRemoverUrl", v)}
          />
          <Field
            label="Color Grading URL"
            id="colorGradingUrl"
            value={form.colorGradingUrl}
            placeholder="https://..."
            error={errors.colorGradingUrl}
            onChange={(v) => update("colorGradingUrl", v)}
          />
          <Field
            label="Potrait Style URL"
            id="portraitStyleUrl"
            value={form.portraitStyleUrl}
            placeholder="https://..."
            error={errors.portraitStyleUrl}
            onChange={(v) => update("portraitStyleUrl", v)}
          />
          <Field
            label="5000 Prompt AI URL"
            id="promptAiUrl"
            value={form.promptAiUrl}
            placeholder="https://..."
            error={errors.promptAiUrl}
            onChange={(v) => update("promptAiUrl", v)}
          />
          <Field
            label="Admin WhatsApp"
            id="adminWhatsapp"
            value={form.adminWhatsapp}
            placeholder="628123456789"
            error={errors.adminWhatsapp}
            onChange={(v) => update("adminWhatsapp", v)}
          />
        </CardContent>
      </Card>

      <Card className="rounded-[24px] border-white/[0.06] bg-white/[0.028] shadow-[0_24px_70px_rgba(0,0,0,0.2)]">
        <CardHeader className="border-b border-white/[0.05] p-6 sm:p-7">
          <div className="flex items-center gap-3"><span className="grid h-11 w-11 place-items-center rounded-2xl bg-amber-300/10 text-amber-300"><Banknote className="h-5 w-5" /></span><div><CardTitle className="text-xl">Manual Bank Transfer</CardTitle>
          <CardDescription>
            Rekening perusahaan yang ditampilkan pada invoice dan harga paket.
          </CardDescription></div></div>
        </CardHeader>
        <CardContent className="grid gap-5 p-6 sm:grid-cols-2 sm:p-7">
          <Field
            label="Nama Bank"
            id="bankName"
            value={form.bankName}
            placeholder="Contoh: BCA"
            error={errors.bankName}
            onChange={(v) => update("bankName", v)}
          />
          <Field
            label="Nomor Rekening"
            id="bankAccountNumber"
            value={form.bankAccountNumber}
            placeholder="1234567890"
            error={errors.bankAccountNumber}
            onChange={(v) => update("bankAccountNumber", v)}
          />
          <Field
            label="Nama Pemilik Rekening"
            id="bankAccountHolder"
            value={form.bankAccountHolder}
            placeholder="PT DowaLabs Indonesia"
            error={errors.bankAccountHolder}
            onChange={(v) => update("bankAccountHolder", v)}
          />
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="proPrice">Harga Pro (Rp)</Label>
            <Input
              id="proPrice"
              type="number"
              readOnly
              className="h-12 rounded-2xl border-white/[0.07] bg-black/10 text-amber-300 focus-visible:ring-amber-300/40"
              value={form.proPrice}
            />
            <p className="text-xs text-slate-500">Harga paket tunggal ditetapkan Rp30.000 untuk 30 hari.</p>
          </div>
        </CardContent>
      </Card>

      <div className="sticky bottom-4 flex justify-end rounded-[20px] border border-white/[0.07] bg-[#0b0f1b]/85 p-3 shadow-2xl backdrop-blur-xl">
      <Button type="submit" disabled={saving} className="h-11 rounded-xl px-6">
        {saving && <Loader2 className="h-4 w-4 animate-spin" />}
        {!saving && <Save className="h-4 w-4" />}
        {saving ? "Menyimpan..." : "Simpan Pengaturan"}
      </Button>
      </div>
    </form>
  );
}

function Field({
  label,
  id,
  value,
  placeholder,
  error,
  onChange,
}: {
  label: string;
  id: string;
  value: string;
  placeholder?: string;
  error?: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        value={value}
        placeholder={placeholder}
        className="h-12 rounded-2xl border-white/[0.07] bg-black/10 focus-visible:ring-amber-300/40"
        onChange={(e) => onChange(e.target.value)}
      />
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}
