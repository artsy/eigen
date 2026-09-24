import {
  groupByNeighborhood,
  groupByOpeningWeek,
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

const NEIGHBORHOODS = [
  { slug: "farringdon", name: "Farringdon" },
  { slug: "north-london", name: "North London" },
]

const show = (id: string, slug: string | null) => ({
  id,
  location: { cityGuideNeighborhood: slug === null ? null : { slug } },
})

describe("groupByNeighborhood", () => {
  it("groups a show into the section matching its neighbourhood slug", () => {
    const sections = groupByNeighborhood([show("a", "farringdon")], NEIGHBORHOODS, "London")

    expect(sections).toHaveLength(1)
    expect(sections[0].id).toEqual("farringdon")
    expect(sections[0].title).toEqual("Farringdon")
    expect(sections[0].items.map((i) => i.id)).toEqual(["a"])
  })

  it("orders sections by the neighborhoods list, not by input order", () => {
    const sections = groupByNeighborhood(
      [show("a", "north-london"), show("b", "farringdon")],
      NEIGHBORHOODS,
      "London"
    )

    expect(sections.map((s) => s.id)).toEqual(["farringdon", "north-london"])
  })

  it("keeps items within a section in input order, not resorted", () => {
    const sections = groupByNeighborhood(
      [show("second", "farringdon"), show("first", "farringdon")],
      NEIGHBORHOODS,
      "London"
    )

    expect(sections[0].items.map((i) => i.id)).toEqual(["second", "first"])
  })

  it("sends a null neighbourhood to the fallback", () => {
    const sections = groupByNeighborhood([show("a", null)], NEIGHBORHOODS, "London")

    expect(sections).toHaveLength(1)
    expect(sections[0].id).toEqual("more")
    expect(sections[0].title).toEqual("More in London")
  })

  it("sends a slug the city doesn't list to the fallback rather than dropping it", () => {
    const sections = groupByNeighborhood(
      [show("a", "somewhere-else"), show("b", "farringdon")],
      NEIGHBORHOODS,
      "London"
    )

    expect(sections.map((section) => section.id)).toEqual(["farringdon", "more"])
    expect(sections.flatMap((section) => section.items.map((item) => item.id))).toEqual(["b", "a"])
  })

  it("sends a null location to the fallback", () => {
    const [section] = groupByNeighborhood([{ id: "a", location: null }], NEIGHBORHOODS, "London")

    expect(section.id).toEqual("more")
  })

  it("puts every show in one fallback section for a city with no neighbourhoods", () => {
    const shows = [show("a", null), show("b", null)]

    const sections = groupByNeighborhood(shows, [], "Paris")

    expect(sections).toHaveLength(1)
    expect(sections[0].title).toEqual("More in Paris")
    expect(sections[0].items).toHaveLength(shows.length)
  })

  it("sorts the fallback last, after the neighbourhoods in the list's order", () => {
    const sections = groupByNeighborhood(
      [show("unmatched", null), show("farringdon", "farringdon")],
      NEIGHBORHOODS,
      "London"
    )

    expect(sections[sections.length - 1].id).toEqual("more")
  })

  it("omits sections with no shows", () => {
    const sections = groupByNeighborhood([show("a", "farringdon")], NEIGHBORHOODS, "London")

    expect(sections.every((s) => s.items.length > 0)).toBe(true)
    expect(sections.map((s) => s.id)).not.toContain("north-london")
  })
})
