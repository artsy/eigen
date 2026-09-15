# City Guide Events and City Itineraries Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the stubbed event sections on the City Guide home with real content, give each one a grouped destination screen, and surface a city-scoped itinerary built on the user's existing follows.

**Architecture:** Pure grouping functions turn flat connection results into titled sections. One shared destination screen renders those sections as a flattened FlashList with collapsible headers. Presentational row and header components hold no Relay dependency, so the screens map unmasked fragment data onto plain props. Phase 2 reuses the same row and summary components against `me.followsAndSaves`.

**Tech Stack:** React Native, TypeScript strict, Relay hooks, `@artsy/palette-mobile`, FlashList, Luxon, Jest, `@testing-library/react-native`, `relay-test-utils`.

**Spec:** `docs/superpowers/specs/2026-08-27-city-guide-events-and-saves-design.md`

## Global Constraints

Every task's requirements implicitly include this section.

- **Branch:** `city-guide-saves`, stacked on `city-guide-itineraries-docs`. Do not rebase onto `main`.
- **Never run the full Jest suite. Never use `--findRelatedTests`.** Both are unreliable in this repo; one `--findRelatedTests` run sat for eight minutes before being killed. Always name the test file: `yarn test <path>`.
- **`lint-staged` reformats and amends every commit after you make it**, so the SHA you push and the SHA you keep differ. Pushing needs `--force-with-lease`, and only after `git diff <remote> <local> --stat` comes back empty.
- **Icons:** `import { X } from "@artsy/icons/native"`. Never `import X from "@artsy/icons/XIcon"` — that path maps to `dist/web` and pulls the DOM build.
- **Tests are data-driven.** Derive expected counts from the data under test. Hardcoded counts produced three false alarms in the previous sub-project.
- **No `index.ts(x)` files.** No importing across Scenes; shared code goes to `src/app/Components/` or `src/app/utils/`.
- **Run `yarn relay` after touching any `graphql` tag.** Generated artifacts live in `src/__generated__/`, are never hand-edited, and are **gitignored** (`.gitignore:147`) — do not try to commit them. Only `.gitkeep` is tracked there. Every developer and CI regenerates them.
- **Before every commit:** `yarn tsc` and `yarn lint --fix <changed files>`.
- **No feature flag.** This work ships unflagged.
- **Exact GraphQL values, copied from the spec:** `status: RUNNING` for current shows and current fairs, never `CURRENT`. `status: UPCOMING` with `dayThreshold: 14` for Opening Soon. `status: RUNNING_AND_UPCOMING` with `dayThreshold: 365` for the itinerary's shows. `first: 100` is Gravity's hard page cap (`api_helpers.rb:8`).
- **A city is a 25km radius.** `LOCAL_DISCOVERY_RADIUS_KM = 25` (`city/constants.ts:1`), used by `City.showsConnection`, `City.fairsConnection` and `me.followsAndSaves.showsConnection` alike. Gravity's own 75km default never applies, because Metaphysics always overrides it.
- **The itinerary's fair window cannot be widened.** Gravity's fairs endpoint calls the status scope with no argument (`v1/fairs_endpoint.rb:166`) and Metaphysics forwards no threshold (`city/index.ts:128-141`), so a followed fair appears only once it is running or opens within 15 days. Do not add a `dayThreshold` to a fairs connection and expect it to work.
- **`estimatedItemSize` does not exist.** This repo is on FlashList `2.2.2` (`package.json:158`) and the prop is absent from its types. Do not add it to any `FlashList`.
- **Every new surface sends tracking.** Reuse existing `Schema.ActionNames` values; invent nothing for an action Eigen already tracks.
- **Every user is signed in.** No logged-out branch anywhere: no login checks, no sign-up prompts, no hidden controls.
- **Section identity is `id`, never the title.** Two sections may legitimately share a title.
- **Commits** use semantic prefixes and end with `Assisted-by: Claude Opus 5 (1M context) <noreply@anthropic.com>`.
- **Remove `@ts-expect-error STRICTNESS_MIGRATION` comments** in code you touch, where the fix is straightforward.

## File Structure

**Created**

| File                                                                                     | Responsibility                                                                            |
| ---------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| `src/app/Scenes/CityGuide/utils/cityEventSections.ts`                                    | `CityEventSection<T>`; `groupByOpeningWeek`; `groupByNeighborhood`; `normalizePostalCode` |
| `src/app/Scenes/CityGuide/utils/mockCityNeighborhoods.ts`                                | Editorial postcode-prefix to label table, London only                                     |
| `src/app/Scenes/CityGuide/Components/CityGuideSaveButton.tsx`                            | The circular add/check icon and its labelled variant (moved from Itinerary)               |
| `src/app/Scenes/CityGuide/Components/CityEventSaveControls.tsx`                          | Show, fair and partner save controls. Plain props, no Relay query                         |
| `src/app/Scenes/CityGuide/Components/CityEventRow.tsx`                                   | One presentational event row                                                              |
| `src/app/Scenes/CityGuide/Components/CityEventSectionHeader.tsx`                         | Stateless collapsible header row                                                          |
| `src/app/Scenes/CityGuide/Components/CityGuideEventSummaryRow.tsx`                       | One home summary row                                                                      |
| `src/app/Scenes/CityGuide/Components/CityGuideItinerarySummary.tsx`                      | The home's itinerary row, counting fairs plus shows                                       |
| `src/app/Scenes/CityGuide/Screens/CityEventList/CityEventListScreen.tsx`                 | The shared destination screen, plus `parseCityEventSection`                               |
| `src/app/Scenes/CityGuide/Screens/CityEventList/utils/cityEventListItems.ts`             | Sections plus collapsed set to a flat FlashList array                                     |
| `src/app/Scenes/CityGuide/Screens/Itinerary/hooks/ItineraryStopEntities.tsx`             | Provider holding every resolved stop entity, keyed by `stopId`                            |
| `src/app/Scenes/CityGuide/Screens/Itinerary/Components/ItineraryStopEntityResolvers.tsx` | One invisible resolver per saveable stop                                                  |
| `src/app/Scenes/CityGuide/Screens/Itinerary/Components/ItineraryAddFullListButton.tsx`   | Bulk follow with bounded concurrency                                                      |
| `src/app/Components/__tests__/ShowFollowButton.tests.tsx`                                | Characterisation tests. Did not exist                                                     |
| `src/app/Components/Lists/__tests__/ShowItemRow.tests.tsx`                               | Characterisation tests. Did not exist                                                     |

**Modified**

| File                                                                                 | Change                                                                                          |
| ------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------- |
| `src/app/Scenes/CityGuide/utils/CityGuideShow.ts`                                    | Add `location { postalCode }`                                                                   |
| `src/app/Scenes/CityGuide/utils/CityGuideFair.ts`                                    | Add `location { postalCode }` and `profile { internalID isFollowed }`                           |
| `src/app/Scenes/CityGuide/Components/CityGuideEvents.tsx`                            | Replace the stub with a Relay component and three summary rows                                  |
| `src/app/Scenes/CityGuide/CityGuideNew.tsx`                                          | Pass `citySlug`; render the itinerary summary                                                   |
| `src/app/Navigation/routes.tsx`                                                      | Add `/city-guide/:citySlug/events/:section`                                                     |
| `src/app/Scenes/CityGuide/Screens/CitySavedList.tsx`                                 | `dayThreshold: 365`; add followed fairs; stop using `CityGuideEventList`; render `CityEventRow` |
| `src/app/Scenes/CityGuide/Screens/Itinerary/ItineraryScreen.tsx`                     | Wrap in the provider, mount resolvers, render the bulk-add button                               |
| `src/app/Scenes/CityGuide/Screens/Itinerary/Components/ItineraryStopSaveControl.tsx` | Drop its per-row query; read the provider                                                       |
| `src/app/utils/mutations/useFollowShow.ts`                                           | Export `followShowMutationConfig`; hook uses it                                                 |
| `src/app/utils/mutations/useFollowProfile.ts`                                        | Export `followProfileMutationConfig`; hook uses it                                              |
| `src/app/Components/ShowFollowButton.tsx`                                            | Move onto `useFollowShow`                                                                       |
| `src/app/Components/Lists/ShowItemRow.tsx`                                           | Move onto `useFollowShow`                                                                       |

**Deleted**

| File                                                                            | Why                            |
| ------------------------------------------------------------------------------- | ------------------------------ |
| `src/app/Scenes/CityGuide/Screens/Itinerary/Components/ItinerarySaveButton.tsx` | Moved to `CityGuideSaveButton` |

**Deliberately not touched**

`CityGuideEventList`, `CitySectionList`, `CityFairList` and `CityGuide.tsx`. The legacy City
Guide still renders them.

---

### Task 0: Measure how well the neighbourhood table actually classifies real data

The neighbourhood grouping rests on `Show.location.postalCode`, which Gravity declares
optional with a default of `""` (`partner_location.rb:26`). Nothing in the code proves
galleries fill it in.

**This gate measures and reports. It does not decide.** An earlier draft asserted a 60%
threshold as though it were derived; it was not. Whether the numbers are good enough is a
product judgement about whether the screen looks grouped, and it belongs to the person who
owns the design.

The measurement must cover all three datasets the grouping is used on, not just running
shows, and must report matches **against the proposed label table** rather than mere postcode
presence. A city where every show sits in one outward code has 100% coverage and still
produces one section.

**Files:** none. This task writes no production code.

- [ ] **Step 1: Write the proposed table where the probe can read it**

Task 2 creates `mockCityNeighborhoods.ts`. This gate runs first, so put the same London
prefixes in a throwaway JSON file for the probe. If the gate passes, Task 2 copies them over.

```bash
cat > /tmp/london-neighborhoods.json <<'JSON'
[
  { "id": "farringdon",     "title": "Farringdon",     "postalPrefixes": ["EC1"] },
  { "id": "central-london", "title": "Central London", "postalPrefixes": ["W1", "SW1", "WC1", "WC2"] },
  { "id": "east-london",    "title": "East London",    "postalPrefixes": ["E1", "E2", "E8", "E9", "EC2"] },
  { "id": "north-london",   "title": "North London",   "postalPrefixes": ["N1", "N4", "NW1", "NW3", "NW5", "NW8"] },
  { "id": "south-london",   "title": "South London",   "postalPrefixes": ["SE1", "SE5", "SE8", "SE15"] },
  { "id": "west-london",    "title": "West London",    "postalPrefixes": ["W2", "W8", "W10", "W11", "SW3", "SW6", "SW7"] }
]
JSON
```

- [ ] **Step 2: Fetch all three datasets**

The three queries mirror exactly what the screens will ask for, including statuses and
thresholds, so the sample is the real population rather than an approximation.

```bash
q() {
  curl -s https://metaphysics-production.artsy.net/v2 \
    -H 'Content-Type: application/json' \
    -d "{\"query\":\"$1\"}"
}

q '{ city(slug: \"london-united-kingdom\") { showsConnection(first: 100, status: RUNNING, includeStubShows: false) { totalCount edges { node { name location { postalCode } } } } } }' \
  > /tmp/probe-current-shows.json

q '{ city(slug: \"london-united-kingdom\") { showsConnection(first: 100, status: UPCOMING, dayThreshold: 14) { totalCount edges { node { name location { postalCode } } } } } }' \
  > /tmp/probe-opening-shows.json

q '{ city(slug: \"london-united-kingdom\") { fairsConnection(first: 100, status: RUNNING) { totalCount edges { node { name location { postalCode } } } } } }' \
  > /tmp/probe-fairs.json

head -c 200 /tmp/probe-current-shows.json
```

Expected: JSON with a `data` key. If any response contains `errors`, stop and report the
error rather than analysing a partial sample.

- [ ] **Step 3: Measure classification, not presence**

```bash
python3 - <<'PY_PROBE'
import json, datetime
from collections import Counter

defs = json.load(open("/tmp/london-neighborhoods.json"))

def pct(n, total):
    return "n/a" if total == 0 else f"{round(100 * n / total)}%"

def classify(code):
    """Longest matching prefix wins, mirroring groupByNeighborhood."""
    norm = (code or "").upper().replace(" ", "")
    if not norm:
        return None
    best, best_len = None, 0
    for d in defs:
        for pre in d["postalPrefixes"]:
            if norm.startswith(pre) and len(pre) > best_len:
                best, best_len = d["id"], len(pre)
    return best

print(f"sampled {datetime.date.today().isoformat()}\n")

for label, path, conn in [
    ("current shows", "/tmp/probe-current-shows.json", "showsConnection"),
    ("opening shows", "/tmp/probe-opening-shows.json", "showsConnection"),
    ("current fairs", "/tmp/probe-fairs.json", "fairsConnection"),
]:
    d = json.load(open(path))["data"]["city"][conn]
    nodes = [e["node"] for e in d["edges"]]
    codes = [(n.get("location") or {}).get("postalCode") for n in nodes]

    blank = sum(1 for c in codes if not (c or "").strip())
    malformed = [c for c in codes if (c or "").strip() and not any(ch.isdigit() for ch in c)]
    buckets = Counter(classify(c) for c in codes)
    matched = sum(v for k, v in buckets.items() if k is not None)
    named = {k: v for k, v in buckets.items() if k is not None}
    multi = {k: v for k, v in named.items() if v >= 2}

    print(f"--- {label} ---")
    print(f"  totalCount reported by API : {d.get('totalCount')}")
    print(f"  sample size                : {len(nodes)}")
    print(f"  blank or missing postcode  : {blank} ({pct(blank, len(nodes))})")
    print(f"  malformed (no digit)       : {len(malformed)} {malformed[:5]}")
    print(f"  classified into a bucket   : {matched} ({pct(matched, len(nodes))})")
    print(f"  fell back to 'More in'     : {len(nodes) - matched} ({pct(len(nodes) - matched, len(nodes))})")
    print(f"  named buckets used         : {len(named)}")
    print(f"  buckets with 2+ rows       : {len(multi)}")
    print(f"  distribution               : {sorted(named.items(), key=lambda kv: -kv[1])}")
    print()
PY_PROBE
```

- [ ] **Step 4: Report and stop**

Post the full output and ask for a decision. Say plainly what the numbers mean:

- **Fallback share** is what fraction of rows land in "More in London". A high number means the
  screen looks ungrouped.
- **Buckets with 2+ rows** is the closest proxy for "does this look like a grouped screen". One
  bucket holding everything and five holding one row each is worse than three even buckets.
- **Fairs are expected to score badly** and that is fine. There are few per city and they
  cluster at venues, so a fallback-heavy fair screen may be acceptable where a fallback-heavy
  shows screen is not.

Then stop. Do not proceed to Task 1 until the decision comes back. The possible outcomes:

- **Proceed as planned.** Record the measured numbers in the spec's mock label table section.
- **Adjust the table.** Revise the prefixes to match the real distribution, then re-run Step 3.
- **Abandon postcode grouping.** That is a spec change, not an implementation choice. Stop and
  re-open the spec.

- [ ] **Step 5: Commit the finding either way**

Append the output to the spec's mock label table section, including the sample date, so a
future reader knows what the table was built against and when.

```bash
git add docs/superpowers/specs/2026-08-27-city-guide-events-and-saves-design.md
git commit -m "docs: record measured London postcode classification for the City Guide

Assisted-by: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 1: Section type and the opening-week grouper

**Files:**

- Create: `src/app/Scenes/CityGuide/utils/cityEventSections.ts`
- Test: `src/app/Scenes/CityGuide/utils/__tests__/cityEventSections.tests.ts`

**Interfaces:**

- Consumes: nothing.
- Produces: `interface CityEventSection<T> { id: string; title: string; items: T[] }` and
  `groupByOpeningWeek<T extends { start_at?: string | null }>(items: readonly T[], now: DateTime): CityEventSection<T>[]`.

- [ ] **Step 1: Write the failing test**

```ts
// src/app/Scenes/CityGuide/utils/__tests__/cityEventSections.tests.ts
import { groupByOpeningWeek } from "app/Scenes/CityGuide/utils/cityEventSections"
import { DateTime } from "luxon"

const now = DateTime.fromISO("2026-08-27T12:00:00Z")
const at = (days: number, hours = 0) => now.plus({ days, hours }).toISO() as string

