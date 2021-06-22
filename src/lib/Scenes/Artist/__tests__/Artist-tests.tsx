import ArtistArtworks from "lib/Components/Artist/ArtistArtworks/ArtistArtworks"
import { SavedSearchBanner } from "lib/Components/Artist/ArtistArtworks/SavedSearchBanner"
import { ArtistHeaderFragmentContainer } from "lib/Components/Artist/ArtistHeader"
import { ArtistInsights } from "lib/Components/Artist/ArtistInsights/ArtistInsights"
import { CurrentOption } from "lib/Components/ArtworkFilter"
import { StickyTab } from "lib/Components/StickyTabPage/StickyTabPageTabBar"
import { __globalStoreTestUtils__ } from "lib/store/GlobalStore"
import { extractText } from "lib/tests/extractText"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import { postEventToProviders } from "lib/utils/track/providers"
import _ from "lodash"
import { TouchableHighlightColor } from "palette"
import React from "react"
import "react-native"
import { act } from "react-test-renderer"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"
import { MockResolvers } from "relay-test-utils/lib/RelayMockPayloadGenerator"
import { ArtistAboutContainer } from "../../../Components/Artist/ArtistAbout/ArtistAbout"
import { ArtistQueryRenderer, NotificationPayload } from "../Artist"

jest.unmock("react-relay")
jest.unmock("react-tracking")
jest.unmock("lib/Components/Artist/ArtistArtworks/ArtistArtworks.tsx")

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

  const TestWrapper = (props: Record<string, any>) => {
    return <ArtistQueryRenderer artistID="ignored" environment={environment} {...props} />
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

  describe("Saved Search", () => {
    const getWrapper = (notificationPayload?: NotificationPayload) => {
      const tree = renderWithWrappers(<TestWrapper notificationPayload={notificationPayload} />)

      mockMostRecentOperation("ArtistAboveTheFoldQuery", {
        Artist() {
          return {
            has_metadata: true,
            counts: { articles: 0, related_artists: 0, artworks: 1, partner_shows: 0 },
            auctionResultsConnection: {
              totalCount: 0,
            },
          }
        },
      })

      return tree
    }

    it("should not render banner when criteria attributes passed and AREnableSavedSearch flag set to false", () => {
      __globalStoreTestUtils__?.injectFeatureFlags({ AREnableSavedSearch: false })

      const tree = getWrapper({
        searchCriteriaID: "search-criteria-id",
        searchCriteriaAttributes: {
          attributionClass: ["limited edition", "open edition"],
        },
      })

      expect(tree.root.findAllByType(SavedSearchBanner)).toHaveLength(0)
    })

    it("should not render banner when criteria attributes not passed and AREnableSavedSearch flag set to true", () => {
      __globalStoreTestUtils__?.injectFeatureFlags({ AREnableSavedSearch: true })

      const tree = getWrapper()

      expect(tree.root.findAllByType(SavedSearchBanner)).toHaveLength(0)
    })

    it("should render banner when criteria attributes passed and AREnableSavedSearch flag set to true", () => {
      __globalStoreTestUtils__?.injectFeatureFlags({ AREnableSavedSearch: true })

      const tree = getWrapper({
        searchCriteriaID: "search-criteria-id",
        searchCriteriaAttributes: {
          attributionClass: ["limited edition", "open edition"],
        },
      })

      expect(tree.root.findAllByType(SavedSearchBanner)).toHaveLength(1)
    })

    it("should convert the criteria attributes to the filter params format", () => {
      const tree = getWrapper({
        searchCriteriaID: "search-criteria-id",
        searchCriteriaAttributes: {
          attributionClass: ["limited edition", "open edition"],
          acquireable: true,
          inquireableOnly: true,
        },
      })

      act(() => tree.root.findByType(TouchableHighlightColor).props.onPress())

      const filterTextValues = tree.root.findAllByType(CurrentOption).map(extractText)

      expect(filterTextValues).toContain("Buy now, Inquire")
      expect(filterTextValues).toContain("Limited Edition, Open Edition")
    })

    it("should call refetch with the passed criteria attribute variables", () => {
      getWrapper({
        searchCriteriaID: "search-criteria-id",
        searchCriteriaAttributes: {
          attributionClass: ["limited edition", "open edition"],
          acquireable: true,
          inquireableOnly: true,
        },
      })

      const operation = environment.mock.getMostRecentOperation()

      expect(operation.request.node.operation.name).toEqual("ArtistArtworksQuery")
      expect(operation.request.variables).toEqual({
        count: 10,
        cursor: null,
        id: "artist-id",
        input: {
          acquireable: true,
          atAuction: false,
          attributionClass: ["limited edition", "open edition"],
          dimensionRange: "*-*",
          includeArtworksByFollowedArtists: false,
          inquireableOnly: true,
          medium: "*",
          offerable: false,
          priceRange: "*-*",
          sort: "-decayed_merch",
        },
      })
    })
  })
})
