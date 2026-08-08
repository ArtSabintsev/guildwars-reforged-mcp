# Guild Wars Reforged MCP

Read-only Model Context Protocol server for **Guild Wars Reforged** (the 2025
re-release of Guild Wars 1) public sources and opt-in local install inventory.
Covers Prophecies, Factions, Nightfall, and Eye of the North.

## Sources

Listed alphabetically by name:

- Guild Wars Build Creator (mobile UI, pointer-only): `https://guildwars.magical.ch/`
- Guild Wars Wiki: `https://wiki.guildwars.com/api.php`
- GW1 Builds: `https://gw1builds.com/api/builds`
- Kamadan Trade Chat Search (pointer-only): `https://kamadan.gwtoolbox.com/`
- Local Guild Wars install or VMware Fusion bundle metadata (opt-in roots only)
- PvXwiki: `https://gwpvx.fandom.com/api.php`
- r/GuildWars public Atom search
- Speedclear Wiki: `https://wiki.gwscr.com/api.php` (high-end SC tactics; niche meta)
- YouTube public RSS feeds for official and creator channels

## Install

This is a stdio MCP server distributed from GitHub. Replace `<owner>` with the
GitHub owner or organization that hosts this repository.

### Codex

```bash
codex mcp add guildwars-reforged -- npx -y github:<owner>/guildwars-reforged-mcp
codex mcp list
```

With opt-in local inventory:

```bash
codex mcp add guildwars-reforged \
  --env GW1_LOCAL_ROOTS="/path/to/Guild Wars/or VM.vmwarevm" \
  -- npx -y github:<owner>/guildwars-reforged-mcp
```

### Claude Code

```bash
claude mcp add --scope user guildwars-reforged -- npx -y github:<owner>/guildwars-reforged-mcp
claude mcp list
```

With opt-in local inventory:

```bash
claude mcp add --scope user guildwars-reforged \
  -e GW1_LOCAL_ROOTS="/path/to/Guild Wars/or VM.vmwarevm" \
  -- npx -y github:<owner>/guildwars-reforged-mcp
```

### Claude Desktop

Merge this into `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "guildwars-reforged": {
      "command": "npx",
      "args": ["-y", "github:<owner>/guildwars-reforged-mcp"]
    }
  }
}
```

With opt-in local inventory:

```json
{
  "mcpServers": {
    "guildwars-reforged": {
      "command": "npx",
      "args": ["-y", "github:<owner>/guildwars-reforged-mcp"],
      "env": {
        "GW1_LOCAL_ROOTS": "/path/to/Guild Wars/or VM.vmwarevm"
      }
    }
  }
}
```

Restart Claude Desktop after changing the file.

### Grok

```bash
grok mcp add --scope user guildwars-reforged -- npx -y github:<owner>/guildwars-reforged-mcp
grok mcp list
grok mcp doctor
```

With opt-in local inventory:

```bash
grok mcp add --scope user guildwars-reforged \
  -e GW1_LOCAL_ROOTS="/path/to/Guild Wars/or VM.vmwarevm" \
  -- npx -y github:<owner>/guildwars-reforged-mcp
```

Start a new Codex, Claude, or Grok session after adding the server. Existing
sessions may not pick up newly configured MCP servers.

From a checkout:

```bash
npm install
npm run build
node dist/index.js
```

## Tools

- `gw1_sources` - list configured public and local source surfaces.
- `gw1_wiki_search` - search Guild Wars Wiki, PvXwiki, or both.
- `gw1_wiki_page` - fetch a wiki page with extracted text, links, categories, and revision metadata.
- `gw1_wiki_recent_changes` - read recent public changes from a wiki source.
- `gw1_game_updates` - parse recent Guild Wars game-update sections from Guild Wars Wiki.
- `gw1_builds_search` - search GW1 Builds public API and/or PvXwiki.
- `gw1_template_code_analyze` - validate, decode, and legality-check Guild Wars template/build codes (professions, attributes, skill names, build rules).
- `gw1_template_encode` - build an importable template code from professions, attributes, and skill names, with a legality report (one elite, three PvE-only max, single allegiance, 200 attribute-point budget).
- `gw1_subreddit_search` - search r/GuildWars public Atom results.
- `gw1_youtube_sources` - list curated official and creator YouTube feeds.
- `gw1_youtube_videos` - fetch recent public YouTube videos from curated feeds.
- `gw1_content_search` - search across wiki, PvXwiki, GW1 Builds, YouTube, and r/GuildWars.
- `gw1_local_inventory` - scan explicit local roots for Guild Wars or VMware Fusion metadata.

## Resources

- `gw1://sources` - public source registry.
- `gw1://wiki-sources` - MediaWiki source registry.
- `gw1://youtube-sources` - official and creator YouTube source registry.

## Update Pipeline

Most content is fetched fresh at tool-call time from public APIs and feeds, so
the server does not go stale between commits. Three scheduled workflows keep the
rest current without manual upkeep:

- `Source Smoke` (Tue/Fri) runs live checks against every public source surface.
  It commits nothing; it catches dead feeds, API shape changes, and source
  breakage.
- `Refresh skill index` (Mondays) re-extracts the bundled skill index from the
  Guild Wars Wiki and commits it only when the extracted data actually changed.
  Because installs resolve `github:<owner>/guildwars-reforged-mcp` to the
  default branch, a refresh reaches users without needing a release.
- `Keepalive` (Wednesdays) makes an empty commit if the repository has been
  quiet for 45 days, so GitHub's 60-day inactivity rule never disables the
  schedules above.

Releases are cut only from human pushes to `main`. A data refresh is typically
one or two corrected skill fields out of roughly 3,000 and does not merit a
version of its own.

## Local Inventory

Local inventory is opt-in. The server never scans default locations, home
directories, VMware folders, or game installs by itself.

Use explicit roots:

```bash
GW1_LOCAL_ROOTS="/path/to/Guild Wars:/path/to/Some VM.vmwarevm" guildwars-reforged-mcp
```

Or pass roots to the `gw1_local_inventory` tool.

The scanner can detect:

- `Gw.exe`
- `Gw.dat` metadata only
- `Templates` folders and plausible template codes in `.txt` files
- `.vmwarevm`, `.vmx`, and `.vmdk` metadata

It does not mount virtual disks, parse `Gw.dat`, follow symlink escapes, or write
scan output. Paths are redacted by default unless a caller explicitly opts out.

## Development

```bash
npm install
npm run typecheck
npm test
npm run build
npm run smoke:sources
```

## Notes

This project is not affiliated with ArenaNet, NCSoft, Guild Wars Wiki, PvXwiki,
GW1 Builds, Reddit, or VMware. It fetches public, read-only data and returns
source URLs so agents can attribute claims back to the original source.
