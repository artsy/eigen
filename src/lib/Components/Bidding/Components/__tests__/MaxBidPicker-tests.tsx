import React from "react"
import "react-native"
import * as renderer from "react-test-renderer"

import { MaxBidPicker } from "../MaxBidPicker"

const Bids = [
  {
    label: "$35,000 USD",
    value: 3500000,
  },
  {
    label: "$40,000 USD",
    value: 4000000,
  },
]

it("renders properly", () => {
  const bg = renderer.create(<MaxBidPicker bids={Bids} selectedValue={0} onValueChange={jest.fn()} />).toJSON()
  expect(bg).toMatchSnapshot()
})
