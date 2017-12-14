import React from "react"
import * as renderer from "react-test-renderer"
import TextArea from "../TextArea"

it("shows the placeholder when text is empty", () => {
  const component = renderer.create(<TextArea text={{ placeholder: "some placeholder text" }} />).toJSON()
  expect(component).toMatchSnapshot()
})

it("doesn't show placeholder when initial text is present", () => {
  const component = renderer
    .create(<TextArea text={{ placeholder: "some placeholder text", value: "any text at all" }} />)
    .toJSON()
  expect(component).toMatchSnapshot()
})
