# City Guide Itineraries — Review Handoff (v2)

**Repo:** `artsy/eigen`, branch `city-guide-itineraries-docs`
**Date:** 2026-08-26
**Status:** Spec v2 and plan v2, revised after two review rounds. Not yet implemented.

## What this document is

Everything needed to review the itinerary work in one file: background, the spec, and the plan. The
two source files are reproduced below verbatim and remain canonical:

- `docs/superpowers/specs/2026-08-26-city-guide-itineraries-design.md`
- `docs/superpowers/plans/2026-08-26-city-guide-itineraries.md`

The review trail that produced v2 lives in `docs/superpowers/reviews/`.

## History, in short

v1 was reviewed twice. Round 1 raised 29 findings; round 2 verified each against the repository and
returned 22 Confirm, 6 Modify, 1 Reject, then concluded that two findings were spec-level and sent
the work back for a redesign rather than a patch.

Those two:

- **The data shape could not drive either follow mutation.** `Partner` has no `isFollowed` — it lives
  on `Partner.profile` — and nothing in the type carried the `internalID` that `FollowShowInput.partnerShowID`
  and `FollowProfileInput.profileID` require.
- **The save confirmed a persistence that did not exist.** v1 kept saved state in a component-local
  `Set` and toasted "Saved to your saves". Everyone had assumed a feature flag made this a safe
  prototype. It does not: `routes.tsx:1128-1141` registers `/city-guide` with no flag check, and
  `routes.tsx` contains no `useFeatureFlag` at all, so the screen is deep-link reachable today.

## What v2 changes

| v1                                             | v2                                         | Why                                         |
| ---------------------------------------------- | ------------------------------------------ | ------------------------------------------- |
| `entity: { __typename, id, slug, isFollowed }` | `saveTarget: { type, slug } \| null`       | Could not supply mutation identifiers       |
| Saved state in a local `Set<string>`           | Real `followShow` / `followProfile`        | Confirmed a save that did not persist       |
| Freeform `title` as section identity           | `ItinerarySection.id` added                | Duplicate titles merged unrelated sections  |
| `order` stored per stop                        | Derived from flattened index               | Two uncontrolled sources of truth           |
| `description?: string`                         | `note?: string`                            | Collided with `Itinerary.description`       |
| `timeLabel` only                               | `displayTime` + optional `startAt`/`endAt` | Could not sort or localize                  |
| Extend `CityGuideMapPins`                      | Separate `ItineraryMapPins`                | ~75 of its 94 lines are clustering-specific |
| Shared `app/Components/SaveButton/`            | Scene-local `ItinerarySaveButton`          | One consumer; speculative sharing           |
| 10 tasks                                       | 11 tasks                                   | Adds the Mapbox config extraction           |

**The load-bearing idea in v2:** the itinerary _structure_ stays mock, but each stop's _entity_ is
real. A stop carries only a slug; the screen resolves it through Relay. `Query.show(id: String!)` and
`Query.partner(id: String!)` both accept "The slug or ID", proven in the app by `Show.tsx:152` (the
`/show/:showID` route param is a slug) and `PartnerLocations.tests.tsx:24` (`partner(id: "gagosian")`).
So no identifier is invented, `isFollowed` reflects the signed-in user, and the save genuinely
persists — while the itinerary grouping stays mock pending the API.

## What we want reviewed

1. **Is the data shape right?** It becomes the target for an upcoming backend API design session, so
   an error here propagates into the API. This is the highest-value thing to attack.
2. **Is the mock-structure / real-entities split sound?** It resolves the two blocking findings, but
   it is a new idea that has not itself been reviewed.
3. **The known weak point:** one query per stop. See the spec's "Open question" section, which states
   the cost openly rather than hiding it.
4. **Is the plan executable cold?** Eleven tasks, each with real code and real commands. Flag any step
   that is underspecified, any test that is not genuinely red first, and any type mismatch between
   tasks.

## Constraints the work was written under

Set by the product owner at the outset:

- Reuse existing components, spacing, and patterns over matching Figma exactly. The designs and the
  prototype are both still moving.
- Anything needing an API call gets a drafted data shape plus static client-side mock data. The
  backend is designed later, together.
- Saving shows and galleries is the one area expected to need new behaviour rather than reuse.

One decision worth surfacing because it is invisible in the repo: `note` is a plain string by explicit
product-owner choice, overriding a proposed `emojiTags: string[]`, because the backend field "might be
a string". Round 1 proposed a typed `{ kind: "TEXT" | "EMOJI" }` annotation; round 2 rejected it on
those grounds. If you think the engineering case outweighs an unrecorded product decision, say so.

## Design source

Figma file `Fireworks-City-Guide` (`HMwmWnpQClcGnwTOcYdyKx`):

- Itinerary list view: node `16:18536`
- Itinerary map with time-of-day filters: node `16:18693`
- Multi-day map, `Day 1`–`Day 5`: node `16:18627`
- Day-grouped list with editorial subtitles and emoji: node `84:36426`

Two frames disagree about grouping — by time of day in one, by day in the other. The schema treats
section titles as opaque backend strings so both render without a client change.

## Scope decisions

The wider City Guide increment covers browse/discovery, saving shows and galleries, the city picker,
the map, and itineraries. It was split; this is the first sub-project.

Three clarifications shrank it materially:

- Users **cannot create or edit** an itinerary. They arrive fully assembled from the backend.
- The `+` on a stop is **not** "add to my itinerary". It saves/follows the show. No scheduling, no day
  assignment.
- Saving a show does not add it to any itinerary. The two are unrelated.

## Codebase context

**The City Guide exists twice.** `/local-discovery` → `CityGuide.tsx` is the live map scene, wired to
Relay. `/city-guide` → `CityGuideNew.tsx` is this month's rebuild, rendering hardcoded arrays with
`picsum.photos` placeholders. This work builds on the latter. Neither is feature-flagged at the route.

**Follow mutations.** `followShow` exists inline three times — `CityGuideEvent.tsx:110-111`,
`ShowFollowButton.tsx:48-49`, `Lists/ShowItemRow.tsx:57-58` — and zero times as a hook, while
`followProfile` is already extracted as `src/app/utils/mutations/useFollowProfile.ts`. Task 3 extracts
`useFollowShow` and migrates one of the three; the other two are a deliberate follow-up.

Related live defect found during review: `CityGuideEvent.tsx:62-65`'s optimistic updater writes the
`is_followed` alias key, which Relay never reads, because records key on the schema field name. The
button works only because its `optimisticResponse` is payload-shaped. It is dead code, not a
user-visible bug, and Task 3 deletes it.

**Mapbox.** `@rnmapbox/maps` 10.3.1. `CityGuideMap.tsx:41,53` both calls `setAccessToken` and exports
`ArtsyMapStyleURL`, and `PartnerMap.tsx:8` and `LocationMap.tsx:8` import that constant cross-scene
against the AGENTS.md rule, each calling `setAccessToken` again — three calls total. Task 4 extracts a
shared `src/app/utils/mapbox.ts`, clearing two existing violations rather than adding a third.

**Test environment.** Reanimated is globally mocked (`setupJest.tsx:322`), so animation values are not
observable. The Mapbox mock (`setupJest.tsx:295-304`) omits `Camera` and `CircleLayer`, unnoticed only
because `MapView: () => null` never renders children; Task 11 adds them. `setupTestWrapper` throws for a
component with no query, because it resolves an operation unconditionally
(`setupTestWrapper.tsx:114-129`), so the hook tests use `renderHook` with a bespoke
`RelayEnvironmentProvider`, modelled on `Scenes/Artwork/hooks/__tests__/useSendInquiry.tests.tsx`.
`src/app/utils/mutations/` has no tests today. `detect-secrets` rejects base64 strings of Relay-node-id
length, so mock ids stay readable.

## Known gaps, stated plainly

- **One Relay query per stop.** The weakest part of v2. Deliberate, documented in the spec, and
  disappears when the API returns entities inline.
- **Mock slugs must be sourced and verified by hand** (Task 1, Step 2). They are durable — slugs for
  closed shows keep resolving — but not permanent.
- **"Add Full List"** (bulk-follow) is not built. It belongs to the save sub-project.
- **Toast copy is invented.** Product has not confirmed it.
- **Gallery follows are untracked.** `Schema.ActionNames` has no gallery-follow entry and inventing one
  belongs to the save sub-project. Show saves are tracked.
- **`/city-guide` being ungated** is pre-existing and out of scope here, but should be raised.

---

# Part 1 — Spec (v2)

_Verbatim from `docs/superpowers/specs/2026-08-26-city-guide-itineraries-design.md`._

**Date:** 2026-08-26
**Revision:** v2. Supersedes v1 (commit `c441d255a5`) after two review rounds.
**Status:** Draft for review
**Scope:** Sub-project 1 of the City Guide increment

## What changed in v2, and why

Two review rounds found the v1 data shape could not drive either follow mutation, and that v1's save
interaction confirmed a save that only existed in local component state on a route nothing gates.
Both were spec-level, so the spec changed rather than the plan.

| v1                                             | v2                                           | Driver                                                      |
| ---------------------------------------------- | -------------------------------------------- | ----------------------------------------------------------- |
| `entity: { __typename, id, slug, isFollowed }` | `saveTarget: { type, slug } \| null`         | `Partner` has no `isFollowed`; nothing carried `internalID` |
| Saved state in a local `Set<string>`           | Real `followShow` / `followProfile` mutation | Save confirmed a persistence that did not exist             |
| Freeform `title` used as section identity      | `ItinerarySection.id` added                  | Duplicate titles would merge unrelated sections             |
| `order` field per stop                         | Derived from flattened index                 | Two uncontrolled sources of truth                           |
| `description?: string`                         | `note?: string`                              | Collided with `Itinerary.description`                       |
| `timeLabel` only                               | `displayTime` + optional `startAt`/`endAt`   | Could not sort or localize                                  |
| Extend `CityGuideMapPins`                      | Separate `ItineraryMapPins`                  | ~75 of its 94 lines are clustering-specific                 |
| Shared `app/Components/SaveButton/`            | Scene-local `ItinerarySaveButton`            | One consumer; speculative sharing                           |

The full adjudication is in `docs/superpowers/reviews/2026-08-26-city-guide-itineraries-second-review.md`.

## Context

The City Guide exists twice in `src/app/Scenes/CityGuide/`:

- `/local-discovery` → `CityGuide.tsx` — the live map-based scene, wired to Relay through
  `Components/CityGuideMapQueryRenderer.tsx`, fetching `city(slug)` for `showsConnection` and
  `fairsConnection`.
- `/city-guide` → `CityGuideNew.tsx` — a rebuild from this month, rendering hardcoded mock arrays with
  `picsum.photos` placeholders. City selection reads local JSON via `Components/CityGuideCityPicker.tsx`.

This work builds on `CityGuideNew`. It covers itineraries only; browse/discovery, saving galleries, the
city picker, and the map each get their own spec.

**`/city-guide` is not feature-flagged.** `src/app/Navigation/routes.tsx:1128-1141` registers it with no
flag check, and `routes.tsx` contains no `useFeatureFlag` at all. `AREnableExpandedCityGuide` only
selects which city JSON the picker reads (`CityGuideCityPicker.tsx:45-47`); `AREnableGlobalMapList`
gates the entry points, not the route. Any deep link reaches the screen. This spec therefore treats
every surface it adds as production-reachable, and does not rely on flag cover. That the existing
placeholder screen is already reachable is a pre-existing problem worth raising separately.

The Figma designs and the prototype are both still moving. This spec commits to the data shape and the
component boundaries, not to pixel values.

## What we are building

Read-only viewing of curated city itineraries — editorial guides such as "Chill Vibes Only" by Casey
Lesser. Users cannot create or edit an itinerary. The content arrives fully assembled from the backend;
for this pass its structure comes from a static mock module.

Two views over the same itinerary:

- **List view** — hero image, title, subtitle, author, description, then collapsible sections. Each
  section holds numbered stops with a thumbnail, title, time, an optional note, and a save control.
- **Map view** — the same stops as numbered pins, with a filter pill per section.

The one interactive element on a stop is **save**.

## Data shape

The itinerary _structure_ is mock. The _entities_ are real, resolved by slug through Relay.

