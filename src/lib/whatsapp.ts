export function normalizeWhatsapp(value: string | null | undefined): string {
  const digits = (value ?? "").replace(/[\s+\-()]/g, "").replace(/\D/g, "");
  if (digits.startsWith("0")) return "62" + digits.slice(1);
  if (digits.startsWith("62")) return digits;
  return digits;
}
