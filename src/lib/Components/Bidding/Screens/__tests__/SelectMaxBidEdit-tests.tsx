import React from "react"
import "react-native"
import * as renderer from "react-test-renderer"
import { FakeNavigator } from "../../__tests__/Helpers/FakeNavigator"

import { MaxBidPicker } from "../../Components/MaxBidPicker"
import { SelectMaxBidEdit } from "../SelectMaxBidEdit"

import { Theme } from "@artsy/palette"

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

let fakeNavigator

beforeEach(() => {
  fakeNavigator = new FakeNavigator()
})

it("renders properly", () => {
  const component = renderer
    .create(
      <Theme>
        <SelectMaxBidEdit {...initialProps} />
      </Theme>
    )
    .toJSON()
  expect(component).toMatchSnapshot()
})

it("passes the correct selection", () => {
  const component = renderer.create(
    <Theme>
      <SelectMaxBidEdit {...initialProps} selectedBidIndex={3} />
    </Theme>
  )
  expect(component.root.findByType(MaxBidPicker).props.selectedValue).toEqual(3)
})

const initialProps = {
  increments: SaleArtwork.increments,
  navigator: fakeNavigator as any,
  updateSelectedBid: jest.fn(),
  selectedBidIndex: 0,
}
