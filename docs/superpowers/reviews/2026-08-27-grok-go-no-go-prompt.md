# Grok prompt — go/no-go on the City Guide plan

Paste everything below the line. Grok runs in `/Users/mounirdhahri/work/eigen` and can read the
repo and the sibling checkouts, so it verifies rather than trusting a summary.

---

You are making a **ship-or-hold decision** on an implementation plan, not writing another
critique. You run in the repo, so verify against the code. Do not write or edit any files.

## Read

1. `docs/superpowers/plans/2026-08-27-city-guide-events-and-saves.md` — the plan, 16 tasks
2. `docs/superpowers/specs/2026-08-27-city-guide-events-and-saves-design.md` — the spec
3. `docs/superpowers/reviews/2026-08-27-city-guide-events-and-saves-review-prompt.md` — your own
   previous review's findings
4. `docs/superpowers/HANDOVER.md`, `AGENTS.md`, `docs/best_practices.md`

Both documents have now been through three review rounds: you reviewed them once, another model
reviewed them twice, and every finding was either fixed or explicitly cut with a reason.

## The question you are answering

**Is this plan good enough to start executing?** Not "is it perfect" — it cannot be, and further
rounds have diminishing returns. A plan is good enough when a competent engineer can work
through it task by task without getting stuck on something the plan should have told them, and
without building the wrong thing.

So the bar is: **would any remaining defect stop or mislead an executor mid-task?** A wrong
label in a test they will run anyway is not that. A test harness that throws before any
assertion runs is. A missing decision they cannot make alone is.

## Do not

- Do not run Jest, and never use `--findRelatedTests`. Both hang in this repo. `yarn tsc` and
  `yarn relay` are safe. Reading code is preferred.
- Do not re-litigate settled product decisions. These are decided and are not yours to reopen:
  neighbourhood grouping from postcodes against an editorial table; one user itinerary per city;
  the itinerary being an unordered city-scoped view of global follows rather than its own
  storage; shows **and** fairs in it; the admission line omitted; share omitted; no feature
  flag; every user signed in, so no logged-out handling anywhere; stacking on
  `city-guide-itineraries-docs`.
- Do not propose new features or abstractions.
- Do not pad the list. If something is fine, say it is fine.

## Verify these specifically, because they were rewritten last and are least reviewed

- **Task 0's probe.** Does the bash actually run? The `q()` function nests quotes inside a JSON
  body inside a shell string. Would the GraphQL survive the escaping? Is `pct` defined before use?
- **Tasks 13 and 14's test harnesses.** They now use `createMockEnvironment` +
  `queueOperationResolver` + `RelayEnvironmentProvider` instead of `setupTestWrapper`, because
  `renderWithRelay` resolves one operation unconditionally at render
  (`setupTestWrapper.tsx:112-129`). Is the replacement correct? Will
  `queueOperationResolver` answer _every_ resolver's query, or only the first? Do the
  suspended-render assertions hold?
- **Task 13's provider.** Report effect deps, the forget-on-unmount cleanup ordering, and whether
  renaming the three moved queries to the `ItineraryStopEntityResolvers*` prefix is what Relay
  actually requires.
- **Task 14's `mapWithLimit` and `follow()`.** Is `commitMutation`'s `onCompleted(data, errors)`
  signature right for this Relay version? Does the extracted `followShowMutationConfig` truly
  preserve what `useFollowShow` does today?
- **Task 15's tests.** They supply a `query:` and inject `AREnableFollowShowsAndFairs`. Is that
  now sufficient to render `ShowFollowButton` at all? The plan marks its label assertions
  provisional on purpose — judge whether that is honest or a cop-out.
- **Task 11.** Does adding `fairsConnection` to `CitySavedListScreenQuery` and threading
  `data.city` into the private component work as described? Does the `dayThreshold` assertion
  read the right generated artifact?
- **Cross-task consistency.** Names, props and signatures across tasks. Especially `variant`
  through the three save controls, and the provider's exported hook names.

## Answer in exactly this shape

### 1. Verdict

One of: **GO** / **GO WITH FIXES** / **HOLD**. State it in the first line, then two or three
sentences of reasoning. If GO WITH FIXES, the fixes must be things an executor can apply in
minutes as they reach the task, not another revision round.

### 2. Must fix before starting

Only items that would genuinely stop or mislead an executor. For each: task and step, what
breaks, the fix. If the list is empty, say so — that is a legitimate answer.

### 3. Fix as you go

Things worth correcting when the executor reaches that task, but which do not block starting.

### 4. Accept as-is

Known imperfections you judge not worth another round, so nobody churns on them later. Being
explicit here is as useful as the fix list.

### 5. Riskiest task

Name the single task most likely to go wrong in execution, and what the executor should watch
for. One paragraph.
