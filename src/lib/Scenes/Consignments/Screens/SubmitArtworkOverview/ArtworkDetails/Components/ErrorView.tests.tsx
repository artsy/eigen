import { renderWithWrappersTL } from "lib/tests/renderWithWrappers"
import React from "react"
import { ErrorView } from "./ErrorView"

describe("ErrorView", () => {
  it("renders a default message", () => {
    const { findByText } = renderWithWrappersTL(<ErrorView />)

    expect(findByText("problem with submission creation")).toBeTruthy()
  })

  it("renders a default message", () => {
    const { findByText } = renderWithWrappersTL(<ErrorView message="something errory" />)

    expect(findByText("something errory")).toBeTruthy()
  })
})
