import "server-only";

import { requireRequestTime } from "@/server/request";

import { isAdminPreviewAvailable } from "@/lib/admin/preview";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { ContactInquiryRow, InquiryStatus } from "@/types/database";

export type InquiryFilters = {
  status: InquiryStatus | "all";
  page: number;
  perPage: number;
};

export type InquiryListResult = {
  rows: ContactInquiryRow[];
  total: number;
  page: number;
  perPage: number;
};

export async function listInquiries(filters: InquiryFilters): Promise<InquiryListResult> {
  await requireRequestTime();

  const { status, page, perPage } = filters;

  if (isAdminPreviewAvailable()) {
    return { rows: [], total: 0, page, perPage };
  }

  if (!isSupabaseConfigured()) {
    return { rows: [], total: 0, page, perPage };
  }

  const supabase = await createSupabaseServerClient();
  let request = supabase.from("contact_inquiries").select("*", { count: "exact" });

  if (status !== "all") {
    request = request.eq("status", status);
  }

  const from = (page - 1) * perPage;
  const { data, count, error } = await request
    .order("created_at", { ascending: false })
    .range(from, from + perPage - 1);

  if (error) {
    throw new Error(`Could not load inquiries: ${error.message}`);
  }

  return {
    rows: (data ?? []) as ContactInquiryRow[],
    total: count ?? 0,
    page,
    perPage,
  };
}

export async function updateInquiryStatus(id: string, status: InquiryStatus) {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("contact_inquiries")
    .update({ status })
    .eq("id", id);

  return error
    ? { ok: false as const, message: "The inquiry status could not be saved." }
    : { ok: true as const };
}

export async function deleteInquiry(id: string) {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("contact_inquiries").delete().eq("id", id);

  return error
    ? { ok: false as const, message: "The inquiry could not be deleted." }
    : { ok: true as const };
}
