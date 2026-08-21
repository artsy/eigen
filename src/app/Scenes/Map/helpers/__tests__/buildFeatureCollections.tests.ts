import { cityTabs } from "app/Scenes/City/cityTabs"
import { buildFeatureCollections } from "app/Scenes/Map/helpers/buildFeatureCollections"
import { emptyBucketResults } from "app/utils/cityGuide/bucketCityResults"

describe(buildFeatureCollections, () => {
  it("builds an empty feature collection per tab when there are no results", () => {
    const result: any = buildFeatureCollections(emptyBucketResults)

    cityTabs.forEach((tab) => {
      expect(result[tab.id].filter).toBe(tab.id)
      expect(result[tab.id].featureCollection.features).toEqual([])
      expect(typeof result[tab.id].clusterEngine.getClusters).toBe("function")
    })
  })

  it("includes shows with location coordinates in the matching tabs", () => {
    const gallery: any = {
      slug: "some-gallery-show",
      is_followed: false,
      location: { coordinates: { lat: 40.7, lng: -74.0 } },
      partner: { type: "Gallery" },
    }

    const result: any = buildFeatureCollections({ ...emptyBucketResults, galleries: [gallery] })

    expect(result.galleries.featureCollection.features).toHaveLength(1)
    expect(result.all.featureCollection.features).toHaveLength(1)
    expect(result.museums.featureCollection.features).toEqual([])
  })
})
