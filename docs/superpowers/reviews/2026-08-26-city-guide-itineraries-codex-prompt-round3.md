# Codex Review Prompt — City Guide Itineraries, Round 3

Paste the prompt below into Codex from the root of `artsy/eigen`.

---

Adjudicate a disagreement between two reviews of an unimplemented feature in this repository, then
stress-test the corrected design that came out of it.

Branch: `city-guide-itineraries-docs`

Read in this order:

1. `docs/superpowers/handoffs/2026-08-26-city-guide-itineraries-handoff.md` — the original spec and
   ten-task plan under review.
2. `docs/superpowers/reviews/2026-08-26-city-guide-itineraries-review.md` — your round-1 review.
   29 findings: `BLOCK-01`–`BLOCK-06`, `FIX-01`–`FIX-15`, `CLAIM-01`–`CLAIM-08`.
3. `docs/superpowers/reviews/2026-08-26-city-guide-itineraries-second-review.md` — the round-2
   response. It verified each of your findings against the repository and returned 22 Confirm,
   6 Modify, 1 Reject, then proposed a corrected data model, extraction decisions, a map decision,
   and a corrected task plan.

Nothing has been implemented. Do not edit code, generated files, the spec, the plan, or any review
document. Round 2 is not authoritative — it is the opposing brief. Verify its evidence yourself.

## Part 1 — Adjudicate the seven disagreements

Round 2 did not accept these at face value. For each, rule **Round-1 correct**, **Round-2 correct**,
or **Both partly wrong**, and give the deciding evidence with exact file and line.

- **FIX-03** — Round 2 says writing the `is_followed` alias key is _inert, not harmful_, because Relay
  keys records on the schema field name. It cites `relay-runtime/lib/store/RelayStoreUtils.js:71-78`
  and `src/__generated__/ShowItemRowMutation.graphql.ts:66-72`. Is the mechanism right, and does it
  change the severity you assigned?
- **FIX-06** — Round 2 accepts structured time fields but rejects the typed
  `{ kind: "TEXT" | "EMOJI" }` annotation, on the grounds that a plain string was an explicit
  product-owner decision recorded during brainstorming. That decision is not in the repository. Rule
  on the engineering merits alone, and state separately whether an unrecorded product decision should
  bind a data model that is about to become an API contract.
- **FIX-11** — Round 2 downgrades this to polish because `.eslintrc.js:145-150` explicitly sanctions
  the `no-restricted-imports` disable as an escape hatch. Does the rule's own wording justify the
  downgrade?
- **FIX-12** — Round 2 splits your finding: it confirms the mount-animation defect but rejects the
  claim that a single-icon swap is a capitulation to the Jest mock. Does the spec's "scale-and-fade
  crossfade" wording bind the implementation, given the originating request said only "a cute
  animation"?
- **FIX-15** — Round 2 **rejects** this outright. It argues `docs/best_practices.md:209,213` sit under
  the "VirtualizedList best practices" heading at `:205`, that 5-15 static rows in a
  `Screen.ScrollView` nest nothing and are not virtualized, and that repo practice contradicts you:
  `AuctionBuyersPremium.tsx:40,63`, `ArtworkAttributionClassFAQ.tsx:20,26`, and the parent screen
  `CityGuideNew.tsx:40-55` rendering `CityGuideCuratedLists.tsx:25`'s `data.map(...)`. Verify each
  citation. Is the rejection sound?
- **CLAIM-05** — Round 2 confirms your finding but calls its framing incomplete: the
  `@TODO: Implement test` marker also appears at `CityGuideEventList.tsx:35`,
  `CityGuideAllEvents.tsx:74`, `CityGuideSavedEventSection.tsx:15`, and
  `CityGuideFairEventSectionCard.tsx:16`. Verify.
- **CLAIM-06** — Round 2 says there are three sort breaks in the Android manifest, not one
  (`:92-93`, `:109-110`, `:142-144`). Verify.

## Part 2 — Test the round-2 claims you have not seen before

Round 2 raised seven findings of its own (`MISS-01`–`MISS-07`). Verify each independently. Two carry
the most weight:

- **MISS-01** — "Nothing gates `/city-guide`." Round 2 claims `src/app/Navigation/routes.tsx:1128-1131`
  registers the route with no feature-flag check and that `routes.tsx` contains no `useFeatureFlag` at
  all, so `CityGuideNew` and its `picsum.photos` placeholders are deep-link reachable in production
  today. This is the fact under which round 2 escalated `BLOCK-02`. Confirm or refute it. If confirmed,
  say whether it belongs in this sub-project or should be escalated separately.
- **MISS-02** — "`CityGuideEvent.tsx:62-65`'s optimistic updater is already dead code on `main`."
  Round 2 says the button still works because the `optimisticResponse` at `:53-61` is payload-shaped
  and Relay normalizes its alias correctly, making this latent dead code rather than a user-visible
  bug. Confirm, refute, or sharpen.

## Part 3 — Attack the corrected data model

The "Corrected data model" section of round 2 is the artefact that will be carried into a backend API
design session, so an error there is the most expensive error available. Attack it specifically:

- Can `ItinerarySaveTarget` as written drive both `followShow` and `followProfile` with no casts and no
  invented identifiers? Write out the exact call for each variant.
- Is collapsing galleries and fairs into a single `PROFILE` variant correct, or does it lose something
  a consumer needs?
- Round 2 deletes `order` and derives the stop number from the flattened index across sections. Does
  that hold if a section is filtered out on the map, if the backend returns sections out of order, or
  if two sections are collapsed in the list?
- Is `saveTarget: null` the right way to model a non-Artsy editorial stop such as a cafe, or does it
  push a rendering decision into the type?
- `displayTime` plus optional `startAt`/`endAt`: does carrying both invite the same dual-source-of-truth
  problem that `order` was deleted for?
- Name anything the model omits that the Figma designs demonstrably require.

## Part 4 — Rule on MISS-04

Round 2 rejected all three of your `BLOCK-02` options in favour of a fourth: keep the itinerary
_structure_ mock, but populate `saveTarget` with real Show `internalID`s and Relay node ids so
`useFollowShow` fires a genuine mutation. It argues this makes the save persist, reuses existing auth
and error handling, removes the need for fake-success copy, and preserves the working tick-and-toast
the original request asked for.

Rule on it. Address specifically: where real identifiers come from and how they stay valid; behaviour
for a signed-out user; what happens when a hardcoded show closes or its id changes; whether a mutation
against a real entity from a mock screen creates data-integrity or analytics problems; and whether this
is genuinely better than deferring the save control to the save sub-project.

## Part 5 — Verdict

Answer these directly:

1. Does round 2's amended plan leave any of your original 29 findings inadequately addressed? List
   them.
2. Does round 2 introduce any new defect of its own?
3. Round 2's final decision is **"requires spec redesign before implementation planning"**, on the
   grounds that `BLOCK-01` and `BLOCK-02` are spec-level while the other 27 findings are task-level.
   Do you agree, or is the correct call "ready after listed amendments"?
4. If you agree a spec redesign is needed, state the minimum set of spec changes that would let
   implementation planning resume. Be specific about which sections change and how.

Lead with defects and evidence. Do not summarize what the documents say — all three were written for
this review. Where you cannot verify a claim from the repository, label it unverified rather than
assuming either review is right.
