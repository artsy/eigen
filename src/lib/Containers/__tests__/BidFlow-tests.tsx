import React from "react"
import "react-native"
import * as renderer from "react-test-renderer"

import BidFlow from "../BidFlow"

const SaleArtwork = {
  bid_increments: [3500000, 4000000, 4500000, 5000000, 5500000],
}

it("renders properly", () => {
  const bg = renderer.create(<BidFlow sale_artwork={SaleArtwork} />).toJSON()
  expect(bg).toMatchSnapshot()
})
