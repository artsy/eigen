# Itinerary stop cards, by type

**Goal:** Rebuild the itinerary stop row to the new card designs, which vary by what the stop
points at, and link each to the right destination.

**Figma:** `247:76708` — a board of variants, each annotated with its format.

---

## The five variants, as the designs define them

| Card                                    | Lines                                                                                    | Links to                          |
| --------------------------------------- | ---------------------------------------------------------------------------------------- | --------------------------------- |
| **Custom** (cafe, restaurant, landmark) | name / type / hours                                                                      | the source link it was built from |
| **Event** (partner-created, on Artsy)   | event name / location / hours · admission                                                | the event                         |
| **Show**                                | show name / 🏛 (if museum) location name / hours · admission / _Opening Reception today_ | `/show/:slug`                     |
| **Museum or Gallery** (no active show)  | name / neighborhood location / hours · admission                                         | `/partner/:slug`                  |
| **Fair**                                | fair name / location / hours · admission                                                 | `/fair/:slug`                     |

Layout is the same throughout: a 60×70 rounded image, then a 275-wide column of 20pt lines.
Three lines normally, four on a show with a reception (the card grows to 90). Hours and
admission sit on one line separated by a 4pt dot.

Gravity's vocabulary behind this: `ItineraryStop::CATEGORIES` is `MUSEUM GALLERY SHOW FAIR`,
and the event kinds the designs name come from `PartnerShowEvent::EVENT_TYPES` — "Opening
Reception", "Closing Reception", "Artist Talk", "Performance", "Guided Tour", "Screening",
"Workshop", "Other".

## What I can build now, and what I cannot

**Buildable in full — three variants.** `ItineraryStop.item` resolves to `Show | Fair |
Partner`, and between them they carry everything these three need:

- **Show** — `item.name`, `item.partner.name` for the location line, `item.isFreeAdmission`,
  `item.href`. The 🏛 comes from the stop's own `category === "MUSEUM"`.
- **Museum/Gallery** — `item.name`, `item.location.neighborhood` (which exists now),
  `item.href`.
- **Fair** — `item.name`, `item.location`, `item.href`.

**Partly buildable — Custom.** Name and hours work from the stop's own fields. Its **type line
and its link do not**: the annotation says a custom stop "pulls information from link", and
Gravity stores `source_url` on the row, but Metaphysics does not expose it. So a cafe card
renders name and hours, with no type line and no tap target.

**Not buildable — Event.** `ItineraryStop` exposes `eventID` but no resolved `event` and no
`eventType`, so there is no way to know a stop is an event, what kind it is, or what it is
called. The whole variant is blocked, and so is the show card's fourth line: "Opening Reception
today" needs the associated event's kind.

### Three API asks this adds

1. **`ItineraryStop.sourceURL`** — Gravity has the column. Unblocks the custom card's link.
2. **`ItineraryStop.event`** resolving to the event, with its kind and name. Unblocks the
   Event variant entirely.
3. **A stop's reception, or the show's** — enough to render "Opening Reception today". Falls
   out of (2) if a reception is modelled as the stop's event; otherwise the show needs to
   expose its own events.

A "type" line for custom stops also has no field at all. Worth deciding whether it is derived
from the source link server-side or entered by the author as free text.

## Decisions

- **One component, switching on what resolved**, not five. The variants share a layout and
  differ in which lines they fill, so a single `ItineraryStopCard` reads the stop and its item
  and decides. Five near-identical components would drift.
- **The variant is inferred, not stored.** `item.__typename` gives Show/Fair/Partner; the
  stop's `category` distinguishes a museum from a gallery for the emoji; no item at all means
  a custom stop. `eventType` would be the fifth signal once it exists.
- **Admission** prefers the stop's own `isFreeAdmission` over the item's, since an author can
  override it per stop.
- **Hours** stay server-formatted, from the `startAt`/`endAt` `format` arguments already used.
- **The blocked lines are omitted, not faked.** No placeholder "Opening Reception" text and no
  dead tap target on a cafe.

## Tasks

- [ ] **1. `stopCardFields`** — derives the card's lines and href from a stop plus its item:
      title, subtitle, hours, admission, emoji, href. Pure, so every type combination is testable
      without rendering.
- [ ] **2. `ItineraryStopCard`** — renders those lines in the designs' layout, replacing
      `ItineraryStopRow`'s internals. Keeps the existing save control and optional number.
- [ ] **3. Widen the query** — `item` needs `partner { name }`, `location { neighborhood }`,
      `href` and `isFreeAdmission` per member.
- [ ] **4. Verify** — `yarn relay`, `yarn tsc`, eslint, new tests, the CityGuide suite.
