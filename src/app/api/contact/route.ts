import { NextResponse } from "next/server";
import { clientKeyFromHeaders, rateLimit } from "@/lib/security/rate-limit";
import { fieldErrors } from "@/lib/validation/common";
import { contactSchema } from "@/lib/validation/contact";
import {
  createSupabaseAdminClient,
  hasSupabaseServiceAccess,
} from "@/lib/supabase/admin";
import { isEmailConfigured, sendInquiryNotification } from "@/server/email";

const WINDOW_MS = 10 * 60 * 1000;
const MAX_SUBMISSIONS = 5;

export async function POST(request: Request) {
  const key = await clientKeyFromHeaders(request.headers);
  const limit = rateLimit(`contact:${key}`, {
    limit: MAX_SUBMISSIONS,
    windowMs: WINDOW_MS,
  });

  if (!limit.allowed) {
    return NextResponse.json(
      {
        ok: false,
        message: "Too many submissions from this connection. Please try again shortly.",
      },
      {
        status: 429,
        headers: { "Retry-After": String(limit.retryAfterSeconds) },
      },
    );
  }

  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, message: "The submission could not be read." },
      { status: 400 },
    );
  }

  const parsed = contactSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        message: "Check the highlighted fields and try again.",
        errors: fieldErrors(parsed.error),
      },
      { status: 422 },
    );
  }

  const inquiry = parsed.data;

  // Honeypot: a filled field means an automated submission. Respond as if it
  // succeeded so the bot learns nothing, but store and send nothing.
  if (inquiry.company.length > 0) {
    return NextResponse.json({ ok: true, message: "Thank you." });
  }

  if (!hasSupabaseServiceAccess() && !isEmailConfigured()) {
    return NextResponse.json(
      {
        ok: false,
        message:
          "The contact channel is not configured yet. Add Supabase or Resend credentials to the environment to receive submissions.",
      },
      { status: 503 },
    );
  }

  let stored = false;

  if (hasSupabaseServiceAccess()) {
    try {
      const supabase = createSupabaseAdminClient();
      const { error } = await supabase.from("contact_inquiries").insert({
        name: inquiry.name,
        email: inquiry.email,
        subject: inquiry.subject,
        message: inquiry.message,
      });

      if (error) {
        console.error("contact inquiry insert failed", error.message);
      } else {
        stored = true;
      }
    } catch (error) {
      console.error("contact inquiry insert threw", error);
    }
  }

  let notified = false;

  if (isEmailConfigured()) {
    try {
      const result = await sendInquiryNotification(inquiry);
      notified = result.ok;
      if (!result.ok && !result.skipped) {
        console.error("contact notification failed", result.message);
      }
    } catch (error) {
      console.error("contact notification threw", error);
    }
  }

  if (!stored && !notified) {
    return NextResponse.json(
      {
        ok: false,
        message:
          "The message could not be delivered. Please try again, or contact me through GitHub.",
      },
      { status: 502 },
    );
  }

  return NextResponse.json({
    ok: true,
    message: "Thank you — your message has been received.",
  });
}
