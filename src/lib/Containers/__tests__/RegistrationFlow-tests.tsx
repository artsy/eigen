import React from "react"
import "react-native"
import * as renderer from "react-test-renderer"

import { mockTimezone } from "lib/tests/mockTimezone"
import RegistrationFlow from "../RegistrationFlow"

import { Theme } from "@artsy/palette"

jest.mock("tipsi-stripe", () => ({ setOptions: jest.fn() }))

const Sale = {
  gravityID: "david-lynch-foundation-benefit-auction-2018",
  end_at: "2018-06-26T19:30:00+00:00",
  is_preview: false,
  live_start_at: null,
  name: "David Lynch Foundation: Benefit Auction 2018",
  start_at: "2018-06-12T08:10:00+00:00",
  id: "U2FsZTpkYXZpZC1seW5jaC1mb3VuZGF0aW9uLWJlbmVmaXQtYXVjdGlvbi0yMDE4",
}

jest.useFakeTimers()

beforeEach(() => {
  Date.now = jest.fn(() => 1525983752116)
  mockTimezone("America/New_York")
})

it("renders properly with credit card", () => {
  console.error = jest.fn() // Silences component logging.

  const bg = renderer
    .create(
      <Theme>
        <RegistrationFlow
          me={
            {
              has_credit_cards: true,
            } as any
          }
          sale={Sale as any}
        />
      </Theme>
    )
    .toJSON()
  expect(bg).toMatchSnapshot()
})

it("renders properly without credit card", () => {
  console.error = jest.fn() // Silences component logging.

  const bg = renderer
    .create(
      <Theme>
        <RegistrationFlow
          me={
            {
              has_credit_cards: false,
            } as any
          }
          sale={Sale as any}
        />
      </Theme>
    )
    .toJSON()
  expect(bg).toMatchSnapshot()
})
