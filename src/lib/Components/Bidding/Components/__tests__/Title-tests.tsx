import React from "react"
import "react-native"
import * as renderer from "react-test-renderer"

import { Title } from "../Title"

it("renders properly", () => {
  const bg = renderer.create(<Title>Confirm your bid</Title>).toJSON()
  expect(bg).toMatchSnapshot()
})
