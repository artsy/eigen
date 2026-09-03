# City Guide Itineraries — Second Independent Review

**Branch:** `city-guide-itineraries-docs`
**Date:** 2026-08-26
**Reviews:** `docs/superpowers/reviews/2026-08-26-city-guide-itineraries-review.md` (prior review), against
`docs/superpowers/handoffs/2026-08-26-city-guide-itineraries-handoff.md` (spec + plan).
**Method:** Every finding re-verified against the repository. Nothing edited.

Of 29 items: 22 Confirm, 6 Modify, 1 Reject.

## Blocking findings

### BLOCK-01 — Save-target shape cannot drive the mutations — **Confirm**

**Evidence.** `data/schema.graphql:19728` `input FollowShowInput { clientMutationId, partnerShowID, unfollow }`.
`data/schema.graphql:19716` `input FollowProfileInput { clientMutationId, profileID, unfollow }`.
`type Partner` (line ~632) exposes `profile: Profile` and **no `isFollowed`**. `type Profile` (line 30957)
carries `id: ID!`, `internalID: ID!`, `isFollowed: Boolean`. `PartnerFollowButton.tsx:19-23` passes
`data?.profile.id`, `data?.profile.internalID`, `!!data?.profile.isFollowed`.

**Reasoning.** The plan's `entity: { __typename: "Show" | "Partner"; id; slug; isFollowed }` has no
`internalID`, so it cannot supply `partnerShowID`/`profileID`, and it puts `isFollowed` on `Partner`,
where the field does not exist.

**Precision the prior review missed.** For a Show, the node `id` is needed _only_ for the store updater,
not for the mutation input (`ShowFollowButton.tsx:47-53`). State that so the corrected type does not
over-justify carrying both.

**Amendment.** Replace `entity` with a discriminated, nullable `saveTarget`. See Corrected data model.

### BLOCK-02 — Local UI toggle presented as a persisted save — **Confirm, and more severe than stated**

**Evidence.** Plan Task 7 stores stop ids in a component-local `Set`, calls no mutation, and toasts
"Saved to your saves". The prior review assumed prototype framing might contain this. It does not:
`src/app/Navigation/routes.tsx:1128-1131` registers `path: "/city-guide"` → `CityGuideNew` with **no
feature-flag check**; `routes.tsx` contains no `useFeatureFlag` at all. Only the _entry points_ are
gated (`CityGuideCTA.tsx:8`, `CityGuideMapHeader.tsx:25`, `CityGuideCitySwitcherButton.tsx:14`, all on
`AREnableGlobalMapList`).

**Reasoning.** `/city-guide` is reachable by deep link today regardless of flag state, so the itinerary
route would be too. A production-reachable screen confirming a save that evaporates on remount is not
acceptable, and "it's behind a flag" is not available as a defence.

**Amendment.** The prior review's three options are all worse than a fourth it did not consider. See
Missing findings MISS-04.

### BLOCK-03 — Task 3 migration does not type-check — **Confirm**

**Evidence.** `src/__generated__/CityGuideShow_show.graphql.ts:23` reads
`readonly is_followed: boolean | null | undefined;`. tsconfig extends `@react-native/typescript-config`
(`strict: true`). Verified empirically with the repo's own compiler:
`error TS2322: Type 'boolean | null | undefined' is not assignable to type 'boolean | null'`.

**Amendment.** Declare `FollowShowOptions.isFollowed: boolean | null | undefined` and normalize once
inside the hook with `const nextFollowedState = !isFollowed`. No call-site casts.

### BLOCK-04 — Task 3 hook tests cannot pass — **Confirm**

**Evidence.** `setupTestWrapper.tsx:93-129`: with no `query`, the render is bare
`<Component {...props} />` (line 108), but the `act` block at 114-129 unconditionally calls
`env.mock.resolveMostRecentOperation`. `relay-test-utils/lib/RelayModernMockEnvironment.js:220` throws
`"RelayModernMockEnvironment: There are no pending operations in the list"`.

**The useful part.** `src/app/Scenes/Artwork/hooks/__tests__/useSendInquiry.tests.tsx` is the working
pattern: module-level `createMockEnvironment()`, a bespoke wrapper of `RelayEnvironmentProvider` +
`GlobalStoreProvider`, then `renderHook(() => useFollowShow({...}), { wrapper })` and
`act(() => result.current.followShow())`. Note `src/app/utils/mutations/` has **no `__tests__`
directory at all** — Task 3 would create the first test in that folder, so there is no local precedent
to copy.

