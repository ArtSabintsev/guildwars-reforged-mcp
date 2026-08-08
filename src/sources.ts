export type WikiSourceId = "gww" | "pvx" | "scr";

export type WikiSource = {
  id: WikiSourceId;
  title: string;
  apiUrl: string;
  webUrl: string;
  pageUrlPrefix: string;
  authority: "primary-community" | "build-community" | "speedclear-community";
  notes: string[];
};

export const WIKI_SOURCES: Record<WikiSourceId, WikiSource> = {
  gww: {
    id: "gww",
    title: "Guild Wars Wiki",
    apiUrl: "https://wiki.guildwars.com/api.php",
    webUrl: "https://wiki.guildwars.com/",
    pageUrlPrefix: "https://wiki.guildwars.com/wiki/",
    authority: "primary-community",
    notes: ["Officially hosted community wiki.", "Preferred source for game updates, skills, professions, items, quests, and mechanics."]
  },
  pvx: {
    id: "pvx",
    title: "PvXwiki",
    apiUrl: "https://gwpvx.fandom.com/api.php",
    webUrl: "https://gwpvx.fandom.com/",
    pageUrlPrefix: "https://gwpvx.fandom.com/wiki/",
    authority: "build-community",
    notes: ["Fandom-hosted build archive.", "Preferred source for historical and maintained PvE, PvP, farming, and team build pages."]
  },
  scr: {
    id: "scr",
    title: "Speedclear Wiki",
    apiUrl: "https://wiki.gwscr.com/api.php",
    webUrl: "https://wiki.gwscr.com/",
    pageUrlPrefix: "https://wiki.gwscr.com/wiki/",
    authority: "speedclear-community",
    notes: [
      "Community wiki for high-end speedclear tactics (DoA, UW, FoW, etc.).",
      "Niche meta — not a general-play authority; prefer Guild Wars Wiki for skills/quests and PvX for general builds."
    ]
  }
};

/** All wiki source ids in default search order (general → builds → speedclear). */
export const ALL_WIKI_SOURCE_IDS = Object.keys(WIKI_SOURCES) as WikiSourceId[];

export const SOURCE_SCOPE = {
  game: "Guild Wars 1",
  server: "guildwars-reforged-mcp",
  defaultBehavior: "Public read-only sources only. Local inventory requires explicit roots."
};

export const PUBLIC_SOURCES = [
  {
    id: "guild-wars-wiki",
    title: "Guild Wars Wiki",
    kind: "mediawiki",
    url: WIKI_SOURCES.gww.webUrl,
    apiUrl: WIKI_SOURCES.gww.apiUrl,
    authority: WIKI_SOURCES.gww.authority
  },
  {
    id: "pvxwiki",
    title: "PvXwiki",
    kind: "mediawiki",
    url: WIKI_SOURCES.pvx.webUrl,
    apiUrl: WIKI_SOURCES.pvx.apiUrl,
    authority: WIKI_SOURCES.pvx.authority
  },
  {
    id: "speedclear-wiki",
    title: "Speedclear Wiki",
    kind: "mediawiki",
    url: WIKI_SOURCES.scr.webUrl,
    apiUrl: WIKI_SOURCES.scr.apiUrl,
    authority: WIKI_SOURCES.scr.authority,
    notes: WIKI_SOURCES.scr.notes
  },
  {
    id: "gw1builds",
    title: "GW1 Builds",
    kind: "public-build-api",
    url: "https://gw1builds.com/",
    apiUrl: "https://gw1builds.com/api/builds",
    authority: "community-builds"
  },
  {
    id: "gw-build-creator-mobile",
    title: "Guild Wars Build Creator (magical.ch)",
    kind: "public-build-ui",
    url: "https://guildwars.magical.ch/",
    authority: "community-builds",
    notes: [
      "Mobile-friendly template builder UI.",
      "Pointer-only — overlaps gw1builds + template encode/decode tools; no public search API."
    ]
  },
  {
    id: "kamadan-trade",
    title: "Kamadan Trade Chat Search",
    kind: "public-trade-ui",
    url: "https://kamadan.gwtoolbox.com/",
    authority: "community-economy",
    notes: [
      "Live/near-live Kamadan trade chat search from GWToolbox.",
      "Economy surface, not skill or build truth. Pointer-only; no structured public API in this MCP."
    ]
  },
  {
    id: "guildwars-subreddit",
    title: "r/GuildWars",
    kind: "public-atom-search",
    url: "https://www.reddit.com/r/GuildWars/",
    apiUrl: "https://www.reddit.com/r/GuildWars/search.rss",
    authority: "community-discussion"
  },
  {
    id: "youtube",
    title: "Guild Wars YouTube channels",
    kind: "public-youtube-rss",
    url: "https://www.youtube.com/",
    apiUrl: "https://www.youtube.com/feeds/videos.xml",
    authority: "official-and-creator-video"
  },
  {
    id: "local-inventory",
    title: "Local Guild Wars install inventory",
    kind: "explicit-local-filesystem",
    url: "gw1://local-inventory",
    authority: "user-controlled-local",
    notes: ["Disabled unless GW1_LOCAL_ROOTS or explicit tool-call roots are provided.", "Returns metadata only and redacts paths by default."]
  }
];

export function wikiPageUrl(sourceId: WikiSourceId, title: string): string {
  return `${WIKI_SOURCES[sourceId].pageUrlPrefix}${encodeURIComponent(title.replaceAll(" ", "_"))}`;
}
