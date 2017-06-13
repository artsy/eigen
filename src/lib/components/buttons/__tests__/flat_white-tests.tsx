import "react-native"

import * as React from "react"
import * as renderer from "react-test-renderer"

import WhiteButton from "../flat_white"

it("renders properly", () => {
  const button = renderer.create(<WhiteButton selected={true} text={"I am a button"} />).toJSON()
  expect(button).toMatchSnapshot()
})
