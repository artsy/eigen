import "react-native"

import * as React from "react"
import * as renderer from "react-test-renderer"

import Circle from "../circle_image"

it("renders properly", () => {
  const button = renderer.create(<Circle source={require("../../images/email.png")} />).toJSON()
  expect(button).toMatchSnapshot()
})
