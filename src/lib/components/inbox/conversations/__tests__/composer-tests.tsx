import * as React from "react"
import "react-native"
import * as renderer from "react-test-renderer"

import Composer from "../composer"

it("looks correct when rendered", () => {
  const tree = renderer.create(<Composer />).toJSON()
  expect(tree).toMatchSnapshot()
})
