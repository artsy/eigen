import "react-native"

import React from "react"
import * as renderer from "react-test-renderer"

import InvertedButton from "../InvertedButton"

it("renders properly", () => {
  const button = renderer.create(<InvertedButton text={"I am an inverted button"} />).toJSON()
  expect(button).toMatchSnapshot()
})
