# City Guide Itineraries — Review Handoff

**Repo:** `artsy/eigen` (Artsy's React Native app), branch `main`
**Date:** 2026-08-26
**Status:** Spec approved by the product owner. Plan drafted, not yet reviewed, not yet implemented.

## What this document is

Everything needed to review the itinerary work in one file: the background research, the approved
spec, and the implementation plan. Two source files are reproduced below verbatim and remain the
canonical copies:

- `docs/superpowers/specs/2026-08-26-city-guide-itineraries-design.md` (commit `34f73e7cd7`)
- `docs/superpowers/plans/2026-08-26-city-guide-itineraries.md` (commit `0fb23bbd9c`)

## What we want reviewed

1. **Is the data shape right?** It is deliberately loose — freeform section titles, a freeform
   `description` string — because the backend schema does not exist yet and this client shape is
   what we will take into the API design session. Wrong-shaped mocks become wrong-shaped APIs.
2. **Are the two extractions justified?** `useFollowShow` and a shared `SaveButton` get pulled into
   shared locations before a second consumer exists. The sibling sub-projects need them, but that
   is an argument from a plan, not from code on disk.
3. **Task 10 deviates from the approved spec.** The spec says extend `CityGuideMapPins.tsx`; the
   plan writes a separate pins component instead. The reasoning is in Task 10. Is it sound?
4. **Is the plan actually executable by someone with no context?** Every task should be runnable
   as written, with real code and real commands.

## Constraints the work was written under

Given by the product owner at the outset:

- Reuse existing components, spacing, and patterns over matching Figma exactly. The designs and the
  prototype are both still moving.
- Anything needing an API call gets a drafted data shape plus static client-side mock data. The
  backend is designed later, together, once access is granted.
- Saving shows and galleries is the one area expected to need new behaviour rather than reuse.

## Design source

- Figma file: `Fireworks-City-Guide` (`HMwmWnpQClcGnwTOcYdyKx`)
- Itinerary list view: node `16:18536`
- Itinerary map view, time-of-day filters: node `16:18693`
- Multi-day map view, `Day 1`–`Day 5` filters: node `16:18627`
- Day-grouped list with editorial subtitles and emoji: node `84:36426`

Two frames disagree about grouping. Node `16:18536` groups stops by time of day ("Mellow morning",
"Chill afternoon", "Nighttime hang", "If you have the energy"). Node `84:36426` groups by day with
editorial subtitles ("Day 1 — Easing in", "Day 2 — London Frieze") and adds emoji under some stops.
The schema treats section titles as opaque backend-authored strings so both render without a client
change. This is the single most consequential decision in the spec.

## Scope decisions reached with the product owner

The wider City Guide increment covers five areas: browse/discovery, saving shows and galleries, the
city picker, the map, and itineraries. It was split into sub-projects; this is the first one.

Three clarifications materially shrank the itinerary scope:

- Users **cannot create or edit** an itinerary. Itineraries come from the backend fully assembled.
- The `+` on a stop is **not** "add to my itinerary". It saves/follows the show. There is no
  scheduling step and no day assignment.
- Saving a show does not add it to any itinerary. The two concepts are unrelated.

An early draft of this spec assumed a user-authored, multi-day itinerary builder with a day/time
picker. That was wrong, and the correction is why the plan is as small as it is.

## Codebase context the reviewer will want

Findings from reading the repo, so the plan's references can be checked without re-deriving them.

**The City Guide exists twice.**

- `/local-discovery` → `src/app/Scenes/CityGuide/CityGuide.tsx` — the live map-based scene, fully
  wired to Relay through `Components/CityGuideMapQueryRenderer.tsx`, fetching `city(slug)` for
  `showsConnection` and `fairsConnection`.
- `/city-guide` → `src/app/Scenes/CityGuide/CityGuideNew.tsx` — a rebuild from this month
  (PRs #13976, #13982, #13987). Entirely mock data: `Components/CityGuideMetaData.tsx`,
  `CityGuideCuratedLists.tsx`, and `CityGuideEvents.tsx` render hardcoded arrays with
  `picsum.photos` placeholders. City selection reads local JSON via `Components/CityGuideCityPicker.tsx`,
  behind the `AREnableExpandedCityGuide` feature flag.

Both routes are registered side by side in `src/app/Navigation/routes.tsx:1113-1141`. The itinerary
work builds on `CityGuideNew`.

**Follow/save mutation patterns already in the tree.**

- `src/app/Scenes/CityGuide/Components/CityGuideEvent.tsx:32-67` — `followShow(input: {partnerShowID,
unfollow})` via `useMutation`, with an optimistic response and a store updater, written inline.
- `src/app/Components/ShowFollowButton.tsx` — the same mutation again, via `commitMutation`, gated
  by `AREnableFollowShowsAndFairs`.
- `src/app/utils/mutations/useFollowProfile.ts` — `followProfile(input: {profileID, unfollow})`,
  already extracted as a hook returning `{followProfile, isInFlight}`. This is the shape
  `useFollowShow` copies, and it also covers galleries, since Partner profiles use
  `Profile.isFollowed` the same way Fairs do.
- `src/app/utils/mutations/useFollowArtist.ts` — a thinner wrapper with no optimistic response.
- Artwork saves are a different system entirely (`useSaveArtwork.ts`, `ArtworkLists/`), list
  membership rather than a boolean. Not a model for this work.

So the show-follow logic exists twice inline and zero times as a hook. Task 3 extracts it and
migrates one of the two call sites.

**Saved-shows plumbing that already exists.** `Me.followsAndSaves.showsConnection(city: $citySlug,
status: RUNNING_AND_UPCOMING)` is queried by `Screens/CitySavedList.tsx` with `usePaginationFragment`.
`Components/CityGuideSavedEventSection.tsx` is a summary row linking to `/city-save/:citySlug`. The
itinerary work does not touch either, but the save sub-project will.

**Global state.** `easy-peasy`, rooted at `src/app/store/GlobalStore.tsx`, tree assembled in
`src/app/store/GlobalStoreModel.ts`. Persistence is whole-tree and automatic via
`src/app/store/persistence.ts` (throttled AsyncStorage writes under key `artsy-app-state`); opting
out means nesting under a `sessionState` key. `src/app/store/RecentPriceRangesModel.ts` is the
minimal collection-slice template. **The plan does not add a store slice** — saved state for mock
itinerary stops is local component state, because it is throwaway once the backend lands.

**Mapbox.** `@rnmapbox/maps` at 10.3.1. Access token is set per-module at file top level
(`MapboxGL.setAccessToken(Keys.secureFor("MAPBOX_API_CLIENT_KEY"))`, e.g. `CityGuideMap.tsx:41`).
The shared style URL is `ArtsyMapStyleURL`, exported from `CityGuideMap.tsx:53`. `CityGuideMapPins.tsx`
is built around clustering (`cluster`, `clusterRadius`, `point_count` filters, `getClusterLeaves`
via `shapeSourceRef`), is keyed by `BucketKey`/`FilterData` from `utils/cityTabs`, and draws sprite
icons through `iconImage: ["get", "icon"]`. This is why Task 10 does not extend it.

`convertCityToGeoJSON.ts:43` hard-requires `feature.location.coordinates`, while itinerary stops
carry `coordinates: {lat, lng}` at the top level, so Task 9 writes a small converter instead.

**Test environment gotchas.**

- Reanimated is globally mocked at `src/setupJest.tsx:322` (`react-native-reanimated/mock`).
  Animation values are not observable; assert on rendered output.
- The Mapbox mock at `src/setupJest.tsx:295-304` covers only `MapView`, `StyleURL`,
  `setAccessToken`, `StyleSheet`, `ShapeSource`, and `SymbolLayer`. `Camera` and `CircleLayer` are
  absent and go unnoticed only because `MapView: () => null` never renders children. Task 10 adds
  them. Reading a Mapbox constant during render (as `CityGuideMap.tsx:221` does with
  `MapboxGL.UserTrackingModes.Follow`) throws under this mock.
- There are no tests for `CityGuideMap` or `CityGuideMapPins` today.
- The `detect-secrets` pre-commit hook rejects base64 strings of Relay-node-id length as
  high-entropy secrets. Mock ids in the plan are readable strings for this reason.

**Untested mock components.** `CityGuideCityPicker`, `CityGuideCuratedLists`, `CityGuideMetaData`,
and `CityGuideEvents` carry `// @TODO: Implement test` comments. The plan adds a test for
`CityGuideCuratedLists` only, since Task 8 changes it.

## Known gaps, stated plainly

- The "Add Full List" button in the design (bulk-follow every stop) is not built. It belongs to the
  save sub-project, which owns bulk behaviour and its failure modes.
- Toast copy ("Saved to your saves" / "Removed from your saves") is invented. Product has not
  confirmed it.
- Emoji in `description` render as plain text. No sizing or layout treatment.
- The map centres on the first stop at a fixed zoom rather than fitting bounds to the stop set.
- Two of the three curated-list rows point at itinerary ids with no mock data, exercising the
  "no longer available" branch. That is intentional coverage, not an oversight.

---

# Part 1 — Approved Spec

_Verbatim from `docs/superpowers/specs/2026-08-26-city-guide-itineraries-design.md`._

**Date:** 2026-08-26
**Status:** Draft for review
**Scope:** Sub-project 1 of the City Guide increment

## Context

The City Guide already exists in two forms in `src/app/Scenes/CityGuide/`:

- `/local-discovery` → `CityGuide.tsx` — the live, map-based scene, fully wired to Relay via
  `CityGuideMapQueryRenderer.tsx`. It fetches `city(slug)` for `showsConnection` and
  `fairsConnection`.
- `/city-guide` → `CityGuideNew.tsx` — a rebuild added this month, currently rendering hardcoded
  mock arrays (`CityGuideMetaData.tsx`, `CityGuideCuratedLists.tsx`, `CityGuideEvents.tsx`) with
  `picsum.photos` placeholders. City selection runs off local JSON via `CityGuideCityPicker.tsx`,
  behind the `AREnableExpandedCityGuide` flag.

This spec covers itineraries only. The wider increment also includes browse/discovery, the city
picker, map work, and saving shows and galleries; each of those gets its own spec.

The Figma designs and the prototype are both still moving. This spec commits to the data shape and
the component boundaries, not to pixel values.

## What we are building

Read-only viewing of curated city itineraries — editorial guides such as "Chill Vibes Only" by
Casey Lesser. Users cannot create or edit an itinerary. The content arrives fully assembled from
the backend; for this pass it comes from a static mock module in the client.

Two views over the same itinerary:

- **List view** — hero image, title, subtitle, author, description, then collapsible sections. Each
  section holds numbered stops with a thumbnail, title, time label, an optional description line,
  and a save button.
- **Map view** — the same stops as numbered pins, with a filter pill per section.

The one interactive element on a stop is **save**, covered below.

## Data shape

Static mock for now, shaped so the swap to a GraphQL fragment is mechanical.

```ts
interface ItineraryStop {
  id: string
  title: string
  timeLabel: string // "6am-4pm", "12pm - 1pm"
  description?: string // freeform, may hold emoji ("🥂 🧀") or a short caption
  imageUrl: string
  coordinates: { lat: number; lng: number }
  order: number // the number rendered in the pin and the list bullet
  entity: {
    __typename: "Show" | "Partner"
    id: string
    slug: string
    isFollowed: boolean
  }
}

interface ItinerarySection {
  title: string // "Day 1 — Easing in" or "Mellow morning"
  stops: ItineraryStop[]
}

interface Itinerary {
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

Two decisions worth stating plainly:

**Sections are freeform, not an enum.** Early drafts had a `TimeOfDay` enum plus a `dayNumber`.
The designs use both schemes — one frame groups by time of day ("Mellow morning", "Chill
afternoon"), another groups by day with editorial subtitles ("Day 1 — Easing in", "Day 2 — London
Frieze"). The backend owns the grouping and the naming; the client renders whatever titles it gets
and derives the map filter pills from the same list. This removes a class of change where a new
editorial grouping needs a client release.

**`description` is a single string, not a tag array.** The designs show emoji clusters under the
time label. Modelling them as `string[]` would force the backend into a tag vocabulary it may not
have. A plain string renders emoji and captions alike.

## Screens and components

New directory `src/app/Scenes/CityGuide/Screens/Itinerary/`:

- `ItineraryScreen.tsx` — owns the itinerary, holds the list/map toggle state, renders one or the
  other. One route, not two, so the toggle is a local state flip rather than a navigation push.
  This matches the floating "Map" pill in the design, which reads as a mode switch, not a new page.
- `Components/ItineraryHeader.tsx` — hero image, title, subtitle, author, description.
- `Components/ItinerarySection.tsx` — collapsible section wrapper with the title and chevron.
- `Components/ItineraryStopRow.tsx` — numbered bullet, thumbnail, title, time label, description,
  save button.
- `Components/ItineraryMapView.tsx` — pins and filter pills.
- `utils/mockItineraries.ts` — the static data, typed against the interfaces above.

## Saving a stop

The save button on a stop row is the `+` in the designs. Pressing it follows the show. The
behaviour:

1. On press, fire the follow mutation with an optimistic response.
2. The `+` icon animates into a tick. Reanimated drives it, per the project's rule about keeping
   animations off the JS thread; a scale-and-fade crossfade between the two icons.
3. A toast confirms the save, via `useToast` from `app/Components/Toast/toastHook`.
4. Pressing again unfollows, reverses the animation, and toasts the removal.

The mutation itself already exists in the codebase. `CityGuideEvent.tsx:32-67` runs
`followShow(input: { partnerShowID, unfollow })` through `useMutation` with an optimistic response
and a store updater. `src/app/Components/ShowFollowButton.tsx` runs the same mutation via
`commitMutation`. For galleries, `src/app/utils/mutations/useFollowProfile.ts` wraps
`followProfile(input: { profileID, unfollow })` and already returns `{ followProfile, isInFlight }`.

Rather than adding a third copy of the show-follow logic, this spec extracts the shared piece:

- `src/app/utils/mutations/useFollowShow.ts` — mirrors the existing `useFollowProfile` hook,
  wrapping the `followShow` mutation with the optimistic response and updater currently inlined in
  `CityGuideEvent.tsx`.
- `src/app/Components/SaveButton/` — the animated `+` → tick button, taking `isSaved`, `onPress`,
  and `isSaving`. Kept in shared `Components/` rather than inside the City Guide scene, since the
  browse and save sub-projects both need it and AGENTS.md forbids cross-scene imports.

`CityGuideEvent.tsx` then moves onto `useFollowShow`, deleting its inline mutation. That is a
targeted improvement to code this work touches, not a general refactor.

Mock itinerary stops are not Relay records, so the mutation has nothing real to write to. For this
pass `ItineraryStopRow` takes `isSaved` and `onSave` as props, and `ItineraryScreen` holds saved
state in a local `Set<string>` of stop ids. The animation and the toast run off that local state,
so the interaction is fully demonstrable. `useFollowShow` is built and tested in this pass but
consumed only by `CityGuideEvent.tsx`, which has real Relay records. When the backend lands, the
mock module becomes a fragment, `ItineraryScreen` drops its local set, and `ItineraryStopRow` reads
`entity.isFollowed` with `useFollowShow` behind it.

## Reuse

Per the constraint to prefer what exists over matching Figma exactly:

- `Flex`, `Box`, `Text`, `Button`, `Screen` from `@artsy/palette-mobile` throughout, with the
  padding the surrounding City Guide components already use.
- Map pins extend `CityGuideMapPins.tsx` instead of a second map implementation.
- Section titles reuse `app/Components/SectionTitle` if its shape fits the collapsible header;
  otherwise the chevron pattern from `app/Components/Icons/ChevronIcon`.
- `app/utils/hooks/withSuspense` for the loading and error fallbacks, as the neighbouring City
  Guide screens do.

## Navigation

A new route `/city-guide/:citySlug/itinerary/:itineraryId`, registered in
`src/app/Navigation/routes.tsx` beside the existing `/city-guide` entry. Entry point is the
existing `CityGuideCuratedLists.tsx` rows, which currently render but navigate nowhere. Deep
linking follows the same rules as the other City Guide routes, including the Android manifest
entry.

## Testing

Following `docs/testing.md` and the existing `Components/__tests__/` files:

- `ItineraryStopRow` — renders title, time label, description; save press calls the follow handler;
  the tick shows once saved.
- `ItinerarySection` — collapses and expands; renders each stop in order.
- `ItineraryScreen` — toggles between list and map; renders every section.
- `useFollowShow` — follows, unfollows, and applies the optimistic response.

The mock-data components added earlier (`CityGuideCityPicker`, `CityGuideCuratedLists`,
`CityGuideMetaData`, `CityGuideEvents`) carry `// @TODO: Implement test` comments. Adding those is
out of scope here except for `CityGuideCuratedLists`, which this work changes by giving its rows a
destination.

## Out of scope

- Any create or edit flow for itineraries. Users cannot author them.
- The backend schema. The mock module is deliberately a single file so that the GraphQL design
  session has a concrete target to match.
- Saving galleries. `useFollowProfile` already covers it; wiring it into the browse surfaces
  belongs to the save sub-project.
- Multi-day trip planning, date pickers, and scheduling.

---

# Part 2 — Implementation Plan

_Verbatim from `docs/superpowers/plans/2026-08-26-city-guide-itineraries.md`._

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add read-only viewing of curated city itineraries to the City Guide, with a save action on each stop.

**Architecture:** A new `Screens/Itinerary/` directory under the existing City Guide scene. One route renders an `ItineraryScreen` that holds a list/map toggle in local state. Data comes from a typed static mock module shaped so the later swap to a Relay fragment is mechanical. Two pieces get extracted to shared locations because the sibling sub-projects need them: a `useFollowShow` mutation hook and an animated `SaveButton`.

**Tech Stack:** React Native, TypeScript (strict), Relay, `@artsy/palette-mobile`, `@artsy/icons/native`, `react-native-reanimated`, `@rnmapbox/maps`, Jest + `@testing-library/react-native`.

## Global Constraints

- Spec: `docs/superpowers/specs/2026-08-26-city-guide-itineraries-design.md`.
- Reuse existing components, spacing, and patterns over matching Figma pixel values. The designs are not final.
- No `index.ts(x)` files (`docs/best_practices.md`).
- Do not import components, hooks, or utils directly from another Scene. Shared code goes in `src/app/Components/` or `src/app/utils/`.
- Components and component folders are PascalCase; `hooks`, `utils`, `mutations` folders are camelCase.
- Tests live in a sibling `__tests__/` folder and end in `.tests.ts(x)`.
- Never use React Native's built-in `Keyboard` API. Not relevant here, but the ESLint rule is active.
- `navigate` from `app/system/navigation/navigate` is behind a `no-restricted-imports` lint rule; prefer `RouterLink` or add the same `// eslint-disable-next-line no-restricted-imports` comment the neighbouring City Guide files use.
- Reanimated is globally mocked in tests (`src/setupJest.tsx:322` maps `react-native-reanimated` to `react-native-reanimated/mock`). Assert on rendered output, never on animation values.
- Before every commit: `yarn tsc`, `yarn test --findRelatedTests <changed-files>`, `yarn lint --fix <changed-files>`.
- Run `yarn relay` after any change to a `graphql` tagged template.
- Mock `entity.id` values are readable strings, not base64. Real Relay node ids are base64, but the `detect-secrets` pre-commit hook flags base64 strings of that length as high-entropy secrets and blocks the commit. Keep mock ids readable. If a base64 id is genuinely needed later, mark it with an inline `pragma: allowlist secret` comment.
- The spec lists `app/utils/hooks/withSuspense` under reuse. It is deliberately unused in this plan: every screen here reads synchronous mock data, so there is no suspending boundary and no error to fall back from. It becomes relevant in the task that swaps the mock module for a Relay query, which belongs to a later pass.

---

### Task 1: Itinerary types and mock data

**Files:**

- Create: `src/app/Scenes/CityGuide/Screens/Itinerary/utils/itineraryTypes.ts`
- Create: `src/app/Scenes/CityGuide/Screens/Itinerary/utils/mockItineraries.ts`

**Interfaces:**

- Consumes: nothing.
- Produces: `Itinerary`, `ItinerarySection`, `ItineraryStop` types; `MOCK_ITINERARIES: Itinerary[]`; `getMockItinerary(id: string): Itinerary | undefined`.

This task has no test of its own — it is pure data with no behaviour. Task 4 onwards exercises it. The one thing worth verifying is that it type-checks.

- [ ] **Step 1: Write the types**

Create `src/app/Scenes/CityGuide/Screens/Itinerary/utils/itineraryTypes.ts`:

```ts
export interface ItineraryStopEntity {
  __typename: "Show" | "Partner"
  id: string
  slug: string
  isFollowed: boolean
}

export interface ItineraryStop {
  id: string
  title: string
  /** Display string, formatted by the backend. e.g. "6am-4pm", "12pm - 1pm" */
  timeLabel: string
  /** Freeform. May hold emoji ("🥂 🧀") or a short caption. */
  description?: string
  imageUrl: string
  coordinates: { lat: number; lng: number }
  /** The number rendered in the list bullet and the map pin. */
  order: number
  entity: ItineraryStopEntity
}

export interface ItinerarySection {
  /** Backend owns the grouping and naming. e.g. "Day 1 — Easing in", "Mellow morning" */
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

- [ ] **Step 2: Write the mock data**

Create `src/app/Scenes/CityGuide/Screens/Itinerary/utils/mockItineraries.ts`. Coordinates are real central London points so the map task has something plausible to render.

```ts
import { Itinerary } from "app/Scenes/CityGuide/Screens/Itinerary/utils/itineraryTypes"

// TODO: Replace with data from the API once the itinerary schema lands.
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
        title: "Day 1 — Easing in",
        stops: [
          {
            id: "stop-1",
            title: "Coffee at London Cafe",
            timeLabel: "10am",
            imageUrl: "https://picsum.photos/id/1060/200/200.jpg",
            coordinates: { lat: 51.5136, lng: -0.1365 },
            order: 1,
            entity: {
              __typename: "Partner",
              id: "itinerary-partner-london-cafe",
              slug: "london-cafe",
              isFollowed: false,
            },
          },
          {
            id: "stop-2",
            title: "Museum",
            timeLabel: "11am-4pm",
            description: "🥂 🧀",
            imageUrl: "https://picsum.photos/id/1040/200/200.jpg",
            coordinates: { lat: 51.5194, lng: -0.127 },
            order: 2,
            entity: {
              __typename: "Show",
              id: "itinerary-show-museum-show",
              slug: "museum-show",
              isFollowed: false,
            },
          },
          {
            id: "stop-3",
            title: "Gallery Show",
            timeLabel: "3pm-4pm",
            imageUrl: "https://picsum.photos/id/1033/200/200.jpg",
            coordinates: { lat: 51.5074, lng: -0.1278 },
            order: 3,
            entity: {
              __typename: "Show",
              id: "itinerary-show-gallery-show",
              slug: "gallery-show",
              isFollowed: false,
            },
          },
        ],
      },
      {
        title: "Day 2 — London Frieze",
        stops: [
          {
            id: "stop-4",
            title: "Frieze London",
            timeLabel: "12pm - 1pm",
            description: "🎤",
            imageUrl: "https://picsum.photos/id/1084/200/200.jpg",
            coordinates: { lat: 51.5122, lng: -0.1571 },
            order: 4,
            entity: {
              __typename: "Show",
              id: "itinerary-show-frieze-london",
              slug: "frieze-london",
              isFollowed: false,
            },
          },
          {
            id: "stop-5",
            title: "Evening Reception",
            timeLabel: "6pm-9pm",
            description: "🥂 🧀",
            imageUrl: "https://picsum.photos/id/1074/200/200.jpg",
            coordinates: { lat: 51.5033, lng: -0.1195 },
            order: 5,
            entity: {
              __typename: "Partner",
              id: "itinerary-partner-evening-reception",
              slug: "evening-reception",
              isFollowed: false,
            },
          },
        ],
      },
    ],
  },
]

