import { renderWithWrappersTL } from "lib/tests/renderWithWrappers"
import React from "react"
import { InfoModal } from "./InfoModal"

describe("InfoModal", () => {
  it("renders the passed title", () => {
    const { findByText } = renderWithWrappersTL(<InfoModal title="someTitle" visible onDismiss={jest.fn()} />)
    expect(findByText("someTitle")).toBeTruthy()
  })
})
