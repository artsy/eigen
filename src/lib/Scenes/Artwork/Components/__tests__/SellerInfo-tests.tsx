import { Sans, Theme } from "@artsy/palette"
import { mount } from "enzyme"
import React from "react"
import { SellerInfo } from "../SellerInfo"

jest.unmock("react-relay")

describe("SellerInfo", () => {
  it("renders seller info correctly for commercial works", () => {
    const component = mount(
      <Theme>
        <SellerInfo artwork={artworkSellerInfoForSale} />
      </Theme>
    )
    expect(component.find(Sans).length).toEqual(1)

    expect(
      component
        .find(Sans)
        .at(0)
        .render()
        .text()
    ).toMatchInlineSnapshot(`"Sold by Partner 1"`)
  })
  it("renders seller info correctly for non-commercial works", () => {
    const component = mount(
      <Theme>
        <SellerInfo artwork={artworkSellerInfoNotForSale} />
      </Theme>
    )
    expect(component.find(Sans).length).toEqual(1)

    expect(
      component
        .find(Sans)
        .at(0)
        .render()
        .text()
    ).toMatchInlineSnapshot(`"At Partner 2"`)
  })
})

const artworkSellerInfoForSale = {
  availability: "for sale",
  partner: {
    name: "Partner 1",
    " $refType": null,
  },
  " $refType": null,
  " $fragmentRefs": null,
}

const artworkSellerInfoNotForSale = {
  availability: "not for sale",
  partner: {
    name: "Partner 2",
    " $refType": null,
  },
  " $refType": null,
  " $fragmentRefs": null,
}
