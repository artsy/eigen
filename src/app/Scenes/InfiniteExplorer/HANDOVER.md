# Infinite Explorer — Handover

Hackathon prototype: a Cosmos-app-style pinch-zoomable masonry grid for
artwork discovery, built by repurposing Infinite Discovery's existing data
layer (not a real feature branch — nothing here is meant to ship as-is).

Branch: `evaschilken/hackathon26`. Everything is uncommitted as of this
handover (`git status` shows `?? src/app/Scenes/InfiniteExplorer/` plus small
diffs in `routes.tsx`, `HomeViewSectionCard.tsx`,
`InfiniteDiscoveryArtworkCard.tsx`, and an unrelated `ios/*.pbxproj` bump).

## How to see it running

1. Metro + simulator should already be running (`yarn start`, `yarn ios`).
   Home screen → "Discover Daily" → "Try it" card now launches this scene
   instead of the original Infinite Discovery swiper.
2. Or deep link directly: `xcrun simctl openurl booted "artsy://infinite-explorer"`.
3. **If live edits stop appearing to take effect**, don't trust it — do a
   full relaunch, not just a deep-link re-navigate:
   ```
   xcrun simctl terminate booted net.artsy.artsy
   xcrun simctl launch booted net.artsy.artsy
   ```
   This bit us hard in this session: Fast Refresh's dev-socket had gone
   stale after a long session, so several real code changes produced zero
   visible difference, which looked exactly like a logic bug. Burned a lot
   of time chasing a phantom before checking this. If something looks
   unchanged after an edit, relaunch first, investigate second.
4. No touch/gesture simulation is available in this sandbox (`osascript`
   blocked — no Accessibility permission; `idb`/`idb-companion` not
   installed). Verification here is: `xcrun simctl io booted screenshot`,
   deep links, `xcrun simctl spawn booted log show ...` for native-level
   logs (JS `console.*` does **not** show up there — only CFNetwork/native
   events do). All actual pan/pinch/tap gesture testing has to be done by a
   human in the simulator.
