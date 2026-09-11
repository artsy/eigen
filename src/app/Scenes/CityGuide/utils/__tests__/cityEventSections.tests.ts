import {
  groupByNeighborhood,
  groupByOpeningWeek,
  normalizePostalCode,
} from "app/Scenes/CityGuide/utils/cityEventSections"
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
