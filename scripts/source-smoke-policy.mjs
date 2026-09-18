// Shared by scripts/source-smoke.mjs. Hosted-runner egress IPs are
// intermittently 403-blocked by some public sources. That is external and
// self-heals — a code regression surfaces as a different error (parse
// failure, empty 200, 404, timeout), never an HTTP 403 from these hosts.
// When every failing check is one of these blocks, the smoke script exits
// 99 so .github/actions/source-smoke can retry / skip green.

const HTTP_403 = /HTTP 403\b/;
const WIKI_HOST = /wiki\.guildwars\.com/;
const REDDIT_HOST = /(?:^|\/\/|\.)reddit\.com\b/;

/**
 * @param {{ error?: string }} entry
 */
export function isHostedRunnerBlock(entry) {
  const error = entry.error ?? "";
  if (!HTTP_403.test(error)) return false;
  return WIKI_HOST.test(error) || REDDIT_HOST.test(error);
}

/**
 * @param {Array<{ error?: string }>} failures
 */
export function allFailuresAreHostedRunnerBlocks(failures) {
  return failures.length > 0 && failures.every(isHostedRunnerBlock);
}
