# Add to Itinerary Sheet

**Goal:** Tapping the plus opens a bottom sheet listing your itineraries for the city, with the
ones already holding this stop ticked. You can create a new itinerary from it. Stops land in a
section called "My Stops".

Modelled on the artwork-lists sheet (`src/app/Components/ArtworkLists/`): an
`AutomountedBottomSheetModal`, a list of selectable rows, a "Create New" row, and a sticky
footer button that applies the change and toasts.

## Decisions taken (reviewed 2026-09-14)

**The plus replaces following. There is no follow any more.** Not "both" — tapping the plus
adds to an itinerary and nothing else. This applies everywhere the plus appears, including the
**Show screen's own follow button and the Saves tab's rows**, which are in scope, not out of it.

**A new itinerary is called `<City> <Month> <Year>`** — "London October 2026". Where no city is
available (the Show screen reached from outside City Guide), leave the city out: "October 2026".

**Where no city is available, do not show the city.** The sheet works without one: it lists the
user's itineraries unfiltered rather than by `citySlug`.

### Still open

**The create form has no submit affordance in any node yet.** 198:64270 is the title and the
input only; 198:64498 is the drag handle; 198:64496 is the backdrop (black, 42% opacity). Either
get a node for it or give the create view a "Create" button in the same sticky footer the select
view uses.

**Dropping follow strands two things, and they need an answer before task 6.**

- The Saves tab's "Followed Shows", "Followed Fairs" and "Followed Galleries" lists are _built_
  from follows. With nothing following, they stop filling, and the tick on their rows is
  currently the only way to _unfollow_ — so replacing it with add-to-itinerary leaves a user no
  way to remove something already there. Either those lists become itinerary-backed too, or
  their rows keep a real unfollow, or the sections go.
- `ShowFollowButton`, `FairFollowButton` and `PartnerFollowButton` are shared, Artsy-wide
  components. Repointing them at City Guide itineraries changes behaviour for every screen that
  renders them, not only City Guide. Worth grepping their callers and deciding per caller.

## What the API allows

No new mutations needed. `createItinerary`, `createItinerarySection`, `createItineraryStop` and
`deleteItineraryStop` are all present.

Two gaps shape the work:

**Nothing says which itineraries hold a given entity.** `Show.isOnCityItinerary` was asked for
and does not exist. So the sheet reads `me.itinerariesConnection(citySlug:)` — unfiltered where
no city is known — with
`sections { stops { internalID item { __typename ... internalID } } }` and works the ticks out
client-side. Bounded — a city has a handful of itineraries — but it is a real cost per open.

**A stop needs a section id.** `createItineraryStop` takes `itinerarySectionID`, so each
itinerary needs a "My Stops" section, created on first add.

### A risk worth naming

This adds a fourth reader of `me.itinerariesConnection`, and `ItinerarySection` and
`ItineraryStop` still have no `id` in the schema, so Relay keys their records positionally.
Every additional query over the same itineraries with a different field set is another chance
to overwrite those slots — the bug behind "this stop is no longer available". The interim
guards hold the last resolved value on the screens that read it, and the sheet holds its own
snapshot while open. The `id` ask in `city-guide-itinerary-api-asks.md` gets more pressing with
this change, not less.

## The sheet

Two views in one modal, as the artwork-lists sheet does it.

### Select view (285:18338)

| Element        | Design                                            | Build                                                                     |
| -------------- | ------------------------------------------------- | ------------------------------------------------------------------------- |
| Handle         | 40 × 1, mono60                                    | `AutomountedBottomSheetModal`'s default handle                            |
| Title          | "Add to Itinerary", 20/32                         | `Text variant="md"`                                                       |
| Create row     | ＋ 16px + "Create New Itinerary", 13/20           | `AddStrokeIcon` + `Text variant="xs"`, left                               |
| Count          | "1 selected", 13/20, mono60                       | right of the same row                                                     |
| Row            | 40 × 40 image, title 13/20, "1 stop" mono60       | reuses `ItineraryListItem`'s shape, not the component: that one is a link |
| Selected row   | 1px border `#1023D7`, radius 10, filled tick 26px | `blue100` border; `CheckmarkCircleFillIcon`                               |
| Unselected row | no border, empty circle                           | `CheckmarkCircleIcon`                                                     |
| Footer         | black pill, h50, radius 50, full width, "Done"    | `Button block` in `footerComponent`                                       |

Snap points `["50%", "95%"]`, matching the artwork-lists sheet.

Selection is local until Done, again like artwork lists. Done applies every change, dismisses,
and toasts. The annotation says exactly that: "closes sheet, animates down, triggers
confirmation toast".

Applying means, per itinerary: newly ticked → ensure a "My Stops" section, then
`createItineraryStop`; newly unticked → `deleteItineraryStop` on the stop that points at this
entity. Nothing for rows you did not touch.

### Create view (198:64270)

