import React from "react"
import * as renderer from "react-test-renderer"
import Toggle from "../Toggle"

import { Theme } from "@artsy/palette"

it("has the expected tree", () => {
  const component = renderer
    .create(
      <Theme>
        <Toggle selected={true} left="L" right="R" />
      </Theme>
    )
    .toJSON()
  expect(component).toMatchSnapshot()
})