export const getMockItinerary = (id: string): Itinerary | undefined =>
  MOCK_ITINERARIES.find((itinerary) => itinerary.id === id)
```

- [ ] **Step 3: Type-check**

Run: `yarn tsc`
Expected: PASS, no new errors.

- [ ] **Step 4: Lint**

Run: `yarn lint --fix src/app/Scenes/CityGuide/Screens/Itinerary/utils/`
Expected: clean.

- [ ] **Step 5: Commit**

```bash
git add src/app/Scenes/CityGuide/Screens/Itinerary/utils/
git commit -m "feat(city-guide): add itinerary types and mock data"
```

---

### Task 2: Shared animated SaveButton

**Files:**

- Create: `src/app/Components/SaveButton/SaveButton.tsx`
- Test: `src/app/Components/SaveButton/__tests__/SaveButton.tests.tsx`

**Interfaces:**

- Consumes: nothing.
- Produces: `SaveButton: React.FC<SaveButtonProps>` where
  `SaveButtonProps = { isSaved: boolean; onPress: () => void; isSaving?: boolean; accessibilityLabel?: string }`.
  Renders a node with `testID="save-button"`; the plus icon carries `testID="save-button-add-icon"` and the tick `testID="save-button-check-icon"`.

The button renders exactly one icon at a time and pops it with a spring on change. Rendering one icon rather than crossfading two keeps the assertion honest under the Reanimated jest mock, where opacity is not observable.

- [ ] **Step 1: Write the failing test**

Create `src/app/Components/SaveButton/__tests__/SaveButton.tests.tsx`:

```tsx
import { fireEvent, screen } from "@testing-library/react-native"
import { SaveButton } from "app/Components/SaveButton/SaveButton"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

