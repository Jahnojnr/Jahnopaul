import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/admin-shell";
import { requireAdmin } from "@/server/auth";

// The session read happens at request time. Opting this segment out of instant
// navigation validation keeps the authenticated shell blocking on the server
// rather than trying to prerender private UI.
export const instant = false;

export const metadata: Metadata = {
  title: {
    default: "Administration",
    template: "%s · Administration",
  },
  robots: { index: false, follow: false },
};

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await requireAdmin();

  return <AdminShell admin={admin}>{children}</AdminShell>;
}
