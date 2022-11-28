import { fireEvent } from "@testing-library/react-native"
import {
  CommercialButtonsTestsRenderQuery,
  CommercialButtonsTestsRenderQuery$rawResponse,
} from "__generated__/CommercialButtonsTestsRenderQuery.graphql"
import { ArtworkFixture } from "app/__fixtures__/ArtworkFixture"
import { AuctionTimerState } from "app/Components/Bidding/Components/Timer"
import { navigate } from "app/navigation/navigate"
import { mockTrackEvent } from "app/tests/globallyMockedStuff"
import { renderWithWrappers } from "app/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/tests/resolveMostRecentRelayOperation"
import { ArtworkInquiryContext } from "app/utils/ArtworkInquiry/ArtworkInquiryStore"
import { ArtworkInquiryContextState } from "app/utils/ArtworkInquiry/ArtworkInquiryTypes"
import { graphql, QueryRenderer } from "react-relay"
import { createMockEnvironment } from "relay-test-utils"
import { CommercialButtonsFragmentContainer } from "./CommercialButtons"

jest.unmock("react-relay")

interface WrapperProps {
  auctionState?: AuctionTimerState
}

describe("CommercialButtons", () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>

  beforeEach(() => {
    mockEnvironment = createMockEnvironment()
  })

  const TestWrapper = (props: WrapperProps) => {
    return (
      <ArtworkInquiryContext.Provider
        value={{
          state,
          dispatch: jest.fn(),
        }}
      >
        <QueryRenderer<CommercialButtonsTestsRenderQuery>
          environment={mockEnvironment}
          query={graphql`
            query CommercialButtonsTestsRenderQuery @relay_test_operation @raw_response_type {
              artwork(id: "artworkID") {
                ...CommercialButtons_artwork
              }
              me {
                ...CommercialButtons_me
              }
            }
          `}
          variables={{}}
          render={({ props: relayProps }) => {
            if (relayProps?.artwork && relayProps.me) {
              return (
                <CommercialButtonsFragmentContainer
                  {...props}
                  artwork={relayProps.artwork}
                  me={relayProps.me}
                  auctionState={props.auctionState as any}
                />
              )
            }
            return null
          }}
        />
      </ArtworkInquiryContext.Provider>
    )
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
    const { getByText } = renderWithWrappers(<TestWrapper />)

    resolveMostRecentRelayOperation(mockEnvironment, {
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
    const { getByText } = renderWithWrappers(<TestWrapper />)

    resolveMostRecentRelayOperation(mockEnvironment, {
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
    const { getByText } = renderWithWrappers(
      <TestWrapper auctionState={AuctionTimerState.LIVE_INTEGRATION_UPCOMING} />
    )

    resolveMostRecentRelayOperation(mockEnvironment, {
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
    const { getByText } = renderWithWrappers(<TestWrapper />)

    resolveMostRecentRelayOperation(mockEnvironment, {
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

    const { getByText } = renderWithWrappers(<TestWrapper />)

    resolveMostRecentRelayOperation(mockEnvironment, {
      Artwork: () => artwork,
      Me: () => meFixture,
    })

    fireEvent.press(getByText("Purchase"))

    resolveMostRecentRelayOperation(mockEnvironment, {
      CommerceOrderWithMutationSuccess: () => ({
        order: {
          internalID: "buyNowID",
          mode: "BUY",
        },
      }),
    })

    expect(navigate).toHaveBeenCalledWith("/orders/buyNowID", {
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

    const { getByText } = renderWithWrappers(<TestWrapper />)

    resolveMostRecentRelayOperation(mockEnvironment, {
      Artwork: () => artwork,
      Me: () => meFixture,
    })

    fireEvent.press(getByText("Make an Offer"))

    resolveMostRecentRelayOperation(mockEnvironment, {
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
    const { getByText } = renderWithWrappers(
      <TestWrapper auctionState={AuctionTimerState.LIVE_INTEGRATION_UPCOMING} />
    )

    resolveMostRecentRelayOperation(mockEnvironment, {
      Artwork: () => artwork,
      Me: () => meFixture,
    })

    expect(getByText("Bid")).toBeTruthy()
    expect(getByText("Purchase $8000")).toBeTruthy()
  })

  // TODO: Copy test case for ArtworkStickyBottomContent
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
    const { queryByText } = renderWithWrappers(
      <TestWrapper auctionState={AuctionTimerState.LIVE_INTEGRATION_UPCOMING} />
    )

    resolveMostRecentRelayOperation(mockEnvironment, {
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

    const { getByText } = renderWithWrappers(
      <TestWrapper auctionState={AuctionTimerState.LIVE_INTEGRATION_UPCOMING} />
    )

    resolveMostRecentRelayOperation(mockEnvironment, {
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
      const { getByText } = renderWithWrappers(
        <TestWrapper auctionState={AuctionTimerState.LIVE_INTEGRATION_UPCOMING} />
      )

      resolveMostRecentRelayOperation(mockEnvironment, {
        Artwork: () => artwork,
        Me: () => meFixture,
      })

      fireEvent.press(getByText("Contact Gallery"))

      expect(mockTrackEvent.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          Object {
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
      const { getByText } = renderWithWrappers(
        <TestWrapper auctionState={AuctionTimerState.LIVE_INTEGRATION_UPCOMING} />
      )

      resolveMostRecentRelayOperation(mockEnvironment, {
        Artwork: () => artwork,
        Me: () => meFixture,
      })

      fireEvent.press(getByText("Contact Gallery"))

      expect(mockTrackEvent.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          Object {
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
  identityVerified: true,
}
