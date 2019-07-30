import { Button } from "@artsy/palette"
import { mount } from "enzyme"
jest.mock("lib/NativeModules/SwitchBoard", () => ({ presentModalViewController: jest.fn() }))
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import { flushPromiseQueue } from "lib/tests/flushPromiseQueue"
import { renderRelayTree } from "lib/tests/renderRelayTree"
import React from "react"
import { graphql, RelayProp } from "react-relay"
import { CommercialButtonProps, CommercialButtons, CommercialButtonsFragmentContainer } from "../CommercialButtons"

jest.unmock("react-relay")

const SwitchBoardMock = SwitchBoard as any
const { anything } = expect

afterEach(() => {
  SwitchBoardMock.presentModalViewController.mockReset()
})

let artwork = {
  slug: "abbas-kiarostami-untitled-7",
  internalID: "5b2b745e9c18db204fc32e11",
  isAcquireable: false,
  isOfferable: false,
  isInquireable: true,
}

const componentWithQuery = async ({ mockArtworkData, mockOrderMutationResults, mockOfferMutationResults }) => {
  return await renderRelayTree({
    Component: CommercialButtonsFragmentContainer,
    query: graphql`
      query CommercialButtonsTestsQuery {
        artwork(id: "artworkID") {
          ...CommercialButtons_artwork
        }
      }
    `,
    mockData: { artwork: mockArtworkData },
    mockMutationResults: {
      commerceCreateOrderWithArtwork: mockOrderMutationResults,
      ecommerceCreateOfferOrderWithArtwork: mockOfferMutationResults,
    },
  })
}

describe("CommercialButtons", () => {
  artwork = {
    slug: "abbas-kiarostami-untitled-7",
    internalID: "5b2b745e9c18db204fc32e11",
    isAcquireable: false,
    isOfferable: false,
    isInquireable: true,
  }
  it("renders button for Contact Gallery button if isInquireable", () => {
    const component = mount(
      <CommercialButtons
        relay={{ environment: {} } as RelayProp}
        artwork={artwork as CommercialButtonProps["artwork"]}
      />
    )
    expect(component.text()).toContain("Contact gallery")
  })

  it("renders Make Offer button if isOfferable", () => {
    artwork = {
      slug: "abbas-kiarostami-untitled-7",
      internalID: "5b2b745e9c18db204fc32e11",
      isAcquireable: false,
      isOfferable: false,
      isInquireable: true,
    }
    const component = mount(
      <CommercialButtons
        relay={{ environment: {} } as RelayProp}
        artwork={artwork as CommercialButtonProps["artwork"]}
      />
    )
    expect(component.text()).toContain("Contact gallery")
  })

  it("renders Buy Now button if isAcquireable", () => {
    artwork = {
      slug: "abbas-kiarostami-untitled-7",
      internalID: "5b2b745e9c18db204fc32e11",
      isAcquireable: true,
      isOfferable: false,
      isInquireable: false,
    }
    const component = mount(
      <CommercialButtons
        relay={{ environment: {} } as RelayProp}
        artwork={artwork as CommercialButtonProps["artwork"]}
      />
    )
    expect(component.text()).toContain("Buy now")
  })

  it("renders both Buy Now and Make Offer buttons when isOfferable and isAcquireable", () => {
    artwork = {
      slug: "abbas-kiarostami-untitled-7",
      internalID: "5b2b745e9c18db204fc32e11",
      isAcquireable: true,
      isOfferable: true,
      isInquireable: false,
    }
    const component = mount(
      <CommercialButtons
        relay={{ environment: {} } as RelayProp}
        artwork={artwork as CommercialButtonProps["artwork"]}
      />
    )
    expect(
      component
        .find(Button)
        .at(0)
        .text()
    ).toContain("Buy now")
    expect(
      component
        .find(Button)
        .at(1)
        .text()
    ).toContain("Make offer")
  })

  it("commits the Buy Now mutation", async () => {
    artwork = {
      slug: "abbas-kiarostami-untitled-7",
      internalID: "5b2b745e9c18db204fc32e11",
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
    artwork = {
      slug: "abbas-kiarostami-untitled-7",
      internalID: "5b2b745e9c18db204fc32e11",
      isAcquireable: true,
      isOfferable: true,
      isInquireable: false,
    }

    const commercialButtons = await componentWithQuery({
      mockArtworkData: artwork,
      mockOrderMutationResults: {},
      mockOfferMutationResults: {
        orderOrError: { order: { internalID: "makeOfferID", __typename: "OfferOrder", mode: "OFFER" } },
      },
    })

    const MakeOfferButton = commercialButtons.find(Button).at(1)
    MakeOfferButton.props().onPress()
    await flushPromiseQueue()

    expect(SwitchBoardMock.presentModalViewController).toHaveBeenCalledWith(anything(), "/orders/makeOfferID")
  })
})
