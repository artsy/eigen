import { renderWithWrappersTL } from "lib/tests/renderWithWrappers"
import React from "react"
import "react-native"

import { ArtworkDetails } from "./ArtworkDetails"

it("renders without throwing an error", () => {
  renderWithWrappersTL(<ArtworkDetails handlePress={() => console.log("do nothing")} />)
})

// add more tests
