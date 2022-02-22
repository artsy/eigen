import { ActionType, ContextModule, OwnerType } from "@artsy/cohesion"
import { OldMyCollectionArtworkArtistAuctionResultsTestsQuery } from "__generated__/OldMyCollectionArtworkArtistAuctionResultsTestsQuery.graphql"
import { CaretButton } from "lib/Components/Buttons/CaretButton"
import { InfoButton } from "lib/Components/Buttons/InfoButton"
import OpaqueImageView from "lib/Components/OpaqueImageView/OpaqueImageView"
import { navigate } from "lib/navigation/navigate"
import { extractText } from "lib/tests/extractText"
import { mockTrackEvent } from "lib/tests/globallyMockedStuff"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import React from "react"
import { graphql, QueryRenderer } from "react-relay"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"
import { OldMyCollectionArtworkArtistAuctionResultsFragmentContainer } from "./OldMyCollectionArtworkArtistAuctionResults"

jest.unmock("react-relay")

describe("OldMyCollectionArtworkArtistAuctionResults", () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>
  const TestRenderer = () => (
    <QueryRenderer<OldMyCollectionArtworkArtistAuctionResultsTestsQuery>
      environment={mockEnvironment}
      query={graphql`
        query OldMyCollectionArtworkArtistAuctionResultsTestsQuery @relay_test_operation {
          artwork(id: "some-slug") {
            ...OldMyCollectionArtworkArtistAuctionResults_artwork
          }
        }
      `}
      variables={{}}
      render={({ props }) => {
        if (props?.artwork) {
          return (
            <OldMyCollectionArtworkArtistAuctionResultsFragmentContainer artwork={props.artwork} />
          )
        }
        return null
      }}
    />
  )

  beforeEach(() => {
    mockEnvironment = createMockEnvironment()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  const resolveData = (passedProps = {}) => {
    mockEnvironment.mock.resolveMostRecentOperation((operation) =>
      MockPayloadGenerator.generate(operation, passedProps)
    )
  }

  it("renders without throwing an error", () => {
    const wrapper = renderWithWrappers(<TestRenderer />)
    resolveData({
      Artist: () => ({
        name: "Banksy",
        auctionResultsConnection: {
          edges: [
            {
              node: {
                saleDate: "2020-10-07T00:00:00.000Z",
                priceRealized: {
                  centsUSD: 400,
                  display: "4.00",
                },
              },
            },
          ],
        },
      }),
    })
    expect(wrapper.root.findByType(OpaqueImageView)).toBeDefined()
    const text = extractText(wrapper.root)
    expect(text).toContain("Auction Results for Banksy")
    expect(text).toContain("title")
    expect(text).toContain("4.00")
    expect(text).toContain("Explore auction results")
  })

  it("navigates to all auction results when user taps auctions results items", () => {
    const wrapper = renderWithWrappers(<TestRenderer />)
    resolveData({
      Artwork: () => ({
        artist: {
          slug: "artist-slug",
        },
      }),
    })
    wrapper.root.findByProps({ testID: "AuctionsResultsButton" }).props.onPress()
    expect(navigate).toHaveBeenCalledWith("/artist/artist-slug/auction-results")
  })

  it("navigates to all auction results on press", () => {
    const wrapper = renderWithWrappers(<TestRenderer />)
    resolveData({
      Artwork: () => ({
        artist: {
          slug: "artist-slug",
        },
      }),
    })
    wrapper.root.findAllByType(CaretButton)[0].props.onPress()
    expect(navigate).toHaveBeenCalledWith("/artist/artist-slug/auction-results")
  })

  it("tracks analytics event when info button is tapped", () => {
    const wrapper = renderWithWrappers(<TestRenderer />)
    resolveData({
      Artwork: () => ({
        internalID: "artwork-id",
        slug: "artwork-slug",
      }),
    })
    wrapper.root.findByType(InfoButton).props.onPress()

    expect(mockTrackEvent).toHaveBeenCalledTimes(1)
    expect(mockTrackEvent.mock.calls[0]).toMatchInlineSnapshot(`
      Array [
        Object {
          "action": "tappedInfoBubble",
          "context_module": "auctionResults",
          "context_screen_owner_id": "artwork-id",
          "context_screen_owner_slug": "artwork-slug",
          "context_screen_owner_type": "myCollectionArtwork",
          "subject": "auctionResults",
        },
      ]
    `)
  })

  it("tracks analytics event when `Explore Auction Results` is tapped", () => {
    const wrapper = renderWithWrappers(<TestRenderer />)
    resolveData({
      Artwork: () => ({
        internalID: "artwork-id",
        slug: "artwork-slug",
      }),
    })
    wrapper.root.findByType(CaretButton).props.onPress()

    expect(mockTrackEvent).toHaveBeenCalledTimes(1)
    expect(mockTrackEvent).toHaveBeenCalledWith({
      action: ActionType.tappedShowMore,
      context_module: ContextModule.auctionResults,
      context_screen_owner_type: OwnerType.myCollectionArtwork,
      context_screen_owner_id: "artwork-id",
      context_screen_owner_slug: "artwork-slug",
      subject: "Explore auction results",
    })
  })
})
