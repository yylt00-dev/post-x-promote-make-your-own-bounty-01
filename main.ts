// Entry program for make.fun's "Promote make.fun's make-your-own-bounty post on X"
// bounty (slug: post-x-promote-make-your-own-bounty-01).
//
// The entry itself is a post on X: a quote of make.fun's make-your-own-bounty
// post (https://x.com/makefunai/status/2124915864336236646) carrying a photo
// made for it (photo.png in this repo), the line "Make your own bounty on
// @makefunai: https://make.fun/sponsor/new" and the play code
// makefun-airship-teacup-sausage in its text. Places go by the post's replies
// plus reposts plus quotes; the top 50 share $250.
//
// This program does the one job the grader needs from the repository: it reads
// POST.json at the repository root and writes it to /output, where the house
// reads the post's address and its public counts. It also checks that POST.json
// holds a real post address (not the placeholder) so a bad file fails loudly.
//
// Node 22, standard library only, no network. Run it the way the grader does:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const botDir = process.env.MAKEFUN_BOT_DIR ?? "/bot";
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

function fail(message: string): never {
  console.error(`main.ts: ${message}`);
  process.exit(1);
}

mkdirSync(outputDir, { recursive: true });

let raw: string;
try {
  raw = readFileSync(join(botDir, "POST.json"), "utf8");
} catch (err) {
  fail(`could not read POST.json: ${(err as Error).message}`);
}

let post: unknown;
try {
  post = JSON.parse(raw!);
} catch (err) {
  fail(`POST.json is not valid JSON: ${(err as Error).message}`);
}

if (
  typeof post !== "object" ||
  post === null ||
  typeof (post as { url?: unknown }).url !== "string" ||
  !(post as { url: string }).url.startsWith("https://x.com/") ||
  (post as { url: string }).url.includes("<") ||
  (post as { url: string }).url.includes(">")
) {
  fail("POST.json must be an object with a real post url string starting with https://x.com/ (no <handle>/<id> placeholder)");
}

writeFileSync(join(outputDir, "POST.json"), JSON.stringify(post, null, 2) + "\n");
console.log(`wrote ${(post as { url: string }).url} to ${join(outputDir, "POST.json")}`);
