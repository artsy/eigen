import {
  ArtworkFromLiveAuctionRegistrationClosed,
  ArtworkFromLiveAuctionRegistrationOpen,
  NotRegisteredToBid,
  RegisteredBidder,
} from "lib/__fixtures__/ArtworkBidAction"
import { ArtworkFixture } from "lib/__fixtures__/ArtworkFixture"
import { Countdown } from "lib/Components/Bidding/Components/Timer"
import { ArtistSeriesMoreSeries } from "lib/Scenes/ArtistSeries/ArtistSeriesMoreSeries"
import { extractText } from "lib/tests/extractText"
import { flushPromiseQueue } from "lib/tests/flushPromiseQueue"
import { componentWithWrappers, renderWithWrappers } from "lib/tests/renderWithWrappers"
import { merge } from "lodash"
import _ from "lodash"
import React, { Suspense } from "react"
import { ActivityIndicator, NativeModules } from "react-native"
import { useTracking } from "react-tracking"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"
import { MockResolvers } from "relay-test-utils/lib/RelayMockPayloadGenerator"
import { Artwork, ArtworkQueryRenderer } from "../Artwork"
import { ArtworkDetails } from "../Components/ArtworkDetails"
import { ArtworksInSeriesRail } from "../Components/ArtworksInSeriesRail"
import { BidButton } from "../Components/CommercialButtons/BidButton"
import { CommercialInformation } from "../Components/CommercialInformation"
import { CommercialPartnerInformation } from "../Components/CommercialPartnerInformation"
import { ContextCard } from "../Components/ContextCard"
import { ImageCarousel } from "../Components/ImageCarousel/ImageCarousel"
import { OtherWorksFragmentContainer } from "../Components/OtherWorks/OtherWorks"

type ArtworkQueries =
  | "ArtworkAboveTheFoldQuery"
  | "ArtworkBelowTheFoldQuery"
  | "ArtworkMarkAsRecentlyViewedQuery"
  | "ArtworkRefetchQuery"

const trackEvent = jest.fn()

jest.unmock("react-relay")

jest.mock("lib/relay/createEnvironment", () => ({
  defaultEnvironment: require("relay-test-utils").createMockEnvironment(),
  reset(this: { defaultEnvironment: any }) {
    this.defaultEnvironment = require("relay-test-utils").createMockEnvironment()
  },
}))

jest.mock("lib/Components/Bidding/Context/TimeOffsetProvider", () => {
  class TimeOffsetProvider extends require("react").Component {
    static childContextTypes = {
      timeOffsetInMilliSeconds: () => true,
    }

    getChildContext() {
      return {
        timeOffsetInMilliSeconds: 0,
      }
    }

    render() {
      return this.props.children
    }
  }
  return { TimeOffsetProvider }
})

