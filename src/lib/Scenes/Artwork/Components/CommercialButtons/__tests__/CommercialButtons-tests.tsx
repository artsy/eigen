import { Button } from "@artsy/palette"
jest.mock("lib/NativeModules/SwitchBoard", () => ({ presentModalViewController: jest.fn() }))
import { ArtworkFixture } from "lib/__fixtures__/ArtworkFixture"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import { flushPromiseQueue } from "lib/tests/flushPromiseQueue"
import { renderRelayTree } from "lib/tests/renderRelayTree"
import { graphql } from "react-relay"
import { CommercialButtonsFragmentContainer } from "../CommercialButtons"

jest.unmock("react-relay")

const SwitchBoardMock = SwitchBoard as any
const { anything } = expect

afterEach(() => {
  SwitchBoardMock.presentModalViewController.mockReset()
})

const componentWithQuery = async ({ mockArtworkData, mockOrderMutationResults, mockOfferMutationResults }) => {
  return await renderRelayTree({
    Component: CommercialButtonsFragmentContainer,
    query: graphql`
      query CommercialButtonsTestsMutationQuery {
        artwork(id: "artworkID") {
          ...CommercialButtons_artwork
        }
      }
    `,
    mockData: { artwork: mockArtworkData },
    mockMutationResults: {
      commerceCreateOrderWithArtwork: mockOrderMutationResults,
      commerceCreateOfferOrderWithArtwork: mockOfferMutationResults,
    },
  })
}

const relayComponent = async ({ artwork }) => {
  return await renderRelayTree({
    Component: CommercialButtonsFragmentContainer,
    query: graphql`
      query CommercialButtonsTestsRenderQuery {
        artwork(id: "artworkID") {
          ...CommercialButtons_artwork
        }
      }
    `,
    mockData: { artwork },
  })
}

describe("CommercialButtons", () => {
  it("renders button for Contact Gallery button if isInquireable", async () => {
    const artwork = {
      ...ArtworkFixture,
      isAcquireable: false,
      isOfferable: false,
      isInquireable: true,
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
      sale: {
        slug: "kieran-testing-ios-artwork-page",
        internalID: "5d52f117d063bc0007bcb111",
        registrationStatus: null,
        isPreview: false,
        isOpen: true,
        isLiveOpen: false,
        isClosed: false,
        isRegistrationClosed: false,
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
    }
    const commercialButtons = await relayComponent({
      artwork,
    })
    expect(
      commercialButtons
        .find(Button)
        .at(0)
        .text()
    ).toContain("Buy now")
    expect(
      commercialButtons
        .find(Button)
        .at(1)
        .text()
    ).toContain("Make offer")
  })

  it("commits the Buy Now mutation", async () => {
    const artwork = {
      ...ArtworkFixture,
      isAcquireable: true,
      isOfferable: true,
      isInquireable: false,
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
    expect(SwitchBoardMock.presentModalViewController).toHaveBeenCalledWith(anything(), "/orders/buyNowID")
  })

  it("commits the Make Offer mutation", async () => {
    const artwork = {
      ...ArtworkFixture,
      isAcquireable: true,
      isOfferable: true,
      isInquireable: false,
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

    expect(SwitchBoardMock.presentModalViewController).toHaveBeenCalledWith(anything(), "/orders/makeOfferID")
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
      },
      saleArtwork: {
        increments: [{ cents: 320000, display: "€3,200" }],
      },
    }
    const commercialButtons = await relayComponent({
      artwork,
    })
    expect(
      commercialButtons
        .find(Button)
        .at(0)
        .text()
    ).toContain("Bid")
    expect(
      commercialButtons
        .find(Button)
        .at(1)
        .text()
    ).toContain("Buy now $8000")
  })
})
