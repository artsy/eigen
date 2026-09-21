import { BucketResults } from "app/Scenes/CityGuide/utils/bucketCityResults"
import { cityTabs, tabHasResults } from "app/Scenes/CityGuide/utils/cityTabs"

const emptyBucketResults: BucketResults = {
  saved: [],
  fairs: [],
  galleries: [],
  museums: [],
  closing: [],
  opening: [],
}

describe("tabHasResults", () => {
  const savedTab = cityTabs.find((tab) => tab.id === "saved")!
  const fairsTab = cityTabs.find((tab) => tab.id === "fairs")!

  it("is false when both shows and fairs are empty", () => {
    expect(tabHasResults(savedTab, emptyBucketResults)).toBe(false)
  })

  it("is true when the tab has matching shows", () => {
    expect(tabHasResults(savedTab, { ...emptyBucketResults, saved: [{}] as any })).toBe(true)
  })

  it("is true when the tab has matching fairs", () => {
    expect(tabHasResults(fairsTab, { ...emptyBucketResults, fairs: [{}] as any })).toBe(true)
  })
})
