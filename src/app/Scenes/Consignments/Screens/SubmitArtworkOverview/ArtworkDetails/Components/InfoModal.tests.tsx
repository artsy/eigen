import { renderWithWrappersTL } from "app/tests/renderWithWrappers"
import React from "react"
import { InfoModal } from "./InfoModal"

describe("InfoModal", () => {
  it("renders the passed title", async () => {
    const { findByText } = renderWithWrappersTL(
      <InfoModal title="someTitle" visible onDismiss={jest.fn()} />
    )
    expect(await findByText("someTitle")).toBeTruthy()
  })
})
