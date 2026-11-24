import { screen } from "@testing-library/react-native"
import { AutosuggestResult } from "app/Components/AutosuggestResults/AutosuggestResults"
import { ArtistSearchResult } from "app/Scenes/MyCollection/Screens/ArtworkForm/Components/ArtistSearchResult"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

describe("ArtistSearchResult", () => {
  const result = {
    imageUrl: "image-url",
    displayLabel: "Banksy",
    formattedNationalityAndBirthday: "An Artist",
  }

  it("renders correct components", async () => {
    await renderWithWrappers(<ArtistSearchResult result={result as AutosuggestResult} />)
    expect(await screen.findByText("Banksy")).toBeTruthy()
    expect(await screen.findByText("An Artist")).toBeTruthy()
  })
})
