import { fireEvent } from "@testing-library/react-native"
import { ArtworkCommercialButtons_Test_Query } from "__generated__/ArtworkCommercialButtons_Test_Query.graphql"
import { ArtworkFixture } from "app/__fixtures__/ArtworkFixture"
import { AuctionTimerState } from "app/Components/Bidding/Components/Timer"
import { navigate } from "app/navigation/navigate"
import { flushPromiseQueue } from "app/tests/flushPromiseQueue"
import { mockTrackEvent } from "app/tests/globallyMockedStuff"
import { renderWithHookWrappersTL } from "app/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/tests/resolveMostRecentRelayOperation"
import { ArtworkInquiryContext } from "app/utils/ArtworkInquiry/ArtworkInquiryStore"
import { ArtworkInquiryContextState } from "app/utils/ArtworkInquiry/ArtworkInquiryTypes"
import { graphql, useLazyLoadQuery } from "react-relay"
import { createMockEnvironment } from "relay-test-utils"
import { ArtworkStoreProvider } from "../ArtworkStore"
import { ArtworkCommercialButtons } from "./ArtworkCommercialButtons"

jest.unmock("react-relay")

interface WrapperProps {
  auctionState?: AuctionTimerState
}

describe("ArtworkCommercialButtons", () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>

  beforeEach(() => {
    mockEnvironment = createMockEnvironment()
  })

  const TestWrapper = (props: WrapperProps) => {
    const data = useLazyLoadQuery<ArtworkCommercialButtons_Test_Query>(
      graphql`
        query ArtworkCommercialButtons_Test_Query {
          artwork(id: "artworkID") {
            ...ArtworkCommercialButtons_artwork
          }

          me {
            ...ArtworkCommercialButtons_me
          }
        }
      `,
      {}
    )

    if (data.artwork && data.me) {
      return (
        <ArtworkInquiryContext.Provider
          value={{
            state,
            dispatch: jest.fn(),
          }}
        >
          <ArtworkStoreProvider initialData={{ auctionState: props.auctionState ?? null }}>
            <ArtworkCommercialButtons artwork={data.artwork} me={data.me} />
          </ArtworkStoreProvider>
        </ArtworkInquiryContext.Provider>
      )
    }

    return null
  }

  it("renders Make Offer button if isOfferable", async () => {
    const artwork = {
      ...ArtworkFixture,
      isAcquireable: false,
      isOfferable: true,
      isInquireable: false,
    }
    const { getByText } = renderWithHookWrappersTL(<TestWrapper />, mockEnvironment)

    resolveMostRecentRelayOperation(mockEnvironment, {
      Artwork: () => artwork,
      Me: () => meFixture,
    })
    await flushPromiseQueue()

    expect(getByText("Make an Offer")).toBeTruthy()
  })

  it("renders Purchase button if isAcquireable", async () => {
    const artwork = {
      ...ArtworkFixture,
      isAcquireable: true,
      isOfferable: false,
      isInquireable: false,
    }
    const { getByText } = renderWithHookWrappersTL(<TestWrapper />, mockEnvironment)

    resolveMostRecentRelayOperation(mockEnvironment, {
      Artwork: () => artwork,
      Me: () => meFixture,
    })
    await flushPromiseQueue()

    expect(getByText("Purchase")).toBeTruthy()
  })

  it("renders Bid button if isInAuction & isBiddable", async () => {
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
    const { getByText } = renderWithHookWrappersTL(
      <TestWrapper auctionState={AuctionTimerState.LIVE_INTEGRATION_UPCOMING} />,
      mockEnvironment
    )

    resolveMostRecentRelayOperation(mockEnvironment, {
      Artwork: () => artwork,
      Me: () => meFixture,
    })
    await flushPromiseQueue()

    expect(getByText("Bid")).toBeTruthy()
  })

  it("renders both Purchase and Make Offer buttons when isOfferable and isAcquireable", async () => {
    const artwork = {
      ...ArtworkFixture,
      isAcquireable: true,
      isOfferable: true,
      isInquireable: false,
    }
    const { getByText } = renderWithHookWrappersTL(<TestWrapper />, mockEnvironment)

    resolveMostRecentRelayOperation(mockEnvironment, {
      Artwork: () => artwork,
      Me: () => meFixture,
    })
    await flushPromiseQueue()

    expect(getByText("Purchase")).toBeTruthy()
    expect(getByText("Make an Offer")).toBeTruthy()
  })

  it("renders both Buy Now and Bid buttons when isInAuction and isBuyNowable", async () => {
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
    const { getByText } = renderWithHookWrappersTL(
      <TestWrapper auctionState={AuctionTimerState.LIVE_INTEGRATION_UPCOMING} />,
      mockEnvironment
    )

    resolveMostRecentRelayOperation(mockEnvironment, {
      Artwork: () => artwork,
      Me: () => meFixture,
    })
    await flushPromiseQueue()

    expect(getByText("Bid")).toBeTruthy()
    expect(getByText("Purchase $8000")).toBeTruthy()
  })

  it("renders both Make an Offer and Contact Gallery buttons when isOfferable and isInquiriable", async () => {
    const artwork = {
      ...ArtworkFixture,
      isOfferable: true,
      isInquireable: true,
    }

    const { getByText } = renderWithHookWrappersTL(
      <TestWrapper auctionState={AuctionTimerState.LIVE_INTEGRATION_UPCOMING} />,
      mockEnvironment
    )

    resolveMostRecentRelayOperation(mockEnvironment, {
      Artwork: () => artwork,
      Me: () => meFixture,
    })
    await flushPromiseQueue()

    expect(getByText("Make an Offer")).toBeTruthy()
    expect(getByText("Contact Gallery")).toBeTruthy()
  })

  describe("commits", () => {
    it("the Purchase mutation", async () => {
      const artwork = {
        ...ArtworkFixture,
        isAcquireable: true,
        isOfferable: true,
        isInquireable: false,
      }

      const { getByText } = renderWithHookWrappersTL(<TestWrapper />, mockEnvironment)

      resolveMostRecentRelayOperation(mockEnvironment, {
        Artwork: () => artwork,
        Me: () => meFixture,
      })
      await flushPromiseQueue()

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

    it("the Make Offer mutation", async () => {
      const artwork = {
        ...ArtworkFixture,
        isAcquireable: true,
        isOfferable: true,
        isInquireable: false,
      }

      const { getByText } = renderWithHookWrappersTL(<TestWrapper />, mockEnvironment)

      resolveMostRecentRelayOperation(mockEnvironment, {
        Artwork: () => artwork,
        Me: () => meFixture,
      })
      await flushPromiseQueue()

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
  })

  describe("tracking", () => {
    it("trackEvent called when Contact Gallery pressed given Offerable and Inquireable artwork", async () => {
      const artwork = {
        ...ArtworkFixture,
        isOfferable: true,
        isInquireable: true,
      }
      const { getByText } = renderWithHookWrappersTL(
        <TestWrapper auctionState={AuctionTimerState.LIVE_INTEGRATION_UPCOMING} />,
        mockEnvironment
      )

      resolveMostRecentRelayOperation(mockEnvironment, {
        Artwork: () => artwork,
        Me: () => meFixture,
      })
      await flushPromiseQueue()

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

    it("trackEvent called when Contact Gallery pressed given Inquireable artwork", async () => {
      const artwork = {
        ...ArtworkFixture,
        isOfferable: true,
        isInquireable: true,
      }
      const { getByText } = renderWithHookWrappersTL(
        <TestWrapper auctionState={AuctionTimerState.LIVE_INTEGRATION_UPCOMING} />,
        mockEnvironment
      )

      resolveMostRecentRelayOperation(mockEnvironment, {
        Artwork: () => artwork,
        Me: () => meFixture,
      })
      await flushPromiseQueue()

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

const meFixture = {
  id: "id",
  isIdentityVerified: true,
}
