import { renderWithWrappersTL } from "app/tests/renderWithWrappers"
import React from "react"
import { ProgressBar } from "./ProgressBar"

describe("ProgressBar", () => {
  it("renders a ProgressBar", () => {
    const component = renderWithWrappersTL(<ProgressBar progress={0.3} />)

    expect(component).not.toBeNull()
  })
})