Title "New Itinerary", one input placeholder "Name your Itinerary", a `0 / 40` counter under it
on the right, 40-character limit. `createItinerary` with `{ citySlug, title }`, then the new
itinerary is ticked and the view returns to the select list with it selected.

The name defaults to `<City> <Month> <Year>` — "London October 2026", or "October 2026" with no
city — which is also what an itinerary created implicitly is called. Submit affordance is the
open question above.

## Where the plus lives

`CityEventSaveControls` is the one chokepoint: the event rails and rows, both map converters
(`showsToMapSections`, `fairsToMapSections`) and the itinerary stop rows all go through it. So
the sheet is wired there once and every City Guide surface gets it.

In scope too: the Show screen's own follow button and the Saves tab's rows — following goes
away app-wide for shows, fairs and galleries, so `ShowFollowButton`, `FairFollowButton` and
`PartnerFollowButton` are repointed at the sheet. Read the second "still open" note first: this
reaches screens well beyond City Guide, and it removes the only unfollow affordance the Saves
tab has.

Custom stops keep `CustomStopSaveControl`, which already copies a stop — it needs the same
sheet eventually, but its payload is fields rather than an entity, so it is a separate pass
unless you want it now.

## Sections on your own itinerary

Today the itinerary screen hides section headings whenever the itinerary is not curated. With
"My Stops" that rule gets sharper:

- Sections with no stops are not rendered at all.
- If exactly one section has stops, no heading shows — just the stops.
- If more than one has stops, each keeps its heading, so the list stays readable.

A curated guide is untouched: it keeps its headings and its numbering.

## Files

- Create `src/app/Scenes/CityGuide/Components/AddToItinerarySheet/AddToItinerarySheet.tsx` — the
  modal and its two views
- Create `.../AddToItinerarySheet/components/AddToItineraryRow.tsx` — one selectable itinerary
- Create `.../AddToItinerarySheet/components/CreateItineraryForm.tsx` — the create view
- Create `.../AddToItinerarySheet/useApplyItinerarySelection.ts` — turns ticks into mutations
- Create `.../AddToItinerarySheet/utils/itinerariesHoldingItem.ts` — which itineraries hold this
  entity, and the stop id to delete
- Modify `src/app/Scenes/CityGuide/Components/CityEventSaveControls.tsx` — the plus opens the
  sheet
- Modify `src/app/Scenes/CityGuide/hooks/useCityItineraryStops.ts` — section named "My Stops",
  and a `sectionTitle` no longer derived from the city
- Modify `src/app/Scenes/CityGuide/Screens/Itinerary/ItineraryScreen.tsx` — the section rules
  above

## Tasks

**1 — "My Stops".** Rename the section the hook creates, and drop `cityName` from the section
naming. Tests: a new itinerary's section is called "My Stops"; an existing "My Stops" section
is reused rather than duplicated. Commit.

**2 — Section rules on your own itinerary.** Empty sections unrendered; one populated section
means no headings; two or more keep them; a curated guide unchanged. Tests for each of the
four. Commit.

**3 — The row and the select view.** The sheet renders your itineraries with ticks derived from
which hold the entity, the count line, and the create row. Tests: ticks reflect the entity's
itineraries; tapping toggles locally without firing a mutation; the count follows the ticks.
Commit.

**4 — Apply on Done.** Newly ticked itineraries get a stop, newly unticked lose theirs,
untouched ones are left alone; then dismiss and toast. Tests: one `createItineraryStop` per
newly ticked itinerary with the "My Stops" section; `deleteItineraryStop` for an unticked one;
no mutation for an untouched row; a failure leaves the sheet open and says so. Commit.

**5 — Create view.** Name input with the 40-character counter, `createItinerary`, then back to
the list with the new itinerary ticked. Tests: the counter tracks input; the mutation carries
citySlug and title; an empty name cannot be submitted. Commit.

**6 — Wire the plus in City Guide.** `CityEventSaveControls` opens the sheet instead of
following. Tests: tapping the plus on a rail card opens the sheet and fires no follow mutation.
Commit.

**7 — Wire the plus outside City Guide.** `ShowFollowButton`, `FairFollowButton` and
`PartnerFollowButton`, which reaches the Show screen and the Saves tab. Blocked on the second
"still open" note: decide what the Saves tab's lists are built from once nothing follows, and
whether every caller of those three components should change. Commit.

Each task ends with `yarn tsc`, the CityGuide suite, and lint on the changed files.

## Worth flagging

- **RNTL performs no layout.** Four bugs on this branch have been invisible to tests for that
  reason. The sheet's footer and the 50% snap point need a look on a device.
- **The ticks cost a query per open.** Acceptable for a handful of itineraries; it would not be
  if a user had dozens, and `Show.isOnCityItinerary` remains the right fix.
- **A stop's identity is its fields, for custom stops.** Not a problem here — this sheet only
  handles entity stops — but it is why custom stops keep a separate control for now.
