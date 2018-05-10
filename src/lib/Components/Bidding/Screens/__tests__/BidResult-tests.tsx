import React from "react"
import "react-native"

import * as renderer from "react-test-renderer"
import { BidResult } from "../BidResult"

const saleArtwork = {
  current_bid: {
    amount: "CHF10,000",
    cents: 1000000,
    display: "CHF 10,000",
  },
  sale: {
    live_start_at: "2022-01-01T00:03:00+00:00",
    end_at: "2022-05-01T00:03:00+00:00",
  },
}
describe("BidResult component", () => {
  Date.now = jest.fn(() => 1525983752116)
  it("renders winning screen properly", () => {
    jest.useFakeTimers()

    const bg = renderer.create(<BidResult winning sale_artwork={saleArtwork} navigator={jest.fn() as any} />).toJSON()

    expect(bg).toMatchSnapshot()
    expect(setInterval).toHaveBeenCalledTimes(1)
  })

  it("renders not highest bid screen properly", () => {
    jest.useFakeTimers()
    const messageHeader = "Your bid wasn’t high enough"
    const messageDescriptionMd = `Hello Hello [Your](http://example.com) bid didn’t meet the reserve price for this work.

  Bid again to take the lead.`
    const bg = renderer
      .create(
        <BidResult
          winning={false}
          sale_artwork={saleArtwork}
          message_header={messageHeader}
          message_description_md={messageDescriptionMd}
          navigator={jest.fn() as any}
        />
      )
      .toJSON()
    expect(bg).toMatchSnapshot()
    expect(setInterval).toHaveBeenCalledTimes(1)
  })
})
