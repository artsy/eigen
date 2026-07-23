# Route Drift Report (eigen ↔ artsy/force)

Eigen supports universal links + deep links, so its route table
([`src/app/Navigation/routes.tsx`](../../src/app/Navigation/routes.tsx)) is
meant to mirror the web app's routes
([`artsy/force`](https://github.com/artsy/force) `src/Apps/*/*Routes.tsx`) — with
some intentional exceptions. Nothing enforces that, so the two drift, and drift
produces linking bugs: an artsy.net URL that _should_ open a native screen
silently opens inside a webview instead.

This tool generates a report answering:

- **Which force routes does eigen handle natively, and where do they route?**
- **Which force routes does eigen NOT handle** (they fall through to a webview /
  vanity-URL resolver)?
- **Which native eigen routes have no force counterpart** (candidate orphans /
  app-only screens)?

## Usage

```sh
yarn route-drift            # writes scripts/route-drift/route-drift-report.md
yarn route-drift --strict   # additionally exits 1 if non-allowlisted drift exists (CI)
```

Requires the GitHub CLI authenticated (`gh auth status`) — force routes are
fetched live via `gh api` at `main`.

## How it works

1. **Eigen side** ([`parseEigenRoutes.ts`](./parseEigenRoutes.ts)) — statically
   AST-parses `routes.tsx` into an ordered `{ path, name }` list (order matters:
   eigen matches first-match-wins).
2. **Force side** ([`parseForceRoutes.ts`](./parseForceRoutes.ts)) — fetches
   every `src/Apps/**/*Routes.tsx`, AST-walks nested `children`, and
   canonicalizes each into a concrete sample URL (params substituted, regex
   escape-hatches stripped, optional params expanded).
3. **Matching** ([`match.ts`](./match.ts)) — imports eigen's **real**
   [`RouteMatcher`](../../src/app/system/navigation/utils/RouteMatcher.ts) and
   replicates [`matchRoute`](../../src/app/system/navigation/utils/matchRoute.ts)'s
   first-match-wins loop, so results reflect production behavior rather than a
   re-implementation. A module name of `ReactWebView` / `ModalWebView` /
   `VanityURLEntity` (or no match) = falls through to a webview.
4. **AASA** ([`parseAASA.ts`](./parseAASA.ts)) — reads artsy.net's
   [`apple-app-site-association`](https://www.artsy.net/.well-known/apple-app-site-association)
   live and extracts the `NOT` patterns (paths deliberately excluded from
   universal links). Force routes matching these are treated as intentional and
   dropped from actionable drift — an authoritative, self-updating exclusion
   layer on top of the manual allowlist.
5. **Report** ([`generate.ts`](./generate.ts)) — writes grouped markdown.

A webview route is only counted as **actionable drift** when it is _not_ native,
_not_ suppressed by the allowlist / ignore-prefixes, and _not_ AASA-excluded.

## Allowlist

Intentional divergences go in [`allowlist.json`](./allowlist.json) with a
`reason`, and are suppressed from the report's actionable sections (and from
`--strict` failures).

## Known limitations

- **Param names are wildcarded positionally** (`:slug` ≡ `:fairID` ≡ `:id`), so
  matching is by segment shape, not param identity.
- **Query-param-based routes** and complex regex segments in force are
  approximated; annotate exceptions in the allowlist.
- **Redirects** (force sometimes 301s, e.g. gene→collection) are not followed —
  a redirected force path may show as "webview" though the target is native.
- Static parsing can miss routes assembled dynamically; see the "Parser
  warnings" section of the report.
