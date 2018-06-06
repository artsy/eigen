import React from "react"
import "react-native"
import * as renderer from "react-test-renderer"

import BidFlow from "../BidFlow"

const Me = {
  has_qualified_credit_cards: true,
}

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
  const bg = renderer.create(<BidFlow me={Me} sale_artwork={SaleArtwork} intent="bid" />).toJSON()
  expect(bg).toMatchSnapshot()
})
