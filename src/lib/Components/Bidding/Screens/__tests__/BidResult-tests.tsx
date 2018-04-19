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

  const bg = renderer.create(<BidResult winning={false} />).toJSON()

  expect(bg).toMatchSnapshot()
  expect(setInterval).toHaveBeenCalledTimes(1)
})
