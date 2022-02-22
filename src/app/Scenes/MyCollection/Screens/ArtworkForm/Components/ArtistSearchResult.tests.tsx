import { AutosuggestResult } from "app/Scenes/Search/AutosuggestResults"
import { renderWithWrappersTL } from "app/tests/renderWithWrappers"
import React from "react"
import { ArtistSearchResult } from "./ArtistSearchResult"

describe("ArtistSearchResult", () => {
  const result = {
    imageUrl: "image-url",
    displayLabel: "Banksy",
    formattedNationalityAndBirthday: "An Artist",
  }

  it("renders correct components", async () => {
    const { findByText } = renderWithWrappersTL(
      <ArtistSearchResult result={result as AutosuggestResult} />
    )
    expect(await findByText("Banksy")).toBeTruthy()
    expect(await findByText("An Artist")).toBeTruthy()
  })
})
