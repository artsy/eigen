import { cityTabs } from "app/Scenes/City/cityTabs"
import { getFeatureCollectionForTab } from "app/Scenes/Map/helpers/getFeatureCollectionForTab"
import { FilterData } from "app/utils/cityGuide/types"

describe(getFeatureCollectionForTab, () => {
  it("returns the feature collection matching the active tab", () => {
    const galleriesFilterData = { filter: "galleries" } as FilterData
    const featureCollections = {
      all: { filter: "all" } as FilterData,
      galleries: galleriesFilterData,
    }
    const galleriesIndex = cityTabs.findIndex((tab) => tab.id === "galleries")

    const result = getFeatureCollectionForTab(galleriesIndex, featureCollections)

    expect(result).toBe(galleriesFilterData)
  })

  it("returns undefined when no feature collection exists yet for the tab", () => {
    const result = getFeatureCollectionForTab(0, {})

    expect(result).toBeUndefined()
  })
})
