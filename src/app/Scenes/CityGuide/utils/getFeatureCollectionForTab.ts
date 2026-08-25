import { BucketKey } from "app/Scenes/CityGuide/utils/bucketCityResults"
import { cityTabs } from "app/Scenes/CityGuide/utils/cityTabs"
import { FilterData } from "app/Scenes/CityGuide/utils/types"

export const getFeatureCollectionForTab = (
  activeIndex: number,
  featureCollections: { [key in BucketKey]: FilterData } | {}
): FilterData => {
  const filterID = cityTabs[activeIndex].id
  // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
  return featureCollections[filterID]
}
