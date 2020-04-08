import React from "react"
import * as renderer from "react-test-renderer"
import Toggle from "../Toggle"

import { Theme } from "@artsy/palette"

it("renders without throwing an error", () => {
  renderer.create(
    <Theme>
      <Toggle selected={true} left="L" right="R" />
    </Theme>
  )
})
