import { screen } from "@testing-library/react-native"
import { ImageSearchResultsScreen } from "app/Scenes/ImageSearchResults/ImageSearchResults"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"

describe("ImageSearchResults", () => {
  const { renderWithRelay } = setupTestWrapper({
    Component: () => <ImageSearchResultsScreen s3Bucket="some-bucket" s3Key="some-key" />,
  })

  it("renders the artworks matching the uploaded image", async () => {
    renderWithRelay({
      ArtworkConnection: () => ({ edges: [{}] }),
      Artwork: () => ({ artistNames: "Matched Artist" }),
    })

    expect(await screen.findByText("Matched Artist")).toBeTruthy()
  })

  it("shows an empty state when there are no matches", async () => {
    renderWithRelay({
      ArtworkConnection: () => ({ edges: [] }),
    })

    expect(
      await screen.findByText("We couldn’t find any matches for that image. Try another photo.")
    ).toBeTruthy()
  })
})
