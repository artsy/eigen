# City Guide Itineraries Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Revision:** v2.1. Supersedes v1 (commit `5ba2d39e81`) after three review rounds. Eleven tasks, not ten.

v2.1 folds in a third review plus findings from reading Metaphysics and Gravity directly. The design did
not change; the plan did. Four defects would have broken it on a cold run: no Suspense or error boundary
around the per-stop queries, tests that crash `setupTestWrapper` by rendering no query, curated rows that
were not actually pressable, and a `to`-prop assertion that can never hold. Plus `includeAllShows`,
a `useFollowProfile` type widening, the wrong gradient package, and per-city row filtering.

**Goal:** Add read-only viewing of curated city itineraries to the City Guide, with a real save action on each stop.

**Architecture:** A new `Screens/Itinerary/` directory under the existing City Guide scene. One route renders an `ItineraryScreen` holding a list/map toggle in local state. The itinerary _structure_ comes from a static mock module; each stop's _entity_ is real, resolved by slug through Relay so the save fires a genuine mutation. Two pieces get extracted to shared locations because code on disk already justifies them: a `useFollowShow` mutation hook and a Mapbox config module.

**Tech Stack:** React Native, TypeScript (strict), Relay, `@artsy/palette-mobile`, `@artsy/icons/native`, `react-native-reanimated`, `@rnmapbox/maps`, Jest + `@testing-library/react-native`.

## Global Constraints

- Spec: `docs/superpowers/specs/2026-08-26-city-guide-itineraries-design.md` (v2).
- Review trail: `docs/superpowers/reviews/`. Finding ids below (BLOCK-_, FIX-_, MISS-\*) are defined there.
- Reuse existing components, spacing, and patterns over matching Figma pixel values. The designs are not final.
- **Before every commit** run these, adapted from `AGENTS.md:41-51`:
  ```sh
  yarn tsc
  yarn test <the specific test file(s) you touched>
  yarn lint <changed-files>
  ```
  **Never `yarn test --findRelatedTests`, and never the full suite.** AGENTS.md names
  `--findRelatedTests`, but in this repo it is unreliable — it hangs or drags in large unrelated
  batches. One run in this project sat for eight minutes before being killed. Name the test files
  explicitly instead. When a file you changed has no test file, say so rather than hunting for
  "related" ones.
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

> **Task 1 is complete.** The committed files are authoritative, not the blocks below.
> The mock data now uses real London shows and galleries scraped from
> `artsy.net/shows/london-united-kingdom` — real slugs, real exhibition titles, and the
> galleries' actual coordinates — rather than the placeholder slugs and `"Museum"` /
> `"Gallery Show"` titles these blocks show. Read
> `src/app/Scenes/CityGuide/Screens/Itinerary/utils/mockItineraries.ts` for the real
> content. The blocks below are kept for the shape and the field-by-field rationale.

- [ ] **Step 1: Write the types**

```ts
/** How a stop resolves to a saveable Artsy entity. null for a non-Artsy editorial place. */
export type ItinerarySaveTarget = { type: "SHOW"; slug: string } | { type: "PARTNER"; slug: string }

export interface ItineraryStop {
  id: string
  title: string
  /** Backend-formatted for display. e.g. "11am-4pm" */
  displayTime: string
  /**
   * Reserved, unused in this pass. ISO 8601. Carried so sorting and timezone-aware
   * behaviour do not need a schema change later. Never format from these — display
   * always comes from displayTime.
   */
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
  // The environment is module-level and shared across tests, as in useSendInquiry.tests.tsx:41.
  afterEach(() => {
    env.mockClear()
  })

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
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"

// Harness rule for every test in this plan: `renderWithRelay` unconditionally calls
// env.mock.resolveMostRecentOperation (setupTestWrapper.tsx:117), and relay-test-utils
// throws "There are no pending operations in the list" when nothing is pending
// (RelayModernMockEnvironment.js:220). So use setupTestWrapper ONLY when the render
// actually issues a query — i.e. when a stop has a non-null saveTarget. Otherwise use
// renderWithWrappers.

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

  // No saveTarget means no query, so these two must not go through renderWithRelay.
  it("omits the note when the stop has none", () => {
    renderWithWrappers(<ItineraryStopRow stop={unsaveableStop} number={1} />)

    expect(screen.queryByText("🥂 🧀")).toBeNull()
  })

  it("renders no save control when the stop has no save target", () => {
    renderWithWrappers(<ItineraryStopRow stop={unsaveableStop} number={1} />)

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
        // Containment is mandatory, not decorative. The app's only ambient boundary is the
        // RetryErrorBoundary at Navigation/AuthenticatedRoutes/ScreenWrapper.tsx:51, which has
        // no Suspense — an uncontained suspending child blanks the whole screen into its retry
        // state. Both boundaries render null so one slow or 404 lookup costs one control.
        <ErrorBoundary fallbackRender={() => null}>
          <Suspense fallback={null}>
            <ItineraryStopSaveControl saveTarget={stop.saveTarget} stopTitle={stop.title} />
          </Suspense>
        </ErrorBoundary>
      )}
    </Flex>
  )
}
```

