import { renderWithWrappersTL } from "lib/tests/renderWithWrappers"
import { artworkRarityClassifications } from "lib/utils/artworkRarityClassifications"
import React from "react"
import { InfoModal } from "./InfoModal"

describe("InfoModal", () => {
  const mockTitle = "someTitle"

  it("renders the passed title", () => {
    const { findByText } = renderWithWrappersTL(
      <InfoModal title={mockTitle} visible isRarity={false} onDismiss={jest.fn()} />
    )

    expect(findByText(mockTitle)).toBeTruthy()
  })

  it("renders rarity labels and descriptions, when isRarity is true", () => {
    const { findByText } = renderWithWrappersTL(<InfoModal title={mockTitle} visible isRarity onDismiss={jest.fn()} />)

    artworkRarityClassifications.map((classification) => {
      expect(findByText(classification.label)).toBeTruthy()
      expect(findByText(classification.description)).toBeTruthy()
    })
  })

  it("renders provenance description, when isRarity is false", () => {
    const { findByText } = renderWithWrappersTL(
      <InfoModal title={mockTitle} visible isRarity={false} onDismiss={jest.fn()} />
    )

    expect(findByText("Provenance is the documented history")).toBeTruthy()
  })
})