describe("Artwork", () => {
  let environment: ReturnType<typeof createMockEnvironment>

  function mockMostRecentOperation(name: ArtworkQueries, mockResolvers: MockResolvers = {}) {
    expect(environment.mock.getMostRecentOperation().request.node.operation.name).toBe(name)
    environment.mock.resolveMostRecentOperation(operation => {
      const result = MockPayloadGenerator.generate(operation, {
        ID({ path }) {
          // need to make sure the artwork has a stable ID between Above and Below queries otherwise bad cache behaviour
          if (_.isEqual(path, ["artwork", "id"])) {
            return "artwork-id"
          }
        },
        ...mockResolvers,
      })
      return result
    })
  }
  const TestRenderer = ({ isVisible = true }) => (
    // not 100% sure why we need a suspense fallback here but I guess new relay (v9) containers
    // use suspense and one of the containers in our tree is suspending itself only in tests :|
    <Suspense fallback={() => null}>
      <ArtworkQueryRenderer
        isVisible={isVisible}
        artworkID="ignored"
        environment={environment}
        tracking={{ trackEvent: jest.fn() } as any}
      />
    </Suspense>
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

  it("renders above the fold content before the full query has been resolved", async () => {
    const tree = renderWithWrappers(<TestRenderer />)
    mockMostRecentOperation("ArtworkAboveTheFoldQuery")
    expect(tree.root.findAllByType(ImageCarousel)).toHaveLength(1)
    expect(tree.root.findAllByType(CommercialInformation)).toHaveLength(1)
    expect(tree.root.findAllByType(ActivityIndicator)).toHaveLength(1)
    expect(tree.root.findAllByType(ArtworkDetails)).toHaveLength(0)
  })

  it("renders all content after the full query has been resolved", async () => {
    const tree = renderWithWrappers(<TestRenderer />)
    mockMostRecentOperation("ArtworkAboveTheFoldQuery")
    mockMostRecentOperation("ArtworkMarkAsRecentlyViewedQuery")
    mockMostRecentOperation("ArtworkBelowTheFoldQuery")
    await flushPromiseQueue()
    expect(tree.root.findAllByType(ImageCarousel)).toHaveLength(1)
    expect(tree.root.findAllByType(CommercialInformation)).toHaveLength(1)
    expect(tree.root.findAllByType(ActivityIndicator)).toHaveLength(0)
    expect(tree.root.findAllByType(ArtworkDetails)).toHaveLength(1)
  })

  describe("artist series components", () => {
    it("renders with the feature flag enabled and artist series to show", async () => {
      NativeModules.Emission.options.AROptionsArtistSeries = true
      const tree = renderWithWrappers(<TestRenderer />)
      mockMostRecentOperation("ArtworkAboveTheFoldQuery")
      mockMostRecentOperation("ArtworkMarkAsRecentlyViewedQuery")
      mockMostRecentOperation("ArtworkBelowTheFoldQuery", {
        Artwork() {
          return {
            artist: {
              artistSeriesConnection: {
                totalCount: 5,
              },
            },
          }
        },
      })
      await flushPromiseQueue()
      expect(tree.root.findAllByType(ArtistSeriesMoreSeries)).toHaveLength(1)
      expect(tree.root.findAllByType(ArtworksInSeriesRail)).toHaveLength(1)
    })

    it("does not render with the feature flag disabled", async () => {
      NativeModules.Emission.options.AROptionsArtistSeries = false
      const tree = renderWithWrappers(<TestRenderer />)
      mockMostRecentOperation("ArtworkAboveTheFoldQuery")
      mockMostRecentOperation("ArtworkMarkAsRecentlyViewedQuery")
      mockMostRecentOperation("ArtworkBelowTheFoldQuery", {
        Artwork() {
          return {
            artist: {
              artistSeriesConnection: {
                totalCount: 5,
              },
            },
          }
        },
      })
      await flushPromiseQueue()
      expect(tree.root.findAllByType(ArtistSeriesMoreSeries)).toHaveLength(0)
      expect(tree.root.findAllByType(ArtworksInSeriesRail)).toHaveLength(0)
    })

    it("does not render when there are no artist series to show", async () => {
      NativeModules.Emission.options.AROptionsArtistSeries = true
      const tree = renderWithWrappers(<TestRenderer />)
      mockMostRecentOperation("ArtworkAboveTheFoldQuery")
      mockMostRecentOperation("ArtworkMarkAsRecentlyViewedQuery")
      mockMostRecentOperation("ArtworkBelowTheFoldQuery", {
        Artwork() {
          return {
            artist: {
              artistSeriesConnection: {
                totalCount: 0,
              },
            },
            artistSeriesConnection: {
              edges: [],
            },
          }
        },
      })
      await flushPromiseQueue()
      expect(tree.root.findAllByType(ArtistSeriesMoreSeries)).toHaveLength(0)
      expect(tree.root.findAllByType(ArtworksInSeriesRail)).toHaveLength(0)
    })
  })

  it("renders the ArtworkDetails component when conditionDescription is null but canRequestLotConditionsReport is true", async () => {
    const tree = renderWithWrappers(<TestRenderer />)
    mockMostRecentOperation("ArtworkAboveTheFoldQuery")
    mockMostRecentOperation("ArtworkMarkAsRecentlyViewedQuery")
    mockMostRecentOperation("ArtworkBelowTheFoldQuery", {
      Artwork() {
        return {
          category: null,
          canRequestLotConditionsReport: true,
          conditionDescription: null,
          signature: null,
          signatureInfo: null,
          certificateOfAuthenticity: null,
          framed: null,
          series: null,
          publisher: null,
          manufacturer: null,
          image_rights: null,
        }
      },
    })
    await flushPromiseQueue()
    expect(tree.root.findAllByType(ArtworkDetails)).toHaveLength(1)
  })

  it("marks the artwork as viewed", () => {
    renderWithWrappers(<TestRenderer />)
    const slug = "test artwork id"

    mockMostRecentOperation("ArtworkAboveTheFoldQuery", {
      Artwork() {
        return { slug }
      },
    })

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

  it("refetches on re-appear", async () => {
    const tree = renderWithWrappers(<TestRenderer />)

    mockMostRecentOperation("ArtworkAboveTheFoldQuery")
    mockMostRecentOperation("ArtworkMarkAsRecentlyViewedQuery")
    mockMostRecentOperation("ArtworkBelowTheFoldQuery")

    expect(environment.mock.getAllOperations()).toHaveLength(0)

    tree.update(componentWithWrappers(<TestRenderer isVisible={false} />))
    tree.update(componentWithWrappers(<TestRenderer isVisible={true} />))

    mockMostRecentOperation("ArtworkRefetchQuery")
    await flushPromiseQueue()
    mockMostRecentOperation("ArtworkMarkAsRecentlyViewedQuery")
  })

  it("updates the above-the-fold content on re-appear", async () => {
    const tree = renderWithWrappers(<TestRenderer />)

    mockMostRecentOperation("ArtworkAboveTheFoldQuery", {
      Artwork() {
        return { slug: "my-special-artwork" }
      },
    })
    expect(tree.root.findByType(Artwork).props.artworkAboveTheFold.slug).toBe("my-special-artwork")

    mockMostRecentOperation("ArtworkMarkAsRecentlyViewedQuery")
    mockMostRecentOperation("ArtworkBelowTheFoldQuery", {
      Artwork() {
        return { slug: "my-special-artwork" }
      },
    })

    tree.update(componentWithWrappers(<TestRenderer isVisible={false} />))
    tree.update(componentWithWrappers(<TestRenderer isVisible={true} />))

    mockMostRecentOperation("ArtworkRefetchQuery", {
      Artwork() {
        return { slug: "completely-different-slug" }
      },
    })

    await flushPromiseQueue()

    expect(environment.mock.getMostRecentOperation()).toMatchObject({
      request: {
        node: {
          operation: {
            name: "ArtworkMarkAsRecentlyViewedQuery",
          },
        },
        variables: {
          input: {
            artwork_id: "completely-different-slug",
          },
        },
      },
    })
    mockMostRecentOperation("ArtworkMarkAsRecentlyViewedQuery")

    expect(tree.root.findByType(Artwork).props.artworkAboveTheFold.slug).toBe("completely-different-slug")
  })

  it("does not show a contextCard if the work is in a non-auction sale", async () => {
    const tree = renderWithWrappers(<TestRenderer />)

    mockMostRecentOperation("ArtworkAboveTheFoldQuery")
    mockMostRecentOperation("ArtworkMarkAsRecentlyViewedQuery")
    mockMostRecentOperation("ArtworkBelowTheFoldQuery", {
      Sale() {
        return {
          isAuction: false,
        }
      },
    })
    await flushPromiseQueue()

    expect(tree.root.findAllByType(ContextCard)).toHaveLength(0)
    expect(tree.root.findAllByType(OtherWorksFragmentContainer)).toHaveLength(1)
  })

  it("does show a contextCard if the work is in an auction", async () => {
    const tree = renderWithWrappers(<TestRenderer />)

    mockMostRecentOperation("ArtworkAboveTheFoldQuery")
    mockMostRecentOperation("ArtworkMarkAsRecentlyViewedQuery")
    mockMostRecentOperation("ArtworkBelowTheFoldQuery", {
      Sale() {
        return {
          isAuction: true,
        }
      },
    })

    await flushPromiseQueue()

    expect(tree.root.findAllByType(ContextCard)).toHaveLength(1)
  })

  describe("Live Auction States", () => {
    describe("has the correct state for a work that is in an auction that is currently live", () => {
      it("for which I am registered", () => {
        const tree = renderWithWrappers(<TestRenderer />)

        mockMostRecentOperation("ArtworkAboveTheFoldQuery", {
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
        const tree = renderWithWrappers(<TestRenderer />)

        mockMostRecentOperation("ArtworkAboveTheFoldQuery", {
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
        const tree = renderWithWrappers(<TestRenderer />)

        mockMostRecentOperation("ArtworkAboveTheFoldQuery", {
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
