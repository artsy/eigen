import { Sans, Theme } from "@artsy/palette"
import { mount } from "enzyme"
import React from "react"
import { ArtworkExtraLinks } from "../ArtworkExtraLinks"
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
    expect(component.text()).toContain("Contact For Price")
    expect(component.text()).toContain("I'm a Gallery")
    expect(component.find(ArtworkExtraLinks).text()).toContain("Consign with Artsy.")
  })

  it("hides seller info for works from closed auctions", () => {
    const CommercialInformationArtworkClosedAuction = {
      ...CommercialInformationArtwork,
      sale: {
        is_auction: true,
        is_closed: true,
      },
    }
    const component = mount(
      <Theme>
        <CommercialInformation artwork={CommercialInformationArtworkClosedAuction} />
      </Theme>
    )
    expect(component.text()).toContain("Contact For Price")
    expect(component.text()).not.toContain("I'm a Gallery")
    expect(component.find(ArtworkExtraLinks).text()).toContain("Consign with Artsy.")
  })

  it("doesn't render information when the data is not present", () => {
    const CommercialInformationArtworkNoData = {
      availability: null,
      price: "",
      sale_message: "",
      shippingInfo: "",
      shippingOrigin: null,
      is_acquireable: false,
      is_offerable: false,
      is_biddable: false,
      is_inquireable: false,
      edition_sets: [],
      sale: {
        is_auction: false,
        is_closed: false,
      },
      partner: {
        name: null,
        " $refType": null,
      },
      artists: [
        {
          is_consignable: false,
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
    expect(component.text()).not.toContain("Contact For Price")
    expect(component.text()).not.toContain("I'm a Gallery")
    expect(component.text()).not.toContain("Consign with Artsy.")
  })

  it("renders seller info correctly for commercial works", () => {
    const component = mount(
      <Theme>
        <CommercialInformation artwork={CommercialInformationArtwork} />
      </Theme>
    )
    expect(
      component
        .find(Sans)
        .at(0)
        .render()
        .text()
    ).toMatchInlineSnapshot(`"Contact For Price"`)
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
        .at(0)
        .render()
        .text()
    ).toMatchInlineSnapshot(`"Contact For Price"`)
  })

  it("renders artwork availability correctly", () => {
    const component = mount(
      <Theme>
        <CommercialInformation artwork={CommercialInformationArtwork} />
      </Theme>
    )
    expect(
      component
        .find(Sans)
        .at(0)
        .render()
        .text()
    ).toMatchInlineSnapshot(`"Contact For Price"`)
  })
})

const CommercialInformationArtwork = {
  is_acquireable: false,
  is_offerable: false,
  is_biddable: false,
  is_inquireable: false,
  edition_sets: [],
  sale_message: "Contact For Price",
  shippingInfo: "Shipping, tax, and service quoted by seller",
  shippingOrigin: null,
  availability: "Sold",
  sale: {
    is_auction: false,
    is_closed: false,
  },
  partner: {
    name: "I'm a Gallery",
    " $refType": null,
  },
  artists: [
    {
      is_consignable: true,
      " $fragmentRefs": null,
    },
  ],
  " $fragmentRefs": null,
  " $refType": null,
}
