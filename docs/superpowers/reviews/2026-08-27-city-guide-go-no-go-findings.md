# Claude prompt — fix the final City Guide plan blockers

Revise these two documents:

1. `docs/superpowers/plans/2026-08-27-city-guide-events-and-saves.md`
2. `docs/superpowers/specs/2026-08-27-city-guide-events-and-saves-design.md`

Do not implement the feature or edit production code. Verify each change against the current
Eigen checkout and its installed Relay packages. Do not run Jest and never use
`--findRelatedTests`.

The current verdict is **HOLD**. Most earlier findings are fixed, but Task 13 can still let
"Add Full List" omit unresolved stops, and several proposed tests cannot work as written.
Fix the items below without reopening settled product decisions or adding unrelated
abstractions.

## Must fix

### Task 13: represent resolution completeness

The provider currently stores only entities that have reported:

- `useAllItineraryStopEntities()` returns `Object.values(entities)`.
- `ItineraryAddFullListButton` renders as soon as that array is non-empty.

Resolvers complete independently, so the first successful resolver can make "Add Full List"
actionable while the other stop queries are still pending. Pressing it then follows only that
partial set. This breaks the button's promise to add every saveable stop.

Revise the architecture so it knows:

- the complete set of expected saveable stop IDs;
- which lookups are pending, successful, missing or failed;
- when the complete set is safe to pass to bulk-add;
- what the user sees when one or more entity lookups fail;
- how failed lookups can be retried, or why bulk-add stays unavailable.

Do not expose an actionable bulk-add button until all saveable stops have settled successfully.
Rows may still render independently as their own entities arrive.

Add tests proving:

1. one resolved entity plus pending entities does not enable bulk-add;
2. bulk-add receives every saveable stop once all lookups resolve;
3. a failed or missing entity cannot cause a partial list to be presented as complete.

### Task 13: fix the Relay test harness

One `queueOperationResolver` call does not answer every operation. Relay 18.2 consumes the
queued resolver after one operation:

- `node_modules/relay-test-utils/RelayModernMockEnvironment.js.flow:204-240`

The mock itinerary contains several saveable stops, so the current success test resolves one
query and waits forever for the rest.

Queue one fresh resolver function per expected operation before render, or resolve each pending
operation directly. Do not queue the same function reference repeatedly because Relay removes
all matching references when it consumes that resolver.

The failure test is also invalid:

- queuing a resolver after a request has already started does not resolve that pending request;
- `screen.getByText(/^resolved/)` already matches the initial `resolved 0`.

Resolve or reject specific operations and assert the exact successful or settled count.

### Task 13: define `stops` in the screen

Step 7 mounts:

```tsx
<ItineraryStopEntityResolvers stops={stops} />
```

but never defines `stops` in `ItineraryScreen`. Show the exact derivation from
`itinerary.sections` after the itinerary null check, and use that same set to establish the
provider's expected saveable stops.

### Task 14: reject every mutation in the failure test

This loop repeatedly rejects the same most-recent operation:

```tsx
env.mock.getAllOperations().forEach(() => {
  env.mock.rejectMostRecentOperation(new Error("nope"))
})
```

Earlier mutation promises remain pending, so `mapWithLimit` never settles and the test hangs.
Reject each operation explicitly:

```tsx
act(() => {
  env.mock.getAllOperations().forEach((operation) => {
    env.mock.reject(operation, new Error("nope"))
  })
})
```

Keep the assertion that the button returns to idle and does not claim success.

### Task 15: preserve error behavior through `useFollowShow`

`ShowFollowButton` currently:

- receives GraphQL errors through `onCompleted(_response, errors)`;
- receives the network `Error` through `onError(error)`;
- logs both cases and clears its in-flight state.

`useFollowShow` currently exposes only:

```ts
onCompleted?: (isFollowed: boolean) => void
onError?: () => void
```

and discards GraphQL errors. The plan therefore cannot preserve the component's existing error
behavior with the stated hook interface. Extend the hook callback types and forwarding so the
migrated component can receive the Relay errors it handles today. Specify the corresponding
tests.

### Task 4: use fair tracking events

`CityEventFairSaveControl` currently plans to send `SaveShow` and `UnsaveShow` with a Fair owner.
Eigen already defines:

- `Schema.ActionNames.FollowFair`
- `Schema.ActionNames.UnfollowFair`

at `src/app/utils/track/schema.ts:276-277`. Use those names and assert both directions in the
tests. This follows the plan's own rule to reuse existing action names.

## Fix while editing the affected tasks

- **Task 11:** `toContainElement` is not installed or registered in Eigen's Jest setup. Replace
  it with `within(rows[0]).getByText("Frieze London")` or another supported positional
  assertion.
- **Task 14:** Assert the profile mutation name through
  `operation.request.node.operation.name`, matching existing Eigen tests.
- **Task 14:** Add direct tests for `followProfileMutationConfig`, including its variables,
  optimistic response ID and `isFollowed` store write.
- **Task 14:** The static `Seed` harness proves button states and operation counts, but not the
  optimistic mutation → resolver → provider → "Added" transition. Add one integration test for
  that flow or state explicitly that the manual check is its only coverage.
- **Task 15:** Replace Task 13's binary SHOW-versus-other control selection with an explicit
  SHOW / FAIR / PARTNER branch when `CityEventPartnerSaveControl` lands.
- **Tracking tests:** Import `mockTrackEvent` from
  `app/utils/tests/globallyMockedStuff` before asserting on it.
- **Spec:** Remove the stale claim that `partner.slug` is added to `CityGuideShow_show`; the
  plan correctly says no consumer uses it.
- **Spec:** Update the component-reuse section that says the itinerary keeps its row-owned
  query-per-slug save control. Task 13 moves those queries into screen-owned resolvers.

## Keep as-is

Do not churn these parts:

- Task 0's shell escaping is valid, and `pct` is defined before use.
- Task 8's single conditional query and runtime route parsing are sound.
- Task 11's city threading and generated-artifact fallback are reasonable.
- Task 13's effect dependencies, cleanup ordering, operation renaming and independent Suspense
  boundaries are correct.
- Task 14's `commitMutation` `onCompleted(data, errors)` signature and bounded batching are
  valid for Relay 18.2.
- Task 15's fragment test query, feature-flag injection, provisional labels and `variant`
  propagation are appropriate.

## Output

Edit the plan and spec directly. Then report:

1. how the provider now prevents incomplete bulk-adds;
2. the corrected Task 13 and Task 14 test mechanics;
3. how `useFollowShow` preserves GraphQL and network error behavior;
4. every smaller correction applied;
5. a final **GO**, **GO WITH FIXES** or **HOLD** verdict.
