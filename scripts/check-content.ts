// Lists every item that still needs Shivam: `needsReview` content and `TODO(shivam)` notes.
// Also sanity-checks diagram ids. Prints a report and always exits 0, so it never fails the build.
//
// Run: pnpm check:content (also runs at the start of pnpm build).

import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import * as experience from "../src/content/experience";
import * as home from "../src/content/home";
import * as site from "../src/content/site";
import * as skills from "../src/content/skills";
import * as storiesModule from "../src/content/stories";
import type { Story } from "../src/content/types";

const root = join(__dirname, "..");
const TODO = "TODO(shivam)";
// Real notes are written "TODO(shivam): ...". Code that merely mentions the marker has no colon.
const TODO_NOTE = `${TODO}:`;

type Item = { where: string; text: string };

// ---------- needsReview: walk every exported content value ----------

function labelOf(value: Record<string, unknown>): string | undefined {
  for (const key of ["slug", "id", "title", "name", "label"]) {
    if (typeof value[key] === "string") return value[key] as string;
  }
  return undefined;
}

function preview(value: Record<string, unknown>): string {
  const text = [value.body, value.text, value.label, value.title].find(
    (v): v is string => typeof v === "string",
  );
  if (!text) return "";
  return text.length > 90 ? `${text.slice(0, 87)}...` : text;
}

// Derived exports (workStories, storyOrder) reuse the same objects; report each object once.
const seen = new WeakSet<object>();

function walk(value: unknown, path: string[], out: Item[]) {
  if (value && typeof value === "object") {
    if (seen.has(value)) return;
    seen.add(value);
  }
  if (Array.isArray(value)) {
    value.forEach((v, i) => {
      const label = v && typeof v === "object" ? labelOf(v as Record<string, unknown>) : undefined;
      walk(v, [...path, label ?? String(i)], out);
    });
    return;
  }
  if (!value || typeof value !== "object") return;
  const obj = value as Record<string, unknown>;
  if (obj.needsReview === true) {
    const note = typeof obj.reviewNote === "string" ? ` [${obj.reviewNote}]` : "";
    out.push({ where: path.join(" › "), text: `${preview(obj)}${note}`.trim() });
  }
  for (const [key, child] of Object.entries(obj)) {
    if (key === "steps" || key === "nodes" || child === null || typeof child !== "object") {
      walk(child, key === "steps" || key === "nodes" ? [...path, key] : path, out);
    } else {
      walk(child, [...path, key], out);
    }
  }
}

const modules: Record<string, Record<string, unknown>> = {
  site,
  home,
  experience,
  skills,
  // Only the source arrays; workStories and friends are derived from `stories`.
  stories: { stories: storiesModule.stories, hackathonPhotos: storiesModule.hackathonPhotos },
};

const review: Item[] = [];
for (const [file, mod] of Object.entries(modules)) {
  for (const [name, value] of Object.entries(mod)) {
    if (typeof value === "function") continue;
    walk(value, [`${file}.ts`, name], review);
  }
}

// ---------- TODO(shivam): scan source files ----------

function files(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? files(path) : [path];
  });
}

const todos: Item[] = [];
for (const file of files(join(root, "src")).filter((f) => /\.(ts|tsx)$/.test(f))) {
  readFileSync(file, "utf8")
    .split(/\r?\n/)
    .forEach((line, i) => {
      if (line.includes(TODO_NOTE)) {
        const where = `${relative(root, file).replaceAll("\\", "/")}:${i + 1}`;
        todos.push({ where, text: line.trim() });
      }
    });
}

// ---------- Integrity: every id a diagram step refers to must exist ----------

const problems: string[] = [];
const hidden: string[] = [];

function checkStory(story: Story) {
  for (const step of story.steps) {
    if (step.body.includes(TODO)) hidden.push(`${story.slug} › ${step.id}`);
  }
  if (story.diagram.kind !== "flow") return;
  const d = story.diagram;
  const ids = new Set([
    ...d.nodes.map((n) => n.id),
    ...d.edges.map((e) => e.id),
    ...(d.groups ?? []).map((g) => g.id),
    ...(d.annotations ?? []).map((a) => a.id),
  ]);
  const targets = new Set([...d.nodes.map((n) => n.id), ...(d.groups ?? []).map((g) => g.id)]);
  for (const e of d.edges) {
    for (const end of [e.from, e.to]) {
      if (!targets.has(end))
        problems.push(`${story.slug}: edge "${e.id}" points to unknown "${end}"`);
    }
  }
  for (const g of d.groups ?? []) {
    for (const m of g.members) {
      if (!targets.has(m))
        problems.push(`${story.slug}: group "${g.id}" has unknown member "${m}"`);
    }
  }
  for (const a of d.annotations ?? []) {
    if (!ids.has(a.target)) {
      problems.push(`${story.slug}: annotation "${a.id}" targets unknown "${a.target}"`);
    }
  }
  for (const step of story.steps) {
    const state = step.diagramState;
    if (!state) continue;
    for (const [key, list] of Object.entries(state)) {
      for (const id of list ?? []) {
        if (!ids.has(id))
          problems.push(`${story.slug} › ${step.id}: ${key} has unknown id "${id}"`);
        // Annotations are overlays, so they don't need to be in show.
        if (key !== "show" && key !== "annotate" && !state.show.includes(id)) {
          problems.push(`${story.slug} › ${step.id}: "${id}" is in ${key} but not in show`);
        }
      }
    }
  }
}

const slugs = new Set<string>();
for (const story of storiesModule.stories) {
  if (slugs.has(story.slug)) problems.push(`duplicate story slug "${story.slug}"`);
  slugs.add(story.slug);
  checkStory(story);
}

// ---------- Report ----------

function section(title: string, items: string[]) {
  console.log(`\n${title} (${items.length})`);
  if (items.length === 0) console.log("  none");
  for (const item of items) console.log(`  - ${item}`);
}

console.log("Content check");
section(
  "Needs review",
  review.map((r) => `${r.where}${r.text ? `\n      ${r.text}` : ""}`),
);
section(
  "TODO(shivam)",
  todos.map((t) => `${t.where}\n      ${t.text}`),
);
section("Steps hidden until their TODO is filled", hidden);
section("Diagram problems", problems);
console.log("");
