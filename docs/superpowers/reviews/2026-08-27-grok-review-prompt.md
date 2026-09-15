# Review prompt for Grok 4.6 — City Guide events and city itineraries

Paste everything below the line. Grok runs in `/Users/mounirdhahri/work/eigen` and can read
the repo plus the sibling checkouts, so it verifies claims itself rather than trusting a packet.

---

You are reviewing two planning documents for a feature in Eigen, Artsy's React Native app.
You are running in the repo, so verify claims against the actual code rather than reasoning
about them. Do not write or edit any code. Do not implement anything.

## Read first, in this order

1. `docs/superpowers/specs/2026-08-27-city-guide-events-and-saves-design.md` — the design spec
2. `docs/superpowers/plans/2026-08-27-city-guide-events-and-saves.md` — the 16-task implementation plan
3. `docs/superpowers/HANDOVER.md` — the prior sub-project's state and its hard-won conventions
4. `AGENTS.md` and `docs/best_practices.md` — repo conventions

The spec has been reviewed once by another model and revised. The plan has not been reviewed
at all. Weight your effort accordingly: the plan is the main target.

## What you can verify, and where

- The GraphQL schema is `data/schema.graphql`. It is the source of truth for what is queryable.
- Metaphysics is checked out at `../metaphysics`; Gravity at `../gravity`. Both are readable.
  Resolvers and Mongo scopes matter more than schema docstrings, which have been misleading
  here before.
- The existing feature code is under `src/app/Scenes/CityGuide/`. The itinerary sub-project
  the plan reuses components from is in `src/app/Scenes/CityGuide/Screens/Itinerary/`.
- Shared follow hooks are `src/app/utils/mutations/useFollowShow.ts` and `useFollowProfile.ts`.

**Do not run the Jest suite, and never use `--findRelatedTests`.** Both are unreliable in this
repo; one `--findRelatedTests` run sat for eight minutes before being killed. `yarn tsc` and
`yarn relay` are safe. Reading code is preferred over running anything.

If a claim cannot be checked from what is available, say **UNVERIFIABLE** and say what you
would need. Do not guess and do not soften a guess into a hedge. A subagent in an earlier
round of this project asserted confidently that a tracking event did not exist when it did,
and that error propagated into a spec before being caught.

## Answer with exactly these headings

### 1. Verification table

| Claim | CONFIRMED / WRONG / UNVERIFIABLE | Evidence (`file:line`) |

Cover at minimum:

- Every GraphQL field, argument, enum value and sort the plan's queries use. Do they exist,
  with those argument names, on those types?
- Fragment discipline: each task reads fields off unmasked fragment data. Does every field
  read in Task 8, 11 and 12 get fetched by some task, or by the existing fragment? Name any
  field read but never fetched.
- Cross-task type consistency: do prop names, function signatures and exported symbol names
  used in later tasks match what earlier tasks define? Check `CityEventSection`,
  `CityEventListItem`, `toCityEventListItems`, `CityGuideEventSummaryRow`'s props including
  `countSuffix`, `CityEventShowSaveControl`, `ItineraryStopEntity`, `followShowMutation` and
  `followProfileMutation`.
- The plan's factual claims about existing files, especially: that `ItinerarySectionRow` holds
  its own `isExpanded` state; that `ItineraryStopSaveControl` runs one query per row; that
  `CitySavedList` is 142 lines and queries `RUNNING_AND_UPCOMING` with no `dayThreshold`;
  that `ShowFollowButton` and `Lists/ShowItemRow` still hand-roll `commitMutation`; that
  `GalleryFollow` and `GalleryUnfollow` exist and are unused.
- That `RUNNING` and `UPCOMING` are genuinely disjoint, and that `dayThreshold` is ignored by
  the `running` scope. Check `../gravity`, not the schema comments.
- That `totalCount` actually resolves for `City.showsConnection` and `City.fairsConnection`,
  and that it genuinely does not exist on `FollowedShowConnection`.
- That the `@include(if:)` directives in Task 8's query are valid where they are placed, and
  that the resulting generated types make `data.city.showsConnection` optional in the way the
  component assumes.

### 2. Blocking problems

Anything that would make a task fail or ship wrong behaviour, most severe first. For each,
give the task and step number, what breaks, and the concrete fix. Be specific enough to act on
without further investigation.

Pay particular attention to:

- **Task 13.** `useItineraryStopEntities` calls a hook inside `.map`. The plan admits this and
  offers an alternative in an implementer note. Is the note's alternative actually correct, and
  is the note sufficient, or should the task be rewritten?
- **Task 8.** The screen builds one query with `@include` toggles for two different sections.
  Is a single query with conditional connections the right call, or should it be split?
- **Task 11 Step 1.** One of its tests reads the component's own source file with `fs` and
  asserts on a string. Is that a legitimate guard or a test smell that should be replaced?
- **Task 14.** It commits mutations directly with `commitMutation` and a `Promise.all` fan-out
  rather than through the hooks. Does that lose the optimistic updates the hooks provide, and
  will the rows visibly update after a bulk add?

### 3. Task-by-task executability

One line per task, 0 through 15: could an engineer with no other context execute it from the
text alone? Flag any task that assumes knowledge it does not supply, or whose test would not
actually fail before the implementation is written.

### 4. Design critique

Step back from the plan and question the spec.

- The load-bearing bet is that a user's city itinerary equals their follows within 75km of the
  city, unordered. What user-visible weirdness follows? Is it acceptable for v1, and is the
  spec honest about it?
- Neighbourhood grouping is derived from `Show.location.postalCode` matched against an
  editorial label table, because Gravity stores no neighbourhood. Good idea or trap? Task 0
  gates on real postcode coverage; is that gate designed well, and is its 60% threshold
  defensible?
- One fetch of 100, no pagination, on a screen that groups into collapsible sections. What
  breaks, and at what scale? Is the "Showing 100 of 143" footer an adequate answer?
- The spec omits the "Free / Paid Entry" line rather than mocking it, and omits the share
  icon. Right calls?
- Anything YAGNI that should be cut. Anything missing that will hurt during implementation.

### 5. What the documents get right

Brief. So the author knows what not to churn on.
