import React from "react"
import * as renderer from "react-test-renderer"
import TextArea from "../TextArea"

import { Theme } from "@artsy/palette"

it("shows the placeholder when text is empty", () => {
  const component = renderer
    .create(
      <Theme>
        <TextArea
          text={{
            placeholder: "some placeholder text",
          }}
        />
      </Theme>
    )
    .toJSON()
  expect(component).toMatchSnapshot()
})

it("doesn't show placeholder when initial text is present", () => {
  const component = renderer
    .create(
      <Theme>
        <TextArea
          text={{
            placeholder: "some placeholder text",
            value: "any text at all",
          }}
        />
      </Theme>
    )
    .toJSON()
  expect(component).toMatchSnapshot()
})
