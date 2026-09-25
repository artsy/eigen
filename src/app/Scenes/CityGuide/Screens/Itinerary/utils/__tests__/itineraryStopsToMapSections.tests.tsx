import { OwnerType } from "@artsy/cohesion"
import { CityEventSaveControl } from "app/Scenes/CityGuide/Components/CityEventSaveControls"
import { CustomStopSaveControl } from "app/Scenes/CityGuide/Components/CustomStopSaveControl"
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

const toMapSections = (itinerary: ReturnType<typeof makeItinerary>) =>
  itineraryStopsToMapSections(itinerary, "london-united-kingdom", "London")

describe("itineraryStopsToMapSections", () => {
  it("carries the section id and title over unchanged", () => {
    const sections = toMapSections(makeItinerary([makeStop()]))

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
    const sections = toMapSections(makeItinerary([stop]))

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

    const sections = toMapSections(makeItinerary([valid, invalid]))

    expect(sections[0].places.map((p) => p.id)).toEqual(["valid"])
  })

  // Same card the itinerary list shows, so the map preview never drifts from it.
  it("carries the stop's card fields", () => {
    const sections = toMapSections(makeItinerary([makeStop()]))

    expect(sections[0].places[0].card).toMatchObject({
      kind: "custom",
      title: "Coffee at London Cafe",
      hours: "10am",
    })
  })

  it("injects the entity save control for a stop with a save target", () => {
    const withTarget = makeStop({
      internalID: "with-target",
      item: {
        __typename: "Show",
        internalID: "some-show-id",
        slug: "some-show",
        name: "Some Show",
        href: "/show/some-show",
        isFreeAdmission: null,
        exhibitionPeriod: null,
        coverImage: null,
        partner: null,
        location: null,
      },
    })

    const sections = toMapSections(makeItinerary([withTarget]))
    const [place] = sections[0].places

    expect(isValidElement(place.saveControl)).toBe(true)
    expect((place.saveControl as React.ReactElement).type).toBe(CityEventSaveControl)
    expect((place.saveControl as React.ReactElement).props).toMatchObject({
      contextScreenOwnerType: OwnerType.cityGuideGuide,
      contextScreenOwnerId: "itinerary-1",
      isCuratedGuide: true,
    })
  })

  // Same destination `ItineraryStopRow` builds for a custom stop's own screen — a custom stop
  // has no `card.href` (only ever an outbound `sourceURL`), so the map pin must not fall back
  // to that and end up with nowhere to navigate.
  it("points a custom stop's href at its own screen, not its (usually absent) card href", () => {
    const withoutTarget = makeStop({ internalID: "without-target", item: null })

    const sections = toMapSections(makeItinerary([withoutTarget]))

    expect(sections[0].places[0].href).toEqual(
      "/city-guide/london-united-kingdom/itinerary/itinerary-1/stop/without-target"
    )
  })

  // Same plus the list shows for a custom stop (ItineraryStopRow) — the map preview must not
  // silently drop it just because there's no Artsy entity behind the stop.
  it("injects the custom stop save control for a stop with no entity", () => {
    const withoutTarget = makeStop({ internalID: "without-target", item: null })

    const sections = toMapSections(makeItinerary([withoutTarget]))
    const [place] = sections[0].places

    expect(isValidElement(place.saveControl)).toBe(true)
    expect((place.saveControl as React.ReactElement).type).toBe(CustomStopSaveControl)
    expect((place.saveControl as React.ReactElement).props).toMatchObject({
      contextScreenOwnerType: OwnerType.cityGuideGuide,
      contextScreenOwnerId: "itinerary-1",
      isCuratedGuide: true,
    })
  })
})
