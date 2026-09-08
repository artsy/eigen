# Claude prompt — revise the City Guide events and saves plan

You are revising two planning documents for Eigen, Artsy's React Native app:

1. `docs/superpowers/specs/2026-08-27-city-guide-events-and-saves-design.md`
2. `docs/superpowers/plans/2026-08-27-city-guide-events-and-saves.md`

Read those first, followed by:

3. `docs/superpowers/HANDOVER.md`
4. `AGENTS.md`
5. `docs/best_practices.md`

Do not implement the feature. Do not edit production code. Update only the design spec and
implementation plan so that an engineer can execute the plan literally. Verify every revision
against the current Eigen checkout, `data/schema.graphql`, `../metaphysics`, and `../gravity`.
Resolvers and Gravity scopes take precedence over schema comments.

Do not run Jest or use `--findRelatedTests`. Reading code is preferred. `yarn relay` and
`yarn tsc` are safe only if needed to validate the documents.

## Verified corrections that must be made

### Backend and product model

- The city radius is **25km, not 75km**. Metaphysics explicitly sends
  `LOCAL_DISCOVERY_RADIUS_KM = 25`:
  - `../metaphysics/src/schema/v2/city/constants.ts:1`
  - `../metaphysics/src/schema/v2/me/followed_shows.ts:37-49`
    Gravity has a 75km default, but Metaphysics overrides it.
- `RUNNING` and `UPCOMING` are genuinely disjoint:
  `../gravity/app/models/concerns/event_status.rb:19-28`.
- `CURRENT` overlaps `UPCOMING`:
  `../gravity/app/models/concerns/event_status.rb:29-35`.
- `dayThreshold` is ignored for `RUNNING`:
  `../gravity/app/models/domain/partner_show.rb:106-119`.
- `RUNNING_AND_UPCOMING` defaults to 15 days:
  `../gravity/app/models/concerns/event_status.rb:4-5,46-48`.
- City show and fair connections genuinely resolve `totalCount`:
  `../metaphysics/src/schema/v2/city/index.ts:103-140,310-329`.
- `FollowedShowConnection` genuinely has no `totalCount`:
  `data/schema.graphql:19965-19975` and
  `../metaphysics/src/schema/v2/me/followed_shows.ts:10-13`.

Correct the spec's radius and its user-visible consequences. Be explicit that this model is a
city-scoped view of global follows, not independent itinerary storage: saving elsewhere adds an
item, unfollowing elsewhere removes it, bulk-add changes global follows, ended shows disappear,
and the result has no visit order.

Resolve the contradiction around fairs. The spec says a user itinerary includes followed fairs
(`design spec:412-420`), but Tasks 11 and 12 query and count only shows. Choose one coherent scope:

- either make v1 explicitly show-only and remove fair claims, or
- specify the fair query, combined count, ordering, pagination, row rendering, and tests.

Do not leave the spec promising fairs while the plan silently omits them.

### Task 0: postcode gate

Rewrite the gate. “60% have a postcode across three prefixes” does not prove the proposed table
classifies useful results. It also samples only running shows even though grouping is used for
current shows, opening shows, and fairs.

The gate must measure:

- actual matches against the proposed label table;
- fallback percentage and concentration per named bucket;
- current shows, 14-day upcoming shows, and current fairs;
- sample size and query date;
- malformed or blank values.

State a UX-based acceptance criterion or mark the threshold as a product decision. Do not present
60% as technically derived.

### Tasks 7 and 8: fragments and destination screen

- Add `location { postalCode }` to `CityGuideFair_fair`. Task 8 calls
  `groupByNeighborhood<Fair>`, but the current plan adds `postalCode` only to the show fragment.
  The existing fair fragment fetches only coordinates:
  `src/app/Scenes/CityGuide/utils/CityGuideFair.ts:16-21`.
- Remove `estimatedItemSize`. Eigen uses FlashList 2.2.2 (`package.json:158`), whose installed
  types do not expose that prop.
- Compute the footer's displayed count from fetched connection edges, not flattened visible rows.
  The current `renderedCount` changes when a section is collapsed and can render
  “Showing 0 of 143.”
- Keep the single conditionally selected query unless another concrete issue is found.
  `@include(if:)` is valid on these linked fields, Relay generates optional properties for
  conditional selections, and `extractNodes` accepts an absent connection:
  `src/app/utils/extractNodes.ts:1-19`.
- Validate the runtime `:section` route parameter. A TypeScript union does not prevent a deep link
  containing an arbitrary string.
- Remove `partner.slug` from Task 7 unless a specified consumer uses it.

### Task 11: saved-list refactor and tests

Rewrite this task around the code that exists:

- `CitySavedList` is private and takes `me`, `cityName`, and `citySlug`:
  `src/app/Scenes/CityGuide/Screens/CitySavedList.tsx:18-24`.
- The exported route component is `CitySavedListQueryRenderer`:
  `src/app/Scenes/CityGuide/Screens/CitySavedList.tsx:97-133`.
