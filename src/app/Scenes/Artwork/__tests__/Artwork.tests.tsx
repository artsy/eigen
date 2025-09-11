import { act, fireEvent, screen, waitFor } from "@testing-library/react-native"
import { ArtistSeriesMoreSeries } from "app/Scenes/ArtistSeries/ArtistSeriesMoreSeries"
import { Artwork, ArtworkScreen } from "app/Scenes/Artwork/Artwork"
import { ArtworkDetails } from "app/Scenes/Artwork/Components/ArtworkDetails"
import { ArtworkHistory } from "app/Scenes/Artwork/Components/ArtworkHistory"
import { ArtworkStickyBottomContent } from "app/Scenes/Artwork/Components/ArtworkStickyBottomContent"
import { ArtworksInSeriesRail } from "app/Scenes/Artwork/Components/ArtworksInSeriesRail"
import { ImageCarousel } from "app/Scenes/Artwork/Components/ImageCarousel/ImageCarousel"
import { OtherWorksFragmentContainer } from "app/Scenes/Artwork/Components/OtherWorks/OtherWorks"
import { PartnerCard } from "app/Scenes/Artwork/Components/PartnerCard"
import { PrivateArtworkExclusiveAccess } from "app/Scenes/Artwork/Components/PrivateArtwork/PrivateArtworkExclusiveAccess"
import { PrivateArtworkMetadata } from "app/Scenes/Artwork/Components/PrivateArtwork/PrivateArtworkMetadata"
import { ShippingAndTaxesFragmentContainer } from "app/Scenes/Artwork/Components/ShippingAndTaxes"
import {
  ArtworkFromLiveAuctionRegistrationClosed,
  ArtworkFromLiveAuctionRegistrationOpen,
  NotRegisteredToBid,
  RegisteredBidder,
} from "app/__fixtures__/ArtworkBidAction"
import { ArtworkFixture } from "app/__fixtures__/ArtworkFixture"

import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { goBack, navigate, navigationEvents } from "app/system/navigation/navigate"
import { getMockRelayEnvironment } from "app/system/relay/defaultEnvironment"
import { flushPromiseQueue } from "app/utils/tests/flushPromiseQueue"
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/utils/tests/resolveMostRecentRelayOperation"
import { merge } from "lodash"
import { ActivityIndicator } from "react-native"
import { createMockEnvironment } from "relay-test-utils"

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
      // eslint-disable-next-line testing-library/no-node-access
      return this.props.children
    }
  }
  return { TimeOffsetProvider }
})

jest.mock("react-native/Libraries/Interaction/InteractionManager", () => ({
  ...jest.requireActual("react-native/Libraries/Interaction/InteractionManager"),
  runAfterInteractions: jest.fn((callback) => callback()),
}))

let callback: ([...args]: any) => void
jest.mock("app/utils/useWebViewEvent", () => ({
  useSetWebViewCallback: (_: string, cb: ([...args]: any) => void) => {
    callback = cb
    return jest.fn()
  },
}))

