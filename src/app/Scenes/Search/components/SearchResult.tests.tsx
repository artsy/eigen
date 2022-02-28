import * as navigation from "app/navigation/navigate"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { renderWithWrappersTL } from "app/tests/renderWithWrappers"
import * as useSearchInsightsConfig from "app/utils/useSearchInsightsConfig"
import { Touchable } from "palette"
import React from "react"
import { SearchHighlight } from "./SearchHighlight"
import { SearchResult } from "./SearchResult"
import { SearchResultImage } from "./SearchResultImage"

jest.mock("app/utils/useSearchInsightsConfig", () => ({
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
      selectedPill={{
        indexName: "Article_staging",
        displayName: "Article",
        disabled: false,
      }}
      {...rest}
    />
  )
}

describe("SearchListItem", () => {
  const getRecentSearches = () => __globalStoreTestUtils__?.getCurrentState().search.recentSearches!

  const navigateSpy = jest.spyOn(navigation, "navigate")

  const searchInsightsSpy = jest.spyOn(useSearchInsightsConfig, "searchInsights")

  beforeEach(() => {
    jest.clearAllMocks()
  })

  afterEach(() => {
    __globalStoreTestUtils__?.reset()
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

  it("when a result is pressed, correctly adds it to global recent searches", () => {
    const { container } = renderWithWrappersTL(<TestPage />)

    container.findByType(Touchable).props.onPress()

    expect(getRecentSearches()).toEqual([
      {
        type: "AUTOSUGGEST_RESULT_TAPPED",
        props: {
          imageUrl: "test-url",
          href: "/test-href",
          slug: "test-slug",
          displayLabel: "Test Name",
          __typename: "Article",
          displayType: "Article",
        },
      },
    ])
  })

  it(`calls navigation.navigate with href on press when href does not start with "/partner"`, () => {
    const { container } = renderWithWrappersTL(<TestPage />)

    container.findByType(Touchable).props.onPress()
    expect(navigateSpy).toHaveBeenCalledWith("/test-href")
  })
})