- `CitySavedList` has no `renderItem`; it delegates to `CityGuideEventList`:
  `src/app/Scenes/CityGuide/Screens/CitySavedList.tsx:53-64`.
- `CityGuideEventList` owns the current `ShowItemRow` rendering:
  `src/app/Scenes/CityGuide/Components/CityGuideEventList.tsx:35-45`.

Specify whether `CitySavedList` stops using `CityGuideEventList` or whether that shared component
is deliberately extended. Make the test target and supplied props match that choice.

Delete the test that reads `CitySavedList.tsx` with `fs` and searches for
`"dayThreshold: 365"`. It tests formatting and the working directory, not Relay behavior.
Replace it with a query/generated-request assertion or a Relay test that validates the argument.

### Task 12: summary row

- Add `countSuffix` to the `CityGuideEventSummaryRow` props **and** to the component's parameter
  destructuring. The current plan adds the prop but then references an undefined local.
- Remove `internalID` from the summary query unless it is used.
- Make the summary count agree with the final show-only versus show-plus-fair decision.

### Task 13: entity resolution

Rewrite this task completely. The supplied implementation is not acceptable:

- it calls a hook inside `.map`, violating the Rules of Hooks;
- suspension on the first lookup prevents later hook calls in that render;
- it references `useItineraryStopEntity` without defining it;
- the implementer note's callback component cannot preserve the stated hook signature by itself,
  because a hook cannot render those resolver components;
- it does not specify how resolved entities replace the query-owning controls in
  `ItinerarySectionRow`, `ItineraryStopRow`, and previews.

Use an explicit architecture such as:

1. a provider or screen-owned store keyed by `stopId`;
2. one keyed resolver component per saveable stop;
3. an independent Suspense and error boundary around each resolver;
4. resolver results reported into the store;
5. rows and bulk-add reading the same resolved entity state;
6. specified prop changes through every affected component.

Define loading, errors, missing entities, updates after mutations, cleanup, and tests. Remove
`isLoading` if no consumer needs it.

### Task 14: Add Full List

Do not export raw mutation documents and call `commitMutation` without the behavior supplied by
the hooks. The current hooks provide optimistic responses and updaters:

- `src/app/utils/mutations/useFollowShow.ts:37-48`
- `src/app/utils/mutations/useFollowProfile.ts:34-46`

Extract shared imperative mutation helpers/configuration that both the hooks and bulk-add use, or
otherwise preserve exactly the same optimistic record updates. Specify:

- bounded concurrency rather than an unbounded `Promise.all`;
- success, network failure, and GraphQL partial-error handling;
- successful IDs and button state after partial completion;
- unmount/cancellation behavior;
- immediate row updates;
- retry behavior.

Fix the proposed test. It passes a fixed `entities` prop and expects mutation resolution to change
that prop to an all-followed state, so it cannot reach “Added.” Test operation count and result
reporting separately, and test the “Added” transition through reactive Relay-backed state or
explicit local successful-ID state.

### Task 15: follow polish

Correct the paths:

- `ShowFollowButton` is `src/app/Components/ShowFollowButton.tsx`, not under `Buttons`.
- The proposed `ShowFollowButton.tests.tsx` and `ShowItemRow.tests.tsx` files do not currently
  exist. Explicitly create meaningful tests rather than saying to run them.

Preserve tracking, in-flight guards, callbacks, and error behavior during migration.

Correct the rationale too. Both components hand-roll `commitMutation`, but they are not both the
fully broken implementation described by the handover. `ShowFollowButton` supplies a valid `id`,
field name, and updater (`ShowFollowButton.tsx:65-78`). `ShowItemRow` has a malformed aliased
optimistic response but still has an explicit record updater (`ShowItemRow.tsx:73-86`). The fully
broken historical implementation was `CityGuideEvent`.

`GalleryFollow` and `GalleryUnfollow` exist at `src/app/utils/track/schema.ts:280-281` and are
missing from `ItineraryStopSaveControl`; do not claim they are unused throughout Eigen.

## Additional plan requirements

- Add analytics requirements and tests for destination-screen views, summary-row taps, fair saves,
  and bulk-add where applicable.
- Define logged-out save behavior.
- Add tests for invalid route sections, fair postcode grouping, footer counts after collapse,
  failed and partially failed bulk mutations, and mixed show/fair/partner bulk additions.
- Keep the admission line omitted; the backend cannot support it honestly.
- Keep share omitted until there is a canonical external destination.
- Preserve the documented rules: stable section IDs, pure grouping functions, no state in recycled
  FlashList cells, named Jest files only, and Relay regeneration after GraphQL changes.
- Do not add speculative abstractions beyond what the corrected feature needs.

## Output

Edit the two documents directly. Then report:

1. every substantive correction made;
2. any product decision that remains unresolved;
3. any claim marked **UNVERIFIABLE** and exactly what evidence would resolve it;
4. a final task-by-task check confirming Tasks 0–15 are executable literally and that each planned
   test fails before its implementation where intended.
