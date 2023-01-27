import { fireEvent } from "@testing-library/react-native"
import {
  CommercialButtonsTestsRenderQuery,
  CommercialButtonsTestsRenderQuery$rawResponse,
} from "__generated__/CommercialButtonsTestsRenderQuery.graphql"
import { AuctionTimerState } from "app/Components/Bidding/Components/Timer"
import { ArtworkFixture } from "app/__fixtures__/ArtworkFixture"
import { navigate } from "app/system/navigation/navigate"
import { ArtworkInquiryContext } from "app/utils/ArtworkInquiry/ArtworkInquiryStore"
import { ArtworkInquiryContextState } from "app/utils/ArtworkInquiry/ArtworkInquiryTypes"
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"
import { resolveMostRecentRelayOperation } from "app/utils/tests/resolveMostRecentRelayOperation"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"
import { CommercialButtonsFragmentContainer } from "./CommercialButtons"

describe("CommercialButtons", () => {
  const setup = (auctionState?: any) => {
    return setupTestWrapper<CommercialButtonsTestsRenderQuery>({
      Component: (relayProps) => {
        if (relayProps?.artwork && relayProps.me) {
          return (
            <ArtworkInquiryContext.Provider
              value={{
                state,
                dispatch: jest.fn(),
              }}
            >
              <CommercialButtonsFragmentContainer
                artwork={relayProps.artwork}
                me={relayProps.me}
                auctionState={auctionState}
              />
            </ArtworkInquiryContext.Provider>
          )
        }
        return null
      },
      query: graphql`
        query CommercialButtonsTestsRenderQuery @relay_test_operation @raw_response_type {
          artwork(id: "artworkID") {
            ...CommercialButtons_artwork
          }
          me {
            ...CommercialButtons_me
          }
        }
      `,
    })
  }

  it("renders Make Offer button if isOfferable", () => {
    const artwork = {
      ...ArtworkFixture,
      isAcquireable: false,
      isOfferable: true,
      isInquireable: false,
      isForSale: true,
      isPriceHidden: false,
    }
    const { getByText } = setup().renderWithRelay({
      Artwork: () => artwork,
      Me: () => meFixture,
    })

    expect(getByText("Make an Offer")).toBeTruthy()
  })

  it("renders Buy Now button if isAcquireable", () => {
    const artwork = {
      ...ArtworkFixture,
      isAcquireable: true,
      isOfferable: false,
      isInquireable: false,
      isForSale: true,
      isPriceHidden: false,
    }
    const { getByText } = setup().renderWithRelay({
      Artwork: () => artwork,
      Me: () => meFixture,
    })

    expect(getByText("Purchase")).toBeTruthy()
  })

  it("renders Bid button if isInAuction & isBiddable", () => {
    const artwork = {
      ...ArtworkFixture,
      isAcquireable: false,
      isOfferable: false,
      isInquireable: false,
      isInAuction: true,
      isBiddable: true,
      isForSale: true,
      isPriceHidden: false,
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
    const { getByText } = setup(AuctionTimerState.LIVE_INTEGRATION_UPCOMING).renderWithRelay({
      Artwork: () => artwork,
      Me: () => meFixture,
    })

    expect(getByText("Bid")).toBeTruthy()
  })

  it("renders both Buy Now and Make Offer buttons when isOfferable and isAcquireable", () => {
    const artwork = {
      ...ArtworkFixture,
      isAcquireable: true,
      isOfferable: true,
      isInquireable: false,
      isForSale: true,
      isPriceHidden: false,
    }
    const { getByText } = setup().renderWithRelay({
      Artwork: () => artwork,
      Me: () => meFixture,
    })

    expect(getByText("Purchase")).toBeTruthy()
    expect(getByText("Make an Offer")).toBeTruthy()
  })

  it("commits the Buy Now mutation", () => {
    const artwork = {
      ...ArtworkFixture,
      isForSale: true,
      isAcquireable: true,
      isOfferable: true,
      isInquireable: false,
      isPriceHidden: false,
    }

    const { getByText, env } = setup().renderWithRelay({
      Artwork: () => artwork,
      Me: () => meFixture,
    })

    fireEvent.press(getByText("Purchase"))

    resolveMostRecentRelayOperation(env, {
      CommerceOrderWithMutationSuccess: () => ({
        order: {
          internalID: "buyNowID",
          mode: "BUY",
        },
      }),
    })

    expect(navigate).toHaveBeenCalledWith("/orders/buyNowID", {
      modal: true,
      passProps: {
        title: "Purchase",
      },
    })
  })

  it("commits the Make Offer mutation", () => {
    const artwork = {
      ...ArtworkFixture,
      isAcquireable: true,
      isOfferable: true,
      isInquireable: false,
      isForSale: true,
      isPriceHidden: false,
    }

    const { getByText, env } = setup().renderWithRelay({
      Artwork: () => artwork,
      Me: () => meFixture,
    })

    fireEvent.press(getByText("Make an Offer"))

    resolveMostRecentRelayOperation(env, {
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

  it("renders both Buy Now and Bid buttons when isInAuction and isBuyNowable", () => {
    const artwork = {
      ...ArtworkFixture,
      isAcquireable: true,
      isOfferable: false,
      isInquireable: false,
      isForSale: true,
      isInAuction: true,
      isBuyNowable: true,
      saleMessage: "$8000",
      isPriceHidden: false,

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
    const { getByText } = setup(AuctionTimerState.LIVE_INTEGRATION_UPCOMING).renderWithRelay({
      Artwork: () => artwork,
      Me: () => meFixture,
    })

    expect(getByText("Bid")).toBeTruthy()
    expect(getByText("Purchase $8000")).toBeTruthy()
  })

  it("doesn't render the Buy Now or Bid buttons when isInAuction and isBuyNowable but has sold via buy now", () => {
    const artwork = {
      ...ArtworkFixture,
      isAcquireable: false,
      isForSale: false,
      isOfferable: false,
      isInquireable: false,
      isInAuction: true,
      isBuyNowable: true,
      saleMessage: "$8000",
      isPriceHidden: false,
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
    const { queryByText } = setup(AuctionTimerState.LIVE_INTEGRATION_UPCOMING).renderWithRelay({
      Artwork: () => artwork,
      Me: () => meFixture,
    })

    expect(queryByText("Bid")).toBeFalsy()
    expect(queryByText("Increase max bid")).toBeFalsy()
    expect(queryByText("Purchase")).toBeFalsy()
  })

  it("renders both Make an Offer and Contact Gallery buttons when isOfferable and isInquiriable", () => {
    const artwork = {
      ...ArtworkFixture,
      isOfferable: true,
      isForSale: false,
      isInquireable: true,
      isPriceHidden: false,
    }

    const { getByText } = setup(AuctionTimerState.LIVE_INTEGRATION_UPCOMING).renderWithRelay({
      Artwork: () => artwork,
      Me: () => meFixture,
    })

    expect(getByText("Make an Offer")).toBeTruthy()
    expect(getByText("Contact Gallery")).toBeTruthy()
  })

  describe("tracking", () => {
    it("trackEvent called when Contact Gallery pressed given Offerable and Inquireable artwork", () => {
      const artwork = {
        ...ArtworkFixture,
        isOfferable: true,
        isForSale: false,
        isInquireable: true,
        isPriceHidden: false,
      }
      const { getByText } = setup(AuctionTimerState.LIVE_INTEGRATION_UPCOMING).renderWithRelay({
        Artwork: () => artwork,
        Me: () => meFixture,
      })

      fireEvent.press(getByText("Contact Gallery"))

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

    it("trackEvent called when Contact Gallery pressed given Inquireable artwork", () => {
      const artwork = {
        ...ArtworkFixture,
        isOfferable: true,
        isForSale: false,
        isInquireable: true,
        isPriceHidden: false,
      }
      const { getByText } = setup(AuctionTimerState.LIVE_INTEGRATION_UPCOMING).renderWithRelay({
        Artwork: () => artwork,
        Me: () => meFixture,
      })

      fireEvent.press(getByText("Contact Gallery"))

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

const meFixture: CommercialButtonsTestsRenderQuery$rawResponse["me"] = {
  id: "id",
  isIdentityVerified: true,
}
