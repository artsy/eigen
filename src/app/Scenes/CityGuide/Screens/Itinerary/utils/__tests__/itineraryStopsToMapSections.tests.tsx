import { ItineraryStopMapDetail } from "app/Scenes/CityGuide/Screens/Itinerary/Components/ItineraryStopMapDetail"
import { ItineraryStopSaveControl } from "app/Scenes/CityGuide/Screens/Itinerary/Components/ItineraryStopSaveControl"
import {
  makeItinerary,
  makeItineraryStop,
} from "app/Scenes/CityGuide/Screens/Itinerary/utils/__tests__/itineraryTestFixtures"
import { itineraryStopsToMapSections } from "app/Scenes/CityGuide/Screens/Itinerary/utils/itineraryStopsToMapSections"
import { isValidElement } from "react"

const makeStop = (overrides: Record<string, unknown> = {}) =>
  makeItineraryStop({
    title: "Coffee at London Cafe",
    startTime: "10am",
    endTime: null,
    latitude: 51.5,
    longitude: -0.1,
    ...overrides,
  })

describe("itineraryStopsToMapSections", () => {
  it("carries the section id and title over unchanged", () => {
    const sections = itineraryStopsToMapSections(makeItinerary([makeStop()]))

    expect(sections).toHaveLength(1)
    expect(sections[0].id).toEqual("day-1")
    expect(sections[0].title).toEqual("Day 1")
  })

  it("maps a stop's id, title, coordinates and href", () => {
    const stop = makeStop({
      item: {
        __typename: "Show",
        slug: "some-show",
        name: "Some Show",
        href: "/show/some-show",
        isFreeAdmission: null,
        coverImage: null,
        partner: null,
        location: null,
      },
    })
    const sections = itineraryStopsToMapSections(makeItinerary([stop]))

    expect(sections[0].places[0]).toMatchObject({
      id: "stop-1",
      title: "Coffee at London Cafe",
      coordinates: { lat: 51.5, lng: -0.1 },
      href: "/show/some-show",
    })
  })

  it("drops stops with invalid coordinates rather than trusting them", () => {
    const valid = makeStop({ internalID: "valid" })
    const invalid = makeStop({
      internalID: "invalid",
      latitude: NaN,
      longitude: undefined,
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
      internalID: "with-target",
      item: {
        __typename: "Show",
        slug: "some-show",
        name: "Some Show",
        href: "/show/some-show",
        isFreeAdmission: null,
        coverImage: null,
        partner: null,
        location: null,
      },
    })
    const withoutTarget = makeStop({ internalID: "without-target", item: null })

    const sections = itineraryStopsToMapSections(makeItinerary([withTarget, withoutTarget]))
    const [placeWithTarget, placeWithoutTarget] = sections[0].places

    expect(isValidElement(placeWithTarget.saveControl)).toBe(true)
    expect((placeWithTarget.saveControl as React.ReactElement).type).toBe(ItineraryStopSaveControl)
    expect(placeWithoutTarget.saveControl).toBeUndefined()
  })
})
