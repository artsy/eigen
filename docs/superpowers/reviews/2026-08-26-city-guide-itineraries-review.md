# City Guide Itineraries — Independent Review Findings

**Branch reviewed:** `city-guide-itineraries-docs`  
**Review date:** 2026-08-26  
**Source handoff:** `docs/superpowers/handoffs/2026-08-26-city-guide-itineraries-handoff.md`  
**Status:** Review only. Nothing described by the feature has been implemented.

## How to use this review

These findings are inputs to a second independent review, not amendments to the approved spec or
implementation plan. Re-check every finding against the current branch before accepting it. Line
numbers below were current on the review date and may drift.

For each finding, record one of:

- **Confirm** — the evidence and severity are correct.
- **Modify** — the issue is real, but its description, severity, or fix should change.
- **Reject** — the finding is not supported by the repository or requirements.

## Blocking findings

### BLOCK-01 — The proposed save-target shape cannot drive the mutations

**Affected sections:** Part 1 “Data shape”; Task 1; Task 3; Task 7  
**Evidence:**

- `src/app/utils/mutations/useFollowProfile.ts:3-47`
- `src/app/Components/PartnerFollowButton.tsx:19-23`
- `src/app/Components/FairFollowButton.tsx:20-27`
- `src/app/Scenes/CityGuide/Components/CityGuideEvent.tsx:32-66`

**Problem:** A Show follow needs both the Relay node `id` and the Show `internalID`, which is sent as
`partnerShowID`. The proposed Show entity has no `internalID`. A Partner is followed through its
nested Profile; `isFollowed` is a Profile field, not a Partner field. The proposed Partner entity
flattens the wrong fields. The mock also classifies non-art stops such as a cafe as `Partner`
without establishing that they are saveable Artsy entities.

**Required change:** Define a discriminated save target that carries the identifiers required by
each mutation. Either model Partner's nested profile explicitly or separate the displayed entity
from its save target. Make the save target optional if editorial stops may be non-Artsy places.

**Acceptance criteria:** The Task 1 type can be passed to `useFollowShow` or `useFollowProfile`
without inventing identifiers, casts, or typename-specific assumptions outside the type.

### BLOCK-02 — Task 7 presents a local UI toggle as a persisted save

**Affected sections:** Part 1 “Saving a stop”; Task 7; final verification  
**Evidence:** Task 7 stores stop IDs in a component-local `Set`, does not call either follow
mutation, resets on remount, ignores `entity.isFollowed`, and displays “Saved to your saves.”

**Problem:** This contradicts the approved behavior that pressing the button fires a follow
mutation. It also bypasses authentication, error handling, Relay state, and persistence while
presenting success copy to the user.

**Required change:** Choose one explicitly:

1. Make real save wiring and valid backend identifiers a prerequisite for exposing the button.
2. Gate the entire itinerary experience as a non-production prototype and use copy/UI that does
   not claim persistence.
3. Remove the save control from this sub-project and add it in the save sub-project.

**Acceptance criteria:** A production-reachable UI never confirms a save that only exists in local
component state.

### BLOCK-03 — The Task 3 migration does not type-check

**Affected sections:** Task 3, Steps 3 and 7  
**Evidence:** `src/__generated__/CityGuideShow_show.graphql.ts:23` types `is_followed` as
`boolean | null | undefined`; `FollowShowOptions.isFollowed` is declared as `boolean | null`.

**Required change:** Accept `boolean | null | undefined` and normalize once inside the hook, or
normalize at every call site with an explicit documented rule.

**Acceptance criteria:** Passing `event.is_followed` from `CityGuideEvent` compiles without a cast.

### BLOCK-04 — The Task 3 hook tests fail after the hook exists

**Affected sections:** Task 3, Steps 1 and 5  
**Evidence:** `src/app/utils/tests/setupTestWrapper.tsx:114-129` always resolves a pending Relay
operation after render. A component that only calls `useMutation` has no pending operation until
the press. `createMockEnvironment().mock.resolveMostRecentOperation(...)` throws
“RelayModernMockEnvironment: There are no pending operations in the list” in that state.

