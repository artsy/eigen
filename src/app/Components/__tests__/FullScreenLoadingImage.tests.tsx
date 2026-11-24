import { screen } from "@testing-library/react-native"
import { FullScreenLoadingImage } from "app/Components/FullScreenLoadingImage"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

describe("FullScreenLoadingImage", () => {
  it("renders loading text initially", async () => {
    await renderWithWrappers(
      <FullScreenLoadingImage
        loadingText="Loading content..."
        imgSource={{ uri: "https://example.com/image.jpg" }}
      />
    )

    expect(screen.getByText("Loading content...")).toBeTruthy()
  })
})
