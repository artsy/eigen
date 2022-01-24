import { AutosuggestResult } from "lib/Scenes/Search/AutosuggestResults"
import { renderWithWrappersTL } from "lib/tests/renderWithWrappers"
import React from "react"
import { ArtistSearchResult } from "./ArtistSearchResult"

describe("ArtistSearchResult", () => {
  const result = {
    imageUrl: "image-url",
    displayLabel: "Banksy",
    formattedNationalityAndBirthday: "An Artist",
  }

  it("renders correct components", () => {
    const { findByText } = renderWithWrappersTL(
      <ArtistSearchResult result={result as AutosuggestResult} />
    )
    expect(findByText("Banksy")).toBeTruthy()
    expect(findByText("An Artist")).toBeTruthy()
  })
})
