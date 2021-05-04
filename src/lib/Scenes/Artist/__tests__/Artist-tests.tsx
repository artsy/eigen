import ArtistArtworks from "lib/Components/Artist/ArtistArtworks/ArtistArtworks"
import { ArtistHeaderFragmentContainer } from "lib/Components/Artist/ArtistHeader"
import { ArtistInsights } from "lib/Components/Artist/ArtistInsights/ArtistInsights"
import ArtistShows from "lib/Components/Artist/ArtistShows/ArtistShows"
import { StickyTab } from "lib/Components/StickyTabPage/StickyTabPageTabBar"
import { __globalStoreTestUtils__ } from "lib/store/GlobalStore"
import { extractText } from "lib/tests/extractText"
import { renderWithWrappers, renderWithWrappersTL } from "lib/tests/renderWithWrappers"
import { postEventToProviders } from "lib/utils/track/providers"
import _ from "lodash"
import React from "react"
import "react-native"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"
import { MockResolvers } from "relay-test-utils/lib/RelayMockPayloadGenerator"
import { ArtistAboutContainer } from "../../../Components/Artist/ArtistAbout/ArtistAbout"
import { ArtistQueryRenderer } from "../Artist"

jest.unmock("react-relay")

type ArtistQueries = "ArtistAboveTheFoldQuery" | "ArtistBelowTheFoldQuery"

