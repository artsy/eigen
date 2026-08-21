import { getNearestPointToLatLongInCollection } from "app/Scenes/Map/helpers/getNearestPointToLatLongInCollection"

const feature = (id: string, coordinates: [number, number]) => ({
  properties: { id },
  geometry: { coordinates },
})

describe(getNearestPointToLatLongInCollection, () => {
  it("returns the feature closest to the given point", () => {
    const near = feature("near", [40.71, -74.0])
    const far = feature("far", [51.5, -0.12])

    const result = getNearestPointToLatLongInCollection({ lat: 40.7, lng: -74.0 }, [far, near])

    expect(result.properties.id).toBe("near")
  })

  it("returns the only feature when given a single feature", () => {
    const onlyFeature = feature("only", [10, 10])

    const result = getNearestPointToLatLongInCollection({ lat: 0, lng: 0 }, [onlyFeature])

    expect(result.properties.id).toBe("only")
  })
})