describe("SaveButton", () => {
  it("renders the add icon when not saved", () => {
    renderWithWrappers(<SaveButton isSaved={false} onPress={jest.fn()} />)

    expect(screen.getByTestId("save-button-add-icon")).toBeTruthy()
    expect(screen.queryByTestId("save-button-check-icon")).toBeNull()
  })

  it("renders the check icon when saved", () => {
    renderWithWrappers(<SaveButton isSaved onPress={jest.fn()} />)

    expect(screen.getByTestId("save-button-check-icon")).toBeTruthy()
    expect(screen.queryByTestId("save-button-add-icon")).toBeNull()
  })

  it("calls onPress when tapped", () => {
    const onPress = jest.fn()
    renderWithWrappers(<SaveButton isSaved={false} onPress={onPress} />)

    fireEvent.press(screen.getByTestId("save-button"))

    expect(onPress).toHaveBeenCalledTimes(1)
  })

  it("does not call onPress while saving", () => {
    const onPress = jest.fn()
    renderWithWrappers(<SaveButton isSaved={false} onPress={onPress} isSaving />)

    fireEvent.press(screen.getByTestId("save-button"))

    expect(onPress).not.toHaveBeenCalled()
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `yarn test src/app/Components/SaveButton/__tests__/SaveButton.tests.tsx`
Expected: FAIL — cannot resolve `app/Components/SaveButton/SaveButton`.

- [ ] **Step 3: Write the implementation**

Create `src/app/Components/SaveButton/SaveButton.tsx`. The `.get()` / `.set()` shared-value style matches `src/app/Components/Disappearable.tsx`.

```tsx
import { AddIcon, CheckmarkIcon } from "@artsy/icons/native"
import { Flex } from "@artsy/palette-mobile"
import { useEffect } from "react"
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

export interface SaveButtonProps {
  isSaved: boolean
  onPress: () => void
  isSaving?: boolean
  accessibilityLabel?: string
}

export const SaveButton: React.FC<SaveButtonProps> = ({
  isSaved,
  onPress,
  isSaving = false,
  accessibilityLabel,
}) => {
  const scale = useSharedValue(1)

  useEffect(() => {
    // Pop the icon whenever the saved state flips, in both directions.
    scale.set(() =>
      withSequence(withTiming(0.6, { duration: 80 }), withSpring(1, { damping: 6, stiffness: 220 }))
    )
  }, [isSaved])

  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.get() }] }))

  return (
    <TouchableOpacity
      testID="save-button"
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
            <CheckmarkIcon testID="save-button-check-icon" width={ICON_SIZE} height={ICON_SIZE} />
          ) : (
            <AddIcon testID="save-button-add-icon" width={ICON_SIZE} height={ICON_SIZE} />
          )}
        </Animated.View>
      </Flex>
    </TouchableOpacity>
  )
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `yarn test src/app/Components/SaveButton/__tests__/SaveButton.tests.tsx`
Expected: PASS, 4 tests.

If `AddIcon` or `CheckmarkIcon` reject a `testID` prop under strict mode, wrap each in a `<Flex testID=...>` and keep the assertions unchanged.

- [ ] **Step 5: Type-check and lint**

Run: `yarn tsc && yarn lint --fix src/app/Components/SaveButton/`
Expected: both clean.

- [ ] **Step 6: Commit**

```bash
git add src/app/Components/SaveButton/
git commit -m "feat: add shared animated SaveButton component"
```

---

### Task 3: useFollowShow hook, and migrate CityGuideEvent onto it

**Files:**

- Create: `src/app/utils/mutations/useFollowShow.ts`
- Test: `src/app/utils/mutations/__tests__/useFollowShow.tests.tsx`
- Modify: `src/app/Scenes/CityGuide/Components/CityGuideEvent.tsx` (replace lines 1-67 mutation wiring and delete the `eventMutation` block at lines 109-119)

**Interfaces:**

- Consumes: nothing.
- Produces: `useFollowShow({ id, internalID, isFollowed, onCompleted, onError }: FollowShowOptions) => { followShow: () => void; isInFlight: boolean }`, where `FollowShowOptions = { id: string; internalID: string; isFollowed: boolean | null; onCompleted?: (isFollowed: boolean) => void; onError?: () => void }`. `id` is the Relay node id, `internalID` is the show's `internalID` passed to the mutation as `partnerShowID`.

This mirrors `src/app/utils/mutations/useFollowProfile.ts` exactly, so a reader who knows one knows the other.

- [ ] **Step 1: Write the failing test**

Create `src/app/utils/mutations/__tests__/useFollowShow.tests.tsx`:

```tsx
import { screen, fireEvent } from "@testing-library/react-native"
import { Text, TouchableOpacity } from "react-native"
import { useFollowShow } from "app/utils/mutations/useFollowShow"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"

const TestComponent: React.FC<{ isFollowed: boolean }> = ({ isFollowed }) => {
  const { followShow, isInFlight } = useFollowShow({
    id: "relay-node-id",
    internalID: "internal-id",
    isFollowed,
  })

  return (
    <TouchableOpacity testID="follow" onPress={followShow}>
      <Text>{isInFlight ? "in flight" : "idle"}</Text>
    </TouchableOpacity>
  )
}

describe("useFollowShow", () => {
  const { renderWithRelay } = setupTestWrapper({ Component: TestComponent })

  it("sends a follow mutation with unfollow false when not followed", () => {
    const { env } = renderWithRelay({}, { isFollowed: false })

    fireEvent.press(screen.getByTestId("follow"))

    const operation = env.mock.getMostRecentOperation()
    expect(operation.request.variables).toEqual({
      input: { partnerShowID: "internal-id", unfollow: false },
    })
  })

  it("sends unfollow true when already followed", () => {
    const { env } = renderWithRelay({}, { isFollowed: true })

    fireEvent.press(screen.getByTestId("follow"))

    const operation = env.mock.getMostRecentOperation()
    expect(operation.request.variables).toEqual({
      input: { partnerShowID: "internal-id", unfollow: true },
    })
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `yarn test src/app/utils/mutations/__tests__/useFollowShow.tests.tsx`
Expected: FAIL — cannot resolve `app/utils/mutations/useFollowShow`.

- [ ] **Step 3: Write the hook**

Create `src/app/utils/mutations/useFollowShow.ts`:

```ts
import { graphql, useMutation } from "react-relay"

export interface FollowShowOptions {
  /** Relay node id, used for the optimistic store update. */
  id: string
  /** The show's internalID, sent to the mutation as partnerShowID. */
  internalID: string
  isFollowed: boolean | null
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
        const show = store.get(id)
        show?.setValue(nextFollowedState, "isFollowed")
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

- [ ] **Step 4: Compile the Relay artifact**

Run: `yarn relay`
Expected: generates `src/__generated__/useFollowShowMutation.graphql.ts`.

- [ ] **Step 5: Run the test to verify it passes**

Run: `yarn test src/app/utils/mutations/__tests__/useFollowShow.tests.tsx`
Expected: PASS, 2 tests.

- [ ] **Step 6: Commit the hook**

```bash
git add src/app/utils/mutations/useFollowShow.ts src/app/utils/mutations/__tests__/useFollowShow.tests.tsx src/__generated__/useFollowShowMutation.graphql.ts
git commit -m "feat: add useFollowShow mutation hook"
```

- [ ] **Step 7: Migrate CityGuideEvent onto the hook**

`CityGuideEvent.tsx` currently reads the show's followed state as `is_followed` (an aliased field on the legacy `Show` type in `app/Scenes/CityGuide/utils/types`), keeps its own `isFollowedSaving` state, and writes `is_followed` in its updater. The hook writes `isFollowed`, so keep the component's own updater behaviour by passing the legacy field name through `onCompleted` rather than changing the fragment.

Replace the imports, the mutation state, and `handleSaveChange` in `src/app/Scenes/CityGuide/Components/CityGuideEvent.tsx`:

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

const TEXT_CONTAINER_WIDTH = 200

interface Props {
  event: Show
}

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
  // ...render unchanged, except `loading={isInFlight}` on the Button
}
```

Then delete the `eventMutation` `graphql` block (previously lines 109-119) and the now-unused `CityGuideEventMutation` import, `useState` import, and `useMutation`/`graphql` imports from `react-relay`.

- [ ] **Step 8: Recompile Relay and run the existing tests**

Run: `yarn relay && yarn test src/app/Scenes/CityGuide/Components/__tests__/CityGuideEvent.tests.tsx`
Expected: PASS — the existing two tests still pass. The deleted `CityGuideEventMutation.graphql.ts` artifact should disappear from `src/__generated__/`.

The hook's `optimisticUpdater` writes the canonical `isFollowed` field, while this component reads the aliased `is_followed`. Relay aliases resolve to the same underlying field on the record, so a single `setValue(nextFollowedState, "isFollowed")` updates both readers. Verify this in the simulator: tap Save on a City Guide event and confirm the button flips to "Saved" immediately, before the network settles.

If it does not flip, the alias is not resolving. Fix it in the hook rather than in the component, by writing both keys in `optimisticUpdater`:

```ts
optimisticUpdater: (store) => {
  const show = store.get(id)
  show?.setValue(nextFollowedState, "isFollowed")
  show?.setValue(nextFollowedState, "is_followed")
},
```

Note which branch you took in the commit message.

- [ ] **Step 9: Type-check, lint, commit**

```bash
yarn tsc
yarn lint --fix src/app/Scenes/CityGuide/Components/CityGuideEvent.tsx
git add -A src/app/Scenes/CityGuide/Components/CityGuideEvent.tsx src/__generated__/
git commit -m "refactor(city-guide): move CityGuideEvent onto useFollowShow"
```

---

### Task 4: ItineraryStopRow

**Files:**

- Create: `src/app/Scenes/CityGuide/Screens/Itinerary/Components/ItineraryStopRow.tsx`
- Test: `src/app/Scenes/CityGuide/Screens/Itinerary/Components/__tests__/ItineraryStopRow.tests.tsx`

**Interfaces:**

- Consumes: `ItineraryStop` from Task 1; `SaveButton` from Task 2.
- Produces: `ItineraryStopRow: React.FC<{ stop: ItineraryStop; isSaved: boolean; onSave: () => void }>`.

- [ ] **Step 1: Write the failing test**

Create `src/app/Scenes/CityGuide/Screens/Itinerary/Components/__tests__/ItineraryStopRow.tests.tsx`:

```tsx
import { fireEvent, screen } from "@testing-library/react-native"
import { ItineraryStopRow } from "app/Scenes/CityGuide/Screens/Itinerary/Components/ItineraryStopRow"
import { ItineraryStop } from "app/Scenes/CityGuide/Screens/Itinerary/utils/itineraryTypes"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

const stop: ItineraryStop = {
  id: "stop-2",
  title: "Museum",
  timeLabel: "11am-4pm",
  description: "🥂 🧀",
  imageUrl: "https://example.com/image.jpg",
  coordinates: { lat: 51.5194, lng: -0.127 },
  order: 2,
  entity: {
    __typename: "Show",
    id: "itinerary-show-museum-show",
    slug: "museum-show",
    isFollowed: false,
  },
}

describe("ItineraryStopRow", () => {
  it("renders the order, title, time label and description", () => {
    renderWithWrappers(<ItineraryStopRow stop={stop} isSaved={false} onSave={jest.fn()} />)

    expect(screen.getByText("2")).toBeTruthy()
    expect(screen.getByText("Museum")).toBeTruthy()
    expect(screen.getByText("11am-4pm")).toBeTruthy()
    expect(screen.getByText("🥂 🧀")).toBeTruthy()
  })

  it("omits the description when the stop has none", () => {
    const { description, ...withoutDescription } = stop
    renderWithWrappers(
      <ItineraryStopRow stop={withoutDescription} isSaved={false} onSave={jest.fn()} />
    )

    expect(screen.queryByText("🥂 🧀")).toBeNull()
  })

  it("calls onSave when the save button is pressed", () => {
    const onSave = jest.fn()
    renderWithWrappers(<ItineraryStopRow stop={stop} isSaved={false} onSave={onSave} />)

    fireEvent.press(screen.getByTestId("save-button"))

    expect(onSave).toHaveBeenCalledTimes(1)
  })

  it("shows the check icon once saved", () => {
    renderWithWrappers(<ItineraryStopRow stop={stop} isSaved onSave={jest.fn()} />)

    expect(screen.getByTestId("save-button-check-icon")).toBeTruthy()
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `yarn test src/app/Scenes/CityGuide/Screens/Itinerary/Components/__tests__/ItineraryStopRow.tests.tsx`
Expected: FAIL — cannot resolve `ItineraryStopRow`.

- [ ] **Step 3: Write the implementation**

Create `src/app/Scenes/CityGuide/Screens/Itinerary/Components/ItineraryStopRow.tsx`. The `RNImage` usage and `IMAGE_SIZE` constant follow `CityGuideCuratedLists.tsx` and `CityGuideEvents.tsx`, which use plain `react-native` `Image` while the data is still mock.

```tsx
import { Flex, Text } from "@artsy/palette-mobile"
import { SaveButton } from "app/Components/SaveButton/SaveButton"
import { ItineraryStop } from "app/Scenes/CityGuide/Screens/Itinerary/utils/itineraryTypes"
// TODO: Replace with Image from @artsy/palette-mobile once we get the data from the API
import { Image as RNImage } from "react-native"

const IMAGE_SIZE = 60
const BULLET_SIZE = 16

interface Props {
  stop: ItineraryStop
  isSaved: boolean
  onSave: () => void
}

export const ItineraryStopRow: React.FC<Props> = ({ stop, isSaved, onSave }) => {
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
          {stop.order}
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
          {stop.timeLabel}
        </Text>
        {!!stop.description && <Text variant="xs">{stop.description}</Text>}
      </Flex>

      <SaveButton
        isSaved={isSaved}
        onPress={onSave}
        accessibilityLabel={isSaved ? `Unsave ${stop.title}` : `Save ${stop.title}`}
      />
    </Flex>
  )
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `yarn test src/app/Scenes/CityGuide/Screens/Itinerary/Components/__tests__/ItineraryStopRow.tests.tsx`
Expected: PASS, 4 tests.

- [ ] **Step 5: Type-check, lint, commit**

```bash
yarn tsc
yarn lint --fix src/app/Scenes/CityGuide/Screens/Itinerary/Components/
git add src/app/Scenes/CityGuide/Screens/Itinerary/Components/
git commit -m "feat(city-guide): add ItineraryStopRow"
```

---

### Task 5: ItinerarySectionRow, collapsible

**Files:**

- Create: `src/app/Scenes/CityGuide/Screens/Itinerary/Components/ItinerarySectionRow.tsx`
- Test: `src/app/Scenes/CityGuide/Screens/Itinerary/Components/__tests__/ItinerarySectionRow.tests.tsx`

**Interfaces:**

- Consumes: `ItinerarySection` from Task 1; `ItineraryStopRow` from Task 4.
- Produces: `ItinerarySectionRow: React.FC<{ section: ItinerarySection; savedStopIds: Set<string>; onSaveStop: (stop: ItineraryStop) => void }>`.

Named `ItinerarySectionRow` rather than `ItinerarySection` so the component does not collide with the type of the same name from Task 1.

Sections start expanded, matching the design where the first section's stops are visible on load.

- [ ] **Step 1: Write the failing test**

Create `src/app/Scenes/CityGuide/Screens/Itinerary/Components/__tests__/ItinerarySectionRow.tests.tsx`:

```tsx
import { fireEvent, screen } from "@testing-library/react-native"
import { ItinerarySectionRow } from "app/Scenes/CityGuide/Screens/Itinerary/Components/ItinerarySectionRow"
import { ItinerarySection } from "app/Scenes/CityGuide/Screens/Itinerary/utils/itineraryTypes"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

const section: ItinerarySection = {
  title: "Day 1 — Easing in",
  stops: [
    {
      id: "stop-1",
      title: "Coffee at London Cafe",
      timeLabel: "10am",
      imageUrl: "https://example.com/a.jpg",
      coordinates: { lat: 51.5136, lng: -0.1365 },
      order: 1,
      entity: { __typename: "Partner", id: "a", slug: "london-cafe", isFollowed: false },
    },
    {
      id: "stop-2",
      title: "Museum",
      timeLabel: "11am-4pm",
      imageUrl: "https://example.com/b.jpg",
      coordinates: { lat: 51.5194, lng: -0.127 },
      order: 2,
      entity: { __typename: "Show", id: "b", slug: "museum-show", isFollowed: false },
    },
  ],
}

describe("ItinerarySectionRow", () => {
  it("renders the section title and its stops expanded by default", () => {
    renderWithWrappers(
      <ItinerarySectionRow section={section} savedStopIds={new Set()} onSaveStop={jest.fn()} />
    )

    expect(screen.getByText("Day 1 — Easing in")).toBeTruthy()
    expect(screen.getByText("Coffee at London Cafe")).toBeTruthy()
    expect(screen.getByText("Museum")).toBeTruthy()
  })

  it("hides the stops when the header is tapped", () => {
    renderWithWrappers(
      <ItinerarySectionRow section={section} savedStopIds={new Set()} onSaveStop={jest.fn()} />
    )

    fireEvent.press(screen.getByTestId("itinerary-section-header"))

    expect(screen.queryByText("Coffee at London Cafe")).toBeNull()
    expect(screen.getByText("Day 1 — Easing in")).toBeTruthy()
  })

  it("marks a stop as saved when its id is in savedStopIds", () => {
    renderWithWrappers(
      <ItinerarySectionRow
        section={section}
        savedStopIds={new Set(["stop-1"])}
        onSaveStop={jest.fn()}
      />
    )

    expect(screen.getAllByTestId("save-button-check-icon")).toHaveLength(1)
    expect(screen.getAllByTestId("save-button-add-icon")).toHaveLength(1)
  })

  it("passes the tapped stop to onSaveStop", () => {
    const onSaveStop = jest.fn()
    renderWithWrappers(
      <ItinerarySectionRow section={section} savedStopIds={new Set()} onSaveStop={onSaveStop} />
    )

    fireEvent.press(screen.getAllByTestId("save-button")[0])

    expect(onSaveStop).toHaveBeenCalledWith(section.stops[0])
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `yarn test src/app/Scenes/CityGuide/Screens/Itinerary/Components/__tests__/ItinerarySectionRow.tests.tsx`
Expected: FAIL — cannot resolve `ItinerarySectionRow`.

- [ ] **Step 3: Write the implementation**

`SectionTitle` is not used here: it title-cases its input, which would mangle "Day 1 — Easing in", and its right-hand chevron always points right rather than flipping with the collapsed state. The chevron icons come from the same `@artsy/icons/native` package `SectionTitle` itself uses.

Create `src/app/Scenes/CityGuide/Screens/Itinerary/Components/ItinerarySectionRow.tsx`:

```tsx
import { ChevronDownIcon, ChevronUpIcon } from "@artsy/icons/native"
import { Flex, Join, Spacer, Text } from "@artsy/palette-mobile"
import { ItineraryStopRow } from "app/Scenes/CityGuide/Screens/Itinerary/Components/ItineraryStopRow"
import {
  ItinerarySection,
  ItineraryStop,
} from "app/Scenes/CityGuide/Screens/Itinerary/utils/itineraryTypes"
import { useState } from "react"
import { TouchableOpacity } from "react-native"

interface Props {
  section: ItinerarySection
  savedStopIds: Set<string>
  onSaveStop: (stop: ItineraryStop) => void
}

export const ItinerarySectionRow: React.FC<Props> = ({ section, savedStopIds, onSaveStop }) => {
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
          {section.stops.map((stop) => (
            <ItineraryStopRow
              key={stop.id}
              stop={stop}
              isSaved={savedStopIds.has(stop.id)}
              onSave={() => onSaveStop(stop)}
            />
          ))}
        </Join>
      )}
    </Flex>
  )
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `yarn test src/app/Scenes/CityGuide/Screens/Itinerary/Components/__tests__/ItinerarySectionRow.tests.tsx`
Expected: PASS, 4 tests.

If `ChevronDownIcon` / `ChevronUpIcon` are not exported from `@artsy/icons/native`, check the available names with `grep -o "Chevron[A-Za-z]*Icon" node_modules/@artsy/icons/native.d.ts | sort -u` and use the closest pair, rotating one icon rather than inventing an export.

- [ ] **Step 5: Type-check, lint, commit**

```bash
yarn tsc
yarn lint --fix src/app/Scenes/CityGuide/Screens/Itinerary/Components/
git add src/app/Scenes/CityGuide/Screens/Itinerary/Components/
git commit -m "feat(city-guide): add collapsible ItinerarySectionRow"
```

---

### Task 6: ItineraryHeader

**Files:**

- Create: `src/app/Scenes/CityGuide/Screens/Itinerary/Components/ItineraryHeader.tsx`
- Test: `src/app/Scenes/CityGuide/Screens/Itinerary/Components/__tests__/ItineraryHeader.tests.tsx`

**Interfaces:**

- Consumes: `Itinerary` from Task 1.
- Produces: `ItineraryHeader: React.FC<{ itinerary: Itinerary }>`.

The "Add Full List" button in the design bulk-follows every stop. That belongs to the save sub-project, which owns bulk behaviour and its error states, so the header does not render it. Leaving it out is deliberate, not an oversight.

- [ ] **Step 1: Write the failing test**

Create `src/app/Scenes/CityGuide/Screens/Itinerary/Components/__tests__/ItineraryHeader.tests.tsx`:

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
    expect(
      screen.getByText(
        "Our list of recommendations for the must sees to gallery and museum visits and the hidden gems in between."
      )
    ).toBeTruthy()
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `yarn test src/app/Scenes/CityGuide/Screens/Itinerary/Components/__tests__/ItineraryHeader.tests.tsx`
Expected: FAIL — cannot resolve `ItineraryHeader`.

- [ ] **Step 3: Write the implementation**

Create `src/app/Scenes/CityGuide/Screens/Itinerary/Components/ItineraryHeader.tsx`:

```tsx
import { Flex, Text } from "@artsy/palette-mobile"
import { Itinerary } from "app/Scenes/CityGuide/Screens/Itinerary/utils/itineraryTypes"
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

- [ ] **Step 4: Run the test to verify it passes**

Run: `yarn test src/app/Scenes/CityGuide/Screens/Itinerary/Components/__tests__/ItineraryHeader.tests.tsx`
Expected: PASS, 1 test.

- [ ] **Step 5: Type-check, lint, commit**

```bash
yarn tsc
yarn lint --fix src/app/Scenes/CityGuide/Screens/Itinerary/Components/
git add src/app/Scenes/CityGuide/Screens/Itinerary/Components/
git commit -m "feat(city-guide): add ItineraryHeader"
```

---

### Task 7: ItineraryScreen, list view with saved state and toast

**Files:**

- Create: `src/app/Scenes/CityGuide/Screens/Itinerary/ItineraryScreen.tsx`
- Test: `src/app/Scenes/CityGuide/Screens/Itinerary/__tests__/ItineraryScreen.tests.tsx`

**Interfaces:**

- Consumes: `getMockItinerary` from Task 1; `ItineraryHeader` from Task 6; `ItinerarySectionRow` from Task 5.
- Produces: `ItineraryScreen: React.FC<{ citySlug: string; itineraryId: string }>`. Task 9 adds the map toggle to this same component.

Saved state lives in a local `Set<string>` of stop ids, per the spec: mock stops are not Relay records, so there is nothing for a mutation to write to. `useFollowShow` from Task 3 is deliberately not called here.

- [ ] **Step 1: Write the failing test**

Create `src/app/Scenes/CityGuide/Screens/Itinerary/__tests__/ItineraryScreen.tests.tsx`:

```tsx
import { fireEvent, screen } from "@testing-library/react-native"
import { ItineraryScreen } from "app/Scenes/CityGuide/Screens/Itinerary/ItineraryScreen"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

const mockShowToast = jest.fn()
jest.mock("app/Components/Toast/toastHook", () => ({
  useToast: () => ({ show: mockShowToast, hide: jest.fn(), hideOldest: jest.fn() }),
}))

describe("ItineraryScreen", () => {
  beforeEach(() => {
    mockShowToast.mockClear()
  })

  it("renders the itinerary header and every section", () => {
    renderWithWrappers(
      <ItineraryScreen citySlug="london-united-kingdom" itineraryId="chill-vibes-only" />
    )

    expect(screen.getByText("Chill Vibes Only")).toBeTruthy()
    expect(screen.getByText("Day 1 — Easing in")).toBeTruthy()
    expect(screen.getByText("Day 2 — London Frieze")).toBeTruthy()
  })

  it("saves a stop and shows a confirmation toast", () => {
    renderWithWrappers(
      <ItineraryScreen citySlug="london-united-kingdom" itineraryId="chill-vibes-only" />
    )

    expect(screen.queryByTestId("save-button-check-icon")).toBeNull()

    fireEvent.press(screen.getAllByTestId("save-button")[0])

    expect(screen.getAllByTestId("save-button-check-icon")).toHaveLength(1)
    expect(mockShowToast).toHaveBeenCalledWith("Saved to your saves", "bottom")
  })

  it("unsaves a stop on a second press and toasts the removal", () => {
    renderWithWrappers(
      <ItineraryScreen citySlug="london-united-kingdom" itineraryId="chill-vibes-only" />
    )

    fireEvent.press(screen.getAllByTestId("save-button")[0])
    fireEvent.press(screen.getAllByTestId("save-button")[0])

    expect(screen.queryByTestId("save-button-check-icon")).toBeNull()
    expect(mockShowToast).toHaveBeenLastCalledWith("Removed from your saves", "bottom")
  })

  it("renders nothing recognisable for an unknown itinerary", () => {
    renderWithWrappers(<ItineraryScreen citySlug="london-united-kingdom" itineraryId="nope" />)

    expect(screen.queryByText("Chill Vibes Only")).toBeNull()
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `yarn test src/app/Scenes/CityGuide/Screens/Itinerary/__tests__/ItineraryScreen.tests.tsx`
Expected: FAIL — cannot resolve `ItineraryScreen`.

- [ ] **Step 3: Write the implementation**

Create `src/app/Scenes/CityGuide/Screens/Itinerary/ItineraryScreen.tsx`:

```tsx
import { Flex, Join, Screen, Spacer, Text } from "@artsy/palette-mobile"
import { useToast } from "app/Components/Toast/toastHook"
import { ItineraryHeader } from "app/Scenes/CityGuide/Screens/Itinerary/Components/ItineraryHeader"
import { ItinerarySectionRow } from "app/Scenes/CityGuide/Screens/Itinerary/Components/ItinerarySectionRow"
import { ItineraryStop } from "app/Scenes/CityGuide/Screens/Itinerary/utils/itineraryTypes"
import { getMockItinerary } from "app/Scenes/CityGuide/Screens/Itinerary/utils/mockItineraries"
import { goBack } from "app/system/navigation/navigate"
import { useState } from "react"

interface Props {
  citySlug: string
  itineraryId: string
}

export const ItineraryScreen: React.FC<Props> = ({ itineraryId }) => {
  // TODO: Replace with a Relay query once the itinerary schema lands.
  const itinerary = getMockItinerary(itineraryId)
  const toast = useToast()

  // Mock stops are not Relay records, so saved state is local for now. When the
  // backend lands this is replaced by entity.isFollowed plus useFollowShow.
  const [savedStopIds, setSavedStopIds] = useState<Set<string>>(new Set())

  const handleSaveStop = (stop: ItineraryStop) => {
    setSavedStopIds((current) => {
      const next = new Set(current)

      if (next.has(stop.id)) {
        next.delete(stop.id)
        toast.show("Removed from your saves", "bottom")
      } else {
        next.add(stop.id)
        toast.show("Saved to your saves", "bottom")
      }

      return next
    })
  }

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

  return (
    <Screen>
      <Screen.AnimatedHeader title={itinerary.title} onBack={goBack} hideTitle />

      <Screen.Body fullwidth>
        <Screen.ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
          <ItineraryHeader itinerary={itinerary} />

          <Flex px={2} pt={2}>
            <Join separator={<Spacer y={2} />}>
              {itinerary.sections.map((section) => (
                <ItinerarySectionRow
                  key={section.title}
                  section={section}
                  savedStopIds={savedStopIds}
                  onSaveStop={handleSaveStop}
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

The toast copy is deliberately the same in both directions of the toggle so the strings are easy to find and change once product confirms them.

- [ ] **Step 4: Run the test to verify it passes**

Run: `yarn test src/app/Scenes/CityGuide/Screens/Itinerary/__tests__/ItineraryScreen.tests.tsx`
Expected: PASS, 4 tests.

If `Screen.AnimatedHeader` requires props beyond those used in `CityGuideNew.tsx:25-37`, copy that call site's props exactly.

- [ ] **Step 5: Type-check, lint, commit**

```bash
yarn tsc
yarn lint --fix src/app/Scenes/CityGuide/Screens/Itinerary/
git add src/app/Scenes/CityGuide/Screens/Itinerary/
git commit -m "feat(city-guide): add ItineraryScreen list view"
```

---

### Task 8: Route registration and entry point

**Files:**

- Modify: `src/app/Navigation/routes.tsx` (import near line 85-98, route entry after the `/city-guide` block at lines 1128-1141)
- Modify: `src/app/Scenes/CityGuide/Components/CityGuideCuratedLists.tsx`
- Modify: `android/app/src/main/AndroidManifest.xml`
- Test: `src/app/Scenes/CityGuide/Components/__tests__/CityGuideCuratedLists.tests.tsx`

**Interfaces:**

- Consumes: `ItineraryScreen` from Task 7.
- Produces: route `/city-guide/:citySlug/itinerary/:itineraryId`, name `CityGuideItinerary`.

`CityGuideCuratedLists.tsx` currently renders three hardcoded rows that navigate nowhere. This task gives them a destination and gives the file its first test.

- [ ] **Step 1: Write the failing test**

Create `src/app/Scenes/CityGuide/Components/__tests__/CityGuideCuratedLists.tests.tsx`:

```tsx
import { fireEvent, screen } from "@testing-library/react-native"
import { CityGuideCuratedLists } from "app/Scenes/CityGuide/Components/CityGuideCuratedLists"
import { navigate } from "app/system/navigation/navigate"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

jest.mock("app/system/navigation/navigate", () => ({ navigate: jest.fn() }))

describe("CityGuideCuratedLists", () => {
  beforeEach(() => {
    ;(navigate as jest.Mock).mockClear()
  })

  it("renders a row per curated list", () => {
    renderWithWrappers(<CityGuideCuratedLists citySlug="london-united-kingdom" />)

    expect(screen.getByText("Chill Vibes Only")).toBeTruthy()
    expect(screen.getByText("By Casey Lesser")).toBeTruthy()
  })

  it("navigates to the itinerary when a row is tapped", () => {
    renderWithWrappers(<CityGuideCuratedLists citySlug="london-united-kingdom" />)

    fireEvent.press(screen.getByText("Chill Vibes Only"))

    expect(navigate).toHaveBeenCalledWith(
      "/city-guide/london-united-kingdom/itinerary/chill-vibes-only"
    )
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `yarn test src/app/Scenes/CityGuide/Components/__tests__/CityGuideCuratedLists.tests.tsx`
Expected: FAIL — `CityGuideCuratedLists` takes no props and the rows are not pressable.

- [ ] **Step 3: Rewrite CityGuideCuratedLists**

The mock rows gain an `itineraryId` matching `MOCK_ITINERARIES`, so the first row leads to a real itinerary. The other two point at ids with no mock data, which is exactly what the "no longer available" branch in Task 7 handles.

Replace `src/app/Scenes/CityGuide/Components/CityGuideCuratedLists.tsx`:

```tsx
import { Flex, Join, Spacer, Text } from "@artsy/palette-mobile"
// eslint-disable-next-line no-restricted-imports
import { navigate } from "app/system/navigation/navigate"
// TODO: Replace with Image from @artsy/palette-mobile once we get the data from the API
import { Image as RNImage, TouchableOpacity } from "react-native"

const IMAGE_SIZE = 80

const ListItem = ({ item, citySlug }: { item: (typeof data)[0]; citySlug: string }) => {
  return (
    <TouchableOpacity
      accessibilityRole="button"
      onPress={() => {
        navigate(`/city-guide/${citySlug}/itinerary/${item.itineraryId}`)
      }}
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
    </TouchableOpacity>
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

- [ ] **Step 4: Pass citySlug from CityGuideNew**

In `src/app/Scenes/CityGuide/CityGuideNew.tsx:51`, change `<CityGuideCuratedLists />` to:

```tsx
<CityGuideCuratedLists citySlug={city?.slug ?? ""} />
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `yarn test src/app/Scenes/CityGuide/Components/__tests__/CityGuideCuratedLists.tests.tsx`
Expected: PASS, 2 tests.

- [ ] **Step 6: Register the route**

In `src/app/Navigation/routes.tsx`, add the import beside the existing City Guide imports around line 85-98:

```tsx
import { ItineraryScreen } from "app/Scenes/CityGuide/Screens/Itinerary/ItineraryScreen"
```

Then add this entry directly after the `/city-guide` block that ends at line 1141:

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

The `options` block matches the neighbouring `/city-guide` route so the screen owns its own header, as `ItineraryScreen` renders `Screen.AnimatedHeader` itself.

- [ ] **Step 7: Add the Android deep link entry**

`/city-guide` has no entry in `android/app/src/main/AndroidManifest.xml` today. Add one; `pathPrefix` covers the itinerary sub-route too. Insert in the alphabetically sorted `<data android:pathPrefix=.../>` list, between `/artwork` and `/collect` style neighbours — find the correct alphabetical position with `grep -n "pathPrefix" android/app/src/main/AndroidManifest.xml`:

```xml
        <data android:pathPrefix="/city-guide"/>
```

- [ ] **Step 8: Verify the route resolves**

Run: `yarn test src/app/Navigation`
Expected: PASS. If a routes snapshot test exists and fails purely because a route was added, update the snapshot and inspect the diff to confirm only the new entry appears.

- [ ] **Step 9: Type-check, lint, commit**

```bash
yarn tsc
yarn lint --fix src/app/Navigation/routes.tsx src/app/Scenes/CityGuide/
git add src/app/Navigation/routes.tsx src/app/Scenes/CityGuide/ android/app/src/main/AndroidManifest.xml
git commit -m "feat(city-guide): route curated list rows to itinerary screen"
```

---

### Task 9: Stops-to-GeoJSON converter

**Files:**

- Create: `src/app/Scenes/CityGuide/Screens/Itinerary/utils/itineraryStopsToGeoJSON.ts`
- Test: `src/app/Scenes/CityGuide/Screens/Itinerary/utils/__tests__/itineraryStopsToGeoJSON.tests.ts`

**Interfaces:**

- Consumes: `Itinerary`, `ItineraryStop` from Task 1.
- Produces:
  - `itineraryStopsToGeoJSON(stops: ItineraryStop[], sectionTitleByStopId: Record<string, string>): ItineraryFeatureCollection`
  - `flattenItineraryStops(itinerary: Itinerary): { stops: ItineraryStop[]; sectionTitleByStopId: Record<string, string> }`
  - type `ItineraryFeatureCollection = { type: "FeatureCollection"; features: ItineraryFeature[] }`

The existing `convertCityToGeoJSON` is not reusable: it requires `feature.location.coordinates` (`src/app/Scenes/CityGuide/utils/convertCityToGeoJSON.ts:43`), while itinerary stops carry `coordinates: { lat, lng }` at the top level.

`order` is stamped into properties as a string. Mapbox's `textField` expects a `FormattedString`, and stamping avoids an `["to-string", ...]` wrapper in the layer style.

This is the map work's only pure logic, so it carries the map tests. Under the jest mock at `src/setupJest.tsx:295-304`, `MapView` renders as `() => null` and never renders its children, so layers cannot be asserted on.

- [ ] **Step 1: Write the failing test**

Create `src/app/Scenes/CityGuide/Screens/Itinerary/utils/__tests__/itineraryStopsToGeoJSON.tests.ts`:

```ts
import {
  flattenItineraryStops,
  itineraryStopsToGeoJSON,
} from "app/Scenes/CityGuide/Screens/Itinerary/utils/itineraryStopsToGeoJSON"
import { MOCK_ITINERARIES } from "app/Scenes/CityGuide/Screens/Itinerary/utils/mockItineraries"

describe("flattenItineraryStops", () => {
  it("returns every stop across all sections", () => {
    const { stops } = flattenItineraryStops(MOCK_ITINERARIES[0])

    expect(stops.map((stop) => stop.id)).toEqual(["stop-1", "stop-2", "stop-3", "stop-4", "stop-5"])
  })

  it("maps each stop id to its section title", () => {
    const { sectionTitleByStopId } = flattenItineraryStops(MOCK_ITINERARIES[0])

    expect(sectionTitleByStopId["stop-1"]).toEqual("Day 1 — Easing in")
    expect(sectionTitleByStopId["stop-4"]).toEqual("Day 2 — London Frieze")
  })
})

describe("itineraryStopsToGeoJSON", () => {
  it("converts stops into a feature collection with lng,lat coordinates", () => {
    const { stops, sectionTitleByStopId } = flattenItineraryStops(MOCK_ITINERARIES[0])
    const collection = itineraryStopsToGeoJSON(stops, sectionTitleByStopId)

    expect(collection.type).toEqual("FeatureCollection")
    expect(collection.features).toHaveLength(5)
    // GeoJSON is lng first, lat second.
    expect(collection.features[0].geometry.coordinates).toEqual([-0.1365, 51.5136])
  })

  it("stamps id, title, section and a string order into properties", () => {
    const { stops, sectionTitleByStopId } = flattenItineraryStops(MOCK_ITINERARIES[0])
    const collection = itineraryStopsToGeoJSON(stops, sectionTitleByStopId)

    expect(collection.features[1].properties).toEqual({
      id: "stop-2",
      title: "Museum",
      section: "Day 1 — Easing in",
      order: "2",
    })
  })

  it("returns an empty collection for no stops", () => {
    expect(itineraryStopsToGeoJSON([], {})).toEqual({ type: "FeatureCollection", features: [] })
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `yarn test src/app/Scenes/CityGuide/Screens/Itinerary/utils/__tests__/itineraryStopsToGeoJSON.tests.ts`
Expected: FAIL — cannot resolve `itineraryStopsToGeoJSON`.

- [ ] **Step 3: Write the implementation**

Create `src/app/Scenes/CityGuide/Screens/Itinerary/utils/itineraryStopsToGeoJSON.ts`:

```ts
import {
  Itinerary,
  ItineraryStop,
} from "app/Scenes/CityGuide/Screens/Itinerary/utils/itineraryTypes"

export interface ItineraryFeature {
  type: "Feature"
  geometry: { type: "Point"; coordinates: [number, number] }
  properties: {
    id: string
    title: string
    section: string
    /** Stringified because Mapbox textField expects a FormattedString. */
    order: string
  }
}

export interface ItineraryFeatureCollection {
  type: "FeatureCollection"
  features: ItineraryFeature[]
}

export const flattenItineraryStops = (
  itinerary: Itinerary
): { stops: ItineraryStop[]; sectionTitleByStopId: Record<string, string> } => {
  const stops: ItineraryStop[] = []
  const sectionTitleByStopId: Record<string, string> = {}

  itinerary.sections.forEach((section) => {
    section.stops.forEach((stop) => {
      stops.push(stop)
      sectionTitleByStopId[stop.id] = section.title
    })
  })

  return { stops, sectionTitleByStopId }
}

export const itineraryStopsToGeoJSON = (
  stops: ItineraryStop[],
  sectionTitleByStopId: Record<string, string>
): ItineraryFeatureCollection => ({
  type: "FeatureCollection",
  features: stops.map((stop) => ({
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [stop.coordinates.lng, stop.coordinates.lat],
    },
    properties: {
      id: stop.id,
      title: stop.title,
      section: sectionTitleByStopId[stop.id] ?? "",
      order: String(stop.order),
    },
  })),
})
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `yarn test src/app/Scenes/CityGuide/Screens/Itinerary/utils/__tests__/itineraryStopsToGeoJSON.tests.ts`
Expected: PASS, 5 tests.

- [ ] **Step 5: Type-check, lint, commit**

```bash
yarn tsc
yarn lint --fix src/app/Scenes/CityGuide/Screens/Itinerary/utils/
git add src/app/Scenes/CityGuide/Screens/Itinerary/utils/
git commit -m "feat(city-guide): add itinerary stops to GeoJSON converter"
```

---

### Task 10: ItineraryMapView and the list/map toggle

**Files:**

- Create: `src/app/Scenes/CityGuide/Screens/Itinerary/Components/ItineraryMapView.tsx`
- Modify: `src/app/Scenes/CityGuide/Screens/Itinerary/ItineraryScreen.tsx`
- Modify: `src/app/Scenes/CityGuide/Screens/Itinerary/__tests__/ItineraryScreen.tests.tsx`

**Interfaces:**

- Consumes: `Itinerary` from Task 1; `flattenItineraryStops`, `itineraryStopsToGeoJSON` from Task 9; `ArtsyMapStyleURL` from `app/Scenes/CityGuide/Components/CityGuideMap`.
- Produces: `ItineraryMapView: React.FC<{ itinerary: Itinerary }>`.

**Deviation from the approved spec, needs sign-off.** The spec says to extend `CityGuideMapPins.tsx` rather than write a second map implementation. On inspection that component is built around clustering (`cluster`, `clusterRadius`, `point_count` filters, `getClusterLeaves` via `shapeSourceRef`), is keyed by `BucketKey`/`FilterData` from `cityTabs`, and draws sprite icons via `iconImage: ["get", "icon"]`. Numbered pins need none of that: no clustering for 5-15 stops, a circle layer plus a text layer instead of sprites, and a different feature-collection key. Reusing it would mean adding flags for cluster on/off and icon-versus-label. The honest answer is a separate ~40-line pins component that follows the same `ShapeSource` + layer pattern. Flag this to the reviewer before starting.

- [ ] **Step 1: Write the failing test**

Add to `src/app/Scenes/CityGuide/Screens/Itinerary/__tests__/ItineraryScreen.tests.tsx`:

```tsx
it("switches to the map view and back", () => {
  renderWithWrappers(
    <ItineraryScreen citySlug="london-united-kingdom" itineraryId="chill-vibes-only" />
  )

  expect(screen.getByText("Coffee at London Cafe")).toBeTruthy()

  fireEvent.press(screen.getByTestId("itinerary-view-toggle"))

  // The Mapbox MapView is mocked to render null, so its children never mount.
  // Assert on what leaves the map: the list is gone and the filter pills are up.
  expect(screen.queryByText("Coffee at London Cafe")).toBeNull()
  expect(screen.getByText("All")).toBeTruthy()
  expect(screen.getByText("Day 1 — Easing in")).toBeTruthy()

  fireEvent.press(screen.getByTestId("itinerary-view-toggle"))

  expect(screen.getByText("Coffee at London Cafe")).toBeTruthy()
})

it("filters the map to one section when its pill is tapped", () => {
  renderWithWrappers(
    <ItineraryScreen citySlug="london-united-kingdom" itineraryId="chill-vibes-only" />
  )

  fireEvent.press(screen.getByTestId("itinerary-view-toggle"))
  fireEvent.press(screen.getByText("Day 2 — London Frieze"))

  expect(screen.getByTestId("itinerary-map-stop-count")).toHaveTextContent("2 stops")
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `yarn test src/app/Scenes/CityGuide/Screens/Itinerary/__tests__/ItineraryScreen.tests.tsx`
Expected: FAIL — no `itinerary-view-toggle` testID.

- [ ] **Step 3: Extend the jest Mapbox mock**

`src/setupJest.tsx:295-304` mocks only `MapView`, `StyleURL`, `setAccessToken`, `StyleSheet`, `ShapeSource`, and `SymbolLayer`. `Camera` and `CircleLayer` are missing. They go unnoticed today only because `MapView: () => null` never renders children. Add both so the component is safe to render directly later:

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

Do not read Mapbox constants during render — `MapboxGL.UserTrackingModes.Follow`, used at `CityGuideMap.tsx:221`, would throw under this mock.

- [ ] **Step 4: Write ItineraryMapView**

Create `src/app/Scenes/CityGuide/Screens/Itinerary/Components/ItineraryMapView.tsx`. Both layers carry a Mapbox `filter` so switching pills does not rebuild the shape source. `textFont` uses "Unica77 LL Medium", already proven in the Artsy map style at `CityGuideMapPins.tsx:59-65`.

```tsx
import MapboxGL, { CircleLayerStyle, SymbolLayerStyle } from "@rnmapbox/maps"
import { Flex, Pill, Spacer, Text } from "@artsy/palette-mobile"
import { ArtsyMapStyleURL } from "app/Scenes/CityGuide/Components/CityGuideMap"
import {
  flattenItineraryStops,
  itineraryStopsToGeoJSON,
} from "app/Scenes/CityGuide/Screens/Itinerary/utils/itineraryStopsToGeoJSON"
import { Itinerary } from "app/Scenes/CityGuide/Screens/Itinerary/utils/itineraryTypes"
import { useMemo, useState } from "react"
import { ScrollView, StyleProp } from "react-native"

const ALL_PILL = "All"
const DEFAULT_ZOOM_LEVEL = 12

const circleStyle: StyleProp<CircleLayerStyle> = {
  circleRadius: 14,
  circleColor: "black",
  circleStrokeWidth: 2,
  circleStrokeColor: "white",
  circlePitchAlignment: "map",
}

const numberStyle: StyleProp<SymbolLayerStyle> = {
  textField: ["get", "order"],
  textSize: 14,
  textColor: "white",
  textFont: ["Unica77 LL Medium"],
  textPitchAlignment: "map",
  textAllowOverlap: true,
  textIgnorePlacement: true,
}

export const ItineraryMapView: React.FC<{ itinerary: Itinerary }> = ({ itinerary }) => {
  const [selectedSection, setSelectedSection] = useState(ALL_PILL)

  const { stops, sectionTitleByStopId } = useMemo(
    () => flattenItineraryStops(itinerary),
    [itinerary]
  )

  const collection = useMemo(
    () => itineraryStopsToGeoJSON(stops, sectionTitleByStopId),
    [stops, sectionTitleByStopId]
  )

  const visibleStopCount =
    selectedSection === ALL_PILL
      ? stops.length
      : stops.filter((stop) => sectionTitleByStopId[stop.id] === selectedSection).length

  const layerFilter =
    selectedSection === ALL_PILL ? undefined : (["==", ["get", "section"], selectedSection] as any)

  const center = stops[0]
    ? ([stops[0].coordinates.lng, stops[0].coordinates.lat] as [number, number])
    : ([0, 0] as [number, number])

  return (
    <Flex flex={1}>
      <MapboxGL.MapView
        style={{ flex: 1 }}
        styleURL={ArtsyMapStyleURL}
        logoEnabled={false}
        attributionEnabled={false}
      >
        <MapboxGL.Camera centerCoordinate={center} zoomLevel={DEFAULT_ZOOM_LEVEL} />

        <MapboxGL.ShapeSource id="itineraryStops" shape={collection as any}>
          <MapboxGL.CircleLayer id="stopCircles" style={circleStyle} filter={layerFilter} />
          <MapboxGL.SymbolLayer
            id="stopNumbers"
            aboveLayerID="stopCircles"
            style={numberStyle}
            filter={layerFilter}
          />
        </MapboxGL.ShapeSource>
      </MapboxGL.MapView>

      <Flex position="absolute" top={0} left={0} right={0} pt={1}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <Flex flexDirection="row" px={2} gap={1}>
            {[ALL_PILL, ...itinerary.sections.map((section) => section.title)].map((title) => (
              <Pill
                key={title}
                selected={selectedSection === title}
                onPress={() => setSelectedSection(title)}
              >
                {title}
              </Pill>
            ))}
          </Flex>
        </ScrollView>

        <Spacer y={1} />

        <Text testID="itinerary-map-stop-count" variant="xs" px={2}>
          {visibleStopCount} stops
        </Text>
      </Flex>
    </Flex>
  )
}
```

If `Pill` is not exported from `@artsy/palette-mobile` with a `selected` prop, check the real signature with `grep -rn "from \"@artsy/palette-mobile\"" src/app --include='*.tsx' -l | xargs grep -l "Pill"` and copy an existing call site rather than guessing.

- [ ] **Step 5: Add the toggle to ItineraryScreen**

In `src/app/Scenes/CityGuide/Screens/Itinerary/ItineraryScreen.tsx`, add the view mode state and render one view or the other. Add these imports:

```tsx
import { Button } from "@artsy/palette-mobile"
import { ItineraryMapView } from "app/Scenes/CityGuide/Screens/Itinerary/Components/ItineraryMapView"
```

Add beside the existing `savedStopIds` state:

```tsx
const [isMapView, setIsMapView] = useState(false)
```

Then wrap the body. The floating toggle mirrors `CityGuideFloatingMapButton.tsx`, which is a `Button` pinned bottom-centre; it is not reused directly because that component hardcodes a `navigate` to `/local-discovery`.

```tsx
return (
  <Screen>
    <Screen.AnimatedHeader title={itinerary.title} onBack={goBack} hideTitle />

    <Screen.Body fullwidth>
      {isMapView ? (
        <ItineraryMapView itinerary={itinerary} />
      ) : (
        <Screen.ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
          <ItineraryHeader itinerary={itinerary} />

          <Flex px={2} pt={2}>
            <Join separator={<Spacer y={2} />}>
              {itinerary.sections.map((section) => (
                <ItinerarySectionRow
                  key={section.title}
                  section={section}
                  savedStopIds={savedStopIds}
                  onSaveStop={handleSaveStop}
                />
              ))}
            </Join>
          </Flex>
        </Screen.ScrollView>
      )}

      <Flex position="absolute" bottom={20} width="100%" alignItems="center">
        <Button
          testID="itinerary-view-toggle"
          size="small"
          onPress={() => setIsMapView((current) => !current)}
        >
          {isMapView ? "List" : "Map"}
        </Button>
      </Flex>
    </Screen.Body>
  </Screen>
)
```

- [ ] **Step 6: Run the tests to verify they pass**

Run: `yarn test src/app/Scenes/CityGuide/Screens/Itinerary/`
Expected: PASS — the four tests from Task 7 plus the two new ones.

- [ ] **Step 7: Confirm nothing else broke from the jest mock change**

Run: `yarn test src/app/Components/LocationMap src/app/Scenes/Partner`
Expected: PASS. The mock gained exports; it lost none, so existing map tests are unaffected.

- [ ] **Step 8: Type-check, lint, commit**

```bash
yarn tsc
yarn lint --fix src/app/Scenes/CityGuide/Screens/Itinerary/ src/setupJest.tsx
git add src/app/Scenes/CityGuide/Screens/Itinerary/ src/setupJest.tsx
git commit -m "feat(city-guide): add itinerary map view and list/map toggle"
```

---

## Verification

After the final task, confirm the whole feature from a cold start:

- [ ] `yarn tsc` passes with no new errors.
- [ ] `yarn test src/app/Scenes/CityGuide src/app/Components/SaveButton src/app/utils/mutations` passes.
- [ ] `yarn lint src/app/Scenes/CityGuide src/app/Components/SaveButton src/app/utils/mutations` is clean.
- [ ] In the simulator with `AREnableExpandedCityGuide` on: open `/city-guide`, tap "Chill Vibes Only", confirm the header, the two collapsible sections, and five numbered stops.
- [ ] Tap a stop's `+`: the icon pops into a tick and a toast reads "Saved to your saves". Tap again: it reverts and toasts "Removed from your saves".
- [ ] Collapse and expand a section.
- [ ] Tap "Map": numbered pins 1-5 appear over London. Tap "Day 2 — London Frieze": only pins 4 and 5 remain. Tap "List" to return.
- [ ] Tap the second curated list row: the "This guide is no longer available." branch renders rather than crashing.
