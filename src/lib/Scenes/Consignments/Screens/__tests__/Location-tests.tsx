import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import React from "react"
import "react-native"
import Location from "../Location"

it("renders without throwing an error", () => {
  const nav = {} as any
  const route = {} as any
  renderWithWrappers(<Location navigator={nav} route={route} />)
})
