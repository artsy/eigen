import { Sans, Theme } from "@artsy/palette"
import { mount } from "enzyme"
import React from "react"
import { CommercialPartnerInformation } from "../CommercialPartnerInformation"

describe("CommercialPartnerInformation", () => {
  it("renders all seller information when work is for sale and is not in a closed auction", () => {
    const component = mount(
      <Theme>
        <CommercialPartnerInformation artwork={CommercialPartnerInformationArtwork} />
      </Theme>
    )
    expect(
      component
        .find(Sans)
        .at(0)
        .render()
        .text()
    ).toMatchInlineSnapshot(`"Sold by Bob's Gallery"`)
    expect(
      component
        .find(Sans)
        .at(1)
        .render()
        .text()
    ).toMatchInlineSnapshot(`"Ships from Brooklyn"`)
    expect(
      component
        .find(Sans)
        .at(2)
        .render()
        .text()
    ).toMatchInlineSnapshot(`"Ships within the continental USA"`)
    expect(
      component
        .find(Sans)
        .at(3)
        .render()
        .text()
    ).toMatchInlineSnapshot(`"VAT included in price"`)
  })

  it("hides shipping info for works from closed auctions", () => {
    const CommercialPartnerInformationArtworkClosedAuction = {
      ...CommercialPartnerInformationArtwork,
      availability: "not for sale",
      isForSale: false,
      isOfferable: false,
      isAcquireable: false,
    }
    const component = mount(
      <Theme>
        <CommercialPartnerInformation artwork={CommercialPartnerInformationArtworkClosedAuction} />
      </Theme>
    )
    expect(
      component
        .find(Sans)
        .at(0)
        .render()
        .text()
    ).toMatchInlineSnapshot(`"At Bob's Gallery"`)
    expect(component.find(Sans).length).toEqual(1)
  })

  it("hides shipping information for sold works", () => {
    const CommercialPartnerInformationArtworkClosedAuction = {
      ...CommercialPartnerInformationArtwork,
      availability: "sold",
      isForSale: false,
      isOfferable: false,
      isAcquireable: false,
    }
    const component = mount(
      <Theme>
        <CommercialPartnerInformation artwork={CommercialPartnerInformationArtworkClosedAuction} />
      </Theme>
    )
    expect(
      component
        .find(Sans)
        .at(0)
        .render()
        .text()
    ).toMatchInlineSnapshot(`"Sold by Bob's Gallery"`)
    expect(component.find(Sans).length).toEqual(1)
  })

  it("Hides shipping/tax information if the work is not enabled for buy now or make offer", () => {
    const CommercialPartnerInformationNoEcommerce = {
      ...CommercialPartnerInformationArtwork,
      isAcquireable: false,
      isOfferable: false,
    }

    const component = mount(
      <Theme>
        <CommercialPartnerInformation artwork={CommercialPartnerInformationNoEcommerce} />
      </Theme>
    )

    expect(
      component
        .find(Sans)
        .at(0)
        .render()
        .text()
    ).toMatchInlineSnapshot(`"Sold by Bob's Gallery"`)
    expect(component.find(Sans).length).toEqual(1)
  })

  it("Says 'At Gallery Name' instead of 'Sold by Gallery Name' and hides shipping info for non-commercial works", () => {
    const CommercialPartnerInformationArtworkClosedAuction = {
      ...CommercialPartnerInformationArtwork,
      availability: null,
      isForSale: false,
      isOfferable: false,
      isAcquireable: false,
    }
    const component = mount(
      <Theme>
        <CommercialPartnerInformation artwork={CommercialPartnerInformationArtworkClosedAuction} />
      </Theme>
    )
    expect(
      component
        .find(Sans)
        .at(0)
        .render()
        .text()
    ).toMatchInlineSnapshot(`"At Bob's Gallery"`)
    expect(component.find(Sans).length).toEqual(1)
  })
})

const CommercialPartnerInformationArtwork = {
  availability: "for sale",
  isAcquireable: true,
  isForSale: true,
  isOfferable: false,
  shippingOrigin: "Brooklyn",
  shippingInfo: "Ships within the continental USA",
  partner: {
    name: "Bob's Gallery",
  },
  priceIncludesTaxDisplay: "VAT included in price",
  " $refType": null,
}
