import { Theme } from "@artsy/palette"
import { ArtworkTestsQuery } from "__generated__/ArtworkTestsQuery.graphql"
import {
  ArtworkFromLiveAuctionRegistrationClosed,
  ArtworkFromLiveAuctionRegistrationOpen,
  NotRegisteredToBid,
  RegisteredBidder,
} from "lib/__fixtures__/ArtworkBidAction"
import { ArtworkFixture } from "lib/__fixtures__/ArtworkFixture"
import { Countdown } from "lib/Components/Bidding/Components/Timer"
import { extractText } from "lib/tests/extractText"
import { flushPromiseQueue } from "lib/tests/flushPromiseQueue"
import { ProvidePlaceholderContext } from "lib/utils/placeholders"
import { merge } from "lodash"
import React from "react"
import { ActivityIndicator } from "react-native"
import { graphql, QueryRenderer } from "react-relay"
import ReactTestRenderer from "react-test-renderer"
import { useTracking } from "react-tracking"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"
import { MockResolvers } from "relay-test-utils/lib/RelayMockPayloadGenerator"
import { ArtworkContainer } from "../Artwork"
import { ArtworkDetails } from "../Components/ArtworkDetails"
import { BidButton } from "../Components/CommercialButtons/BidButton"
import { CommercialInformation } from "../Components/CommercialInformation"
import { CommercialPartnerInformation } from "../Components/CommercialPartnerInformation"
import { ContextCard } from "../Components/ContextCard"
import { ImageCarousel } from "../Components/ImageCarousel/ImageCarousel"
import { OtherWorksFragmentContainer } from "../Components/OtherWorks/OtherWorks"

type ArtworkQueries = "ArtworkTestsQuery" | "ArtworkFullQuery" | "ArtworkMarkAsRecentlyViewedQuery"

const trackEvent = jest.fn()

jest.unmock("react-relay")

