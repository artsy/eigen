import React from "react"
import * as renderer from "react-test-renderer"
import Toggle from "../Toggle"

it("has the expected tree", () => {
  const component = renderer.create(<Toggle selected={true} left="L" right="R" />).toJSON()
  expect(component).toMatchSnapshot()
})
