# City Guide Itineraries — Design

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
