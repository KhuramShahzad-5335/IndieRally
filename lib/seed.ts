import type { Listing } from "./domain";
const seeds = [
  ["Framepad", "Plan, design, and share your best work in one visual workspace.", "Design", "Freemium", "Studio North", 128],
  ["RelayKit", "Build reliable automations across your favorite developer tools.", "Developer Tools", "Free", "Relay Labs", 96],
  ["Daymark", "A calmer way to plan your day and make space for deep work.", "Productivity", "Freemium", "Maya Park", 74],
  ["Signalboard", "Get the metrics your team actually needs in one clear dashboard.", "Analytics", "Paid", "Signal Studio", 62],
  ["Promptdesk", "Organize, test, and share prompts with your entire team.", "AI Tools", "Freemium", "Fieldwork", 51],
  ["Letterline", "Start a beautiful newsletter and send your first issue in minutes.", "Marketing", "Free", "Ben Ellis", 43],
  ["Patchbay", "Triage feedback and turn it into actionable product updates.", "Developer Tools", "Free", "Patch Works", 37],
  ["Inkdrop Studio", "A lightweight canvas for turning rough ideas into polished layouts.", "Design", "Paid", "Inkdrop Team", 29],
] as const;
export const seed: Listing[] = seeds.map(([name, tagline, category, pricing, maker, baseVotes], theme) => {
  const at = new Date(Date.UTC(2026, 10, 14 - theme)).toISOString();
  return { name, tagline, category, pricing, maker, baseVotes, theme, featured: theme === 0, slug: name.toLowerCase().replaceAll(" ", "-"),
    description: `${tagline} This sample listing illustrates how an independent maker can introduce their product, explain who it serves, and share how visitors can get started.`,
    website: "https://example.com/", status: "published", submittedAt: at, publishedAt: at, voters: [], history: [{ status: "published", at }] };
});
