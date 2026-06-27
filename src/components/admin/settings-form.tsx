"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
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
  lynkBasicUrl: string;
  lynkProUrl: string;
  adminWhatsapp: string;
  basicPrice: number;
  proPrice: number;
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
          lynkBasicUrl: form.lynkBasicUrl,
          lynkProUrl: form.lynkProUrl,
          adminWhatsapp: form.adminWhatsapp,
          basicPrice: Number(form.basicPrice),
          proPrice: Number(form.proPrice),
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
      <Card>
        <CardHeader>
          <CardTitle>Canvas & Kontak</CardTitle>
          <CardDescription>
            Link Canvas hanya dibuka untuk member aktif.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Field
            label="Google / Gemini Canvas URL"
            id="canvasUrl"
            value={form.canvasUrl}
            placeholder="https://..."
            error={errors.canvasUrl}
            onChange={(v) => update("canvasUrl", v)}
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

      <Card>
        <CardHeader>
          <CardTitle>Pembayaran Lynk</CardTitle>
          <CardDescription>
            Link Lynk.id dan harga untuk masing-masing paket.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Field
            label="Lynk Basic URL"
            id="lynkBasicUrl"
            value={form.lynkBasicUrl}
            placeholder="https://lynk.id/..."
            error={errors.lynkBasicUrl}
            onChange={(v) => update("lynkBasicUrl", v)}
          />
          <Field
            label="Lynk Pro URL"
            id="lynkProUrl"
            value={form.lynkProUrl}
            placeholder="https://lynk.id/..."
            error={errors.lynkProUrl}
            onChange={(v) => update("lynkProUrl", v)}
          />
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="basicPrice">Harga Basic (Rp)</Label>
              <Input
                id="basicPrice"
                type="number"
                min={0}
                value={form.basicPrice}
                onChange={(e) =>
                  update("basicPrice", Number(e.target.value))
                }
              />
              {errors.basicPrice && (
                <p className="text-xs text-red-400">{errors.basicPrice}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="proPrice">Harga Pro (Rp)</Label>
              <Input
                id="proPrice"
                type="number"
                min={0}
                value={form.proPrice}
                onChange={(e) => update("proPrice", Number(e.target.value))}
              />
              {errors.proPrice && (
                <p className="text-xs text-red-400">{errors.proPrice}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Button type="submit" disabled={saving}>
        {saving && <Loader2 className="h-4 w-4 animate-spin" />}
        Simpan Pengaturan
      </Button>
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
        onChange={(e) => onChange(e.target.value)}
      />
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}
