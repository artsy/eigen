import {
  flattenMapSections,
  MapSection,
  mapPlacesToGeoJSON,
  mapPlacesToRouteGeoJSON,
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

  it("stamps id and a default icon into properties when numbering is off (the default)", () => {
    const collection = mapPlacesToGeoJSON(flattenMapSections(SECTIONS))

    expect(collection.features[0].properties).toEqual({ id: FIRST_PLACE.id, icon: "pin" })
  })

  it("stamps a string number into properties when numbering is on", () => {
    const collection = mapPlacesToGeoJSON(flattenMapSections(SECTIONS), { numbered: true })

    expect(collection.features[0].properties).toEqual({
      id: FIRST_PLACE.id,
      icon: "pin",
      number: "1",
    })
    expect(collection.features[1].properties.number).toEqual("2")
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

  it("numbers by position in the list given, so a filtered section restarts at 1", () => {
    const lastSection = SECTIONS[SECTIONS.length - 1]
    const flattened = flattenMapSections(SECTIONS)
    const lastSectionOnly = flattened.filter((f) => f.sectionId === lastSection.id)

    // These sit late in the full list, but on their own they number from 1 again.
    expect(
      mapPlacesToGeoJSON(lastSectionOnly, { numbered: true }).features.map(
        (f) => f.properties.number
      )
    ).toEqual(lastSection.places.map((_, i) => String(i + 1)))
  })

  it("returns an empty collection for no places", () => {
    expect(mapPlacesToGeoJSON([])).toEqual({ type: "FeatureCollection", features: [] })
  })
})

describe("mapPlacesToRouteGeoJSON", () => {
  it("traces one line through the places in order", () => {
    const flattened = flattenMapSections(SECTIONS)
    const firstSectionPlaces = flattened.filter((f) => f.sectionId === FIRST_SECTION.id)
    const route = mapPlacesToRouteGeoJSON(firstSectionPlaces)

    expect(route.features).toHaveLength(1)
    expect(route.features[0].geometry.coordinates).toEqual(
      FIRST_SECTION.places.map((place) => [place.coordinates.lng, place.coordinates.lat])
    )
  })

  it("draws nothing for a single place, which has no line to draw", () => {
    const flattened = flattenMapSections(SECTIONS)

    expect(mapPlacesToRouteGeoJSON(flattened.slice(0, 1)).features).toEqual([])
    expect(mapPlacesToRouteGeoJSON([]).features).toEqual([])
  })
})
