import React from "react"
import "react-native"
import * as renderer from "react-test-renderer"
import { BidResult } from "../BidResult"

it("renders winning screen properly", () => {
  const bg = renderer.create(<BidResult winning />).toJSON()
  expect(bg).toMatchSnapshot()
})
