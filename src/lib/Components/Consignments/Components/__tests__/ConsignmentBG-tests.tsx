import "react-native"

import React from "react"
import * as renderer from "react-test-renderer"

import ConsignmentsBG from "../ConsignmentBG"

it("renders properly", () => {
  const bg = renderer.create(<ConsignmentsBG />).toJSON()
  expect(bg).toMatchSnapshot()
})
