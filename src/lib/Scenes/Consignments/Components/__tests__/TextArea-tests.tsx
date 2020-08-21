import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import React from "react"
import TextArea from "../TextArea"

import { extractText } from "lib/tests/extractText"

it("shows the placeholder when text is empty", () => {
  const component = renderWithWrappers(
    <TextArea
      text={{
        placeholder: "some placeholder text",
      }}
    />
  )
  expect(extractText(component.root)).toMatch("some placeholder text")
})

it("doesn't show placeholder when initial text is present", () => {
  const component = renderWithWrappers(
    <TextArea
      text={{
        placeholder: "some placeholder text",
        value: "any text at all",
      }}
    />
  )
  expect(extractText(component.root)).not.toMatch("some placeholder text")
})
