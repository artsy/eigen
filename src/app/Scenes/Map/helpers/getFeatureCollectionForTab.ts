import { cityTabs } from "app/Scenes/City/cityTabs"
import { BucketKey } from "app/utils/cityGuide/bucketCityResults"
import { FilterData } from "app/utils/cityGuide/types"

export const getFeatureCollectionForTab = (
  activeIndex: number,
  featureCollections: { [key in BucketKey]: FilterData } | {}
): FilterData => {
  const filterID = cityTabs[activeIndex].id
  // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
  return featureCollections[filterID]
}
