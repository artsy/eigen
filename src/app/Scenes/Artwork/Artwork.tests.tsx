import { screen } from "@testing-library/react-native"
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
import { ArtistSeriesListItem } from "app/Scenes/ArtistSeries/ArtistSeriesListItem"
import { ArtistSeriesMoreSeries } from "app/Scenes/ArtistSeries/ArtistSeriesMoreSeries"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { extractText } from "app/tests/extractText"
import { flushPromiseQueue } from "app/tests/flushPromiseQueue"
import { mockTrackEvent } from "app/tests/globallyMockedStuff"
import { renderWithWrappers, renderWithWrappersLEGACY } from "app/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/tests/resolveMostRecentRelayOperation"
import { merge } from "lodash"
import _ from "lodash"
import { Touchable } from "palette"
import { Suspense } from "react"
import { ActivityIndicator } from "react-native"
import { act } from "react-test-renderer"
import { createMockEnvironment } from "relay-test-utils"
import { Artwork, ArtworkQueryRenderer } from "./Artwork"
import { ArtworkDetails } from "./Components/ArtworkDetails"
import { ArtworksInSeriesRail } from "./Components/ArtworksInSeriesRail"
import { BidButton } from "./Components/CommercialButtons/BidButton"
import { CommercialInformation } from "./Components/CommercialInformation"
import { ContextCard } from "./Components/ContextCard"
import { ImageCarousel } from "./Components/ImageCarousel/ImageCarousel"
import { OtherWorksFragmentContainer } from "./Components/OtherWorks/OtherWorks"

jest.unmock("react-relay")

