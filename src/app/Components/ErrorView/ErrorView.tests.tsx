import { renderWithWrappersTL } from "app/tests/renderWithWrappers"
import React from "react"
import { ErrorView } from "./ErrorView"

describe("ErrorView", () => {
  it("renders a default message", async () => {
    const { findByText } = renderWithWrappersTL(<ErrorView />)
    expect(
      await findByText(
        "There seems to be a problem with submission creation. Please try again shortly."
      )
    ).toBeTruthy()
  })

  it("renders a default message", async () => {
    const { findByText } = renderWithWrappersTL(<ErrorView message="something errory" />)
    expect(await findByText("something errory")).toBeTruthy()
  })
})
