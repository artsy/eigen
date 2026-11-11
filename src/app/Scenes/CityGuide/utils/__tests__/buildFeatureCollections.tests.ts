import { emptyBucketResults } from "app/Scenes/CityGuide/utils/bucketCityResults"
import { buildFeatureCollections } from "app/Scenes/CityGuide/utils/buildFeatureCollections"
import { cityTabs } from "app/Scenes/CityGuide/utils/cityTabs"

describe(buildFeatureCollections, () => {
  it("builds an empty feature collection per tab when there are no results", () => {
    const result: any = buildFeatureCollections(emptyBucketResults)

    cityTabs.forEach((tab) => {
      expect(result[tab.id].filter).toBe(tab.id)
      expect(result[tab.id].featureCollection.features).toEqual([])
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

  describe("saved pin icon", () => {
    const followedShow: any = {
      slug: "followed",
      is_followed: true,
      isOnMyItineraries: false,
      location: { coordinates: { lat: 40.7, lng: -74.0 } },
      partner: { type: "Gallery" },
    }
    const itineraryShow: any = {
      slug: "on-itinerary",
      is_followed: false,
      isOnMyItineraries: true,
      location: { coordinates: { lat: 40.7, lng: -74.0 } },
      partner: { type: "Gallery" },
    }

    const iconsBySlug = (result: any) =>
      Object.fromEntries(
        result.galleries.featureCollection.features.map((feature: any) => [
          feature.properties.slug,
          feature.properties.icon,
        ])
      )

    it("marks followed shows as saved with itineraries off", () => {
      const result: any = buildFeatureCollections({
        ...emptyBucketResults,
        galleries: [followedShow, itineraryShow],
      })

      expect(iconsBySlug(result)).toEqual({ followed: "pin-saved", "on-itinerary": "pin" })
    })

    it("marks shows on an itinerary as saved with itineraries on", () => {
      const result: any = buildFeatureCollections(
        { ...emptyBucketResults, galleries: [followedShow, itineraryShow] },
        { savedMeansOnItineraries: true }
      )

      expect(iconsBySlug(result)).toEqual({ followed: "pin", "on-itinerary": "pin-saved" })
    })
  })
})