Add to the imports:

```tsx
import { Suspense } from "react"
import { ErrorBoundary } from "react-error-boundary"
```

`react-error-boundary` is already a dependency — `app/utils/hooks/withSuspense.tsx` imports `ErrorBoundary` and `FallbackProps` from it. `withSuspense` itself is not used here because it wraps a component definition, while this needs a boundary around one conditional child.

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
  # includeAllShows: true is required, not optional. It defaults to false — "Include shows
  # that are no longer running/active" — so without it a mock built from currently running
  # shows silently loses its save controls as those shows close.
  query ItineraryStopSaveControlShowQuery($slug: String!) {
    show(id: $slug, includeAllShows: true) {
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

**Before replacing `<any>`, widen `useFollowProfile`.** It declares `isFollowed: boolean | null`
(`src/app/utils/mutations/useFollowProfile.ts:6`), but the generated type makes
`data?.partner?.profile?.isFollowed` be `boolean | null | undefined`, and the hook is necessarily
called before the `if (!profile) return null` guard. Under `strict` that will not compile the moment
the real type replaces `any`. Change that one line to match `useFollowShow`:

```ts
isFollowed: boolean | null | undefined
```

This is the same widening BLOCK-03 forced on `useFollowShow`; the sibling was missed. Commit it with
this task and re-run the existing consumers' tests (`PartnerFollowButton`, `FairFollowButton`).

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
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

// Both fixture stops have saveTarget: null, so no query fires and setupTestWrapper
// would throw. See the harness rule in the ItineraryStopRow test.
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
  it("renders the title and its stops expanded by default", () => {
    renderWithWrappers(<ItinerarySectionRow section={section} startNumber={1} />)

    expect(screen.getByText("Day 1 — Easing in")).toBeTruthy()
    expect(screen.getByText("Coffee at London Cafe")).toBeTruthy()
    expect(screen.getByText("Museum")).toBeTruthy()
  })

  it("numbers stops from startNumber", () => {
    renderWithWrappers(<ItinerarySectionRow section={section} startNumber={4} />)

    expect(screen.getByText("4")).toBeTruthy()
    expect(screen.getByText("5")).toBeTruthy()
  })

  it("hides the stops when the header is tapped", () => {
    renderWithWrappers(<ItinerarySectionRow section={section} startNumber={1} />)

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

- [ ] **Step 3: Write the implementation**

The repo has `react-native-linear-gradient` 2.8.3 (`package.json:199`) with a **default** export, used
at `HomeViewSectionCard.tsx:25`, `ViewingRoomHeader.tsx:8`, and `MyCollectionArtworkDemandIndex.tsx:9`.
`expo-linear-gradient` is not a dependency — do not import it and do not add it.

```tsx
import { Flex, Text } from "@artsy/palette-mobile"
import { Itinerary } from "app/Scenes/CityGuide/Screens/Itinerary/utils/itineraryTypes"
import LinearGradient from "react-native-linear-gradient"
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

- [ ] **Step 4: Run to verify it passes**

Expected: PASS, 2 tests.

- [ ] **Step 5: Verify and commit**

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
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"

// "chill-vibes-only" has four saveable stops, so four queries fire. renderWithRelay
// resolves one; the other three stay suspended, but each is contained by its own
// Suspense fallback={null} (Task 5), so they render as nothing rather than blanking
// the tree. Assertions below therefore target the screen chrome, never a save icon.
// The unavailable-state tests issue no query at all and must use renderWithWrappers.
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
    renderWithWrappers(<ItineraryScreen citySlug="london-united-kingdom" itineraryId="nope" />)

    expect(screen.getByText("This guide is no longer available.")).toBeTruthy()
    expect(screen.queryByText("Chill Vibes Only")).toBeNull()
  })

  it("does not render another city's itinerary", () => {
    renderWithWrappers(<ItineraryScreen citySlug="paris-france" itineraryId="chill-vibes-only" />)

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

  it("navigates to the itinerary when a row is tapped", () => {
    renderWithWrappers(<CityGuideCuratedLists citySlug="london-united-kingdom" />)

    fireEvent.press(screen.getAllByTestId("curated-list-row")[0])

    expect(navigate).toHaveBeenCalledWith(
      "/city-guide/london-united-kingdom/itinerary/chill-vibes-only"
    )
  })

  it("renders nothing for a city with no itineraries", () => {
    renderWithWrappers(<CityGuideCuratedLists citySlug="paris-france" />)

    expect(screen.queryAllByTestId("curated-list-row")).toHaveLength(0)
  })
})
```

Imports for this file:

```tsx
import { fireEvent, screen } from "@testing-library/react-native"
import { CityGuideCuratedLists } from "app/Scenes/CityGuide/Components/CityGuideCuratedLists"
import { navigate } from "app/system/navigation/navigate"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
```

Assert navigation behaviourally, never on a `to` prop: `RouterLink` destructures `to` out of props (`RouterLink.tsx:29-38`) and never places it on a rendered element, so `rows[0].props.to` is `undefined` in every configuration. `navigate` is already mocked in the global test setup; if the assertion finds no mock, add `jest.mock("app/system/navigation/navigate", () => ({ navigate: jest.fn() }))` at the top of the file.

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
import { getMockItinerary } from "app/Scenes/CityGuide/Screens/Itinerary/utils/mockItineraries"
import { RouterLink } from "app/system/navigation/RouterLink"
// TODO: Replace with Image from @artsy/palette-mobile once we get the data from the API
import { Image as RNImage } from "react-native"

const IMAGE_SIZE = 80

const ListItem = ({ item, citySlug }: { item: (typeof data)[0]; citySlug: string }) => {
  return (
    // No `hasChildTouchable`: that mode makes RouterLink render nothing itself and clone
    // onPress onto its child (RouterLink.tsx:92-99). The child here is a styled View, which
    // ignores onPress, so the row would not be pressable at all. Without the prop,
    // RouterLink renders its own Touchable (RouterLink.tsx:103) and carries the testID.
    <RouterLink
      testID="curated-list-row"
      to={`/city-guide/${citySlug}/itinerary/${item.itineraryId}`}
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
  // The mock rows are a static constant but itineraries are per-city, so an unfiltered
  // list gives every non-London city three rows that all dead-end into the unavailable
  // state. Filter to rows that actually resolve, and render nothing when none do.
  const rows = data.filter((item) => !!getMockItinerary(citySlug, item.itineraryId))

  if (!rows.length) {
    return null
  }

  return (
    <Flex px={2}>
      <Join separator={<Spacer y={2} />}>
        {rows.map((item) => (
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

- [x] **Step 5: Android deep link — done, decision taken**

Already applied to `android/app/src/main/AndroidManifest.xml:104`, between `/categories` and `/collect`:

```xml
        <data android:pathPrefix="/city-guide"/>
```

The decision was made knowingly: `pathPrefix` is a prefix, so this also exposes the base `/city-guide`
screen — the hardcoded-mock placeholder — to artsy.net links on Android. The product owner signed off.
Note it in the PR description. (The surrounding list is not alphabetically sorted; breaks exist at
`:92-93`, `:109-110`, `:142-144`. This entry is in the alphabetically correct place regardless.)

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
      title: "Splash: Sea, Beach and Pool",
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
- [ ] Switch the city picker to a city with no mock itineraries: the curated list section renders nothing rather than three dead rows.
- [ ] Put the device in airplane mode and open an itinerary: the rows still render with their titles, times, and numbers, and only the save controls are missing. The screen must not show a full-page retry state — that would mean the per-control boundaries are not containing the failure.
- [ ] Point one mock stop at a deliberately bogus slug: that one control is absent, every other stop still works.
- [ ] The City Guide map, Partner map, and artwork location map all still render after the Mapbox extraction.
