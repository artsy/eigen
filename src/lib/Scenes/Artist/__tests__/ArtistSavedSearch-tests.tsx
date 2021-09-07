import { SavedSearchBanner } from "lib/Components/Artist/ArtistArtworks/SavedSearchBanner"
import { SavedSearchButtonQueryRenderer } from "lib/Components/Artist/ArtistArtworks/SavedSearchButton"
import { OptionListItem } from "lib/Components/ArtworkFilter"
import { PopoverMessage } from "lib/Components/PopoverMessage/PopoverMessage"
import { __globalStoreTestUtils__ } from "lib/store/GlobalStore"
import { extractText } from "lib/tests/extractText"
import { flushPromiseQueue } from "lib/tests/flushPromiseQueue"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import _ from "lodash"
import { Text, TouchableHighlightColor } from "palette"
import React from "react"
import "react-native"
import { act } from "react-test-renderer"
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
    return renderWithWrappers(
      <ArtistQueryRenderer artistID="ignored" environment={environment} searchCriteriaID={searchCriteriaID} />
    )
  }

  it("should not render saved search button when AREnableSavedSearch flag set to false", () => {
    __globalStoreTestUtils__?.injectFeatureFlags({ AREnableSavedSearch: false })

    const tree = getTree("search-criteria-id")

    mockMostRecentOperation("ArtistAboveTheFoldQuery", MockArtistAboveTheFoldQuery)

    expect(tree.root.findAllByType(SavedSearchBanner)).toHaveLength(0)
  })

  it("should convert the criteria attributes to the filter params format", async () => {
    __globalStoreTestUtils__?.injectFeatureFlags({ AREnableSavedSearch: true })

    const tree = getTree("search-criteria-id")

    mockMostRecentOperation("SearchCriteriaQuery", MockSearchCriteriaQuery)
    mockMostRecentOperation("ArtistAboveTheFoldQuery", MockArtistAboveTheFoldQuery)

    act(() => tree.root.findByType(TouchableHighlightColor).props.onPress())

    await flushPromiseQueue()

    const filterTextValues = tree.root.findAllByType(OptionListItem).map(extractText)

    expect(filterTextValues[0]).toContain("• 1")
    expect(filterTextValues[1]).toContain("• 2")
    expect(filterTextValues[2]).toContain("• 2")
  })

  it("should an error message when something went wrong during the search criteria query", async () => {
    __globalStoreTestUtils__?.injectFeatureFlags({ AREnableSavedSearch: true })

    const tree = getTree("something")

    environment.mock.rejectMostRecentOperation(new Error())
    mockMostRecentOperation("ArtistAboveTheFoldQuery", MockArtistAboveTheFoldQuery)

    const popoverMessageInstance = tree.root.findByType(PopoverMessage)
    const textInstances = popoverMessageInstance.findAllByType(Text)

    expect(textInstances[0].props.children).toEqual("Sorry, an error occured")
    expect(textInstances[1].props.children).toEqual("Failed to get saved search criteria")
  })

  it("should render new saved search component if AREnableSavedSearchV2 flag set to true", async () => {
    __globalStoreTestUtils__?.injectFeatureFlags({ AREnableSavedSearchV2: true })

    const tree = getTree("search-criteria-id")

    mockMostRecentOperation("SearchCriteriaQuery", MockSearchCriteriaQuery)
    mockMostRecentOperation("ArtistAboveTheFoldQuery", MockArtistAboveTheFoldQuery)

    await flushPromiseQueue()

    expect(tree.root.findAllByType(SavedSearchButtonQueryRenderer)).toHaveLength(1)
    expect(tree.root.findAllByType(SavedSearchBanner)).toHaveLength(0)
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
