import { getNearestFeatureToTap } from "app/Scenes/CityGuide/utils/getNearestFeatureToTap"

const featureAt = (id: string, lng: number, lat: number): GeoJSON.Feature => ({
  type: "Feature",
  geometry: { type: "Point", coordinates: [lng, lat] },
  properties: { id },
})

describe(getNearestFeatureToTap, () => {
  it("picks the feature closest to the tap rather than the first one", () => {
    const far = featureAt("far", -74.01, 40.7)
    const near = featureAt("near", -74.0001, 40.7)

    const result = getNearestFeatureToTap([far, near], { latitude: 40.7, longitude: -74 })

    expect(result?.properties?.id).toBe("near")
  })

  it("compares latitude and longitude on a comparable scale", () => {
    // Half a degree of longitude at this latitude is a shorter distance than half a degree of
    // latitude, so the longitude-offset feature is the nearer one.
    const offsetByLongitude = featureAt("longitude", -73.5, 40.7)
    const offsetByLatitude = featureAt("latitude", -74, 41.2)

    const result = getNearestFeatureToTap([offsetByLatitude, offsetByLongitude], {
      latitude: 40.7,
      longitude: -74,
    })

    expect(result?.properties?.id).toBe("longitude")
  })

  it("returns the only feature when there is nothing to compare", () => {
    const only = featureAt("only", -74, 40.7)

    expect(getNearestFeatureToTap([only])).toBe(only)
  })

  it("returns undefined when there are no features", () => {
    expect(getNearestFeatureToTap([], { latitude: 40.7, longitude: -74 })).toBeUndefined()
  })
})