// TODO: remove the use of renderWithWrappersLEGACY
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

    __globalStoreTestUtils__?.injectFeatureFlags({
      ARArtworkRedesingPhase2: false,
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it("renders above the fold content before the full query has been resolved", async () => {
    const tree = renderWithWrappersLEGACY(<TestRenderer />)
    // ArtworkAboveTheFoldQuery
    resolveMostRecentRelayOperation(environment)
    expect(tree.root.findAllByType(ImageCarousel)).toHaveLength(1)
    expect(tree.root.findAllByType(CommercialInformation)).toHaveLength(1)
    expect(tree.root.findAllByType(ActivityIndicator)).toHaveLength(1)
    expect(tree.root.findAllByType(ArtworkDetails)).toHaveLength(0)
  })

  it("renders all content after the full query has been resolved", async () => {
    const tree = renderWithWrappersLEGACY(<TestRenderer />)

    // ArtworkAboveTheFoldQuery
    resolveMostRecentRelayOperation(environment)
    // ArtworkMarkAsRecentlyViewedQuery
    resolveMostRecentRelayOperation(environment)
    // ArtworkBelowTheFoldQuery
    resolveMostRecentRelayOperation(environment)
    await flushPromiseQueue()
    expect(tree.root.findAllByType(ImageCarousel)).toHaveLength(1)
    expect(tree.root.findAllByType(CommercialInformation)).toHaveLength(1)
    expect(tree.root.findAllByType(ActivityIndicator)).toHaveLength(0)
    expect(tree.root.findAllByType(ArtworkDetails)).toHaveLength(1)
  })

  describe("artist series components", () => {
    it("renders when there are artist series to show", async () => {
      renderWithWrappers(<TestRenderer />)

      // ArtworkAboveTheFoldQuery
      resolveMostRecentRelayOperation(environment)
      // ArtworkMarkAsRecentlyViewedQuery
      resolveMostRecentRelayOperation(environment)
      // ArtworkBelowTheFoldQuery
      resolveMostRecentRelayOperation(environment, {
        Artwork() {
          return {
            artist: {
              biographyBlurb: null,
              artistSeriesConnection: {
                totalCount: 5,
              },
            },
            // Hide some other sections
            // otherwise arties series components will not be found
            sale: null,
            partner: null,
            context: null,
          }
        },
      })

      await flushPromiseQueue()

      expect(screen.UNSAFE_queryAllByType(ArtistSeriesMoreSeries)).toHaveLength(1)
      expect(screen.UNSAFE_queryAllByType(ArtworksInSeriesRail)).toHaveLength(1)
    })

    it("does not render when there are no artist series to show", async () => {
      const tree = renderWithWrappersLEGACY(<TestRenderer />)

      // ArtworkAboveTheFoldQuery
      resolveMostRecentRelayOperation(environment)
      // ArtworkMarkAsRecentlyViewedQuery
      resolveMostRecentRelayOperation(environment)
      // ArtworkBelowTheFoldQuery
      resolveMostRecentRelayOperation(environment, {
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
            // Hide some other sections
            // otherwise arties series components will not be found
            sale: null,
            partner: null,
            context: null,
          }
        },
      })

      await flushPromiseQueue()

      expect(tree.root.findAllByType(ArtistSeriesMoreSeries)).toHaveLength(0)
      expect(tree.root.findAllByType(ArtworksInSeriesRail)).toHaveLength(0)
    })

    it("tracks a click to an artist series item", async () => {
      const tree = renderWithWrappersLEGACY(<TestRenderer />)

      // ArtworkAboveTheFoldQuery
      resolveMostRecentRelayOperation(environment, {
        Artwork() {
          return {
            internalID: "artwork123",
          }
        },
      })
      // ArtworkMarkAsRecentlyViewedQuery
      resolveMostRecentRelayOperation(environment)
      // ArtworkBelowTheFoldQuery
      resolveMostRecentRelayOperation(environment, {
        Artwork() {
          return {
            slug: "my-cool-artwork",
            internalID: "artwork123",
            isEligibleForArtsyGuarantee: false,
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
            // Hide some other sections
            // otherwise arties series components will not be found
            sale: null,
            partner: null,
            context: null,
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
    const tree = renderWithWrappersLEGACY(<TestRenderer />)

    // ArtworkAboveTheFoldQuery
    resolveMostRecentRelayOperation(environment)
    // ArtworkMarkAsRecentlyViewedQuery
    resolveMostRecentRelayOperation(environment)
    // ArtworkBelowTheFoldQuery
    resolveMostRecentRelayOperation(environment, {
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

  it("updates the above-the-fold content on re-appear", async () => {
    const tree = renderWithWrappersLEGACY(<TestRenderer />)

    // ArtworkAboveTheFoldQuery
    resolveMostRecentRelayOperation(environment, {
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

    // ArtworkMarkAsRecentlyViewedQuery
    resolveMostRecentRelayOperation(environment)

    // ArtworkBelowTheFoldQuery
    resolveMostRecentRelayOperation(environment, {
      Artwork() {
        return { slug: "my-special-artwork" }
      },
    })

    resolveMostRecentRelayOperation(environment)

    navigationEvents.emit("modalDismissed")

    await flushPromiseQueue()

    // ArtworkRefetchQuery
    resolveMostRecentRelayOperation(environment, {
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

    // ArtworkMarkAsRecentlyViewedQuery
    resolveMostRecentRelayOperation(environment)

    expect(tree.root.findByType(Artwork).props.artworkAboveTheFold.slug).toBe(
      "completely-different-slug"
    )
  })

  describe("Live Auction States", () => {
    describe("has the correct state for a work that is in an auction that is currently live", () => {
      beforeEach(() => {
        __globalStoreTestUtils__?.injectFeatureFlags({
          ARArtworkRedesingPhase2: false,
        })
      })

      it("for which I am registered", () => {
        const tree = renderWithWrappersLEGACY(<TestRenderer />)

        // ArtworkAboveTheFoldQuery
        resolveMostRecentRelayOperation(environment, {
          Artwork() {
            return merge(
              {},
              ArtworkFixture,
              ArtworkFromLiveAuctionRegistrationClosed,
              RegisteredBidder
            )
          },
        })

        expect(tree.root.findAllByType(Countdown)).toHaveLength(1)
        expect(tree.root.findByType(Countdown).props.label).toBe("In progress")
        expect(extractText(tree.root.findByType(BidButton))).toContain("Enter live bidding")
      })

      it("for which I am not registered and registration is open", async () => {
        const tree = renderWithWrappersLEGACY(<TestRenderer />)

        // ArtworkAboveTheFoldQuery
        resolveMostRecentRelayOperation(environment, {
          Artwork() {
            return merge(
              {},
              ArtworkFixture,
              ArtworkFromLiveAuctionRegistrationClosed,
              NotRegisteredToBid
            )
          },
        })

        await flushPromiseQueue()

        expect(tree.root.findAllByType(Countdown)).toHaveLength(1)
        expect(tree.root.findByType(Countdown).props.label).toBe("In progress")
        expect(extractText(tree.root.findByType(BidButton))).toContain("Registration closed")
        expect(extractText(tree.root.findByType(BidButton))).toContain("Watch live bidding")
      })

      it("for which I am not registered and registration is closed", () => {
        const tree = renderWithWrappersLEGACY(<TestRenderer />)

        // ArtworkAboveTheFoldQuery
        resolveMostRecentRelayOperation(environment, {
          Artwork() {
            return merge(
              {},
              ArtworkFixture,
              ArtworkFromLiveAuctionRegistrationOpen,
              NotRegisteredToBid
            )
          },
        })

        expect(tree.root.findAllByType(Countdown)).toHaveLength(1)
        expect(tree.root.findByType(Countdown).props.label).toBe("In progress")
        expect(extractText(tree.root.findByType(Countdown))).toContain("00d  00h  00m  00s")
        expect(extractText(tree.root.findByType(BidButton))).toContain("Enter live bidding")
      })
    })
  })

  describe("Partner Section", () => {
    it("should not display partner link if CBN flag is on", () => {
      __globalStoreTestUtils__?.injectFeatureFlags({ AREnableConversationalBuyNow: true })

      const { queryByA11yHint } = renderWithWrappers(<TestRenderer />)

      // ArtworkAboveTheFoldQuery
      resolveMostRecentRelayOperation(environment, {
        Artwork: () => ({
          partner: {
            name: "Test Partner",
          },
        }),
      })

      expect(queryByA11yHint("Visit Test Partner page")).toBeFalsy()
    })

    it("should display partner link if CBN flag is off", () => {
      __globalStoreTestUtils__?.injectFeatureFlags({ AREnableConversationalBuyNow: false })

      const { queryByA11yHint } = renderWithWrappers(<TestRenderer />)

      // ArtworkAboveTheFoldQuery
      resolveMostRecentRelayOperation(environment, {
        Artwork: () => ({
          partner: {
            name: "Test Partner",
          },
        }),
      })

      expect(queryByA11yHint("Visit Test Partner page")).toBeTruthy()
    })
  })

  describe("Create Alert button", () => {
    beforeEach(() => {
      __globalStoreTestUtils__?.injectFeatureFlags({ ARArtworkRedesingPhase2: false })
    })

    it("should display create artwork alert section by default", () => {
      const { queryByLabelText } = renderWithWrappers(<TestRenderer />)

      // ArtworkAboveTheFoldQuery
      resolveMostRecentRelayOperation(environment, {
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
      const { queryByLabelText } = renderWithWrappers(<TestRenderer />)

      // ArtworkAboveTheFoldQuery
      resolveMostRecentRelayOperation(environment, {
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
      const { queryByLabelText } = renderWithWrappers(<TestRenderer />)

      // ArtworkAboveTheFoldQuery
      resolveMostRecentRelayOperation(environment, {
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
      const { queryByLabelText } = renderWithWrappers(<TestRenderer />)

      // ArtworkAboveTheFoldQuery
      resolveMostRecentRelayOperation(environment, {
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

  describe("Shipping and taxes", () => {
    it("should be rendered when the work has `for sale` availability", () => {
      const { queryByText } = renderWithWrappers(<TestRenderer />)

      // ArtworkAboveTheFoldQuery
      resolveMostRecentRelayOperation(environment)
      // ArtworkMarkAsRecentlyViewedQuery
      resolveMostRecentRelayOperation(environment)
      // ArtworkBelowTheFoldQuery
      resolveMostRecentRelayOperation(environment, {
        Artwork: () => ({
          isForSale: true,
        }),
      })

      expect(queryByText("Shipping and taxes")).toBeDefined()
    })

    it("should NOT be rendered if the work has any other availability", () => {
      const { queryByText } = renderWithWrappers(<TestRenderer />)
      // ArtworkAboveTheFoldQuery
      resolveMostRecentRelayOperation(environment)
      // ArtworkMarkAsRecentlyViewedQuery
      resolveMostRecentRelayOperation(environment)
      // ArtworkBelowTheFoldQuery
      resolveMostRecentRelayOperation(environment, {
        Artwork: () => ({
          isForSale: false,
        }),
      })

      expect(queryByText("Shipping and taxes")).toBeNull()
    })

    it("should NOT be rendered if the work is in auction", () => {
      const { queryByText } = renderWithWrappers(<TestRenderer />)

      // ArtworkAboveTheFoldQuery
      resolveMostRecentRelayOperation(environment, {
        Artwork: () => ({
          isInAuction: true,
        }),
      })
      // ArtworkMarkAsRecentlyViewedQuery
      resolveMostRecentRelayOperation(environment)
      // ArtworkBelowTheFoldQuery
      resolveMostRecentRelayOperation(environment, {
        Artwork: () => ({
          isForSale: false,
        }),
      })

      expect(queryByText("Shipping and taxes")).toBeNull()
    })
  })

  describe("Artsy Guarantee section", () => {
    it("should be displayed when eligible for artsy guarantee", async () => {
      renderWithWrappers(<TestRenderer />)

      // ArtworkAboveTheFoldQuery
      resolveMostRecentRelayOperation(environment, {
        Artwork: () => ({
          isEligibleForArtsyGuarantee: true,
        }),
      })
      // ArtworkMarkAsRecentlyViewedQuery
      resolveMostRecentRelayOperation(environment)
      // ArtworkBelowTheFoldQuery
      resolveMostRecentRelayOperation(environment)

      await flushPromiseQueue()

      expect(
        screen.queryByText("Be covered by the Artsy Guarantee when you checkout with Artsy")
      ).toBeTruthy()
    })

    it("should not be displayed when ineligible for artsy guarantee", async () => {
      renderWithWrappers(<TestRenderer />)

      // ArtworkAboveTheFoldQuery
      resolveMostRecentRelayOperation(environment)
      // ArtworkMarkAsRecentlyViewedQuery
      resolveMostRecentRelayOperation(environment)
      // ArtworkBelowTheFoldQuery
      resolveMostRecentRelayOperation(environment, {
        Artwork: () => ({
          isEligibleForArtsyGuarantee: false,
        }),
      })

      await flushPromiseQueue()

      expect(
        screen.queryByText("Be covered by the Artsy Guarantee when you checkout with Artsy")
      ).toBeNull()
    })
  })

  describe("Context Card", () => {
    it("should NOT be displayed if the work is in a non-auction sale", async () => {
      const tree = renderWithWrappersLEGACY(<TestRenderer />)

      // ArtworkAboveTheFoldQuery
      resolveMostRecentRelayOperation(environment)
      // ArtworkMarkAsRecentlyViewedQuery
      resolveMostRecentRelayOperation(environment)
      // ArtworkBelowTheFoldQuery
      resolveMostRecentRelayOperation(environment, {
        Artwork() {
          return {
            isForSale: false,
          }
        },
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

    it("should be displayed if the work is in an auction", async () => {
      const tree = renderWithWrappersLEGACY(<TestRenderer />)

      // ArtworkAboveTheFoldQuery
      resolveMostRecentRelayOperation(environment)
      // ArtworkMarkAsRecentlyViewedQuery
      resolveMostRecentRelayOperation(environment)
      // ArtworkBelowTheFoldQuery
      resolveMostRecentRelayOperation(environment, {
        Sale() {
          return {
            isAuction: true,
          }
        },
      })

      await flushPromiseQueue()

      expect(tree.root.findAllByType(ContextCard)).toHaveLength(1)
    })
  })

  describe("About the work section", () => {
    it("should NOT be rendered", async () => {
      renderWithWrappers(<TestRenderer />)

      // ArtworkAboveTheFoldQuery
      resolveMostRecentRelayOperation(environment)
      // ArtworkMarkAsRecentlyViewedQuery
      resolveMostRecentRelayOperation(environment)
      // ArtworkBelowTheFoldQuery
      resolveMostRecentRelayOperation(environment, {
        Artwork: () => ({
          description: null,
          additionalInformation: null,
        }),
      })

      await flushPromiseQueue()

      expect(screen.queryByText("About the work")).toBeNull()
    })

    it("should be rendered", async () => {
      renderWithWrappers(<TestRenderer />)

      // ArtworkAboveTheFoldQuery
      resolveMostRecentRelayOperation(environment)
      // ArtworkMarkAsRecentlyViewedQuery
      resolveMostRecentRelayOperation(environment)
      // ArtworkBelowTheFoldQuery
      resolveMostRecentRelayOperation(environment, {
        Artwork: () => ({
          description: "Artwork Description",
        }),
      })

      await flushPromiseQueue()

      expect(screen.getByText("About the work")).toBeTruthy()
    })
  })

  describe("Provenance/Exhibition history/Bibliography", () => {
    it("should NOT be rendered", async () => {
      renderWithWrappers(<TestRenderer />)

      // ArtworkAboveTheFoldQuery
      resolveMostRecentRelayOperation(environment)
      // ArtworkMarkAsRecentlyViewedQuery
      resolveMostRecentRelayOperation(environment)
      // ArtworkBelowTheFoldQuery
      resolveMostRecentRelayOperation(environment, {
        Artwork: () => ({
          provenance: null,
          exhibitionHistory: null,
          literature: null,
        }),
      })

      await flushPromiseQueue()

      expect(screen.queryByText("Provenance")).toBeNull()
      expect(screen.queryByText("Exhibition history")).toBeNull()
      expect(screen.queryByText("Bibliography")).toBeNull()
    })

    it("should be rendered", async () => {
      renderWithWrappers(<TestRenderer />)

      // ArtworkAboveTheFoldQuery
      resolveMostRecentRelayOperation(environment)
      // ArtworkMarkAsRecentlyViewedQuery
      resolveMostRecentRelayOperation(environment)
      // ArtworkBelowTheFoldQuery
      resolveMostRecentRelayOperation(environment, {
        Artwork: () => ({
          provenance: "Text",
          exhibitionHistory: "Text",
          literature: "Text",
        }),
      })

      await flushPromiseQueue()

      expect(screen.getByText("Provenance")).toBeTruthy()
      expect(screen.getByText("Exhibition history")).toBeTruthy()
      expect(screen.getByText("Bibliography")).toBeTruthy()
    })
  })

  describe("About the artist", () => {
    it("should NOT be rendered", async () => {
      renderWithWrappers(<TestRenderer />)

      // ArtworkAboveTheFoldQuery
      resolveMostRecentRelayOperation(environment)
      // ArtworkMarkAsRecentlyViewedQuery
      resolveMostRecentRelayOperation(environment)
      // ArtworkBelowTheFoldQuery
      resolveMostRecentRelayOperation(environment, {
        Artwork: () => ({
          artist: null,
        }),
      })

      await flushPromiseQueue()

      expect(screen.queryByText("About the artist")).toBeNull()
    })

    it("should be rendered", async () => {
      renderWithWrappers(<TestRenderer />)

      // ArtworkAboveTheFoldQuery
      resolveMostRecentRelayOperation(environment)
      // ArtworkMarkAsRecentlyViewedQuery
      resolveMostRecentRelayOperation(environment)
      // ArtworkBelowTheFoldQuery
      resolveMostRecentRelayOperation(environment, {
        Artwork: () => ({
          artist: {
            biographyBlurb: {
              text: "Artist Text",
            },
          },
        }),
      })

      await flushPromiseQueue()

      expect(screen.getByText("About the artist")).toBeTruthy()
    })
  })

  describe("Other works", () => {
    it("should NOT be rendered", async () => {
      renderWithWrappers(<TestRenderer />)

      // ArtworkAboveTheFoldQuery
      resolveMostRecentRelayOperation(environment)
      // ArtworkMarkAsRecentlyViewedQuery
      resolveMostRecentRelayOperation(environment)
      // ArtworkBelowTheFoldQuery
      resolveMostRecentRelayOperation(environment, {
        Artwork: () => ({
          contextGrids: [
            {
              title: "Grid Name",
              artworks: {
                edges: [],
              },
            },
          ],
        }),
      })

      await flushPromiseQueue()

      expect(screen.queryByText("Grid Name")).toBeNull()
    })

    it("should be rendered", async () => {
      renderWithWrappers(<TestRenderer />)

      // ArtworkAboveTheFoldQuery
      resolveMostRecentRelayOperation(environment)
      // ArtworkMarkAsRecentlyViewedQuery
      resolveMostRecentRelayOperation(environment)
      // ArtworkBelowTheFoldQuery
      resolveMostRecentRelayOperation(environment, {
        Artwork: () => ({
          // skip about the artist section
          artist: null,
          contextGrids: [
            {
              title: "Grid Name",
              artworks: {
                edges: [
                  {
                    node: {
                      internalID: "Grid Node One",
                    },
                  },
                ],
              },
            },
          ],
        }),
      })

      await flushPromiseQueue()

      expect(screen.queryByText("Grid Name")).toBeTruthy()
    })
  })

  describe("when ARArtworkRedesingPhase2 feature flag is enabled", () => {
    beforeEach(() => {
      __globalStoreTestUtils__?.injectFeatureFlags({
        ARArtworkRedesingPhase2: true,
      })
    })

    describe("Consigments", () => {
      it("shows consign link if at least 1 artist is consignable", async () => {
        renderWithWrappers(<TestRenderer />)

        // ArtworkAboveTheFoldQuery
        resolveMostRecentRelayOperation(environment)
        // ArtworkMarkAsRecentlyViewedQuery
        resolveMostRecentRelayOperation(environment)
        // ArtworkBelowTheFoldQuery
        resolveMostRecentRelayOperation(environment, {
          Artwork: () => ({
            isForSale: true,
            artists: [
              {
                name: "Santa",
                isConsignable: true,
              },
            ],
          }),
        })
        await flushPromiseQueue()

        expect(screen.queryByText(/Consign with Artsy/)).toBeTruthy()
      })

      it("doesn't render section", async () => {
        renderWithWrappers(<TestRenderer />)

        // ArtworkAboveTheFoldQuery
        resolveMostRecentRelayOperation(environment, {
          Artwork: () => ({
            isAcquireable: false,
            isOfferable: false,
            isInAuction: false,
            sale: null,
          }),
        })
        // ArtworkMarkAsRecentlyViewedQuery
        resolveMostRecentRelayOperation(environment)
        // ArtworkBelowTheFoldQuery
        resolveMostRecentRelayOperation(environment, {
          Artwork: () => ({
            isForSale: false,
            artists: [
              {
                name: "Santa",
                isConsignable: false,
              },
            ],
          }),
        })
        await flushPromiseQueue()

        expect(screen.queryByText(/Consign with Artsy/)).toBeNull()
      })
    })
  })
})
