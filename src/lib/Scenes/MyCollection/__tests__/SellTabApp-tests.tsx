import { __appStoreTestUtils__ } from "lib/store/AppStore"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import React from "react"
import { ConsignmentsHomeQueryRenderer } from "../Screens/ConsignmentsHome/ConsignmentsHome"
import { SellTabApp } from "../SellTabApp"

jest.mock("../Screens/ArtworkList/MyCollectionArtworkList", () => ({
  MyCollectionArtworkListQueryRenderer: () => null,
}))

jest.mock("../Screens/ConsignmentsHome/ConsignmentsHome", () => ({
  ConsignmentsHomeQueryRenderer: () => null,
}))

describe("SellTabApp", () => {
  it("renders Consignments home app", () => {
    const wrapper = renderWithWrappers(<SellTabApp />)
    expect(wrapper.root.findByType(ConsignmentsHomeQueryRenderer))
  })
})
