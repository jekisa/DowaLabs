"use client";

export type FieldErrors = Record<string, string>;

/** api.ts `fail()` puts the zod field->message map in `details`; anything else
 *  (a 401, a 500) sends no map, so fall back to an empty one. */
export function fieldErrorsFrom(details: unknown): FieldErrors {
  if (!details || typeof details !== "object" || Array.isArray(details)) return {};
  const out: FieldErrors = {};
  for (const [key, value] of Object.entries(details as Record<string, unknown>)) {
    if (typeof value === "string") out[key] = value;
  }
  return out;
}

export function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="text-sm text-red-600">
      {message}
    </p>
  );
}
