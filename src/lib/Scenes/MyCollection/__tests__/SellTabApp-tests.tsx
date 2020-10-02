import { __appStoreTestUtils__ } from "lib/store/AppStore"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import React from "react"
import { MyCollectionArtworkListQueryRenderer } from "../Screens/ArtworkList/MyCollectionArtworkList"
import { ConsignmentsHomeQueryRenderer } from "../Screens/ConsignmentsHome/ConsignmentsHome"
import { SellTabApp } from "../SellTabApp"

jest.mock("../Screens/ArtworkList/MyCollectionArtworkList", () => ({
  MyCollectionArtworkListQueryRenderer: () => null,
}))

jest.mock("../Screens/ConsignmentsHome/ConsignmentsHome", () => ({
  ConsignmentsHomeQueryRenderer: () => null,
}))

describe("SellTabApp", () => {
  it("renders MyCollections app if feature flag is on", () => {
    __appStoreTestUtils__?.injectEmissionOptions({ AROptionsEnableMyCollection: true })
    const wrapper = renderWithWrappers(<SellTabApp />)
    expect(wrapper.root.findByType(MyCollectionArtworkListQueryRenderer))
  })

  it("renders Consignments home app if feature flag is off", () => {
    __appStoreTestUtils__?.injectEmissionOptions({ AROptionsEnableMyCollection: false })
    const wrapper = renderWithWrappers(<SellTabApp />)
    expect(wrapper.root.findByType(ConsignmentsHomeQueryRenderer))
  })
})
