import { waitFor } from "@testing-library/react-native"
import { ArtistAutosuggestRow } from "app/Components/ArtistAutosuggest/ArtistAutosuggestRow"
import { AutosuggestResult } from "app/Components/AutosuggestResults/AutosuggestResults"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

const onResultPress = jest.fn()

describe("ArtistAutosuggestRow", () => {
  const result = {
    imageUrl: "caspar_david",
    displayLabel: "Caspar David Friedrich",
  }

  it("renders displayLabel of result artist", async () => {
    const { findByText } = renderWithWrappers(
      <ArtistAutosuggestRow
        highlight="caspar david"
        result={result as AutosuggestResult}
        onResultPress={onResultPress}
      />
    )

    await waitFor(() => {
      const artistName = findByText(result.displayLabel)
      expect(artistName).toBeTruthy()
    })
  })
})
