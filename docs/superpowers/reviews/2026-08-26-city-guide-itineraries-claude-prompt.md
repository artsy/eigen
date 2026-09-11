# Claude Review Prompt — City Guide Itineraries

Copy the prompt below into Claude Code from the root of `artsy/eigen`.

---

Review an unimplemented design spec and implementation plan in this repository.

Branch: `city-guide-itineraries-docs`

Primary source:

`docs/superpowers/handoffs/2026-08-26-city-guide-itineraries-handoff.md`

Prior review findings:

`docs/superpowers/reviews/2026-08-26-city-guide-itineraries-review.md`

Nothing has been implemented. Do not edit code, the spec, the plan, generated files, or the review
documents.

Treat the prior review as an adversarial input, not as truth. Independently verify every finding
against the current repository before accepting it. Pay particular attention to generated Relay
types, mutation inputs, normalized field names, test-helper behavior, navigation matching, Mapbox
types and mocks, feature flags, package exports, and AGENTS.md conventions.

For every `BLOCK-*`, `FIX-*`, and `CLAIM-*` item, return:

1. **Verdict:** Confirm, Modify, or Reject.
2. **Evidence:** Exact repository file and relevant line.
3. **Reasoning:** Why the evidence supports the verdict.
4. **Required amendment:** Concrete change to the spec or numbered task, if any.

Then provide these sections:

## Missing findings

List material problems neither the original handoff nor the prior review identified.

## Corrected data model

Give a concrete TypeScript target shape suitable for the backend API design session. Resolve:

- stable section identity versus freeform display titles;
- Show versus Partner/Profile save identifiers;
- saveable versus non-saveable editorial stops;
- ordering semantics;
- time display versus structured schedule data;
- prose versus emoji/annotation content.

Keep the model no more complex than the demonstrated requirements justify.

## Extraction decisions

Give a direct verdict on both `useFollowShow` and `SaveButton`: shared now or scene-local now. Base
the decision on current code, not promised future consumers.

## Map architecture decision

Choose one:

1. Extend `CityGuideMapPins`.
2. Create a local `ItineraryMapPins` used by `ItineraryMapView`.
3. Extract a lower-level shared map-layer primitive.

State why, and identify the exact component responsibilities.

## Known-gap disposition

Classify each known gap as blocking, pre-release, or acceptable deferral.

## Corrected task plan

For Tasks 1–10, list the exact amendments required. Check that each task leaves the repository in
a compiling, tested, lint-clean, committable state and uses the AGENTS.md pre-commit commands.
Identify every proposed test that is not genuinely red before implementation or cannot become
green with the supplied code.

## Final decision

Choose exactly one:

- Ready to implement as written.
- Ready after listed amendments.
- Requires spec redesign before implementation planning.

Do not summarize what the original documents say. Lead with defects and evidence. If an external
claim cannot be verified from the repository, label it unverified rather than assuming it is true.

---
