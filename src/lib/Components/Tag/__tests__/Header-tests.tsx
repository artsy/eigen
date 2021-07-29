import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import React from "react"

import Header from "../Header"

it("renders without throwing a error", () => {
  const tag = {
    id: "handmade-paper",
    internalID: "gravity-id",
    gravityID: "handmade-paper",
    name: "Handmade Paper",
  }

  renderWithWrappers(<Header tag={tag as any} />)
})
