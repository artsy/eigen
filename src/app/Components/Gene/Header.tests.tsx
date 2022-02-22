import { renderWithWrappers } from "app/tests/renderWithWrappers"
import React from "react"

import Header from "./Header"

it("renders without throwing a error", () => {
  const gene = {
    id: "gene-deep-time",
    internalID: "gravity-id",
    gravityID: "deep-time",
    name: "Deep Time",
  }

  renderWithWrappers(<Header gene={gene as any} shortForm={false} />)
})
