# City Guide Itineraries — Third Review (Fable, v2)

**Branch:** `city-guide-itineraries-docs`
**Date:** 2026-08-26
**Reviewed:** spec v2 + plan v2, as captured in the handoff at commit `5f42c68bb5`.
**Verdict given:** Ready after listed amendments. The design needed no further pass; the plan did.

All findings below were folded into v2.1. This file is the record of what was found, kept so the
amendments in v2.1 can be traced to a cause.

## Blocking

- **B1 — No Suspense or error boundary around the per-stop queries.** The spec promised containment and
  called `withSuspense` load-bearing; no task actually wrote a boundary. The app's only ambient boundary
  is the `RetryErrorBoundary` at `Navigation/AuthenticatedRoutes/ScreenWrapper.tsx:51`, which has no
  `Suspense`, so every save control suspending uncontained would render the whole screen's retry state.
  _Fixed in Task 5: per-control `ErrorBoundary` + `Suspense fallback={null}`._

- **B2 — Tests that render no query crash.** `renderWithRelay` unconditionally calls
  `resolveMostRecentOperation` (`setupTestWrapper.tsx:117`); `relay-test-utils` throws when nothing is
  pending (`RelayModernMockEnvironment.js:220`). Task 5 tests 2-3, all of Task 6, and Task 8 tests 3-4
  render stops with `saveTarget: null` and issue no query. The plan cited this exact failure mode as
  BLOCK-04 and then walked into it. _Fixed: those renders now use `renderWithWrappers`._

- **B3 — Multi-query renders resolve one operation, and the single root Suspense hides the tree.**
  `renderWithWrappers` provides one root `Suspense fallback="Loading..."` (`renderWithWrappers.tsx:104`),
  so with three of four controls still suspended the whole tree is replaced. _Fixed by B1's per-control
  boundaries; assertions now target screen chrome, never save icons._

- **B4 — Curated rows do not navigate, and the test asserts an impossible prop.** `hasChildTouchable`
  makes RouterLink render nothing and clone `onPress` onto its child (`RouterLink.tsx:92-99`); the child
  was a styled `View`, which ignores it. And `to` is destructured out of props (`RouterLink.tsx:29-38`)
  and never lands on a rendered element. _Fixed: dropped `hasChildTouchable`, assert on mocked `navigate`._

## Should-fix

- **S1 — `includeAllShows` defaults to `false`,** so a mock built from running London shows silently
  loses save controls as shows close. _Fixed: query passes `includeAllShows: true`._
- **S2 — `useFollowProfile` declares `isFollowed: boolean | null`** and breaks the moment `<any>` is
  replaced with the generated type, exactly as BLOCK-03 forced for `useFollowShow`. _Fixed: widen it._
- **S3 — `expo-linear-gradient` is not a dependency.** The repo has `react-native-linear-gradient` 2.8.3
  with a default export. _Fixed._
- **S4 — Every non-London city renders three dead rows,** re-creating BLOCK-06 per city. _Fixed: rows
  filter through `getMockItinerary`; the section renders nothing when none resolve._
- **S5 — The Android `pathPrefix` widens exposure of the ungated placeholder screen.** _Changed to a
  decision point defaulting to defer._
- **S6 — `Partner.profile` is nullable,** so a gallery target can silently yield no control. _Recorded in
  the spec's API-session notes._

## Optional, and one correction

- **O1 — the earlier MISS-02 claim was wrong.** Round 2 said `CityGuideEvent`'s button "works only
  because its `optimisticResponse` is payload-shaped". Verified: that mutation's `optimisticResponse`
  omits `id`, and the Relay compiler adds `id` to the normalization AST
  (`CityGuideEventMutation.graphql.ts:138`), so the optimistic payload cannot merge either. Both paths
  are broken; the button flips only after the network returns. _Corrected in spec and handoff._
- **O2** — shared mock env needs `env.mockClear()`. _Fixed._
- **O3** — `passWithNoTests` is not set, so `--findRelatedTests` can exit non-zero on Tasks 1 and 4.
  _Fixed._
- **O4** — `startAt`/`endAt` are dead this pass; mark them reserved. _Fixed._
- **O5** — stops deliberately duplicate entity display data. _Recorded in the API-session notes._

## Checked and found sound

Schema claims (`show(id:)`/`partner(id:)` slug support, both follow input shapes, `Profile.internalID`
and `isFollowed`); the ungated `/city-guide` route and both feature flags; three inline `followShow`
copies; `setShowFollowed`; the `CityGuideShow_show` typing; `CityGuideMapPins` at 94 lines; the Mapbox
mock's missing `Camera`/`CircleLayer`; manifest ordering; the `ItineraryStopSaveControl` two-branch split
(hooks never conditional); the whole Mapbox extraction in Task 4; Task 3's hook and its `renderHook`
pattern; Task 10's converter and its tests.
