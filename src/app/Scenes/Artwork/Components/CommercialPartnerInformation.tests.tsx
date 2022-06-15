import { CommercialPartnerInformation_artwork$data } from "__generated__/CommercialPartnerInformation_artwork.graphql"
import { __globalStoreTestUtils__, GlobalStoreProvider } from "app/store/GlobalStore"
import { renderWithWrappersTL } from "app/tests/renderWithWrappers"
// @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
import { mount } from "enzyme"
import { Text, Theme } from "palette"
import React from "react"
import { CommercialPartnerInformation } from "./CommercialPartnerInformation"

describe("CommercialPartnerInformation", () => {
  beforeEach(() => {
    __globalStoreTestUtils__?.injectFeatureFlags({ AREnableCreateArtworkAlert: false })
  })

  it("renders all seller information when work is for sale and is not in a closed auction", () => {
    const component = mount(
      <GlobalStoreProvider>
        <Theme>
          <CommercialPartnerInformation artwork={CommercialPartnerInformationArtwork} />
        </Theme>
      </GlobalStoreProvider>
    )
    expect(component.find(Text).at(0).render().text()).toMatchInlineSnapshot(`"From Bob's Gallery"`)
    expect(component.find(Text).at(1).render().text()).toMatchInlineSnapshot(
      `"Ships from Brooklyn"`
    )
    expect(component.find(Text).at(2).render().text()).toMatchInlineSnapshot(
      `"Ships within the continental USA"`
    )
    expect(component.find(Text).at(3).render().text()).toMatchInlineSnapshot(
      `"VAT included in price"`
    )
  })

  it("it renders 'Taxes may apply at checkout' instead of 'VAT included in price' when Avalara phase 2 flag is enabled", () => {
    __globalStoreTestUtils__?.injectFeatureFlags({ AREnableAvalaraPhase2: true })
    const { getByText } = renderWithWrappersTL(
      <CommercialPartnerInformation artwork={CommercialPartnerInformationArtwork} />
    )

    expect(getByText("Taxes may apply at checkout.")).toBeTruthy()
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
      <GlobalStoreProvider>
        <Theme>
          <CommercialPartnerInformation
            artwork={CommercialPartnerInformationArtworkClosedAuction}
          />
        </Theme>
      </GlobalStoreProvider>
    )
    expect(component.find(Text).at(0).render().text()).toMatchInlineSnapshot(`"At Bob's Gallery"`)
    expect(component.find(Text).length).toEqual(1)
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
      <GlobalStoreProvider>
        <Theme>
          <CommercialPartnerInformation
            artwork={CommercialPartnerInformationArtworkClosedAuction}
          />
        </Theme>
      </GlobalStoreProvider>
    )
    expect(component.find(Text).at(0).render().text()).toMatchInlineSnapshot(`"From Bob's Gallery"`)
    expect(component.find(Text).length).toEqual(1)
  })

  it("Hides shipping/tax information if the work is not enabled for buy now or make offer", () => {
    const CommercialPartnerInformationNoEcommerce = {
      ...CommercialPartnerInformationArtwork,
      isAcquireable: false,
      isOfferable: false,
    }

    const component = mount(
      <GlobalStoreProvider>
        <Theme>
          <CommercialPartnerInformation artwork={CommercialPartnerInformationNoEcommerce} />
        </Theme>
      </GlobalStoreProvider>
    )

    expect(component.find(Text).at(0).render().text()).toMatchInlineSnapshot(`"From Bob's Gallery"`)
    expect(component.find(Text).length).toEqual(1)
  })

  it("Says 'At Gallery Name' instead of 'From Gallery Name' and hides shipping info for non-commercial works", () => {
    const CommercialPartnerInformationArtworkClosedAuction = {
      ...CommercialPartnerInformationArtwork,
      availability: null,
      isForSale: false,
      isOfferable: false,
      isAcquireable: false,
    }
    const component = mount(
      <GlobalStoreProvider>
        <Theme>
          <CommercialPartnerInformation
            artwork={CommercialPartnerInformationArtworkClosedAuction}
          />
        </Theme>
      </GlobalStoreProvider>
    )
    expect(component.find(Text).at(0).render().text()).toMatchInlineSnapshot(`"At Bob's Gallery"`)
    expect(component.find(Text).length).toEqual(1)
  })
})

const CommercialPartnerInformationArtwork: CommercialPartnerInformation_artwork$data = {
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
  " $fragmentType": "CommercialPartnerInformation_artwork",
}
