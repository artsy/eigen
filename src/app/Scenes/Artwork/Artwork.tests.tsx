import { fireEvent } from "@testing-library/react-native"
import {
  ArtworkFromLiveAuctionRegistrationClosed,
  ArtworkFromLiveAuctionRegistrationOpen,
  NotRegisteredToBid,
  RegisteredBidder,
} from "app/__fixtures__/ArtworkBidAction"
import { ArtworkFixture } from "app/__fixtures__/ArtworkFixture"
import { Countdown } from "app/Components/Bidding/Components/Timer"
import { ModalStack } from "app/navigation/ModalStack"
import { navigationEvents } from "app/navigation/navigate"
import { navigateToPartner } from "app/navigation/navigate"
import { ArtistSeriesListItem } from "app/Scenes/ArtistSeries/ArtistSeriesListItem"
import { ArtistSeriesMoreSeries } from "app/Scenes/ArtistSeries/ArtistSeriesMoreSeries"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { extractText } from "app/tests/extractText"
import { flushPromiseQueue } from "app/tests/flushPromiseQueue"
import { mockTrackEvent } from "app/tests/globallyMockedStuff"
import { renderWithWrappers, renderWithWrappersTL } from "app/tests/renderWithWrappers"
import { merge } from "lodash"
import _ from "lodash"
import { Touchable } from "palette"
import React, { Suspense } from "react"
import { ActivityIndicator } from "react-native"
import { act } from "react-test-renderer"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"
import { MockResolvers } from "relay-test-utils/lib/RelayMockPayloadGenerator"
import { Artwork, ArtworkQueryRenderer } from "./Artwork"
import { ArtworkDetails } from "./Components/ArtworkDetails"
import { ArtworksInSeriesRail } from "./Components/ArtworksInSeriesRail"
import { BidButton } from "./Components/CommercialButtons/BidButton"
import { CommercialInformation } from "./Components/CommercialInformation"
import { CommercialPartnerInformation } from "./Components/CommercialPartnerInformation"
import { ContextCard } from "./Components/ContextCard"
import { ImageCarousel } from "./Components/ImageCarousel/ImageCarousel"
import { OtherWorksFragmentContainer } from "./Components/OtherWorks/OtherWorks"
import { Questions } from "./Components/Questions"

type ArtworkQueries =
  | "ArtworkAboveTheFoldQuery"
  | "ArtworkBelowTheFoldQuery"
  | "ArtworkMarkAsRecentlyViewedQuery"
  | "ArtworkRefetchQuery"

jest.unmock("react-relay")