describe("Artwork", () => {
  let environment: ReturnType<typeof createMockEnvironment>

  const TestRenderer = ({ isVisible = true }) => (
    <ArtworkScreen
      isVisible={isVisible}
      artworkID="ignored"
      environment={environment}
      tracking={{ trackEvent: jest.fn() } as any}
    />
  )

  beforeEach(() => {
    environment = getMockRelayEnvironment()
    __globalStoreTestUtils__?.injectFeatureFlags({ AREnableAuctionHeaderAlertCTA: false })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it("renders above the fold content before the full query has been resolved", async () => {
    renderWithWrappers(<TestRenderer />, { includeNavigation: true })

    // ArtworkAboveTheFoldQuery
    resolveMostRecentRelayOperation(environment)

    await flushPromiseQueue()
    expect(screen.UNSAFE_queryByType(ImageCarousel)).toBeTruthy()
    expect(screen.UNSAFE_queryByType(ArtworkDetails)).toBeTruthy()
    expect(screen.UNSAFE_queryByType(ArtworkStickyBottomContent)).toBeTruthy()
    expect(screen.UNSAFE_queryByType(ActivityIndicator)).toBeTruthy()
  })

  it("renders all content after the full query has been resolved", async () => {
    renderWithWrappers(<TestRenderer />, { includeNavigation: true })

    // ArtworkAboveTheFoldQuery
    resolveMostRecentRelayOperation(environment, {
      Artwork: () => ({
        isUnlisted: false,
        collectorSignals: {
          runningShow: {
            name: "Art Basel",
            href: "/show/art-basel",
            startAt: "2021-06-17T00:00:00+00:00",
            endAt: "2021-06-20T00:00:00+00:00",
          },
        },
      }),
    })
    // ArtworkMarkAsRecentlyViewedQuery
    resolveMostRecentRelayOperation(environment)
    // ArtworkBelowTheFoldQuery
    resolveMostRecentRelayOperation(environment, {
      Artwork: () => ({
        isUnlisted: false,
      }),
    })

    await flushPromiseQueue()

    expect(screen.UNSAFE_queryByType(ImageCarousel)).toBeTruthy()
    expect(screen.UNSAFE_queryByType(ArtworkDetails)).toBeTruthy()
    expect(screen.UNSAFE_queryByType(ActivityIndicator)).toBeNull()
    expect(screen.UNSAFE_queryByType(ArtworkHistory)).toBeTruthy()
  })

  describe("artist series components", () => {
    it("renders when there are artist series to show", async () => {
      renderWithWrappers(<TestRenderer />, { includeNavigation: true })

      // ArtworkAboveTheFoldQuery
      resolveMostRecentRelayOperation(environment, {
        Artwork: () => ({
          isUnlisted: false,
          collectorSignals: null,
        }),
        Me: () => ({ partnerOffersConnection: { edges: [] } }),
      })
      // ArtworkMarkAsRecentlyViewedQuery
      resolveMostRecentRelayOperation(environment)
      // ArtworkBelowTheFoldQuery
      resolveMostRecentRelayOperation(environment, {
        Artwork() {
          return {
            isUnlisted: false,
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

      expect(screen.UNSAFE_queryByType(ArtistSeriesMoreSeries)).toBeTruthy()
      expect(screen.UNSAFE_queryByType(ArtworksInSeriesRail)).toBeTruthy()
    })

    it("does not render when there are no artist series to show", async () => {
      renderWithWrappers(<TestRenderer />, { includeNavigation: true })

      // ArtworkAboveTheFoldQuery
      resolveMostRecentRelayOperation(environment)
      // ArtworkMarkAsRecentlyViewedQuery
      resolveMostRecentRelayOperation(environment)
      // ArtworkBelowTheFoldQuery
      resolveMostRecentRelayOperation(environment, {
        Artwork: () => ({
          isUnlisted: false,
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
        }),
      })

      await flushPromiseQueue()

      expect(screen.UNSAFE_queryByType(ArtistSeriesMoreSeries)).toBeNull()
      expect(screen.UNSAFE_queryByType(ArtworksInSeriesRail)).toBeNull()
    })

    it("tracks a click to an artist series item", async () => {
      renderWithWrappers(<TestRenderer />, { includeNavigation: true })

      // ArtworkAboveTheFoldQuery
      resolveMostRecentRelayOperation(environment, {
        Artwork() {
          return {
            isUnlisted: false,
            internalID: "artwork123",
            collectorSignals: null,
          }
        },
        Me: () => ({ partnerOffersConnection: { edges: [] } }),
      })
      // ArtworkMarkAsRecentlyViewedQuery
      resolveMostRecentRelayOperation(environment)
      // ArtworkBelowTheFoldQuery
      resolveMostRecentRelayOperation(environment, {
        Artwork() {
          return {
            isUnlisted: false,
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

      const artistSeriesButton = screen.getByLabelText("Artist Series List Item")

      fireEvent.press(artistSeriesButton)

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
    renderWithWrappers(<TestRenderer />, { includeNavigation: true })

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

    expect(screen.getByLabelText("Artwork Details")).toBeOnTheScreen()
  })

  it("updates the above-the-fold content on re-appear", async () => {
    // eslint-disable-next-line testing-library/render-result-naming-convention
    const tree = renderWithWrappers(<TestRenderer />, { includeNavigation: true })

    // ArtworkAboveTheFoldQuery
    resolveMostRecentRelayOperation(environment, {
      Artwork() {
        return { slug: "my-special-artwork" }
      },
    })

    await flushPromiseQueue()

    // eslint-disable-next-line testing-library/await-async-queries
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

    // eslint-disable-next-line testing-library/await-async-queries
    expect(tree.root.findByType(Artwork).props.artworkAboveTheFold.slug).toBe(
      "completely-different-slug"
    )
  })

  describe("Live Auction States", () => {
    describe("has the correct state for a work that is in an auction that is currently live", () => {
      it("for which I am registered", () => {
        renderWithWrappers(<TestRenderer />, { includeNavigation: true })

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

        expect(screen.getByText("Enter live bidding")).toBeOnTheScreen()
      })

      it("for which I am not registered and registration is open", async () => {
        renderWithWrappers(<TestRenderer />, { includeNavigation: true })

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

        expect(screen.getByText("Watch live bidding")).toBeOnTheScreen()
        expect(screen.getByText("Registration closed")).toBeOnTheScreen()
      })

      it("for which I am not registered and registration is closed", () => {
        renderWithWrappers(<TestRenderer />, { includeNavigation: true })

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

        expect(screen.getByText("Enter live bidding")).toBeOnTheScreen()
      })
    })
  })

  describe("Partner Section", () => {
    it("should display contact gallery button when partner is inquireable", () => {
      renderWithWrappers(<TestRenderer />, { includeNavigation: true })

      // ArtworkAboveTheFoldQuery
      resolveMostRecentRelayOperation(environment, {
        Artwork() {
          return {
            isUnlisted: false,
            collectorSignals: null,
          }
        },
        Me: () => ({ partnerOffersConnection: { edges: [] } }),
      })

      // ArtworkMarkAsRecentlyViewedQuery
      resolveMostRecentRelayOperation(environment)

      // ArtworkBelowTheFoldQuery
      resolveMostRecentRelayOperation(environment, {
        Artwork: () => ({
          collectorSignals: null,
          isUnlisted: false,
          context: {
            isAuction: false,
          },
          partner: {
            type: "Gallery",
            isInquireable: true,
          },
          sale: {
            isBenefit: false,
            isGalleryAuction: false,
          },
        }),
      })

      expect(screen.getByText("Gallery")).toBeOnTheScreen()
      expect(screen.getByText("Questions about this piece?")).toBeOnTheScreen()
      expect(screen.getByText("Contact Gallery")).toBeOnTheScreen()
    })

    it("should not display contact gallery button when partner is not inquireable", () => {
      renderWithWrappers(<TestRenderer />, { includeNavigation: true })

      // ArtworkAboveTheFoldQuery
      resolveMostRecentRelayOperation(environment, {
        Artwork() {
          return {
            isUnlisted: false,
            collectorSignals: null,
          }
        },
        Me: () => ({ partnerOffersConnection: { edges: [] } }),
      })

      // ArtworkMarkAsRecentlyViewedQuery
      resolveMostRecentRelayOperation(environment)

      // ArtworkBelowTheFoldQuery
      resolveMostRecentRelayOperation(environment, {
        Artwork: () => ({
          isUnlisted: false,
          context: {
            isAuction: false,
          },
          partner: {
            type: "Gallery",
            isInquireable: false,
          },
          sale: {
            isBenefit: false,
            isGalleryAuction: false,
          },
        }),
      })

      expect(screen.getByText("Gallery")).toBeOnTheScreen()
      expect(screen.queryByText("Questions about this piece?")).not.toBeOnTheScreen()
      expect(screen.queryByText("Contact Gallery")).not.toBeOnTheScreen()
    })
  })

  describe("Shipping and taxes", () => {
    it("should be rendered when the work has `for sale` availability", async () => {
      renderWithWrappers(<TestRenderer />, { includeNavigation: true })

      // ArtworkAboveTheFoldQuery
      resolveMostRecentRelayOperation(environment, {
        Artwork: () => ({
          collectorSignals: null,
        }),
        Me: () => ({ partnerOffersConnection: { edges: [] } }),
      })
      // ArtworkMarkAsRecentlyViewedQuery
      resolveMostRecentRelayOperation(environment)
      // ArtworkBelowTheFoldQuery
      resolveMostRecentRelayOperation(environment, {
        Artwork: () => ({
          isUnlisted: false,
          isInAuction: false,
          isForSale: true,
        }),
      })

      await flushPromiseQueue()

      expect(screen.getByText("Shipping and taxes")).toBeOnTheScreen()
    })

    it("should NOT be rendered if the work has any other availability", () => {
      renderWithWrappers(<TestRenderer />, { includeNavigation: true })
      // ArtworkAboveTheFoldQuery
      resolveMostRecentRelayOperation(environment)
      // ArtworkMarkAsRecentlyViewedQuery
      resolveMostRecentRelayOperation(environment)
      // ArtworkBelowTheFoldQuery
      resolveMostRecentRelayOperation(environment, {
        Artwork: () => ({
          isUnlisted: false,
          isForSale: false,
        }),
      })

      expect(screen.queryByText("Shipping and taxes")).not.toBeOnTheScreen()
    })

    it("should NOT be rendered if the work is in auction", () => {
      renderWithWrappers(<TestRenderer />, { includeNavigation: true })

      // ArtworkAboveTheFoldQuery
      resolveMostRecentRelayOperation(environment, {
        Artwork: () => ({
          isUnlisted: false,
          isInAuction: true,
        }),
      })
      // ArtworkMarkAsRecentlyViewedQuery
      resolveMostRecentRelayOperation(environment)
      // ArtworkBelowTheFoldQuery
      resolveMostRecentRelayOperation(environment, {
        Artwork: () => ({
          isUnlisted: false,
          isForSale: false,
        }),
      })

      expect(screen.queryByText("Shipping and taxes")).not.toBeOnTheScreen()
    })
  })

  describe("Artsy Guarantee section", () => {
    it("should be displayed when eligible for artsy guarantee", async () => {
      renderWithWrappers(<TestRenderer />, { includeNavigation: true })

      // ArtworkAboveTheFoldQuery
      resolveMostRecentRelayOperation(environment, {
        Artwork: () => ({
          collectorSignals: null,
          isUnlisted: false,
          isEligibleForArtsyGuarantee: true,
          context: {
            isAuction: false,
          },
        }),
        Me: () => ({ partnerOffersConnection: { edges: [] } }),
      })
      // ArtworkMarkAsRecentlyViewedQuery
      resolveMostRecentRelayOperation(environment)
      // ArtworkBelowTheFoldQuery
      resolveMostRecentRelayOperation(environment, {
        Artwork: () => ({
          isUnlisted: false,
          isEligibleForArtsyGuarantee: true,
          context: {
            isAuction: false,
          },
        }),
      })

      await flushPromiseQueue()

      expect(
        screen.getByText("Be covered by the Artsy Guarantee when you check out with Artsy")
      ).toBeOnTheScreen()
    })

    it("should not be displayed when ineligible for artsy guarantee", async () => {
      renderWithWrappers(<TestRenderer />, { includeNavigation: true })

      // ArtworkAboveTheFoldQuery
      resolveMostRecentRelayOperation(environment)
      // ArtworkMarkAsRecentlyViewedQuery
      resolveMostRecentRelayOperation(environment)
      // ArtworkBelowTheFoldQuery
      resolveMostRecentRelayOperation(environment, {
        Artwork: () => ({
          isUnlisted: false,
          isEligibleForArtsyGuarantee: false,
        }),
      })

      await flushPromiseQueue()

      expect(
        screen.queryByText("Be covered by the Artsy Guarantee when you check out with Artsy")
      ).toBeNull()
    })
  })

  describe("Context Card", () => {
    it("should NOT be displayed if the work is in a non-auction sale", async () => {
      renderWithWrappers(<TestRenderer />, { includeNavigation: true })

      // ArtworkAboveTheFoldQuery
      resolveMostRecentRelayOperation(environment, {
        Me: () => ({ partnerOffersConnection: { edges: [] } }),
      })
      // ArtworkMarkAsRecentlyViewedQuery
      resolveMostRecentRelayOperation(environment)
      // ArtworkBelowTheFoldQuery
      resolveMostRecentRelayOperation(environment, {
        Artwork: () => ({
          isUnlisted: false,
          isForSale: false,
          context: {
            isAuction: false,
          },
        }),
      })

      await flushPromiseQueue()

      expect(screen.queryByText("Auction")).toBeNull()
    })

    it("should be displayed if the work is in an auction", async () => {
      renderWithWrappers(<TestRenderer />, { includeNavigation: true })

      // ArtworkAboveTheFoldQuery
      resolveMostRecentRelayOperation(environment, {
        Artwork: () => ({
          isUnlisted: false,
          slug: "/whatever",
        }),
      })
      // ArtworkMarkAsRecentlyViewedQuery
      resolveMostRecentRelayOperation(environment)
      // ArtworkBelowTheFoldQuery
      resolveMostRecentRelayOperation(environment, {
        Artwork: () => ({
          isUnlisted: false,
          exhibitionHistory: null,
          provenance: null,
          literature: null,
          isEligibleForArtsyGuarantee: false,
          context: {
            __typename: "Sale",
            isAuction: true,
          },
        }),
      })

      await flushPromiseQueue()

      expect(screen.getByText("Auction")).toBeOnTheScreen()
      expect(screen.getByLabelText("Context Card Image")).toBeOnTheScreen()
    })
  })

  describe("About the work section", () => {
    it("should NOT be rendered", async () => {
      renderWithWrappers(<TestRenderer />, { includeNavigation: true })

      // ArtworkAboveTheFoldQuery
      resolveMostRecentRelayOperation(environment)
      // ArtworkMarkAsRecentlyViewedQuery
      resolveMostRecentRelayOperation(environment)
      // ArtworkBelowTheFoldQuery
      resolveMostRecentRelayOperation(environment, {
        Artwork: () => ({
          isUnlisted: false,
          description: null,
          additionalInformation: null,
        }),
      })

      await flushPromiseQueue()

      expect(screen.queryByText("About the work")).toBeNull()
    })

    it("should be rendered", async () => {
      renderWithWrappers(<TestRenderer />, { includeNavigation: true })

      // ArtworkAboveTheFoldQuery
      resolveMostRecentRelayOperation(environment)
      // ArtworkMarkAsRecentlyViewedQuery
      resolveMostRecentRelayOperation(environment)
      // ArtworkBelowTheFoldQuery
      resolveMostRecentRelayOperation(environment, {
        Artwork: () => ({
          isUnlisted: false,
          description: "Artwork Description",
        }),
      })

      await flushPromiseQueue()

      expect(screen.getByText("About the work")).toBeOnTheScreen()
    })
  })

  describe("Provenance/Exhibition history/Bibliography", () => {
    it("should NOT be rendered", async () => {
      renderWithWrappers(<TestRenderer />, { includeNavigation: true })

      // ArtworkAboveTheFoldQuery
      resolveMostRecentRelayOperation(environment)
      // ArtworkMarkAsRecentlyViewedQuery
      resolveMostRecentRelayOperation(environment)
      // ArtworkBelowTheFoldQuery
      resolveMostRecentRelayOperation(environment, {
        Artwork: () => ({
          isUnlisted: false,
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
      renderWithWrappers(<TestRenderer />, { includeNavigation: true })

      // ArtworkAboveTheFoldQuery
      resolveMostRecentRelayOperation(environment)
      // ArtworkMarkAsRecentlyViewedQuery
      resolveMostRecentRelayOperation(environment)
      // ArtworkBelowTheFoldQuery
      resolveMostRecentRelayOperation(environment, {
        Artwork: () => ({
          isUnlisted: false,
          provenance: "Text",
          exhibitionHistory: "Text",
          literature: "Text",
        }),
      })

      await flushPromiseQueue()

      expect(screen.getByText("Provenance")).toBeOnTheScreen()
      expect(screen.getByText("Exhibition history")).toBeOnTheScreen()
      expect(screen.getByText("Bibliography")).toBeOnTheScreen()
    })
  })

  describe("About the artist", () => {
    it("should NOT be rendered", async () => {
      renderWithWrappers(<TestRenderer />, { includeNavigation: true })

      // ArtworkAboveTheFoldQuery
      resolveMostRecentRelayOperation(environment)
      // ArtworkMarkAsRecentlyViewedQuery
      resolveMostRecentRelayOperation(environment)
      // ArtworkBelowTheFoldQuery
      resolveMostRecentRelayOperation(environment, {
        Artwork: () => ({
          isUnlisted: false,
          artist: null,
        }),
      })

      await flushPromiseQueue()

      expect(screen.queryByText("About the artist")).toBeNull()
    })

    it("should be rendered", async () => {
      renderWithWrappers(<TestRenderer />, { includeNavigation: true })

      // ArtworkAboveTheFoldQuery
      resolveMostRecentRelayOperation(environment)
      // ArtworkMarkAsRecentlyViewedQuery
      resolveMostRecentRelayOperation(environment)
      // ArtworkBelowTheFoldQuery
      resolveMostRecentRelayOperation(environment, {
        Artwork: () => ({
          isUnlisted: false,
          artist: {
            biographyBlurb: {
              text: "Artist Text",
            },
          },
        }),
      })

      await flushPromiseQueue()

      expect(screen.getByText("About the artist")).toBeOnTheScreen()
    })
  })

  describe("Other works", () => {
    it("should NOT be rendered", async () => {
      renderWithWrappers(<TestRenderer />, { includeNavigation: true })

      // ArtworkAboveTheFoldQuery
      resolveMostRecentRelayOperation(environment)
      // ArtworkMarkAsRecentlyViewedQuery
      resolveMostRecentRelayOperation(environment)
      // ArtworkBelowTheFoldQuery
      resolveMostRecentRelayOperation(environment, {
        Artwork: () => ({
          isUnlisted: false,
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
      renderWithWrappers(<TestRenderer />, { includeNavigation: true })

      // ArtworkAboveTheFoldQuery
      resolveMostRecentRelayOperation(environment, {
        Artwork() {
          return {
            collectorSignals: null,
            artist: null,
            isUnlisted: false,
            sale: null,
          }
        },
        Me: () => ({ partnerOffersConnection: { edges: [] } }),
      })
      // ArtworkMarkAsRecentlyViewedQuery
      resolveMostRecentRelayOperation(environment)
      // ArtworkBelowTheFoldQuery
      resolveMostRecentRelayOperation(environment, {
        Artwork: () => ({
          isUnlisted: false,
          // skip about the artist section
          artist: null,
          context: {
            isAuction: false,
          },
          artistSeriesConnection: null,
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

      expect(screen.getByText("Grid Name")).toBeOnTheScreen()
    })
  })

  describe("Unlisted Private Artworks", () => {
    it("renders correct components for unlisted private artworks", async () => {
      renderWithWrappers(<TestRenderer />, { includeNavigation: true })

      // ArtworkAboveTheFoldQuery
      resolveMostRecentRelayOperation(environment, {
        Artwork: () => ({ isUnlisted: true, collectorSignals: null }),
        Me: () => ({ partnerOffersConnection: { edges: [] } }),
      })
      // ArtworkMarkAsRecentlyViewedQuery
      resolveMostRecentRelayOperation(environment)
      // ArtworkBelowTheFoldQuery
      resolveMostRecentRelayOperation(environment, {
        Artwork: () => ({
          isUnlisted: true,
          isForSale: true,
          isInAuction: false,
          collectorSignals: null,
          partner: {
            type: "foo",
          },
          sale: {
            isBenefit: false,
            isGalleryAuction: false,
          },
        }),
      })

      await flushPromiseQueue()

      // Hidden in unlisted private artworks
      expect(screen.UNSAFE_queryByType(ArtworkHistory)).toBeNull()
      expect(screen.UNSAFE_queryByType(OtherWorksFragmentContainer)).toBeNull()
      expect(screen.UNSAFE_queryByType(ArtworksInSeriesRail)).toBeNull()
      expect(screen.UNSAFE_queryByType(ArtistSeriesMoreSeries)).toBeNull()

      // Displayed in unlisted private artworks
      expect(screen.UNSAFE_queryByType(ImageCarousel)).toBeTruthy()
      expect(screen.UNSAFE_queryByType(ArtworkDetails)).toBeTruthy()
      expect(screen.UNSAFE_queryByType(ShippingAndTaxesFragmentContainer)).toBeTruthy()
      expect(screen.UNSAFE_queryByType(PrivateArtworkExclusiveAccess)).toBeTruthy()
      expect(screen.UNSAFE_queryByType(PartnerCard)).toBeTruthy()
      expect(screen.UNSAFE_queryByType(PrivateArtworkMetadata)).toBeTruthy()

      expect(screen.getByText("Read More")).toBeTruthy()
    })

    it("tracks partner name taps", async () => {
      renderWithWrappers(<TestRenderer />, { includeNavigation: true })

      // ArtworkAboveTheFoldQuery
      resolveMostRecentRelayOperation(environment, {
        Artwork: () => ({
          isUnlisted: true,
        }),
      })
      // ArtworkMarkAsRecentlyViewedQuery
      resolveMostRecentRelayOperation(environment)
      // ArtworkBelowTheFoldQuery
      resolveMostRecentRelayOperation(environment, {
        Artwork: () => ({
          isUnlisted: true,
          isForSale: true,
          isInAuction: false,
          partner: {
            name: "Test Partner",
            type: "foo",
          },
          sale: {
            isBenefit: false,
            isGalleryAuction: false,
          },
        }),
      })

      await flushPromiseQueue()

      fireEvent.press(screen.getByTestId("test-partner-button"))

      expect(mockTrackEvent).toBeCalledWith({
        context_module: "artworkDetails",
        subject: "Gallery Name",
        type: "Link",
        flow: "Exclusive access",
      })
    })
  })

  describe("Order webview callbacks", () => {
    it("triggers navigating to the order details on Order Submission event", async () => {
      renderWithWrappers(<TestRenderer />, { includeNavigation: true })

      resolveMostRecentRelayOperation(environment)

      act(() => callback?.({ orderId: "order-id", isPurchase: false }))

      await flushPromiseQueue()

      expect(goBack).toHaveBeenCalled()

      await waitFor(() => expect(navigate).toHaveBeenCalledWith("/orders/order-id/details"))
    })
  })
})
