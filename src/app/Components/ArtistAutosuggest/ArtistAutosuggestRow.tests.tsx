import { AutosuggestResult } from "app/Scenes/Search/AutosuggestResults"
import { renderWithWrappers } from "app/tests/renderWithWrappers"
import { ArtistAutosuggestRow } from "./ArtistAutosuggestRow"

const onResultPress = jest.fn()

describe("ArtistAutosuggestRow", () => {
  const result = {
    imageUrl: "caspar_david",
    displayLabel: "Caspar David Friedrich",
  }

  it("renders displayLabel of result artist", () => {
    const { findByText } = renderWithWrappers(
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
