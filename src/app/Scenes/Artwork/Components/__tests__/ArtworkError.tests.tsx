import { screen } from "@testing-library/react-native"
import { ArtworkErrorScreen } from "app/Scenes/Artwork/Components/ArtworkError"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"

describe("ArtworkError", () => {
  it("shows error message", async () => {
    const { renderWithRelay } = setupTestWrapper({
      Component: ArtworkErrorScreen,
    })

    await renderWithRelay({})

    expect(screen.queryByTestId("placeholder")).not.toBeOnTheScreen()

    expect(screen.getByText("The artwork you were looking for isn't available.")).toBeTruthy()
  })

  it("shows artwork recommendations if they're available", async () => {
    const { renderWithRelay } = setupTestWrapper({
      Component: ArtworkErrorScreen,
    })

    await renderWithRelay({})

    expect(screen.queryByTestId("placeholder")).not.toBeOnTheScreen()

    expect(screen.getByText("Artworks Recommendations")).toBeTruthy()
  })

  it("shows NWFY if no artworks recommendations are available", async () => {
    const { renderWithRelay } = setupTestWrapper({
      Component: ArtworkErrorScreen,
    })

    await renderWithRelay({
      Me: () => ({
        artworkRecommendationsCount: {
          totalCount: 0,
        },
      }),
    })

    expect(screen.queryByTestId("placeholder")).not.toBeOnTheScreen()

    expect(screen.getByText("New Works for You")).toBeTruthy()
  })

  it("shows recently viewed artworks", async () => {
    const { renderWithRelay } = setupTestWrapper({
      Component: ArtworkErrorScreen,
    })

    await renderWithRelay({})

    expect(screen.queryByTestId("placeholder")).not.toBeOnTheScreen()

    expect(screen.getByText("Recently Viewed")).toBeTruthy()
  })
})
