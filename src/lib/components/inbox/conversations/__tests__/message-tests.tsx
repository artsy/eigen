import * as React from "react"
import "react-native"
import * as renderer from "react-test-renderer"

import Message from "../message"

it("looks correct when rendered", () => {
  const tree = renderer.create(<Message />).toJSON()
  expect(tree).toMatchSnapshot()
})
