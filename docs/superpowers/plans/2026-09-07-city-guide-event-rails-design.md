# City Guide event rails — match the new designs

**Goal:** Rebuild the three City Guide home event sections as horizontal rails matching Figma.

**Scope:** `CityGuideEvents.tsx` and two new card components. Mock data only — no Relay on this branch.

**Figma:** Current Fairs `176:61782` · Current Shows `198:65249` · Opening Soon `176:61875`
(file `HMwmWnpQClcGnwTOcYdyKx`)

---

## What the designs specify

Measurements read off the three frames, with the palette token each maps to.

|                   | Current Fairs                                   | Current Shows                          | Opening Soon                  |
| ----------------- | ----------------------------------------------- | -------------------------------------- | ----------------------------- |
| Card width        | 150                                             | 150                                    | 150                           |
| Image             | 150 × 250                                       | 150 × 150                              | 150 × 150                     |
| Image scrim       | `rgba(0,0,0,0.2)`                               | none                                   | none                          |
| Image corners     | square                                          | square                                 | top corners arched, radius 80 |
| Title             | over image, bottom-left, `lg-display` / `mono0` | under image, `xs` medium / `mono100`   | same as Shows                 |
| Line 2            | —                                               | date range, `xs` / `mono60`            | single date, `xs` / `mono60`  |
| Line 3            | —                                               | "Free" / "Paid Entry", `xs` / `mono60` | —                             |
| Add icon          | 18, over image, bottom-right                    | 18, right of caption, top-aligned      | same as Shows                 |
| Card gap          | 10 = `space(1)`                                 | 10 = `space(1)`                        | 10 = `space(1)`               |
| Image→caption gap | —                                               | 5 = `space(0.5)`                       | 5 = `space(0.5)`              |

Section header in all three: title `md` / `mono100` on the left, 18px chevron on the right —
which is `SectionTitle variant="large"`. Titles read "Current London Fairs", "Current London
Shows", and plain "Opening Soon" (no city).

Shows and Opening Soon are the same card; Opening Soon just omits the admission line. So one
card component with an optional third line, not two near-copies.

## Architecture

Three files, each with one responsibility:

- `Components/CityEventRailCard.tsx` — the 150-wide caption-below card. Props: `image`,
  `title`, `meta`, optional `admission`. Used by Shows and Opening Soon.
- `Components/CityFairRailCard.tsx` — the 150×250 card with the scrim and the title over the
  image. Used by Fairs only.
- `Components/CityGuideEvents.tsx` — the three sections, each a `SectionTitle` plus a
  horizontal `FlatList`. Mock arrays move to the bottom as they are now.

`FlatList` rather than `FlashList`: these are short fixed mock lists inside the home
`ScrollView`, and the file already uses `FlatList`.

## Decisions I am making, and why

1. **Gutter 20 for all three rails.** Figma gives the Fairs frame `px-10` but Shows and
   Opening Soon `px-20`. The rest of the screen sits at 20 (`px={2}`), so the 10 reads as a
   stray frame value rather than intent. Cards bleed past the right gutter, as in the design.
2. **Image height 150, not 149.** Figma reports the Shows/Opening image as `150 × 149` inside
   a `150 × 150` box — a rounding artifact, not a 1px gap.
3. **Titles truncate to one line** (`numberOfLines={1}`), which is what the mock text shows
   ("One Fly Makes No S…", "David Turley: House…").
4. **The Add icon is visual only.** It is the save control in the real feature, but nothing on
   this branch has a save target to mutate, so it renders without an `onPress`. Wiring it is
   its own piece of work.
5. **The arch-topped images in Opening Soon are a rule.** Only three of five cards carry
   `rounded-t-[80px]` in the frame, so I first read it as the mock artwork's own crop. It is
   intended: every Opening Soon image arches at the top, radius 80 on both top corners, which
   past half the card's 150 width renders as a full semicircle. Current Shows stays square.

## Open questions

- **Admission ("Free" / "Paid Entry") has no field behind it.** `Show.isFreeAdmission` does not
  exist in Metaphysics — it is on the missing-fields list in the API handover. Fine to mock
  here; flagging that this line cannot ship on real data yet.
- **Should the fairs rail keep a count anywhere?** The old stub showed "N Fairs". The new
  design shows named cards and no count. I am dropping the count.

## Tasks

- [ ] **1. `CityEventRailCard`** — square-image card with 1–3 caption lines and the add icon.
      Test: renders title, meta, admission when given; omits the admission line when not.
- [ ] **2. `CityFairRailCard`** — 150×250 card, scrim, title over image, add icon.
      Test: renders the title.
- [ ] **3. Rewire `CityGuideEvents`** — three sections using the two cards, `SectionTitle
variant="large"`, city name interpolated into the two "Current …" titles, plus an
      `Opening Soon` section that does not exist yet on this branch.
      Test: all three headers render; each rail renders one card per mock item.
- [ ] **4. Verify** — `yarn tsc`, `eslint`, the new tests, and the existing CityGuide suites.
