import React from "react"
import "react-native"
import * as renderer from "react-test-renderer"

import { Button } from "../Button"

it("renders properly", () => {
  const bg = renderer.create(<Button text="next" />).toJSON()
  expect(bg).toMatchSnapshot()
})
