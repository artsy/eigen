import React from "react"
import "react-native"

// Note: test renderer must be required after react-native.
import { renderWithWrappers } from "lib/tests/renderWithWrappers"

import About from "../About"

it("renders without throwing a error", () => {
  const tag = {
    description: `Handmade Paper is so cool`,
  }

  renderWithWrappers(<About tag={tag as any} />)
})
