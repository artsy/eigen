import React from "react"
import "react-native"
import * as renderer from "react-test-renderer"

jest.mock("@react-native-community/cameraroll", () => jest.fn())

import Consignments from "../"

it("Sets up the right navigator view hierarchy", () => {
  const tree = renderer.create(<Consignments />).toJSON()
  expect(tree).toMatchSnapshot()
})
