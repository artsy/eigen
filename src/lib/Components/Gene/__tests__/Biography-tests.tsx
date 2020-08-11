import "react-native"

import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import React from "react"

import Biography from "../Biography"

import { Theme } from "@artsy/palette"

it("renders without throwing a error", () => {
  const gene = {
    description: "Watercolor painting is very nice",
  }
  renderWithWrappers(
    <Theme>
      <Biography gene={gene as any} />
    </Theme>
  )
})
