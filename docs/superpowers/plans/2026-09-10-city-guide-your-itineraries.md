# Your itineraries, per city

**Goal:** Replace the single "Your London Itinerary" summary row with the user's own
itineraries for that city — a rail on the home screen, a full list screen, and a switcher on
the itinerary map.

**Figma:** home rail `176:61737` · list screen `129:52001` · map switcher `198:65022`

---

## What replaces what

`CityGuideItinerarySummary` currently renders one `CityGuideEventSummaryRow` — a count of
followed shows plus followed fairs, linking to `/city-save/:citySlug`. It goes. In its place:

| Piece                                                          | Design      | Data                                  |
| -------------------------------------------------------------- | ----------- | ------------------------------------- |
| `CityGuideItinerariesRail` on the home screen                  | `176:61737` | `me.itinerariesConnection(citySlug:)` |
| `CityItinerariesScreen` at `/city-guide/:citySlug/itineraries` | `129:52001` | same, paginated                       |
| `ItineraryPicker` in the itinerary map's header                | `198:65022` | same, plus the current id             |

## Measurements

**Home rail** (`176:61737`) — `mono5` band, `px 20`, `pt 10`, `pb 20`, `gap 10`. Header is
`md` + 18px chevron. Cards: white, `radius 8`, drop shadow `0 2 10 rgba(0,0,0,0.08)`, a 60×60
image with only its left corners rounded, then title `sm` medium and "N stops" `xs`/`mono60`.
Card widths differ in the mock (225, 264), so they size to their content rather than a fixed
width.

**List screen** (`129:52001`) — back chevron, `lg-display` title "Your Itineraries", rows of
60×60 image + title `sm` + "N stops" `xs`/`mono60`, and a 24px share icon at the right.

**Map switcher** (`198:65022`) — the header keeps its solid background (explicitly not
transparent). Back chevron left; on the right a pill: 1px `mono100` border, `radius 50`,
`h 30`, `px 15`, label `xs`, then an 18px down chevron.

## Two schema gaps, and what I do about them

1. **`Itinerary.stopsCount` does not exist** — only `sectionsCount`, and `stopsCount` per
   section. Every card and row shows "N stops". I sum `sections { stopsCount }` client-side.
   Correct, and cheap, but it fetches every section to render one number; §5 of the API asks
   already requests the field.
2. **`Itinerary` has no `createdAt`** — and `publishedAt` is null for a private personal
   itinerary. The list design groups rows under a blue `#1023D7` year label ("2026"), and
   there is no date to group by. **I am leaving the year label out** rather than deriving a
   year from the name, which would be guesswork. It needs `Itinerary.createdAt`; Gravity has
   the column already (`timestamps` in the create migration), so this is a Metaphysics field.

## Decisions

- **City-scoped, per your instruction.** The mocks show London, Paris, Berlin and Europe
  together, but the ask is "all your itineraries for one city", so every query passes
  `citySlug`. The screen title stays the design's "Your Itineraries" rather than naming the
  city, since the city is already the context you arrived from.
- **Share is a stub for now.** The row's share icon needs `shareToken` minting, which is
  `updateItinerary` with the token flags — a mutation that throws today. It renders and calls
  a handler that does nothing but is wired for later, rather than being omitted and needing
  the row rebuilt.
- **Cards size to content** on the rail, capped so one long name cannot fill the screen.
- **Empty state:** the rail renders nothing at all when the user has no itineraries for the
  city — same as the section it replaces, which hid itself at count 0.

## Tasks

- [ ] **1. `ItineraryListItem`** — the shared row: 60×60 image, title, "N stops", optional
      right slot for the share icon. Used by both the rail card and the screen row, which differ
      only in chrome. Test: renders title and count; pluralises "1 stop".
- [ ] **2. `stopsCount` helper** — sums `sections { stopsCount }`. Test: sums across sections,
      returns 0 with none.
- [ ] **3. `CityGuideItinerariesRail`** — the home rail, replacing `CityGuideItinerarySummary`
      at its place in `CityGuideNew`. Test: one card per itinerary, renders nothing when empty,
      header navigates to the list screen.
- [ ] **4. `CityItinerariesScreen`** + route `/city-guide/:citySlug/itineraries`. Test: rows
      render, tapping one opens that itinerary, paginates.
- [ ] **5. `ItineraryPicker`** in the itinerary map header. Test: shows the current
      itinerary's name, lists the others, selecting one switches.
- [ ] **6. Verify** — `yarn relay`, `yarn tsc`, eslint, the new tests, and the CityGuide suite.
