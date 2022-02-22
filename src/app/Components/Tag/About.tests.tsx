import React from "react"
import "react-native"

import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import About from "./About"

it("renders without throwing a error", () => {
  const tag = {
    description: `Handmade Paper is very nice`,
  }

  renderWithWrappers(<About tag={tag as any} />)
})
