#!/usr/bin/env node
/**
 * Creates or updates the administrator's Supabase Auth account.
 *
 *   npm run admin:password -- --email you@example.com --password '...'
 *
 * Run it on a machine that can reach your Supabase project. It reads
 * NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY from `.env.local`,
 * uses the Admin API (which requires the service key), and never writes the
 * password anywhere.
 *
 * The service key bypasses Row Level Security. Keep it server-side only and
 * rotate it if it has ever been shared.
 */
import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join } from "node:path";

function parseEnv(text) {
  const values = {};
  for (const line of text.split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
    if (!match) continue;
    values[match[1]] = match[2].trim().replace(/^(["'])(.*)\1$/, "$2");
  }
  return values;
}

function args(argv) {
  const out = {};
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (!token.startsWith("--")) continue;
    const key = token.slice(2);
    const next = argv[index + 1];
    if (next && !next.startsWith("--")) {
      out[key] = next;
      index += 1;
    } else {
      out[key] = true;
    }
  }
  return out;
}

const options = args(process.argv.slice(2));
const email = String(options.email ?? "").trim().toLowerCase();
const password = String(options.password ?? "");

if (!email || !password) {
  console.error(
    "Usage: npm run admin:password -- --email you@example.com --password 'your password'",
  );
  process.exit(1);
}

if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
  console.error("That email address does not look valid.");
  process.exit(1);
}

if (password.length < 8) {
  console.error("Supabase requires at least 8 characters. Use 16 or more.");
  process.exit(1);
}

const envPath = join(process.cwd(), ".env.local");

if (!existsSync(envPath)) {
  console.error("No .env.local found in the project root.");
  process.exit(1);
}

const env = { ...parseEnv(await readFile(envPath, "utf8")), ...process.env };
const url = (env.NEXT_PUBLIC_SUPABASE_URL ?? "").trim().replace(/\/$/, "");
const serviceKey = (env.SUPABASE_SERVICE_ROLE_KEY ?? env.SUPABASE_SECRET_KEY ?? "").trim();

if (!url || !serviceKey) {
  console.error(
    "NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (or SUPABASE_SECRET_KEY) must be set in .env.local.",
  );
  process.exit(1);
}

const headers = {
  apikey: serviceKey,
  Authorization: `Bearer ${serviceKey}`,
  "Content-Type": "application/json",
};

function report(status, table) {
  if (status === 404) {
    console.warn(
      `  ! ${table} table not found — run supabase/apply-all.sql before relying on the dashboard.`,
    );
  }
}

async function findUser() {
  const response = await fetch(
    `${url}/auth/v1/admin/users?page=1&per_page=200&filter=${encodeURIComponent(email)}`,
    { headers, signal: AbortSignal.timeout(20000) },
  );

  if (!response.ok) {
    throw new Error(`Could not list users (HTTP ${response.status}): ${await response.text()}`);
  }

  const body = await response.json();
  const users = body.users ?? [];
  return users.find((user) => (user.email ?? "").toLowerCase() === email) ?? null;
}

async function main() {
  let user;

  try {
    user = await findUser();
  } catch (error) {
    console.error(`✗ ${error.message}`);
    console.error("  Check the project URL, the service key, and your network.");
    process.exit(1);
  }

  if (user) {
    const response = await fetch(`${url}/auth/v1/admin/users/${user.id}`, {
      method: "PUT",
      headers,
      body: JSON.stringify({ password, email_confirm: true }),
      signal: AbortSignal.timeout(20000),
    });

    if (!response.ok) {
      console.error(`✗ Password update failed (HTTP ${response.status}): ${await response.text()}`);
      process.exit(1);
    }

    console.log(`✓ Password updated for ${email}`);
    console.log(`  user id: ${user.id}`);
  } else {
    const response = await fetch(`${url}/auth/v1/admin/users`, {
      method: "POST",
      headers,
      body: JSON.stringify({ email, password, email_confirm: true }),
      signal: AbortSignal.timeout(20000),
    });

    if (!response.ok) {
      console.error(`✗ User creation failed (HTTP ${response.status}): ${await response.text()}`);
      process.exit(1);
    }

    const created = await response.json();
    console.log(`✓ Created ${email} (already confirmed)`);
    console.log(`  user id: ${created.id}`);
  }

  const allowlist = (env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);

  if (!allowlist.includes(email)) {
    console.warn(
      `  ! ${email} is not in ADMIN_EMAILS, so it can sign in but will not be an administrator.`,
    );
    console.warn(`    Add ADMIN_EMAILS=${email} to .env.local and restart the server.`);
  }

  const table = await fetch(`${url}/rest/v1/projects?select=id&limit=1`, {
    headers: { apikey: env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? serviceKey },
    signal: AbortSignal.timeout(20000),
  });
  report(table.status, "projects");

  console.log("");
  console.log("Sign in at /admin/login with that email and password.");
}

await main();