**Amendment.** Rewrite Task 3 Steps 1 and 5 around `renderHook`. Assert on the optimistic store value,
not only on mutation variables.

### BLOCK-05 — Freeform section titles used as identity — **Confirm**

**Reasoning.** The plan uses `section.title` as a React key (Task 7), a Mapbox filter value (Task 10),
and the stop→section lookup value (Task 9). Two sections legitimately sharing a title would merge.
The fix is one field and is cheap now, expensive after the API is designed around titles.

**Amendment.** Add `ItinerarySection.id`. Titles stay opaque display strings.

### BLOCK-06 — Two curated rows deliberately lead nowhere — **Confirm**

**Reasoning.** Task 8 ships three visible rows where two resolve to ids with no mock data. Coverage of
the unavailable branch belongs in a test that navigates to an unknown id directly, not in shipped UI.

**Amendment.** Give all three rows mock data. Keep an unavailable-route test.

## Should-fix findings

### FIX-01 — Do not extend `CityGuideMapPins`; do create the promised component — **Confirm**

`CityGuideMapPins.tsx` is 94 lines, ~75 of them clustering- or show-specific: `SELECTED_CLUSTER_COLOR`
and `CLUSTER_CIRCLE_RADIUS` (8-10), a sprite `iconImage` `case` expression keyed on `slug` (24-34),
`clusteredPointsStyle` with `cluster_id` recolouring and a `step` radius ramp (36-57),
`clusterCountStyle` (59-65), and `featureCollections[filterID].featureCollection` (68) hardwiring the
bucket/tab shape. Even the `ShapeSource` scaffold hardcodes `id="shows"`, `cluster`, and
`clusterRadius`. The plan is right to avoid it and wrong not to create the separate component it
describes. See Map architecture decision.

### FIX-02 — Extract `useFollowShow`, keep the save button scene-local — **Confirm**

Three `followShow` sites exist (corrected line numbers): `CityGuideEvent.tsx:110-111`,
`ShowFollowButton.tsx:48-49`, `Lists/ShowItemRow.tsx:57-58`. The hook is justified by code on disk.
The shared `SaveButton` is not. See Extraction decisions.

### FIX-03 — Use `setShowFollowed`; drop the alias fallback — **Modify**

**Mechanism confirmed, severity overstated.** `src/app/utils/mutations/setShowFollowed.ts` writes
`show.setValue(isFollowed, "isFollowed")`, and `relay-runtime/lib/store/RelayStoreUtils.js:71-78`
confirms the storage key is the schema field name, not the alias — visible in
`src/__generated__/ShowItemRowMutation.graphql.ts:66-72`
(`{"alias": "is_followed", ..., "name": "isFollowed"}`). So my proposed extra
`setValue(x, "is_followed")` is **inert, not harmful**: it writes a key nothing reads. The prior
review's "incorrect" is right; any implication of corruption is not.

**Amendment.** Use `setShowFollowed(store, id, nextFollowedState)` in the hook. Delete the fallback
branch and the contradictory prose. This finding also exposes a live defect — see MISS-02.

### FIX-04 — `citySlug` accepted but ignored — **Confirm**

`/city-guide/paris/itinerary/chill-vibes-only` renders the London itinerary. Amendment: make the
lookup `{ citySlug, itineraryId }` and render the unavailable state on mismatch.

### FIX-05 — Two sources of truth for ordering — **Confirm**

Array position drives render order; `order` drives the printed number; nothing reconciles them.
Amendment: delete `order` and derive the number from the flattened index. The design numbers stops
continuously across sections (1-5 spanning Day 1 and Day 2 in node `84:36426`), which a per-stop
`order` field invites drift from.

### FIX-06 — Loose content fields — **Modify**

**Structured time: accept.** `timeLabel` alone cannot sort, localize, or support schedule behaviour.
Add optional `startAt`/`endAt` alongside a backend `displayTime`.

**Typed annotation: reject.** The prior review could not know this, but `description: string` was an
explicit product-owner decision during brainstorming, overriding a proposed `emojiTags: string[]`,
on the grounds that the backend field "might be a string". Replacing it with
`{ kind: "TEXT" | "EMOJI"; value }` reverses a decision the owner already made. Keep the string;
rename it `note` since the design only ever shows emoji and "description" collides with the
itinerary-level `description`.