describe("Artwork", () => {
  let environment: ReturnType<typeof createMockEnvironment>
  function mockMostRecentOperation(name: ArtworkQueries, mockResolvers: MockResolvers = {}) {
    expect(environment.mock.getMostRecentOperation().request.node.operation.name).toBe(name)
    environment.mock.resolveMostRecentOperation(operation => MockPayloadGenerator.generate(operation, mockResolvers))
  }
  const TestRenderer = ({ isVisible = true }) => (
    <Theme>
      <ProvidePlaceholderContext>
        <QueryRenderer<ArtworkTestsQuery>
          environment={environment}
          query={graphql`
            query ArtworkTestsQuery @relay_test_operation {
              artwork(id: "doesn't matter") {
                ...Artwork_artworkAboveTheFold
              }
            }
          `}
          variables={{ hello: true }}
          render={({ props, error }) => {
            if (props) {
              return <ArtworkContainer artworkAboveTheFold={props.artwork} isVisible={isVisible} />
            } else if (error) {
              console.log(error)
            }
          }}
        />
      </ProvidePlaceholderContext>
    </Theme>
  )

  beforeEach(() => {
    environment = createMockEnvironment()
    ;(useTracking as jest.Mock).mockImplementation(() => {
      return {
        trackEvent,
      }
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it("renders above the fold content before the full query has been resolved", () => {
    const tree = ReactTestRenderer.create(<TestRenderer />)
    mockMostRecentOperation("ArtworkTestsQuery")
    expect(tree.root.findAllByType(ImageCarousel)).toHaveLength(1)
    expect(tree.root.findAllByType(CommercialInformation)).toHaveLength(1)
    expect(tree.root.findAllByType(ActivityIndicator)).toHaveLength(1)
    expect(tree.root.findAllByType(ArtworkDetails)).toHaveLength(0)
  })

  it("renders all content after the full query has been resolved", async () => {
    const tree = ReactTestRenderer.create(<TestRenderer />)
    mockMostRecentOperation("ArtworkTestsQuery")
    mockMostRecentOperation("ArtworkFullQuery")
    mockMostRecentOperation("ArtworkMarkAsRecentlyViewedQuery")
    await flushPromiseQueue()
    expect(tree.root.findAllByType(ImageCarousel)).toHaveLength(1)
    expect(tree.root.findAllByType(CommercialInformation)).toHaveLength(1)
    expect(tree.root.findAllByType(ActivityIndicator)).toHaveLength(0)
    expect(tree.root.findAllByType(ArtworkDetails)).toHaveLength(1)
  })

  it("marks the artwork as viewed", () => {
    ReactTestRenderer.create(<TestRenderer />)
    const slug = "test artwork id"

    mockMostRecentOperation("ArtworkTestsQuery", {
      Artwork() {
        return { slug }
      },
    })

    mockMostRecentOperation("ArtworkFullQuery")

    expect(environment.mock.getMostRecentOperation()).toMatchObject({
      request: {
        variables: {
          input: {
            artwork_id: slug,
          },
        },
      },
    })
  })

  it("refetches on re-appear", () => {
    const tree = ReactTestRenderer.create(<TestRenderer />)

    mockMostRecentOperation("ArtworkTestsQuery")
    mockMostRecentOperation("ArtworkFullQuery")
    mockMostRecentOperation("ArtworkMarkAsRecentlyViewedQuery")

    expect(environment.mock.getAllOperations()).toHaveLength(0)

    tree.update(<TestRenderer isVisible={false} />)
    tree.update(<TestRenderer isVisible={true} />)

    expect(environment.mock.getAllOperations()).toHaveLength(2)

    expect(environment.mock.getAllOperations().map(op => op.request.node.operation.name)).toEqual([
      "ArtworkFullQuery", // refetch full data
      "ArtworkMarkAsRecentlyViewedQuery", // retrigger recently viewed
    ])
  })

  it("does not show a contextCard if the work is in a non-auction sale", async () => {
    const tree = ReactTestRenderer.create(<TestRenderer />)

    mockMostRecentOperation("ArtworkTestsQuery")
    mockMostRecentOperation("ArtworkFullQuery", {
      Sale() {
        return {
          isAuction: false,
        }
      },
    })
    mockMostRecentOperation("ArtworkMarkAsRecentlyViewedQuery")
    await flushPromiseQueue()

    expect(tree.root.findAllByType(ContextCard)).toHaveLength(0)
    expect(tree.root.findAllByType(OtherWorksFragmentContainer)).toHaveLength(1)
  })

  it("does show a contextCard if the work is in an auction", async () => {
    const tree = ReactTestRenderer.create(<TestRenderer />)

    mockMostRecentOperation("ArtworkTestsQuery")
    mockMostRecentOperation("ArtworkFullQuery", {
      Sale() {
        return {
          isAuction: true,
        }
      },
    })
    mockMostRecentOperation("ArtworkMarkAsRecentlyViewedQuery")

    await flushPromiseQueue()

    expect(tree.root.findAllByType(ContextCard)).toHaveLength(1)
  })

  describe("Live Auction States", () => {
    describe("has the correct state for a work that is in an auction that is currently live", () => {
      it("for which I am registered", () => {
        const tree = ReactTestRenderer.create(<TestRenderer />)

        mockMostRecentOperation("ArtworkTestsQuery", {
          Artwork() {
            return merge({}, ArtworkFixture, ArtworkFromLiveAuctionRegistrationClosed, RegisteredBidder)
          },
        })

        expect(tree.root.findAllByType(CommercialPartnerInformation)).toHaveLength(0)
        expect(tree.root.findAllByType(Countdown)).toHaveLength(1)
        expect(tree.root.findByType(Countdown).props.label).toBe("In progress")
        expect(extractText(tree.root.findByType(BidButton))).toContain("Enter live bidding")
      })

      it("for which I am not registered and registration is open", () => {
        const tree = ReactTestRenderer.create(<TestRenderer />)

        mockMostRecentOperation("ArtworkTestsQuery", {
          Artwork() {
            return merge({}, ArtworkFixture, ArtworkFromLiveAuctionRegistrationClosed, NotRegisteredToBid)
          },
        })

        expect(tree.root.findAllByType(CommercialPartnerInformation)).toHaveLength(0)
        expect(tree.root.findAllByType(Countdown)).toHaveLength(1)
        expect(tree.root.findByType(Countdown).props.label).toBe("In progress")
        expect(extractText(tree.root.findByType(BidButton))).toContain("Registration closed")
        expect(extractText(tree.root.findByType(BidButton))).toContain("Watch live bidding")
      })

      it("for which I am not registered and registration is closed", () => {
        const tree = ReactTestRenderer.create(<TestRenderer />)

        mockMostRecentOperation("ArtworkTestsQuery", {
          Artwork() {
            return merge({}, ArtworkFixture, ArtworkFromLiveAuctionRegistrationOpen, NotRegisteredToBid)
          },
        })

        expect(tree.root.findAllByType(CommercialPartnerInformation)).toHaveLength(0)
        expect(tree.root.findAllByType(Countdown)).toHaveLength(1)
        expect(tree.root.findByType(Countdown).props.label).toBe("In progress")
        expect(extractText(tree.root.findByType(Countdown))).toContain("00d  00h  00m  00s")
        expect(extractText(tree.root.findByType(BidButton))).toContain("Enter live bidding")
      })
    })
  })
})
