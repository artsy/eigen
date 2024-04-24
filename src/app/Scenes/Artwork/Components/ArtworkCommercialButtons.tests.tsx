import { fireEvent, screen } from "@testing-library/react-native"
import { ArtworkCommercialButtons_Test_Query } from "__generated__/ArtworkCommercialButtons_Test_Query.graphql"
import { AuctionTimerState } from "app/Components/Bidding/Components/Timer"
import { ArtworkStoreProvider } from "app/Scenes/Artwork/ArtworkStore"
import { ArtworkFixture } from "app/__fixtures__/ArtworkFixture"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { navigate } from "app/system/navigation/navigate"
import { ArtworkInquiryContext } from "app/utils/ArtworkInquiry/ArtworkInquiryStore"
import { ArtworkInquiryContextState } from "app/utils/ArtworkInquiry/ArtworkInquiryTypes"
import { extractNodes } from "app/utils/extractNodes"
import { flushPromiseQueue } from "app/utils/tests/flushPromiseQueue"
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"
import { ArtworkCommercialButtons } from "./ArtworkCommercialButtons"

beforeEach(() => {
  __globalStoreTestUtils__?.injectFeatureFlags({ AREnablePartnerOfferOnArtworkScreen: true })
})

describe("ArtworkCommercialButtons", () => {
  const { renderWithRelay } = setupTestWrapper<ArtworkCommercialButtons_Test_Query>({
    Component: (props) => {
      const partnerOffer = extractNodes(props.me!.partnerOffersConnection)[0]

      return (
        <ArtworkInquiryContext.Provider
          value={{
            state,
            dispatch: jest.fn(),
          }}
        >
          <ArtworkStoreProvider>
            <ArtworkCommercialButtons
              partnerOffer={partnerOffer}
              artwork={props.artwork!}
              me={props.me!}
            />
          </ArtworkStoreProvider>
        </ArtworkInquiryContext.Provider>
      )
    },
    query: graphql`
      query ArtworkCommercialButtons_Test_Query {
        artwork(id: "artworkID") {
          ...ArtworkCommercialButtons_artwork
        }

        me {
          ...ArtworkCommercialButtons_me
          partnerOffersConnection(artworkID: "artworkID") {
            edges {
              node {
                ...ArtworkCommercialButtons_partnerOffer
              }
            }
          }
        }
      }
    `,
  })

  it("renders Purchase button if artwork is only acquireable", async () => {
    const artwork = {
      ...ArtworkFixture,
      isAcquireable: true,
      isOfferable: false,
      isInquireable: false,
    }

    renderWithRelay({
      Artwork: () => artwork,
      Me: () => meFixture,
    })

    expect(screen.getByText("Purchase")).toBeTruthy()
    expect(screen.queryByText("Make an Offer")).toBeFalsy()
    expect(screen.queryByText("Contact Gallery")).toBeFalsy()
  })

  it("renders Purchase button if artwork is only acquireable and with a partner offer", async () => {
    const artwork = {
      ...ArtworkFixture,
      isAcquireable: true,
      isOfferable: false,
      isInquireable: false,
    }

    renderWithRelay({
      Artwork: () => artwork,
      Me: () => meWithPartnerOfferFixture,
    })

    expect(screen.getByText("Purchase")).toBeTruthy()
    expect(screen.queryByText("Make an Offer")).toBeFalsy()
    expect(screen.queryByText("Contact Gallery")).toBeFalsy()
  })

  it("renders Make an Offer button if artwork is only offerable", async () => {
    const artwork = {
      ...ArtworkFixture,
      isAcquireable: false,
      isOfferable: true,
      isInquireable: false,
    }

    renderWithRelay({
      Artwork: () => artwork,
      Me: () => meFixture,
    })

    expect(screen.queryByText("Purchase")).toBeFalsy()
    expect(screen.getByText("Make an Offer")).toBeTruthy()
    expect(screen.queryByText("Contact Gallery")).toBeFalsy()
  })

  it("renders Contact Gallery button if artwork is only inquireable", async () => {
    const artwork = {
      ...ArtworkFixture,
      isAcquireable: false,
      isOfferable: false,
      isInquireable: true,
    }

    renderWithRelay({
      Artwork: () => artwork,
      Me: () => meFixture,
    })

    expect(screen.queryByText("Purchase")).toBeFalsy()
    expect(screen.queryByText("Make an Offer")).toBeFalsy()
    expect(screen.getByText("Contact Gallery")).toBeTruthy()
  })

  it("renders Purchase and Make an Offer buttons if artwork is offerable and acquireable", async () => {
    const artwork = {
      ...ArtworkFixture,
      isAcquireable: true,
      isOfferable: true,
      isInquireable: false,
    }
    renderWithRelay({
      Artwork: () => artwork,
      Me: () => meFixture,
    })

    expect(screen.getByText("Purchase")).toBeTruthy()
    expect(screen.getByText("Make an Offer")).toBeTruthy()
    expect(screen.queryByText("Contact Gallery")).toBeFalsy()
  })

  it("renders Purchase and Make an Offer buttons if artwork is only offerable and with a partner offer", async () => {
    const artwork = {
      ...ArtworkFixture,
      isAcquireable: false,
      isOfferable: true,
      isInquireable: false,
    }
    renderWithRelay({
      Artwork: () => artwork,
      Me: () => meWithPartnerOfferFixture,
    })

    expect(screen.getByText("Purchase")).toBeTruthy()
    expect(screen.getByText("Make an Offer")).toBeTruthy()
    expect(screen.queryByText("Contact Gallery")).toBeFalsy()
  })

  it("renders Purchase and Make an Offer buttons if artwork is offerable and acquireable and with a partner offer", async () => {
    const artwork = {
      ...ArtworkFixture,
      isAcquireable: true,
      isOfferable: true,
      isInquireable: false,
    }
    renderWithRelay({
      Artwork: () => artwork,
      Me: () => meWithPartnerOfferFixture,
    })

    expect(screen.getByText("Purchase")).toBeTruthy()
    expect(screen.getByText("Make an Offer")).toBeTruthy()
    expect(screen.queryByText("Contact Gallery")).toBeFalsy()
  })

  it("renders Make an Offer and Contact Gallery buttons if artwork is offerable and inquireable", async () => {
    const artwork = {
      ...ArtworkFixture,
      isOfferable: true,
      isInquireable: true,
    }

    renderWithRelay(
      {
        Artwork: () => artwork,
        Me: () => meFixture,
      },
      {
        auctionState: AuctionTimerState.LIVE_INTEGRATION_UPCOMING,
      }
    )

    expect(screen.queryByText("Purchase")).toBeFalsy()
    expect(screen.getByText("Make an Offer")).toBeTruthy()
    expect(screen.getByText("Contact Gallery")).toBeTruthy()
  })

  it("renders Purchase and Contact Gallery buttons if artwork is offerable and inquireable and with a partner offer", async () => {
    const artwork = {
      ...ArtworkFixture,
      isAcquireable: false,
      isOfferable: true,
      isInquireable: true,
    }

    renderWithRelay({
      Artwork: () => artwork,
      Me: () => meWithPartnerOfferFixture,
    })

    expect(screen.getByText("Purchase")).toBeTruthy()
    expect(screen.queryByText("Make an Offer")).toBeFalsy()
    expect(screen.getByText("Contact Gallery")).toBeTruthy()
  })

  it("renders Bid button if artwork is in acution and biddable", async () => {
    const artwork = {
      ...ArtworkFixture,
      isAcquireable: false,
      isOfferable: false,
      isInquireable: false,
      isInAuction: true,
      sale: {
        slug: "kieran-testing-ios-artwork-page",
        internalID: "5d52f117d063bc0007bcb111",
        registrationStatus: null,
        isPreview: false,
        isOpen: true,
        isLiveOpen: false,
        isClosed: false,
        isRegistrationClosed: false,
        requireIdentityVerification: false,
      },
      saleArtwork: {
        increments: [
          {
            cents: 1600000,
            display: "CHF16,000",
          },
        ],
      },
    }

    renderWithRelay(
      {
        Artwork: () => artwork,
        Me: () => meFixture,
      },
      { auctionState: AuctionTimerState.LIVE_INTEGRATION_UPCOMING }
    )

    expect(screen.getByText("Bid")).toBeTruthy()
  })

  it("renders Purchase and Bid buttons if artwork is in auction and buynowable", async () => {
    const artwork = {
      ...ArtworkFixture,
      isAcquireable: true,
      isOfferable: false,
      isInquireable: false,
      isInAuction: true,
      isBuyNowable: true,
      saleMessage: "$8000",

      sale: {
        isClosed: false,
        registrationStatus: null,
        isPreview: false,
        isOpen: true,
        isLiveOpen: false,
        isRegistrationClosed: false,
        requireIdentityVerification: false,
      },
      saleArtwork: {
        increments: [{ cents: 320000, display: "€3,200" }],
      },
    }

    renderWithRelay(
      {
        Artwork: () => artwork,
        Me: () => meFixture,
      },
      {
        auctionState: AuctionTimerState.LIVE_INTEGRATION_UPCOMING,
      }
    )

    expect(screen.getByText("Bid")).toBeTruthy()
    expect(screen.getByText("Purchase $8000")).toBeTruthy()
  })

  describe("commits", () => {
    it("the Partner Offer mutation when a partner offer is present", async () => {
      const artwork = {
        ...ArtworkFixture,
        isAcquireable: true,
        isOfferable: true,
        isInquireable: false,
      }

      const meWithPartnerOffer = {
        ...meFixture,
        partnerOffersConnection: {
          edges: [
            {
              node: {
                internalID: "partnerOfferID",
                // End 1 minute in the future
                endAt: new Date(Date.now() + 60 * 1000).toISOString(),
              },
            },
          ],
        },
      }

      const { mockResolveLastOperation, env } = renderWithRelay({
        Artwork: () => artwork,
        Me: () => meWithPartnerOffer,
      })

      fireEvent.press(screen.getByText("Purchase"))

      expect(env.mock.getMostRecentOperation().request.node.operation.name).toBe(
        "usePartnerOfferCheckoutMutation"
      )

      mockResolveLastOperation({
        CommerceOrderWithMutationSuccess: () => ({
          order: {
            internalID: "buyNowID",
            mode: "BUY",
          },
        }),
      })

      await flushPromiseQueue()

      expect(navigate).toHaveBeenCalledWith("/orders/buyNowID")
    })

    it("the Purchase mutation", async () => {
      const artwork = {
        ...ArtworkFixture,
        isAcquireable: true,
        isOfferable: true,
        isInquireable: false,
      }

      const { mockResolveLastOperation, env } = renderWithRelay({
        Artwork: () => artwork,
        Me: () => meFixture,
      })

      fireEvent.press(screen.getByText("Purchase"))

      expect(env.mock.getMostRecentOperation().request.node.operation.name).toBe(
        "useCreateOrderMutation"
      )

      mockResolveLastOperation({
        CommerceOrderWithMutationSuccess: () => ({
          order: {
            internalID: "buyNowID",
            mode: "BUY",
          },
        }),
      })

      await flushPromiseQueue()
      expect(navigate).toHaveBeenCalledWith("/orders/buyNowID", {
        passProps: {
          title: "Purchase",
        },
      })
    })

    it("the Make Offer mutation", async () => {
      const artwork = {
        ...ArtworkFixture,
        isAcquireable: true,
        isOfferable: true,
        isInquireable: false,
      }

      const { mockResolveLastOperation } = renderWithRelay({
        Artwork: () => artwork,
        Me: () => meFixture,
      })

      fireEvent.press(screen.getByText("Make an Offer"))

      mockResolveLastOperation({
        CommerceOrderWithMutationSuccess: () => ({
          order: {
            internalID: "makeOfferID",
            mode: "OFFER",
          },
        }),
      })

      expect(navigate).toHaveBeenCalledWith("/orders/makeOfferID", {
        passProps: {
          orderID: "makeOfferID",
          title: "Make Offer",
        },
      })
    })
  })

  describe("tracking", () => {
    it("trackEvent called when Contact Gallery pressed given Offerable and Inquireable artwork", async () => {
      const artwork = {
        ...ArtworkFixture,
        isOfferable: true,
        isInquireable: true,
      }

      renderWithRelay(
        {
          Artwork: () => artwork,
          Me: () => meFixture,
        },
        { auctionState: AuctionTimerState.LIVE_INTEGRATION_UPCOMING }
      )

      fireEvent.press(screen.getByText("Contact Gallery"))

      expect(mockTrackEvent.mock.calls[0]).toMatchInlineSnapshot(`
        [
          {
            "action": "tappedContactGallery",
            "context_owner_id": "5b2b745e9c18db204fc32e11",
            "context_owner_slug": "andreas-rod-prinzknecht",
            "context_owner_type": "artwork",
          },
        ]
      `)
    })

    it("trackEvent called when Contact Gallery pressed given Inquireable artwork", async () => {
      const artwork = {
        ...ArtworkFixture,
        isOfferable: true,
        isInquireable: true,
      }

      renderWithRelay(
        {
          Artwork: () => artwork,
          Me: () => meFixture,
        },
        {
          auctionState: AuctionTimerState.LIVE_INTEGRATION_UPCOMING,
        }
      )

      fireEvent.press(screen.getByText("Contact Gallery"))

      expect(mockTrackEvent.mock.calls[0]).toMatchInlineSnapshot(`
        [
          {
            "action": "tappedContactGallery",
            "context_owner_id": "5b2b745e9c18db204fc32e11",
            "context_owner_slug": "andreas-rod-prinzknecht",
            "context_owner_type": "artwork",
          },
        ]
      `)
    })
  })
})

const state: ArtworkInquiryContextState = {
  shippingLocation: null,
  inquiryType: null,
  message: null,
  inquiryQuestions: [],
}

const meFixture = {
  id: "id",
  isIdentityVerified: true,
  partnerOffersConnection: { edges: [] },
}

const meWithPartnerOfferFixture = {
  id: "id",
  isIdentityVerified: true,
  partnerOffersConnection: {
    edges: [
      {
        node: {
          internalID: "partnerOfferID",
          endAt: new Date(Date.now() + 60 * 1000).toISOString(),
        },
      },
    ],
  },
}
