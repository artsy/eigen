import { screen } from "@testing-library/react-native"
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
    await renderWithWrappers(
      <ArtistAutosuggestRow
        highlight="caspar david"
        result={result as AutosuggestResult}
        onResultPress={onResultPress}
      />
    )

    expect(await screen.findByText(result.displayLabel)).toBeOnTheScreen()
  })
})
