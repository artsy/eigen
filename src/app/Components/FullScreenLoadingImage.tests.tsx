import { screen } from "@testing-library/react-native"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { FullScreenLoadingImage } from "./FullScreenLoadingImage"

jest.mock("./CircularSpinner", () => ({
  CircularSpinner: () => "<CircularSpinner />",
}))

describe("FullScreenLoadingImage", () => {
  it("renders loading text initially", () => {
    renderWithWrappers(
      <FullScreenLoadingImage
        loadingText="Loading content..."
        imgSource={{ uri: "https://example.com/image.jpg" }}
      />
    )

    expect(screen.getByText("Loading content...")).toBeTruthy()
  })
})
