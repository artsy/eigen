import { Sans, Theme } from "@artsy/palette"
import { mount } from "enzyme"
import React from "react"
import { TouchableWithoutFeedback } from "react-native"
import { ArtworkExtraLinks } from "../ArtworkExtraLinks"
import { CommercialButtons } from "../CommercialButtons/CommercialButtons"
import { CommercialEditionSetInformation } from "../CommercialEditionSetInformation"
import { CommercialInformation } from "../CommercialInformation"

jest.mock("lib/NativeModules/SwitchBoard", () => ({
  presentNavigationViewController: jest.fn(),
}))

describe("CommercialInformation", () => {
  it("renders all information when the data is present", () => {
    const component = mount(
      <Theme>
        <CommercialInformation artwork={CommercialInformationArtwork} />
      </Theme>
    )
    expect(component.text()).toContain("Contact for price")
    expect(component.text()).toContain("I'm a Gallery")
    expect(component.find(ArtworkExtraLinks).text()).toContain("Consign with Artsy.")
  })

  it("hides seller info for works from closed auctions", () => {
    const CommercialInformationArtworkClosedAuction = {
      ...CommercialInformationArtwork,
      sale: {
        isAuction: true,
        isClosed: true,
      },
    }
    const component = mount(
      <Theme>
        <CommercialInformation artwork={CommercialInformationArtworkClosedAuction} />
      </Theme>
    )
    expect(component.text()).toContain("Contact for price")
    expect(component.text()).not.toContain("I'm a Gallery")
    expect(component.find(ArtworkExtraLinks).text()).toContain("Consign with Artsy.")
  })

  it("doesn't render information when the data is not present", () => {
    const CommercialInformationArtworkNoData = {
      availability: null,
      price: "",
      saleMessage: "",
      shippingInfo: "",
      shippingOrigin: null,
      isAcquireable: false,
      isOfferable: false,
      isBiddable: false,
      isInquireable: false,
      editionSets: [],
      sale: {
        isAuction: false,
        isClosed: false,
      },
      partner: {
        name: null,
        " $refType": null,
      },
      artists: [
        {
          isConsignable: false,
          name: "",
          " $fragmentRefs": null,
        },
      ],
      " $fragmentRefs": null,
      " $refType": null,
    }
    const component = mount(
      <Theme>
        <CommercialInformation artwork={CommercialInformationArtworkNoData} />
      </Theme>
    )
    expect(component.text()).not.toContain("Contact for price")
    expect(component.text()).not.toContain("I'm a Gallery")
    expect(component.text()).not.toContain("Consign with Artsy.")
  })

  it("renders seller info correctly for non-commercial works", () => {
    const component = mount(
      <Theme>
        <CommercialInformation artwork={CommercialInformationArtwork} />
      </Theme>
    )
    expect(
      component
        .find(Sans)
        .at(1)
        .render()
        .text()
    ).toMatchInlineSnapshot(`"At I'm a Gallery"`)
  })

  it("renders consign with Artsy text", () => {
    const component = mount(
      <Theme>
        <CommercialInformation artwork={CommercialInformationArtwork} />
      </Theme>
    )
    expect(
      component
        .find(Sans)
        .at(3)
        .render()
        .text()
    ).toMatchInlineSnapshot(`"Want to sell a work by Santa Claus? Consign with Artsy."`)
  })

  it("when edition set is selected it's internalID is passed to CommercialButtons for mutation", () => {
    const artworkWithEditionSets = {
      ...CommercialInformationArtwork,
      isAcquireable: true,
      isOfferable: true,
      editionSets: [
        {
          id: "RWRpdGlvblNldDo1YmJiOTc3N2NlMmZjMzAwMmMxNzkwMTM=",
          internalID: "5bbb9777ce2fc3002c179013",
          isAcquireable: true,
          isOfferable: true,
          saleMessage: "$1",
          edition_of: "",
          dimensions: {
            in: "2 × 2 in",
            cm: "5.1 × 5.1 cm",
          },
        },
        {
          id: "RWRpdGlvblNldDo1YmMwZWMwMDdlNjQzMDBhMzliMjNkYTQ=",
          internalID: "5bc0ec007e64300a39b23da4",
          isAcquireable: true,
          isOfferable: true,
          saleMessage: "$2",
          edition_of: "",
          dimensions: {
            in: "1 × 1 in",
            cm: "2.5 × 2.5 cm",
          },
        },
      ],
    }

    const component = mount(
      <Theme>
        <CommercialInformation artwork={artworkWithEditionSets} />
      </Theme>
    )

    // Expect the component to default to first edition set's internalID
    expect(component.find(CommercialButtons).props().editionSetID).toEqual("5bbb9777ce2fc3002c179013")

    const secondEditionButton = component
      .find(CommercialEditionSetInformation)
      .find(TouchableWithoutFeedback)
      .at(1)
    secondEditionButton.props().onPress()
    component.update()

    expect(component.find(CommercialButtons).props().editionSetID).toEqual("5bc0ec007e64300a39b23da4")
  })
})

const CommercialInformationArtwork = {
  isAcquireable: false,
  isOfferable: false,
  isBiddable: false,
  isInquireable: false,
  editionSets: [],
  saleMessage: "Contact For Price",
  shippingInfo: "Shipping, tax, and service quoted by seller",
  shippingOrigin: null,
  availability: "Sold",
  sale: {
    isAuction: false,
    isClosed: false,
  },
  partner: {
    name: "I'm a Gallery",
    " $refType": null,
  },
  artists: [
    {
      isConsignable: true,
      name: "Santa Claus",
      " $fragmentRefs": null,
    },
  ],
  " $fragmentRefs": null,
  " $refType": null,
}
