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
  const messageDescriptionMd = "Another bidder placed a higher max bid or the same max bid before you did."
  const bg = renderer
    .create(<BidResult winning={false} message_header={messageHeader} message_description_md={messageDescriptionMd} />)
    .toJSON()
  expect(bg).toMatchSnapshot()
  expect(setInterval).toHaveBeenCalledTimes(1)
})
