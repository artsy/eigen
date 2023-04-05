import { fireEvent, screen } from "@testing-library/react-native"
import { ArtistSeriesMoreSeries } from "app/Scenes/ArtistSeries/ArtistSeriesMoreSeries"
import { ArtworkDetails } from "app/Scenes/Artwork/Components/ArtworkDetails"
import { ArtworkHistory } from "app/Scenes/Artwork/Components/ArtworkHistory"
import { ArtworkScreenHeaderFragmentContainer } from "app/Scenes/Artwork/Components/ArtworkScreenHeader"
import { ArtworkStickyBottomContent } from "app/Scenes/Artwork/Components/ArtworkStickyBottomContent"
import { ImageCarousel } from "app/Scenes/Artwork/Components/ImageCarousel/ImageCarousel"
import {
  ArtworkFromLiveAuctionRegistrationClosed,
  RegisteredBidder,
  NotRegisteredToBid,
  ArtworkFromLiveAuctionRegistrationOpen,
} from "app/__fixtures__/ArtworkBidAction"
import { ArtworkFixture } from "app/__fixtures__/ArtworkFixture"

import { ModalStack } from "app/system/navigation/ModalStack"
import { navigationEvents } from "app/system/navigation/navigate"
import { flushPromiseQueue } from "app/utils/tests/flushPromiseQueue"
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"
import { renderWithWrappers, renderWithWrappersLEGACY } from "app/utils/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/utils/tests/resolveMostRecentRelayOperation"
import { merge } from "lodash"
import { Suspense } from "react"
import { ActivityIndicator } from "react-native"
import { createMockEnvironment } from "relay-test-utils"
import { Artwork, ArtworkPageableScreen } from "./Artwork"
import { ArtworksInSeriesRail } from "./Components/ArtworksInSeriesRail"
import { OtherWorksFragmentContainer } from "./Components/OtherWorks/OtherWorks"

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

  const TestRenderer = ({ isVisible = true, onLoad = jest.fn() }) => (
    // not 100% sure why we need a suspense fallback here but I guess new relay (v9) containers
    // use suspense and one of the containers in our tree is suspending itself only in tests :|
    <Suspense fallback={() => null}>
      <ModalStack>
        <ArtworkPageableScreen
          isVisible={isVisible}
          artworkID="ignored"
          environment={environment}
          tracking={{ trackEvent: jest.fn() } as any}
          onLoad={onLoad}
          pageableSlugs={[]}
        />
      </ModalStack>
    </Suspense>
  )

  beforeEach(() => {
    require("app/system/relay/createEnvironment").reset()
    environment = require("app/system/relay/createEnvironment").defaultEnvironment
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it("renders above the fold content before the full query has been resolved", async () => {
    renderWithWrappers(<TestRenderer />)

    // ArtworkAboveTheFoldQuery
    resolveMostRecentRelayOperation(environment)

    await flushPromiseQueue()

    expect(screen.UNSAFE_queryByType(ArtworkScreenHeaderFragmentContainer)).toBeTruthy()
    expect(screen.UNSAFE_queryByType(ImageCarousel)).toBeTruthy()
    expect(screen.UNSAFE_queryByType(ArtworkDetails)).toBeTruthy()
    expect(screen.UNSAFE_queryByType(ArtworkStickyBottomContent)).toBeTruthy()
    expect(screen.UNSAFE_queryByType(ActivityIndicator)).toBeTruthy()
  })

  it("renders all content after the full query has been resolved", async () => {
    renderWithWrappers(<TestRenderer />)

    // ArtworkAboveTheFoldQuery
    resolveMostRecentRelayOperation(environment)
    // ArtworkMarkAsRecentlyViewedQuery
    resolveMostRecentRelayOperation(environment)
    // ArtworkBelowTheFoldQuery
    resolveMostRecentRelayOperation(environment)

    await flushPromiseQueue()

    expect(screen.UNSAFE_queryByType(ArtworkScreenHeaderFragmentContainer)).toBeTruthy()
    expect(screen.UNSAFE_queryByType(ImageCarousel)).toBeTruthy()
    expect(screen.UNSAFE_queryByType(ArtworkDetails)).toBeTruthy()
    expect(screen.UNSAFE_queryByType(ActivityIndicator)).toBeNull()
    expect(screen.UNSAFE_queryByType(ArtworkHistory)).toBeTruthy()
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

      expect(screen.UNSAFE_queryByType(ArtistSeriesMoreSeries)).toBeTruthy()
      expect(screen.UNSAFE_queryByType(ArtworksInSeriesRail)).toBeTruthy()
    })

    it("does not render when there are no artist series to show", async () => {
      renderWithWrappers(<TestRenderer />)

      // ArtworkAboveTheFoldQuery
      resolveMostRecentRelayOperation(environment)
      // ArtworkMarkAsRecentlyViewedQuery
      resolveMostRecentRelayOperation(environment)
      // ArtworkBelowTheFoldQuery
      resolveMostRecentRelayOperation(environment, {
        Artwork: () => ({
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
      renderWithWrappers(<TestRenderer />)

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
    renderWithWrappers(<TestRenderer />)

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

    expect(screen.queryByLabelText("Artwork Details")).toBeTruthy()
  })

  it("updates the above-the-fold content on re-appear", async () => {
    // TODO: remove the use of renderWithWrappersLEGACY
    const tree = renderWithWrappersLEGACY(<TestRenderer />)

    // ArtworkAboveTheFoldQuery
    resolveMostRecentRelayOperation(environment, {
      Artwork() {
        return { slug: "my-special-artwork" }
      },
    })

    await flushPromiseQueue()

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
      it("for which I am registered", () => {
        renderWithWrappers(<TestRenderer />)

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

        expect(screen.queryByText("Enter live bidding")).toBeTruthy()
      })

      it("for which I am not registered and registration is open", async () => {
        renderWithWrappers(<TestRenderer />)

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

        expect(screen.queryByText("Watch live bidding")).toBeTruthy()
        expect(screen.queryByText("Registration closed")).toBeTruthy()
      })

      it("for which I am not registered and registration is closed", () => {
        renderWithWrappers(<TestRenderer />)

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

        expect(screen.queryByText("Enter live bidding")).toBeTruthy()
      })
    })
  })

  describe("Partner Section", () => {
    it("should display contact gallery button when partner is inquireable", () => {
      renderWithWrappers(<TestRenderer />)

      // ArtworkAboveTheFoldQuery
      resolveMostRecentRelayOperation(environment)

      // ArtworkMarkAsRecentlyViewedQuery
      resolveMostRecentRelayOperation(environment)

      // ArtworkBelowTheFoldQuery
      resolveMostRecentRelayOperation(environment, {
        Artwork: () => ({
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

      expect(screen.queryByText("Gallery")).toBeTruthy()
      expect(screen.queryByText("Questions about this piece?")).toBeTruthy()
      expect(screen.queryByText("Contact Gallery")).toBeTruthy()
    })

    it("should not display contact gallery button when partner is not inquireable", () => {
      renderWithWrappers(<TestRenderer />)

      // ArtworkAboveTheFoldQuery
      resolveMostRecentRelayOperation(environment)

      // ArtworkMarkAsRecentlyViewedQuery
      resolveMostRecentRelayOperation(environment)

      // ArtworkBelowTheFoldQuery
      resolveMostRecentRelayOperation(environment, {
        Artwork: () => ({
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

      expect(screen.queryByText("Gallery")).toBeTruthy()
      expect(screen.queryByText("Questions about this piece?")).toBeNull()
      expect(screen.queryByText("Contact Gallery")).toBeNull()
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
      renderWithWrappers(<TestRenderer />)

      // ArtworkAboveTheFoldQuery
      resolveMostRecentRelayOperation(environment)
      // ArtworkMarkAsRecentlyViewedQuery
      resolveMostRecentRelayOperation(environment)
      // ArtworkBelowTheFoldQuery
      resolveMostRecentRelayOperation(environment, {
        Artwork: () => ({
          isForSale: false,
          context: {
            isAuction: false,
          },
        }),
      })

      await flushPromiseQueue()

      expect(screen.queryByText("Auction")).toBeNull()
      expect(screen.UNSAFE_queryByType(OtherWorksFragmentContainer)).toBeTruthy()
    })

    it("should be displayed if the work is in an auction", async () => {
      renderWithWrappers(<TestRenderer />)

      // ArtworkAboveTheFoldQuery
      resolveMostRecentRelayOperation(environment, {
        Artwork: () => ({
          slug: "/whatever",
        }),
      })
      // ArtworkMarkAsRecentlyViewedQuery
      resolveMostRecentRelayOperation(environment)
      // ArtworkBelowTheFoldQuery
      resolveMostRecentRelayOperation(environment, {
        Artwork: () => ({
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

      expect(screen.queryByText("Auction")).toBeTruthy()
      expect(screen.queryByLabelText("Context Card Image")).toBeTruthy()
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
