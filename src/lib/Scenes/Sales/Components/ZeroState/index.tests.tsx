import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import React from "react"
import "react-native"
import { ZeroState } from "./index"

it("renders without throwing an error", () => {
  renderWithWrappers(<ZeroState />)
})