**Required change:** Render with the app wrappers and obtain the global mock Relay environment, or
provide a purpose-built mutation-hook harness that does not resolve an operation on mount. Add an
assertion for the optimistic store value, not only mutation variables.

**Acceptance criteria:** The tests fail because the hook is absent, then pass after implementation,
and cover follow, unfollow, optimistic state, completion, and error behavior.

### BLOCK-05 — Freeform section titles are incorrectly used as identity

**Affected sections:** Part 1 “Data shape”; Task 5; Task 9; Task 10  
**Problem:** Freeform titles are suitable display values, but the plan also uses them as React keys,
Mapbox filter values, and stop-to-section identifiers. Duplicate, edited, or localized titles can
merge unrelated sections.

**Required change:** Add `ItinerarySection.id`. Keep `title` opaque and backend-authored, but use
the ID for keys, lookups, and filters.

**Acceptance criteria:** Two sections may share the same title without sharing identity or pins.

### BLOCK-06 — Two visible curated rows intentionally lead to unavailable content

**Affected sections:** “Known gaps”; Task 8  
**Problem:** A production-facing row should not be made broken merely to exercise an error branch.

**Required change:** Add mock itineraries for every visible row or hide unavailable rows. Exercise
the unavailable state by navigating directly to an unknown ID in a test.

**Acceptance criteria:** Every rendered curated-list row opens content; the unavailable route still
has direct test coverage.

## Should-fix findings

### FIX-01 — Do not extend `CityGuideMapPins`; do create the component the plan describes

**Affected sections:** Part 1 “Reuse”; Task 10  
**Evidence:** `src/app/Scenes/CityGuide/Components/CityGuideMapPins.tsx:11-91` is coupled to
show/fair buckets, clustering, sprite icons, selection state, and cluster styling.

**Decision:** The approved spec is wrong to require extending this component. A separate
itinerary-specific pins component is the smaller and clearer design. However, Task 10 does not
actually create the claimed `ItineraryMapPins`; it inlines pins, map, camera, filters, and state in
`ItineraryMapView`.

**Required change:** Amend the spec and add a local `ItineraryMapPins.tsx`. Keep
`ItineraryMapView` responsible for layout, camera, and filter controls. Do not add mode flags to
`CityGuideMapPins`.

### FIX-02 — Extract `useFollowShow`, but keep the new SaveButton local

**Affected sections:** Part 1 “Saving a stop”; Tasks 2 and 3  
**Evidence:** The followShow mutation exists in three places:

- `src/app/Scenes/CityGuide/Components/CityGuideEvent.tsx:109`
- `src/app/Components/ShowFollowButton.tsx:47`
- `src/app/Components/Lists/ShowItemRow.tsx:56`

**Decision:** `useFollowShow` is already justified by current code, independent of future sibling
projects. A generic shared `SaveButton` is not: it has one consumer and itinerary-specific plus/tick
behavior. Start with `ItinerarySaveButton` inside the scene and extract when a real second consumer
arrives.

### FIX-03 — Reuse the canonical show updater; do not write the alias

**Affected sections:** Task 3, Steps 3, 7, and 8  
**Evidence:** `src/app/utils/mutations/setShowFollowed.ts:4-19` documents that Relay normalizes
`is_followed: isFollowed` under the schema field name `isFollowed`.

**Problem:** The proposed fallback that also writes `is_followed` is incorrect. The prose also says
the legacy behavior is preserved through `onCompleted`, but the snippet passes no `onCompleted`.

**Required change:** Use `setShowFollowed(store, id, nextFollowedState)` in the hook and delete the
fallback branch and contradictory explanation.

### FIX-04 — `citySlug` is accepted but ignored

**Affected sections:** Task 1; Task 7  
**Problem:** `/city-guide/paris/itinerary/chill-vibes-only` would render the London itinerary.

**Required change:** Either look up by `{ citySlug, itineraryId }` and reject mismatches, or declare
itinerary IDs globally authoritative and remove the unused city constraint from the lookup model.

### FIX-05 — Ordering has two uncontrolled sources of truth

**Affected sections:** Task 1; Task 5; Task 9  
**Problem:** Array order controls rendering, while `order` controls the visible number. Nothing
sorts or validates the two.