### FIX-07 — Fit the map to visible stops — **Confirm**

`CityGuideMap.tsx:336-343` and `:127-131` both centre-and-zoom, never fit. `@rnmapbox/maps` 10.3.1
supports it: `Camera.d.ts:47` `bounds?: CameraBoundsWithPadding`, `:101-104`
`CameraBounds = { ne: Position; sw: Position }`, and the ref exposes `fitBounds` (`:15`). Idiomatic
here is `cameraRef.current?.setCamera({ bounds: { ne, sw, paddingTop, ... }, animationDuration })`,
matching the existing `setCamera` call. Padding matters because overlay chrome covers the map edges.

### FIX-08 — Hidden Mapbox initialization coupling — **Confirm, and wider than described**

`CityGuideMap.tsx:41` calls `setAccessToken` and `:53` exports `ArtsyMapStyleURL` from the same module,
above the component at `:55`. The blast radius is larger than the prior review states:
`Partner/Components/PartnerMap.tsx:8` and `Components/LocationMap/LocationMap.tsx:8` **already import
`ArtsyMapStyleURL` cross-scene**, violating the AGENTS.md rule, and each calls `setAccessToken` again
(`:14` and `:15`) — three calls total. No shared map module exists.

**Amendment.** Create `src/app/utils/mapbox.ts` with `ArtsyMapStyleURL` and one idempotent
`configureMapbox()`, and repoint all three consumers. Mechanical, and it clears two existing
convention violations rather than adding a third.

### FIX-09 — Add a route assertion — **Confirm**

`src/app/Navigation/__tests__/routes.tests.ts` is 1414 lines of per-route `it(...)` blocks with **no
snapshot iterating the route table**, so `yarn test src/app/Navigation` neither breaks nor proves
anything when a route is added. `matchRoute` lives at `src/app/system/navigation/utils/matchRoute.ts:8`.
The two-param model to copy is `routes.tests.ts:1070-1078`.

### FIX-10 — One Task 8 "red" test is already green — **Confirm**

The "renders a row per curated list" test asserts only text the current component already renders, and
RNTL normalizes the trailing whitespace in the existing `"Chill Vibes Only "`. It is green before
implementation, so it is not a TDD red step. Amendment: assert the row count or accessible role. The
navigation test is the genuine red one.

### FIX-11 — Use `RouterLink` — **Modify**

