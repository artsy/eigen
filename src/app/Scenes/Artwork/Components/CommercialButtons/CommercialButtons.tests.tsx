import { CommercialButtonsTestsMutationQuery$data } from "__generated__/CommercialButtonsTestsMutationQuery.graphql"
import { CommercialButtonsTestsRenderQuery$data } from "__generated__/CommercialButtonsTestsRenderQuery.graphql"
import { ArtworkFixture } from "app/__fixtures__/ArtworkFixture"
import { navigate } from "app/navigation/navigate"
import { __globalStoreTestUtils__, GlobalStoreProvider } from "app/store/GlobalStore"
import { flushPromiseQueue } from "app/tests/flushPromiseQueue"
import { renderRelayTree } from "app/tests/renderRelayTree"
import { ArtworkInquiryContext } from "app/utils/ArtworkInquiry/ArtworkInquiryStore"
import { ArtworkInquiryContextState } from "app/utils/ArtworkInquiry/ArtworkInquiryTypes"
import { Button, Theme } from "palette"
import React from "react"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { FragmentRef, graphql } from "react-relay"
import { useTracking } from "react-tracking"
import { CommercialButtonsFragmentContainer } from "./CommercialButtons"

jest.unmock("react-relay")

const trackEvent = useTracking().trackEvent

const componentWithQuery = async ({
  // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
  mockArtworkData,
  // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
  mockOrderMutationResults,
  // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
  mockOfferMutationResults,
}) => {
  return await renderRelayTree({
    Component: CommercialButtonsFragmentContainer,
    query: graphql`
      query CommercialButtonsTestsMutationQuery @raw_response_type {
        artwork(id: "artworkID") {
          ...CommercialButtons_artwork
        }
      }
    `,
    mockData: { artwork: mockArtworkData } as CommercialButtonsTestsMutationQuery$data,
    mockMutationResults: {
      commerceCreateOrderWithArtwork: mockOrderMutationResults,
      commerceCreateOfferOrderWithArtwork: mockOfferMutationResults,
    },
  })
}

const state: ArtworkInquiryContextState = {
  shippingLocation: null,
  inquiryType: null,
  message: null,
  inquiryQuestions: [],
}

const wrapper = (mockArtwork: FragmentRef<"CommercialButtons_artwork">): JSX.Element => (
  <SafeAreaProvider>
    <GlobalStoreProvider>
      <Theme>
        <ArtworkInquiryContext.Provider
          value={{
            state,
            dispatch: jest.fn(),
          }}
        >
          {/* @ts-ignore */}
          <CommercialButtonsFragmentContainer artwork={mockArtwork} />
        </ArtworkInquiryContext.Provider>
      </Theme>
    </GlobalStoreProvider>
  </SafeAreaProvider>
)

// @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
const relayComponent = async ({ artwork }) => {
  return await renderRelayTree({
    // @ts-ignore
    Component: () => wrapper(artwork),
    query: graphql`
      query CommercialButtonsTestsRenderQuery @raw_response_type {
        artwork(id: "artworkID") {
          ...CommercialButtons_artwork
        }
      }
    `,
    mockData: { artwork } as CommercialButtonsTestsRenderQuery$data,
  })
}

