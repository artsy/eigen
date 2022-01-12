import { FilterParamName } from "lib/Components/ArtworkFilter/ArtworkFilterHelpers"
import { __globalStoreTestUtils__ } from "lib/store/GlobalStore"
import { getNamePlaceholder } from "./helpers"

describe("getNamePlaceholder", () => {
  it("returns the singular form for the filter label", () => {
    const pills = [{ label: "One", paramName: FilterParamName.materialsTerms, value: "one" }]
    expect(getNamePlaceholder("artistName", pills)).toBe("artistName • 1 filter")
  })

  it("returns the plural form for the filter label", () => {
    const pills = [
      { label: "One", paramName: FilterParamName.materialsTerms, value: "one" },
      { label: "Two", paramName: FilterParamName.materialsTerms, value: "two" },
    ]
    expect(getNamePlaceholder("artistName", pills)).toBe("artistName • 2 filters")
  })

  it("returns the correct number of filters when artist pill is shown", () => {
    __globalStoreTestUtils__?.injectFeatureFlags({ AREnableImprovedAlertsFlow: true })
    const pills = [
      { label: "Artist Name", paramName: FilterParamName.artistIDs, value: "artistName" },
      { label: "One", paramName: FilterParamName.materialsTerms, value: "one" },
      { label: "Two", paramName: FilterParamName.materialsTerms, value: "two" },
    ]
    expect(getNamePlaceholder("artistName", pills)).toBe("artistName • 2 filters")
  })

  it("returns only artist name when pills are empty", () => {
    __globalStoreTestUtils__?.injectFeatureFlags({ AREnableImprovedAlertsFlow: true })
    expect(getNamePlaceholder("artistName", [])).toBe("artistName")
  })
})
