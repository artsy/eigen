import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import React from "react"
import "react-native"

import { Title } from "./Title"

it("renders without throwing an error", () => {
  renderWithWrappers(<Title>Confirm your bid</Title>)
})
