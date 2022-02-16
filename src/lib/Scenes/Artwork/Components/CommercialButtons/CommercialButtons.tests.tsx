import { CommercialButtonsTestsMutationQueryRawResponse } from "__generated__/CommercialButtonsTestsMutationQuery.graphql"
import { CommercialButtonsTestsRenderQueryRawResponse } from "__generated__/CommercialButtonsTestsRenderQuery.graphql"
import { ArtworkFixture } from "lib/__fixtures__/ArtworkFixture"
import { navigate } from "lib/navigation/navigate"
import { __globalStoreTestUtils__, GlobalStoreProvider } from "lib/store/GlobalStore"
import { flushPromiseQueue } from "lib/tests/flushPromiseQueue"
import { renderRelayTree } from "lib/tests/renderRelayTree"
import { ArtworkInquiryContext } from "lib/utils/ArtworkInquiry/ArtworkInquiryStore"
import { ArtworkInquiryContextState } from "lib/utils/ArtworkInquiry/ArtworkInquiryTypes"
import { Button, Theme } from "palette"
import React from "react"
import { FragmentRef, graphql } from "react-relay"
import { CommercialButtonsFragmentContainer } from "./CommercialButtons"

jest.unmock("react-relay")

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
    mockData: { artwork: mockArtworkData } as CommercialButtonsTestsMutationQueryRawResponse,
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
    mockData: { artwork } as CommercialButtonsTestsRenderQueryRawResponse,
  })
}

describe("CommercialButtons", () => {
  it("renders button for Contact Gallery button if isInquireable and not newFirstInquiry", async () => {
    __globalStoreTestUtils__?.injectFeatureFlags({ AROptionsNewFirstInquiry: false })
    const artwork = {
      ...ArtworkFixture,
      isAcquireable: false,
      isOfferable: false,
      isInquireable: true,
      isForSale: true,
      isPriceHidden: false,
    }

    const commercialButtons = await relayComponent({
      artwork,
    })
    expect(commercialButtons.text()).toContain("Contact gallery")
  })

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
    expect(commercialButtons.text()).toContain("Make offer")
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
    expect(commercialButtons.text()).toContain("Buy now")
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
    expect(commercialButtons.find(Button).at(0).text()).toContain("Buy now")
    expect(commercialButtons.find(Button).at(1).text()).toContain("Make offer")
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
    expect(commercialButtons.find(Button).at(1).text()).toContain("Buy now $8000")
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

  it("renders both Make Offer and Contact Gallery buttons when isOfferable and isInquireable", async () => {
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
    expect(commercialButtons.find(Button).at(0).text()).toContain("Make offer")
    expect(commercialButtons.find(Button).at(1).text()).toContain("Contact gallery")
  })

  it("renders Make Offer given isOfferableFromInquiry and the AREnableMakeOfferOnAllEligibleArtworks is on", async () => {
    __globalStoreTestUtils__?.injectFeatureFlags({ AREnableMakeOfferOnAllEligibleArtworks: true })
    const artwork = {
      ...ArtworkFixture,
      isOfferableFromInquiry: true,
      isForSale: false,
      isPriceHidden: false,
    }

    const commercialButtons = await relayComponent({
      artwork,
    })
    expect(commercialButtons.find(Button).at(0).text()).toContain("Make offer")
  })

  it("does not render Make Offer given isOfferableFromInquiry, priceHidden and the AREnableMakeOfferOnAllEligibleArtworks on", async () => {
    __globalStoreTestUtils__?.injectFeatureFlags({ AREnableMakeOfferOnAllEligibleArtworks: true })
    const artwork = {
      ...ArtworkFixture,
      isOfferableFromInquiry: true,
      isForSale: false,
      isPriceHidden: true,
      isInquireable: true,
    }

    const commercialButtons = await relayComponent({
      artwork,
    })
    expect(commercialButtons.find(Button).at(0).text()).not.toContain("Make offer")
  })

  it("does not render Make Offer given the AREnableMakeOfferOnAllEligibleArtworks on", async () => {
    __globalStoreTestUtils__?.injectFeatureFlags({ AREnableMakeOfferOnAllEligibleArtworks: true })
    const artwork = {
      ...ArtworkFixture,
      isForSale: false,
      isPriceHidden: false,
      isInquireable: true,
    }

    const commercialButtons = await relayComponent({
      artwork,
    })
    expect(commercialButtons.find(Button).at(0).text()).not.toContain("Make offer")
  })
})
