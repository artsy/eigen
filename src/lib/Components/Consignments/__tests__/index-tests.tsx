import React from "react"
import "react-native"
import * as renderer from "react-test-renderer"

import Consignments from "../"
jest.mock("react-tracking")

it("Sets up the right view hierarchy", () => {
  const tree = renderer.create(<Consignments />).toJSON()
  expect(tree).toMatchSnapshot()
})
