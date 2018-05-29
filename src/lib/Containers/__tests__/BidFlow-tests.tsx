import React from "react"
import "react-native"
import * as renderer from "react-test-renderer"

import BidFlow from "../BidFlow"

const SaleArtwork = {
  increments: [
    {
      display: "$35,000",
      cents: 3500000,
    },
    {
      display: "$40,000",
      cents: 4000000,
    },
    {
      display: "$45,000",
      cents: 4500000,
    },
    {
      display: "$50,000",
      cents: 5000000,
    },
    {
      display: "$55,000",
      cents: 5500000,
    },
  ],
}

it("renders properly", () => {
  const bg = renderer.create(<BidFlow sale_artwork={SaleArtwork} />).toJSON()
  expect(bg).toMatchSnapshot()
})
