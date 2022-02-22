import { renderWithWrappers } from "app/tests/renderWithWrappers"
import React from "react"
import "react-native"
import Location from "./Location"

it("renders without throwing an error", () => {
  const nav = {} as any
  renderWithWrappers(<Location navigator={nav} />)
})
