import * as navigation from "lib/navigation/navigate"
import { __globalStoreTestUtils__ } from "lib/store/GlobalStore"
import { renderWithWrappersTL } from "lib/tests/renderWithWrappers"
import * as useSearchInsightsConfig from "lib/utils/useSearchInsightsConfig"
import { Touchable } from "palette"
import React from "react"
import { SearchHighlight } from "./SearchHighlight"
import { SearchResult } from "./SearchResult"
import { SearchResultImage } from "./SearchResultImage"

jest.mock("lib/utils/useSearchInsightsConfig", () => ({
  searchInsights: jest.fn(),
}))
jest.mock("./SearchHighlight.tsx", () => ({ SearchHighlight: () => null }))

const initialResult = {
  href: "/test-href",
  image_url: "test-url",
  name: "Test Name",
  objectID: "test-id",
  slug: "test-slug",
  __position: 1,
  __queryID: "test-query-id",
}

const TestPage = (props: any) => {
  const { result, ...rest } = props
  return (
    <SearchResult
      categoryName="Article"
      result={{
        ...initialResult,
        ...result,
      }}
      indexName="Article_staging"
      {...rest}
    />
  )
}

describe("SearchListItem", () => {
  const navigateSpy = jest.spyOn(navigation, "navigate")

  const searchInsightsSpy = jest.spyOn(useSearchInsightsConfig, "searchInsights")

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("renders image with correct props", () => {
    const { container } = renderWithWrappersTL(<TestPage />)
    const image = container.findByType(SearchResultImage)

    expect(image).toBeDefined()
    expect(image.props.imageURL).toEqual("test-url")
    expect(image.props.resultType).toEqual("Article")
  })

  it("renders highlight with correct props", () => {
    const { container } = renderWithWrappersTL(<TestPage />)
    const highlight = container.findByType(SearchHighlight)

    expect(highlight).toBeDefined()
    expect(highlight.props.attribute).toEqual("name")
    expect(highlight.props.hit).toEqual(initialResult)
  })

  it("calls searchInsights with correct params on press", () => {
    const { container } = renderWithWrappersTL(<TestPage />)

    container.findByType(Touchable).props.onPress()
    expect(searchInsightsSpy).toHaveBeenCalledWith("clickedObjectIDsAfterSearch", {
      index: "Article_staging",
      eventName: "Search item clicked",
      positions: [1],
      queryID: "test-query-id",
      objectIDs: ["test-id"],
    })
  })

  it(`calls navigation.navigate with href on press when href does not start with "/partner"`, () => {
    const { container } = renderWithWrappersTL(<TestPage />)

    container.findByType(Touchable).props.onPress()
    expect(navigateSpy).toHaveBeenCalledWith("/test-href")
  })
})
