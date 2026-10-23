#!/usr/bin/env node
/**
 * Connection check for the Supabase project.
 *
 * Run it on the machine where the app runs, after filling `.env.local`:
 *
 *   npm run check:supabase
 *
 * It reads `.env.local` directly (no dependencies), then checks that the URL
 * and key are shaped correctly, that the project answers, and whether the
 * portfolio tables exist. It never prints a full secret.
 */
import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const envPath = join(root, ".env.local");

function parseEnv(text) {
  const values = {};
  for (const line of text.split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
    if (!match) continue;
    let value = match[2].trim().replace(/^(["'])(.*)\1$/, "$2");
    values[match[1]] = value;
  }
  return values;
}

function readRole(token) {
  const part = token.split(".")[1];
  if (!part) return null;
  try {
    const json = Buffer.from(part.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString("utf8");
    return JSON.parse(json).role ?? null;
  } catch {
    return null;
  }
}

function mask(value) {
  if (!value) return "(empty)";
  return value.length <= 12 ? "***" : `${value.slice(0, 8)}…${value.slice(-4)}`;
}

const problems = [];
const notes = [];

if (!existsSync(envPath)) {
  console.error("✗ No .env.local found. Create one in the project root.");
  process.exit(1);
}

const env = { ...parseEnv(await readFile(envPath, "utf8")), ...process.env };

const url = (env.NEXT_PUBLIC_SUPABASE_URL ?? "").trim().replace(/\/$/, "");
const anonKey = (
  env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
  env.SUPABASE_PUBLISHABLE_KEY ??
  ""
).trim();
const secretKey = (env.SUPABASE_SERVICE_ROLE_KEY ?? env.SUPABASE_SECRET_KEY ?? "").trim();

console.log("Supabase configuration");
console.log("----------------------");
console.log(`URL            ${url ? url : "(missing)"}`);
console.log(`Publishable    ${mask(anonKey)}`);
console.log(`Secret         ${mask(secretKey)}`);

if (!url) problems.push("NEXT_PUBLIC_SUPABASE_URL is missing.");
if (!/^https:\/\/[a-z0-9]+\.supabase\.co$/.test(url.replace(/\/$/, ""))) {
  problems.push("NEXT_PUBLIC_SUPABASE_URL should look like https://<ref>.supabase.co (no brackets, no trailing path).");
}
if (!anonKey) problems.push("No publishable/anon key found.");
if (!secretKey) notes.push("No secret/service key found. The contact form will not be able to store inquiries.");

const role = readRole(anonKey);
if (anonKey && role && role !== "anon") {
  problems.push(`The public key has role "${role}". Use the publishable or anon key here, never the service key.`);
}
if (role === "anon") console.log("Key role       anon (legacy key, fine)");
if (anonKey.startsWith("sb_publishable_")) console.log("Key role       publishable");

if (secretKey.startsWith("sb_secret_") || readRole(secretKey) === "service_role") {
  console.log("Secret role    elevated (server only)");
}

async function check(path, label) {
  const response = await fetch(`${url}${path}`, {
    headers: { apikey: anonKey, Authorization: `Bearer ${anonKey}` },
    signal: AbortSignal.timeout(15000),
  });
  return { response, label };
}

if (problems.length === 0) {
  console.log("");
  try {
    const health = await fetch(`${url}/auth/v1/health`, {
      headers: { apikey: anonKey },
      signal: AbortSignal.timeout(15000),
    });
    console.log(`Reachability   ${health.ok ? "ok" : `HTTP ${health.status}`}`);
    if (!health.ok) problems.push("The project answered with an error. Check the project is not paused.");
  } catch {
    problems.push(
      "Could not reach the project. Check your network, VPN, or whether the project is paused.",
    );
  }

  if (problems.length === 0) {
    const expected = [
      ["profiles", "Profiles"],
      ["projects", "Projects"],
      ["posts", "Posts"],
      ["experiences", "Experience"],
      ["skills", "Skills"],
      ["contact_inquiries", "Inquiries"],
      ["site_settings", "Settings"],
    ];

    const missing = [];
    for (const [table] of expected) {
      try {
        const { response } = await check(`/rest/v1/${table}?select=id&limit=1`, table);
        if (response.status === 404) missing.push(table);
        else if (!response.ok && response.status !== 401 && response.status !== 403) {
          notes.push(`${table}: HTTP ${response.status}`);
        }
      } catch {
        missing.push(table);
      }
    }

    if (missing.length === 0) {
      console.log("Tables         all present");
    } else {
      console.log(`Tables         missing: ${missing.join(", ")}`);
      problems.push(
        "The schema has not been applied. Run supabase/apply-all.sql in the Supabase SQL editor.",
      );
    }
  }
}

console.log("");
if (notes.length > 0) {
  for (const note of notes) console.log(`• ${note}`);
}
if (problems.length > 0) {
  console.log("Problems");
  for (const problem of problems) console.log(`✗ ${problem}`);
  process.exit(1);
}

console.log("✓ Configuration looks correct.");
