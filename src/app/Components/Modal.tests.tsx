import { renderWithWrappers } from "app/tests/renderWithWrappers"
import React from "react"
import "react-native"

import { Modal } from "./Modal"

it("renders without throwing an error", () => {
  renderWithWrappers(<Modal headerText="An error occurred" detailText="This is an error moop." />)
})