describe("availableTabs", () => {
  let environment = createMockEnvironment()
  beforeEach(() => {
    environment = createMockEnvironment()
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

  const TestWrapper = () => {
    return <ArtistQueryRenderer artistID="ignored" environment={environment} isPad={false} />
  }

  it("returns an empty state if artist has no metadata, shows, insights, or works", async () => {
    const tree = renderWithWrappers(<TestWrapper />)
    mockMostRecentOperation("ArtistAboveTheFoldQuery", {
      Artist() {
        return {
          has_metadata: false,
          counts: { articles: 0, related_artists: 0, artworks: 0, partner_shows: 0 },
          auctionResultsConnection: {
            totalCount: 0,
          },
        }
      },
    })
    expect(tree.root.findAllByType(ArtistHeaderFragmentContainer)).toHaveLength(1)
    expect(tree.root.findAllByType(StickyTab)).toHaveLength(1)
    expect(extractText(tree.root)).toContain(
      "There aren’t any works available by the artist at this time. Follow to receive notifications when new works are added"
    )
  })

  it("returns only About tab if artist has only metadata", async () => {
    const tree = renderWithWrappers(<TestWrapper />)
    mockMostRecentOperation("ArtistAboveTheFoldQuery", {
      Artist() {
        return {
          has_metadata: true,
          counts: { articles: 0, related_artists: 0, artworks: 0, partner_shows: 0 },
          auctionResultsConnection: {
            totalCount: 0,
          },
        }
      },
    })
    expect(tree.root.findAllByType(ArtistHeaderFragmentContainer)).toHaveLength(1)
    expect(tree.root.findAllByType(StickyTab)).toHaveLength(1)
    expect(tree.root.findAllByType(ArtistAboutContainer)).toHaveLength(0)
    // it only shows below the fold
    mockMostRecentOperation("ArtistBelowTheFoldQuery")
    expect(tree.root.findAllByType(ArtistAboutContainer)).toHaveLength(1)
  })

  it("returns About tab if artist has only articles", async () => {
    const tree = renderWithWrappers(<TestWrapper />)
    mockMostRecentOperation("ArtistAboveTheFoldQuery", {
      Artist() {
        return {
          has_metadata: false,
          counts: { articles: 1, related_artists: 0, artworks: 0, partner_shows: 0 },
          auctionResultsConnection: {
            totalCount: 0,
          },
        }
      },
    })
    mockMostRecentOperation("ArtistBelowTheFoldQuery")
    expect(tree.root.findAllByType(ArtistAboutContainer)).toHaveLength(1)
  })

  it("returns Shows tab if artist has shows", async () => {
    __globalStoreTestUtils__?.injectFeatureFlags({ AROptionsNewArtistInsightsPage: false })
    const tree = renderWithWrappers(<TestWrapper />)
    mockMostRecentOperation("ArtistAboveTheFoldQuery", {
      Artist() {
        return {
          has_metadata: false,
          counts: { articles: 0, related_artists: 0, artworks: 0, partner_shows: 1 },
        }
      },
    })
    mockMostRecentOperation("ArtistBelowTheFoldQuery")
    expect(tree.root.findAllByType(ArtistShows)).toHaveLength(1)
  })

  it("returns all three tabs if artist has metadata, works, and shows when AROptionsNewArtistInsightsPage is false", async () => {
    __globalStoreTestUtils__?.injectFeatureFlags({ AROptionsNewArtistInsightsPage: false })
    const tree = renderWithWrappers(<TestWrapper />)
    mockMostRecentOperation("ArtistAboveTheFoldQuery", {
      Artist() {
        return {
          has_metadata: true,
          counts: { articles: 1, related_artists: 0, artworks: 1, partner_shows: 1 },
        }
      },
    })
    expect(tree.root.findAllByType(ArtistArtworks)).toHaveLength(1)
    mockMostRecentOperation("ArtistBelowTheFoldQuery")
    expect(tree.root.findAllByType(ArtistAboutContainer)).toHaveLength(1)
    expect(tree.root.findAllByType(ArtistShows)).toHaveLength(1)
    expect(tree.root.findAllByType(ArtistInsights)).toHaveLength(0)
  })

  it("returns two tabs if artist has metadata, works, and shows when AROptionsNewArtistInsightsPage is true", async () => {
    __globalStoreTestUtils__?.injectFeatureFlags({ AROptionsNewArtistInsightsPage: true })
    const tree = renderWithWrappers(<TestWrapper />)
    mockMostRecentOperation("ArtistAboveTheFoldQuery", {
      Artist() {
        return {
          has_metadata: true,
          counts: { articles: 1, related_artists: 0, artworks: 1, partner_shows: 1 },
          auctionResultsConnection: {
            totalCount: 10,
          },
        }
      },
    })
    expect(tree.root.findAllByType(ArtistArtworks)).toHaveLength(1)
    mockMostRecentOperation("ArtistBelowTheFoldQuery")
    expect(tree.root.findAllByType(ArtistAboutContainer)).toHaveLength(1)
    expect(tree.root.findAllByType(ArtistShows)).toHaveLength(0)
    expect(tree.root.findAllByType(ArtistInsights)).toHaveLength(1)
  })

  it("Hide Artist insights tab when AROptionsNewArtistInsightsPage is true and there are no auction results", async () => {
    __globalStoreTestUtils__?.injectFeatureFlags({ AROptionsNewArtistInsightsPage: true })
    const tree = renderWithWrappers(<TestWrapper />)
    mockMostRecentOperation("ArtistAboveTheFoldQuery", {
      Artist() {
        return {
          has_metadata: true,
          counts: { articles: 1, related_artists: 0, artworks: 1, partner_shows: 1 },
          auctionResultsConnection: {
            totalCount: 0,
          },
        }
      },
    })
    expect(tree.root.findAllByType(ArtistArtworks)).toHaveLength(1)
    mockMostRecentOperation("ArtistBelowTheFoldQuery")
    expect(tree.root.findAllByType(ArtistAboutContainer)).toHaveLength(1)
    expect(tree.root.findAllByType(ArtistShows)).toHaveLength(0)
    expect(tree.root.findAllByType(ArtistInsights)).toHaveLength(0)
  })

  it("tracks a page view", () => {
    renderWithWrappers(<TestWrapper />)
    mockMostRecentOperation("ArtistAboveTheFoldQuery")

    expect(postEventToProviders).toHaveBeenCalledTimes(1)
    expect(postEventToProviders).toHaveBeenNthCalledWith(1, {
      context_screen: "Artist",
      context_screen_owner_id: '<mock-value-for-field-"internalID">',
      context_screen_owner_slug: '<mock-value-for-field-"slug">',
      context_screen_owner_type: "Artist",
    })
  })
})
