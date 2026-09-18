import { describe, expect, it } from "vitest";
import { allFailuresAreHostedRunnerBlocks, isHostedRunnerBlock } from "../scripts/source-smoke-policy.mjs";

const wiki403 = {
  name: "guild-wars-wiki-search",
  error: "GET https://wiki.guildwars.com/api.php?action=query failed with HTTP 403"
};
const reddit403 = {
  name: "reddit",
  error: "GET https://www.reddit.com/r/GuildWars/search.rss?q=Reforged&restrict_sr=on&sort=new&limit=2 failed with HTTP 403"
};
const oldReddit403 = {
  name: "reddit",
  error: "GET https://old.reddit.com/r/GuildWars/search.rss?q=Reforged failed with HTTP 403"
};

describe("source-smoke hosted-runner 403 policy", () => {
  it("treats wiki and reddit HTTP 403 as upstream IP blocks", () => {
    expect(isHostedRunnerBlock(wiki403)).toBe(true);
    expect(isHostedRunnerBlock(reddit403)).toBe(true);
    expect(isHostedRunnerBlock(oldReddit403)).toBe(true);
  });

  it("does not treat real Reddit regressions as IP blocks", () => {
    expect(
      isHostedRunnerBlock({
        name: "reddit",
        error: "GET https://www.reddit.com/r/GuildWars/search.rss?q=Reforged failed with HTTP 404"
      })
    ).toBe(false);
    expect(isHostedRunnerBlock({ name: "reddit", error: "no subreddit Atom results" })).toBe(false);
    expect(isHostedRunnerBlock({ name: "reddit", error: "Unexpected end of XML input" })).toBe(false);
    expect(
      isHostedRunnerBlock({
        name: "reddit",
        error: "GET https://www.reddit.com/r/GuildWars/search.rss failed: timeout"
      })
    ).toBe(false);
  });

  it("does not treat 403s from other hosts as smoke block windows", () => {
    expect(
      isHostedRunnerBlock({
        name: "youtube",
        error: "GET https://www.youtube.com/feeds/videos.xml?channel_id=x failed with HTTP 403"
      })
    ).toBe(false);
  });

  it("exits the block-window path only when every failure is a wiki or reddit 403", () => {
    expect(allFailuresAreHostedRunnerBlocks([])).toBe(false);
    expect(allFailuresAreHostedRunnerBlocks([reddit403])).toBe(true);
    expect(allFailuresAreHostedRunnerBlocks([wiki403, reddit403])).toBe(true);
    expect(allFailuresAreHostedRunnerBlocks([wiki403, { name: "reddit", error: "no subreddit Atom results" }])).toBe(false);
    expect(allFailuresAreHostedRunnerBlocks([reddit403, { name: "gw1builds", error: "no GW1 Builds results" }])).toBe(false);
  });
});
