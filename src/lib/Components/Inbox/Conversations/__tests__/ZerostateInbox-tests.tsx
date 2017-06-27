import "jest-snapshots-svg"
import * as React from "react"
import "react-native"
import * as renderer from "react-test-renderer"

import Inbox from "../"

it("looks correct when the user has no conversations", () => {
  const tree = renderer.create(<Inbox me={{ conversations: { edges: [] } }} />).toJSON()
  expect(tree).toMatchSnapshot()
})

it("renders correct when the user has no conversations", () => {
  const tree = renderer.create(<Inbox me={{ conversations: { edges: [] } }} />).toJSON()
  expect(tree).toMatchSVGSnapshot(375, 667)
})
