import {
  flattenItineraryStops,
  itineraryStopsToGeoJSON,
} from "app/Scenes/CityGuide/Screens/Itinerary/utils/itineraryStopsToGeoJSON"
import { MOCK_ITINERARIES } from "app/Scenes/CityGuide/Screens/Itinerary/utils/mockItineraries"

describe("flattenItineraryStops", () => {
  it("returns every stop with a continuous number and its section id", () => {
    const flattened = flattenItineraryStops(MOCK_ITINERARIES[0])

    expect(flattened.map((f) => f.number)).toEqual([1, 2, 3, 4, 5])
    expect(flattened[0].sectionId).toEqual("day-1")
    expect(flattened[3].sectionId).toEqual("day-2")
  })
})

describe("itineraryStopsToGeoJSON", () => {
  it("converts stops into a feature collection with lng,lat coordinates", () => {
    const collection = itineraryStopsToGeoJSON(flattenItineraryStops(MOCK_ITINERARIES[0]))

    expect(collection.type).toEqual("FeatureCollection")
    expect(collection.features).toHaveLength(5)
    // GeoJSON is lng first, lat second.
    expect(collection.features[0].geometry.coordinates).toEqual([-0.1365, 51.5136])
  })

  it("stamps id, title, sectionId and a string number into properties", () => {
    const collection = itineraryStopsToGeoJSON(flattenItineraryStops(MOCK_ITINERARIES[0]))

    expect(collection.features[1].properties).toEqual({
      id: "stop-2",
      title: "Splash: Sea, Beach and Pool",
      sectionId: "day-1",
      number: "2",
    })
  })

  it("returns an empty collection for no stops", () => {
    expect(itineraryStopsToGeoJSON([])).toEqual({ type: "FeatureCollection", features: [] })
  })
})
