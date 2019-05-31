import React from "react"
import "react-native"
import * as renderer from "react-test-renderer"

import { MaxBidPicker } from "../MaxBidPicker"

import { BiddingThemeProvider } from "../BiddingThemeProvider"

const Bids = [
  {
    display: "$35,000 USD",
    cents: 3500000,
  },
  {
    display: "$40,000 USD",
    cents: 4000000,
  },
]

it("renders properly", () => {
  const bg = renderer
    .create(
      <BiddingThemeProvider>
        <MaxBidPicker bids={Bids} selectedValue={0} onValueChange={jest.fn()} />
      </BiddingThemeProvider>
    )
    .toJSON()
  expect(bg).toMatchSnapshot()
})
