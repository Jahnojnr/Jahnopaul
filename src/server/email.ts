import "server-only";

/**
 * Contact notification delivery through Resend's HTTP API.
 *
 * The REST endpoint is used directly so the project does not carry an SDK it
 * does not otherwise need. Email is optional: an inquiry is stored even when
 * delivery is not configured, so nothing is lost.
 */

type InquiryEmail = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

export function isEmailConfigured() {
  return Boolean(
    process.env.RESEND_API_KEY &&
      process.env.CONTACT_FROM_EMAIL &&
      process.env.CONTACT_TO_EMAIL,
  );
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function sendInquiryNotification(inquiry: InquiryEmail) {
  if (!isEmailConfigured()) {
    return { ok: false as const, skipped: true, message: "Email delivery is not configured." };
  }

  const safeMessage = escapeHtml(inquiry.message).replace(/\n/g, "<br />");

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.CONTACT_FROM_EMAIL,
      to: [process.env.CONTACT_TO_EMAIL],
      reply_to: inquiry.email,
      subject: `Portfolio inquiry: ${inquiry.subject}`,
      text: [
        `From: ${inquiry.name} <${inquiry.email}>`,
        `Subject: ${inquiry.subject}`,
        "",
        inquiry.message,
      ].join("\n"),
      html: [
        `<p><strong>From:</strong> ${escapeHtml(inquiry.name)} &lt;${escapeHtml(inquiry.email)}&gt;</p>`,
        `<p><strong>Subject:</strong> ${escapeHtml(inquiry.subject)}</p>`,
        `<hr />`,
        `<p>${safeMessage}</p>`,
      ].join(""),
    }),
  });

  if (!response.ok) {
    return {
      ok: false as const,
      skipped: false,
      message: `Resend rejected the notification (${response.status}).`,
    };
  }

  return { ok: true as const, skipped: false, message: "Notification sent." };
}
