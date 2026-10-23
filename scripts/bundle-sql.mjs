#!/usr/bin/env node
/**
 * Bundles the migrations into one file for the Supabase SQL editor.
 *
 * The SQL editor runs one script at a time, and pasting three files in the
 * right order is easy to get wrong. `npm run sql:bundle` regenerates
 * `supabase/apply-all.sql` from `supabase/migrations/*.sql`.
 *
 * Seed data is deliberately excluded: it is illustrative content that should
 * not be loaded into production by accident. Run `supabase/seed.sql`
 * separately when you want it.
 */
import { readdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const migrationsDir = join(process.cwd(), "supabase", "migrations");
const outputPath = join(process.cwd(), "supabase", "apply-all.sql");

const files = (await readdir(migrationsDir))
  .filter((name) => name.endsWith(".sql"))
  .sort();

if (files.length === 0) {
  console.error("No migration files found in supabase/migrations.");
  process.exit(1);
}

const parts = [
  "-- ---------------------------------------------------------------------------",
  "-- GENERATED FILE — do not edit. Regenerate with `npm run sql:bundle`.",
  "--",
  "-- Applies the portfolio schema, Row Level Security policies, and the storage",
  "-- bucket in one pass. Paste this whole file into the Supabase SQL editor and",
  "-- run it once on a fresh project.",
  "--",
  `-- Sources: ${files.join(", ")}`,
  "-- ---------------------------------------------------------------------------",
  "",
];

for (const file of files) {
  const sql = await readFile(join(migrationsDir, file), "utf8");
  parts.push(`-- ===== ${file} =====`, "", sql.trim(), "");
}

await writeFile(outputPath, parts.join("\n"), "utf8");
console.log(`Wrote ${outputPath} from ${files.length} migration(s).`);
