import React from "react"
import "react-native"

import * as renderer from "react-test-renderer"
import { BidResult } from "../BidResult"

it("renders winning screen properly", () => {
  jest.useFakeTimers()

  const bg = renderer.create(<BidResult winning />).toJSON()

  expect(bg).toMatchSnapshot()
  expect(setInterval).toHaveBeenCalledTimes(1)
})

it("renders not highest bid screen properly", () => {
  jest.useFakeTimers()
  const messageHeader = "Your bid wasn’t high enough"
  const messageDescriptionMd = `Hello Hello [Your](http://example.com) bid didn’t meet the reserve price for this work.

Bid again to take the lead.`
  const bg = renderer
    .create(<BidResult winning={false} message_header={messageHeader} message_description_md={messageDescriptionMd} />)
    .toJSON()
  expect(bg).toMatchSnapshot()
  expect(setInterval).toHaveBeenCalledTimes(1)
})
