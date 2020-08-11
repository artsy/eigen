import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import React from "react"

import Header from "../Header"

import { Theme } from "@artsy/palette"

it("renders without throwing a error", () => {
  const gene = {
    id: "gene-deep-time",
    internalID: "gravity-id",
    gravityID: "deep-time",
    name: "Deep Time",
  }

  renderWithWrappers(
    <Theme>
      <Header gene={gene as any} shortForm={false} />
    </Theme>
  )
})