jest.mock("app/Components/Bidding/Context/TimeOffsetProvider", () => {
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
    environment.mock.resolveMostRecentOperation((operation) => {
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
      <ModalStack>
        <ArtworkQueryRenderer
          isVisible={isVisible}
          artworkID="ignored"
          environment={environment}
          tracking={{ trackEvent: jest.fn() } as any}
        />
      </ModalStack>
    </Suspense>
  )

  beforeEach(() => {
    require("app/relay/createEnvironment").reset()
    environment = require("app/relay/createEnvironment").defaultEnvironment
    // TODO: Remove it when AREnableCreateArtworkAlert flag is true in Echo
    __globalStoreTestUtils__?.injectFeatureFlags({ AREnableCreateArtworkAlert: false })
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
    it("renders when there are artist series to show", async () => {
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

    it("does not render when there are no artist series to show", async () => {
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

    it("tracks a click to an artist series item", async () => {
      const tree = renderWithWrappers(<TestRenderer />)
      mockMostRecentOperation("ArtworkAboveTheFoldQuery", {
        Artwork() {
          return {
            internalID: "artwork123",
          }
        },
      })
      mockMostRecentOperation("ArtworkMarkAsRecentlyViewedQuery")
      mockMostRecentOperation("ArtworkBelowTheFoldQuery", {
        Artwork() {
          return {
            slug: "my-cool-artwork",
            internalID: "artwork123",
            artist: {
              artistSeriesConnection: {
                totalCount: 5,
                edges: [
                  {
                    node: {
                      slug: "yayoi-kusama-other-fruits",
                      internalID: "abc123",
                      title: "Other Fruits",
                      featured: false,
                      artworksCountMessage: "22 available",
                      image: {
                        url: "https://www.images.net/fruits",
                      },
                    },
                  },
                ],
              },
            },
          }
        },
      })
      await flushPromiseQueue()

      const artistSeriesButton = tree.root.findByType(ArtistSeriesListItem).findByType(Touchable)
      act(() => artistSeriesButton.props.onPress())

      expect(mockTrackEvent).toHaveBeenCalledWith({
        action: "tappedArtistSeriesGroup",
        context_module: "moreSeriesByThisArtist",
        context_screen_owner_id: "artwork123",
        context_screen_owner_slug: "my-cool-artwork",
        context_screen_owner_type: "artwork",
        destination_screen_owner_id: "abc123",
        destination_screen_owner_slug: "yayoi-kusama-other-fruits",
        destination_screen_owner_type: "artistSeries",
        horizontal_slide_position: 0,
        curation_boost: false,
        type: "thumbnail",
      })
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
    __globalStoreTestUtils__?.injectFeatureFlags({ AROptionsLotConditionReport: false })
    const tree = renderWithWrappers(<TestRenderer />)

    mockMostRecentOperation("ArtworkAboveTheFoldQuery")
    mockMostRecentOperation("ArtworkMarkAsRecentlyViewedQuery")
    mockMostRecentOperation("ArtworkBelowTheFoldQuery")

    expect(environment.mock.getAllOperations()).toHaveLength(0)

    navigationEvents.emit("modalDismissed")
    mockMostRecentOperation("ArtworkRefetchQuery")

    tree.update(<TestRenderer isVisible={false} />)
    tree.update(<TestRenderer isVisible />)
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

    expect(environment.mock.getMostRecentOperation()).toMatchObject({
      request: {
        node: {
          operation: {
            name: "ArtworkMarkAsRecentlyViewedQuery",
          },
        },
        variables: {
          input: {
            artwork_id: "my-special-artwork",
          },
        },
      },
    })
    mockMostRecentOperation("ArtworkMarkAsRecentlyViewedQuery")
    mockMostRecentOperation("ArtworkBelowTheFoldQuery", {
      Artwork() {
        return { slug: "my-special-artwork" }
      },
    })

    navigationEvents.emit("modalDismissed")
    mockMostRecentOperation("ArtworkRefetchQuery", {
      Artwork() {
        return { slug: "completely-different-slug" }
      },
    })

    tree.update(<TestRenderer isVisible={false} />)
    tree.update(<TestRenderer isVisible />)

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

    expect(tree.root.findByType(Artwork).props.artworkAboveTheFold.slug).toBe(
      "completely-different-slug"
    )
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

  it("renders buy now contact gallery when feature flag is enabled", async () => {
    __globalStoreTestUtils__?.injectFeatureFlags({ AREnableConversationalBuyNow: true })
    const tree = renderWithWrappers(<TestRenderer />)

    mockMostRecentOperation("ArtworkAboveTheFoldQuery", {
      Artwork: () => ({
        slug: "test-artwork",
        isAcquireable: true,
      }),
    })
    mockMostRecentOperation("ArtworkMarkAsRecentlyViewedQuery")
    mockMostRecentOperation("ArtworkBelowTheFoldQuery")

    await flushPromiseQueue()

    expect(tree.root.findAllByType(Questions)).toHaveLength(1)
  })

  describe("Live Auction States", () => {
    describe("has the correct state for a work that is in an auction that is currently live", () => {
      it("for which I am registered", () => {
        const tree = renderWithWrappers(<TestRenderer />)

        mockMostRecentOperation("ArtworkAboveTheFoldQuery", {
          Artwork() {
            return merge(
              {},
              ArtworkFixture,
              ArtworkFromLiveAuctionRegistrationClosed,
              RegisteredBidder
            )
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
            return merge(
              {},
              ArtworkFixture,
              ArtworkFromLiveAuctionRegistrationClosed,
              NotRegisteredToBid
            )
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
            return merge(
              {},
              ArtworkFixture,
              ArtworkFromLiveAuctionRegistrationOpen,
              NotRegisteredToBid
            )
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

  describe("Partner Section", () => {
    beforeEach(() => {
      __globalStoreTestUtils__?.injectFeatureFlags({ AREnableCreateArtworkAlert: true })
    })

    it("should render a pressable partner name section when partner is linkable and has a href", () => {
      const { getByA11yHint, queryByA11yHint } = renderWithWrappersTL(<TestRenderer />)

      mockMostRecentOperation("ArtworkAboveTheFoldQuery", {
        Artwork: () => ({
          partner: {
            name: "Test Partner",
            href: "/partner/test-partner",
            isLinkable: true,
          },
        }),
      })

      expect(queryByA11yHint("Visit Test Partner page")).toBeTruthy()
      fireEvent.press(getByA11yHint("Visit Test Partner page"))

      expect(navigateToPartner).toHaveBeenCalledWith("/partner/test-partner")
    })

    it("should render a non pressable partner name section when partner is not linkable", () => {
      const { queryByA11yHint, queryByTestId } = renderWithWrappersTL(<TestRenderer />)

      mockMostRecentOperation("ArtworkAboveTheFoldQuery", {
        Artwork: () => ({
          partner: {
            name: "Test Partner",
            href: "/whateva",
            isLinkable: false,
          },
        }),
      })

      expect(queryByA11yHint("Visit Test Partner page")).toBeFalsy()
      expect(queryByTestId("non linkable partner")).toBeTruthy()
      expect(queryByTestId("non linkable partner")).toHaveTextContent("Test Partner")
    })

    it("should not render the partner section when the partner has no name", () => {
      const { queryByLabelText, queryByTestId } = renderWithWrappersTL(<TestRenderer />)

      mockMostRecentOperation("ArtworkAboveTheFoldQuery")

      expect(queryByLabelText("Visit Test Partner page")).toBeFalsy()
      expect(queryByTestId("non linkable partner")).toBeFalsy()
    })
  })

  describe("Create Alert button", () => {
    beforeEach(() => {
      __globalStoreTestUtils__?.injectFeatureFlags({ AREnableCreateArtworkAlert: true })
    })

    it("should display create artwork alert section by default", () => {
      const { queryByLabelText } = renderWithWrappersTL(<TestRenderer />)

      mockMostRecentOperation("ArtworkAboveTheFoldQuery", {
        Artwork: () => ({
          isSold: false,
          isInAuction: false,
          sale: null,
          artists: [
            {
              name: "Test Artist",
            },
          ],
        }),
      })

      expect(queryByLabelText("Create artwork alert section")).toBeTruthy()
      expect(queryByLabelText("Create artwork alert buttons section")).toBeFalsy()
    })

    it("should not display create artwork alert button section when artwork doesn't have any artist", () => {
      const { queryByLabelText } = renderWithWrappersTL(<TestRenderer />)

      mockMostRecentOperation("ArtworkAboveTheFoldQuery", {
        Artwork: () => ({
          isSold: false,
          isInAuction: false,
          sale: null,
          artists: [],
        }),
      })

      expect(queryByLabelText("Create artwork alert section")).toBeNull()
      expect(queryByLabelText("Create artwork alert buttons section")).toBeNull()
    })

    it("should display create artwork alert buttons section when artwork is sold", () => {
      const { queryByLabelText } = renderWithWrappersTL(<TestRenderer />)

      mockMostRecentOperation("ArtworkAboveTheFoldQuery", {
        Artwork: () => ({
          isSold: true,
          isInAuction: false,
          sale: null,
        }),
      })

      expect(queryByLabelText("Create artwork alert section")).toBeFalsy()
      expect(queryByLabelText("Create artwork alert buttons section")).toBeTruthy()
    })

    it("should display create artwork alert buttons section when artwork is in closed auction", () => {
      const { queryByLabelText } = renderWithWrappersTL(<TestRenderer />)

      mockMostRecentOperation("ArtworkAboveTheFoldQuery", {
        Artwork: () => ({
          isSold: false,
          isInAuction: true,
          sale: {
            isLiveOpen: false,
            isPreview: false,
            liveStartAt: null,
            endAt: null,
            startAt: null,
            isClosed: true,
            isAuction: true,
          },
        }),
      })

      expect(queryByLabelText("Create artwork alert section")).toBeFalsy()
      expect(queryByLabelText("Create artwork alert buttons section")).toBeTruthy()
    })
  })
})
