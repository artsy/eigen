import { Sans } from "@artsy/palette"
import { shallow } from "enzyme"
import React from "react"
import { SellerInfo } from "../SellerInfo"

jest.unmock("react-relay")

describe("SellerInfo", () => {
  it("renders seller info correctly", () => {
    const component = shallow(<SellerInfo artwork={artworkSellerInfo} />)
    expect(component.find(Sans).length).toEqual(1)

    expect(
      component
        .find(Sans)
        .at(0)
        .render()
        .text()
    ).toMatchInlineSnapshot(`"Partner 1"`)
  })
})

const artworkSellerInfo = {
  partner: {
    name: "Partner 1",
    " $refType": null,
  },
  " $refType": null,
  " $fragmentRefs": null,
}
