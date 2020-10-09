import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import React from "react"
import "react-native"
import { LoadingBlock } from "../LoadingBlock"

describe("LoadingModal", () => {
  it("renders without throwing when invisible", () => {
    renderWithWrappers(<LoadingBlock />)
  })
})