**Required change:** Remove `order` and derive numbering from ordered data, or rename it `position`,
sort by it, and validate uniqueness and contiguity.

### FIX-06 — The loose content fields need explicit trade-offs

**Affected sections:** Part 1 “Data shape”; Task 1  
**Decision:** Freeform section titles are correct as display content once a stable ID is added.
`description: string` is acceptable only if captions and emoji always share styling, accessibility,
and localization treatment. If they do not, use a typed annotation such as
`{ kind: "TEXT" | "EMOJI"; value: string }`. Consider structured schedule fields plus a backend
`displayTime`; `timeLabel` alone cannot support timezone-aware formatting, sorting, or future
schedule behavior.

### FIX-07 — Fit the map to visible stops

**Affected sections:** “Known gaps”; Task 10  
**Problem:** Centering on the first stop at zoom 12 does not guarantee that the itinerary's pins are
visible for future API data.

**Required change:** Fit bounds for all visible stops and refit when the selected section changes.

### FIX-08 — Remove hidden Mapbox initialization coupling

**Affected sections:** Task 10  
**Evidence:** `src/app/Scenes/CityGuide/Components/CityGuideMap.tsx:41-53` both configures Mapbox and
exports `ArtsyMapStyleURL`.

**Problem:** Importing the style constant happens to execute another screen component module's
token setup.

**Required change:** Move the style URL and initialization helper to a shared map utility, or
initialize Mapbox explicitly in the itinerary map module.

### FIX-09 — Add a route assertion

**Affected sections:** Task 8, Step 8  
**Problem:** Running `yarn test src/app/Navigation` does not prove the new route was registered
because no test is added for it.

**Required change:** Add a `matchRoute` test that verifies the module name and both route params.

### FIX-10 — One Task 8 “red” test is already green

**Affected sections:** Task 8, Step 1  
**Problem:** The test named “renders a row per curated list” only checks text already rendered by
the current component. React Native Testing Library normalizes trailing whitespace, so the current
trailing spaces do not make it fail. It also does not count rows.

**Required change:** Assert all expected rows or accessible buttons. The navigation behavior test
can remain the actual red test.

### FIX-11 — Use `RouterLink` for curated rows

**Affected sections:** Global constraints; Task 8  
**Problem:** The plan states the `RouterLink` convention, then suppresses the restricted-import rule
and uses `navigate` for a static destination.

**Required change:** Wrap each row in `RouterLink` and test the destination through user-visible
behavior or the route matcher.

### FIX-12 — Do not change the approved animation to suit the Jest mock

**Affected sections:** Part 1 “Saving a stop”; Task 2  
**Problem:** The spec requires a scale-and-fade crossfade; the plan conditionally renders one icon
and only pops it. The implementation also animates on initial mount.

**Required change:** Implement the production animation independently of what animation values Jest
can observe. Expose a stable semantic state for tests and skip the initial transition.

### FIX-13 — Commit checkpoints violate the repository instructions

**Affected sections:** Global constraints; all tasks  
**Problem:** The provided AGENTS.md requires, before every commit:

```sh
yarn tsc
yarn test --findRelatedTests <changed-files>
yarn lint <changed-files>
```

Most tasks run only a targeted test instead of `--findRelatedTests`. Task 3's first commit omits
type-check and lint entirely.

**Required change:** Put the three required commands immediately before every commit step.

### FIX-14 — Add release-quality integration concerns to the plan

**Affected sections:** Testing; Tasks 7, 8, and 10  
**Required change:** Add tracking for screen view, curated-row tap, save/unsave, filter selection,
and list/map toggle. Add safe-area handling for top pills and the bottom toggle, contrast treatment
behind white hero text, and an accessibility pass for the toggle, collapsible sections, and save
state.

### FIX-15 — Follow the FlashList convention for the itinerary list

**Affected sections:** Task 7  
**Evidence:** `docs/best_practices.md:209-213` says not to nest ScrollViews and to default to
FlashList.

**Required change:** Render the itinerary's list content through FlashList unless the team records
a deliberate exception for the bounded 5–15-stop data set. The horizontal map-filter rail may
remain a ScrollView if its bounded size is documented.

