import {
  flattenMapSections,
  MapSection,
  mapPlacesToGeoJSON,
} from "app/Scenes/CityGuide/Components/Map/utils/mapSectionsToGeoJSON"

// These assert on the shape of the transform, not on how much mock data happens to exist,
// so counts are derived from the fixture rather than hardcoded.
const SECTIONS: MapSection[] = [
  {
    id: "section-1",
    title: "Day 1",
    places: [
      { id: "stop-1", title: "Coffee at London Cafe", coordinates: { lat: 51.5, lng: -0.1 } },
      { id: "stop-2", title: "Gallery Visit", coordinates: { lat: 51.51, lng: -0.11 } },
    ],
  },
  {
    id: "section-2",
    title: "Day 2",
    places: [
      { id: "stop-3", title: "Frieze London", coordinates: { lat: 51.52, lng: -0.12 } },
      { id: "stop-4", title: "Dinner", coordinates: { lat: 51.53, lng: -0.13 } },
      { id: "stop-5", title: "Nightcap", coordinates: { lat: 51.54, lng: -0.14 } },
    ],
  },
]

const TOTAL_PLACES = SECTIONS.reduce((sum, section) => sum + section.places.length, 0)
const FIRST_SECTION = SECTIONS[0]
const FIRST_PLACE = FIRST_SECTION.places[0]

describe("flattenMapSections", () => {
  it("flattens every section's places into one list", () => {
    const flattened = flattenMapSections(SECTIONS)

    expect(flattened).toHaveLength(TOTAL_PLACES)
  })

  it("tags each place with the section it came from", () => {
    const flattened = flattenMapSections(SECTIONS)

    // The first section's places come first, and the following section starts after them.
    expect(flattened[0].sectionId).toEqual(FIRST_SECTION.id)
    expect(flattened[FIRST_SECTION.places.length].sectionId).toEqual(SECTIONS[1].id)
  })
})

describe("mapPlacesToGeoJSON", () => {
  it("converts places into a feature collection with lng,lat coordinates", () => {
    const collection = mapPlacesToGeoJSON(flattenMapSections(SECTIONS))

    expect(collection.type).toEqual("FeatureCollection")
    expect(collection.features).toHaveLength(TOTAL_PLACES)
    // GeoJSON is lng first, lat second — the reverse of how a place stores them.
    expect(collection.features[0].geometry.coordinates).toEqual([
      FIRST_PLACE.coordinates.lng,
      FIRST_PLACE.coordinates.lat,
    ])
  })

  it("stamps id and a default icon into properties", () => {
    const collection = mapPlacesToGeoJSON(flattenMapSections(SECTIONS))

    expect(collection.features[0].properties).toEqual({ id: FIRST_PLACE.id, icon: "pin" })
  })

  it("carries a place's own icon through instead of the default", () => {
    const sections: MapSection[] = [
      {
        id: "section-1",
        title: "Day 1",
        places: [
          {
            id: "stop-1",
            title: "Frieze London",
            coordinates: { lat: 51.5, lng: -0.1 },
            icon: "pin-fair",
          },
        ],
      },
    ]

    const collection = mapPlacesToGeoJSON(flattenMapSections(sections))

    expect(collection.features[0].properties.icon).toEqual("pin-fair")
  })

  it("returns an empty collection for no places", () => {
    expect(mapPlacesToGeoJSON([])).toEqual({ type: "FeatureCollection", features: [] })
  })
})
