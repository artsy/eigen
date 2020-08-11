import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import React from "react"
import "react-native"
import Separator from "../Separator"

it("renders without throwing an error", () => {
  renderWithWrappers(<Separator />)
})
