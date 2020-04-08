import React from "react"
import * as renderer from "react-test-renderer"
import TextArea from "../TextArea"

import { Theme } from "@artsy/palette"
import { extractText } from "lib/tests/extractText"

it("shows the placeholder when text is empty", () => {
  const component = renderer.create(
    <Theme>
      <TextArea
        text={{
          placeholder: "some placeholder text",
        }}
      />
    </Theme>
  )
  expect(extractText(component.root)).toMatch("some placeholder text")
})

it("doesn't show placeholder when initial text is present", () => {
  const component = renderer.create(
    <Theme>
      <TextArea
        text={{
          placeholder: "some placeholder text",
          value: "any text at all",
        }}
      />
    </Theme>
  )
  expect(extractText(component.root)).not.toMatch("some placeholder text")
})
