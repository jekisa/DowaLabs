interface PasswordResetEmailInput {
  to: string;
  name: string;
  resetUrl: string;
}

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "'": "&#39;",
      '"': "&quot;",
    };
    return entities[character];
  });
}

export function isEmailDeliveryConfigured() {
  return Boolean(process.env.RESEND_API_KEY && process.env.RESEND_FROM_EMAIL);
}

export async function sendPasswordResetEmail({
  to,
  name,
  resetUrl,
}: PasswordResetEmailInput) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;

  if (!apiKey || !from) {
    throw new Error("Email reset password belum dikonfigurasi");
  }

  const safeName = escapeHtml(name);
  const safeResetUrl = escapeHtml(resetUrl);
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "User-Agent": "dowalabs-membership/1.0",
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject: "Reset password akun DowaLabs",
      html: `
        <div style="font-family:Arial,sans-serif;line-height:1.6;color:#172033;max-width:560px;margin:auto">
          <h1 style="font-size:24px">Reset password DowaLabs</h1>
          <p>Halo ${safeName},</p>
          <p>Kami menerima permintaan untuk mengganti password akun Anda.</p>
          <p style="margin:28px 0">
            <a href="${safeResetUrl}" style="background:#f6bd42;color:#111827;padding:12px 20px;border-radius:8px;text-decoration:none;font-weight:700">Buat password baru</a>
          </p>
          <p>Tautan ini hanya dapat digunakan sekali dan akan kedaluwarsa dalam 30 menit.</p>
          <p>Jika Anda tidak meminta reset password, abaikan email ini. Password Anda tidak akan berubah.</p>
        </div>
      `,
      text: `Halo ${name}, buka tautan berikut untuk membuat password baru: ${resetUrl}\n\nTautan berlaku selama 30 menit dan hanya dapat digunakan sekali.`,
    }),
    signal: AbortSignal.timeout(10_000),
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`Resend gagal (${response.status}): ${details.slice(0, 300)}`);
  }
}
