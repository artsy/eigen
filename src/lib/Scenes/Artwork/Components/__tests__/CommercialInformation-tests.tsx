import { Theme } from "@artsy/palette"
import { mount } from "enzyme"
import React from "react"
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
    expect(component.text()).toContain("Sold")
    expect(component.text()).toContain("I'm a Gallery")
    expect(component.text()).toContain("Consign with Artsy.")
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
    expect(component.text()).toContain("Sold")
    expect(component.text()).not.toContain("I'm a Gallery")
    expect(component.text()).toContain("Consign with Artsy.")
  })

  it("doesn't render information when the data is not present", () => {
    const CommercialInformationArtworkNoData = {
      availability: null,
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
    expect(component.text()).not.toContain("Sold")
    expect(component.text()).not.toContain("I'm a Gallery")
    expect(component.text()).not.toContain("Consign with Artsy.")
  })
})

const CommercialInformationArtwork = {
  availability: "Sold",
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
