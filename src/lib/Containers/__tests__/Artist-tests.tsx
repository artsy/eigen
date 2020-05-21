import { ArtistAboutContainer } from "lib/Components/Artist/ArtistAbout"
import { ArtistArtworksContainer } from "lib/Components/Artist/ArtistArtworks"
import { ArtistHeaderContainer } from "lib/Components/Artist/ArtistHeader"
import { ArtistShowsContainer } from "lib/Components/Artist/ArtistShows"
import { StickyTab } from "lib/Components/StickyTabPage/StickyTabPageTabBar"
import _ from "lodash"
import React from "react"
import "react-native"
import { create } from "react-test-renderer"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"
import { MockResolvers } from "relay-test-utils/lib/RelayMockPayloadGenerator"
import { ArtistQueryRenderer } from "../Artist"

jest.unmock("react-relay")
jest.unmock("react-tracking")

jest.mock("lib/NativeModules/Events", () => ({
  postEvent: jest.fn(),
}))

type ArtistQueries = "ArtistAboveTheFoldQuery" | "ArtistBelowTheFoldQuery"

describe("availableTabs", () => {
  let environment = createMockEnvironment()
  const postEvent = require("lib/NativeModules/Events").postEvent as jest.Mock
  beforeEach(() => {
    environment = createMockEnvironment()
    postEvent.mockClear()
  })

  function mockMostRecentOperation(name: ArtistQueries, mockResolvers: MockResolvers = {}) {
    expect(environment.mock.getMostRecentOperation().request.node.operation.name).toBe(name)
    environment.mock.resolveMostRecentOperation(operation => {
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

  it("returns nothing if artist has no metadata, shows, or works", async () => {
    const tree = create(<TestWrapper />)
    mockMostRecentOperation("ArtistAboveTheFoldQuery", {
      Artist() {
        return {
          has_metadata: false,
          counts: { articles: 0, related_artists: 0, artworks: 0, partner_shows: 0 },
        }
      },
    })
    expect(tree.root.findAllByType(ArtistHeaderContainer)).toHaveLength(1)
    expect(tree.root.findAllByType(StickyTab)).toHaveLength(0)
  })

  it("returns About tab if artist has metadata", async () => {
    const tree = create(<TestWrapper />)
    mockMostRecentOperation("ArtistAboveTheFoldQuery", {
      Artist() {
        return {
          has_metadata: true,
          counts: { articles: 0, related_artists: 0, artworks: 0, partner_shows: 0 },
        }
      },
    })
    expect(tree.root.findAllByType(ArtistHeaderContainer)).toHaveLength(1)
    expect(tree.root.findAllByType(StickyTab)).toHaveLength(1)
    expect(tree.root.findAllByType(ArtistAboutContainer)).toHaveLength(0)
    // it only shows below the fold
    mockMostRecentOperation("ArtistBelowTheFoldQuery")
    expect(tree.root.findAllByType(ArtistAboutContainer)).toHaveLength(1)
  })

  it("returns About tab if artist has articles", async () => {
    const tree = create(<TestWrapper />)
    mockMostRecentOperation("ArtistAboveTheFoldQuery", {
      Artist() {
        return {
          has_metadata: false,
          counts: { articles: 1, related_artists: 0, artworks: 0, partner_shows: 0 },
        }
      },
    })
    mockMostRecentOperation("ArtistBelowTheFoldQuery")
    expect(tree.root.findAllByType(ArtistAboutContainer)).toHaveLength(1)
  })

  it("returns Shows tab if artist has shows", async () => {
    const tree = create(<TestWrapper />)
    mockMostRecentOperation("ArtistAboveTheFoldQuery", {
      Artist() {
        return {
          has_metadata: false,
          counts: { articles: 0, related_artists: 0, artworks: 0, partner_shows: 1 },
        }
      },
    })
    mockMostRecentOperation("ArtistBelowTheFoldQuery")
    expect(tree.root.findAllByType(ArtistShowsContainer)).toHaveLength(1)
  })

  it("returns all three tabs if artist has metadata, works, and shows", async () => {
    const tree = create(<TestWrapper />)
    mockMostRecentOperation("ArtistAboveTheFoldQuery", {
      Artist() {
        return {
          has_metadata: true,
          counts: { articles: 1, related_artists: 0, artworks: 1, partner_shows: 1 },
        }
      },
    })
    expect(tree.root.findAllByType(ArtistArtworksContainer)).toHaveLength(1)
    mockMostRecentOperation("ArtistBelowTheFoldQuery")
    expect(tree.root.findAllByType(ArtistAboutContainer)).toHaveLength(1)
    expect(tree.root.findAllByType(ArtistShowsContainer)).toHaveLength(1)
  })

  it("tracks a page view", () => {
    create(<TestWrapper />)
    mockMostRecentOperation("ArtistAboveTheFoldQuery")
    expect(postEvent).toHaveBeenCalledTimes(1)
    expect(postEvent.mock.calls[0][0]).toMatchInlineSnapshot(`
      Object {
        "context_screen": "Artist",
        "context_screen_owner_id": "<mock-value-for-field-\\"internalID\\">",
        "context_screen_owner_slug": "<mock-value-for-field-\\"slug\\">",
        "context_screen_owner_type": "Artist",
      }
    `)
  })
})