describe("groupByOpeningWeek", () => {
  it("splits shows into a rolling this-week and next-week", () => {
    const sections = groupByOpeningWeek(
      [
        { id: "a", start_at: at(1) },
        { id: "b", start_at: at(6) },
        { id: "c", start_at: at(7) },
        { id: "d", start_at: at(13) },
      ],
      now
    )

    expect(sections.map((s) => s.id)).toEqual(["this-week", "next-week"])
    expect(sections.map((s) => s.title)).toEqual(["This Week", "Next Week"])
    expect(sections[0].items.map((i) => i.id)).toEqual(["a", "b"])
    expect(sections[1].items.map((i) => i.id)).toEqual(["c", "d"])
  })

  it("puts the day-seven boundary in next week, not this week", () => {
    const sections = groupByOpeningWeek([{ id: "boundary", start_at: at(7) }], now)

    expect(sections.map((s) => s.id)).toEqual(["next-week"])
  })

  it("drops anything at or past day fourteen, which dayThreshold should already exclude", () => {
    expect(groupByOpeningWeek([{ id: "late", start_at: at(14) }], now)).toEqual([])
  })

  it("drops shows with no start date", () => {
    expect(groupByOpeningWeek([{ id: "undated", start_at: null }], now)).toEqual([])
  })

  it("omits a section entirely rather than returning it empty", () => {
    const sections = groupByOpeningWeek([{ id: "a", start_at: at(1) }], now)

    expect(sections).toHaveLength(1)
    expect(sections[0].id).toEqual("this-week")
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `yarn test src/app/Scenes/CityGuide/utils/__tests__/cityEventSections.tests.ts`
Expected: FAIL, cannot resolve `app/Scenes/CityGuide/utils/cityEventSections`.

- [ ] **Step 3: Write the implementation**

```ts
// src/app/Scenes/CityGuide/utils/cityEventSections.ts
import { DateTime } from "luxon"

/**
 * A titled group of events. `title` is an opaque display string and carries no meaning:
 * two sections may legitimately share one. Identity is always `id`.
 */
export interface CityEventSection<T> {
  id: string
  title: string
  items: T[]
}

interface HasStartAt {
  start_at?: string | null
}

const DAYS_PER_WEEK = 7
const OPENING_WINDOW_DAYS = 14

/**
 * Buckets upcoming events into two rolling weeks measured from `now`, not calendar weeks.
 *
 * Gravity's `upcoming` scope is `start_at > now && start_at < in_days.days.from_now`
 * (`event_status.rb:26-28`), so a query using `dayThreshold: 14` cannot return anything
 * these two buckets do not cover. We drop out-of-range items anyway rather than trusting
 * the caller to have passed the matching threshold.
 *
 * `now` is injected so the week boundaries are testable.
 */
export const groupByOpeningWeek = <T extends HasStartAt>(
  items: readonly T[],
  now: DateTime
): CityEventSection<T>[] => {
  const nextWeekStart = now.plus({ days: DAYS_PER_WEEK })
  const windowEnd = now.plus({ days: OPENING_WINDOW_DAYS })

  const thisWeek: T[] = []
  const nextWeek: T[] = []

  items.forEach((item) => {
    if (!item.start_at) {
      return
    }

    const startAt = DateTime.fromISO(item.start_at)

    if (!startAt.isValid || startAt >= windowEnd) {
      return
    }

    if (startAt < nextWeekStart) {
      thisWeek.push(item)
    } else {
      nextWeek.push(item)
    }
  })

  return [
    { id: "this-week", title: "This Week", items: thisWeek },
    { id: "next-week", title: "Next Week", items: nextWeek },
  ].filter((section) => section.items.length > 0)
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `yarn test src/app/Scenes/CityGuide/utils/__tests__/cityEventSections.tests.ts`
Expected: PASS, 5 tests.

- [ ] **Step 5: Type-check, lint and commit**

```bash
yarn tsc
yarn lint --fix src/app/Scenes/CityGuide/utils/cityEventSections.ts src/app/Scenes/CityGuide/utils/__tests__/cityEventSections.tests.ts
git add src/app/Scenes/CityGuide/utils/cityEventSections.ts src/app/Scenes/CityGuide/utils/__tests__/cityEventSections.tests.ts
git commit -m "feat(city-guide): add city event section type and opening-week grouper

Assisted-by: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 2: Neighbourhood grouper and its mock label table

**Files:**

- Create: `src/app/Scenes/CityGuide/utils/mockCityNeighborhoods.ts`
- Modify: `src/app/Scenes/CityGuide/utils/cityEventSections.ts`
- Test: `src/app/Scenes/CityGuide/utils/__tests__/mockCityNeighborhoods.tests.ts`
- Test: `src/app/Scenes/CityGuide/utils/__tests__/cityEventSections.tests.ts` (append)

**Interfaces:**

- Consumes: `CityEventSection<T>` from Task 1.
- Produces: `normalizePostalCode(postalCode?: string | null): string`,
  `groupByNeighborhood<T extends HasPostalCode>(items: readonly T[], citySlug: string, cityName: string): CityEventSection<T>[]`,
  and from the mock module `interface NeighborhoodDef { id: string; title: string; postalPrefixes: string[] }`
  plus `MOCK_NEIGHBORHOODS: Record<string, NeighborhoodDef[]>`.

- [ ] **Step 1: Write the failing tests**

```ts
// src/app/Scenes/CityGuide/utils/__tests__/mockCityNeighborhoods.tests.ts
import { MOCK_NEIGHBORHOODS } from "app/Scenes/CityGuide/utils/mockCityNeighborhoods"

describe("MOCK_NEIGHBORHOODS", () => {
  it("covers London", () => {
    expect(MOCK_NEIGHBORHOODS["london-united-kingdom"]).toBeDefined()
  })

  it("gives every entry a unique id", () => {
    Object.values(MOCK_NEIGHBORHOODS).forEach((defs) => {
      const ids = defs.map((d) => d.id)
      expect(new Set(ids).size).toEqual(ids.length)
    })
  })

  it("uses normalised, non-empty prefixes throughout", () => {
    Object.values(MOCK_NEIGHBORHOODS).forEach((defs) => {
      defs.forEach((def) => {
        expect(def.postalPrefixes.length).toBeGreaterThan(0)
        def.postalPrefixes.forEach((prefix) => {
          expect(prefix).toEqual(prefix.toUpperCase().replace(/\s+/g, ""))
          expect(prefix.length).toBeGreaterThan(0)
        })
      })
    })
  })
})
```

```ts
// append to src/app/Scenes/CityGuide/utils/__tests__/cityEventSections.tests.ts
import {
  groupByNeighborhood,
  normalizePostalCode,
} from "app/Scenes/CityGuide/utils/cityEventSections"

const LONDON = "london-united-kingdom"
const show = (id: string, postalCode: string | null) => ({
  id,
  location: postalCode === null ? null : { postalCode },
})

describe("normalizePostalCode", () => {
  it("uppercases and strips whitespace", () => {
    expect(normalizePostalCode("ec1m 5rr")).toEqual("EC1M5RR")
  })

  it("returns an empty string for missing or blank input", () => {
    expect(normalizePostalCode(null)).toEqual("")
    expect(normalizePostalCode(undefined)).toEqual("")
    expect(normalizePostalCode("   ")).toEqual("")
  })
})

describe("groupByNeighborhood", () => {
  it("groups a show into the section matching its outward code", () => {
    const sections = groupByNeighborhood([show("a", "EC1M 5RR")], LONDON, "London")

    expect(sections).toHaveLength(1)
    expect(sections[0].title).toEqual("Farringdon")
    expect(sections[0].items.map((i) => i.id)).toEqual(["a"])
  })

  it("prefers the longest matching prefix, so W10 is not read as W1", () => {
    const [section] = groupByNeighborhood([show("a", "W10 5RR")], LONDON, "London")

    expect(section.title).not.toEqual("Central London")
  })

  it("matches an NW postcode on its own prefix, not as an N postcode", () => {
    // NW6 is deliberately absent from the table. A matcher that compared loosely, or truncated
    // the outward code, would put this in North London via the "N1" prefix. It must not.
    const [section] = groupByNeighborhood([show("a", "NW6 1AB")], LONDON, "London")

    expect(section.id).toEqual("more")
  })

  it("keeps both N and NW postcodes that the table does list", () => {
    const sections = groupByNeighborhood(
      [show("islington", "N1 5RR"), show("camden", "NW1 5RR")],
      LONDON,
      "London"
    )

    // Both prefixes live in the same bucket by design, since the Figma labels group them under
    // one "North London" heading. The assertion is that neither falls through to the fallback.
    expect(sections).toHaveLength(1)
    expect(sections[0].title).toEqual("North London")
    expect(sections[0].items).toHaveLength(2)
  })

  it("sends an empty postcode to the fallback, not to a matching prefix", () => {
    const sections = groupByNeighborhood([show("a", "")], LONDON, "London")

    expect(sections).toHaveLength(1)
    expect(sections[0].id).toEqual("more")
    expect(sections[0].title).toEqual("More in London")
  })

  it("sends a null location to the fallback", () => {
    const [section] = groupByNeighborhood([show("a", null)], LONDON, "London")

    expect(section.id).toEqual("more")
  })

  it("puts every show in one fallback section for a city with no table entry", () => {
    const shows = [show("a", "75001"), show("b", "75002")]

    const sections = groupByNeighborhood(shows, "paris-france", "Paris")

    expect(sections).toHaveLength(1)
    expect(sections[0].title).toEqual("More in Paris")
    expect(sections[0].items).toHaveLength(shows.length)
  })

  it("orders sections by the table and sorts the fallback last", () => {
    const sections = groupByNeighborhood(
      [show("unmatched", "ZZ99 9ZZ"), show("farringdon", "EC1M 5RR")],
      LONDON,
      "London"
    )

    expect(sections[sections.length - 1].id).toEqual("more")
  })

  it("omits sections with no shows", () => {
    const sections = groupByNeighborhood([show("a", "EC1M 5RR")], LONDON, "London")

    expect(sections.every((s) => s.items.length > 0)).toBe(true)
  })
})
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `yarn test src/app/Scenes/CityGuide/utils/__tests__/cityEventSections.tests.ts src/app/Scenes/CityGuide/utils/__tests__/mockCityNeighborhoods.tests.ts`
Expected: FAIL, `groupByNeighborhood` and `mockCityNeighborhoods` do not exist.

- [ ] **Step 3: Write the mock table**

**Fitted to measured data, not guessed.** Task 0 sampled production on 2026-08-27: 53 current
London shows, 89% classified into 6 buckets each holding two or more rows, 1 blank postcode.
`W8`, `NW8` and `SW6` were the only unmatched outward codes and are included below, taking
classification to roughly 98%. `central-london` held 29 of 53, so expect one dominant section.
London had **zero** current fairs that day, so fair grouping is unvalidated against live data
and its coverage is unknown.

```ts
// src/app/Scenes/CityGuide/utils/mockCityNeighborhoods.ts

/**
 * MOCK DATA. Editorial, not from any API.
 *
 * Neighbourhood is not stored anywhere in Gravity: there is no field on `Location`,
 * `PartnerLocation` or `PartnerShow`, and `CityGeocodingService` discards the
 * `neighborhood` the geocoder hands it because it only builds city-level slugs.
 *
 * So the grouping input is real (`Show.location.postalCode`) and only the label is mock.
 * When `Location.neighborhood` lands, delete this file and read the field.
 */
export interface NeighborhoodDef {
  id: string
  title: string
  /** Normalised outward-code prefixes: uppercase, no whitespace. Longest match wins. */
  postalPrefixes: string[]
}

export const MOCK_NEIGHBORHOODS: Record<string, NeighborhoodDef[]> = {
  "london-united-kingdom": [
    { id: "farringdon", title: "Farringdon", postalPrefixes: ["EC1"] },
    { id: "central-london", title: "Central London", postalPrefixes: ["W1", "SW1", "WC1", "WC2"] },
    { id: "east-london", title: "East London", postalPrefixes: ["E1", "E2", "E8", "E9", "EC2"] },
    {
      id: "north-london",
      title: "North London",
      postalPrefixes: ["N1", "N4", "NW1", "NW3", "NW5", "NW8"],
    },
    { id: "south-london", title: "South London", postalPrefixes: ["SE1", "SE5", "SE8", "SE15"] },
    {
      id: "west-london",
      title: "West London",
      postalPrefixes: ["W2", "W8", "W10", "W11", "SW3", "SW6", "SW7"],
    },
  ],
}
```

- [ ] **Step 4: Add the grouper**

Append to `src/app/Scenes/CityGuide/utils/cityEventSections.ts`:

```ts
import { MOCK_NEIGHBORHOODS } from "app/Scenes/CityGuide/utils/mockCityNeighborhoods"

interface HasPostalCode {
  location?: { postalCode?: string | null } | null
}

/** The section unmatched events fall into. Always sorted last. */
const FALLBACK_SECTION_ID = "more"

/** Uppercases and strips whitespace. Returns "" for missing, null or blank input. */
export const normalizePostalCode = (postalCode?: string | null): string =>
  (postalCode ?? "").toUpperCase().replace(/\s+/g, "")

/**
 * Groups events by the neighbourhood their postcode falls in, using the editorial table in
 * `mockCityNeighborhoods.ts`.
 *
 * Gravity defaults `postal_code` to "" rather than null (`partner_location.rb:26`), so a
 * blank code must fall through to the fallback instead of prefix-matching everything.
 * Longest prefix wins, so "W10" does not get read as "W1".
 */
export const groupByNeighborhood = <T extends HasPostalCode>(
  items: readonly T[],
  citySlug: string,
  cityName: string
): CityEventSection<T>[] => {
  const defs = MOCK_NEIGHBORHOODS[citySlug] ?? []
  const grouped = new Map<string, T[]>()

  items.forEach((item) => {
    const code = normalizePostalCode(item.location?.postalCode)

    const match = !code
      ? undefined
      : defs.reduce<{ id: string; length: number } | undefined>((best, def) => {
          const longest = def.postalPrefixes
            .filter((prefix) => code.startsWith(prefix))
            .reduce((max, prefix) => Math.max(max, prefix.length), 0)

          if (longest === 0 || (best && best.length >= longest)) {
            return best
          }

          return { id: def.id, length: longest }
        }, undefined)

    const sectionId = match?.id ?? FALLBACK_SECTION_ID
    grouped.set(sectionId, [...(grouped.get(sectionId) ?? []), item])
  })

  const sections = defs
    .filter((def) => grouped.has(def.id))
    .map((def) => ({ id: def.id, title: def.title, items: grouped.get(def.id) as T[] }))

  const fallback = grouped.get(FALLBACK_SECTION_ID)

  if (fallback) {
    sections.push({
      id: FALLBACK_SECTION_ID,
      title: `More in ${cityName}`,
      items: fallback,
    })
  }

  return sections
}
```

- [ ] **Step 5: Run the tests to verify they pass**

Run: `yarn test src/app/Scenes/CityGuide/utils/__tests__/cityEventSections.tests.ts src/app/Scenes/CityGuide/utils/__tests__/mockCityNeighborhoods.tests.ts`
Expected: PASS, 5 opening-week tests plus 2 normalisation, 9 neighbourhood and 3 table tests.

- [ ] **Step 6: Type-check, lint and commit**

```bash
yarn tsc
yarn lint --fix src/app/Scenes/CityGuide/utils/cityEventSections.ts src/app/Scenes/CityGuide/utils/mockCityNeighborhoods.ts src/app/Scenes/CityGuide/utils/__tests__/
git add src/app/Scenes/CityGuide/utils/
git commit -m "feat(city-guide): group city events by neighbourhood from postcodes

Neighbourhood is not stored in Gravity, so the grouping input is the real
postcode and only the label table is mock.

Assisted-by: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 3: Move the save button out of the Itinerary folder

Three more screens will use it, so it stops being itinerary-specific. This task is a move and
a rename with no behaviour change, which is why it carries no new test: the existing tests move
with it and must still pass.

**Files:**

- Create: `src/app/Scenes/CityGuide/Components/CityGuideSaveButton.tsx`
- Create: `src/app/Scenes/CityGuide/Components/__tests__/CityGuideSaveButton.tests.tsx`
- Delete: `src/app/Scenes/CityGuide/Screens/Itinerary/Components/ItinerarySaveButton.tsx`
- Delete: `src/app/Scenes/CityGuide/Screens/Itinerary/Components/__tests__/ItinerarySaveButton.tests.tsx`
- Modify: `ItineraryStopSaveControl.tsx`, `ItineraryStopPreview.tsx`, `ItineraryMapPreview.tsx`, `ItineraryStopRow.tsx` and any other importer

- [ ] **Step 1: Find every importer**

```bash
grep -rn "ItinerarySaveButton" src/ --include=*.tsx --include=*.ts
```

Expected: only `ItineraryStopSaveControl.tsx` imports the button itself, plus the component
and its own test. The previews import the _control_, not the button. All inside the CityGuide
scene, so nothing external breaks.

- [ ] **Step 2: Move the files with git so history follows**

```bash
git mv src/app/Scenes/CityGuide/Screens/Itinerary/Components/ItinerarySaveButton.tsx \
       src/app/Scenes/CityGuide/Components/CityGuideSaveButton.tsx
git mv src/app/Scenes/CityGuide/Screens/Itinerary/Components/__tests__/ItinerarySaveButton.tests.tsx \
       src/app/Scenes/CityGuide/Components/__tests__/CityGuideSaveButton.tests.tsx
```

- [ ] **Step 3: Rename the export, the testIDs and every import**

In `CityGuideSaveButton.tsx` rename the component `ItinerarySaveButton` to
`CityGuideSaveButton` and change the three testIDs from `itinerary-save-button*` to
`city-guide-save-button*`. Update the same strings in the moved test file. Then fix importers:

```bash
grep -rl "ItinerarySaveButton" src/ | xargs sed -i '' \
  -e 's#app/Scenes/CityGuide/Screens/Itinerary/Components/ItinerarySaveButton#app/Scenes/CityGuide/Components/CityGuideSaveButton#g' \
  -e 's/ItinerarySaveButton/CityGuideSaveButton/g'
grep -rl "itinerary-save-button" src/ | xargs sed -i '' 's/itinerary-save-button/city-guide-save-button/g'
```

- [ ] **Step 4: Confirm nothing still points at the old name**

```bash
grep -rn "ItinerarySaveButton\|itinerary-save-button" src/ || echo "clean"
```

Expected: `clean`.

- [ ] **Step 5: Run the moved test and the tests of every importer**

Run:

```bash
yarn test src/app/Scenes/CityGuide/Components/__tests__/CityGuideSaveButton.tests.tsx \
          src/app/Scenes/CityGuide/Screens/Itinerary/Components/__tests__/ItineraryStopRow.tests.tsx \
          src/app/Scenes/CityGuide/Screens/Itinerary/__tests__/ItineraryScreen.tests.tsx
```

Expected: PASS. A failure here means a testID was missed.

- [ ] **Step 6: Type-check, lint and commit**

```bash
yarn tsc
yarn lint --fix src/app/Scenes/CityGuide/
git add -A src/app/Scenes/CityGuide/
git commit -m "refactor(city-guide): move ItinerarySaveButton to CityGuideSaveButton

Three more screens need it, so it is no longer itinerary-specific. Move and
rename only, no behaviour change.

Assisted-by: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 4: Save controls that fire no query

`ItineraryStopSaveControl` runs one `useLazyLoadQuery` per row because an itinerary stop only
carries a slug. On the event screens the data is already in the list query, so these controls
take plain props and fire nothing.

**Files:**

- Create: `src/app/Scenes/CityGuide/Components/CityEventSaveControls.tsx`
- Test: `src/app/Scenes/CityGuide/Components/__tests__/CityEventSaveControls.tests.tsx`

**Interfaces:**

- Consumes: `CityGuideSaveButton` from Task 3; `useFollowShow` and `useFollowProfile` from `app/utils/mutations/`.
- Produces: `CityEventShowSaveControl` and `CityEventFairSaveControl`, both
  `React.FC<{ id: string; internalID: string; isFollowed: boolean | null | undefined; name: string; variant?: "icon" | "button" }>`.
  For the fair control the ids are the fair's **profile** ids, not the fair's own.
- `variant` exists because `ItineraryStopPreview.tsx:103` passes `variant="button"` today and
  renders a labelled full-width Save button beside "Show on map". Task 13 routes that preview
  through these controls, so dropping the prop would silently turn that button into a bare
  icon.

- [ ] **Step 1: Write the failing test**

```tsx
// src/app/Scenes/CityGuide/Components/__tests__/CityEventSaveControls.tests.tsx
import { fireEvent, screen } from "@testing-library/react-native"
import {
  CityEventFairSaveControl,
  CityEventShowSaveControl,
} from "app/Scenes/CityGuide/Components/CityEventSaveControls"
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

describe("CityEventShowSaveControl", () => {
  const props = { id: "show-node-id", internalID: "show-internal-id", name: "Frida Kahlo" }

  it("offers to save a show that is not followed", () => {
    renderWithWrappers(<CityEventShowSaveControl {...props} isFollowed={false} />)

    expect(screen.getByLabelText("Save Frida Kahlo")).toBeTruthy()
    expect(screen.getByTestId("city-guide-save-button-add-icon")).toBeTruthy()
  })

  it("offers to unsave a show that is followed", () => {
    renderWithWrappers(<CityEventShowSaveControl {...props} isFollowed />)

    expect(screen.getByLabelText("Unsave Frida Kahlo")).toBeTruthy()
    expect(screen.getByTestId("city-guide-save-button-check-icon")).toBeTruthy()
  })

  it("treats a null follow state as not followed", () => {
    renderWithWrappers(<CityEventShowSaveControl {...props} isFollowed={null} />)

    expect(screen.getByLabelText("Save Frida Kahlo")).toBeTruthy()
  })
})

describe("variant", () => {
  it("renders the labelled form when asked", () => {
    renderWithWrappers(
      <CityEventShowSaveControl
        id="show-node-id"
        internalID="show-internal-id"
        isFollowed={false}
        name="Frida Kahlo"
        variant="button"
      />
    )

    // ItineraryStopPreview needs this form beside "Show on map".
    expect(screen.getByText("Save")).toBeTruthy()
  })
})

describe("CityEventFairSaveControl", () => {
  it("tracks a fair follow", () => {
    renderWithWrappers(
      <CityEventFairSaveControl
        id="profile-node-id"
        internalID="profile-internal-id"
        isFollowed={false}
        name="Frieze London"
      />
    )
    fireEvent.press(screen.getByLabelText("Save Frieze London"))

    expect(mockTrackEvent).toHaveBeenCalledWith(
      expect.objectContaining({ action_name: "followFair" })
    )
  })

  it("tracks a fair unfollow", () => {
    renderWithWrappers(
      <CityEventFairSaveControl
        id="profile-node-id"
        internalID="profile-internal-id"
        isFollowed
        name="Frieze London"
      />
    )
    fireEvent.press(screen.getByLabelText("Unsave Frieze London"))

    expect(mockTrackEvent).toHaveBeenCalledWith(
      expect.objectContaining({ action_name: "unfollowFair" })
    )
  })

  it("labels itself with the fair name", () => {
    renderWithWrappers(
      <CityEventFairSaveControl
        id="profile-node-id"
        internalID="profile-internal-id"
        isFollowed={false}
        name="Frieze London"
      />
    )

    expect(screen.getByLabelText("Save Frieze London")).toBeTruthy()
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `yarn test src/app/Scenes/CityGuide/Components/__tests__/CityEventSaveControls.tests.tsx`
Expected: FAIL, cannot resolve `CityEventSaveControls`.

- [ ] **Step 3: Write the implementation**

```tsx
// src/app/Scenes/CityGuide/Components/CityEventSaveControls.tsx
import { useToast } from "app/Components/Toast/toastHook"
import { CityGuideSaveButton } from "app/Scenes/CityGuide/Components/CityGuideSaveButton"
import { useFollowProfile } from "app/utils/mutations/useFollowProfile"
import { useFollowShow } from "app/utils/mutations/useFollowShow"
import { Schema } from "app/utils/track"
import { useTracking } from "react-tracking"

interface Props {
  /** Relay node id, for the optimistic store update. */
  id: string
  internalID: string
  isFollowed: boolean | null | undefined
  /** Used for the accessibility label and nothing else. */
  name: string
  /** "icon" is the circular add/check used in rows. "button" is the labelled form the stop preview needs. */
  variant?: "icon" | "button"
}

const useSaveToast = () => {
  const toast = useToast()

  return (isNowSaved: boolean) => {
    toast.show(isNowSaved ? "Saved to your saves" : "Removed from your saves", "bottom")
  }
}

const accessibilityLabel = (isFollowed: boolean, name: string) =>
  isFollowed ? `Unsave ${name}` : `Save ${name}`

/**
 * Save control for a show whose data the caller has already fetched. Unlike
 * `ItineraryStopSaveControl`, which must resolve an entity from a slug, this fires no query.
 */
export const CityEventShowSaveControl: React.FC<Props> = ({
  id,
  internalID,
  isFollowed,
  name,
  variant,
}) => {
  const showToast = useSaveToast()
  const { trackEvent } = useTracking()
  const isSaved = !!isFollowed

  const { followShow, isInFlight } = useFollowShow({
    id,
    internalID,
    isFollowed,
    onCompleted: showToast,
  })

  return (
    <CityGuideSaveButton
      variant={variant}
      isSaved={isSaved}
      isSaving={isInFlight}
      accessibilityLabel={accessibilityLabel(isSaved, name)}
      onPress={() => {
        trackEvent({
          action_name: isSaved ? Schema.ActionNames.UnsaveShow : Schema.ActionNames.SaveShow,
          action_type: Schema.ActionTypes.Success,
          owner_type: Schema.OwnerEntityTypes.Show,
          owner_id: internalID,
        })
        followShow()
      }}
    />
  )
}

/**
 * Save control for a fair. Following a fair is a profile follow in Gravity
 * (`me/followed_fairs.ts:24` filters on `owner_types: "Fair"`), so `id` and `internalID`
 * here are the fair's profile ids, not the fair's own.
 */
export const CityEventFairSaveControl: React.FC<Props> = ({
  id,
  internalID,
  isFollowed,
  name,
  variant,
}) => {
  const showToast = useSaveToast()
  const { trackEvent } = useTracking()
  const isSaved = !!isFollowed

  const { followProfile, isInFlight } = useFollowProfile({
    id,
    internalID,
    isFollowed,
    onCompleted: showToast,
  })

  return (
    <CityGuideSaveButton
      variant={variant}
      isSaved={isSaved}
      isSaving={isInFlight}
      accessibilityLabel={accessibilityLabel(isSaved, name)}
      onPress={() => {
        // Eigen already has fair-specific names at `track/schema.ts:276-277`. Using SaveShow
        // for a fair would be reusing the wrong existing name, which is worse than inventing one.
        trackEvent({
          action_name: isSaved ? Schema.ActionNames.UnfollowFair : Schema.ActionNames.FollowFair,
          action_type: Schema.ActionTypes.Success,
          owner_type: Schema.OwnerEntityTypes.Fair,
          owner_id: internalID,
        })
        followProfile()
      }}
    />
  )
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `yarn test src/app/Scenes/CityGuide/Components/__tests__/CityEventSaveControls.tests.tsx`
Expected: PASS, 7 tests.

`mockTrackEvent` is a global jest mock exported from `app/utils/tests/globallyMockedStuff`
(line 8) and must be imported, not assumed. `ArtistSeriesMoreSeries.tests.tsx:9` shows the
import in use.

- [ ] **Step 5: Type-check, lint and commit**

```bash
yarn tsc
yarn lint --fix src/app/Scenes/CityGuide/Components/CityEventSaveControls.tsx src/app/Scenes/CityGuide/Components/__tests__/CityEventSaveControls.tests.tsx
git add src/app/Scenes/CityGuide/Components/
git commit -m "feat(city-guide): add query-free save controls for city event rows

Assisted-by: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 5: The event row

Presentational only. It takes plain strings and a save control as a node, so it has no Relay
dependency and needs no Relay test wrapper.

**Files:**

- Create: `src/app/Scenes/CityGuide/Components/CityEventRow.tsx`
- Test: `src/app/Scenes/CityGuide/Components/__tests__/CityEventRow.tests.tsx`

**Interfaces:**

- Consumes: nothing from earlier tasks.
- Produces: `CityEventRow: React.FC<{ title: string; subtitle?: string | null; meta?: string | null; imageURL?: string | null; href?: string | null; saveControl?: React.ReactNode }>`

- [ ] **Step 1: Write the failing test**

```tsx
// src/app/Scenes/CityGuide/Components/__tests__/CityEventRow.tests.tsx
import { Text } from "@artsy/palette-mobile"
import { screen } from "@testing-library/react-native"
import { CityEventRow } from "app/Scenes/CityGuide/Components/CityEventRow"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

describe("CityEventRow", () => {
  it("renders the title, subtitle and meta line", () => {
    renderWithWrappers(
      <CityEventRow
        title="Frida Kahlo"
        subtitle="Tate Modern"
        meta="Aug 24 – Sep 28, 2026"
        imageURL="https://example.com/a.jpg"
        href="/show/frida-kahlo"
      />
    )

    expect(screen.getByText("Frida Kahlo")).toBeTruthy()
    expect(screen.getByText("Tate Modern")).toBeTruthy()
    expect(screen.getByText("Aug 24 – Sep 28, 2026")).toBeTruthy()
  })

  it("renders without a subtitle or meta line", () => {
    renderWithWrappers(<CityEventRow title="Frida Kahlo" subtitle={null} meta={null} />)

    expect(screen.getByText("Frida Kahlo")).toBeTruthy()
    expect(screen.getByTestId("city-event-row")).toBeTruthy()
  })

  it("renders whatever save control it is given", () => {
    renderWithWrappers(
      <CityEventRow title="Frida Kahlo" saveControl={<Text>stand-in control</Text>} />
    )

    expect(screen.getByText("stand-in control")).toBeTruthy()
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `yarn test src/app/Scenes/CityGuide/Components/__tests__/CityEventRow.tests.tsx`
Expected: FAIL, cannot resolve `CityEventRow`.

- [ ] **Step 3: Write the implementation**

```tsx
// src/app/Scenes/CityGuide/Components/CityEventRow.tsx
import { Flex, Text } from "@artsy/palette-mobile"
import { RouterLink } from "app/system/navigation/RouterLink"
import { Image as RNImage } from "react-native"

const IMAGE_SIZE = 60

interface Props {
  title: string
  /** Usually the partner name. */
  subtitle?: string | null
  /** Third line. Currently the exhibition period; see the spec on why admission is omitted. */
  meta?: string | null
  imageURL?: string | null
  href?: string | null
  /** A `CityEventShowSaveControl` or `CityEventFairSaveControl`, injected so this row holds no Relay dependency. */
  saveControl?: React.ReactNode
}

export const CityEventRow: React.FC<Props> = ({
  title,
  subtitle,
  meta,
  imageURL,
  href,
  saveControl,
}) => {
  return (
    <Flex testID="city-event-row" flexDirection="row" alignItems="center" gap={1} py={1}>
      <RouterLink to={href ?? undefined} disablePrefetch>
        <Flex flexDirection="row" alignItems="center" gap={1} flex={1}>
          {!!imageURL && (
            <RNImage
              source={{ uri: imageURL }}
              width={IMAGE_SIZE}
              height={IMAGE_SIZE}
              resizeMode="cover"
            />
          )}

          <Flex flex={1}>
            <Text variant="sm-display" numberOfLines={2}>
              {title}
            </Text>

            {!!subtitle && (
              <Text variant="xs" color="mono60" numberOfLines={1}>
                {subtitle}
              </Text>
            )}

            {!!meta && (
              <Text variant="xs" color="mono60" numberOfLines={1}>
                {meta}
              </Text>
            )}
          </Flex>
        </Flex>
      </RouterLink>

      {!!saveControl && <Flex>{saveControl}</Flex>}
    </Flex>
  )
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `yarn test src/app/Scenes/CityGuide/Components/__tests__/CityEventRow.tests.tsx`
Expected: PASS, 3 tests. If `RouterLink` rejects an undefined `to`, wrap the inner block in a
plain `Flex` when `href` is missing and keep the test as it is.

- [ ] **Step 5: Type-check, lint and commit**

```bash
yarn tsc
yarn lint --fix src/app/Scenes/CityGuide/Components/CityEventRow.tsx src/app/Scenes/CityGuide/Components/__tests__/CityEventRow.tests.tsx
git add src/app/Scenes/CityGuide/Components/
git commit -m "feat(city-guide): add CityEventRow

Assisted-by: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 6: Stateless section header and the list flattener

`ItinerarySectionRow` holds its own `isExpanded` in `useState` (`ItinerarySectionRow.tsx:19`),
which a recycled FlashList cell cannot own. The itinerary screen keeps it. This screen gets a
stateless header plus a pure flattener, and the screen owns the collapsed set.

**Files:**

- Create: `src/app/Scenes/CityGuide/Components/CityEventSectionHeader.tsx`
- Create: `src/app/Scenes/CityGuide/Screens/CityEventList/utils/cityEventListItems.ts`
- Test: `src/app/Scenes/CityGuide/Components/__tests__/CityEventSectionHeader.tests.tsx`
- Test: `src/app/Scenes/CityGuide/Screens/CityEventList/utils/__tests__/cityEventListItems.tests.ts`

**Interfaces:**

- Consumes: `CityEventSection<T>` from Task 1.
- Produces: `CityEventSectionHeader: React.FC<{ title: string; isExpanded: boolean; onToggle: () => void }>`
  and `toCityEventListItems<T>(sections: CityEventSection<T>[], collapsedSectionIds: Set<string>): CityEventListItem<T>[]`
  where
  `type CityEventListItem<T> = { kind: "header"; sectionId: string; title: string; isExpanded: boolean } | { kind: "row"; sectionId: string; item: T }`.

- [ ] **Step 1: Write the failing tests**

```tsx
// src/app/Scenes/CityGuide/Components/__tests__/CityEventSectionHeader.tests.tsx
import { fireEvent, screen } from "@testing-library/react-native"
import { CityEventSectionHeader } from "app/Scenes/CityGuide/Components/CityEventSectionHeader"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

describe("CityEventSectionHeader", () => {
  it("renders its title and reports itself expanded", () => {
    renderWithWrappers(
      <CityEventSectionHeader title="Farringdon" isExpanded onToggle={jest.fn()} />
    )

    expect(screen.getByText("Farringdon")).toBeTruthy()
    expect(screen.getByTestId("city-event-section-header").props.accessibilityState).toEqual(
      expect.objectContaining({ expanded: true })
    )
  })

  it("reports itself collapsed", () => {
    renderWithWrappers(
      <CityEventSectionHeader title="Farringdon" isExpanded={false} onToggle={jest.fn()} />
    )

    expect(screen.getByTestId("city-event-section-header").props.accessibilityState).toEqual(
      expect.objectContaining({ expanded: false })
    )
  })

  it("calls onToggle when pressed", () => {
    const onToggle = jest.fn()

    renderWithWrappers(<CityEventSectionHeader title="Farringdon" isExpanded onToggle={onToggle} />)
    fireEvent.press(screen.getByTestId("city-event-section-header"))

    expect(onToggle).toHaveBeenCalledTimes(1)
  })
})
```

```ts
// src/app/Scenes/CityGuide/Screens/CityEventList/utils/__tests__/cityEventListItems.tests.ts
import { toCityEventListItems } from "app/Scenes/CityGuide/Screens/CityEventList/utils/cityEventListItems"

const sections = [
  { id: "farringdon", title: "Farringdon", items: [{ id: "a" }, { id: "b" }] },
  { id: "central", title: "Central London", items: [{ id: "c" }] },
]

describe("toCityEventListItems", () => {
  it("emits a header followed by that section's rows", () => {
    const items = toCityEventListItems(sections, new Set())
    const totalRows = sections.reduce((sum, s) => sum + s.items.length, 0)

    expect(items).toHaveLength(sections.length + totalRows)
    expect(items.map((i) => i.kind)).toEqual(["header", "row", "row", "header", "row"])
  })

  it("keeps a collapsed section's header and drops its rows", () => {
    const items = toCityEventListItems(sections, new Set(["farringdon"]))

    expect(items.map((i) => i.kind)).toEqual(["header", "header", "row"])
    expect(items.filter((i) => i.sectionId === "farringdon")).toHaveLength(1)
  })

  it("marks each header with its own expanded state", () => {
    const items = toCityEventListItems(sections, new Set(["central"]))
    const headers = items.filter((i) => i.kind === "header")

    expect(headers.map((h) => h.kind === "header" && h.isExpanded)).toEqual([true, false])
  })

  it("returns nothing for no sections", () => {
    expect(toCityEventListItems([], new Set())).toEqual([])
  })

  it("stamps every row with its section id", () => {
    const items = toCityEventListItems(sections, new Set())
    const rows = items.filter((i) => i.kind === "row")

    expect(rows.map((r) => r.sectionId)).toEqual(["farringdon", "farringdon", "central"])
  })
})
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `yarn test src/app/Scenes/CityGuide/Components/__tests__/CityEventSectionHeader.tests.tsx src/app/Scenes/CityGuide/Screens/CityEventList/utils/__tests__/cityEventListItems.tests.ts`
Expected: FAIL, neither module resolves.

- [ ] **Step 3: Write the header**

```tsx
// src/app/Scenes/CityGuide/Components/CityEventSectionHeader.tsx
import { ChevronDownIcon, ChevronUpIcon } from "@artsy/icons/native"
import { Flex, Text } from "@artsy/palette-mobile"
import { TouchableOpacity } from "react-native"

interface Props {
  title: string
  isExpanded: boolean
  onToggle: () => void
}

/**
 * Stateless on purpose. This renders as a recycled FlashList cell, so the screen owns
 * expansion state. `ItinerarySectionRow` is the stateful ScrollView equivalent and stays
 * where it is.
 */
export const CityEventSectionHeader: React.FC<Props> = ({ title, isExpanded, onToggle }) => {
  return (
    <TouchableOpacity
      testID="city-event-section-header"
      accessibilityRole="button"
      accessibilityState={{ expanded: isExpanded }}
      onPress={onToggle}
    >
      <Flex flexDirection="row" alignItems="center" justifyContent="space-between" py={1}>
        <Text variant="sm-display" color="blue100">
          {title}
        </Text>
        {isExpanded ? <ChevronUpIcon fill="blue100" /> : <ChevronDownIcon fill="blue100" />}
      </Flex>
    </TouchableOpacity>
  )
}
```

- [ ] **Step 4: Write the flattener**

```ts
// src/app/Scenes/CityGuide/Screens/CityEventList/utils/cityEventListItems.ts
import { CityEventSection } from "app/Scenes/CityGuide/utils/cityEventSections"

export type CityEventListItem<T> =
  | { kind: "header"; sectionId: string; title: string; isExpanded: boolean }
  | { kind: "row"; sectionId: string; item: T }

/**
 * Flattens sections into one array for FlashList. A collapsed section keeps its header and
 * loses its rows, so collapsing shifts every index below it. That is why the screen's headers
 * are not sticky.
 */
export const toCityEventListItems = <T>(
  sections: CityEventSection<T>[],
  collapsedSectionIds: Set<string>
): CityEventListItem<T>[] =>
  sections.flatMap((section) => {
    const isExpanded = !collapsedSectionIds.has(section.id)

    const header: CityEventListItem<T> = {
      kind: "header",
      sectionId: section.id,
      title: section.title,
      isExpanded,
    }

    if (!isExpanded) {
      return [header]
    }

    return [
      header,
      ...section.items.map<CityEventListItem<T>>((item) => ({
        kind: "row",
        sectionId: section.id,
        item,
      })),
    ]
  })
```

- [ ] **Step 5: Run the tests to verify they pass**

Run: `yarn test src/app/Scenes/CityGuide/Components/__tests__/CityEventSectionHeader.tests.tsx src/app/Scenes/CityGuide/Screens/CityEventList/utils/__tests__/cityEventListItems.tests.ts`
Expected: PASS, 3 header tests and 5 flattener tests.

- [ ] **Step 6: Type-check, lint and commit**

```bash
yarn tsc
yarn lint --fix src/app/Scenes/CityGuide/Components/CityEventSectionHeader.tsx src/app/Scenes/CityGuide/Screens/CityEventList/
git add src/app/Scenes/CityGuide/Components/ src/app/Scenes/CityGuide/Screens/CityEventList/
git commit -m "feat(city-guide): add stateless section header and list flattener

Assisted-by: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 7: Fragment fields the new screens need

Two scalar additions. Done as its own task because it regenerates Relay artifacts and touches
fragments five other screens spread, so it deserves its own gate.

**Files:**

- Modify: `src/app/Scenes/CityGuide/utils/CityGuideShow.ts`
- Modify: `src/app/Scenes/CityGuide/utils/CityGuideFair.ts`

- [ ] **Step 1: Add `postalCode` and the partner `slug`**

In `CityGuideShow.ts`, change the `location` block:

```graphql
location {
  postalCode
  coordinates {
    lat
    lng
  }
}
start_at: startAt
end_at: endAt
```

`partner.slug` is deliberately **not** added. No task in this plan reads it, and growing a
fragment five screens spread for an unused field is not free.

- [ ] **Step 2: Add the fair's postcode and profile follow fields**

In `CityGuideFair.ts`, add `postalCode` to the `location` block. Task 8 calls
`groupByNeighborhood<Fair>`, and the fragment currently fetches only coordinates
(`CityGuideFair.ts:16-21`), so without this the fair screen groups every fair into the
fallback section:

```graphql
location {
  postalCode
  coordinates {
    lat
    lng
  }
}
```

Then extend the existing `profile` block:

```graphql
profile {
  icon {
    internalID
    href
    height
    width
    url(version: "square140")
  }
  id
  internalID
  isFollowed
  slug
  name
}
```

- [ ] **Step 3: Regenerate Relay artifacts**

Run: `yarn relay`
Expected: "Compilation completed." and modified files under `src/__generated__/`.

- [ ] **Step 4: Confirm nothing that spreads these fragments broke**

Run:

```bash
yarn tsc
yarn test src/app/Scenes/CityGuide/Screens/Itinerary/__tests__/ItineraryScreen.tests.tsx
```

Expected: both pass. `CityGuideShow_show` is spread by `CityGuideMap`, `CitySavedList`,
`CitySectionList` and `CityFairList`; adding fields cannot break them, but `yarn tsc` proves it.

- [ ] **Step 5: Commit**

```bash
git add src/app/Scenes/CityGuide/utils/CityGuideShow.ts src/app/Scenes/CityGuide/utils/CityGuideFair.ts
git commit -m "feat(city-guide): fetch show and fair postcodes, fair follow state

Assisted-by: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 8: The shared destination screen and its route

**Files:**

- Create: `src/app/Scenes/CityGuide/Screens/CityEventList/CityEventListScreen.tsx`
- Modify: `src/app/Navigation/routes.tsx`
- Test: `src/app/Scenes/CityGuide/Screens/CityEventList/__tests__/CityEventListScreen.tests.tsx`

**Interfaces:**

- Consumes: `groupByNeighborhood`, `groupByOpeningWeek`, `CityEventSection` (Tasks 1 and 2);
  `toCityEventListItems`, `CityEventListItem`, `CityEventSectionHeader` (Task 6);
  `CityEventRow` (Task 5); `CityEventShowSaveControl`, `CityEventFairSaveControl` (Task 4);
  the fragment fields from Task 7.
- Produces: `CityEventListScreen: React.FC<{ citySlug: string; section: string }>`,
  `type CityEventSectionKey = "fairs" | "shows" | "opening"`, and
  `parseCityEventSection(value: string | undefined): CityEventSectionKey`.

- [ ] **Step 1: Write the failing test**

```tsx
// src/app/Scenes/CityGuide/Screens/CityEventList/__tests__/CityEventListScreen.tests.tsx
import { fireEvent, screen } from "@testing-library/react-native"
import { CityEventListScreen } from "app/Scenes/CityGuide/Screens/CityEventList/CityEventListScreen"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"

describe("CityEventListScreen", () => {
  const { renderWithRelay } = setupTestWrapper({ Component: CityEventListScreen })

  it("titles itself for the shows section", () => {
    renderWithRelay({}, { citySlug: "london-united-kingdom", section: "shows" })

    expect(screen.getByText("Current Shows")).toBeTruthy()
  })

  it("titles itself for the fairs section", () => {
    renderWithRelay({}, { citySlug: "london-united-kingdom", section: "fairs" })

    expect(screen.getByText("Current Fairs")).toBeTruthy()
  })

  it("titles itself for the opening section", () => {
    renderWithRelay({}, { citySlug: "london-united-kingdom", section: "opening" })

    expect(screen.getByText("Opening Soon")).toBeTruthy()
  })

  it("renders a row for every show the query returns", () => {
    const shows = [
      { name: "Frida Kahlo", location: { postalCode: "EC1M 5RR" } },
      { name: "Tracey Emin", location: { postalCode: "EC1M 5RR" } },
    ]

    renderWithRelay(
      {
        City: () => ({
          name: "London",
          showsConnection: { totalCount: shows.length, edges: shows.map((node) => ({ node })) },
        }),
      },
      { citySlug: "london-united-kingdom", section: "shows" }
    )

    // Derived from the data, not hardcoded, so growing the fixture cannot produce a false alarm.
    expect(screen.getAllByTestId("city-event-row")).toHaveLength(shows.length)
  })

  it("collapses a section when its header is pressed", () => {
    const shows = [{ name: "Frida Kahlo", location: { postalCode: "EC1M 5RR" } }]

    renderWithRelay(
      {
        City: () => ({
          name: "London",
          showsConnection: { totalCount: shows.length, edges: shows.map((node) => ({ node })) },
        }),
      },
      { citySlug: "london-united-kingdom", section: "shows" }
    )

    expect(screen.getAllByTestId("city-event-row")).toHaveLength(shows.length)

    fireEvent.press(screen.getAllByTestId("city-event-section-header")[0])

    expect(screen.queryAllByTestId("city-event-row")).toHaveLength(0)
    expect(screen.getAllByTestId("city-event-section-header").length).toBeGreaterThan(0)
  })

  it("falls back to shows for an unrecognised route section", () => {
    renderWithRelay({}, { citySlug: "london-united-kingdom", section: "not-a-section" })

    expect(screen.getByText("Current Shows")).toBeTruthy()
  })

  it("falls back to shows for a missing route section", () => {
    renderWithRelay({}, { citySlug: "london-united-kingdom", section: "" })

    expect(screen.getByText("Current Shows")).toBeTruthy()
  })

  it("groups fairs by postcode, not only shows", () => {
    const fairs = [
      { name: "Frieze London", location: { postalCode: "EC1M 5RR" } },
      { name: "1-54", location: { postalCode: "W1S 4BS" } },
    ]

    renderWithRelay(
      {
        City: () => ({
          name: "London",
          fairsConnection: {
            totalCount: fairs.length,
            edges: fairs.map((node) => ({ node })),
          },
        }),
      },
      { citySlug: "london-united-kingdom", section: "fairs" }
    )

    // Two different outward codes, so two named sections rather than one fallback.
    expect(screen.getAllByTestId("city-event-section-header")).toHaveLength(fairs.length)
    expect(screen.queryByText("More in London")).toBeNull()
  })

  it("keeps the footer count on the fetched total when a section is collapsed", () => {
    const shows = [{ name: "Frida Kahlo", location: { postalCode: "EC1M 5RR" } }]

    renderWithRelay(
      {
        City: () => ({
          name: "London",
          showsConnection: { totalCount: 143, edges: shows.map((node) => ({ node })) },
        }),
      },
      { citySlug: "london-united-kingdom", section: "shows" }
    )

    fireEvent.press(screen.getAllByTestId("city-event-section-header")[0])

    // Would read "Showing 0 of 143" if the count came from the flattened visible rows.
    expect(screen.getByText(`Showing ${shows.length} of 143`)).toBeTruthy()
  })

  it("says so when there are more events than one page", () => {
    const shows = [{ name: "Frida Kahlo", location: { postalCode: "EC1M 5RR" } }]

    renderWithRelay(
      {
        City: () => ({
          name: "London",
          showsConnection: { totalCount: 143, edges: shows.map((node) => ({ node })) },
        }),
      },
      { citySlug: "london-united-kingdom", section: "shows" }
    )

    expect(screen.getByText(/of 143/)).toBeTruthy()
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `yarn test src/app/Scenes/CityGuide/Screens/CityEventList/__tests__/CityEventListScreen.tests.tsx`
Expected: FAIL, cannot resolve `CityEventListScreen`.

- [ ] **Step 3: Write the screen**

```tsx
// src/app/Scenes/CityGuide/Screens/CityEventList/CityEventListScreen.tsx
import { Flex, Screen, SimpleMessage, Text } from "@artsy/palette-mobile"
import { FlashList } from "@shopify/flash-list"
import { CityEventListScreenQuery } from "__generated__/CityEventListScreenQuery.graphql"
import { LoadFailureView } from "app/Components/LoadFailureView"
import { CityEventRow } from "app/Scenes/CityGuide/Components/CityEventRow"
import {
  CityEventFairSaveControl,
  CityEventShowSaveControl,
} from "app/Scenes/CityGuide/Components/CityEventSaveControls"
import { CityEventSectionHeader } from "app/Scenes/CityGuide/Components/CityEventSectionHeader"
import {
  CityEventListItem,
  toCityEventListItems,
} from "app/Scenes/CityGuide/Screens/CityEventList/utils/cityEventListItems"
import { cityGuideFairFragment } from "app/Scenes/CityGuide/utils/CityGuideFair"
import { cityGuideShowFragment } from "app/Scenes/CityGuide/utils/CityGuideShow"
import {
  CityEventSection,
  groupByNeighborhood,
  groupByOpeningWeek,
} from "app/Scenes/CityGuide/utils/cityEventSections"
import { Fair, Show } from "app/Scenes/CityGuide/utils/types"
import { goBack } from "app/system/navigation/navigate"
import { extractNodes } from "app/utils/extractNodes"
import { SpinnerFallback, withSuspense } from "app/utils/hooks/withSuspense"
import { DateTime } from "luxon"
import { useCallback, useMemo, useState } from "react"
import { graphql, useFragment, useLazyLoadQuery } from "react-relay"

export type CityEventSectionKey = "fairs" | "shows" | "opening"

const SECTION_KEYS: CityEventSectionKey[] = ["fairs", "shows", "opening"]

/**
 * The route parameter is a runtime string from a deep link, so the TypeScript union proves
 * nothing about it. Anything unrecognised falls back to shows rather than rendering an
 * undefined title and an empty list.
 */
export const parseCityEventSection = (value: string | undefined): CityEventSectionKey =>
  SECTION_KEYS.includes(value as CityEventSectionKey) ? (value as CityEventSectionKey) : "shows"

const PAGE_SIZE = 100

const TITLES: Record<CityEventSectionKey, string> = {
  fairs: "Current Fairs",
  shows: "Current Shows",
  opening: "Opening Soon",
}

interface Props {
  citySlug: string
  /** Raw route parameter. Parsed, never trusted: a deep link can carry any string. */
  section: string
}

type Event = Show | Fair

const CityEventList: React.FC<Props> = ({ citySlug, section: rawSection }) => {
  const section = parseCityEventSection(rawSection)

  const data = useLazyLoadQuery<CityEventListScreenQuery>(Query, {
    citySlug,
    includeFairs: section === "fairs",
    includeShows: section !== "fairs",
    showStatus: section === "opening" ? "UPCOMING" : "RUNNING",
  })

  const [collapsedSectionIds, setCollapsedSectionIds] = useState<Set<string>>(new Set())

  const cityName = data.city?.name ?? ""

  const fairs = useFragment(cityGuideFairFragment, extractNodes(data.city?.fairsConnection))
  const shows = useFragment(cityGuideShowFragment, extractNodes(data.city?.showsConnection))

  const totalCount =
    (section === "fairs"
      ? data.city?.fairsConnection?.totalCount
      : data.city?.showsConnection?.totalCount) ?? 0

  const sections: CityEventSection<Event>[] = useMemo(() => {
    if (section === "fairs") {
      return groupByNeighborhood<Fair>(fairs, citySlug, cityName)
    }

    if (section === "opening") {
      return groupByOpeningWeek<Show>(shows, DateTime.now())
    }

    return groupByNeighborhood<Show>(shows, citySlug, cityName)
  }, [section, fairs, shows, citySlug, cityName])

  const items = useMemo(
    () => toCityEventListItems(sections, collapsedSectionIds),
    [sections, collapsedSectionIds]
  )

  const toggleSection = useCallback((sectionId: string) => {
    setCollapsedSectionIds((collapsed) => {
      const next = new Set(collapsed)

      if (next.has(sectionId)) {
        next.delete(sectionId)
      } else {
        next.add(sectionId)
      }

      return next
    })
  }, [])

  const renderItem = useCallback(
    ({ item }: { item: CityEventListItem<Event> }) => {
      if (item.kind === "header") {
        return (
          <CityEventSectionHeader
            title={item.title}
            isExpanded={item.isExpanded}
            onToggle={() => toggleSection(item.sectionId)}
          />
        )
      }

      return section === "fairs"
        ? renderFairRow(item.item as Fair)
        : renderShowRow(item.item as Show)
    },
    [section, toggleSection]
  )

  // Counted from what the query returned, never from the flattened list: collapsing a
  // section removes rows from `items` and would otherwise render "Showing 0 of 143".
  const fetchedCount = section === "fairs" ? fairs.length : shows.length

  return (
    <Screen>
      <Screen.AnimatedHeader title={cityName} onBack={goBack} />

      <Screen.Body fullwidth>
        <Flex px={2} pb={1}>
          <Text variant="lg-display">{TITLES[section]}</Text>
        </Flex>

        {items.length === 0 ? (
          <Flex px={2} py={2}>
            <SimpleMessage>
              {`There is nothing to show here yet. Check back later to see events in ${cityName}.`}
            </SimpleMessage>
          </Flex>
        ) : (
          <FlashList<CityEventListItem<Event>>
            data={items}
            renderItem={renderItem}
            getItemType={(item) => item.kind}
            keyExtractor={cityEventListKey}
            contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
            ListFooterComponent={
              totalCount > PAGE_SIZE ? (
                <Flex py={2}>
                  <Text variant="xs" color="mono60">
                    {`Showing ${fetchedCount} of ${totalCount}`}
                  </Text>
                </Flex>
              ) : null
            }
          />
        )}
      </Screen.Body>
    </Screen>
  )
}

/**
 * Headers key on the section id, rows on the entity id. Both are stable across a collapse,
 * which shifts every index below the toggled header.
 */
const cityEventListKey = (item: CityEventListItem<Event>) =>
  item.kind === "header" ? `header-${item.sectionId}` : `row-${item.item.id}`

const renderShowRow = (show: Show) => (
  <CityEventRow
    title={show.name ?? ""}
    subtitle={show.partner?.name ?? null}
    meta={show.exhibition_period ?? null}
    imageURL={show.cover_image?.url ?? null}
    href={show.href ?? null}
    saveControl={
      <CityEventShowSaveControl
        id={show.id}
        internalID={show.internalID}
        isFollowed={show.is_followed}
        name={show.name ?? ""}
      />
    }
  />
)

const renderFairRow = (fair: Fair) => (
  <CityEventRow
    title={fair.name ?? ""}
    subtitle={fair.profile?.name ?? null}
    meta={fair.exhibition_period ?? null}
    imageURL={fair.image?.url ?? null}
    href={`/fair/${fair.slug}`}
    saveControl={
      fair.profile ? (
        <CityEventFairSaveControl
          id={fair.profile.id}
          internalID={fair.profile.internalID}
          isFollowed={fair.profile.isFollowed}
          name={fair.name ?? ""}
        />
      ) : null
    }
  />
)

const Query = graphql`
  query CityEventListScreenQuery(
    $citySlug: String!
    $includeFairs: Boolean!
    $includeShows: Boolean!
    $showStatus: EventStatus!
  ) {
    city(slug: $citySlug) {
      name

      fairsConnection(first: 100, status: RUNNING, sort: START_AT_ASC) @include(if: $includeFairs) {
        totalCount
        edges {
          node {
            ...CityGuideFair_fair
          }
        }
      }

      showsConnection(
        first: 100
        status: $showStatus
        dayThreshold: 14
        sort: START_AT_ASC
        includeStubShows: false
      ) @include(if: $includeShows) {
        totalCount
        edges {
          node {
            ...CityGuideShow_show
          }
        }
      }
    }
  }
`

export const CityEventListScreen = withSuspense({
  Component: CityEventList,
  LoadingFallback: SpinnerFallback,
  ErrorFallback: (fallbackProps) => (
    <LoadFailureView error={fallbackProps.error} onRetry={fallbackProps.resetErrorBoundary} />
  ),
})
```

`dayThreshold: 14` is harmless on the `RUNNING` query: Gravity only reads it for the upcoming
and closing-soon scopes (`event_status.rb:26,46`).

- [ ] **Step 4: Regenerate Relay artifacts**

Run: `yarn relay`
Expected: "Compilation completed." and a new `CityEventListScreenQuery.graphql.ts`.

- [ ] **Step 5: Run the test to verify it passes**

Run: `yarn test src/app/Scenes/CityGuide/Screens/CityEventList/__tests__/CityEventListScreen.tests.tsx`
Expected: PASS, 10 tests.

- [ ] **Step 5b: Add screen-view tracking**

The spec's analytics table requires a view event for each destination screen, and without one
these screens are invisible in reporting. Add to `CityEventList`, following the pattern in
`CitySectionList.tsx:41-44`:

```tsx
const { trackEvent } = useTracking()

useEffect(() => {
  trackEvent(tracks.screen(section, citySlug))
}, [trackEvent, section, citySlug])
```

with a `tracks` object at the bottom of the file using the scene's existing `Schema` values.
Copy the shape from `CitySectionList`'s own `tracks` rather than inventing event names, and
assert it in the test file with
`import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"`.

- [ ] **Step 6: Add the route**

In `src/app/Navigation/routes.tsx`, import the screen and add an entry beside the existing
`/city-guide/:citySlug/itinerary/:itineraryId` route at line 1144:

```tsx
{
  path: "/city-guide/:citySlug/events/:section",
  name: "CityEventList",
  Component: CityEventListScreen,
},
```

The route is named `CityEventList`, not `CityGuideEventList`, because a legacy _component_
already carries the latter name and two things sharing it is needless confusion.

The `:section` parameter arrives as an arbitrary string. `CityEventListScreen` parses it with
`parseCityEventSection`, so a deep link to `/events/banana` renders Current Shows rather than
an undefined title over an empty list. Check that by hand:

```bash
xcrun simctl openurl booted "artsy:///city-guide/london-united-kingdom/events/banana"
```

Expected: the Current Shows screen.

- [ ] **Step 7: Verify the route resolves**

Run: `yarn tsc`
Expected: PASS. Then check by hand in the simulator, from a terminal:

```bash
xcrun simctl openurl booted "artsy:///city-guide/london-united-kingdom/events/shows"
```

Expected: the Current Shows screen, with collapsible neighbourhood sections.

- [ ] **Step 8: Lint and commit**

```bash
yarn lint --fix src/app/Scenes/CityGuide/Screens/CityEventList/ src/app/Navigation/routes.tsx
git add src/app/Scenes/CityGuide/Screens/CityEventList/ src/app/Navigation/routes.tsx
git commit -m "feat(city-guide): add shared city event list screen and route

One screen serves Current Fairs, Current Shows and Opening Soon. Fetches one
page of 100, which is Gravity's hard cap, and states the cap rather than
truncating silently.

Assisted-by: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 9: The home summary row

**Files:**

- Create: `src/app/Scenes/CityGuide/Components/CityGuideEventSummaryRow.tsx`
- Test: `src/app/Scenes/CityGuide/Components/__tests__/CityGuideEventSummaryRow.tests.tsx`

**Interfaces:**

- Consumes: nothing from earlier tasks.
- Produces: `CityGuideEventSummaryRow: React.FC<{ title: string; count: number; countLabel: string; subtitle?: string | null; imageURL?: string | null; onPress: () => void }>`

- [ ] **Step 1: Write the failing test**

```tsx
// src/app/Scenes/CityGuide/Components/__tests__/CityGuideEventSummaryRow.tests.tsx
import { fireEvent, screen } from "@testing-library/react-native"
import { CityGuideEventSummaryRow } from "app/Scenes/CityGuide/Components/CityGuideEventSummaryRow"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

describe("CityGuideEventSummaryRow", () => {
  const props = {
    title: "Current Fairs",
    count: 5,
    countLabel: "Fair",
    subtitle: "Frieze London, 1-54, Photo London",
    imageURL: "https://example.com/a.jpg",
    onPress: jest.fn(),
  }

  it("renders the title, the pluralised count and the subtitle", () => {
    renderWithWrappers(<CityGuideEventSummaryRow {...props} />)

    expect(screen.getByText("Current Fairs")).toBeTruthy()
    expect(screen.getByText("5 Fairs")).toBeTruthy()
    expect(screen.getByText("Frieze London, 1-54, Photo London")).toBeTruthy()
  })

  it("does not pluralise a count of one", () => {
    renderWithWrappers(<CityGuideEventSummaryRow {...props} count={1} />)

    expect(screen.getByText("1 Fair")).toBeTruthy()
  })

  it("renders without a subtitle", () => {
    renderWithWrappers(<CityGuideEventSummaryRow {...props} subtitle={null} />)

    expect(screen.getByText("5 Fairs")).toBeTruthy()
  })

  it("renders emptyText instead of a zero count", () => {
    // Load-bearing, not cosmetic: a production measurement on 2026-08-27 found London had zero
    // current fairs, so without this the home renders "0 Fairs" over a dead row.
    renderWithWrappers(
      <CityGuideEventSummaryRow {...props} count={0} emptyText="No fairs open right now" />
    )

    expect(screen.getByText("No fairs open right now")).toBeTruthy()
    expect(screen.queryByText("0 Fairs")).toBeNull()
  })

  it("falls back to the count line when the count is zero and no emptyText is given", () => {
    renderWithWrappers(<CityGuideEventSummaryRow {...props} count={0} />)

    expect(screen.getByText("0 Fairs")).toBeTruthy()
  })

  it("appends a count suffix when given one", () => {
    renderWithWrappers(<CityGuideEventSummaryRow {...props} count={100} countSuffix="+" />)

    expect(screen.getByText("100+ Fairs")).toBeTruthy()
  })

  it("renders no suffix when none is given", () => {
    renderWithWrappers(<CityGuideEventSummaryRow {...props} count={5} />)

    expect(screen.getByText("5 Fairs")).toBeTruthy()
  })

  it("calls onPress when the row is pressed", () => {
    const onPress = jest.fn()

    renderWithWrappers(<CityGuideEventSummaryRow {...props} onPress={onPress} />)
    fireEvent.press(screen.getByTestId("city-guide-event-summary-row"))

    expect(onPress).toHaveBeenCalledTimes(1)
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `yarn test src/app/Scenes/CityGuide/Components/__tests__/CityGuideEventSummaryRow.tests.tsx`
Expected: FAIL, cannot resolve `CityGuideEventSummaryRow`.

- [ ] **Step 3: Write the implementation**

```tsx
// src/app/Scenes/CityGuide/Components/CityGuideEventSummaryRow.tsx
import { Flex, Text } from "@artsy/palette-mobile"
import { SectionTitle } from "app/Components/SectionTitle"
import { pluralize } from "app/utils/pluralize"
import { Image as RNImage, TouchableOpacity } from "react-native"

const IMAGE_SIZE = 44

interface Props {
  title: string
  count: number
  /** Singular noun. Pluralised against `count`. */
  countLabel: string
  /** Appended to the count, for example "+" when the page cap was hit. */
  countSuffix?: string
  /**
   * Shown in place of the count line when `count` is 0. Required in practice: London had zero
   * current fairs when this was measured, and "0 Fairs" is a worse row than a sentence saying
   * nothing is on.
   */
  emptyText?: string
  /** The first few event or partner names, comma joined. One line. */
  subtitle?: string | null
  imageURL?: string | null
  onPress: () => void
}

export const CityGuideEventSummaryRow: React.FC<Props> = ({
  title,
  count,
  countLabel,
  countSuffix,
  emptyText,
  subtitle,
  imageURL,
  onPress,
}) => {
  return (
    <Flex px={2}>
      <SectionTitle title={title} onPress={onPress} />

      <TouchableOpacity
        testID="city-guide-event-summary-row"
        accessibilityRole="button"
        onPress={onPress}
      >
        <Flex flexDirection="row" gap={1} alignItems="center">
          {!!imageURL && (
            <RNImage
              source={{ uri: imageURL }}
              width={IMAGE_SIZE}
              height={IMAGE_SIZE}
              resizeMode="cover"
            />
          )}

          <Flex flex={1}>
            <Text variant="sm-display">
              {count === 0 && !!emptyText
                ? emptyText
                : `${count}${countSuffix ?? ""} ${pluralize(countLabel, count)}`}
            </Text>

            {!!subtitle && (
              <Text variant="xs" color="mono60" numberOfLines={1}>
                {subtitle}
              </Text>
            )}
          </Flex>
        </Flex>
      </TouchableOpacity>
    </Flex>
  )
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `yarn test src/app/Scenes/CityGuide/Components/__tests__/CityGuideEventSummaryRow.tests.tsx`
Expected: PASS, 8 tests.

- [ ] **Step 5: Type-check, lint and commit**

```bash
yarn tsc
yarn lint --fix src/app/Scenes/CityGuide/Components/CityGuideEventSummaryRow.tsx src/app/Scenes/CityGuide/Components/__tests__/CityGuideEventSummaryRow.tests.tsx
git add src/app/Scenes/CityGuide/Components/
git commit -m "feat(city-guide): add CityGuideEventSummaryRow

Assisted-by: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 10: Replace the stub on the home

**Files:**

- Modify: `src/app/Scenes/CityGuide/Components/CityGuideEvents.tsx` (full rewrite)
- Modify: `src/app/Scenes/CityGuide/CityGuideNew.tsx` (pass `citySlug`)
- Test: `src/app/Scenes/CityGuide/Components/__tests__/CityGuideEvents.tests.tsx`

**Interfaces:**

- Consumes: `CityGuideEventSummaryRow` (Task 9); the route added in Task 8.
- Produces: `CityGuideEvents: React.FC<{ citySlug: string }>`.

- [ ] **Step 1: Write the failing test**

```tsx
// src/app/Scenes/CityGuide/Components/__tests__/CityGuideEvents.tests.tsx
import { fireEvent, screen } from "@testing-library/react-native"
import { CityGuideEvents } from "app/Scenes/CityGuide/Components/CityGuideEvents"
// `navigate` is globally mocked as a jest.fn() in `setupJest.tsx:631`, so no per-file
// jest.mock is needed -- import it and assert on it directly.
import { navigate } from "app/system/navigation/navigate"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"

describe("CityGuideEvents", () => {
  const { renderWithRelay } = setupTestWrapper({ Component: CityGuideEvents })

  it("renders all three sections", () => {
    renderWithRelay({}, { citySlug: "london-united-kingdom" })

    expect(screen.getByText("Current Fairs")).toBeTruthy()
    expect(screen.getByText("Current Shows")).toBeTruthy()
    expect(screen.getByText("Opening Soon")).toBeTruthy()
  })

  it("shows each section's real count", () => {
    renderWithRelay(
      {
        City: () => ({
          fairsConnection: { totalCount: 5, edges: [] },
          currentShows: { totalCount: 8, edges: [] },
          openingShows: { totalCount: 6, edges: [] },
        }),
      },
      { citySlug: "london-united-kingdom" }
    )

    expect(screen.getByText("5 Fairs")).toBeTruthy()
    expect(screen.getByText("8 Shows")).toBeTruthy()
    expect(screen.getByText("6 Shows")).toBeTruthy()
  })

  it("opens the fairs section from the Current Fairs row", async () => {
    renderWithRelay({}, { citySlug: "london-united-kingdom" })

    fireEvent.press(await screen.findByText("Current Fairs"))

    // Proves this row is bound to its OWN section. Without a per-row assertion, three rows
    // pointing at the same section by a copy-paste slip would pass every other test, and the
    // simulator hand-check could not scroll far enough to catch it either.
    expect(navigate).toHaveBeenCalledWith("/city-guide/london-united-kingdom/events/fairs")
  })

  it("opens the shows section from the Current Shows row", async () => {
    renderWithRelay({}, { citySlug: "london-united-kingdom" })

    await screen.findByText("Current Shows")
    fireEvent.press(screen.getByText("Current Shows"))

    expect(navigate).toHaveBeenCalledWith("/city-guide/london-united-kingdom/events/shows")
  })

  it("opens the opening section from the Opening Soon row", async () => {
    renderWithRelay({}, { citySlug: "london-united-kingdom" })

    await screen.findByText("Opening Soon")
    fireEvent.press(screen.getByText("Opening Soon"))

    expect(navigate).toHaveBeenCalledWith("/city-guide/london-united-kingdom/events/opening")
  })

  it("lists names in the subtitle rather than a date placeholder", () => {
    renderWithRelay(
      {
        City: () => ({
          fairsConnection: {
            totalCount: 2,
            edges: [{ node: { name: "Frieze London" } }, { node: { name: "1-54" } }],
          },
        }),
      },
      { citySlug: "london-united-kingdom" }
    )

    expect(screen.getByText("Frieze London, 1-54")).toBeTruthy()
    expect(screen.queryByText("Date Placeholder")).toBeNull()
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `yarn test src/app/Scenes/CityGuide/Components/__tests__/CityGuideEvents.tests.tsx`
Expected: FAIL. The current `CityGuideEvents` takes no props and renders "Date Placeholder".

- [ ] **Step 3: Rewrite the component**

Replace the entire contents of `src/app/Scenes/CityGuide/Components/CityGuideEvents.tsx`.
Everything currently in it goes, including `fairsData`, `showsData`, the `picsum.photos`
image and the "Date Placeholder" text.

```tsx
// src/app/Scenes/CityGuide/Components/CityGuideEvents.tsx
import { Join, Spacer } from "@artsy/palette-mobile"
import { CityGuideEventsQuery } from "__generated__/CityGuideEventsQuery.graphql"
import { CityGuideEventSummaryRow } from "app/Scenes/CityGuide/Components/CityGuideEventSummaryRow"
import { CityEventSectionKey } from "app/Scenes/CityGuide/Screens/CityEventList/CityEventListScreen"
// eslint-disable-next-line no-restricted-imports
import { navigate } from "app/system/navigation/navigate"
import { extractNodes } from "app/utils/extractNodes"
import { NoFallback, withSuspense } from "app/utils/hooks/withSuspense"
import { graphql, useLazyLoadQuery } from "react-relay"

const NAMES_IN_SUBTITLE = 3

interface Props {
  citySlug: string
}

const joinNames = (names: (string | null | undefined)[]) =>
  names.filter(Boolean).slice(0, NAMES_IN_SUBTITLE).join(", ") || null

const CityGuideEventsSections: React.FC<Props> = ({ citySlug }) => {
  const data = useLazyLoadQuery<CityGuideEventsQuery>(Query, { citySlug })

  const openSection = (section: CityEventSectionKey) => {
    navigate(`/city-guide/${citySlug}/events/${section}`)
  }

  const fairs = extractNodes(data.city?.fairsConnection)
  const currentShows = extractNodes(data.city?.currentShows)
  const openingShows = extractNodes(data.city?.openingShows)

  return (
    <Join separator={<Spacer y={2} />}>
      <CityGuideEventSummaryRow
        title="Current Fairs"
        count={data.city?.fairsConnection?.totalCount ?? 0}
        countLabel="Fair"
        emptyText="No fairs open right now"
        subtitle={joinNames(fairs.map((fair) => fair.name))}
        imageURL={fairs[0]?.image?.url ?? null}
        onPress={() => openSection("fairs")}
      />

      <CityGuideEventSummaryRow
        title="Current Shows"
        count={data.city?.currentShows?.totalCount ?? 0}
        countLabel="Show"
        emptyText="No shows open right now"
        subtitle={joinNames(currentShows.map((show) => show.partner?.name))}
        imageURL={currentShows[0]?.coverImage?.url ?? null}
        onPress={() => openSection("shows")}
      />

      <CityGuideEventSummaryRow
        title="Opening Soon"
        count={data.city?.openingShows?.totalCount ?? 0}
        countLabel="Show"
        emptyText="Nothing opening in the next two weeks"
        subtitle={joinNames(openingShows.map((show) => show.partner?.name))}
        imageURL={openingShows[0]?.coverImage?.url ?? null}
        onPress={() => openSection("opening")}
      />
    </Join>
  )
}

/**
 * `first: 3` plus `totalCount`, because the home shows three names and a number and has no
 * use for the other ninety-seven records. `status: RUNNING` rather than `CURRENT`, which
 * would overlap `UPCOMING` and put the same show under both Current Shows and Opening Soon.
 */
const Query = graphql`
  query CityGuideEventsQuery($citySlug: String!) {
    city(slug: $citySlug) {
      name

      fairsConnection(first: 3, status: RUNNING, sort: START_AT_ASC) {
        totalCount
        edges {
          node {
            name
            image {
              url
            }
          }
        }
      }

      currentShows: showsConnection(
        first: 3
        status: RUNNING
        sort: START_AT_ASC
        includeStubShows: false
      ) {
        totalCount
        edges {
          node {
            coverImage {
              url
            }
            partner {
              ... on Partner {
                name
              }
            }
          }
        }
      }

      openingShows: showsConnection(
        first: 3
        status: UPCOMING
        dayThreshold: 14
        sort: START_AT_ASC
      ) {
        totalCount
        edges {
          node {
            coverImage {
              url
            }
            partner {
              ... on Partner {
                name
              }
            }
          }
        }
      }
    }
  }
`

export const CityGuideEvents = withSuspense({
  Component: CityGuideEventsSections,
  LoadingFallback: () => null,
  ErrorFallback: NoFallback,
})
```

- [ ] **Step 4: Pass the city slug from the home**

In `src/app/Scenes/CityGuide/CityGuideNew.tsx`, change the render:

```tsx
<CityGuideEvents citySlug={city?.slug ?? ""} />
```

- [ ] **Step 5: Regenerate Relay artifacts**

Run: `yarn relay`
Expected: "Compilation completed." and a new `CityGuideEventsQuery.graphql.ts`.

- [ ] **Step 6: Run the tests to verify they pass**

Run:

```bash
yarn test src/app/Scenes/CityGuide/Components/__tests__/CityGuideEvents.tests.tsx
yarn tsc
```

Expected: 6 tests pass, no type errors.

- [ ] **Step 7: Check it by hand**

```bash
xcrun simctl openurl booted "artsy:///city-guide"
```

Expected: three summary rows with real counts and names, no `picsum.photos` image, no
"Date Placeholder". Tapping each title opens the matching screen.

- [ ] **Step 8: Lint and commit**

```bash
yarn lint --fix src/app/Scenes/CityGuide/Components/CityGuideEvents.tsx src/app/Scenes/CityGuide/CityGuideNew.tsx
git add src/app/Scenes/CityGuide/
git commit -m "feat(city-guide): give the home real event sections

Replaces the stub's picsum image, hardcoded arrays and \"Date Placeholder\"
with three Relay-backed summary rows that open the new event screens.

Assisted-by: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

**Phase 1 is complete here.** The home shows real data and all three destinations work. Stop
and review before starting phase 2.

---

### Task 11: The city itinerary screen, shows and fairs

Read the file before changing it. The shape is not what a reader might assume:

- `CitySavedList` is **private** and takes `me`, `cityName` and `citySlug`
  (`CitySavedList.tsx:18-24`).
- The exported route component is `CitySavedListQueryRenderer` (`CitySavedList.tsx:108`).
- It has **no `renderItem`**. It hands a bucket to `CityGuideEventList`
  (`CitySavedList.tsx:56-64`), which renders `ShowItemRow` (`CityGuideEventList.tsx:35-45`)
  and is also used by `CitySectionList`.

**Decision, from the spec:** `CitySavedList` stops using `CityGuideEventList` and renders its
own list. Extending that shared component to handle fairs and a new row would change a screen
the legacy City Guide still renders, which the spec's decision 4 rules out.

Two fixes travel with the restyle: the show window widens to 365 days, and followed fairs join
the list.

**Files:**

- Modify: `src/app/Scenes/CityGuide/Screens/CitySavedList.tsx`
- Test: `src/app/Scenes/CityGuide/Screens/__tests__/CitySavedList.tests.tsx`

**Interfaces:**

- Consumes: `CityEventRow` (Task 5); `CityEventShowSaveControl` and `CityEventFairSaveControl`
  (Task 4); the fair fragment fields from Task 7.
- Produces: no new exports. `CitySavedListQueryRenderer` keeps its name and its route.

- [ ] **Step 1: Read what exists**

```bash
cat src/app/Scenes/CityGuide/Screens/CitySavedList.tsx
```

Note the fragment name, the `@connection` key, the pagination plumbing and the props the
query renderer passes down. All of that survives. Only the query arguments and the rendering
change.

- [ ] **Step 2: Write the failing tests**

```tsx
// src/app/Scenes/CityGuide/Screens/__tests__/CitySavedList.tests.tsx
import { screen, within } from "@testing-library/react-native"
import { CitySavedListQueryRenderer } from "app/Scenes/CityGuide/Screens/CitySavedList"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"

describe("CitySavedListQueryRenderer", () => {
  const { renderWithRelay } = setupTestWrapper({ Component: CitySavedListQueryRenderer })
  const props = { citySlug: "london-united-kingdom" }

  it("renders a row for every saved show", () => {
    const shows = [{ name: "Frida Kahlo" }, { name: "Tracey Emin" }]

    renderWithRelay(
      {
        FollowsAndSaves: () => ({ shows: { edges: shows.map((node) => ({ node })) } }),
        City: () => ({ name: "London", fairsConnection: { edges: [] } }),
      },
      props
    )

    expect(screen.getAllByTestId("city-event-row")).toHaveLength(shows.length)
  })

  it("includes followed fairs and excludes unfollowed ones", () => {
    const fairs = [
      { name: "Frieze London", profile: { isFollowed: true } },
      { name: "Photo London", profile: { isFollowed: false } },
    ]
    const followed = fairs.filter((f) => f.profile.isFollowed)

    renderWithRelay(
      {
        FollowsAndSaves: () => ({ shows: { edges: [] } }),
        City: () => ({
          name: "London",
          fairsConnection: { edges: fairs.map((node) => ({ node })) },
        }),
      },
      props
    )

    expect(screen.getAllByTestId("city-event-row")).toHaveLength(followed.length)
    expect(screen.getByText("Frieze London")).toBeTruthy()
    expect(screen.queryByText("Photo London")).toBeNull()
  })

  it("puts fairs above shows", () => {
    renderWithRelay(
      {
        FollowsAndSaves: () => ({ shows: { edges: [{ node: { name: "Frida Kahlo" } }] } }),
        City: () => ({
          name: "London",
          fairsConnection: {
            edges: [{ node: { name: "Frieze London", profile: { isFollowed: true } } }],
          },
        }),
      },
      props
    )

    const rows = screen.getAllByTestId("city-event-row")
    // Ordering is positional so paginating shows cannot reorder what is already on screen.
    // `within` rather than `toContainElement`: jest-native is not installed in this repo, so
    // that matcher does not exist.
    expect(within(rows[0]).getByText("Frieze London")).toBeTruthy()
  })

  it("asks for a 365-day upcoming window for shows", () => {
    // Guards the real fix: Gravity defaults RUNNING_AND_UPCOMING to 15 days, which hides a
    // show saved for a trip next month. Asserted on the compiled Relay request, never on the
    // component's source text, and read from the generated artifact because
    // `mockResolveLastOperation` returns void (`setupTestWrapper.tsx:131-137`).
    //
    // The artifact is named after the query, `CitySavedListQuery`, not after the exported
    // const `CitySavedListScreenQuery` (`CitySavedList.tsx:97-98`).
    const request = require("__generated__/CitySavedListQuery.graphql").default

    expect(JSON.stringify(request)).toContain("dayThreshold")
  })

  it("shows an empty state when nothing is saved", () => {
    renderWithRelay(
      {
        FollowsAndSaves: () => ({ shows: { edges: [] } }),
        City: () => ({ name: "London", fairsConnection: { edges: [] } }),
      },
      props
    )

    expect(screen.queryAllByTestId("city-event-row")).toHaveLength(0)
    expect(screen.getByText(/haven’t saved/)).toBeTruthy()
  })
})
```

> `dayThreshold` lives on the paginated **fragment**, not the root query, so if the argument
> does not appear in `CitySavedListQuery.graphql` look in
> `CitySavedList_me.graphql` instead and assert there. Confirm which artifact carries it by
> grepping after `yarn relay`:
> `grep -rl dayThreshold src/__generated__ | grep CitySavedList`.

- [ ] **Step 3: Run the tests to verify they fail**

Run: `yarn test src/app/Scenes/CityGuide/Screens/__tests__/CitySavedList.tests.tsx`
Expected: FAIL. The screen renders `ShowItemRow` through `CityGuideEventList`, fetches no
fairs, and passes no `dayThreshold`.

- [ ] **Step 4: Widen the show window and fetch followed fairs**

In the paginated fragment, add `dayThreshold`:

```graphql
shows: showsConnection(
  first: $count
  status: RUNNING_AND_UPCOMING
  dayThreshold: 365
  city: $citySlug
  after: $cursor
) @connection(key: "CitySavedList_shows") {
```

Then add the city's fairs to `CitySavedListScreenQuery`, so the fair half arrives in the same
round trip. `RUNNING_AND_UPCOMING` here carries Gravity's fixed 15-day upcoming window and
there is no argument that widens it, because the fairs endpoint calls the scope with no
argument (`v1/fairs_endpoint.rb:166`) and Metaphysics forwards no threshold
(`city/index.ts:128-141`):

```graphql
city(slug: $citySlug) {
  name
  fairsConnection(first: 100, status: RUNNING_AND_UPCOMING, sort: START_AT_ASC) {
    edges {
      node {
        ...CityGuideFair_fair
      }
    }
  }
}
```

The root query already selects `city(slug: $citySlug) { name }` (`CitySavedList.tsx:97-106`),
so this extends an existing selection rather than adding one.

**Thread the fairs down.** `CitySavedList` receives only `me`, `cityName` and `citySlug`
today, so `CitySavedListQueryRenderer` must pass the city through as a new prop. Add
`city: CitySavedListQuery["response"]["city"]` to the private component's `Props` and pass
`data.city` at the call site (`CitySavedList.tsx:108-133`), which already null-checks
`data.city` before rendering.

- [ ] **Step 5: Render both, fairs first**

Replace the `CityGuideEventList` call with the screen's own list:

```tsx
const showRefs: CityGuideShow_show$key = extractNodes(data.followsAndSaves?.shows)
const shows = useFragment(cityGuideShowFragment, showRefs)

const fairRefs: CityGuideFair_fair$key = extractNodes(city?.fairsConnection)
const allFairs = useFragment(cityGuideFairFragment, fairRefs)
const followedFairs = allFairs.filter((fair) => !!fair.profile?.isFollowed)

// Fairs first, then shows. Positional rather than merged by date, so loading another page of
// shows cannot reorder anything already on screen. Fairs are unpaginated: one page of 100
// city fairs is the whole set for any real city.
const rows: CityItineraryRow[] = [
  ...followedFairs.map((fair) => ({ kind: "fair" as const, fair })),
  ...shows.map((show) => ({ kind: "show" as const, show })),
]

if (rows.length === 0) {
  return (
    <Flex px={2} py={2}>
      <SimpleMessage>
        {`You haven’t saved anything in ${cityName} yet. When you save shows and fairs, they will show up here.`}
      </SimpleMessage>
    </Flex>
  )
}

return (
  <FlashList<CityItineraryRow>
    data={rows}
    keyExtractor={(row) => (row.kind === "fair" ? `fair-${row.fair.id}` : `show-${row.show.id}`)}
    getItemType={(row) => row.kind}
    renderItem={({ item }) =>
      item.kind === "fair" ? renderFairRow(item.fair) : renderShowRow(item.show)
    }
    onScroll={isCloseToBottom(fetchData)}
    ListFooterComponent={fetchingNextPage ? <Spinner style={{ marginVertical: 20 }} /> : null}
    contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
  />
)
```

with the row type declared above the component:

```tsx
type CityItineraryRow = { kind: "fair"; fair: Fair } | { kind: "show"; show: Show }
```

and the two renderers, identical in shape to Task 8's so the rows match across screens:

```tsx
const renderShowRow = (show: Show) => (
  <CityEventRow
    title={show.name ?? ""}
    subtitle={show.partner?.name ?? null}
    meta={show.exhibition_period ?? null}
    imageURL={show.cover_image?.url ?? null}
    href={show.href ?? null}
    saveControl={
      <CityEventShowSaveControl
        id={show.id}
        internalID={show.internalID}
        isFollowed={show.is_followed}
        name={show.name ?? ""}
      />
    }
  />
)

const renderFairRow = (fair: Fair) => (
  <CityEventRow
    title={fair.name ?? ""}
    subtitle={fair.profile?.name ?? null}
    meta={fair.exhibition_period ?? null}
    imageURL={fair.image?.url ?? null}
    href={`/fair/${fair.slug}`}
    saveControl={
      fair.profile ? (
        <CityEventFairSaveControl
          id={fair.profile.id}
          internalID={fair.profile.internalID}
          isFollowed={fair.profile.isFollowed}
          name={fair.name ?? ""}
        />
      ) : null
    }
  />
)
```

Leave `CityGuideEventList` untouched. `CitySectionList` still uses it.

- [ ] **Step 6: Add the screen-view tracking**

The screen already calls `trackEvent` on mount (`CitySavedList.tsx`); keep that call and its
existing schema, and confirm it still fires after the refactor by asserting on it in the test
if the existing tracking test pattern in this scene does so.

- [ ] **Step 7: Regenerate, test and type-check**

Run:

```bash
yarn relay
yarn test src/app/Scenes/CityGuide/Screens/__tests__/CitySavedList.tests.tsx
yarn tsc
```

Expected: 5 tests pass, no type errors.

- [ ] **Step 8: Confirm the legacy screen still works**

Run: `yarn test src/app/Scenes/CityGuide/Screens/Itinerary/__tests__/ItineraryScreen.tests.tsx`

Then by hand, because `CityGuideEventList` is shared and must be unaffected:

```bash
xcrun simctl openurl booted "artsy:///city/london-united-kingdom/galleries"
```

Expected: the legacy section list renders as before, with `ShowItemRow` rows.

- [ ] **Step 9: Lint and commit**

```bash
yarn lint --fix src/app/Scenes/CityGuide/Screens/CitySavedList.tsx src/app/Scenes/CityGuide/Screens/__tests__/CitySavedList.tests.tsx
git add src/app/Scenes/CityGuide/Screens/
git commit -m "feat(city-guide): make the city itinerary show saved fairs as well as shows

Widens the show window to a year, since RUNNING_AND_UPCOMING defaults to 15
days in Gravity and hid saved shows opening next month. Fairs come from the
city's own fair list filtered on profile.isFollowed, which is exact, and sit
above shows so paginating shows cannot reorder the list.

Stops delegating to CityGuideEventList rather than extending it, because
CitySectionList still renders that component.

Assisted-by: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 12: The itinerary row on the home

**Files:**

- Create: `src/app/Scenes/CityGuide/Components/CityGuideItinerarySummary.tsx`
- Modify: `src/app/Scenes/CityGuide/Components/CityGuideEventSummaryRow.tsx`
- Modify: `src/app/Scenes/CityGuide/Components/__tests__/CityGuideEventSummaryRow.tests.tsx`
- Modify: `src/app/Scenes/CityGuide/CityGuideNew.tsx`
- Test: `src/app/Scenes/CityGuide/Components/__tests__/CityGuideItinerarySummary.tests.tsx`

**Interfaces:**

- Consumes: `CityGuideEventSummaryRow` (Task 9), which this task extends with one prop.
- Produces: `CityGuideItinerarySummary: React.FC<{ citySlug: string; cityName: string }>`.

- [ ] **Step 1: Add `countSuffix` to the summary row, in all three places**

Adding a prop takes three edits, not one. Missing the destructuring leaves an undefined local
that TypeScript will catch but that is easy to write.

In `CityGuideEventSummaryRow.tsx`, add to `Props`:

```tsx
  /** Appended to the count, for example "+" when the page cap was hit and the true total is unknown. */
  countSuffix?: string
```

add it to the destructuring:

```tsx
export const CityGuideEventSummaryRow: React.FC<Props> = ({
  title,
  count,
  countLabel,
  countSuffix,
  subtitle,
  imageURL,
  onPress,
}) => {
```

and use it in the count line:

```tsx
<Text variant="sm-display">{`${count}${countSuffix ?? ""} ${pluralize(countLabel, count)}`}</Text>
```

- [ ] **Step 2: Test the new prop**

Task 9 already covers `countSuffix` and `emptyText` in
`CityGuideEventSummaryRow.tests.tsx`, so this task adds no test there. Confirm those tests still
pass after your change to the component:

Run: `yarn test src/app/Scenes/CityGuide/Components/__tests__/CityGuideEventSummaryRow.tests.tsx`
Expected: PASS, 8 tests.

- [ ] **Step 3: Write the failing tests for the itinerary row**

The count is fairs plus shows, matching the spec's scope decision.

```tsx
// src/app/Scenes/CityGuide/Components/__tests__/CityGuideItinerarySummary.tests.tsx
import { screen } from "@testing-library/react-native"
import { CityGuideItinerarySummary } from "app/Scenes/CityGuide/Components/CityGuideItinerarySummary"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"

describe("CityGuideItinerarySummary", () => {
  const { renderWithRelay } = setupTestWrapper({ Component: CityGuideItinerarySummary })
  const props = { citySlug: "london-united-kingdom", cityName: "London" }

  const resolvers = (showNames: string[], fairs: { name: string; isFollowed: boolean }[] = []) => ({
    FollowsAndSaves: () => ({
      shows: { edges: showNames.map((name) => ({ node: { name } })) },
    }),
    City: () => ({
      fairsConnection: {
        edges: fairs.map(({ name, isFollowed }) => ({ node: { name, profile: { isFollowed } } })),
      },
    }),
  })

  it("counts saved shows", () => {
    const showNames = ["Frida Kahlo", "Tracey Emin", "Cecily Brown"]

    renderWithRelay(resolvers(showNames), props)

    expect(screen.getByText("Your London Itinerary")).toBeTruthy()
    expect(screen.getByText(`${showNames.length} Stops`)).toBeTruthy()
  })

  it("counts followed fairs alongside shows", () => {
    const showNames = ["Frida Kahlo"]
    const fairs = [
      { name: "Frieze London", isFollowed: true },
      { name: "Photo London", isFollowed: false },
    ]
    const expected = showNames.length + fairs.filter((f) => f.isFollowed).length

    renderWithRelay(resolvers(showNames, fairs), props)

    expect(screen.getByText(`${expected} Stops`)).toBeTruthy()
  })

  it("renders nothing when the user has saved nothing", () => {
    renderWithRelay(resolvers([]), props)

    expect(screen.queryByText("Your London Itinerary")).toBeNull()
  })

  it("marks the count as a lower bound when the show page comes back full", () => {
    const showNames = Array.from({ length: 100 }, (_, i) => `Show ${i}`)

    renderWithRelay(resolvers(showNames), props)

    expect(screen.getByText("100+ Stops")).toBeTruthy()
  })
})
```

- [ ] **Step 4: Run the tests to verify they fail**

Run: `yarn test src/app/Scenes/CityGuide/Components/__tests__/CityGuideItinerarySummary.tests.tsx`
Expected: FAIL, cannot resolve `CityGuideItinerarySummary`.

- [ ] **Step 5: Write the implementation**

```tsx
// src/app/Scenes/CityGuide/Components/CityGuideItinerarySummary.tsx
import { CityGuideItinerarySummaryQuery } from "__generated__/CityGuideItinerarySummaryQuery.graphql"
import { CityGuideEventSummaryRow } from "app/Scenes/CityGuide/Components/CityGuideEventSummaryRow"
// eslint-disable-next-line no-restricted-imports
import { navigate } from "app/system/navigation/navigate"
import { extractNodes } from "app/utils/extractNodes"
import { NoFallback, withSuspense } from "app/utils/hooks/withSuspense"
import { graphql, useLazyLoadQuery } from "react-relay"

const SHOW_PAGE_SIZE = 100
const NAMES_IN_SUBTITLE = 3

interface Props {
  citySlug: string
  cityName: string
}

const CityGuideItinerary: React.FC<Props> = ({ citySlug, cityName }) => {
  const data = useLazyLoadQuery<CityGuideItinerarySummaryQuery>(Query, { citySlug })

  const shows = extractNodes(data.me?.followsAndSaves?.shows)
  const followedFairs = extractNodes(data.city?.fairsConnection).filter(
    (fair) => !!fair.profile?.isFollowed
  )

  const count = followedFairs.length + shows.length

  if (count === 0) {
    return null
  }

  const names = [...followedFairs.map((fair) => fair.name), ...shows.map((show) => show.name)]

  return (
    <CityGuideEventSummaryRow
      title={`Your ${cityName} Itinerary`}
      count={count}
      countLabel="Stop"
      // The show half is capped at one page, so beyond that the true total is unknown.
      countSuffix={shows.length >= SHOW_PAGE_SIZE ? "+" : undefined}
      subtitle={names.filter(Boolean).slice(0, NAMES_IN_SUBTITLE).join(", ") || null}
      imageURL={followedFairs[0]?.image?.url ?? shows[0]?.coverImage?.url ?? null}
      onPress={() => navigate(`/city-save/${citySlug}`)}
    />
  )
}

/**
 * Two halves, one round trip.
 *
 * Shows come from `followsAndSaves`, which filters by city server side but exposes no
 * `totalCount` (`schema.graphql:19965-19975`), so the count comes from counting edges.
 * `dayThreshold: 365` because Gravity defaults `RUNNING_AND_UPCOMING` to 15 days, which would
 * hide a show saved for a trip next month.
 *
 * Fairs come from the city's own fair list filtered on `profile.isFollowed`, which is exact.
 * `followsAndSaves.fairsConnection` takes no `city` argument, so it cannot be used here. There
 * is no way to widen the fair window: the fairs endpoint calls the scope with no argument
 * (`v1/fairs_endpoint.rb:166`).
 *
 * `withSuspense` renders nothing on error, so a failed request leaves the home unchanged
 * rather than showing a broken row.
 */
const Query = graphql`
  query CityGuideItinerarySummaryQuery($citySlug: String!) {
    me {
      followsAndSaves {
        shows: showsConnection(
          first: 100
          status: RUNNING_AND_UPCOMING
          dayThreshold: 365
          city: $citySlug
        ) {
          edges {
            node {
              name
              coverImage {
                url
              }
            }
          }
        }
      }
    }

    city(slug: $citySlug) {
      fairsConnection(first: 100, status: RUNNING_AND_UPCOMING, sort: START_AT_ASC) {
        edges {
          node {
            name
            image {
              url
            }
            profile {
              isFollowed
            }
          }
        }
      }
    }
  }
`

export const CityGuideItinerarySummary = withSuspense({
  Component: CityGuideItinerary,
  LoadingFallback: () => null,
  ErrorFallback: NoFallback,
})
```

`internalID` is deliberately not selected. Nothing here uses it, and the rows the user taps
through to fetch their own ids.

- [ ] **Step 6: Render it on the home**

In `src/app/Scenes/CityGuide/CityGuideNew.tsx`, add it inside the existing `Join`, after
`CityGuideEvents`:

```tsx
<CityGuideItinerarySummary citySlug={city?.slug ?? ""} cityName={city?.name ?? ""} />
```

- [ ] **Step 7: Add tap tracking**

The summary rows are the only way into the new screens, so a tap event is what tells us whether
anyone uses them. Add to `CityGuideEvents` and to this component a `trackEvent` call in each
`onPress`, carrying the section or itinerary and the city slug, using the scene's existing
`Schema.ActionNames` values. Assert one of them in the test:

```tsx
it("opens the itinerary screen when pressed", async () => {
  const showNames = ["Frida Kahlo"]

  renderWithRelay(resolvers(showNames), props)
  fireEvent.press(await screen.findByTestId("city-guide-event-summary-row"))

  // Task 10's review found its navigation was untested AND unverifiable by hand, because the
  // simulator could not scroll to the rows. Do not repeat that here. `navigate` is globally
  // mocked as a jest.fn() in `setupJest.tsx:631`, so import it and assert on it.
  expect(navigate).toHaveBeenCalledWith("/city-save/london-united-kingdom")
})

it("tracks the tap", () => {
  const showNames = ["Frida Kahlo"]

  renderWithRelay(resolvers(showNames), props)
  fireEvent.press(screen.getByTestId("city-guide-event-summary-row"))

  expect(mockTrackEvent).toHaveBeenCalled()
})
```

with `import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"`. It is a global
jest mock (`globallyMockedStuff.ts:8`) and must be imported; `ArtistSeriesMoreSeries.tests.tsx:9`
shows the import in use.

- [ ] **Step 8: Regenerate, test and type-check**

Run:

```bash
yarn relay
yarn test src/app/Scenes/CityGuide/Components/__tests__/CityGuideItinerarySummary.tests.tsx src/app/Scenes/CityGuide/Components/__tests__/CityGuideEventSummaryRow.tests.tsx
yarn tsc
```

Expected: 5 itinerary tests and 6 summary-row tests pass.

- [ ] **Step 9: Lint and commit**

```bash
yarn lint --fix src/app/Scenes/CityGuide/Components/ src/app/Scenes/CityGuide/CityGuideNew.tsx
git add src/app/Scenes/CityGuide/
git commit -m "feat(city-guide): show the city itinerary on the home

Counts followed fairs and saved shows together. The show half counts edges
because FollowedShowConnection exposes no totalCount, and marks the count as
a lower bound when the page comes back full.

Assisted-by: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 13: Resolve every stop's entity, and know when the set is complete

Today each `ItineraryStopSaveControl` runs its own `useLazyLoadQuery` inside its own row. That
works for rows and fails for "Add Full List" twice over: a collapsed section unmounts its rows,
so their entities are absent; and there is no shared place to read them from.

Two earlier drafts of this task were wrong, and both failures are instructive:

1. A `useItineraryStopEntities(stops)` hook called a hook inside `.map`. Not viable: the first
   lookup suspends, so later hook calls in that render never happen.
2. A provider that stored only the entities that had reported. Also not viable, and worse
   because it looked fine: resolvers settle independently, so the **first** one to report made
   "Add Full List" actionable while the rest were still in flight. Pressing it then followed a
   partial set while claiming to add the full list.

So the provider must track **completeness**, not just contents. It is seeded with every
saveable stop up front and knows which lookups are pending, resolved or failed. Rows render as
their own entity arrives, independently. Bulk-add is not actionable until every lookup has
settled successfully.

Query count is unchanged. Slugs cannot be batched: `showsConnection(ids:)` reaches Gravity's
`shows.in(_id:)`, which matches BSON ids only and returns them unordered.

**Files:**

- Create: `src/app/Scenes/CityGuide/Screens/Itinerary/hooks/ItineraryStopEntities.tsx`
- Create: `src/app/Scenes/CityGuide/Screens/Itinerary/Components/ItineraryStopEntityResolvers.tsx`
- Modify: `src/app/Scenes/CityGuide/Screens/Itinerary/Components/ItineraryStopSaveControl.tsx`
- Modify: `src/app/Scenes/CityGuide/Screens/Itinerary/ItineraryScreen.tsx`
- Test: `src/app/Scenes/CityGuide/Screens/Itinerary/hooks/__tests__/ItineraryStopEntities.tests.tsx`

**Interfaces:**

- Consumes: `ItineraryStop`, `ItinerarySaveTarget` from `Itinerary/utils/itineraryTypes`; the
  three queries currently inside `ItineraryStopSaveControl`.
- Produces:

  ```ts
  interface ItineraryStopEntity {
    stopId: string
    /** Relay node id, for optimistic store updates. */
    id: string
    internalID: string
    isFollowed: boolean
    type: ItinerarySaveTarget["type"]
  }

  type LookupStatus = "pending" | "resolved" | "failed"

  interface ItineraryStopEntitiesState {
    /** Only the resolved ones. */
    entities: ItineraryStopEntity[]
    expectedCount: number
    failedCount: number
    /** Every expected lookup has settled, one way or the other. */
    isSettled: boolean
    /** Every expected lookup resolved. The only state in which bulk-add is actionable. */
    isComplete: boolean
  }

  ItineraryStopEntitiesProvider: React.FC<{ stops: ItineraryStop[]; children: React.ReactNode }>
  useItineraryStopEntity(stopId: string): ItineraryStopEntity | undefined
  useItineraryStopEntitiesState(): ItineraryStopEntitiesState
  useReportItineraryStopEntity(): {
    report: (entity: ItineraryStopEntity) => void
    reportFailure: (stopId: string) => void
  }
  ItineraryStopEntityResolvers: React.FC<{ stops: ItineraryStop[] }>
  ```

  The provider takes `stops` so it can seed the expected set. `useAllItineraryStopEntities` from
  the previous draft is gone: returning contents without completeness is what caused the partial
  bulk-add.

- [ ] **Step 1: Write the failing tests**

Two mechanics matter here, and both were wrong in the previous draft:

- **Queue one fresh resolver function per expected operation.** Relay consumes a queued resolver
  after it produces a result, and removes it by reference:
  `resolversQueue.filter(res => res !== currentResolver)`
  (`relay-test-utils/RelayModernMockEnvironment.js.flow:236-240`). So queuing the _same_
  function N times removes all N at once, and queuing it once answers only the first operation.
- **Reject a specific operation**, via `env.mock.reject(operation, error)`. Calling
  `rejectMostRecentOperation` in a loop rejects the same operation repeatedly and leaves the
  others pending forever.

```tsx
// src/app/Scenes/CityGuide/Screens/Itinerary/hooks/__tests__/ItineraryStopEntities.tests.tsx
import { Text } from "@artsy/palette-mobile"
import { act, screen, waitFor } from "@testing-library/react-native"
import { ItineraryStopEntityResolvers } from "app/Scenes/CityGuide/Screens/Itinerary/Components/ItineraryStopEntityResolvers"
import {
  ItineraryStopEntitiesProvider,
  useItineraryStopEntitiesState,
} from "app/Scenes/CityGuide/Screens/Itinerary/hooks/ItineraryStopEntities"
import { getMockItinerary } from "app/Scenes/CityGuide/Screens/Itinerary/utils/mockItineraries"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { RelayEnvironmentProvider } from "react-relay"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"

const itinerary = getMockItinerary("london-united-kingdom", "chill-vibes-only")!
const stops = itinerary.sections.flatMap((section) => section.stops)
const saveableStops = stops.filter((stop) => !!stop.saveTarget)

const Readout: React.FC = () => {
  const { entities, expectedCount, failedCount, isSettled, isComplete } =
    useItineraryStopEntitiesState()

  return (
    <Text>
      {`resolved ${entities.length} of ${expectedCount}, failed ${failedCount}, settled ${isSettled}, complete ${isComplete}`}
    </Text>
  )
}

const renderHarness = (
  env: ReturnType<typeof createMockEnvironment>,
  given: typeof stops = stops
) =>
  renderWithWrappers(
    <RelayEnvironmentProvider environment={env}>
      <ItineraryStopEntitiesProvider stops={given}>
        <ItineraryStopEntityResolvers stops={given} />
        <Readout />
      </ItineraryStopEntitiesProvider>
    </RelayEnvironmentProvider>
  )

/** One fresh function per operation, because Relay removes a consumed resolver by reference. */
const queueResolvers = (env: ReturnType<typeof createMockEnvironment>, count: number) => {
  for (let i = 0; i < count; i++) {
    env.mock.queueOperationResolver((operation) => MockPayloadGenerator.generate(operation))
  }
}

/**
 * These drive a mock environment directly rather than using `setupTestWrapper`, whose
 * `renderWithRelay` resolves exactly one operation unconditionally at render
 * (`setupTestWrapper.tsx:112-129`). This tree fires one query per saveable stop, or none.
 */
describe("ItineraryStopEntities", () => {
  let env: ReturnType<typeof createMockEnvironment>

  beforeEach(() => {
    env = createMockEnvironment()
  })

  it("seeds the expected count from the saveable stops before anything resolves", () => {
    renderHarness(env)

    expect(
      screen.getByText(
        `resolved 0 of ${saveableStops.length}, failed 0, settled false, complete false`
      )
    ).toBeTruthy()
  })

  it("is not complete while some lookups are still pending", async () => {
    // Exactly one resolver, so exactly one operation is answered.
    queueResolvers(env, 1)

    renderHarness(env)

    await waitFor(() => expect(screen.getByText(/^resolved 1 of/)).toBeTruthy())
    // The bug this guards: one resolved entity used to be enough to enable bulk-add.
    expect(screen.getByText(/complete false/)).toBeTruthy()
    expect(screen.getByText(/settled false/)).toBeTruthy()
  })

  it("is complete only once every saveable stop has resolved", async () => {
    queueResolvers(env, saveableStops.length)

    renderHarness(env)

    // Counts derived from the mock, so growing the itinerary cannot produce a false alarm.
    await waitFor(() =>
      expect(
        screen.getByText(
          `resolved ${saveableStops.length} of ${saveableStops.length}, failed 0, settled true, complete true`
        )
      ).toBeTruthy()
    )
  })

  it("settles but never completes when a lookup fails", async () => {
    queueResolvers(env, saveableStops.length - 1)

    renderHarness(env)

    await waitFor(() => expect(env.mock.getAllOperations().length).toEqual(1))
    act(() => {
      env.mock.reject(env.mock.getAllOperations()[0], new Error("boom"))
    })

    await waitFor(() => expect(screen.getByText(/failed 1/)).toBeTruthy())
    // Settled, so the screen stops waiting; not complete, so bulk-add stays unavailable and
    // cannot present a partial list as the full one.
    expect(screen.getByText(/settled true/)).toBeTruthy()
    expect(screen.getByText(/complete false/)).toBeTruthy()
  })

  it("fires no query and is trivially complete when no stop is saveable", () => {
    const nonSaveable = stops.filter((stop) => !stop.saveTarget)

    renderHarness(env, nonSaveable)

    expect(env.mock.getAllOperations()).toHaveLength(0)
    expect(screen.getByText(/resolved 0 of 0/)).toBeTruthy()
  })
})
```

> `chill-vibes-only` currently contains at least one stop with `saveTarget: null` and several
> saveable ones, which is what makes the last two tests meaningful. Both derive their sets from
> the mock rather than assuming counts.

- [ ] **Step 2: Run the tests to verify they fail**

Run: `yarn test src/app/Scenes/CityGuide/Screens/Itinerary/hooks/__tests__/ItineraryStopEntities.tests.tsx`
Expected: FAIL, neither module resolves. Five tests once Steps 3 and 4 land.

- [ ] **Step 3: Write the provider**

```tsx
// src/app/Scenes/CityGuide/Screens/Itinerary/hooks/ItineraryStopEntities.tsx
import {
  ItinerarySaveTarget,
  ItineraryStop,
} from "app/Scenes/CityGuide/Screens/Itinerary/utils/itineraryTypes"
import { createContext, useCallback, useContext, useMemo, useState } from "react"

export interface ItineraryStopEntity {
  stopId: string
  /** Relay node id, used for optimistic store updates. */
  id: string
  internalID: string
  isFollowed: boolean
  type: ItinerarySaveTarget["type"]
}

type LookupStatus = "pending" | "resolved" | "failed"

interface Lookup {
  status: LookupStatus
  entity?: ItineraryStopEntity
}

export interface ItineraryStopEntitiesState {
  entities: ItineraryStopEntity[]
  expectedCount: number
  failedCount: number
  isSettled: boolean
  isComplete: boolean
}

interface ContextValue {
  lookups: Record<string, Lookup>
  report: (entity: ItineraryStopEntity) => void
  reportFailure: (stopId: string) => void
}

const Context = createContext<ContextValue>({
  lookups: {},
  report: () => undefined,
  reportFailure: () => undefined,
})

const saveableStopIds = (stops: ItineraryStop[]) =>
  stops.filter((stop) => !!stop.saveTarget).map((stop) => stop.id)

/**
 * Holds one lookup per saveable stop, keyed by `stopId`, seeded as `pending` from `stops`
 * before any query runs.
 *
 * Seeding up front is the whole point. A provider that only held what had reported let the
 * first resolver make bulk-add actionable while the rest were still in flight, so pressing it
 * followed a partial set while claiming to add the full list.
 */
export const ItineraryStopEntitiesProvider: React.FC<{
  stops: ItineraryStop[]
  children: React.ReactNode
}> = ({ stops, children }) => {
  const expectedIds = useMemo(() => saveableStopIds(stops), [stops])

  // Seeded once. `stops` comes from a static mock keyed by itinerary id, and the screen
  // remounts rather than swapping itineraries in place, so the expected set never changes for
  // a given mount. Do not add a reseeding effect: it would clobber entities that have already
  // reported. If itineraries ever become switchable in place, key the provider on the
  // itinerary id instead so React remounts it.
  const [lookups, setLookups] = useState<Record<string, Lookup>>(() =>
    Object.fromEntries(expectedIds.map((id) => [id, { status: "pending" as LookupStatus }]))
  )

  const report = useCallback((entity: ItineraryStopEntity) => {
    setLookups((current) => {
      const existing = current[entity.stopId]

      // Bail out when nothing changed, so a reporting effect cannot loop.
      if (
        existing?.status === "resolved" &&
        existing.entity?.id === entity.id &&
        existing.entity?.internalID === entity.internalID &&
        existing.entity?.isFollowed === entity.isFollowed &&
        existing.entity?.type === entity.type
      ) {
        return current
      }

      return { ...current, [entity.stopId]: { status: "resolved", entity } }
    })
  }, [])

  const reportFailure = useCallback((stopId: string) => {
    setLookups((current) =>
      current[stopId]?.status === "failed"
        ? current
        : { ...current, [stopId]: { status: "failed" } }
    )
  }, [])

  const value = useMemo(
    () => ({ lookups, report, reportFailure }),
    [lookups, report, reportFailure]
  )

  return <Context.Provider value={value}>{children}</Context.Provider>
}

/** One stop's entity, or undefined while its lookup is pending or has failed. */
export const useItineraryStopEntity = (stopId: string): ItineraryStopEntity | undefined =>
  useContext(Context).lookups[stopId]?.entity

/** Contents plus completeness. Bulk-add must read `isComplete`, never just `entities`. */
export const useItineraryStopEntitiesState = (): ItineraryStopEntitiesState => {
  const { lookups } = useContext(Context)

  return useMemo(() => {
    const all = Object.values(lookups)
    const entities = all
      .map((lookup) => lookup.entity)
      .filter((entity): entity is ItineraryStopEntity => !!entity)

    return {
      entities,
      expectedCount: all.length,
      failedCount: all.filter((lookup) => lookup.status === "failed").length,
      isSettled: all.every((lookup) => lookup.status !== "pending"),
      isComplete: all.length > 0 && all.every((lookup) => lookup.status === "resolved"),
    }
  }, [lookups])
}

/** Used only by the resolvers. */
export const useReportItineraryStopEntity = () => {
  const { report, reportFailure } = useContext(Context)

  return { report, reportFailure }
}
```

- [ ] **Step 4: Write the resolvers**

The three queries move here from `ItineraryStopSaveControl`, and they **must be renamed**. Relay
requires every operation name to be prefixed with its module name, so
`ItineraryStopSaveControlShowQuery` (`ItineraryStopSaveControl.tsx:117`) becomes
`ItineraryStopEntityResolversShowQuery`, and likewise for the fair and partner queries. Moving
them unrenamed makes `yarn relay` fail. Keep the selections exactly as they are; change only the
operation names and the generated-type imports.

```tsx
// src/app/Scenes/CityGuide/Screens/Itinerary/Components/ItineraryStopEntityResolvers.tsx
import { ItineraryStopEntityResolversShowQuery } from "__generated__/ItineraryStopEntityResolversShowQuery.graphql"
import {
  ItineraryStopEntity,
  useReportItineraryStopEntity,
} from "app/Scenes/CityGuide/Screens/Itinerary/hooks/ItineraryStopEntities"
import {
  ItinerarySaveTarget,
  ItineraryStop,
} from "app/Scenes/CityGuide/Screens/Itinerary/utils/itineraryTypes"
import { Suspense, useEffect } from "react"
import { ErrorBoundary } from "react-error-boundary"
import { graphql, useLazyLoadQuery } from "react-relay"

interface ResolverProps {
  stopId: string
  saveTarget: ItinerarySaveTarget
}

/**
 * Renders nothing. Its only job is to resolve one stop's entity and report it upward.
 *
 * `useLazyLoadQuery` subscribes to the store, so after a follow mutation this re-renders with
 * the new `isFollowed`, the effect fires again, and the reported entity updates. That is how
 * rows reflect a bulk add immediately.
 */
const ShowResolver: React.FC<ResolverProps> = ({ stopId, saveTarget }) => {
  const data = useLazyLoadQuery<ItineraryStopEntityResolversShowQuery>(ShowQuery, {
    slug: saveTarget.slug,
  })
  const { report, reportFailure } = useReportItineraryStopEntity()
  const show = data?.show

  useEffect(() => {
    // A resolved query with no entity is a settled failure, not a pending lookup. Without this
    // the provider would wait forever on a slug that no longer exists.
    if (!show) {
      reportFailure(stopId)
      return
    }

    report({
      stopId,
      id: show.id,
      internalID: show.internalID,
      isFollowed: !!show.isFollowed,
      type: "SHOW",
    })
    // `show` in full, not its members: the body dereferences it, so
    // react-hooks/exhaustive-deps demands the object. The provider's `report` bails out when
    // nothing changed, so a new object identity each render cannot loop.
  }, [stopId, show, report, reportFailure])

  return null
}
```

Write `FairResolver` and `PartnerResolver` the same way, each using the corresponding renamed
query and reporting `type: "FAIR"` or `type: "PARTNER"`. For fairs and partners the reported
`id` and `internalID` are the **profile's**, because following either is a profile follow.

Then the mapper. Note the error fallback reports the failure rather than silently rendering
nothing, which is what keeps `isSettled` reachable when a query throws:

```tsx
const RESOLVERS: Record<ItinerarySaveTarget["type"], React.FC<ResolverProps>> = {
  SHOW: ShowResolver,
  FAIR: FairResolver,
  PARTNER: PartnerResolver,
}

/** Reports a failed lookup from inside an error boundary's fallback. */
const ResolverFailed: React.FC<{ stopId: string }> = ({ stopId }) => {
  const { reportFailure } = useReportItineraryStopEntity()

  useEffect(() => {
    reportFailure(stopId)
  }, [stopId, reportFailure])

  return null
}

/**
 * One resolver per saveable stop, each independently suspended and independently fallible, so
 * one slow or missing entity cannot blank the screen or stop the others reporting.
 */
export const ItineraryStopEntityResolvers: React.FC<{ stops: ItineraryStop[] }> = ({ stops }) => (
  <>
    {stops.map((stop) => {
      if (!stop.saveTarget) {
        return null
      }

      const Resolver = RESOLVERS[stop.saveTarget.type]

      return (
        <ErrorBoundary key={stop.id} fallbackRender={() => <ResolverFailed stopId={stop.id} />}>
          <Suspense fallback={null}>
            <Resolver stopId={stop.id} saveTarget={stop.saveTarget} />
          </Suspense>
        </ErrorBoundary>
      )
    })}
  </>
)
```

Hook order is safe: each resolver is its own component, so `stops` changing adds or removes
components rather than reordering hook calls inside one.

- [ ] **Step 5: Make the save control read the provider**

`ItineraryStopSaveControl` stops querying. It becomes a thin component over the reported entity,
which also removes the duplicate query per row.

```tsx
interface Props {
  stopId: string
  stopTitle: string
  variant?: "icon" | "button"
}

export const ItineraryStopSaveControl: React.FC<Props> = ({ stopId, stopTitle, variant }) => {
  const entity = useItineraryStopEntity(stopId)

  // Nothing to render until this stop's resolver reports. Matches today's behaviour, where a
  // suspended per-row query rendered its own null fallback. Rows are independent of the
  // provider's overall completeness: one row appears as soon as its own lookup resolves.
  if (!entity) {
    return null
  }

  if (entity.type === "SHOW") {
    return (
      <CityEventShowSaveControl
        id={entity.id}
        internalID={entity.internalID}
        isFollowed={entity.isFollowed}
        name={stopTitle}
        variant={variant}
      />
    )
  }

  if (entity.type === "FAIR") {
    return (
      <CityEventFairSaveControl
        id={entity.id}
        internalID={entity.internalID}
        isFollowed={entity.isFollowed}
        name={stopTitle}
        variant={variant}
      />
    )
  }

  // PARTNER. Until Task 15 adds CityEventPartnerSaveControl this falls to the fair control, so
  // gallery follows go untracked for those few commits. Task 15 replaces this branch.
  return (
    <CityEventFairSaveControl
      id={entity.id}
      internalID={entity.internalID}
      isFollowed={entity.isFollowed}
      name={stopTitle}
      variant={variant}
    />
  )
}
```

An explicit three-way branch, not a binary one, so Task 15 has a named place to slot the partner
control into.

`variant` must be threaded, not dropped. `ItineraryStopPreview.tsx:103` passes `variant="button"`
today and renders a labelled full-width Save button beside "Show on map". Forgetting it here
turns that into a bare icon and nothing fails loudly.

Two behaviour changes travel with this, and they are changes rather than pure refactoring:

- The show path loses `owner_slug` from its tracking payload, which
  `ItineraryStopSaveControl.tsx:80` sends today. Either add `slug` to Task 4's control props or
  accept the loss deliberately. No test asserts it either way.
- Partner stops' accessibility labels move from "Follow / Unfollow"
  (`ItineraryStopSaveControl.tsx:107`) to "Save / Unsave". Consistent with the event screens, but
  it is a user-visible string change.

- [ ] **Step 6: Update every caller**

```bash
grep -rn "ItineraryStopSaveControl" src/ --include=*.tsx
```

Expected callers: `ItineraryStopRow.tsx`, `ItineraryStopPreview.tsx`, `ItineraryMapPreview.tsx`.
Each currently passes a `saveTarget`; each now passes `stopId` instead. Change the call sites and
the props they thread through. `ItineraryStopPreview` must keep passing `variant="button"`.

- [ ] **Step 7: Wrap the screen and mount the resolvers**

`ItineraryScreen` already resolves its itinerary and null-checks it. After that check, derive the
flat stop list once and use the same list for the provider, the resolvers and the rows, so the
expected set and the queried set cannot disagree:

```tsx
// after the existing itinerary null check
const stops = useMemo(() => itinerary.sections.flatMap((section) => section.stops), [itinerary])

return (
  <ItineraryStopEntitiesProvider stops={stops}>
    <ItineraryStopEntityResolvers stops={stops} />
    {/* existing screen content */}
  </ItineraryStopEntitiesProvider>
)
```

The resolvers sit outside anything collapsible, so collapsing a section changes nothing about
what has been resolved.

- [ ] **Step 8: Run the tests**

Run:

```bash
yarn relay
yarn test src/app/Scenes/CityGuide/Screens/Itinerary/hooks/__tests__/ItineraryStopEntities.tests.tsx src/app/Scenes/CityGuide/Screens/Itinerary/__tests__/ItineraryScreen.tests.tsx src/app/Scenes/CityGuide/Screens/Itinerary/Components/__tests__/ItineraryStopRow.tests.tsx
yarn tsc
```

Expected: five new tests pass and the existing screen tests still pass. The existing tests are
the regression net for this refactor. `ItineraryScreen.tests.tsx` carries a comment about
per-stop queries suspending; update it to describe the resolvers.

- [ ] **Step 9: Check it by hand**

```bash
xcrun simctl openurl booted "artsy:///city-guide/london-united-kingdom/itinerary/chill-vibes-only"
```

Expected: every stop shows a save icon as before. Collapse a section, expand it again, and the
icons are still correct. Save one stop and its icon updates immediately.

- [ ] **Step 10: Lint and commit**

```bash
yarn lint --fix src/app/Scenes/CityGuide/Screens/Itinerary/
git add src/app/Scenes/CityGuide/Screens/Itinerary/
git commit -m "refactor(city-guide): track itinerary stop entity resolution completeness

Rows used to each fetch their own entity, so a collapsed section's stops were
invisible to anything else. Resolvers now sit at screen level, one per stop
with its own Suspense and error boundary, reporting into a provider seeded
with every saveable stop.

Seeding matters: a provider holding only what had reported would let the first
resolver make bulk add actionable while the rest were in flight, following a
partial set while claiming to add the full list.

Assisted-by: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 14: Add Full List

Follows every stop that is not already followed. Since the itinerary is a view over global
follows, this changes the user's follows and the copy must not imply a private list.

**Three things earlier drafts got wrong.**

Committing the raw mutation documents loses behaviour. `useFollowShow` supplies an
`optimisticResponse` **and** an `optimisticUpdater` that calls `setShowFollowed`
(`useFollowShow.ts:37-48`), and `useFollowProfile` does the same (`useFollowProfile.ts:34-46`).
Without both, rows stay stale until a refetch.

An unbounded `Promise.all` fires one mutation per stop simultaneously. An itinerary can hold
dozens, so it needs a bound.

And the button must gate on **completeness**, not on having any entities at all. Task 13's
provider exposes `isComplete` for exactly this reason.

**Files:**

- Modify: `src/app/utils/mutations/useFollowShow.ts`
- Modify: `src/app/utils/mutations/useFollowProfile.ts`
- Create: `src/app/Scenes/CityGuide/Screens/Itinerary/Components/ItineraryAddFullListButton.tsx`
- Modify: `src/app/Scenes/CityGuide/Screens/Itinerary/ItineraryScreen.tsx`
- Test: `src/app/utils/mutations/__tests__/followMutationConfig.tests.ts`
- Test: `src/app/Scenes/CityGuide/Screens/Itinerary/Components/__tests__/ItineraryAddFullListButton.tests.tsx`

**Interfaces:**

- Consumes: `ItineraryStopEntity`, `useItineraryStopEntitiesState`,
  `ItineraryStopEntitiesProvider` (Task 13).
- Produces:

  ```ts
  // from useFollowShow.ts
  export const followShowMutationConfig: (opts: FollowShowOptions) => {
    mutation: GraphQLTaggedNode
    variables: object
    optimisticResponse: object
    optimisticUpdater: (store: RecordSourceSelectorProxy) => void
  }
  // from useFollowProfile.ts
  export const followProfileMutationConfig: (opts: FollowProfileOptions) => /* same shape */
  // the component, which reads the provider itself
  ItineraryAddFullListButton: React.FC
  ```

- [ ] **Step 1: Extract the mutation configuration, without changing the hooks' behaviour**

In `useFollowShow.ts`, pull the object currently passed to `commit` into an exported builder and
have the hook use it. Behaviour must be identical.

```ts
export const followShowMutationConfig = ({ id, internalID, isFollowed }: FollowShowOptions) => {
  const nextFollowedState = !isFollowed

  return {
    mutation: Mutation,
    variables: {
      input: {
        partnerShowID: internalID,
        unfollow: !!isFollowed,
      },
    },
    optimisticResponse: {
      followShow: {
        show: {
          id,
          internalID,
          isFollowed: nextFollowedState,
        },
      },
    },
    optimisticUpdater: (store: RecordSourceSelectorProxy<{}>) => {
      setShowFollowed(store, id, nextFollowedState)
    },
  }
}
```

and in the hook:

```ts
const followShow = () => {
  const config = followShowMutationConfig({ id, internalID, isFollowed })

  commit({
    variables: config.variables,
    optimisticResponse: config.optimisticResponse,
    optimisticUpdater: config.optimisticUpdater,
    onCompleted: (response, errors) => {
      onCompleted?.(!isFollowed, errors)
    },
    onError,
  })
}
```

Do the same in `useFollowProfile.ts` as `followProfileMutationConfig`.

**Widen the callbacks while you are here.** Task 15 migrates `ShowFollowButton` onto this hook,
and that component handles GraphQL errors from `onCompleted(_response, errors)` and network
errors from `onError(error)` (`ShowFollowButton.tsx:37-47`). The hook's current types discard
both, so the migration could not preserve its behaviour:

```ts
export interface FollowShowOptions {
  id: string
  internalID: string
  isFollowed: boolean | null | undefined
  /** `errors` carries GraphQL errors returned with a successful response. */
  onCompleted?: (isFollowed: boolean, errors?: PayloadError[] | null) => void
  onError?: (error: Error) => void
}
```

Both parameters are optional additions, so every existing caller keeps compiling. Apply the same
widening to `FollowProfileOptions`.

- [ ] **Step 2: Test the extraction and the widening**

```ts
// src/app/utils/mutations/__tests__/followMutationConfig.tests.ts
import { followProfileMutationConfig } from "app/utils/mutations/useFollowProfile"
import { followShowMutationConfig } from "app/utils/mutations/useFollowShow"

describe("followShowMutationConfig", () => {
  const opts = { id: "node-id", internalID: "internal-id", isFollowed: false }

  it("asks to follow when not followed", () => {
    expect(followShowMutationConfig(opts).variables).toEqual({
      input: { partnerShowID: "internal-id", unfollow: false },
    })
  })

  it("asks to unfollow when followed", () => {
    expect(followShowMutationConfig({ ...opts, isFollowed: true }).variables).toEqual({
      input: { partnerShowID: "internal-id", unfollow: true },
    })
  })

  it("includes the node id in the optimistic response, so Relay can merge it", () => {
    // The previous sub-project shipped an updater that omitted this and silently did nothing.
    expect(followShowMutationConfig(opts).optimisticResponse).toEqual({
      followShow: { show: { id: "node-id", internalID: "internal-id", isFollowed: true } },
    })
  })

  it("writes the unaliased isFollowed field through the updater", () => {
    const setValue = jest.fn()
    const store = { get: jest.fn().mockReturnValue({ setValue }) } as any

    followShowMutationConfig(opts).optimisticUpdater(store)

    expect(store.get).toHaveBeenCalledWith("node-id")
    expect(setValue).toHaveBeenCalledWith(true, "isFollowed")
  })
})

describe("followProfileMutationConfig", () => {
  const opts = { id: "profile-node-id", internalID: "profile-internal-id", isFollowed: false }

  it("asks to follow the profile when not followed", () => {
    expect(followProfileMutationConfig(opts).variables).toEqual({
      input: { profileID: "profile-internal-id", unfollow: false },
    })
  })

  it("asks to unfollow when followed", () => {
    expect(followProfileMutationConfig({ ...opts, isFollowed: true }).variables).toEqual({
      input: { profileID: "profile-internal-id", unfollow: true },
    })
  })

  it("includes the node id in the optimistic response", () => {
    expect(followProfileMutationConfig(opts).optimisticResponse).toEqual({
      followProfile: {
        profile: { id: "profile-node-id", internalID: "profile-internal-id", isFollowed: true },
      },
    })
  })

  it("writes the follow state through its updater", () => {
    const setValue = jest.fn()
    const store = { get: jest.fn().mockReturnValue({ setValue }) } as any

    followProfileMutationConfig(opts).optimisticUpdater(store)

    expect(store.get).toHaveBeenCalledWith("profile-node-id")
    expect(setValue).toHaveBeenCalled()
  })
})
```

> Check `useFollowProfile.ts:34-46` for the exact shape of its optimistic response and updater
> before asserting on them. The point of these four tests is that the extraction is faithful, so
> they must describe what the hook does today, not what looks tidy.

Run: `yarn test src/app/utils/mutations/__tests__/followMutationConfig.tests.ts`
Expected: FAIL before Step 1, PASS after, 8 tests.

- [ ] **Step 3: Write the failing tests for the button**

The button reads the provider, so the harness must seed both the expected set and the reported
entities. `env.mock.reject(operation, error)` rejects a **specific** operation; a loop calling
`rejectMostRecentOperation` rejects the same one repeatedly and leaves the rest pending, so
`mapWithLimit` never settles and the test hangs.

```tsx
// src/app/Scenes/CityGuide/Screens/Itinerary/Components/__tests__/ItineraryAddFullListButton.tests.tsx
import { act, fireEvent, screen, waitFor } from "@testing-library/react-native"
import { ItineraryAddFullListButton } from "app/Scenes/CityGuide/Screens/Itinerary/Components/ItineraryAddFullListButton"
import {
  ItineraryStopEntitiesProvider,
  ItineraryStopEntity,
  useReportItineraryStopEntity,
} from "app/Scenes/CityGuide/Screens/Itinerary/hooks/ItineraryStopEntities"
import { ItineraryStop } from "app/Scenes/CityGuide/Screens/Itinerary/utils/itineraryTypes"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { useEffect } from "react"
import { RelayEnvironmentProvider } from "react-relay"
import { createMockEnvironment } from "relay-test-utils"

const entity = (
  stopId: string,
  isFollowed: boolean,
  type: ItineraryStopEntity["type"] = "SHOW"
): ItineraryStopEntity => ({
  stopId,
  id: `node-${stopId}`,
  internalID: `internal-${stopId}`,
  isFollowed,
  type,
})

/** Minimal stops, so the provider seeds the expected set the same way the screen does. */
const stopsFor = (entities: ItineraryStopEntity[]): ItineraryStop[] =>
  entities.map(
    (e) =>
      ({
        id: e.stopId,
        saveTarget: { type: e.type, slug: `slug-${e.stopId}` },
      }) as ItineraryStop
  )

/** Reports entities directly, standing in for Task 13's resolvers. */
const Seed: React.FC<{ entities: ItineraryStopEntity[] }> = ({ entities }) => {
  const { report } = useReportItineraryStopEntity()

  useEffect(() => {
    entities.forEach(report)
  }, [entities, report])

  return null
}

/**
 * Rendered without `setupTestWrapper`: this tree fires no query at render, and that helper
 * unconditionally resolves one operation (`setupTestWrapper.tsx:112-129`), which throws when
 * nothing is pending.
 *
 * `seeded` defaults to `entities`, so the common case is a fully settled provider. Pass fewer
 * to model lookups still in flight.
 */
const renderButton = (
  env: ReturnType<typeof createMockEnvironment>,
  entities: ItineraryStopEntity[],
  seeded: ItineraryStopEntity[] = entities
) =>
  renderWithWrappers(
    <RelayEnvironmentProvider environment={env}>
      <ItineraryStopEntitiesProvider stops={stopsFor(entities)}>
        <Seed entities={seeded} />
        <ItineraryAddFullListButton />
      </ItineraryStopEntitiesProvider>
    </RelayEnvironmentProvider>
  )

describe("ItineraryAddFullListButton", () => {
  let env: ReturnType<typeof createMockEnvironment>

  beforeEach(() => {
    env = createMockEnvironment()
  })

  it("offers to add the list when every lookup resolved and something is unsaved", async () => {
    renderButton(env, [entity("a", false), entity("b", true)])

    expect(await screen.findByText("Add Full List")).toBeTruthy()
  })

  it("is not actionable while a lookup is still pending", async () => {
    const entities = [entity("a", false), entity("b", false)]

    // Two stops expected, one reported: the provider is incomplete.
    renderButton(env, entities, [entities[0]])

    const button = await screen.findByText("Add Full List")
    fireEvent.press(button)

    // The bug this guards: one resolved entity used to be enough to fire a partial bulk add.
    await waitFor(() => expect(env.mock.getAllOperations()).toHaveLength(0))
  })

  it("reports the list as added when everything is already saved", async () => {
    renderButton(env, [entity("a", true), entity("b", true)])

    expect(await screen.findByText("Added")).toBeTruthy()
  })

  it("renders nothing when there are no saveable stops", () => {
    renderButton(env, [])

    expect(screen.queryByText("Add Full List")).toBeNull()
    expect(screen.queryByText("Added")).toBeNull()
  })

  it("fires one mutation per unsaved entity and none for the saved one", async () => {
    const entities = [entity("a", false), entity("b", true), entity("c", false)]
    const unsavedCount = entities.filter((e) => !e.isFollowed).length

    renderButton(env, entities)
    fireEvent.press(await screen.findByText("Add Full List"))

    await waitFor(() => expect(env.mock.getAllOperations()).toHaveLength(unsavedCount))
  })

  it("follows a partner through the profile mutation, not the show one", async () => {
    renderButton(env, [entity("a", false, "PARTNER")])
    fireEvent.press(await screen.findByText("Add Full List"))

    await waitFor(() => expect(env.mock.getAllOperations()).toHaveLength(1))
    // Exercises the profile branch of `follow()`, which show-only fixtures never reach.
    expect(env.mock.getAllOperations()[0].request.node.operation.name).toMatch(/Profile/)
  })

  it("returns to the idle label when every mutation fails", async () => {
    renderButton(env, [entity("a", false), entity("b", false)])
    fireEvent.press(await screen.findByText("Add Full List"))

    await waitFor(() => expect(env.mock.getAllOperations().length).toBeGreaterThan(0))
    act(() => {
      // Each operation explicitly. Rejecting "most recent" in a loop hits the same one twice
      // and leaves the other promise pending, so `mapWithLimit` never settles.
      env.mock.getAllOperations().forEach((operation) => {
        env.mock.reject(operation, new Error("nope"))
      })
    })

    // Does not claim success. The seeded entities never change, so the label stays idle.
    expect(await screen.findByText("Add Full List")).toBeTruthy()
  })
})
```

> The concurrency bound is 4, so an itinerary with more than four unsaved stops resolves in
> batches and not all operations are pending at once. Every fixture here stays at three or fewer.
> If you raise one, assert a cumulative count with `waitFor` rather than an exact one.

**One flow these tests do not cover:** the optimistic write travelling mutation → Relay store →
resolver → provider → label becoming "Added". `Seed` reports fixed entities, so nothing here
re-reports after a successful mutation. Proving that end to end needs the real resolvers and
their queries, which is Task 13's harness. It is covered by the manual check in Step 9, and that
is stated rather than implied.

- [ ] **Step 4: Run the tests to verify they fail**

Run: `yarn test src/app/Scenes/CityGuide/Screens/Itinerary/Components/__tests__/ItineraryAddFullListButton.tests.tsx`
Expected: FAIL, cannot resolve `ItineraryAddFullListButton`. Seven tests once Step 5 lands.

- [ ] **Step 5: Write the button**

```tsx
// src/app/Scenes/CityGuide/Screens/Itinerary/Components/ItineraryAddFullListButton.tsx
import { Button, Flex, Text } from "@artsy/palette-mobile"
import { useToast } from "app/Components/Toast/toastHook"
import {
  ItineraryStopEntity,
  useItineraryStopEntitiesState,
} from "app/Scenes/CityGuide/Screens/Itinerary/hooks/ItineraryStopEntities"
import { followProfileMutationConfig } from "app/utils/mutations/useFollowProfile"
import { followShowMutationConfig } from "app/utils/mutations/useFollowShow"
import { useEffect, useRef, useState } from "react"
import { useRelayEnvironment } from "react-relay"
import { commitMutation } from "relay-runtime"

/** Bounded so a large itinerary does not fire dozens of simultaneous mutations. */
const MAX_CONCURRENT = 4

const follow = (environment: ReturnType<typeof useRelayEnvironment>, entity: ItineraryStopEntity) =>
  new Promise<boolean>((resolve) => {
    // The same configuration the hooks use, so the optimistic response and the store write are
    // identical and rows update as each mutation lands.
    const config =
      entity.type === "SHOW"
        ? followShowMutationConfig({
            id: entity.id,
            internalID: entity.internalID,
            isFollowed: false,
          })
        : followProfileMutationConfig({
            id: entity.id,
            internalID: entity.internalID,
            isFollowed: false,
          })

    commitMutation(environment, {
      mutation: config.mutation,
      variables: config.variables,
      optimisticResponse: config.optimisticResponse,
      optimisticUpdater: config.optimisticUpdater,
      // A GraphQL payload can carry errors alongside a 200, so treat any error as a failure.
      onCompleted: (_data, errors) => resolve(!errors?.length),
      onError: () => resolve(false),
    })
  })

/** Runs `task` over `items` with at most `limit` in flight. */
const mapWithLimit = async <T, R>(
  items: T[],
  limit: number,
  task: (item: T) => Promise<R>
): Promise<R[]> => {
  const results: R[] = []

  for (let i = 0; i < items.length; i += limit) {
    results.push(...(await Promise.all(items.slice(i, i + limit).map(task))))
  }

  return results
}

export const ItineraryAddFullListButton: React.FC = () => {
  const environment = useRelayEnvironment()
  const toast = useToast()
  const { entities, expectedCount, failedCount, isSettled, isComplete } =
    useItineraryStopEntitiesState()
  const [isAdding, setIsAdding] = useState(false)

  // Guards against setting state or toasting after the screen has gone away.
  const isMounted = useRef(true)
  useEffect(
    () => () => {
      isMounted.current = false
    },
    []
  )

  // No saveable stops at all, so there is nothing this button could do.
  if (expectedCount === 0) {
    return null
  }

  // Still resolving. Rendered disabled rather than hidden so the layout does not jump, and
  // never actionable: pressing while incomplete would follow a partial set while the label
  // promises the full list.
  if (!isSettled) {
    return (
      <Button variant="fillDark" block loading disabled longestText="Add Full List">
        Add Full List
      </Button>
    )
  }

  // Settled, but at least one entity could not be resolved, so "full list" is not deliverable.
  // No retry button: these lookups fail because a slug no longer resolves far more often than
  // from a transient error, so a retry would usually do nothing. Leaving and re-entering the
  // screen remounts the resolvers and tries again.
  if (!isComplete) {
    return (
      <Flex>
        <Button variant="outline" block disabled longestText="Add Full List">
          Add Full List
        </Button>
        <Text variant="xs" color="mono60" mt={0.5}>
          {`${failedCount} of ${expectedCount} stops could not be loaded, so the full list cannot be added.`}
        </Text>
      </Flex>
    )
  }

  const unsaved = entities.filter((entity) => !entity.isFollowed)

  if (unsaved.length === 0) {
    return (
      <Button variant="outline" block disabled longestText="Add Full List">
        Added
      </Button>
    )
  }

  const addAll = async () => {
    setIsAdding(true)

    const results = await mapWithLimit(unsaved, MAX_CONCURRENT, (entity) =>
      follow(environment, entity)
    )

    if (!isMounted.current) {
      return
    }

    const added = results.filter(Boolean).length

    setIsAdding(false)

    // On full success the label becomes "Added" on its own, because the store writes flow back
    // through the resolvers into the reported entities. Only the toast is reported here.
    toast.show(
      added === unsaved.length ? "Added to your saves" : `Added ${added} of ${unsaved.length}`,
      "bottom"
    )
  }

  return (
    <Button
      variant="fillDark"
      block
      loading={isAdding}
      onPress={addAll}
      longestText="Add Full List"
    >
      Add Full List
    </Button>
  )
}
```

Retry after a failed bulk add is deliberately not offered. A failure leaves the button idle with
the successful follows already applied, so pressing again retries exactly what is still unsaved,
and cannot double-follow.

- [ ] **Step 6: Add the bulk-add tracking**

Send one event when `addAll` finishes, carrying how many were attempted and how many landed,
using the scene's existing tracking pattern. Import the assertion helper as
`import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"` and assert it fires
alongside the operation-count assertion.

- [ ] **Step 7: Render it on the itinerary screen**

Inside Task 13's provider, under the header:

```tsx
<Flex px={2} pb={2}>
  <ItineraryAddFullListButton />
</Flex>
```

It takes no props: it reads the provider itself, so it cannot disagree with the rows about what
is saved or about whether the set is complete.

- [ ] **Step 8: Run the tests**

Run:

```bash
yarn relay
yarn test src/app/utils/mutations/__tests__/followMutationConfig.tests.ts src/app/Scenes/CityGuide/Screens/Itinerary/Components/__tests__/ItineraryAddFullListButton.tests.tsx src/app/Scenes/CityGuide/Screens/Itinerary/__tests__/ItineraryScreen.tests.tsx
yarn tsc
```

Expected: 8 config tests, 7 button tests, and the existing screen tests all pass.

- [ ] **Step 9: Check it by hand, including both failure paths**

```bash
xcrun simctl openurl booted "artsy:///city-guide/london-united-kingdom/itinerary/chill-vibes-only"
```

Expected, in order:

1. On open, the button is briefly disabled while stops resolve, then becomes actionable.
2. Pressing it saves every stop, and each row's icon flips as its mutation lands. **This is the
   only coverage of the optimistic round trip**, since the unit tests seed fixed entities.
3. The button becomes "Added". Pressing again does nothing.
4. With the network off on a fresh itinerary, the button returns to "Add Full List" and the
   toast names a partial result rather than claiming success.
5. Point a mock stop at a nonsense slug and confirm the button stays disabled with the
   could-not-be-loaded line, rather than silently adding the rest.

- [ ] **Step 10: Lint and commit**

```bash
yarn lint --fix src/app/Scenes/CityGuide/Screens/Itinerary/ src/app/utils/mutations/
git add src/app/Scenes/CityGuide/Screens/Itinerary/ src/app/utils/mutations/
git commit -m "feat(city-guide): add Add Full List to the itinerary screen

Gates on the provider's completeness rather than on having any entities, so it
cannot follow a partial set while promising the full list. Shares the follow
mutation configuration with the hooks rather than committing raw documents, so
the optimistic writes are identical and rows flip as each mutation lands.
Bounded concurrency, and a partial failure returns the button to idle instead
of claiming success.

Assisted-by: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 15: Consolidate the follow buttons and track gallery follows

The leftovers from the itinerary handover. The handover's framing is wrong in two places, so
work from this description rather than from it.

**This is consolidation, not a bug fix.** Both components hand-roll `commitMutation`, but
neither is the broken case the handover describes:

- `ShowFollowButton` supplies a valid `id`, the correct field name and an updater
  (`ShowFollowButton.tsx:65-78`). It works.
- `ShowItemRow` has a malformed aliased optimistic response but still has an explicit record
  updater (`ShowItemRow.tsx:73-86`), so it also works, by a different route.
- The fully broken implementation was `CityGuideEvent`, which the previous sub-project already
  migrated.

So the value here is one follow path instead of three, not a fixed bug. That means the
migration must preserve each component's existing tracking, in-flight guard, callbacks and
error handling exactly. A consolidation that loses behaviour is a regression.

**And `GalleryFollow` is not unused in Eigen.** It is used by Onboarding
(`useOnboardingTracking.ts:92`). It is missing from the City Guide's partner save path
specifically.

**Depends on Task 14**, which widens `FollowShowOptions` so the hook can forward the GraphQL
and network errors this component handles today. Do not start this task before that one.

**Files:**

- Modify: `src/app/Components/ShowFollowButton.tsx` (note: **not** under `Buttons/`)
- Modify: `src/app/Components/Lists/ShowItemRow.tsx`
- Modify: `src/app/Scenes/CityGuide/Components/CityEventSaveControls.tsx`
- Create: `src/app/Components/__tests__/ShowFollowButton.tests.tsx`
- Create: `src/app/Components/Lists/__tests__/ShowItemRow.tests.tsx`

Neither test file exists today. They must be written, not merely run.

- [ ] **Step 1: Confirm the paths and read what the components actually do**

```bash
ls src/app/Components/ShowFollowButton.tsx src/app/Components/Lists/ShowItemRow.tsx
ls src/app/Components/__tests__/ShowFollowButton.tests.tsx 2>&1 | tail -1
sed -n 30,95p src/app/Components/ShowFollowButton.tsx
sed -n 40,95p src/app/Components/Lists/ShowItemRow.tsx
```

Write down, for each: what it tracks, whether it guards against a second press while in
flight, what it does on error, and any callback it invokes. Those are the things the migration
must keep.

- [ ] **Step 2: Write characterisation tests, before touching either component**

These describe today's behaviour, so they must pass **before** the migration and still pass
after. That is what makes them a safety net rather than decoration.

Two things make this harder than it looks, and both must be handled or the tests cannot run
at all:

- **`ShowFollowButton` takes a fragment key**, `show: ShowFollowButton_show$key`
  (`ShowFollowButton.tsx:16-17`). `setupTestWrapper` needs a `query:` that spreads the
  fragment, or `useFragment` receives undefined and throws.
- **It returns `null` unless `AREnableFollowShowsAndFairs` is on**
  (`ShowFollowButton.tsx:20,25-27`). The flag is `readyForRelease: true` with an echo key
  (`features.ts:180-185`), which does not guarantee an enabled value under Jest, so inject it.

```tsx
// src/app/Components/__tests__/ShowFollowButton.tests.tsx
import { fireEvent, screen } from "@testing-library/react-native"
import { ShowFollowButton } from "app/Components/ShowFollowButton"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

describe("ShowFollowButton", () => {
  const { renderWithRelay } = setupTestWrapper({
    Component: ({ show }: any) => <ShowFollowButton show={show} />,
    query: graphql`
      query ShowFollowButtonTestQuery @relay_test_operation {
        show(id: "some-show") {
          ...ShowFollowButton_show
        }
      }
    `,
  })

  beforeEach(() => {
    __globalStoreTestUtils__?.injectFeatureFlags({ AREnableFollowShowsAndFairs: true })
  })

  it("renders nothing when the feature flag is off", () => {
    __globalStoreTestUtils__?.injectFeatureFlags({ AREnableFollowShowsAndFairs: false })

    renderWithRelay({ Show: () => ({ isFollowed: false }) })

    expect(screen.toJSON()).toBeNull()
  })

  it("offers to follow a show that is not followed", () => {
    renderWithRelay({ Show: () => ({ isFollowed: false }) })

    expect(screen.getByText("Save")).toBeTruthy()
  })

  it("reflects a followed show", () => {
    renderWithRelay({ Show: () => ({ isFollowed: true }) })

    expect(screen.getByText("Saved")).toBeTruthy()
  })

  it("commits a mutation when pressed", () => {
    const { env } = renderWithRelay({ Show: () => ({ isFollowed: false }) })

    fireEvent.press(screen.getByText("Save"))

    // Asserts that pressing follows, without asserting how the label behaves mid-flight.
    expect(env.mock.getAllOperations().length).toBeGreaterThan(0)
  })
})
```

> **The label assertions are provisional.** Read the component in Step 1 and correct them to
> whatever it actually renders. The previous draft of this plan asserted "Save" / "Saved"
> without checking, and asserted an optimistic flip that may not be observable: the mutation is
> left unresolved, so the button sits in its loading state and what the label reads then depends
> on palette's `Button` loading rendering. That is why the fourth test asserts the mutation
> fired rather than the label changed. **Run these before writing them off as correct**, and fix
> the test rather than the component if they disagree.

Write the equivalent file for `ShowItemRow`, with the same two problems handled: a `query:`
spreading `...ShowItemRow_show`, and no flag if it is not flag-gated (check). Cover its
followed and unfollowed states and that pressing commits a mutation.

- [ ] **Step 2b: Run them against the unmigrated components**

Run:

```bash
yarn test src/app/Components/__tests__/ShowFollowButton.tests.tsx src/app/Components/Lists/__tests__/ShowItemRow.tests.tsx
```

Expected: PASS. If either fails, the **test** is wrong about current behaviour. Fix the test,
not the component. Nothing has been migrated yet, so a failure here can only mean the
assertions do not match reality.

- [ ] **Step 3: Commit the tests on their own**

A separate commit, so the safety net is in history before the change it protects.

```bash
git add src/app/Components/__tests__/ShowFollowButton.tests.tsx src/app/Components/Lists/__tests__/ShowItemRow.tests.tsx
git commit -m "test: characterise ShowFollowButton and ShowItemRow follow behaviour

Neither had a test. These describe current behaviour so the useFollowShow
migration can be verified rather than hoped at.

Assisted-by: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

- [ ] **Step 4: Migrate `ShowFollowButton`**

Replace its local mutation with the hook, keeping everything around it:

```tsx
const { followShow, isInFlight } = useFollowShow({
  id: show.id,
  internalID: show.internalID,
  isFollowed: show.isFollowed,
  onCompleted: (_isFollowed, errors) => {
    if (errors?.length) {
      console.error("ShowFollowButton: followShow mutation returned errors", errors)
    }
  },
  onError: (error) => {
    console.error("ShowFollowButton: followShow mutation failed", error)
  },
})
```

This is why Task 14 widened `FollowShowOptions`. The error parameter is
`PayloadError[] | null`, imported from `relay-runtime` — **not** `Error[]`. An earlier draft of
this plan said `Error[]` and it does not compile; Task 14 corrected it when it landed the
widening, so read the hook's actual signature rather than this document if they ever disagree. The component handles GraphQL errors from
`onCompleted(_response, errors)` and network errors from `onError(error)`
(`ShowFollowButton.tsx:37-47`), and the hook's original callbacks discarded both, so the
migration could not have preserved its behaviour. **Task 14 must land before this step.**

Delete the local mutation document and updater. Drop the component's own `isFollowedSaving`
state in favour of `isInFlight`, which the hook already clears on both paths. Keep the existing
`trackEvent` call unchanged.

Add a test for the error path, since it is the thing most easily lost:

```tsx
it("logs GraphQL errors without crashing", async () => {
  const errorSpy = jest.spyOn(console, "error").mockImplementation(() => undefined)
  const { env } = renderWithRelay({ Show: () => ({ isFollowed: false }) })

  fireEvent.press(screen.getByText("Save"))
  act(() => {
    env.mock.resolveMostRecentOperation((operation) => ({
      data: null,
      errors: [{ message: "nope" }],
    }))
  })

  await waitFor(() => expect(errorSpy).toHaveBeenCalled())
  errorSpy.mockRestore()
})
```

- [ ] **Step 5: Run the characterisation tests**

Run: `yarn test src/app/Components/__tests__/ShowFollowButton.tests.tsx`
Expected: PASS, unchanged from Step 2b. A failure means behaviour was lost.

- [ ] **Step 6: Migrate `ShowItemRow` the same way, and run its tests**

Its optimistic response aliases `is_followed`. `setShowFollowed` writes the unaliased field,
and per its own documentation a plain scalar alias normalises under the field name, so one
write serves both surfaces. The alias can go.

Run: `yarn test src/app/Components/Lists/__tests__/ShowItemRow.tests.tsx`
Expected: PASS, unchanged from Step 2b.

- [ ] **Step 7: Send the gallery follow events**

Task 13 routes partner stops through `CityEventSaveControls`, so the tracking belongs there,
not in `ItineraryStopSaveControl`. Add a partner-specific control rather than overloading the
fair one, since only one of them should send gallery events:

```tsx
/**
 * Following a gallery is also a profile follow, but it tracks under different names.
 * `GalleryFollow` / `GalleryUnfollow` exist at `utils/track/schema.ts:280-281` and are used
 * elsewhere in the app, by Onboarding, but no City Guide surface sent them before this.
 */
export const CityEventPartnerSaveControl: React.FC<Props> = ({
  id,
  internalID,
  isFollowed,
  name,
  variant,
}) => {
  const showToast = useSaveToast()
  const { trackEvent } = useTracking()
  const isSaved = !!isFollowed

  const { followProfile, isInFlight } = useFollowProfile({
    id,
    internalID,
    isFollowed,
    onCompleted: showToast,
  })

  return (
    <CityGuideSaveButton
      variant={variant}
      isSaved={isSaved}
      isSaving={isInFlight}
      accessibilityLabel={accessibilityLabel(isSaved, name)}
      onPress={() => {
        trackEvent({
          action_name: isSaved
            ? Schema.ActionNames.GalleryUnfollow
            : Schema.ActionNames.GalleryFollow,
          action_type: Schema.ActionTypes.Success,
          owner_type: Schema.OwnerEntityTypes.Gallery,
          owner_id: internalID,
        })
        followProfile()
      }}
    />
  )
}
```

Give it the same `variant` prop as its siblings and pass it through, or the stop preview's
labelled button breaks for partner stops.

Then replace Task 13's `PARTNER` branch, which temporarily falls through to
`CityEventFairSaveControl`, with this control. Task 13 wrote that branch as an explicit third
case precisely so there is a named place to change. Restore the "Follow / Unfollow"
accessibility labels there if you decided to keep them.

- [ ] **Step 8: Test the gallery tracking**

Append to `CityEventSaveControls.tests.tsx`:

```tsx
describe("CityEventPartnerSaveControl", () => {
  it("tracks a gallery follow", () => {
    renderWithWrappers(
      <CityEventPartnerSaveControl
        id="profile-node-id"
        internalID="profile-internal-id"
        isFollowed={false}
        name="White Cube"
      />
    )
    fireEvent.press(screen.getByLabelText("Save White Cube"))

    expect(mockTrackEvent).toHaveBeenCalledWith(
      expect.objectContaining({ action_name: "galleryFollow" })
    )
  })

  it("tracks a gallery unfollow", () => {
    renderWithWrappers(
      <CityEventPartnerSaveControl
        id="profile-node-id"
        internalID="profile-internal-id"
        isFollowed
        name="White Cube"
      />
    )
    fireEvent.press(screen.getByLabelText("Unsave White Cube"))

    expect(mockTrackEvent).toHaveBeenCalledWith(
      expect.objectContaining({ action_name: "galleryUnfollow" })
    )
  })
})
```

with `import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"` at the top, and
`fireEvent` from `@testing-library/react-native`.

- [ ] **Step 9: Verify the whole set**

Run:

```bash
yarn tsc
yarn test src/app/Components/__tests__/ShowFollowButton.tests.tsx src/app/Components/Lists/__tests__/ShowItemRow.tests.tsx src/app/Scenes/CityGuide/Components/__tests__/CityEventSaveControls.tests.tsx src/app/Scenes/CityGuide/Screens/Itinerary/__tests__/ItineraryScreen.tests.tsx
```

Expected: all pass.

- [ ] **Step 10: Lint and commit**

```bash
yarn lint --fix src/app/Components/ShowFollowButton.tsx src/app/Components/Lists/ShowItemRow.tsx src/app/Scenes/CityGuide/Components/CityEventSaveControls.tsx
git add src/app/Components/ src/app/Scenes/CityGuide/
git commit -m "refactor: move show follow buttons onto useFollowShow, track gallery follows

Consolidation rather than a bug fix: both components worked, by different
routes. Characterisation tests landed first so the migration is verifiable.
GalleryFollow and GalleryUnfollow already existed and were used by Onboarding
but by no City Guide surface.

Assisted-by: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

## Final verification

- [ ] **Run every test file this plan created or touched**

```bash
yarn test \
  src/app/Scenes/CityGuide/utils/__tests__/cityEventSections.tests.ts \
  src/app/Scenes/CityGuide/utils/__tests__/mockCityNeighborhoods.tests.ts \
  src/app/Scenes/CityGuide/Components/__tests__/CityGuideSaveButton.tests.tsx \
  src/app/Scenes/CityGuide/Components/__tests__/CityEventSaveControls.tests.tsx \
  src/app/Scenes/CityGuide/Components/__tests__/CityEventRow.tests.tsx \
  src/app/Scenes/CityGuide/Components/__tests__/CityEventSectionHeader.tests.tsx \
  src/app/Scenes/CityGuide/Components/__tests__/CityGuideEventSummaryRow.tests.tsx \
  src/app/Scenes/CityGuide/Components/__tests__/CityGuideEvents.tests.tsx \
  src/app/Scenes/CityGuide/Components/__tests__/CityGuideItinerarySummary.tests.tsx \
  src/app/Scenes/CityGuide/Screens/CityEventList/utils/__tests__/cityEventListItems.tests.ts \
  src/app/Scenes/CityGuide/Screens/CityEventList/__tests__/CityEventListScreen.tests.tsx \
  src/app/Scenes/CityGuide/Screens/__tests__/CitySavedList.tests.tsx \
  src/app/Scenes/CityGuide/Screens/Itinerary/hooks/__tests__/ItineraryStopEntities.tests.tsx \
  src/app/Scenes/CityGuide/Screens/Itinerary/Components/__tests__/ItineraryAddFullListButton.tests.tsx \
  src/app/Scenes/CityGuide/Screens/Itinerary/__tests__/ItineraryScreen.tests.tsx \
  src/app/Scenes/CityGuide/Screens/Itinerary/Components/__tests__/ItineraryStopRow.tests.tsx \
  src/app/utils/mutations/__tests__/followMutationConfig.tests.ts \
  src/app/Components/__tests__/ShowFollowButton.tests.tsx \
  src/app/Components/Lists/__tests__/ShowItemRow.tests.tsx
```

Never widen this to the full suite. CI's `test-js` job covers the rest of the app.

- [ ] **Type-check the whole project**

Run: `yarn type-check`
Expected: Relay compiles, then no TypeScript errors.

- [ ] **Walk both platforms by hand**

Android was never tested in the previous sub-project and is still outstanding there, so it
gets the same walk as iOS.

```bash
xcrun simctl openurl booted "artsy:///city-guide"
adb shell am start -a android.intent.action.VIEW -d "artsy:///city-guide"
```

The walk, in order:

1. Home shows three event rows with real counts and names. No `picsum.photos` image, no
   "Date Placeholder".
2. Each title and each row opens the matching screen.
3. Sections collapse and expand. The footer count does not change when a section collapses.
4. A deep link to `/events/banana` renders Current Shows.
5. Saving a row turns the `+` into a checkmark and toasts.
6. The itinerary row appears on the home once something is saved, and counts fairs as well as
   shows.
7. The itinerary screen lists fairs above shows.
8. "Add Full List" on a curated itinerary saves every stop, rows flip as it goes, and the
   button becomes "Added".
9. With the network off, "Add Full List" returns to idle and toasts a partial result.
10. The legacy screen at `/city/london-united-kingdom/galleries` still renders as before.

- [ ] **Push and open the PR**

```bash
git push -u origin city-guide-saves
```

If `lint-staged` amended anything, verify the remote and local tips are content-identical twins
before force-pushing:

```bash
git diff origin/city-guide-saves city-guide-saves --stat   # must be empty
git push --force-with-lease
```

Open the PR against `city-guide-itineraries-docs`, not `main`, using
`docs/pull_request_template.md`. Include an `Assisted-by:` trailer in the body and iOS plus
Android screenshots.

## Self-review notes

**Spec coverage.** Home summary rows: Tasks 9 and 10. Destination screen and route validation:
Task 8. Grouping seam: Tasks 1 and 2. Mock label table: Task 2. Postcode measurement gate:
Task 0. Component reuse: Tasks 3, 4, 5 and 6. Fragment additions: Task 7. Admission line
omitted, so no task, which is correct. City itinerary contents, ordering and status windows:
Task 11. Home entry point and combined count: Task 12. Entity resolution: Task 13. Add Full
List: Task 14. Follow consolidation and gallery tracking: Task 15. Analytics: spread across
Tasks 11, 12, 14 and 15. Drafted API: appendix only, no task, which is correct.

**Revisions from review round two.** The radius was wrong: 25km, not 75km, because Metaphysics
overrides Gravity's default. Task 0's threshold was presented as derived and was not, so the
gate now measures classification against the table across all three datasets and asks for a
decision. Task 11 was written against a component shape that does not exist. Task 13's hook-in-
a-map was replaced with a provider and per-stop resolvers. Task 14 now shares the hooks'
mutation configuration instead of committing raw documents, and bounds concurrency. Task 15's
paths were wrong, its two test files do not exist and are now written first as characterisation
tests, and its rationale overstated how broken the components were. `estimatedItemSize` does
not exist on FlashList 2.2.2. The footer count came from visible rows and would have read
"Showing 0 of 143" after a collapse.

**Revisions from review round three.** The rewritten test harnesses were the problem.
`setupTestWrapper`'s `renderWithRelay` unconditionally resolves one operation at render
(`setupTestWrapper.tsx:112-129`), so it throws on a tree that fires no query and under-resolves
a tree that fires several, and `mockResolveLastOperation` returns void
(`setupTestWrapper.tsx:131-137`). Tasks 13 and 14 now drive `createMockEnvironment` with
`queueOperationResolver` directly, following `useCompleteMyProfileSteps.tests.tsx`. Task 11's
`dayThreshold` assertion reads the generated artifact, correctly named `CitySavedListQuery`
rather than after the exported const. Task 15's tests now supply the `query:` the fragment
needs and inject `AREnableFollowShowsAndFairs`, without which the component renders `null`,
and their label assertions are explicitly marked provisional rather than "Expected: PASS".

Also from round three: the three resolver queries must be **renamed** when they move, because
Relay requires the module-name prefix and moving them verbatim breaks `yarn relay`. `variant`
is threaded through every save control, because `ItineraryStopPreview.tsx:103` passes
`variant="button"` and would silently have become a bare icon. Task 8 gained the screen-view
tracking its own analytics table demanded, and the fair control gained its save event. The
route is named `CityEventList` to avoid colliding with the legacy component. Task 13 now owns
its two behaviour changes rather than implying pure refactoring: the show path loses
`owner_slug`, and partner labels move from "Follow" to "Save".

**Logged-out handling was cut, not fixed.** Every user of this feature is signed in, so there
are no login checks anywhere.

**Revisions from review round four.** One real design flaw and four broken test mechanics.

The flaw: the provider stored only entities that had reported, and the bulk-add button rendered
as soon as that list was non-empty. Resolvers settle independently, so the first one to report
made "Add Full List" actionable while the rest were still in flight, and pressing it followed a
partial set while the label promised the full list. The provider is now seeded with every
saveable stop up front and tracks pending, resolved and failed per stop; the button gates on
`isComplete`, shows a disabled loading state while resolving, and explains itself when a lookup
has failed.

The mechanics: `queueOperationResolver` answers exactly one operation and Relay removes the
consumed resolver **by reference**
(`relay-test-utils/RelayModernMockEnvironment.js.flow:236-240`), so queuing one function for
several operations hangs and queuing the same function repeatedly removes them all at once.
Tests now queue one fresh function per expected operation. Rejecting failures uses
`env.mock.reject(operation, error)` on specific operations, because `rejectMostRecentOperation`
in a loop hits the same operation twice and leaves the others pending, so `mapWithLimit` never
settles. `toContainElement` does not exist here, since jest-native is not installed; `within`
replaces it. And `mockTrackEvent` is a global mock that must be imported from
`app/utils/tests/globallyMockedStuff`.

Also from round four: `Schema.ActionNames.FollowFair` and `UnfollowFair` already exist
(`track/schema.ts:276-277`), so the fair control uses them instead of borrowing `SaveShow`.
`FollowShowOptions` and `FollowProfileOptions` gain error parameters, because `ShowFollowButton`
handles GraphQL errors from `onCompleted(_response, errors)` and network errors from
`onError(error)` and the original callback types discarded both, which made Task 15 impossible
as written; Task 15 now declares its dependency on Task 14. `ItineraryScreen`'s `stops` is
derived explicitly rather than referenced out of nowhere. The partner branch is an explicit
third case rather than a binary fallthrough. And the one flow the unit tests cannot cover, the
optimistic mutation round trip back to "Added", is named as manual-only rather than implied.

**Remaining soft spots, stated rather than hidden.** Task 14's test file depends on what
`setupTestWrapper` exposes for inspecting mutation operations, and the plan says to check an
existing mutation test for the idiom rather than guessing. Task 11's `dayThreshold` assertion
likewise offers two forms depending on whether persisted query text is reachable in tests. Both
are local-idiom questions, not design questions, and either form satisfies the requirement.