Real, but the severity is lower than implied: `.eslintrc.js:145-150` explicitly sanctions the escape
hatch ("you can import `navigate` by adding a '// eslint-disable-next-line no-restricted-imports'
comment"). So the plan is _allowed_, just not idiomatic, and it forfeits prefetching. Static-destination
precedents: `ArtworkClassification.tsx:27`, `ArtworkAuctionCreateAlertHeader.tsx:92`, both
`<RouterLink to="..." hasChildTouchable>`. Amendment: use `RouterLink`, downgrade from should-fix to
polish.

### FIX-12 — Animation changed to suit the Jest mock — **Modify**

**Split the finding.** The claim that the plan animates on initial mount is **correct and is a real
defect**: plan Task 2 uses `useEffect(..., [isSaved])`, which fires on mount, so every visible row
would pop on first render. Fix with a `useRef` first-run guard.

The claim that swapping one icon instead of crossfading two is a capitulation to the test harness is
**not supported**. A single-icon spring pop is a legitimate production animation, not a degraded one,
and the user's stated requirement was a tick with "a cute animation" — not specifically a crossfade.
Amendment: keep the single-icon swap, add the mount guard, and stop citing the Jest mock as the
justification in the plan's prose.

### FIX-13 — Commit checkpoints violate AGENTS.md — **Confirm**

`AGENTS.md:41-51` requires `yarn tsc`, `yarn test --findRelatedTests <changed-files>`, and
`yarn lint <changed-files>` before every commit. Most plan tasks run a targeted `yarn test <path>`
instead of `--findRelatedTests`, and Task 3's first commit omits type-check and lint entirely.

### FIX-14 — Release-quality integration concerns — **Confirm**

Tracking is the sharpest omission and the prior review understates it: `CityGuideEvent.tsx:40,122-124`
already fires `Schema.ActionNames.SaveShow` / `UnsaveShow` on save. The itinerary plan adds a save
control with **no tracking at all**, so the same user action is instrumented on one surface and silent
on another. Safe-area handling, hero-text contrast, and the accessibility pass are also genuine gaps.

### FIX-15 — Use FlashList for the itinerary list — **Reject**

`docs/best_practices.md:209` and `:213` are real, but both sit under the "VirtualizedList best
practices" heading at `:205`, and the rule they state is _don't nest ScrollViews_ and _prefer FlashList
over FlatList_. A `Screen.ScrollView` rendering 5-15 statically mapped rows nests nothing and is not a
virtualized list. Repo practice is unambiguous: `AuctionBuyersPremium.tsx:40,63` and
`ArtworkAttributionClassFAQ.tsx:20,26` both map arrays inside a plain `ScrollView`, and
`CityGuideNew.tsx:40-55` — the parent screen this work extends — already renders
`CityGuideCuratedLists.tsx:25`'s `data.map(...)` inside a `Screen.ScrollView`. Adopting FlashList here
would make the itinerary screen inconsistent with its own parent. No change.

## Repository-claim corrections

| Item                                    | Verdict                           | Note                                                                                                                                                                                                                                                                                                     |
| --------------------------------------- | --------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| CLAIM-01 wrong feature flag             | **Confirm, understated**          | `AREnableExpandedCityGuide` only picks the city JSON (`CityGuideCityPicker.tsx:45-47`); `AREnableGlobalMapList` gates the CTA (`CityGuideCTA.tsx:8,15`). Critically, **neither gates the screen** — see MISS-01.                                                                                         |
| CLAIM-02 mutation-copy count            | **Confirm**                       | Three sites, not two. Line numbers off by 1-2: `CityGuideEvent.tsx:110-111`, `ShowFollowButton.tsx:48-49`, `ShowItemRow.tsx:57-58`.                                                                                                                                                                      |
| CLAIM-03 MapPins type provenance        | **Confirm**                       | `BucketKey` from `utils/bucketCityResults:14`, `FilterData` from `utils/types:47`. `cityTabs` is not imported by that file at all.                                                                                                                                                                       |
| CLAIM-04 cluster-leaf ownership         | **Confirm**                       | Sole hit is `CityGuideMap.tsx:266`. `CityGuideMapPins` only declares the ref (`:19`) and attaches it (`:72`).                                                                                                                                                                                            |
| CLAIM-05 TODO-comment claim             | **Confirm as scoped, incomplete** | Only `CityGuideCityPicker.tsx:62` among the four named. But `CityGuideEventList.tsx:35`, `CityGuideAllEvents.tsx:74`, `CityGuideSavedEventSection.tsx:15`, `CityGuideFairEventSectionCard.tsx:16` carry the same marker — it's a folder-wide pattern, so the handoff's framing misleads in a second way. |
| CLAIM-06 manifest ordering              | **Modify**                        | Unsorted: correct, and there are three breaks, not one — `:92-93`, `:109-110`, `:142-144`. Insertion point between `:103 /categories` and `:104 /collect` is right.                                                                                                                                      |
| CLAIM-07 stale task number, toast prose | **Confirm both**                  | Plan line 1067 says "Task 9 adds the map toggle"; Task 10 does. Line 1222 claims the toast copy "is deliberately the same in both directions" while the strings differ. Both mine.                                                                                                                       |
| CLAIM-08 missing pins component         | **Confirm**                       | Task 10 promises a ~40-line separate component and then inlines map, camera, layers, filters, and count state into `ItineraryMapView`.                                                                                                                                                                   |

## Missing findings

Material problems neither document identified.

**MISS-01 — `/city-guide` is not gated at all.** `routes.tsx:1128-1131` registers the route with no
flag check, and `routes.tsx` contains no `useFeatureFlag`. Everyone reasoning about this feature —
including both reviews — assumed `AREnableExpandedCityGuide` provided prototype cover. It does not.
Any deep link reaches `CityGuideNew` and its `picsum.photos` placeholders today. This is the load-bearing
fact under BLOCK-02, and it is arguably a pre-existing problem worth raising outside this work.

**MISS-02 — `CityGuideEvent`'s optimistic updater is already dead code on `main`.**
`CityGuideEvent.tsx:62-65` writes `store.get(nodeID).setValue(!isShowFollowed, "is_followed")` behind a
`@ts-expect-error`. Per FIX-03's mechanism, that key is never read. The button still works, because the
`optimisticResponse` at `:53-61` is payload-shaped and Relay normalizes its alias correctly — so this is
latent dead code, not a user-visible bug. Task 3 should delete it via `setShowFollowed` and say so.

**MISS-03 — The fake mock identifiers are the root cause of BLOCK-01 and BLOCK-02.** Both blocking
findings trace to one decision: mock stops carry invented entity ids. Fix that and both largely
dissolve. See MISS-04.

**MISS-04 — A fourth option for BLOCK-02 that the prior review did not consider.** Its three options
were: prerequisite real wiring, gate as prototype, or defer the save control entirely. All three are
worse than _keeping the itinerary structure mock while making the entities real_: populate
`saveTarget` with genuine Show `internalID`s and Relay node ids from a real city, and call
`useFollowShow` for real. The save then persists, survives remount, reuses existing auth and error
handling, and needs no fake-success copy — while the itinerary grouping stays mock pending the API.
This also satisfies the original request for a working tick-and-toast, which option 3 would have
dropped.

**MISS-05 — `src/app/utils/mutations/` has no tests whatsoever.** Task 3 would add the first, so the
plan cannot lean on a neighbouring file for the harness. Point it at
`Scenes/Artwork/hooks/__tests__/useSendInquiry.tests.tsx` explicitly.

**MISS-06 — Non-Artsy stops have no representation.** The design's "Coffee at London Cafe" is a cafe.
The plan types it as a `Partner`, implying an Artsy gallery profile that can be followed. Either
editorial stops can be non-Artsy places — in which case `saveTarget` must be nullable and the save
control conditional — or the backend guarantees every stop is a real entity. Nobody has asked. This is
a question for the API design session, and the type should not pre-judge it.

**MISS-07 — Hero text contrast is unspecified.** `ItineraryHeader` renders `color="mono0"` text over an
arbitrary backend image with no scrim or gradient. Over a light photograph the title is unreadable.
Small, but it is a correctness issue, not a polish item.

## Corrected data model

Resolves save identifiers, section identity, saveability, ordering, time, and prose/emoji. No richer
than the demonstrated requirements.

```ts
/** A stop's Artsy entity, or null for an editorial non-Artsy place (e.g. a cafe). */
export type ItinerarySaveTarget =
  | { type: "SHOW"; nodeId: string; internalID: string; slug: string; isFollowed: boolean }
  | { type: "PROFILE"; nodeId: string; internalID: string; slug: string; isFollowed: boolean }

export interface ItineraryStop {
  id: string
  title: string
  /** Backend-formatted for display. e.g. "11am-4pm" */
  displayTime: string
  /** Optional structured schedule. Enables sorting and timezone-aware formatting later. */
  startAt?: string // ISO 8601
  endAt?: string // ISO 8601
  /** Freeform. Emoji in every design shown so far, but typed as prose-capable by product decision. */
  note?: string
  imageUrl: string
  coordinates: { lat: number; lng: number }
  /** null when the stop is not a saveable Artsy entity; the save control is then not rendered. */
  saveTarget: ItinerarySaveTarget | null
}

export interface ItinerarySection {
  /** Stable identity. Used for keys, lookups, and map filters. */
  id: string
  /** Opaque backend-authored display string. Never used as identity. */
  title: string
  /** Array order is the render order. */
  stops: ItineraryStop[]
}

export interface Itinerary {
  id: string
  citySlug: string
  title: string
  subtitle: string
  heroImageUrl: string
  authorName: string
  description: string
  sections: ItinerarySection[]
}
```

Decisions and why:

- **`saveTarget` is discriminated and nullable.** `SHOW` → `followShow({ partnerShowID: internalID })`;
  `PROFILE` → `followProfile({ profileID: internalID })`. `nodeId` exists solely for the store updater.
  `PROFILE` rather than `PARTNER` because `isFollowed` lives on `Profile`, and Fairs follow the same
  path — one variant covers galleries and fairs.
- **`order` deleted.** The stop number is the flattened index across sections, matching the design's
  continuous 1..N numbering. One source of truth.
- **`id` added to sections, `title` demoted to display.** Resolves BLOCK-05.
- **`displayTime` plus optional `startAt`/`endAt`.** The backend keeps formatting authority; structured
  fields unblock sorting without forcing client formatting now.
- **`note?: string` retained over a typed annotation.** Honours the explicit product-owner decision;
  renamed from `description` to stop colliding with `Itinerary.description`.

## Extraction decisions

Judged on code on disk, not promised consumers.

**`useFollowShow` — extract to `src/app/utils/mutations/` now.** Three inline copies exist today
(`CityGuideEvent.tsx:110`, `ShowFollowButton.tsx:48`, `ShowItemRow.tsx:57`). `useFollowProfile.ts` is the
established sibling. Justified without appeal to future work. Migrate `CityGuideEvent` in this
sub-project; leave the other two for a follow-up so the diff stays reviewable.

**`SaveButton` — keep scene-local.** One consumer, and its plus-to-tick semantics are itinerary-specific.
Create `Screens/Itinerary/Components/ItinerarySaveButton.tsx`. Extract when a second real consumer
arrives. My original justification — that sibling sub-projects would need it — is exactly the reasoning
that produces speculative shared components, and those sub-projects are not written yet.

## Map architecture decision

**Option 2: a local `ItineraryMapPins`, used by `ItineraryMapView`.**

Option 1 is wrong on the evidence: ~75 of `CityGuideMapPins`'s 94 lines are clustering- or
show-specific, and extending it means adding cluster-on/off and icon-versus-label flags to a component
with one existing caller. Option 3 is premature: a shared primitive extracted from two callers would be
thinner than either and would abstract over a difference nobody has yet had to reconcile. Revisit at a
third pin variant.

Responsibilities:

- `ItineraryMapPins.tsx` — pure rendering. Takes a feature collection and an optional section filter.
  Owns `ShapeSource` (no `cluster` prop), `CircleLayer`, and the `SymbolLayer` whose
  `textField: ["get", "number"]` draws the stop number. No state, no camera, no data fetching.
- `ItineraryMapView.tsx` — layout and interaction. Owns the `MapView`, the camera (including bounds
  fitting per FIX-07), the filter pills, selected-section state, and safe-area insets.
- The spec's "extend `CityGuideMapPins`" instruction must be amended, not silently ignored as the plan
  currently does.

Also required: `src/setupJest.tsx:295-304` must gain `Camera` and `CircleLayer` before either component
is testable. Both are absent today, and `UserLocation` and `PointAnnotation` are too.

## Known-gap disposition

| Gap                         | Disposition            | Action                                                                                      |
| --------------------------- | ---------------------- | ------------------------------------------------------------------------------------------- |
| "Add Full List" omitted     | Acceptable deferral    | Keep out of scope; do not render the control.                                               |
| Toast copy unconfirmed      | Pre-release            | Needs product sign-off. Blocking only if MISS-04 is rejected and the fake-save copy stands. |
| Emoji as plain text         | Acceptable deferral    | Product chose a string field deliberately. Revisit only if two distinct treatments appear.  |
| Fixed first-stop camera     | Pre-release            | Fit bounds to visible stops (FIX-07). Not blocking while data is mock and hand-placed.      |
| Two rows open missing mocks | **Blocking**           | Add mock data for all three rows (BLOCK-06).                                                |
| Hero text contrast          | **Blocking** (new)     | Add a scrim or gradient; unreadable over light images (MISS-07).                            |
| No save tracking            | Pre-release            | Mirror `Schema.ActionNames.SaveShow` (FIX-14).                                              |
| `/city-guide` ungated       | Out of scope, escalate | Pre-existing (MISS-01). Raise separately; do not silently rely on flag cover.               |

## Corrected task plan

| Task                    | Required amendments                                                                                                                                                                                                                                                                                                                                                                                                                          |
| ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **1** Types + mock data | Adopt the corrected data model. Add `ItinerarySection.id`; delete `order`; rename `description`→`note`; add `displayTime`/`startAt`/`endAt`; replace `entity` with nullable discriminated `saveTarget`. Populate `saveTarget` with **real** Show `internalID`s and node ids (MISS-04). Add mock data for all three curated rows (BLOCK-06). Add the AGENTS.md three-command pre-commit block.                                                |
| **2** Save button       | Rename to `ItinerarySaveButton`, move into `Screens/Itinerary/Components/` (FIX-02). Add a `useRef` first-run guard so it does not animate on mount (FIX-12). Drop the Jest-mock justification from the prose. Render nothing when `saveTarget` is null (MISS-06).                                                                                                                                                                           |
| **3** `useFollowShow`   | Widen `isFollowed` to `boolean \| null \| undefined` (BLOCK-03). Use `setShowFollowed(store, id, next)`; delete the alias fallback and the contradictory `onCompleted` prose (FIX-03). Rewrite tests around `renderHook` + a bespoke `RelayEnvironmentProvider` wrapper, modelled on `useSendInquiry.tests.tsx` (BLOCK-04, MISS-05). Note that the migration deletes dead code (MISS-02). Add tsc/lint to the first commit (FIX-13).         |
| **4** Stop row          | Consume `saveTarget`, not `entity`. Derive the number from the flattened index, not `order` (FIX-05). Render the save control only when `saveTarget` is non-null. Wire real save via `useFollowShow` (BLOCK-02/MISS-04).                                                                                                                                                                                                                     |
| **5** Section row       | Key on `section.id`, not `title` (BLOCK-05). Otherwise unchanged. Verify `ChevronDownIcon`/`ChevronUpIcon` export names before relying on them.                                                                                                                                                                                                                                                                                              |
| **6** Header            | Add a scrim or gradient behind the white title and subtitle (MISS-07).                                                                                                                                                                                                                                                                                                                                                                       |
| **7** Screen            | Delete the local `Set` and the fake-save toast; read `saveTarget.isFollowed` and call `useFollowShow` (BLOCK-02). Honour `citySlug` in the lookup and reject mismatches (FIX-04). Add save/unsave and screen-view tracking (FIX-14). Fix "Task 9"→"Task 10" and the false "same in both directions" toast sentence (CLAIM-07). Add safe-area insets for the bottom toggle.                                                                   |
| **8** Route + entry     | Replace `navigate` + eslint-disable with `RouterLink` (FIX-11). Make the row-count test genuinely red — assert row count or role, not pre-existing text (FIX-10). Add a real `matchRoute` test asserting module name and both params, modelled on `routes.tests.ts:1070-1078` (FIX-09). Correct the manifest insertion point to between `:103 /categories` and `:104 /collect`, and drop the false "alphabetically sorted" claim (CLAIM-06). |
| **9** GeoJSON converter | Stamp `sectionId` rather than `section` title (BLOCK-05). Emit the derived index as `number`; delete `order` (FIX-05).                                                                                                                                                                                                                                                                                                                       |
| **10** Map view         | Split into `ItineraryMapPins.tsx` + `ItineraryMapView.tsx` as promised (CLAIM-08, FIX-01). Filter on `sectionId`. Fit camera bounds to visible stops and refit on filter change (FIX-07). Move `ArtsyMapStyleURL` and Mapbox init into `src/app/utils/mapbox.ts` and repoint `PartnerMap` and `LocationMap` too (FIX-08). Keep the `Camera`/`CircleLayer` Jest-mock addition. Add safe-area insets for the top pills.                        |
| **All**                 | Replace every targeted `yarn test <path>` checkpoint with the AGENTS.md trio: `yarn tsc`, `yarn test --findRelatedTests <changed-files>`, `yarn lint <changed-files>` (FIX-13).                                                                                                                                                                                                                                                              |

Tests that are not genuinely red, or cannot go green as written:

- **Task 3 hook tests** — throw on render via `setupTestWrapper` (BLOCK-04). Cannot go green as written.
- **Task 8 "renders a row per curated list"** — green before implementation (FIX-10). Not a red step.
- **Task 10 map assertions** — `MapView` mocks to `() => null`, so children never mount; assertions on
  pins are unreachable. The plan already routes around this by asserting on the pills and count, but
  Task 9's converter tests are the only ones with real coverage. Say so plainly rather than implying
  the map is tested.

Task-boundary check: with the amendments, every task still ends compiling, tested, lint-clean, and
committable. Task 2 no longer touches shared code, so it and Task 3 become independent. Task 1 now
carries real entity identifiers, which Task 4 and Task 7 depend on — that ordering already holds.

## Final decision

**Requires spec redesign before implementation planning.**

Not because the plan is poorly constructed — most of its 29 findings are task-level and mechanically
fixable — but because two defects are spec-level and one of them invalidates the artefact the spec
exists to produce:

1. **BLOCK-01.** The approved data shape cannot drive either mutation. That shape's stated purpose is to
   become the target for the backend API design session, so shipping it forward propagates the error
   into the API.
2. **BLOCK-02, amplified by MISS-01.** The save semantics are unresolved, and the flag cover everyone
   assumed does not exist. Whether the save is real (MISS-04) or absent changes the spec's "Saving a
   stop" section, Task 7's architecture, and the toast copy.

Amend the spec's data-shape and saving sections first, then re-derive Tasks 1, 4, and 7. The remaining
26 findings can be applied to the plan directly without another spec pass.