This split is the central decision in v2. A stop stores only a slug and a type; the screen resolves
each slug into a live record. `Query.show(id: String!)` and `Query.partner(id: String!)` both accept
"The slug or ID" (`data/schema.graphql:33418`, `:32971`), so no identifier has to be invented, and
`isFollowed` reflects the signed-in user rather than a hardcoded guess.

```ts
/** How a stop resolves to a saveable Artsy entity. null for a non-Artsy editorial place. */
export type ItinerarySaveTarget = { type: "SHOW"; slug: string } | { type: "PARTNER"; slug: string }

export interface ItineraryStop {
  id: string
  title: string
  /** Backend-formatted for display. e.g. "11am-4pm" */
  displayTime: string
  /** Optional structured schedule. Display always comes from displayTime. */
  startAt?: string // ISO 8601
  endAt?: string // ISO 8601
  /** Freeform. Emoji in every design so far, but typed as prose-capable. */
  note?: string
  imageUrl: string
  coordinates: { lat: number; lng: number }
  /** null when the stop is not a saveable Artsy entity; no save control renders. */
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

Decisions worth stating plainly:

**Sections are freeform, and separately identified.** The designs use two grouping schemes — by time of
day ("Mellow morning", "Chill afternoon") in one frame, by day with editorial subtitles ("Day 1 —
Easing in", "Day 2 — London Frieze") in another. The backend owns the grouping and the naming, so
`title` stays an opaque string the client renders without interpreting. But identity is `id`: v1 used
titles as React keys, Mapbox filter values, and lookup keys, which would merge two sections that
legitimately share a title.

**`note` is a single string, not a tag array or a typed annotation.** The designs show emoji clusters
under the time. Modelling them as `string[]` forces the backend into a tag vocabulary it may not have;
modelling them as `{ kind: "TEXT" | "EMOJI" }` presumes two rendering treatments nobody has specified.
This is a product decision, made deliberately, and it is recorded here so it stops being invisible to
reviewers. Revisit if a second treatment appears.

**Stop numbers are derived, never stored.** The design numbers stops continuously across sections
(1-5 spanning Day 1 and Day 2). A stored `order` alongside array position gives two sources of truth
with nothing reconciling them. The number is the index in the flattened stop list, computed once and
passed down, so list and map cannot disagree.

**`displayTime` is authoritative for display; `startAt`/`endAt` are for logic only.** The client never
formats from the structured fields. They exist so sorting and timezone-aware behaviour do not require a
schema change later.

### Open question: how stops resolve, one query or many

By-slug resolution of a single entity is proven in the repo. `Show.tsx:152` runs `show(id: $showID)`
where the route param is a slug — `CityGuideEvent.tsx:29` navigates to `/show/${event.slug}` — and
`PartnerLocations.tests.tsx:24` queries `partner(id: "gagosian")`.

Batch resolution is not proven. `Query.showsConnection(ids: [String])` exists
(`data/schema.graphql:33440`) but its `ids` argument is undocumented as to slug support, nothing in the
app uses it, and connection results carry no ordering guarantee matching the input.

**Recommended for this pass:** each `ItineraryStopRow` resolves its own `saveTarget` with a small
`useLazyLoadQuery`, wrapped in Suspense. For 5-15 stops that is 5-15 small parallel queries. Relay
dedupes repeated slugs through the store.

**The cost, stated plainly:** this is more requests than the screen deserves, and it is the weakest part
of v2. It is accepted because it is provably correct with the schema as it exists, it needs no invented
identifiers, and it disappears entirely when the real itinerary API returns entities inline — at which
point stops become fragment spreads and the per-row queries are deleted.

**For the API design session:** the itinerary query should return each stop's entity inline, making this
question moot. If an interim batch is wanted first, confirm whether `showsConnection(ids:)` accepts
slugs and whether result order can be relied on.

## Screens and components

New directory `src/app/Scenes/CityGuide/Screens/Itinerary/`:

- `ItineraryScreen.tsx` — resolves the itinerary, holds the list/map toggle, renders one or the other.
  One route, not two: the floating "Map" pill in the design reads as a mode switch, not a new page.
- `Components/ItineraryHeader.tsx` — hero image, title, subtitle, author, description.
- `Components/ItinerarySectionRow.tsx` — collapsible section wrapper. Named `...Row` so it does not
  collide with the `ItinerarySection` type.
- `Components/ItineraryStopRow.tsx` — number, thumbnail, title, time, note, save control.
- `Components/ItinerarySaveButton.tsx` — the animated plus-to-tick control.
- `Components/ItineraryMapPins.tsx` — pure pin rendering. No state, no camera.
- `Components/ItineraryMapView.tsx` — map layout, camera, filter pills, selected-section state.
- `utils/itineraryTypes.ts`, `utils/mockItineraries.ts`, `utils/itineraryStopsToGeoJSON.ts`.

## Saving a stop

The save control is the `+` in the designs. Pressing it follows the underlying show or gallery.

1. `ItineraryStopRow` resolves its `saveTarget` slug through Relay and reads the real `isFollowed`.
2. On press, fire the follow mutation with an optimistic response.
3. The `+` animates into a tick. Reanimated drives it on the UI thread, per the project rule. The
   animation must not fire on mount — only on a genuine state change.
4. A toast confirms, via `useToast` from `app/Components/Toast/toastHook`.
5. Pressing again unfollows, reverses the animation, and toasts the removal.
6. Save and unsave are tracked, mirroring `CityGuideEvent.tsx:40,122-124`
   (`Schema.ActionNames.SaveShow` / `UnsaveShow`). The same user action must not be instrumented on one
   surface and silent on another.
7. When `saveTarget` is null, no control renders.

The `followShow` mutation exists inline in three places today — `CityGuideEvent.tsx:110-111`,
`ShowFollowButton.tsx:48-49`, `Lists/ShowItemRow.tsx:57-58` — and zero times as a hook, while its
sibling `followProfile` is already extracted as `src/app/utils/mutations/useFollowProfile.ts`. So:

- **Extract `src/app/utils/mutations/useFollowShow.ts`**, mirroring `useFollowProfile`. Justified by
  code on disk, not by future consumers. It must use `setShowFollowed` from
  `src/app/utils/mutations/setShowFollowed.ts` for the optimistic update, and accept
  `isFollowed: boolean | null | undefined`, because the generated fragment types it that way
  (`CityGuideShow_show.graphql.ts:23`) and a narrower parameter does not compile under `strict`.
- **Keep the save button scene-local** as `ItinerarySaveButton`. One consumer, itinerary-specific
  semantics. Extract when a second real consumer exists.
- **Migrate `CityGuideEvent.tsx` onto the hook.** Its current updater writes the `is_followed` alias
  key, which Relay never reads — the button works only because its `optimisticResponse` is
  payload-shaped. The migration deletes that dead code.

Galleries use `useFollowProfile` unchanged, passing the resolved `Partner.profile` fields.

## Reuse

- `Flex`, `Box`, `Text`, `Button`, `Screen` from `@artsy/palette-mobile`, with the padding the
  neighbouring City Guide components use.
- `RouterLink` for navigation, not `navigate`. `.eslintrc.js:145-150` permits the escape hatch but
  `RouterLink` is idiomatic and enables prefetching.
- A `Screen.ScrollView` for the list. FlashList is the rule for virtualized lists; 5-15 statically
  mapped rows are not one, and the parent `CityGuideNew.tsx:40-55` already renders mapped rows this way.
- `app/utils/hooks/withSuspense` for the loading and error fallbacks. Unlike v1, this is now load-bearing:
  the screen issues a real Relay query.
- **Not** `CityGuideMapPins.tsx`. Roughly 75 of its 94 lines are clustering- or sprite-specific, and it
  hardwires the bucket/tab data shape. v1 required extending it; v2 does not. A separate
  `ItineraryMapPins` is smaller and clearer.
- Move `ArtsyMapStyleURL` and Mapbox initialization out of `CityGuideMap.tsx:41,53` into a shared
  `src/app/utils/mapbox.ts`. `PartnerMap.tsx:8` and `LocationMap.tsx:8` already import it cross-scene in
  violation of AGENTS.md, and `setAccessToken` is called three times. Repointing all three consumers
  clears two existing violations rather than adding a third.

## Navigation

Route `/city-guide/:citySlug/itinerary/:itineraryId`, registered in `src/app/Navigation/routes.tsx`
beside `/city-guide`. The lookup keys on both params; a mismatched city renders the unavailable state
rather than another city's itinerary. Entry point is `Components/CityGuideCuratedLists.tsx`, whose rows
currently navigate nowhere. Every visible row must resolve to real mock data.

Android deep linking needs `<data android:pathPrefix="/city-guide"/>` in
`android/app/src/main/AndroidManifest.xml`, which covers this sub-route. The existing list is not
alphabetically sorted; the logical position is between `/categories` and `/collect`.

## Testing

Per `docs/testing.md` and the existing `Components/__tests__/` files:

- `ItineraryStopRow` — renders number, title, time, note; hides the save control when `saveTarget` is
  null; save press fires the mutation; the tick shows once saved.
- `ItinerarySectionRow` — collapses and expands; keys on section id.
- `ItineraryScreen` — renders every section; toggles list and map; honours `citySlug`.
- `useFollowShow` — follows, unfollows, applies the optimistic value, handles error. `src/app/utils/mutations/`
  has no tests today, and `setupTestWrapper` throws for a component with no query
  (`setupTestWrapper.tsx:114-129` resolves an operation unconditionally). Use the `renderHook` plus
  `RelayEnvironmentProvider` pattern from `Scenes/Artwork/hooks/__tests__/useSendInquiry.tests.tsx`.
- `itineraryStopsToGeoJSON` — the map's only real coverage. `MapView` mocks to `() => null`, so pins
  never mount and cannot be asserted on. The Mapbox mock at `src/setupJest.tsx:295-304` must gain
  `Camera` and `CircleLayer`.
- A `matchRoute` test asserting the module name and both params. `routes.tests.ts` has no snapshot over
  the route table, so adding a route otherwise proves nothing.

## Accessibility and layout

- A scrim or gradient behind the hero title and subtitle. They render `mono0` over an arbitrary backend
  image and are unreadable over a light photograph.
- Safe-area insets for the map's top filter pills and the bottom list/map toggle.
- The save control exposes its state through `accessibilityState`, and collapsible sections expose
  `expanded`.

## Out of scope

- Any create or edit flow. Users cannot author itineraries.
- The backend schema. The mock module is one file so the API design session has a concrete target.
- Bulk "Add Full List". It belongs to the save sub-project, which owns bulk behaviour and its failure
  modes.
- Wiring `useFollowShow` into `ShowFollowButton.tsx` and `Lists/ShowItemRow.tsx`. Migrating
  `CityGuideEvent` proves the hook; the other two are a follow-up so this diff stays reviewable.
- Multi-day trip planning, date pickers, scheduling.
- Fixing the ungated `/city-guide` route. Pre-existing; raise separately.

---

# Part 2 — Implementation Plan (v2)

_Verbatim from `docs/superpowers/plans/2026-08-26-city-guide-itineraries.md`._

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Revision:** v2. Supersedes v1 (commit `5ba2d39e81`) after two review rounds. Eleven tasks, not ten.

**Goal:** Add read-only viewing of curated city itineraries to the City Guide, with a real save action on each stop.

**Architecture:** A new `Screens/Itinerary/` directory under the existing City Guide scene. One route renders an `ItineraryScreen` holding a list/map toggle in local state. The itinerary _structure_ comes from a static mock module; each stop's _entity_ is real, resolved by slug through Relay so the save fires a genuine mutation. Two pieces get extracted to shared locations because code on disk already justifies them: a `useFollowShow` mutation hook and a Mapbox config module.

**Tech Stack:** React Native, TypeScript (strict), Relay, `@artsy/palette-mobile`, `@artsy/icons/native`, `react-native-reanimated`, `@rnmapbox/maps`, Jest + `@testing-library/react-native`.

## Global Constraints

- Spec: `docs/superpowers/specs/2026-08-26-city-guide-itineraries-design.md` (v2).
- Review trail: `docs/superpowers/reviews/`. Finding ids below (BLOCK-_, FIX-_, MISS-\*) are defined there.
- Reuse existing components, spacing, and patterns over matching Figma pixel values. The designs are not final.
- **Before every commit, run all three** (`AGENTS.md:41-51`). No task may skip these:
  ```sh
  yarn tsc
  yarn test --findRelatedTests <changed-files>
  yarn lint <changed-files>
  ```
- Run `yarn relay` after any change to a `graphql` tagged template.
- No `index.ts(x)` files. No cross-scene imports — shared code goes in `src/app/Components/` or `src/app/utils/`.
- Components and component folders are PascalCase; `hooks`, `utils`, `mutations` folders are camelCase. Tests live in a sibling `__tests__/` and end in `.tests.ts(x)`.
- Use `RouterLink`, not `navigate`. `.eslintrc.js:145-150` permits an eslint-disable escape hatch, but `RouterLink` enables prefetching.
- Reanimated is globally mocked (`src/setupJest.tsx:322`). Assert on rendered output, never animation values.
- `MapView` mocks to `() => null` (`src/setupJest.tsx:295-304`), so map children never mount. Pins cannot be asserted on; the GeoJSON converter carries the map's real coverage.
- Mock `saveTarget` values are **slugs of real Artsy entities**, never invented ids. Separately, the `detect-secrets` pre-commit hook rejects base64 strings of Relay-node-id length, so never put base64 ids in mocks.

---

### Task 1: Itinerary types and mock data

**Files:**

- Create: `src/app/Scenes/CityGuide/Screens/Itinerary/utils/itineraryTypes.ts`
- Create: `src/app/Scenes/CityGuide/Screens/Itinerary/utils/mockItineraries.ts`

**Interfaces:**

- Produces: `Itinerary`, `ItinerarySection`, `ItineraryStop`, `ItinerarySaveTarget`; `MOCK_ITINERARIES: Itinerary[]`; `getMockItinerary(citySlug: string, itineraryId: string): Itinerary | undefined`.

Pure data, no behaviour, so no test of its own. Tasks 5 onwards exercise it.

- [ ] **Step 1: Write the types**

```ts
/** How a stop resolves to a saveable Artsy entity. null for a non-Artsy editorial place. */
export type ItinerarySaveTarget = { type: "SHOW"; slug: string } | { type: "PARTNER"; slug: string }

