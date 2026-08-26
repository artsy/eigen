import { BucketKey, BucketResults } from "app/Scenes/CityGuide/utils/bucketCityResults"
import { cityTabs } from "app/Scenes/CityGuide/utils/cityTabs"
import {
  convertCityToGeoJSON,
  fairToGeoCityFairs,
  showsToGeoCityShow,
} from "app/Scenes/CityGuide/utils/convertCityToGeoJSON"
import { FilterData, Show } from "app/Scenes/CityGuide/utils/types"

export const buildFeatureCollections = (
  newBucketResults: BucketResults
): { [key in BucketKey]: FilterData } | {} => {
  const newFeatureCollections = {}

  cityTabs.forEach((tab) => {
    const newShows = tab.getShows(newBucketResults)
    const newFairs = tab.getFairs(newBucketResults)
    const showData = showsToGeoCityShow(newShows)
    const fairData = fairToGeoCityFairs(newFairs)
    const data = showData.concat(fairData as any as Show[])
    const geoJSONFeature = convertCityToGeoJSON(data)

    // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
    newFeatureCollections[tab.id] = {
      featureCollection: geoJSONFeature,
      filter: tab.id,
    }
  })

  return newFeatureCollections
}
