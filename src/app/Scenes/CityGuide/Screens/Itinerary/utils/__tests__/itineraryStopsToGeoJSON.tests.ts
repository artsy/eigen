import {
  flattenItineraryStops,
  itineraryStopsToGeoJSON,
  itineraryStopsToRouteGeoJSON,
} from "app/Scenes/CityGuide/Screens/Itinerary/utils/itineraryStopsToGeoJSON"
import { MOCK_ITINERARIES } from "app/Scenes/CityGuide/Screens/Itinerary/utils/mockItineraries"

// These assert on the shape of the transform, not on how much mock data happens to
// exist, so counts are derived. Editing the mock should not break them — earlier
// versions hardcoded the stop count and broke three times as the data grew.
const ITINERARY = MOCK_ITINERARIES[0]
const TOTAL_STOPS = ITINERARY.sections.reduce((sum, section) => sum + section.stops.length, 0)
const FIRST_SECTION = ITINERARY.sections[0]
const FIRST_STOP = FIRST_SECTION.stops[0]

describe("flattenItineraryStops", () => {
  it("numbers every stop continuously across sections", () => {
    const flattened = flattenItineraryStops(ITINERARY)

    expect(flattened).toHaveLength(TOTAL_STOPS)
    expect(flattened.map((f) => f.number)).toEqual(
      Array.from({ length: TOTAL_STOPS }, (_, i) => i + 1)
    )
  })

  it("tags each stop with the section it came from", () => {
    const flattened = flattenItineraryStops(ITINERARY)

    // The first section's stops come first, and the following section starts after them.
    expect(flattened[0].sectionId).toEqual(FIRST_SECTION.id)
    expect(flattened[FIRST_SECTION.stops.length].sectionId).toEqual(ITINERARY.sections[1].id)
  })
})

describe("itineraryStopsToGeoJSON", () => {
  it("converts stops into a feature collection with lng,lat coordinates", () => {
    const collection = itineraryStopsToGeoJSON(flattenItineraryStops(ITINERARY))

    expect(collection.type).toEqual("FeatureCollection")
    expect(collection.features).toHaveLength(TOTAL_STOPS)
    // GeoJSON is lng first, lat second — the reverse of how the stop stores them.
    expect(collection.features[0].geometry.coordinates).toEqual([
      FIRST_STOP.coordinates.lng,
      FIRST_STOP.coordinates.lat,
    ])
  })

  it("stamps id, title, sectionId and a string number into properties", () => {
    const collection = itineraryStopsToGeoJSON(flattenItineraryStops(ITINERARY))

    expect(collection.features[0].properties).toEqual({
      id: FIRST_STOP.id,
      title: FIRST_STOP.title,
      sectionId: FIRST_SECTION.id,
      number: "1",
    })
  })

  it("numbers by position in the list given, so a filtered section restarts at 1", () => {
    const lastSection = ITINERARY.sections[ITINERARY.sections.length - 1]
    const flattened = flattenItineraryStops(ITINERARY)
    const lastSectionOnly = flattened.filter((f) => f.sectionId === lastSection.id)

    // These sit late in the itinerary, but on their own they start at 1 again.
    expect(lastSectionOnly[0].number).toBeGreaterThan(1)
    expect(
      itineraryStopsToGeoJSON(lastSectionOnly).features.map((f) => f.properties.number)
    ).toEqual(lastSection.stops.map((_, i) => String(i + 1)))
  })

  it("returns an empty collection for no stops", () => {
    expect(itineraryStopsToGeoJSON([])).toEqual({ type: "FeatureCollection", features: [] })
  })
})

describe("itineraryStopsToRouteGeoJSON", () => {
  it("traces one line through the stops in order", () => {
    const flattened = flattenItineraryStops(ITINERARY)
    const firstSectionStops = flattened.filter((f) => f.sectionId === FIRST_SECTION.id)
    const route = itineraryStopsToRouteGeoJSON(firstSectionStops)

    expect(route.features).toHaveLength(1)
    expect(route.features[0].geometry.coordinates).toEqual(
      FIRST_SECTION.stops.map((stop) => [stop.coordinates.lng, stop.coordinates.lat])
    )
  })

  it("draws nothing for a single stop, which has no line to draw", () => {
    const flattened = flattenItineraryStops(ITINERARY)

    expect(itineraryStopsToRouteGeoJSON(flattened.slice(0, 1)).features).toEqual([])
    expect(itineraryStopsToRouteGeoJSON([]).features).toEqual([])
  })
})
