import { ItineraryStopMapDetail } from "app/Scenes/CityGuide/Screens/Itinerary/Components/ItineraryStopMapDetail"
import { ItineraryStopSaveControl } from "app/Scenes/CityGuide/Screens/Itinerary/Components/ItineraryStopSaveControl"
import { itineraryStopsToMapSections } from "app/Scenes/CityGuide/Screens/Itinerary/utils/itineraryStopsToMapSections"
import {
  Itinerary,
  ItineraryStop,
} from "app/Scenes/CityGuide/Screens/Itinerary/utils/itineraryTypes"
import { isValidElement } from "react"

const makeStop = (overrides: Partial<ItineraryStop> = {}): ItineraryStop => ({
  id: "stop-1",
  title: "Coffee at London Cafe",
  displayTime: "10am",
  imageUrl: "https://example.com/image.jpg",
  coordinates: { lat: 51.5, lng: -0.1 },
  saveTarget: null,
  ...overrides,
})

const makeItinerary = (stops: ItineraryStop[]): Itinerary => ({
  id: "itinerary-1",
  citySlug: "london-united-kingdom",
  title: "Test Itinerary",
  subtitle: "",
  heroImageUrl: "",
  authorName: "",
  description: "",
  sections: [{ id: "day-1", title: "Day 1", stops }],
})

describe("itineraryStopsToMapSections", () => {
  it("carries the section id and title over unchanged", () => {
    const sections = itineraryStopsToMapSections(makeItinerary([makeStop()]))

    expect(sections).toHaveLength(1)
    expect(sections[0].id).toEqual("day-1")
    expect(sections[0].title).toEqual("Day 1")
  })

  it("maps a stop's id, title, coordinates and href", () => {
    const stop = makeStop({ saveTarget: { type: "SHOW", slug: "some-show" } })
    const sections = itineraryStopsToMapSections(makeItinerary([stop]))

    expect(sections[0].places[0]).toMatchObject({
      id: "stop-1",
      title: "Coffee at London Cafe",
      coordinates: { lat: 51.5, lng: -0.1 },
      href: "/show/some-show",
    })
  })

  it("drops stops with invalid coordinates rather than trusting them", () => {
    const valid = makeStop({ id: "valid" })
    const invalid = makeStop({
      id: "invalid",
      coordinates: { lat: NaN as any, lng: undefined as any },
    })

    const sections = itineraryStopsToMapSections(makeItinerary([valid, invalid]))

    expect(sections[0].places.map((p) => p.id)).toEqual(["valid"])
  })

  it("injects ItineraryStopMapDetail as the detail node", () => {
    const sections = itineraryStopsToMapSections(makeItinerary([makeStop()]))
    const detail = sections[0].places[0].detail

    expect(isValidElement(detail)).toBe(true)
    expect((detail as React.ReactElement).type).toBe(ItineraryStopMapDetail)
  })

  it("injects a save control only when the stop has a save target", () => {
    const withTarget = makeStop({
      id: "with-target",
      saveTarget: { type: "SHOW", slug: "some-show" },
    })
    const withoutTarget = makeStop({ id: "without-target", saveTarget: null })

    const sections = itineraryStopsToMapSections(makeItinerary([withTarget, withoutTarget]))
    const [placeWithTarget, placeWithoutTarget] = sections[0].places

    expect(isValidElement(placeWithTarget.saveControl)).toBe(true)
    expect((placeWithTarget.saveControl as React.ReactElement).type).toBe(ItineraryStopSaveControl)
    expect(placeWithoutTarget.saveControl).toBeUndefined()
  })
})
