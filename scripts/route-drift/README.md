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
- **Where do the deep-link configs disagree across platforms?**
  - Paths the Android manifest allowlists that iOS AASA excludes (e.g. `/news`).
  - Native eigen screens missing from the Android manifest allowlist (so their
    web links open the browser on Android instead of the app).

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
5. **Android** ([`parseAndroidManifest.ts`](./parseAndroidManifest.ts)) — reads
   the App Links allowlist (`<data>` path rules in the artsy.net autoVerify
   intent-filter) from the local
   [`AndroidManifest.xml`](../../android/app/src/main/AndroidManifest.xml) — no
   network needed. Android has no deny mechanism, so it's an inclusion allowlist;
   the report cross-checks it against both the AASA exclusions and eigen's native
   routes.
6. **Report** ([`generate.ts`](./generate.ts)) — writes grouped markdown.

A webview route is only counted as **actionable drift** when it is _not_ native,
_not_ suppressed by the allowlist / ignore-prefixes, and _not_ AASA-excluded.

## Allowlist

Intentional divergences go in [`allowlist.json`](./allowlist.json) with a
`reason`, and are suppressed from the report's actionable sections (and from
`--strict` failures).

## Maintaining the AASA exclusion list (rubric)

The `NOT` entries in the
[`apple-app-site-association`](https://www.artsy.net/.well-known/apple-app-site-association)
file decide which URLs are _deliberately_ kept out of the app: a matching URL
opens mobile web instead of deep-linking into eigen. The file is served at
artsy.net by a Cloudflare Worker and maintained in
[`artsy/artsy-eigen-web-association`](https://github.com/artsy/artsy-eigen-web-association)
— the `NOT` list lives in
[`constants.ts`](https://github.com/artsy/artsy-eigen-web-association/blob/main/constants.ts).
That list drifts too — exclusions get added for a
reason that later stops applying (e.g. we couldn't render editorial content
natively, but now we can), or a flow that _should_ be excluded never gets added.
Review it periodically alongside this report.

Two **independent** questions decide where a route belongs:

**1. Does a native screen exist (or should one) for this content?**
If yes, the route belongs in `routes.tsx` and should **not** be in the AASA
`NOT` list — we want universal links to open the rich native screen. The report's
**🔀 Review** section flags violations of this (native screen exists _and_
AASA-excluded), e.g. `/news`.

**2. Is this route part of a web flow that must not be interrupted?**
Checkout, payment, auth / OAuth callbacks, identity verification. If yes, it
**should** be in the AASA `NOT` list — bouncing a mid-checkout mobile-web user
into the app loses their session and context. (Today `/order`/checkout routes are
_not_ excluded — a candidate to add.)

Decision table:

| Native screen exists? | Uninterruptible web flow?         | AASA should…                              | Notes                                             |
| --------------------- | --------------------------------- | ----------------------------------------- | ------------------------------------------------- |
| Yes                   | No                                | **allow** (not in `NOT`)                  | native deep-link — the happy path                 |
| Yes                   | Yes                               | **exclude** (`NOT`)                       | flow wins; screen still reachable via `artsy://`  |
| No                    | Yes                               | **exclude** (`NOT`)                       | keep the user in the web flow                     |
| No                    | No — content worth having         | allow → in-app webview, or build a screen | this is "actionable drift" in the report          |
| No                    | No — web-only (admin, SEO, legal) | either                                    | exclude to avoid a degraded webview, or allowlist |

**Periodic review checklist** (run `yarn route-drift`, then):

- **🔀 native but AASA-excluded** → likely a stale exclusion; remove it from the
  AASA `NOT` list in `artsy/artsy-eigen-web-association` so links reach the
  native screen.
- **⚠️ actionable drift** → a web link opens an in-app webview. Build a native
  screen, OR (if it's an uninterruptible flow) add it to the AASA `NOT` list, OR
  allowlist it here if the webview is intentional.
- **🍎 AASA-excluded** → sanity-check each still makes sense (does the app now
  handle this content?).

Changing the AASA list requires a PR to `artsy/artsy-eigen-web-association`
(then the Cloudflare Worker redeploys); changing native coverage is a PR here in
eigen.

## Known limitations

- **Param names are wildcarded positionally** (`:slug` ≡ `:fairID` ≡ `:id`), so
  matching is by segment shape, not param identity.
- **Query-param-based routes** and complex regex segments in force are
  approximated; annotate exceptions in the allowlist.
- **Redirects** (force sometimes 301s, e.g. gene→collection) are not followed —
  a redirected force path may show as "webview" though the target is native.
- **Android `pathPrefix` is not segment-aware** — `/collect` literally matches
  `/collections` too. The cross-platform check reflects this real behavior, so
  it may surface prefix-overlap pairs (e.g. `/collect` ↔ `/collections`) that are
  technically correct but low-priority.
- Static parsing can miss routes assembled dynamically; see the "Parser
  warnings" section of the report.
