import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import React from "react"
import "react-native"
import ConnectivityBanner from "./ConnectivityBanner"

it("renders without throwing an error", () => {
  renderWithWrappers(<ConnectivityBanner />)
})
