import { fireEvent } from "@testing-library/react-native"
import { __globalStoreTestUtils__ } from "lib/store/GlobalStore"
import { renderWithWrappersTL } from "lib/tests/renderWithWrappers"
import _ from "lodash"
import React from "react"
import "react-native"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"
import { MockResolvers } from "relay-test-utils/lib/RelayMockPayloadGenerator"
import { ArtistQueryRenderer } from "../Artist"

jest.unmock("react-relay")
jest.unmock("react-tracking")
jest.unmock("lib/Components/Artist/ArtistArtworks/ArtistArtworks.tsx")

type ArtistQueries = "ArtistAboveTheFoldQuery" | "ArtistBelowTheFoldQuery" | "SearchCriteriaQuery"

describe("Saved search banner on artist screen", () => {
  const originalError = console.error
  const originalWarn = console.warn
  let environment = createMockEnvironment()

  beforeEach(() => {
    __globalStoreTestUtils__?.injectFeatureFlags({ AREnableSavedSearchV2: true })
    environment = createMockEnvironment()
    console.error = jest.fn()
    console.warn = jest.fn()
  })

  afterEach(() => {
    environment = createMockEnvironment()
    console.error = originalError
    console.warn = originalWarn
  })

  function mockMostRecentOperation(name: ArtistQueries, mockResolvers: MockResolvers = {}) {
    expect(environment.mock.getMostRecentOperation().request.node.operation.name).toBe(name)
    environment.mock.resolveMostRecentOperation((operation) => {
      const result = MockPayloadGenerator.generate(operation, {
        ID({ path }) {
          // need to make sure artist id is stable between above-and-below-the-fold queries to avoid cache weirdness
          if (_.isEqual(path, ["artist", "id"])) {
            return "artist-id"
          }
        },
        ...mockResolvers,
      })
      return result
    })
  }

  const getTree = (searchCriteriaID?: string) => {
    return renderWithWrappersTL(
      <ArtistQueryRenderer artistID="ignored" environment={environment} searchCriteriaID={searchCriteriaID} />
    )
  }

  it("should not render saved search button when AREnableSavedSearch flag set to false", async () => {
    __globalStoreTestUtils__?.injectFeatureFlags({ AREnableSavedSearch: false })
    __globalStoreTestUtils__?.injectFeatureFlags({ AREnableSavedSearchV2: false })

    const { queryByText } = getTree("search-criteria-id")

    mockMostRecentOperation("ArtistAboveTheFoldQuery", MockArtistAboveTheFoldQuery)
    expect(queryByText("Create Alert")).toBeNull()
  })

  it("should convert the criteria attributes to the filter params format", async () => {
    const { getByText } = getTree("search-criteria-id")

    mockMostRecentOperation("SearchCriteriaQuery", MockSearchCriteriaQuery)
    mockMostRecentOperation("ArtistAboveTheFoldQuery", MockArtistAboveTheFoldQuery)

    fireEvent.press(getByText("Sort & Filter"))

    expect(getByText("Sort By • 1")).toBeTruthy()
    expect(getByText("Rarity • 2")).toBeTruthy()
    expect(getByText("Ways to Buy • 2")).toBeTruthy()
  })

  it("should an error message when something went wrong during the search criteria query", async () => {
    const { getByText } = getTree("something")

    environment.mock.rejectMostRecentOperation(new Error())
    mockMostRecentOperation("ArtistAboveTheFoldQuery", MockArtistAboveTheFoldQuery)

    expect(getByText("Sorry, an error occured")).toBeTruthy()
    expect(getByText("Failed to get saved search criteria")).toBeTruthy()
  })

  it("should render new saved search component if AREnableSavedSearchV2 flag set to true", async () => {
    const { queryByTestId } = getTree("search-criteria-id")

    mockMostRecentOperation("SearchCriteriaQuery", MockSearchCriteriaQuery)
    mockMostRecentOperation("ArtistAboveTheFoldQuery", MockArtistAboveTheFoldQuery)

    expect(queryByTestId("create-saved-search-button")).toBeTruthy()
    expect(queryByTestId("create-saved-search-banner")).toBeNull()
  })
})

const MockSearchCriteriaQuery = {
  Me() {
    return {
      savedSearch: {
        attributionClass: ["limited edition", "open edition"],
        acquireable: true,
        inquireableOnly: true,
        offerable: null,
        atAuction: null,
        width: null,
        height: null,
      },
    }
  },
}
const MockArtistAboveTheFoldQuery = {
  Artist() {
    return {
      has_metadata: true,
      counts: { articles: 0, related_artists: 0, artworks: 1, partner_shows: 0 },
      auctionResultsConnection: {
        totalCount: 0,
      },
    }
  },
}