export interface ItineraryStop {
  id: string
  title: string
  /** Backend-formatted for display. e.g. "11am-4pm" */
  displayTime: string
  /** Optional structured schedule. Display always comes from displayTime. */
  startAt?: string
  endAt?: string
  /** Freeform. May hold emoji ("🥂 🧀") or a short caption. */
  note?: string
  imageUrl: string
  coordinates: { lat: number; lng: number }
  /** null when the stop is not a saveable Artsy entity; no save control renders. */
  saveTarget: ItinerarySaveTarget | null
}

export interface ItinerarySection {
  /** Stable identity. Used for keys, lookups, and map filters. */
  id: string
  /** Opaque backend-authored display string. Never used as identity. */
  title: string
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

- [ ] **Step 2: Source real entity slugs**

`saveTarget` slugs must resolve against the real API. Get them by opening London shows and galleries in the running app or on artsy.net and taking the slug from the URL: `artsy.net/show/<slug>`, `artsy.net/partner/<slug>`.

Verify each by navigating to `/show/<slug>` in the simulator before use. A slug that 404s produces a stop whose save control never resolves. Record the date checked in a comment.

- [ ] **Step 3: Write the mock data**

Replace each `REPLACE-ME` with a verified slug from Step 2. **All three curated rows get an itinerary** — v1 deliberately left two broken (BLOCK-06).

```ts
import { Itinerary } from "app/Scenes/CityGuide/Screens/Itinerary/utils/itineraryTypes"

// TODO: Replace with data from the API once the itinerary schema lands.
// Entity slugs verified against production on <DATE>.
export const MOCK_ITINERARIES: Itinerary[] = [
  {
    id: "chill-vibes-only",
    citySlug: "london-united-kingdom",
    title: "Chill Vibes Only",
    subtitle: "Top picks",
    heroImageUrl: "https://picsum.photos/id/1015/800/600.jpg",
    authorName: "Casey Lesser",
    description:
      "Our list of recommendations for the must sees to gallery and museum visits and the hidden gems in between.",
    sections: [
      {
        id: "day-1",
        title: "Day 1 — Easing in",
        stops: [
          {
            id: "stop-1",
            title: "Coffee at London Cafe",
            displayTime: "10am",
            imageUrl: "https://picsum.photos/id/1060/200/200.jpg",
            coordinates: { lat: 51.5136, lng: -0.1365 },
            // Not an Artsy entity: no save control renders for this stop.
            saveTarget: null,
          },
          {
            id: "stop-2",
            title: "Museum",
            displayTime: "11am-4pm",
            note: "🥂 🧀",
            imageUrl: "https://picsum.photos/id/1040/200/200.jpg",
            coordinates: { lat: 51.5194, lng: -0.127 },
            saveTarget: { type: "SHOW", slug: "REPLACE-ME-show-slug-1" },
          },
          {
            id: "stop-3",
            title: "Gallery Show",
            displayTime: "3pm-4pm",
            imageUrl: "https://picsum.photos/id/1033/200/200.jpg",
            coordinates: { lat: 51.5074, lng: -0.1278 },
            saveTarget: { type: "SHOW", slug: "REPLACE-ME-show-slug-2" },
          },
        ],
      },
      {
        id: "day-2",
        title: "Day 2 — London Frieze",
        stops: [
          {
            id: "stop-4",
            title: "Frieze London",
            displayTime: "12pm - 1pm",
            note: "🎤",
            imageUrl: "https://picsum.photos/id/1084/200/200.jpg",
            coordinates: { lat: 51.5122, lng: -0.1571 },
            saveTarget: { type: "SHOW", slug: "REPLACE-ME-show-slug-3" },
          },
          {
            id: "stop-5",
            title: "Evening Reception",
            displayTime: "6pm-9pm",
            note: "🥂 🧀",
            imageUrl: "https://picsum.photos/id/1074/200/200.jpg",
            coordinates: { lat: 51.5033, lng: -0.1195 },
            saveTarget: { type: "PARTNER", slug: "REPLACE-ME-partner-slug-1" },
          },
        ],
      },
    ],
  },
  {
    id: "36-hours-in-london",
    citySlug: "london-united-kingdom",
    title: "36 Hours in London",
    subtitle: "Top picks",
    heroImageUrl: "https://picsum.photos/id/1016/800/600.jpg",
    authorName: "Casey Lesser",
    description: "A day and a half of galleries, museums, and somewhere decent for lunch.",
    sections: [
      {
        id: "morning",
        title: "Mellow morning",
        stops: [
          {
            id: "hours-stop-1",
            title: "Morning Gallery Visit",
            displayTime: "10am-12pm",
            imageUrl: "https://picsum.photos/id/1025/200/200.jpg",
            coordinates: { lat: 51.5155, lng: -0.1411 },
            saveTarget: { type: "SHOW", slug: "REPLACE-ME-show-slug-4" },
          },
        ],
      },
    ],
  },
  {
    id: "must-sees-and-hidden-gems",
    citySlug: "london-united-kingdom",
    title: "Must Sees & Hidden Gems",
    subtitle: "Top picks",
    heroImageUrl: "https://picsum.photos/id/1024/800/600.jpg",
    authorName: "Casey Lesser",
    description: "The landmarks worth the queue, and the rooms nobody tells you about.",
    sections: [
      {
        id: "afternoon",
        title: "Chill afternoon",
        stops: [
          {
            id: "gems-stop-1",
            title: "Hidden Gem Gallery",
            displayTime: "2pm-5pm",
            imageUrl: "https://picsum.photos/id/1035/200/200.jpg",
            coordinates: { lat: 51.5098, lng: -0.1342 },
            saveTarget: { type: "PARTNER", slug: "REPLACE-ME-partner-slug-2" },
          },
        ],
      },
    ],
  },
]

/** Keys on both params so /city-guide/paris/... cannot render a London itinerary (FIX-04). */
export const getMockItinerary = (citySlug: string, itineraryId: string): Itinerary | undefined =>
  MOCK_ITINERARIES.find(
    (itinerary) => itinerary.id === itineraryId && itinerary.citySlug === citySlug
  )
```

- [ ] **Step 4: Verify and commit**

```bash
yarn tsc
yarn test --findRelatedTests src/app/Scenes/CityGuide/Screens/Itinerary/utils/mockItineraries.ts
yarn lint --fix src/app/Scenes/CityGuide/Screens/Itinerary/utils/
git add src/app/Scenes/CityGuide/Screens/Itinerary/utils/
git commit -m "feat(city-guide): add itinerary types and mock data"
```

---

### Task 2: ItinerarySaveButton

**Files:**

- Create: `src/app/Scenes/CityGuide/Screens/Itinerary/Components/ItinerarySaveButton.tsx`
- Test: `src/app/Scenes/CityGuide/Screens/Itinerary/Components/__tests__/ItinerarySaveButton.tests.tsx`

**Interfaces:**

- Produces: `ItinerarySaveButton: React.FC<{ isSaved: boolean; onPress: () => void; isSaving?: boolean; accessibilityLabel?: string }>`. Renders `testID="itinerary-save-button"`; icons carry `testID="itinerary-save-button-add-icon"` and `"itinerary-save-button-check-icon"`.

Scene-local, not shared (FIX-02): one consumer, itinerary-specific semantics. Extract if a second real consumer appears.

- [ ] **Step 1: Write the failing test**

```tsx
import { fireEvent, screen } from "@testing-library/react-native"
import { ItinerarySaveButton } from "app/Scenes/CityGuide/Screens/Itinerary/Components/ItinerarySaveButton"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

describe("ItinerarySaveButton", () => {
  it("renders the add icon when not saved", () => {
    renderWithWrappers(<ItinerarySaveButton isSaved={false} onPress={jest.fn()} />)

    expect(screen.getByTestId("itinerary-save-button-add-icon")).toBeTruthy()
    expect(screen.queryByTestId("itinerary-save-button-check-icon")).toBeNull()
  })

  it("renders the check icon when saved", () => {
    renderWithWrappers(<ItinerarySaveButton isSaved onPress={jest.fn()} />)

    expect(screen.getByTestId("itinerary-save-button-check-icon")).toBeTruthy()
    expect(screen.queryByTestId("itinerary-save-button-add-icon")).toBeNull()
  })

  it("calls onPress when tapped", () => {
    const onPress = jest.fn()
    renderWithWrappers(<ItinerarySaveButton isSaved={false} onPress={onPress} />)

    fireEvent.press(screen.getByTestId("itinerary-save-button"))

    expect(onPress).toHaveBeenCalledTimes(1)
  })

  it("does not call onPress while saving", () => {
    const onPress = jest.fn()
    renderWithWrappers(<ItinerarySaveButton isSaved={false} onPress={onPress} isSaving />)

    fireEvent.press(screen.getByTestId("itinerary-save-button"))

    expect(onPress).not.toHaveBeenCalled()
  })

  it("exposes its saved state for accessibility", () => {
    renderWithWrappers(<ItinerarySaveButton isSaved onPress={jest.fn()} />)

    expect(screen.getByTestId("itinerary-save-button").props.accessibilityState.selected).toBe(true)
  })
})
```

- [ ] **Step 2: Run to verify it fails**

Run: `yarn test src/app/Scenes/CityGuide/Screens/Itinerary/Components/__tests__/ItinerarySaveButton.tests.tsx`
Expected: FAIL — module not found.

- [ ] **Step 3: Write the implementation**

The `hasMountedRef` guard matters: v1 animated on first render, so every visible row popped on load (FIX-12).

```tsx
import { AddIcon, CheckmarkIcon } from "@artsy/icons/native"
import { Flex } from "@artsy/palette-mobile"
import { useEffect, useRef } from "react"
import { TouchableOpacity } from "react-native"
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated"

const ICON_SIZE = 24
const HIT_SLOP = { top: 10, bottom: 10, left: 10, right: 10 }

interface Props {
  isSaved: boolean
  onPress: () => void
  isSaving?: boolean
  accessibilityLabel?: string
}

export const ItinerarySaveButton: React.FC<Props> = ({
  isSaved,
  onPress,
  isSaving = false,
  accessibilityLabel,
}) => {
  const scale = useSharedValue(1)
  const hasMountedRef = useRef(false)

  useEffect(() => {
    // Skip the initial render so rows do not all pop on load.
    if (!hasMountedRef.current) {
      hasMountedRef.current = true
      return
    }

    scale.set(() =>
      withSequence(withTiming(0.6, { duration: 80 }), withSpring(1, { damping: 6, stiffness: 220 }))
    )
  }, [isSaved])

  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.get() }] }))

  return (
    <TouchableOpacity
      testID="itinerary-save-button"
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? (isSaved ? "Saved" : "Save")}
      accessibilityState={{ selected: isSaved, disabled: isSaving }}
      disabled={isSaving}
      hitSlop={HIT_SLOP}
      onPress={onPress}
    >
      <Flex width={ICON_SIZE} height={ICON_SIZE} alignItems="center" justifyContent="center">
        <Animated.View style={animatedStyle}>
          {isSaved ? (
            <CheckmarkIcon
              testID="itinerary-save-button-check-icon"
              width={ICON_SIZE}
              height={ICON_SIZE}
            />
          ) : (
            <AddIcon testID="itinerary-save-button-add-icon" width={ICON_SIZE} height={ICON_SIZE} />
          )}
        </Animated.View>
      </Flex>
    </TouchableOpacity>
  )
}
```

- [ ] **Step 4: Run to verify it passes**

Expected: PASS, 5 tests.

- [ ] **Step 5: Verify and commit**

```bash
yarn tsc
yarn test --findRelatedTests src/app/Scenes/CityGuide/Screens/Itinerary/Components/ItinerarySaveButton.tsx
yarn lint --fix src/app/Scenes/CityGuide/Screens/Itinerary/Components/
git add src/app/Scenes/CityGuide/Screens/Itinerary/Components/
git commit -m "feat(city-guide): add ItinerarySaveButton"
```

---

### Task 3: useFollowShow, and migrate CityGuideEvent

**Files:**

- Create: `src/app/utils/mutations/useFollowShow.ts`
- Test: `src/app/utils/mutations/__tests__/useFollowShow.tests.tsx`
- Modify: `src/app/Scenes/CityGuide/Components/CityGuideEvent.tsx`

**Interfaces:**

- Produces: `useFollowShow({ id, internalID, isFollowed, onCompleted, onError }) => { followShow: () => void; isInFlight: boolean }`, where `isFollowed: boolean | null | undefined`.

Three inline `followShow` copies exist today (`CityGuideEvent.tsx:110-111`, `ShowFollowButton.tsx:48-49`, `Lists/ShowItemRow.tsx:57-58`) and zero hooks, while `useFollowProfile.ts` is the extracted sibling. Only `CityGuideEvent` migrates here; the other two are a follow-up so this diff stays reviewable.

- [ ] **Step 1: Write the failing test**

`src/app/utils/mutations/` has **no tests at all**, and `setupTestWrapper` throws for a query-less component — `setupTestWrapper.tsx:114-129` resolves an operation unconditionally, and `RelayModernMockEnvironment.js:220` throws "There are no pending operations in the list" (BLOCK-04). Use the `renderHook` pattern from `src/app/Scenes/Artwork/hooks/__tests__/useSendInquiry.tests.tsx`.

```tsx
import { act, renderHook } from "@testing-library/react-native"
import { GlobalStoreProvider } from "app/store/GlobalStore"
import { useFollowShow } from "app/utils/mutations/useFollowShow"
import { RelayEnvironmentProvider } from "react-relay"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"

const env = createMockEnvironment()

const wrapper = ({ children }: any) => (
  <RelayEnvironmentProvider environment={env}>
    <GlobalStoreProvider>{children}</GlobalStoreProvider>
  </RelayEnvironmentProvider>
)

describe("useFollowShow", () => {
  it("sends unfollow false when the show is not followed", () => {
    const { result } = renderHook(
      () => useFollowShow({ id: "node-id", internalID: "internal-id", isFollowed: false }),
      { wrapper }
    )

    act(() => result.current.followShow())

    expect(env.mock.getMostRecentOperation().request.variables).toEqual({
      input: { partnerShowID: "internal-id", unfollow: false },
    })
  })

  it("sends unfollow true when the show is already followed", () => {
    const { result } = renderHook(
      () => useFollowShow({ id: "node-id", internalID: "internal-id", isFollowed: true }),
      { wrapper }
    )

    act(() => result.current.followShow())

    expect(env.mock.getMostRecentOperation().request.variables).toEqual({
      input: { partnerShowID: "internal-id", unfollow: true },
    })
  })

  it("accepts an undefined isFollowed and treats it as not followed", () => {
    const { result } = renderHook(
      () => useFollowShow({ id: "node-id", internalID: "internal-id", isFollowed: undefined }),
      { wrapper }
    )

    act(() => result.current.followShow())

    expect(env.mock.getMostRecentOperation().request.variables).toEqual({
      input: { partnerShowID: "internal-id", unfollow: false },
    })
  })

  it("calls onCompleted with the next followed state", () => {
    const onCompleted = jest.fn()
    const { result } = renderHook(
      () =>
        useFollowShow({
          id: "node-id",
          internalID: "internal-id",
          isFollowed: false,
          onCompleted,
        }),
      { wrapper }
    )

    act(() => result.current.followShow())
    act(() => {
      env.mock.resolveMostRecentOperation((operation) => MockPayloadGenerator.generate(operation))
    })

    expect(onCompleted).toHaveBeenCalledWith(true)
  })
})
```

- [ ] **Step 2: Run to verify it fails**

Run: `yarn test src/app/utils/mutations/__tests__/useFollowShow.tests.tsx`
Expected: FAIL — module not found.

- [ ] **Step 3: Write the hook**

`isFollowed` is `boolean | null | undefined` because `CityGuideShow_show.graphql.ts:23` types it that way and a narrower parameter does not compile under `strict` (BLOCK-03). The optimistic update goes through `setShowFollowed`, which writes the canonical `isFollowed` key rather than the alias (FIX-03).

```ts
import { setShowFollowed } from "app/utils/mutations/setShowFollowed"
import { graphql, useMutation } from "react-relay"

export interface FollowShowOptions {
  /** Relay node id, used for the optimistic store update. */
  id: string
  /** The show's internalID, sent to the mutation as partnerShowID. */
  internalID: string
  isFollowed: boolean | null | undefined
  onCompleted?: (isFollowed: boolean) => void
  onError?: () => void
}

export const useFollowShow = ({
  id,
  internalID,
  isFollowed,
  onCompleted,
  onError,
}: FollowShowOptions) => {
  const [commit, isInFlight] = useMutation(Mutation)

  const nextFollowedState = !isFollowed

  const followShow = () => {
    commit({
      variables: {
        input: {
          partnerShowID: internalID,
          unfollow: !!isFollowed,
        },
      },
      onCompleted: () => {
        onCompleted?.(nextFollowedState)
      },
      onError,
      optimisticResponse: {
        followShow: {
          show: {
            id,
            internalID,
            isFollowed: nextFollowedState,
          },
        },
      },
      optimisticUpdater: (store) => {
        setShowFollowed(store, id, nextFollowedState)
      },
    })
  }

  return { followShow, isInFlight }
}

const Mutation = graphql`
  mutation useFollowShowMutation($input: FollowShowInput!) {
    followShow(input: $input) {
      show {
        id
        internalID
        isFollowed
      }
    }
  }
`
```

- [ ] **Step 4: Compile Relay and run the tests**

```bash
yarn relay
yarn test src/app/utils/mutations/__tests__/useFollowShow.tests.tsx
```

Expected: generates `src/__generated__/useFollowShowMutation.graphql.ts`; 4 tests pass.

- [ ] **Step 5: Verify and commit the hook**

```bash
yarn tsc
yarn test --findRelatedTests src/app/utils/mutations/useFollowShow.ts
yarn lint --fix src/app/utils/mutations/
git add src/app/utils/mutations/ src/__generated__/useFollowShowMutation.graphql.ts
git commit -m "feat: add useFollowShow mutation hook"
```

- [ ] **Step 6: Migrate CityGuideEvent onto the hook**

The existing updater at `CityGuideEvent.tsx:62-65` writes `store.get(nodeID).setValue(..., "is_followed")`. Relay keys records on the schema field name, not the alias, so that write lands on a key nothing reads — dead code. The button works only because its `optimisticResponse` is payload-shaped (MISS-02). This migration deletes it.

```tsx
import { Box, Button, Flex, Text, useColor } from "@artsy/palette-mobile"
import { CityGuideEventArtworkRailQueryRenderer } from "app/Scenes/CityGuide/Components/CityGuideEventArtworkRail"
import { Show } from "app/Scenes/CityGuide/utils/types"
// eslint-disable-next-line no-restricted-imports
import { navigate } from "app/system/navigation/navigate"
import { exhibitionDates } from "app/utils/exhibitionPeriodParser"
import { useFollowShow } from "app/utils/mutations/useFollowShow"
import { Schema } from "app/utils/track"
import { TouchableWithoutFeedback } from "react-native"
import { useTracking } from "react-tracking"

export const CityGuideEvent: React.FC<Props> = ({ event }) => {
  const { name, exhibition_period, partner, is_followed, end_at } = event
  const partnerName = partner?.name
  const color = useColor()
  const { trackEvent } = useTracking()

  const { followShow, isInFlight } = useFollowShow({
    id: event.id,
    internalID: event.internalID,
    isFollowed: is_followed,
  })

  const handleTap = () => {
    navigate(`/show/${event.slug}`)
  }

  const handleSaveChange = () => {
    if (!event.internalID || !event.slug || !event.id || isInFlight) {
      return
    }

    trackEvent(tracks.trackSave(event))
    followShow()
  }
  // render unchanged, except `loading={isInFlight}` on the Button
}
```

Then delete the `eventMutation` `graphql` block, the `CityGuideEventMutation` import, the `useState` import, and `useMutation`/`graphql` from `react-relay`.

- [ ] **Step 7: Verify and commit the migration**

```bash
yarn relay
yarn tsc
yarn test --findRelatedTests src/app/Scenes/CityGuide/Components/CityGuideEvent.tsx
yarn lint --fix src/app/Scenes/CityGuide/Components/CityGuideEvent.tsx
git add -A src/app/Scenes/CityGuide/Components/CityGuideEvent.tsx src/__generated__/
git commit -m "refactor(city-guide): move CityGuideEvent onto useFollowShow

Deletes an optimistic updater that wrote the is_followed alias key, which
Relay never reads."
```

Expected: the two existing `CityGuideEvent` tests still pass; `CityGuideEventMutation.graphql.ts` disappears from `src/__generated__/`.

- [ ] **Step 8: Confirm in the simulator**

Open the City Guide map, tap Save on an event, and confirm the button flips to "Saved" immediately, before the network settles.

---

### Task 4: Shared Mapbox configuration

**Files:**

- Create: `src/app/utils/mapbox.ts`
- Modify: `src/app/Scenes/CityGuide/Components/CityGuideMap.tsx:41,53`
- Modify: `src/app/Scenes/Partner/Components/PartnerMap.tsx:8,14`
- Modify: `src/app/Components/LocationMap/LocationMap.tsx:8,15`

**Interfaces:**

- Produces: `ArtsyMapStyleURL: string`, `configureMapbox(): void` (idempotent).

`CityGuideMap.tsx` both calls `setAccessToken` and exports `ArtsyMapStyleURL`, so importing the constant executes a screen module's token setup. `PartnerMap` and `LocationMap` already import it cross-scene against the AGENTS.md rule, and `setAccessToken` runs three times (FIX-08). This clears two existing violations rather than adding a third.

No new test: a move plus an idempotence guard, covered by the existing map tests continuing to pass.

- [ ] **Step 1: Create the module**

```ts
import MapboxGL from "@rnmapbox/maps"
import Keys from "react-native-keys"

export const ArtsyMapStyleURL = "mapbox://styles/artsyit/cjrb59mjb2tsq2tqxl17pfoak"

let isConfigured = false

/** Safe to call from any map module; the token is only set once. */
export const configureMapbox = () => {
  if (isConfigured) return

  MapboxGL.setAccessToken(Keys.secureFor("MAPBOX_API_CLIENT_KEY"))
  isConfigured = true
}
```

- [ ] **Step 2: Repoint the three consumers**

In each of `CityGuideMap.tsx`, `PartnerMap.tsx`, and `LocationMap.tsx`: delete the local `setAccessToken` call and the `react-native-keys` import, add `import { ArtsyMapStyleURL, configureMapbox } from "app/utils/mapbox"`, and call `configureMapbox()` at module top level where `setAccessToken` was. Delete the `ArtsyMapStyleURL` export from `CityGuideMap.tsx` and the cross-scene imports of it in the other two.

- [ ] **Step 3: Verify and commit**

```bash
yarn tsc
yarn test --findRelatedTests src/app/utils/mapbox.ts src/app/Components/LocationMap/LocationMap.tsx src/app/Scenes/Partner/Components/PartnerMap.tsx src/app/Scenes/CityGuide/Components/CityGuideMap.tsx
yarn lint --fix src/app/utils/mapbox.ts src/app/Components/LocationMap/ src/app/Scenes/Partner/Components/PartnerMap.tsx src/app/Scenes/CityGuide/Components/CityGuideMap.tsx
git add -A
git commit -m "refactor: extract Mapbox config into a shared module"
```

Expected: `LocationMap` and `PartnerLocations` tests still pass. Check both maps still render in the simulator — a missing token shows a blank map rather than throwing, so tests alone will not catch it.

---

### Task 5: ItineraryStopRow and its save control

**Files:**

- Create: `src/app/Scenes/CityGuide/Screens/Itinerary/Components/ItineraryStopRow.tsx`
- Create: `src/app/Scenes/CityGuide/Screens/Itinerary/Components/ItineraryStopSaveControl.tsx`
- Test: `src/app/Scenes/CityGuide/Screens/Itinerary/Components/__tests__/ItineraryStopRow.tests.tsx`

**Interfaces:**

- Produces: `ItineraryStopRow: React.FC<{ stop: ItineraryStop; number: number }>`; `ItineraryStopSaveControl: React.FC<{ saveTarget: ItinerarySaveTarget; stopTitle: string }>`.

`number` is passed in, derived by the screen from the flattened index — never read off the stop (FIX-05). The save control resolves its own entity by slug; see the spec's open question on one query per stop.

- [ ] **Step 1: Write the failing test**

```tsx
import { screen } from "@testing-library/react-native"
import { ItineraryStopRow } from "app/Scenes/CityGuide/Screens/Itinerary/Components/ItineraryStopRow"
import { ItineraryStop } from "app/Scenes/CityGuide/Screens/Itinerary/utils/itineraryTypes"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"

const savedStop: ItineraryStop = {
  id: "stop-2",
  title: "Museum",
  displayTime: "11am-4pm",
  note: "🥂 🧀",
  imageUrl: "https://example.com/image.jpg",
  coordinates: { lat: 51.5194, lng: -0.127 },
  saveTarget: { type: "SHOW", slug: "museum-show" },
}

const unsaveableStop: ItineraryStop = {
  id: "stop-1",
  title: "Coffee at London Cafe",
  displayTime: "10am",
  imageUrl: "https://example.com/cafe.jpg",
  coordinates: { lat: 51.5136, lng: -0.1365 },
  saveTarget: null,
}

describe("ItineraryStopRow", () => {
  const { renderWithRelay } = setupTestWrapper({ Component: ItineraryStopRow })

  it("renders the number, title, time and note", async () => {
    renderWithRelay({ Show: () => ({ isFollowed: false }) }, { stop: savedStop, number: 2 })

    expect(await screen.findByText("Museum")).toBeTruthy()
    expect(screen.getByText("2")).toBeTruthy()
    expect(screen.getByText("11am-4pm")).toBeTruthy()
    expect(screen.getByText("🥂 🧀")).toBeTruthy()
  })

  it("omits the note when the stop has none", () => {
    renderWithRelay({}, { stop: unsaveableStop, number: 1 })

    expect(screen.queryByText("🥂 🧀")).toBeNull()
  })

  it("renders no save control when the stop has no save target", () => {
    renderWithRelay({}, { stop: unsaveableStop, number: 1 })

    expect(screen.queryByTestId("itinerary-save-button")).toBeNull()
    expect(screen.getByText("Coffee at London Cafe")).toBeTruthy()
  })

  it("reflects the resolved followed state", async () => {
    renderWithRelay({ Show: () => ({ isFollowed: true }) }, { stop: savedStop, number: 2 })

    expect(await screen.findByTestId("itinerary-save-button-check-icon")).toBeTruthy()
  })
})
```

- [ ] **Step 2: Run to verify it fails**

Expected: FAIL — module not found.

- [ ] **Step 3: Write the row**

The row splits in two: a presentational shell that always renders, and a save control that suspends on its own query. Only the control suspends, so a slow or failing entity lookup never blanks the row.

```tsx
import { Flex, Text } from "@artsy/palette-mobile"
import { ItineraryStopSaveControl } from "app/Scenes/CityGuide/Screens/Itinerary/Components/ItineraryStopSaveControl"
import { ItineraryStop } from "app/Scenes/CityGuide/Screens/Itinerary/utils/itineraryTypes"
// TODO: Replace with Image from @artsy/palette-mobile once we get the data from the API
import { Image as RNImage } from "react-native"

const IMAGE_SIZE = 60
const BULLET_SIZE = 16

interface Props {
  stop: ItineraryStop
  /** Derived from the flattened stop index by the screen. Never stored on the stop. */
  number: number
}

export const ItineraryStopRow: React.FC<Props> = ({ stop, number }) => {
  return (
    <Flex flexDirection="row" alignItems="center" gap={1}>
      <Flex
        width={BULLET_SIZE}
        height={BULLET_SIZE}
        borderRadius={BULLET_SIZE / 2}
        backgroundColor="mono100"
        alignItems="center"
        justifyContent="center"
      >
        <Text variant="xxs" color="mono0">
          {number}
        </Text>
      </Flex>

      <RNImage
        src={stop.imageUrl}
        width={IMAGE_SIZE}
        height={IMAGE_SIZE}
        resizeMode="cover"
        accessibilityIgnoresInvertColors
      />

      <Flex flex={1}>
        <Text variant="sm-display" numberOfLines={1} ellipsizeMode="tail">
          {stop.title}
        </Text>
        <Text variant="xs" color="mono60">
          {stop.displayTime}
        </Text>
        {!!stop.note && <Text variant="xs">{stop.note}</Text>}
      </Flex>

      {!!stop.saveTarget && (
        <ItineraryStopSaveControl saveTarget={stop.saveTarget} stopTitle={stop.title} />
      )}
    </Flex>
  )
}
```

- [ ] **Step 4: Write the save control**

Two branches, because `followShow` and `followProfile` take different identifiers. Each branch is its own component so neither calls hooks conditionally.

```tsx
import { useToast } from "app/Components/Toast/toastHook"
import { ItinerarySaveButton } from "app/Scenes/CityGuide/Screens/Itinerary/Components/ItinerarySaveButton"
import { ItinerarySaveTarget } from "app/Scenes/CityGuide/Screens/Itinerary/utils/itineraryTypes"
import { useFollowProfile } from "app/utils/mutations/useFollowProfile"
import { useFollowShow } from "app/utils/mutations/useFollowShow"
import { Schema } from "app/utils/track"
import { graphql, useLazyLoadQuery } from "react-relay"
import { useTracking } from "react-tracking"

interface Props {
  saveTarget: ItinerarySaveTarget
  stopTitle: string
}

export const ItineraryStopSaveControl: React.FC<Props> = ({ saveTarget, stopTitle }) => {
  if (saveTarget.type === "SHOW") {
    return <ShowSaveControl slug={saveTarget.slug} stopTitle={stopTitle} />
  }

  return <PartnerSaveControl slug={saveTarget.slug} stopTitle={stopTitle} />
}

const useSaveToast = () => {
  const toast = useToast()

  return (isNowSaved: boolean) => {
    toast.show(isNowSaved ? "Saved to your saves" : "Removed from your saves", "bottom")
  }
}

const ShowSaveControl: React.FC<{ slug: string; stopTitle: string }> = ({ slug, stopTitle }) => {
  const data = useLazyLoadQuery<any>(ShowQuery, { slug })
  const showToast = useSaveToast()
  const { trackEvent } = useTracking()
  const show = data?.show

  const { followShow, isInFlight } = useFollowShow({
    id: show?.id ?? "",
    internalID: show?.internalID ?? "",
    isFollowed: show?.isFollowed,
    onCompleted: showToast,
  })

  if (!show) return null

  return (
    <ItinerarySaveButton
      isSaved={!!show.isFollowed}
      isSaving={isInFlight}
      accessibilityLabel={show.isFollowed ? `Unsave ${stopTitle}` : `Save ${stopTitle}`}
      onPress={() => {
        trackEvent({
          action_name: show.isFollowed
            ? Schema.ActionNames.UnsaveShow
            : Schema.ActionNames.SaveShow,
          action_type: Schema.ActionTypes.Success,
          owner_type: Schema.OwnerEntityTypes.Show,
          owner_id: show.internalID,
          owner_slug: slug,
        })
        followShow()
      }}
    />
  )
}

const PartnerSaveControl: React.FC<{ slug: string; stopTitle: string }> = ({ slug, stopTitle }) => {
  const data = useLazyLoadQuery<any>(PartnerQuery, { slug })
  const showToast = useSaveToast()
  const profile = data?.partner?.profile

  const { followProfile, isInFlight } = useFollowProfile({
    id: profile?.id ?? "",
    internalID: profile?.internalID ?? "",
    isFollowed: profile?.isFollowed,
    onCompleted: showToast,
  })

  if (!profile) return null

  return (
    <ItinerarySaveButton
      isSaved={!!profile.isFollowed}
      isSaving={isInFlight}
      accessibilityLabel={profile.isFollowed ? `Unfollow ${stopTitle}` : `Follow ${stopTitle}`}
      onPress={followProfile}
    />
  )
}

const ShowQuery = graphql`
  query ItineraryStopSaveControlShowQuery($slug: String!) {
    show(id: $slug) {
      id
      internalID
      isFollowed
    }
  }
`

const PartnerQuery = graphql`
  query ItineraryStopSaveControlPartnerQuery($slug: String!) {
    partner(id: $slug) {
      profile {
        id
        internalID
        isFollowed
      }
    }
  }
`
```

Replace the `useLazyLoadQuery<any>` type arguments with the generated query types after `yarn relay`. Partner-branch tracking is omitted deliberately: `Schema.ActionNames` has no gallery-follow entry, and adding one belongs to the save sub-project.

- [ ] **Step 5: Compile Relay and run the tests**

```bash
yarn relay
yarn test src/app/Scenes/CityGuide/Screens/Itinerary/Components/__tests__/ItineraryStopRow.tests.tsx
```

Expected: PASS, 4 tests.

- [ ] **Step 6: Verify and commit**

```bash
yarn tsc
yarn test --findRelatedTests src/app/Scenes/CityGuide/Screens/Itinerary/Components/ItineraryStopRow.tsx src/app/Scenes/CityGuide/Screens/Itinerary/Components/ItineraryStopSaveControl.tsx
yarn lint --fix src/app/Scenes/CityGuide/Screens/Itinerary/
git add src/app/Scenes/CityGuide/Screens/Itinerary/ src/__generated__/
git commit -m "feat(city-guide): add ItineraryStopRow with real entity save"
```

---

### Task 6: ItinerarySectionRow

**Files:**

- Create: `src/app/Scenes/CityGuide/Screens/Itinerary/Components/ItinerarySectionRow.tsx`
- Test: `src/app/Scenes/CityGuide/Screens/Itinerary/Components/__tests__/ItinerarySectionRow.tests.tsx`

**Interfaces:**

- Produces: `ItinerarySectionRow: React.FC<{ section: ItinerarySection; startNumber: number }>`.

`startNumber` is the flattened index of this section's first stop, so numbering runs continuously across sections as the design shows. Named `...Row` to avoid colliding with the `ItinerarySection` type. Sections start expanded.

- [ ] **Step 1: Write the failing test**

```tsx
import { fireEvent, screen } from "@testing-library/react-native"
import { ItinerarySectionRow } from "app/Scenes/CityGuide/Screens/Itinerary/Components/ItinerarySectionRow"
import { ItinerarySection } from "app/Scenes/CityGuide/Screens/Itinerary/utils/itineraryTypes"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"

const section: ItinerarySection = {
  id: "day-1",
  title: "Day 1 — Easing in",
  stops: [
    {
      id: "stop-1",
      title: "Coffee at London Cafe",
      displayTime: "10am",
      imageUrl: "https://example.com/a.jpg",
      coordinates: { lat: 51.5136, lng: -0.1365 },
      saveTarget: null,
    },
    {
      id: "stop-2",
      title: "Museum",
      displayTime: "11am-4pm",
      imageUrl: "https://example.com/b.jpg",
      coordinates: { lat: 51.5194, lng: -0.127 },
      saveTarget: null,
    },
  ],
}

describe("ItinerarySectionRow", () => {
  const { renderWithRelay } = setupTestWrapper({ Component: ItinerarySectionRow })

  it("renders the title and its stops expanded by default", () => {
    renderWithRelay({}, { section, startNumber: 1 })

    expect(screen.getByText("Day 1 — Easing in")).toBeTruthy()
    expect(screen.getByText("Coffee at London Cafe")).toBeTruthy()
    expect(screen.getByText("Museum")).toBeTruthy()
  })

  it("numbers stops from startNumber", () => {
    renderWithRelay({}, { section, startNumber: 4 })

    expect(screen.getByText("4")).toBeTruthy()
    expect(screen.getByText("5")).toBeTruthy()
  })

  it("hides the stops when the header is tapped", () => {
    renderWithRelay({}, { section, startNumber: 1 })

    fireEvent.press(screen.getByTestId("itinerary-section-header"))

    expect(screen.queryByText("Coffee at London Cafe")).toBeNull()
    expect(screen.getByText("Day 1 — Easing in")).toBeTruthy()
  })
})
```

- [ ] **Step 2: Run to verify it fails**

Expected: FAIL — module not found.

- [ ] **Step 3: Write the implementation**

`SectionTitle` is not reused: it title-cases its input, which would mangle "Day 1 — Easing in", and its chevron always points right rather than flipping with the collapsed state.

```tsx
import { ChevronDownIcon, ChevronUpIcon } from "@artsy/icons/native"
import { Flex, Join, Spacer, Text } from "@artsy/palette-mobile"
import { ItineraryStopRow } from "app/Scenes/CityGuide/Screens/Itinerary/Components/ItineraryStopRow"
import { ItinerarySection } from "app/Scenes/CityGuide/Screens/Itinerary/utils/itineraryTypes"
import { useState } from "react"
import { TouchableOpacity } from "react-native"

interface Props {
  section: ItinerarySection
  /** Flattened index of this section's first stop, so numbering runs across sections. */
  startNumber: number
}

export const ItinerarySectionRow: React.FC<Props> = ({ section, startNumber }) => {
  const [isExpanded, setIsExpanded] = useState(true)

  return (
    <Flex>
      <TouchableOpacity
        testID="itinerary-section-header"
        accessibilityRole="button"
        accessibilityState={{ expanded: isExpanded }}
        onPress={() => setIsExpanded((expanded) => !expanded)}
      >
        <Flex flexDirection="row" alignItems="center" justifyContent="space-between" py={1}>
          <Text variant="sm-display">{section.title}</Text>
          {isExpanded ? <ChevronUpIcon fill="mono60" /> : <ChevronDownIcon fill="mono60" />}
        </Flex>
      </TouchableOpacity>

      {!!isExpanded && (
        <Join separator={<Spacer y={1} />}>
          {section.stops.map((stop, index) => (
            <ItineraryStopRow key={stop.id} stop={stop} number={startNumber + index} />
          ))}
        </Join>
      )}
    </Flex>
  )
}
```

If `ChevronDownIcon` / `ChevronUpIcon` are not exported, check available names with `grep -o "Chevron[A-Za-z]*Icon" node_modules/@artsy/icons/native.d.ts | sort -u` and rotate one rather than inventing an export.

- [ ] **Step 4: Run to verify it passes**

Expected: PASS, 3 tests.

- [ ] **Step 5: Verify and commit**

```bash
yarn tsc
yarn test --findRelatedTests src/app/Scenes/CityGuide/Screens/Itinerary/Components/ItinerarySectionRow.tsx
yarn lint --fix src/app/Scenes/CityGuide/Screens/Itinerary/Components/
git add src/app/Scenes/CityGuide/Screens/Itinerary/Components/
git commit -m "feat(city-guide): add collapsible ItinerarySectionRow"
```

---

### Task 7: ItineraryHeader

**Files:**

- Create: `src/app/Scenes/CityGuide/Screens/Itinerary/Components/ItineraryHeader.tsx`
- Test: `src/app/Scenes/CityGuide/Screens/Itinerary/Components/__tests__/ItineraryHeader.tests.tsx`

**Interfaces:**

- Produces: `ItineraryHeader: React.FC<{ itinerary: Itinerary }>`.

The "Add Full List" button from the design is deliberately absent — bulk-follow belongs to the save sub-project. The scrim is not optional: `mono0` text over an arbitrary backend image is unreadable on a light photograph (MISS-07).

- [ ] **Step 1: Write the failing test**

```tsx
import { screen } from "@testing-library/react-native"
import { ItineraryHeader } from "app/Scenes/CityGuide/Screens/Itinerary/Components/ItineraryHeader"
import { MOCK_ITINERARIES } from "app/Scenes/CityGuide/Screens/Itinerary/utils/mockItineraries"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

describe("ItineraryHeader", () => {
  it("renders the title, subtitle, author and description", () => {
    renderWithWrappers(<ItineraryHeader itinerary={MOCK_ITINERARIES[0]} />)

    expect(screen.getByText("Chill Vibes Only")).toBeTruthy()
    expect(screen.getByText("Top picks")).toBeTruthy()
    expect(screen.getByText("By Casey Lesser")).toBeTruthy()
    expect(screen.getByText(MOCK_ITINERARIES[0].description)).toBeTruthy()
  })

  it("renders a scrim behind the hero text", () => {
    renderWithWrappers(<ItineraryHeader itinerary={MOCK_ITINERARIES[0]} />)

    expect(screen.getByTestId("itinerary-hero-scrim")).toBeTruthy()
  })
})
```

- [ ] **Step 2: Run to verify it fails**

Expected: FAIL — module not found.

- [ ] **Step 3: Find the gradient component**

Run: `grep -rn "LinearGradient" src/app --include='*.tsx' | head -5`
Use whichever gradient component the repo already imports. Do not add a dependency. If nothing exists, use a semi-transparent `Flex` with `backgroundColor="rgba(0,0,0,0.4)"` instead and keep the same `testID`.

- [ ] **Step 4: Write the implementation**

```tsx
import { Flex, Text } from "@artsy/palette-mobile"
import { Itinerary } from "app/Scenes/CityGuide/Screens/Itinerary/utils/itineraryTypes"
import { LinearGradient } from "expo-linear-gradient"
// TODO: Replace with Image from @artsy/palette-mobile once we get the data from the API
import { Image as RNImage } from "react-native"

const HERO_HEIGHT = 300

export const ItineraryHeader: React.FC<{ itinerary: Itinerary }> = ({ itinerary }) => {
  return (
    <Flex>
      <Flex height={HERO_HEIGHT} justifyContent="flex-end">
        <RNImage
          src={itinerary.heroImageUrl}
          resizeMode="cover"
          accessibilityIgnoresInvertColors
          style={{ position: "absolute", width: "100%", height: HERO_HEIGHT }}
        />

        <LinearGradient
          testID="itinerary-hero-scrim"
          colors={["transparent", "rgba(0,0,0,0.7)"]}
          style={{ position: "absolute", bottom: 0, width: "100%", height: HERO_HEIGHT / 2 }}
        />

        <Flex p={2}>
          <Text variant="xl" color="mono0">
            {itinerary.title}
          </Text>
          <Text variant="sm" color="mono0">
            {itinerary.subtitle}
          </Text>
        </Flex>
      </Flex>

      <Flex px={2} pt={2}>
        <Text variant="xs" color="mono60">
          By {itinerary.authorName}
        </Text>
        <Text variant="sm" mt={1}>
          {itinerary.description}
        </Text>
      </Flex>
    </Flex>
  )
}
```

- [ ] **Step 5: Run to verify it passes**

Expected: PASS, 2 tests.

- [ ] **Step 6: Verify and commit**

```bash
yarn tsc
yarn test --findRelatedTests src/app/Scenes/CityGuide/Screens/Itinerary/Components/ItineraryHeader.tsx
yarn lint --fix src/app/Scenes/CityGuide/Screens/Itinerary/Components/
git add src/app/Scenes/CityGuide/Screens/Itinerary/Components/
git commit -m "feat(city-guide): add ItineraryHeader"
```

---

### Task 8: ItineraryScreen list view

**Files:**

- Create: `src/app/Scenes/CityGuide/Screens/Itinerary/ItineraryScreen.tsx`
- Test: `src/app/Scenes/CityGuide/Screens/Itinerary/__tests__/ItineraryScreen.tests.tsx`

**Interfaces:**

- Produces: `ItineraryScreen: React.FC<{ citySlug: string; itineraryId: string }>`. Task 11 adds the map toggle to this component.

The screen computes each section's `startNumber` from running stop counts — the single source of truth for numbering.

- [ ] **Step 1: Write the failing test**

```tsx
import { screen } from "@testing-library/react-native"
import { ItineraryScreen } from "app/Scenes/CityGuide/Screens/Itinerary/ItineraryScreen"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"

describe("ItineraryScreen", () => {
  const { renderWithRelay } = setupTestWrapper({ Component: ItineraryScreen })

  it("renders the header and every section", () => {
    renderWithRelay({}, { citySlug: "london-united-kingdom", itineraryId: "chill-vibes-only" })

    expect(screen.getByText("Chill Vibes Only")).toBeTruthy()
    expect(screen.getByText("Day 1 — Easing in")).toBeTruthy()
    expect(screen.getByText("Day 2 — London Frieze")).toBeTruthy()
  })

  it("numbers stops continuously across sections", () => {
    renderWithRelay({}, { citySlug: "london-united-kingdom", itineraryId: "chill-vibes-only" })

    // Day 1 holds three stops, so Day 2 starts at 4.
    expect(screen.getByText("4")).toBeTruthy()
    expect(screen.getByText("5")).toBeTruthy()
  })

  it("renders the unavailable state for an unknown itinerary", () => {
    renderWithRelay({}, { citySlug: "london-united-kingdom", itineraryId: "nope" })

    expect(screen.getByText("This guide is no longer available.")).toBeTruthy()
    expect(screen.queryByText("Chill Vibes Only")).toBeNull()
  })

  it("does not render another city's itinerary", () => {
    renderWithRelay({}, { citySlug: "paris-france", itineraryId: "chill-vibes-only" })

    expect(screen.getByText("This guide is no longer available.")).toBeTruthy()
  })
})
```

The last test covers what v1 got wrong entirely (FIX-04).

- [ ] **Step 2: Run to verify it fails**

Expected: FAIL — module not found.

- [ ] **Step 3: Write the implementation**

```tsx
import { Flex, Join, Screen, Spacer, Text } from "@artsy/palette-mobile"
import { ItineraryHeader } from "app/Scenes/CityGuide/Screens/Itinerary/Components/ItineraryHeader"
import { ItinerarySectionRow } from "app/Scenes/CityGuide/Screens/Itinerary/Components/ItinerarySectionRow"
import { getMockItinerary } from "app/Scenes/CityGuide/Screens/Itinerary/utils/mockItineraries"
import { goBack } from "app/system/navigation/navigate"

interface Props {
  citySlug: string
  itineraryId: string
}

export const ItineraryScreen: React.FC<Props> = ({ citySlug, itineraryId }) => {
  // TODO: Replace with a Relay query once the itinerary schema lands.
  const itinerary = getMockItinerary(citySlug, itineraryId)

  if (!itinerary) {
    return (
      <Screen>
        <Screen.Header onBack={goBack} />
        <Screen.Body>
          <Flex flex={1} alignItems="center" justifyContent="center">
            <Text variant="sm">This guide is no longer available.</Text>
          </Flex>
        </Screen.Body>
      </Screen>
    )
  }

  // Numbering runs continuously across sections, so each needs its running start.
  let runningTotal = 0
  const sectionStartNumbers = itinerary.sections.map((section) => {
    const start = runningTotal + 1
    runningTotal += section.stops.length
    return start
  })

  return (
    <Screen>
      <Screen.AnimatedHeader title={itinerary.title} onBack={goBack} hideTitle />

      <Screen.Body fullwidth>
        <Screen.ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
          <ItineraryHeader itinerary={itinerary} />

          <Flex px={2} pt={2}>
            <Join separator={<Spacer y={2} />}>
              {itinerary.sections.map((section, index) => (
                <ItinerarySectionRow
                  key={section.id}
                  section={section}
                  startNumber={sectionStartNumbers[index]}
                />
              ))}
            </Join>
          </Flex>
        </Screen.ScrollView>
      </Screen.Body>
    </Screen>
  )
}
```

- [ ] **Step 4: Run to verify it passes**

Expected: PASS, 4 tests.

- [ ] **Step 5: Verify and commit**

```bash
yarn tsc
yarn test --findRelatedTests src/app/Scenes/CityGuide/Screens/Itinerary/ItineraryScreen.tsx
yarn lint --fix src/app/Scenes/CityGuide/Screens/Itinerary/
git add src/app/Scenes/CityGuide/Screens/Itinerary/
git commit -m "feat(city-guide): add ItineraryScreen list view"
```

---

### Task 9: Route registration and entry point

**Files:**

- Modify: `src/app/Navigation/routes.tsx`
- Modify: `src/app/Scenes/CityGuide/Components/CityGuideCuratedLists.tsx`
- Modify: `src/app/Scenes/CityGuide/CityGuideNew.tsx:51`
- Modify: `android/app/src/main/AndroidManifest.xml`
- Test: `src/app/Scenes/CityGuide/Components/__tests__/CityGuideCuratedLists.tests.tsx`
- Test: `src/app/Navigation/__tests__/routes.tests.ts`

- [ ] **Step 1: Write the failing tests**

The row-count assertion is what makes this genuinely red — v1's text-only assertion already passed against the unmodified component (FIX-10).

```tsx
import { screen } from "@testing-library/react-native"
import { CityGuideCuratedLists } from "app/Scenes/CityGuide/Components/CityGuideCuratedLists"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

describe("CityGuideCuratedLists", () => {
  it("renders one pressable row per curated list", () => {
    renderWithWrappers(<CityGuideCuratedLists citySlug="london-united-kingdom" />)

    expect(screen.getAllByTestId("curated-list-row")).toHaveLength(3)
  })

  it("links each row to its itinerary", () => {
    renderWithWrappers(<CityGuideCuratedLists citySlug="london-united-kingdom" />)

    const rows = screen.getAllByTestId("curated-list-row")

    expect(rows[0].props.to).toEqual("/city-guide/london-united-kingdom/itinerary/chill-vibes-only")
  })
})
```

Add to `src/app/Navigation/__tests__/routes.tests.ts` (FIX-09) — no snapshot iterates the route table, so without this, adding a route proves nothing:

```ts
it("routes to CityGuideItinerary", () => {
  expect(matchRoute("/city-guide/london-united-kingdom/itinerary/chill-vibes-only"))
    .toMatchInlineSnapshot(`
    {
      "module": "CityGuideItinerary",
      "params": {
        "citySlug": "london-united-kingdom",
        "itineraryId": "chill-vibes-only",
      },
      "type": "match",
    }
  `)
})
```

- [ ] **Step 2: Run to verify they fail**

```bash
yarn test src/app/Scenes/CityGuide/Components/__tests__/CityGuideCuratedLists.tests.tsx
yarn test src/app/Navigation/__tests__/routes.tests.ts -t CityGuideItinerary
```

Expected: FAIL — `CityGuideCuratedLists` takes no props and has no `curated-list-row` testID; the route does not match.

- [ ] **Step 3: Rewrite CityGuideCuratedLists**

Uses `RouterLink`, not `navigate` (FIX-11). Each `itineraryId` matches a real `MOCK_ITINERARIES` entry (BLOCK-06).

```tsx
import { Flex, Join, Spacer, Text } from "@artsy/palette-mobile"
import { RouterLink } from "app/system/navigation/RouterLink"
// TODO: Replace with Image from @artsy/palette-mobile once we get the data from the API
import { Image as RNImage } from "react-native"

const IMAGE_SIZE = 80

const ListItem = ({ item, citySlug }: { item: (typeof data)[0]; citySlug: string }) => {
  return (
    <RouterLink
      testID="curated-list-row"
      to={`/city-guide/${citySlug}/itinerary/${item.itineraryId}`}
      hasChildTouchable
    >
      <Flex flexDirection="row" gap={1}>
        <RNImage
          src={item.image}
          width={IMAGE_SIZE}
          height={IMAGE_SIZE}
          resizeMode="cover"
          accessibilityIgnoresInvertColors
        />

        <Flex flex={1}>
          <Text variant="lg-display">{item.title}</Text>
          <Text variant="xs" color="mono60">
            By {item.author}
          </Text>
        </Flex>
      </Flex>
    </RouterLink>
  )
}

export const CityGuideCuratedLists = ({ citySlug }: { citySlug: string }) => {
  return (
    <Flex px={2}>
      <Join separator={<Spacer y={2} />}>
        {data.map((item) => (
          <ListItem key={item.id} item={item} citySlug={citySlug} />
        ))}
      </Join>
    </Flex>
  )
}

// itineraryId values must match MOCK_ITINERARIES entries; every row has to resolve.
const data = [
  {
    id: 1,
    itineraryId: "chill-vibes-only",
    image: "https://picsum.photos/200/300.jpg",
    title: "Chill Vibes Only",
    author: "Casey Lesser",
  },
  {
    id: 2,
    itineraryId: "36-hours-in-london",
    image: "https://picsum.photos/200/300.jpg",
    title: "36 Hours in London",
    author: "Casey Lesser",
  },
  {
    id: 3,
    itineraryId: "must-sees-and-hidden-gems",
    image: "https://picsum.photos/200/300.jpg",
    title: "Must Sees & Hidden Gems",
    author: "Casey Lesser",
  },
]
```

In `src/app/Scenes/CityGuide/CityGuideNew.tsx:51`, change `<CityGuideCuratedLists />` to `<CityGuideCuratedLists citySlug={city?.slug ?? ""} />`.

- [ ] **Step 4: Register the route**

Add the import beside the other City Guide imports (`routes.tsx:85-98`):

```tsx
import { ItineraryScreen } from "app/Scenes/CityGuide/Screens/Itinerary/ItineraryScreen"
```

Add after the `/city-guide` block ending at line 1141:

```tsx
  {
    path: "/city-guide/:citySlug/itinerary/:itineraryId",
    name: "CityGuideItinerary",
    Component: ItineraryScreen,
    options: {
      screenOptions: {
        headerTransparent: true,
        headerShadowVisible: false,
        header: () => {
          return null
        },
      },
    },
  },
```

- [ ] **Step 5: Add the Android deep link**

`/city-guide` has no manifest entry today; `pathPrefix` covers the sub-route. The list is **not** alphabetically sorted — breaks at `:92-93`, `:109-110`, `:142-144` (CLAIM-06) — but the logical position is between `:103 /categories` and `:104 /collect`:

```xml
        <data android:pathPrefix="/city-guide"/>
```

- [ ] **Step 6: Run to verify the tests pass**

Expected: both PASS. If the inline snapshot differs, inspect the diff before accepting — `module` and both params must match exactly.

- [ ] **Step 7: Verify and commit**

```bash
yarn tsc
yarn test --findRelatedTests src/app/Navigation/routes.tsx src/app/Scenes/CityGuide/Components/CityGuideCuratedLists.tsx src/app/Scenes/CityGuide/CityGuideNew.tsx
yarn lint --fix src/app/Navigation/routes.tsx src/app/Scenes/CityGuide/
git add src/app/Navigation/ src/app/Scenes/CityGuide/ android/app/src/main/AndroidManifest.xml
git commit -m "feat(city-guide): route curated list rows to itinerary screen"
```

---

### Task 10: Stops-to-GeoJSON converter

**Files:**

- Create: `src/app/Scenes/CityGuide/Screens/Itinerary/utils/itineraryStopsToGeoJSON.ts`
- Test: `src/app/Scenes/CityGuide/Screens/Itinerary/utils/__tests__/itineraryStopsToGeoJSON.tests.ts`

**Interfaces:**

- Produces: `flattenItineraryStops(itinerary): FlattenedStop[]` where `FlattenedStop = { stop: ItineraryStop; sectionId: string; number: number }`; `itineraryStopsToGeoJSON(flattened): ItineraryFeatureCollection`.

`convertCityToGeoJSON` is not reusable: it requires `feature.location.coordinates` (`convertCityToGeoJSON.ts:43`), while stops carry `coordinates: { lat, lng }` at the top level.

This is the map work's only pure logic, so it carries the map's real coverage — `MapView` mocks to `() => null`, so pins never mount.

- [ ] **Step 1: Write the failing test**

```ts
import {
  flattenItineraryStops,
  itineraryStopsToGeoJSON,
} from "app/Scenes/CityGuide/Screens/Itinerary/utils/itineraryStopsToGeoJSON"
import { MOCK_ITINERARIES } from "app/Scenes/CityGuide/Screens/Itinerary/utils/mockItineraries"

describe("flattenItineraryStops", () => {
  it("returns every stop with a continuous number and its section id", () => {
    const flattened = flattenItineraryStops(MOCK_ITINERARIES[0])

    expect(flattened.map((f) => f.number)).toEqual([1, 2, 3, 4, 5])
    expect(flattened[0].sectionId).toEqual("day-1")
    expect(flattened[3].sectionId).toEqual("day-2")
  })
})

describe("itineraryStopsToGeoJSON", () => {
  it("converts stops into a feature collection with lng,lat coordinates", () => {
    const collection = itineraryStopsToGeoJSON(flattenItineraryStops(MOCK_ITINERARIES[0]))

    expect(collection.type).toEqual("FeatureCollection")
    expect(collection.features).toHaveLength(5)
    // GeoJSON is lng first, lat second.
    expect(collection.features[0].geometry.coordinates).toEqual([-0.1365, 51.5136])
  })

  it("stamps id, title, sectionId and a string number into properties", () => {
    const collection = itineraryStopsToGeoJSON(flattenItineraryStops(MOCK_ITINERARIES[0]))

    expect(collection.features[1].properties).toEqual({
      id: "stop-2",
      title: "Museum",
      sectionId: "day-1",
      number: "2",
    })
  })

  it("returns an empty collection for no stops", () => {
    expect(itineraryStopsToGeoJSON([])).toEqual({ type: "FeatureCollection", features: [] })
  })
})
```

- [ ] **Step 2: Run to verify it fails**

Expected: FAIL — module not found.

- [ ] **Step 3: Write the implementation**

`number` is stringified because Mapbox's `textField` expects a `FormattedString`; stamping it avoids a `["to-string", ...]` wrapper in the layer style.

```ts
import {
  Itinerary,
  ItineraryStop,
} from "app/Scenes/CityGuide/Screens/Itinerary/utils/itineraryTypes"

export interface FlattenedStop {
  stop: ItineraryStop
  sectionId: string
  number: number
}

export interface ItineraryFeature {
  type: "Feature"
  geometry: { type: "Point"; coordinates: [number, number] }
  properties: { id: string; title: string; sectionId: string; number: string }
}

export interface ItineraryFeatureCollection {
  type: "FeatureCollection"
  features: ItineraryFeature[]
}

/** Single source of truth for stop numbering: position in the flattened list. */
export const flattenItineraryStops = (itinerary: Itinerary): FlattenedStop[] => {
  const flattened: FlattenedStop[] = []

  itinerary.sections.forEach((section) => {
    section.stops.forEach((stop) => {
      flattened.push({ stop, sectionId: section.id, number: flattened.length + 1 })
    })
  })

  return flattened
}

export const itineraryStopsToGeoJSON = (
  flattened: FlattenedStop[]
): ItineraryFeatureCollection => ({
  type: "FeatureCollection",
  features: flattened.map(({ stop, sectionId, number }) => ({
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [stop.coordinates.lng, stop.coordinates.lat],
    },
    properties: {
      id: stop.id,
      title: stop.title,
      sectionId,
      number: String(number),
    },
  })),
})
```

- [ ] **Step 4: Run to verify it passes**

Expected: PASS, 4 tests.

- [ ] **Step 5: Verify and commit**

```bash
yarn tsc
yarn test --findRelatedTests src/app/Scenes/CityGuide/Screens/Itinerary/utils/itineraryStopsToGeoJSON.ts
yarn lint --fix src/app/Scenes/CityGuide/Screens/Itinerary/utils/
git add src/app/Scenes/CityGuide/Screens/Itinerary/utils/
git commit -m "feat(city-guide): add itinerary stops to GeoJSON converter"
```

---

### Task 11: Map view and the list/map toggle

**Files:**

- Create: `src/app/Scenes/CityGuide/Screens/Itinerary/Components/ItineraryMapPins.tsx`
- Create: `src/app/Scenes/CityGuide/Screens/Itinerary/Components/ItineraryMapView.tsx`
- Modify: `src/app/Scenes/CityGuide/Screens/Itinerary/ItineraryScreen.tsx`
- Modify: `src/setupJest.tsx:295-304`
- Modify: `src/app/Scenes/CityGuide/Screens/Itinerary/__tests__/ItineraryScreen.tests.tsx`

Two components, not one — v1 promised a separate pins component and then inlined everything (CLAIM-08). `ItineraryMapPins` is pure rendering: no state, no camera. `ItineraryMapView` owns layout, camera, filters, and insets.

- [ ] **Step 1: Extend the Jest Mapbox mock**

`Camera` and `CircleLayer` are absent today and go unnoticed only because `MapView: () => null` never renders children.

```ts
jest.mock("@rnmapbox/maps", () => ({
  MapView: () => null,
  Camera: () => null,
  StyleURL: { Light: null },
  setAccessToken: () => jest.fn(),
  StyleSheet: {},
  ShapeSource: () => null,
  SymbolLayer: () => null,
  CircleLayer: () => null,
}))
```

Never read a Mapbox constant during render — `MapboxGL.UserTrackingModes.Follow` (`CityGuideMap.tsx:221`) would throw under this mock.

- [ ] **Step 2: Write the failing test**

Add to `src/app/Scenes/CityGuide/Screens/Itinerary/__tests__/ItineraryScreen.tests.tsx`, adding `fireEvent` to the existing import:

```tsx
it("switches to the map view and back", () => {
  renderWithRelay({}, { citySlug: "london-united-kingdom", itineraryId: "chill-vibes-only" })

  expect(screen.getByText("Coffee at London Cafe")).toBeTruthy()

  fireEvent.press(screen.getByTestId("itinerary-view-toggle"))

  // MapView mocks to null, so its children never mount. Assert on the chrome
  // outside the map: the list is gone and the filter pills are up.
  expect(screen.queryByText("Coffee at London Cafe")).toBeNull()
  expect(screen.getByText("All")).toBeTruthy()
  expect(screen.getByText("Day 1 — Easing in")).toBeTruthy()

  fireEvent.press(screen.getByTestId("itinerary-view-toggle"))

  expect(screen.getByText("Coffee at London Cafe")).toBeTruthy()
})

it("filters the map to one section when its pill is tapped", () => {
  renderWithRelay({}, { citySlug: "london-united-kingdom", itineraryId: "chill-vibes-only" })

  fireEvent.press(screen.getByTestId("itinerary-view-toggle"))
  fireEvent.press(screen.getByText("Day 2 — London Frieze"))

  expect(screen.getByTestId("itinerary-map-stop-count")).toHaveTextContent("2 stops")
})
```

- [ ] **Step 3: Run to verify it fails**

Expected: FAIL — no `itinerary-view-toggle` testID.

- [ ] **Step 4: Write ItineraryMapPins**

Pure rendering. `textFont` uses "Unica77 LL Medium", already proven in the Artsy style (`CityGuideMapPins.tsx:59-65`). No `cluster` prop — itineraries hold 5-15 stops.

```tsx
import MapboxGL, { CircleLayerStyle, SymbolLayerStyle } from "@rnmapbox/maps"
import { ItineraryFeatureCollection } from "app/Scenes/CityGuide/Screens/Itinerary/utils/itineraryStopsToGeoJSON"
import { StyleProp } from "react-native"

const circleStyle: StyleProp<CircleLayerStyle> = {
  circleRadius: 14,
  circleColor: "black",
  circleStrokeWidth: 2,
  circleStrokeColor: "white",
  circlePitchAlignment: "map",
}

const numberStyle: StyleProp<SymbolLayerStyle> = {
  textField: ["get", "number"],
  textSize: 14,
  textColor: "white",
  textFont: ["Unica77 LL Medium"],
  textPitchAlignment: "map",
  textAllowOverlap: true,
  textIgnorePlacement: true,
}

interface Props {
  collection: ItineraryFeatureCollection
  /** null shows every stop. */
  selectedSectionId: string | null
}

export const ItineraryMapPins: React.FC<Props> = ({ collection, selectedSectionId }) => {
  // Filter in the layer so switching pills does not rebuild the shape source.
  const filter = selectedSectionId
    ? (["==", ["get", "sectionId"], selectedSectionId] as any)
    : undefined

  return (
    <MapboxGL.ShapeSource id="itineraryStops" shape={collection as any}>
      <MapboxGL.CircleLayer id="stopCircles" style={circleStyle} filter={filter} />
      <MapboxGL.SymbolLayer
        id="stopNumbers"
        aboveLayerID="stopCircles"
        style={numberStyle}
        filter={filter}
      />
    </MapboxGL.ShapeSource>
  )
}
```

- [ ] **Step 5: Write ItineraryMapView**

Fits bounds to the visible stops rather than centring on the first at a fixed zoom (FIX-07).

```tsx
import { Flex, Pill, Spacer, Text } from "@artsy/palette-mobile"
import MapboxGL from "@rnmapbox/maps"
import { ItineraryMapPins } from "app/Scenes/CityGuide/Screens/Itinerary/Components/ItineraryMapPins"
import {
  flattenItineraryStops,
  itineraryStopsToGeoJSON,
} from "app/Scenes/CityGuide/Screens/Itinerary/utils/itineraryStopsToGeoJSON"
import { Itinerary } from "app/Scenes/CityGuide/Screens/Itinerary/utils/itineraryTypes"
import { ArtsyMapStyleURL, configureMapbox } from "app/utils/mapbox"
import { useEffect, useMemo, useRef, useState } from "react"
import { ScrollView } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

configureMapbox()

const ALL_PILL_ID = "__all__"
const BOUNDS_PADDING = 60

export const ItineraryMapView: React.FC<{ itinerary: Itinerary }> = ({ itinerary }) => {
  const [selectedSectionId, setSelectedSectionId] = useState(ALL_PILL_ID)
  const cameraRef = useRef<MapboxGL.Camera>(null)
  const { top } = useSafeAreaInsets()

  const flattened = useMemo(() => flattenItineraryStops(itinerary), [itinerary])
  const collection = useMemo(() => itineraryStopsToGeoJSON(flattened), [flattened])

  const visible = useMemo(
    () =>
      selectedSectionId === ALL_PILL_ID
        ? flattened
        : flattened.filter((f) => f.sectionId === selectedSectionId),
    [flattened, selectedSectionId]
  )

  // Refit whenever the visible set changes, so pins are never off-screen.
  useEffect(() => {
    if (!visible.length) return

    const lngs = visible.map((f) => f.stop.coordinates.lng)
    const lats = visible.map((f) => f.stop.coordinates.lat)

    cameraRef.current?.setCamera({
      bounds: {
        ne: [Math.max(...lngs), Math.max(...lats)],
        sw: [Math.min(...lngs), Math.min(...lats)],
        paddingTop: BOUNDS_PADDING,
        paddingBottom: BOUNDS_PADDING,
        paddingLeft: BOUNDS_PADDING,
        paddingRight: BOUNDS_PADDING,
      },
      animationDuration: 500,
    })
  }, [visible])

  const pills = [
    { id: ALL_PILL_ID, title: "All" },
    ...itinerary.sections.map((section) => ({ id: section.id, title: section.title })),
  ]

  return (
    <Flex flex={1}>
      <MapboxGL.MapView
        style={{ flex: 1 }}
        styleURL={ArtsyMapStyleURL}
        logoEnabled={false}
        attributionEnabled={false}
      >
        <MapboxGL.Camera ref={cameraRef} animationMode="moveTo" />

        <ItineraryMapPins
          collection={collection}
          selectedSectionId={selectedSectionId === ALL_PILL_ID ? null : selectedSectionId}
        />
      </MapboxGL.MapView>

      <Flex position="absolute" top={top} left={0} right={0} pt={1}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <Flex flexDirection="row" px={2} gap={1}>
            {pills.map((pill) => (
              <Pill
                key={pill.id}
                selected={selectedSectionId === pill.id}
                onPress={() => setSelectedSectionId(pill.id)}
              >
                {pill.title}
              </Pill>
            ))}
          </Flex>
        </ScrollView>

        <Spacer y={1} />

        <Text testID="itinerary-map-stop-count" variant="xs" px={2}>
          {visible.length} stops
        </Text>
      </Flex>
    </Flex>
  )
}
```

If `Pill` does not accept `selected`, copy a real call site found with `grep -rn "<Pill" src/app --include='*.tsx' | head`.

- [ ] **Step 6: Add the toggle to ItineraryScreen**

Add these imports and state:

```tsx
import { Button } from "@artsy/palette-mobile"
import { ItineraryMapView } from "app/Scenes/CityGuide/Screens/Itinerary/Components/ItineraryMapView"
import { useState } from "react"
import { useSafeAreaInsets } from "react-native-safe-area-context"

// beside the itinerary lookup:
const [isMapView, setIsMapView] = useState(false)
const { bottom } = useSafeAreaInsets()
```

Then render the map or the list inside `Screen.Body`, with the toggle above the safe-area inset. `CityGuideFloatingMapButton` is not reused because it hardcodes a `navigate` to `/local-discovery`.

```tsx
{
  isMapView ? (
    <ItineraryMapView itinerary={itinerary} />
  ) : (
    <Screen.ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
      {/* header + sections, unchanged from Task 8 */}
    </Screen.ScrollView>
  )
}

;<Flex position="absolute" bottom={bottom + 20} width="100%" alignItems="center">
  <Button
    testID="itinerary-view-toggle"
    size="small"
    onPress={() => setIsMapView((current) => !current)}
  >
    {isMapView ? "List" : "Map"}
  </Button>
</Flex>
```

- [ ] **Step 7: Run the tests**

```bash
yarn test src/app/Scenes/CityGuide/Screens/Itinerary/
yarn test src/app/Components/LocationMap src/app/Scenes/Partner
```

Expected: six `ItineraryScreen` tests pass, and the existing map tests still pass — the Jest mock gained exports and lost none.

- [ ] **Step 8: Verify and commit**

```bash
yarn tsc
yarn test --findRelatedTests src/app/Scenes/CityGuide/Screens/Itinerary/ItineraryScreen.tsx src/setupJest.tsx
yarn lint --fix src/app/Scenes/CityGuide/Screens/Itinerary/ src/setupJest.tsx
git add src/app/Scenes/CityGuide/Screens/Itinerary/ src/setupJest.tsx
git commit -m "feat(city-guide): add itinerary map view and list/map toggle"
```

---

## Verification

After the final task:

- [ ] `yarn tsc` passes with no new errors.
- [ ] `yarn test src/app/Scenes/CityGuide src/app/utils/mutations src/app/Components/LocationMap src/app/Scenes/Partner src/app/Navigation` passes.
- [ ] `yarn lint src/app/Scenes/CityGuide src/app/utils/mutations src/app/utils/mapbox.ts` is clean.
- [ ] Open `/city-guide` and tap each of the three curated rows. **All three open an itinerary** — none shows the unavailable state.
- [ ] On "Chill Vibes Only": the header renders with readable text over the hero, two sections, stops numbered 1-5 continuously across both.
- [ ] The cafe stop (1) shows **no** save control. The others do.
- [ ] Nothing animates on first render.
- [ ] Tap a save control: the icon pops to a tick and a toast confirms. **Back out and re-enter the screen — the saved state survives.** This is the check that separates v2 from v1.
- [ ] Confirm the save is genuinely real: the same show reads as saved elsewhere in the app.
- [ ] Tap again: it reverts, toasts the removal, and that persists too.
- [ ] Collapse and expand a section.
- [ ] Tap "Map": pins 1-5 appear framed within the viewport. Tap "Day 2 — London Frieze": only pins 4 and 5 remain and the camera refits. Tap "List" to return.
- [ ] Navigate to `/city-guide/paris-france/itinerary/chill-vibes-only`: the unavailable state renders, not the London itinerary.
- [ ] The City Guide map, Partner map, and artwork location map all still render after the Mapbox extraction.
