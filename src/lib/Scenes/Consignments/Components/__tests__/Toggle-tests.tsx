import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import React from "react"
import Toggle from "../Toggle"

import { Theme } from "@artsy/palette"

it("renders without throwing an error", () => {
  renderWithWrappers(
    <Theme>
      <Toggle selected={true} left="L" right="R" />
    </Theme>
  )
})