5. Cheap trick for verifying non-visual state (e.g. "did every column get
   artworks?") without gesture testing: temporarily render a
   `columns.map(c => c.length).join(",")` string in a loud
   `backgroundColor: "red"` box at the top of `InfiniteExplorer.tsx`,
   screenshot, then revert. Used this to catch the round-robin starvation
   bug below — much faster than guessing from behavior alone.

## Architecture

```
InfiniteExplorerQueryRenderer.tsx   — data layer: query, pagination, exclude-id bookkeeping
InfiniteExplorer.tsx                — the pan/zoom canvas, gestures, focus/pagination triggers
Components/
  InfiniteExplorerColumn.tsx        — one column = a plain static View stack (no FlatList)
  InfiniteExplorerTile.tsx          — one artwork tile: image + lazy-load + Open button
  InfiniteExplorerHeader.tsx        — absolutely-positioned close button
hooks/useColumnLayout.ts            — VISIBLE_COLUMN_COUNT / EXTRA_COLUMNS_PER_SIDE / row-height math
utils/distributeRoundRobin.ts       — pure fn for spreading fetched artworks across columns
```

Reused from Infinite Discovery, unmodified except one export change:
- `infiniteDiscoveryQuery` / `infiniteDiscoveryVariables` (the `discoverArtworks` query)
- `useCreateUserSeenArtwork` mutation
- `infiniteDiscoveryArtworkCardFragment` — had to change from private `const` to
  `export const` in `InfiniteDiscoveryArtworkCard.tsx` so this scene's tile
  could `useFragment` on the same fragment. That's the only edit made to
  existing Infinite Discovery code.

### The core model: fixed-slot column array, one pannable canvas

- `TOTAL_COLUMN_COUNT` (currently 8 = `VISIBLE_COLUMN_COUNT` 4 +
  `EXTRA_COLUMNS_PER_SIDE` 2 on each side) columns are allocated up front and
  never resized — only individual columns' contents grow from `[]` to
  populated. This avoids layout-shift issues from a dynamically-resizing
  columns array.
- The canvas is one `Animated.View` with `flexDirection: "row"` holding all
  8 columns, wrapped in a single `GestureDetector` (`Gesture.Simultaneous(pinch, pan)`).
  A single-finger pan drags the *entire* grid as one plane (not independent
  per-column scrolling — this was an explicit user pivot away from the
  original per-column-FlatList plan). Pinch zooms the whole canvas.
- On mount, `translateX` starts shifted left by `EXTRA_COLUMNS_PER_SIDE *
  columnWidth` so the initial viewport shows exactly the middle
  `VISIBLE_COLUMN_COUNT` (4) columns, with the 2-per-side reserve columns
  sitting just offscreen. Panning/zooming out reaches them.
- **Transform order matters**: `canvasAnimatedStyle`'s transform array is
  `[{translateX}, {translateY}, {scale}]` — scale must be *last* (RN applies
  transforms right-to-left) so translate stays in fixed screen points
  (1:1 with the finger) and only the already-translated result gets scaled.
  Reversing this order was an earlier real bug (tapped tile animated into a
  corner instead of centering) — if you see that regress, check this first.

### Data flow / pagination

- `InfiniteExplorerQueryRenderer` owns one shared `excludeArtworkIdsRef`
  (capped to the most recent 150 IDs — `discoverArtworks` takes
  `excludeArtworkIds` as repeated GET params, and an unbounded list makes
  the URL too long and breaks the request) and one `fetchQueueRef` promise
  chain that serializes all fetches (so concurrent pagination triggers from
  different columns can't race on a stale exclude list).
- Every fetch's results get spread across **all** columns via
  `distributeRoundRobin`, not just the column that triggered the fetch —
  this was a deliberate simplification after an earlier attempt at
  "only fetch for columns near the viewport" (`targetColumnIndexes` /
  `isNearViewportHorizontally` gating) turned out to be the source of a bug
  where reserve columns never filled in. That gating code is gone; the
  `targetColumnIndexes` param on `distributeRoundRobin` still exists and is
  tested but currently always called with `undefined` (defaults to "all
  columns"). Fine to remove if nobody ends up needing it.
- **Round-robin starvation bug (fixed this session, worth knowing about)**:
  `distributeRoundRobin` used to always start dealing a batch at column 0.
  Since one page of `discoverArtworks` results is smaller than
  `TOTAL_COLUMN_COUNT` (8), the same low-index columns got every batch,
  while higher-index columns — including the right-side reserve columns —
  never got anything, from any fetch, ever. Fixed by adding a `startOffset`
  param that `InfiniteExplorerQueryRenderer` tracks in `roundRobinOffsetRef`
  and advances by `newArtworks.length` after every distribution, so which
  columns get the "short end" rotates instead of always being the same
  ones. If you ever see specific columns permanently empty again, this is
  the first place to check — and check whether the offset is actually being
  threaded through correctly, not just that it exists.
- `allArtworkIdsRef` (separate from the capped exclude list) is the actual
  duplicate guard — it's an unbounded `Set` of every artwork ID ever
  rendered anywhere, used to filter each fetch response before
  distributing, since the *capped* exclude list can let an old ID fall off
  and get legitimately re-served by the API.
- Pagination trigger (`checkPagination` in `InfiniteExplorer.tsx`) measures
  each column's own bounding box (via a `columnRefsMap`, not the last tile)
  so it works for empty reserve columns too (zero height trivially counts
  as "needs more"). Runs on mount, after every fetch resolves (via a
  `useEffect` keyed on `checkPagination`, which is recreated whenever
  `columns` changes), and after every gesture ends.

### Row/column sizing (today's changes)

- `useColumnLayout.ts`: `VISIBLE_COLUMN_COUNT = 4` → `useColumnWidth() =
  screenWidth / 4`, so exactly 4 columns fill the screen edge-to-edge on
  load (this took a few iterations earlier — if columns ever look
  off-by-one or leave a black stripe on one side, check `initialTranslateX`
  in `InfiniteExplorer.tsx` against `EXTRA_COLUMNS_PER_SIDE * columnWidth`).
- New `useMaxTileHeight() = screenHeight / VISIBLE_ROW_COUNT` (4), added
  today, replacing the old flat `columnWidth * 3` cap in
  `InfiniteExplorerTile.tsx`. This caps any single tile at 1/4 of the screen
  height so at least ~4 rows are always visible on initial load without
  panning (most tiles end up shorter than the cap since it only binds for
  very tall portrait images, so in practice more like 6-7 rows are visible).
  Threaded through as a plain prop: `InfiniteExplorer` →
  `InfiniteExplorerColumn` → `InfiniteExplorerTile`.

### Lazy loading

- Every tile in a column mounts at once (no FlatList windowing, since the
  canvas is one pannable plane) — `InfiniteExplorerTile` defers the real
  `<Image>` until a `Sentinel` (existing polling-based viewport-visibility
  utility, `app/utils/Sentinel.tsx`, already used by `RouterLink` for
  prefetching) reports the tile is near-visible. Before that, it renders a
  `react-native-blurhash` `<Blurhash>` placeholder.

### Tile UI

- Simplified thumbnail at rest (image + black `borderWidth: 3` border, no
  artist name / save button — these were tried and explicitly removed:
  artist name felt too heavy pulled from `ArtistListItemContainer`, and the
  Follow button couldn't be resized so it was dropped entirely).
- "Open" button only appears on the focused tile once zoomed in past
  `OPEN_BUTTON_ZOOM_THRESHOLD` (2x). It's sized with explicit small values
  (`px="8px" py="3px"`, `fontSize: 9`), **not** a `transform: scale()`  — an
  earlier attempt to shrink it via `scale` made it visibly pixelated; the
  user explicitly flagged this, so if asked to resize this button again,
  resize the actual box/font, don't reach for `scale`.
- The Open button is wrapped in the caller's own plain
  `<View style={{position: "absolute", ...}}>`, not passed a `style` prop
  directly on `RouterLink` — `RouterLink` with viewport prefetching enabled
  wraps children in extra layers, so a `style` prop passed directly to it
  doesn't land where you'd expect and the button silently disappears. This
  was a real, confusing bug earlier — don't "simplify" it back.

## What's verified vs. not

Verified via screenshots this session (after fixing the stale-Fast-Refresh
issue): 4 columns fill the screen with no black stripe on load; all 8
column slots get artworks fairly (confirmed via the debug-overlay trick,
saw `5,5,5,5,4,4,4,4` — balanced, no zeros); 6-7 rows of real content
visible in the initial viewport with no error toasts. `yarn tsc`, `yarn
lint`, and `yarn test src/app/Scenes/InfiniteExplorer` (8/8) all pass.

**Not yet verified by an actual human touch test** (agent has no gesture
simulation): does panning/pinch-zooming to the left/right edge reliably
reveal the reserve columns with content already loaded, mid-pan? The
round-robin starvation fix and the "distribute to all columns always"
simplification should mean the reserve columns keep accumulating content in
the background the whole time (not just when scrolled into view), so this
*should* just work — but it was the original complaint that kicked off a
few rounds of fixes, so it's worth an explicit hands-on check before
calling it done. Also not verified: tap-to-focus, pinch zoom out to see all
8 columns at once, Open button navigation + back-stack state preservation.

## Useful commands

```bash
# typecheck / lint / test this scene
yarn tsc --noEmit
yarn lint --fix src/app/Scenes/InfiniteExplorer/**/*.ts*
yarn test src/app/Scenes/InfiniteExplorer

# deep link + screenshot loop
xcrun simctl openurl booted "artsy://infinite-explorer"
xcrun simctl io booted screenshot /path/to/out.png

# full relaunch (use this if edits stop appearing to take effect)
xcrun simctl terminate booted net.artsy.artsy
xcrun simctl launch booted net.artsy.artsy

# native-level logs (won't show JS console.log, only native/network events)
xcrun simctl spawn booted log show --predicate 'process == "Artsy"' --last 30s --style compact
```

## Original plan doc

The original plan-mode design doc (data reuse decisions, column-count
formula history, out-of-scope notes) is at
`~/.claude/plans/memoized-bubbling-forest.md` on this machine — useful
background but some specifics (e.g. `useColumnCount.ts`,
per-column-FlatList scrolling) are superseded by the pivots described above.
