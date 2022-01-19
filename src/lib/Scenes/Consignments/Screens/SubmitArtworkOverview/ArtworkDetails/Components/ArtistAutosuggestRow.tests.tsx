import { fireEvent } from "@testing-library/react-native"
import { AutosuggestResult } from "lib/Scenes/Search/AutosuggestResults"
import { renderWithWrappersTL } from "lib/tests/renderWithWrappers"
import React from "react"
import { act } from "react-test-renderer"
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

  it("fires onResultPress on artist select", () => {
    const { getByText } = renderWithWrappersTL(
      <ArtistAutosuggestRow
        highlight="caspar david"
        result={result as AutosuggestResult}
        onResultPress={onResultPress}
      />
    )

    const artistRow = getByText(result.displayLabel)
    act(() => fireEvent.press(artistRow))
    expect(onResultPress).toHaveBeenCalled()
  })
})
