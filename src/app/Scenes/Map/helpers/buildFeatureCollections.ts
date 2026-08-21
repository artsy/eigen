import { cityTabs } from "app/Scenes/City/cityTabs"
import { BucketKey, BucketResults } from "app/Scenes/Map/bucketCityResults"
import { MaxZoomLevel, MinZoomLevel } from "app/Scenes/Map/mapZoomLevels"
import { FilterData, Show } from "app/Scenes/Map/types"
import {
  convertCityToGeoJSON,
  fairToGeoCityFairs,
  showsToGeoCityShow,
} from "app/utils/convertCityToGeoJSON"
import Supercluster from "supercluster"

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

    const clusterEngine = new Supercluster({
      radius: 50,
      minZoom: Math.floor(MinZoomLevel),
      maxZoom: Math.floor(MaxZoomLevel),
    })

    clusterEngine.load(geoJSONFeature.features as any)

    // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
    newFeatureCollections[tab.id] = {
      featureCollection: geoJSONFeature,
      filter: tab.id,
      clusterEngine,
    }
  })

  return newFeatureCollections
}
