import { ArtistAboutContainer } from "app/Components/Artist/ArtistAbout/ArtistAbout"
import ArtistArtworks from "app/Components/Artist/ArtistArtworks/ArtistArtworks"
import { ArtistHeaderFragmentContainer } from "app/Components/Artist/ArtistHeader"
import { ArtistInsights } from "app/Components/Artist/ArtistInsights/ArtistInsights"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { extractText } from "app/tests/extractText"
import { renderWithWrappers } from "app/tests/renderWithWrappers"
import { postEventToProviders } from "app/utils/track/providers"
import _ from "lodash"
import React from "react"
import "react-native"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"
import { MockResolvers } from "relay-test-utils/lib/RelayMockPayloadGenerator"
import { ArtistQueryRenderer } from "./Artist"

jest.unmock("react-relay")
jest.unmock("react-tracking")

type ArtistQueries = "ArtistAboveTheFoldQuery" | "ArtistBelowTheFoldQuery"

describe("availableTabs", () => {
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

  const TestWrapper = (props: Record<string, any>) => (
    <ArtistQueryRenderer artistID="ignored" environment={environment} {...props} />
  )

  it("returns an empty state if artist has no metadata, shows, insights, or works", async () => {
    const tree = renderWithWrappers(<TestWrapper />)
    mockMostRecentOperation("ArtistAboveTheFoldQuery", {
      Artist() {
        return {
          has_metadata: false,
          counts: { related_artists: 0, partner_shows: 0 },
          statuses: {
            artworks: false,
            auctionLots: false,
            articles: false,
          },
        }
      },
    })
    expect(tree.root.findAllByType(ArtistHeaderFragmentContainer)).toHaveLength(1)
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
          counts: { related_artists: 0, partner_shows: 0 },
          statuses: {
            artworks: false,
            auctionLots: false,
            articles: false,
          },
          auctionResultsConnection: {
            totalCount: 0,
          },
        }
      },
    })
    expect(tree.root.findAllByType(ArtistHeaderFragmentContainer)).toHaveLength(1)
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
          counts: { related_artists: 0, partner_shows: 0 },
          statuses: {
            artworks: false,
            auctionLots: false,
            articles: true,
          },
          auctionResultsConnection: {
            totalCount: 0,
          },
        }
      },
    })
    mockMostRecentOperation("ArtistBelowTheFoldQuery")
    expect(tree.root.findAllByType(ArtistAboutContainer)).toHaveLength(1)
  })

  it("returns three tabs if artist has metadata, works, and auction results", async () => {
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
    expect(tree.root.findAllByType(ArtistInsights)).toHaveLength(1)
  })

  it("hides Artist insights tab when there are no auction results", async () => {
    const tree = renderWithWrappers(<TestWrapper />)
    mockMostRecentOperation("ArtistAboveTheFoldQuery", {
      Artist() {
        return {
          has_metadata: true,
          statuses: {
            artworks: true,
            auctionLots: false,
          },
          auctionResultsConnection: {
            totalCount: 0,
          },
        }
      },
    })
    expect(tree.root.findAllByType(ArtistArtworks)).toHaveLength(1)
    mockMostRecentOperation("ArtistBelowTheFoldQuery")
    expect(tree.root.findAllByType(ArtistAboutContainer)).toHaveLength(1)
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
