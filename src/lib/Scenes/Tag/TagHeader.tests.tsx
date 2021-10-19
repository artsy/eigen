import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import React from "react"

import Header from "./TagHeader"

it("renders without throwing a error", () => {
  const tag = {
    name: "Handmade Paper",
  }

  renderWithWrappers(<Header tag={tag as any} />)
})