## Repository-claim corrections

### CLAIM-01 — Wrong feature flag

The handoff says CityGuideNew is behind `AREnableExpandedCityGuide`. That flag only selects the
expanded city JSON in `CityGuideCityPicker.tsx:45-47`. `CityGuideCTA.tsx:8-15` switches its
destination to `/city-guide` using `AREnableGlobalMapList`. The final simulator instructions name
the wrong flag.

### CLAIM-02 — Wrong mutation-copy count

The handoff says show-follow logic exists twice inline. It exists three times; see FIX-02.

### CLAIM-03 — Wrong MapPins type provenance

`BucketKey` comes from `utils/bucketCityResults`, and `FilterData` comes from `utils/types`, not
`utils/cityTabs`.

### CLAIM-04 — Wrong ownership of cluster-leaf lookup

`getClusterLeaves` is executed by `CityGuideMap.tsx:266`. `CityGuideMapPins` accepts and attaches the
ShapeSource ref, so the coupling is real, but the operation is not implemented in that file.

### CLAIM-05 — Wrong TODO-comment claim

Of `CityGuideCityPicker`, `CityGuideCuratedLists`, `CityGuideMetaData`, and `CityGuideEvents`, only
`CityGuideCityPicker` currently carries the claimed `// @TODO: Implement test` comment. The other
components are still untested.

### CLAIM-06 — Wrong manifest ordering claim

The Android `pathPrefix` list is not alphabetically sorted: `/infinite-discovery` currently appears
before `/fair`. If `/city-guide` is added, its logical position is between `/categories` and
`/collect`, not the described range between `/artwork` and `/collect`.

### CLAIM-07 — Stale task number and toast explanation

Task 7 says Task 9 adds the map toggle; Task 10 does. It also says the toast copy is the same in both
directions, while the proposed strings are different.

### CLAIM-08 — The promised separate pins component is absent

Task 10 describes a separate approximately 40-line pins component, but its file list and code create
one combined `ItineraryMapView` containing map, camera, layers, filters, and count state.

## Known-gap disposition

| Gap                          | Disposition                                              | Required action                                                |
| ---------------------------- | -------------------------------------------------------- | -------------------------------------------------------------- |
| Add Full List omitted        | Acceptable deferral                                      | Keep it explicitly out of scope and do not render the control. |
| Toast copy unconfirmed       | Acceptable for prototype only                            | Obtain product sign-off before release.                        |
| Emoji rendered as plain text | Acceptable only if semantics are intentionally identical | Otherwise adopt typed annotations; see FIX-06.                 |
| Fixed first-stop camera      | Must fix                                                 | Fit visible stop bounds; see FIX-07.                           |
| Two rows open missing mocks  | Must fix                                                 | Add data or hide rows; see BLOCK-06.                           |

## Verified claims with no finding

The following high-priority claims were checked and were current on the review date:

- `CityGuideEvent.tsx:32-67` contains the inline followShow mutation wiring described by the handoff.
- `useFollowProfile.ts` has the stated `{ followProfile, isInFlight }` shape and optimistic updater.
- `/local-discovery` and `/city-guide` occupy `routes.tsx:1113-1141`.
- The Mapbox Jest mock occupies `setupJest.tsx:295-304`; the Reanimated mock is at line 322.
- `CityGuideMapPins.tsx` is coupled to clustering and sprite icons.
- `ArtsyMapStyleURL` is exported from `CityGuideMap.tsx:53`.
- `AddIcon`, `CheckmarkIcon`, `ChevronDownIcon`, and `ChevronUpIcon` are exported by
  `@artsy/icons/native` and accept the proposed SVG props, including `testID`.
- `Pill` is exported by `@artsy/palette-mobile` and its props include `selected?: boolean`.

## Unverified external claims

The repository does not establish the current Figma contents, future sibling-project consumers,
the upcoming backend design process, product approval of toast copy, or whether the proposed route
will exist on artsy.net. The exact statement that every Relay-node-length base64 mock ID is rejected
by `detect-secrets` is also unverified; the repository confirms the hook and allowlist mechanism,
but detection depends on the string's entropy.
