import { AutosuggestResult } from "lib/Scenes/Search/AutosuggestResults"
import { renderWithWrappersTL } from "lib/tests/renderWithWrappers"
import React from "react"
import { ArtistAutosuggestRow } from "./ArtistAutosuggestRow"

const onResultPress = jest.fn()

describe("ArtistAutosuggestRow", () => {
  const result = {
    imageUrl: "caspar_david",
    displayLabel: "Caspar David Friedrich",
  }

  it("renders displayLabel of result artist", () => {
    const { findByText } = renderWithWrappersTL(
      <ArtistAutosuggestRow
        highlight="caspar david"
        result={result as AutosuggestResult}
        onResultPress={onResultPress}
      />
    )
    const artistName = findByText(result.displayLabel)
    expect(artistName).toBeTruthy()
  })
})
