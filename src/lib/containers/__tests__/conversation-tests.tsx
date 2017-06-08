import * as React from "react"
import "react-native"
import * as renderer from "react-test-renderer"
import Conversation from "../conversation"

it("looks correct when rendered", () => {
  const tree = renderer.create(<Conversation />).toJSON()
  expect(tree).toMatchSnapshot()
})