describe("CommercialButtons", () => {
  it("renders Make Offer button if isOfferable", async () => {
    const artwork = {
      ...ArtworkFixture,
      isAcquireable: false,
      isOfferable: true,
      isInquireable: false,
      isForSale: true,
      isPriceHidden: false,
    }
    const commercialButtons = await relayComponent({
      artwork,
    })
    expect(commercialButtons.text()).toContain("Make an Offer")
  })

  it("renders Buy Now button if isAcquireable", async () => {
    const artwork = {
      ...ArtworkFixture,
      isAcquireable: true,
      isOfferable: false,
      isInquireable: false,
      isForSale: true,
      isPriceHidden: false,
    }
    const commercialButtons = await relayComponent({
      artwork,
    })
    expect(commercialButtons.text()).toContain("Purchase")
  })

  it("renders Bid button if isInAuction & isBiddable", async () => {
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
    const commercialButtons = await relayComponent({
      artwork,
    })
    expect(commercialButtons.text()).toContain("Bid")
  })

  it("renders both Buy Now and Make Offer buttons when isOfferable and isAcquireable", async () => {
    const artwork = {
      ...ArtworkFixture,
      isAcquireable: true,
      isOfferable: true,
      isInquireable: false,
      isForSale: true,
      isPriceHidden: false,
    }
    const commercialButtons = await relayComponent({
      artwork,
    })
    expect(commercialButtons.find(Button).at(0).text()).toContain("Purchase")
    expect(commercialButtons.find(Button).at(1).text()).toContain("Make an Offer")
  })

  it("commits the Buy Now mutation", async () => {
    const artwork = {
      ...ArtworkFixture,
      isForSale: true,
      isAcquireable: true,
      isOfferable: true,
      isInquireable: false,
      isPriceHidden: false,
    }

    const commercialButtons = await componentWithQuery({
      mockArtworkData: artwork,
      mockOrderMutationResults: {
        orderOrError: {
          __typename: "CommerceOrderWithMutationSuccess",
          order: { internalID: "buyNowID", __typename: "CommerceBuyOrder", mode: "BUY" },
        },
      },
      mockOfferMutationResults: {},
    })

    const BuyNowButton = commercialButtons.find(Button).at(0)
    BuyNowButton.props().onPress()
    await flushPromiseQueue()
    expect(navigate).toHaveBeenCalledWith("/orders/buyNowID", {
      modal: true,
      passProps: { title: "Buy Now" },
    })
  })

  it("commits the Make Offer mutation", async () => {
    const artwork = {
      ...ArtworkFixture,
      isAcquireable: true,
      isOfferable: true,
      isInquireable: false,
      isForSale: true,
      isPriceHidden: false,
    }

    const commercialButtons = await componentWithQuery({
      mockArtworkData: artwork,
      mockOrderMutationResults: {},
      mockOfferMutationResults: {
        orderOrError: {
          __typename: "CommerceOrderWithMutationSuccess",
          order: { internalID: "makeOfferID", __typename: "CommerceOfferOrder", mode: "OFFER" },
        },
      },
    })

    const MakeOfferButton = commercialButtons.find(Button).at(1)
    MakeOfferButton.props().onPress()
    await flushPromiseQueue()

    expect(navigate).toHaveBeenCalledWith("/orders/makeOfferID", {
      modal: true,
      passProps: {
        orderID: "makeOfferID",
        title: "Make Offer",
      },
    })
  })

  it("renders both Buy Now and Bid buttons when isInAuction and isBuyNowable", async () => {
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
    const commercialButtons = await relayComponent({
      artwork,
    })
    expect(commercialButtons.find(Button).at(0).text()).toContain("Bid")
    expect(commercialButtons.find(Button).at(1).text()).toContain("Purchase $8000")
  })

  it("doesn't render the Buy Now or Bid buttons when isInAuction and isBuyNowable but has sold via buy now", async () => {
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
    const commercialButtons = await relayComponent({
      artwork,
    })
    expect(commercialButtons.find(Button).length).toEqual(0)
  })

  it("renders both Make an Offer and Contact Gallery buttons when isOfferable and isInquiriable", async () => {
    const artwork = {
      ...ArtworkFixture,
      isOfferable: true,
      isForSale: false,
      isInquireable: true,
      isPriceHidden: false,
    }
    const commercialButtons = await relayComponent({
      artwork,
    })
    expect(commercialButtons.find(Button).at(0).text()).toContain("Make an Offer")
    expect(commercialButtons.find(Button).at(1).text()).toContain("Contact Gallery")
  })

  describe("tracking", () => {
    it("trackEvent called when Contact Gallery pressed given Offerable and Inquireable artwork", async () => {
      const artwork = {
        ...ArtworkFixture,
        isOfferable: true,
        isForSale: false,
        isInquireable: true,
        isPriceHidden: false,
      }
      const commercialButtons = await relayComponent({
        artwork,
      })
      commercialButtons.find(Button).at(1).props().onPress()

      expect(trackEvent).toHaveBeenCalledWith({
        action: "tappedContactGallery",
        context_owner_id: artwork.internalID,
        context_owner_slug: artwork.slug,
        context_owner_type: "artwork",
      })
    })

    it("trackEvent called when Contact Gallery pressed given Inquireable artwork", async () => {
      const artwork = {
        ...ArtworkFixture,
        isOfferable: true,
        isForSale: false,
        isInquireable: true,
        isPriceHidden: false,
      }
      const commercialButtons = await relayComponent({
        artwork,
      })
      commercialButtons.find(Button).at(1).props().onPress()

      expect(trackEvent).toHaveBeenCalledWith({
        action: "tappedContactGallery",
        context_owner_id: artwork.internalID,
        context_owner_slug: artwork.slug,
        context_owner_type: "artwork",
      })
    })
  })
})
