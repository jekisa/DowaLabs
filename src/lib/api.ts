import { NextResponse } from "next/server";
import { z } from "zod";

export function json<T>(data: T, init?: ResponseInit) {
  return NextResponse.json(data, init);
}

export function ok<T>(data: T) {
  const fields =
    typeof data === "object" && data !== null ? data : { value: data };
  return NextResponse.json({ success: true, ok: true, ...fields, data });
}

export function fail(message: string, status = 400, extra?: unknown) {
  return NextResponse.json(
    { success: false, ok: false, error: message, details: extra },
    { status }
  );
}

/** Turn a ZodError into a flat field->message map for the client. */
export function zodErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".") || "_";
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}
