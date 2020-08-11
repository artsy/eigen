import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import React from "react"
import "react-native"

import { mockTimezone } from "lib/tests/mockTimezone"

import { Theme } from "@artsy/palette"
import { RegistrationFlowFragmentContainer } from "../RegistrationFlow"

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

it("renders without throwing an error", () => {
  console.error = jest.fn() // Silences component logging.

  renderWithWrappers(
    <Theme>
      <RegistrationFlowFragmentContainer
        me={
          {
            has_credit_cards: true,
          } as any
        }
        sale={Sale as any}
      />
    </Theme>
  )
})
