import "react-native"

import * as React from "react"
import * as renderer from "react-test-renderer"

import NavigationButton from "../navigation_button"

it("renders properly", () => {
  const button = renderer.create(<NavigationButton title={"I am a navigation button"} href="/some/path" />).toJSON()
  expect(button).toMatchSnapshot()
})
