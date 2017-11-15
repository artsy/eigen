import React from "react"
import "react-native"
import * as renderer from "react-test-renderer"
import Consignments from "../"

it("Sets up the right view hierarchy", () => {
  const tree = renderer.create(<Consignments />).toJSON()
  expect(tree).toMatchSnapshot()
})
