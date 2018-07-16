import React from "react"
import "react-native"
import * as renderer from "react-test-renderer"

import RegistrationFlow from "../RegistrationFlow"

jest.mock("tipsi-stripe", () => ({ setOptions: jest.fn() }))
jest.mock("../../Components/Bidding/Components/Timer")

const Sale = {
  id: "david-lynch-foundation-benefit-auction-2018",
  end_at: "2018-06-26T19:30:00+00:00",
  is_preview: false,
  live_start_at: null,
  name: "David Lynch Foundation: Benefit Auction 2018",
  start_at: "2018-06-12T08:10:00+00:00",
  __id: "U2FsZTpkYXZpZC1seW5jaC1mb3VuZGF0aW9uLWJlbmVmaXQtYXVjdGlvbi0yMDE4",
}

it("renders properly with credit card", () => {
  console.error = jest.fn() // Silences component logging.

  const bg = renderer.create(<RegistrationFlow me={{ has_credit_cards: true }} sale={Sale} />).toJSON()
  expect(bg).toMatchSnapshot()
})

it("renders properly without credit card", () => {
  console.error = jest.fn() // Silences component logging.

  const bg = renderer.create(<RegistrationFlow me={{ has_credit_cards: false }} sale={Sale} />).toJSON()
  expect(bg).toMatchSnapshot()
})
