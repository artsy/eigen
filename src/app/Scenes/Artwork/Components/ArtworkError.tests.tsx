import { screen, waitForElementToBeRemoved } from "@testing-library/react-native"
import { ArtworkErrorScreen } from "app/Scenes/Artwork/Components/ArtworkError"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"

describe("ArtworkError", () => {
  it("shows error message", async () => {
    const { renderWithRelay } = setupTestWrapper({
      Component: ArtworkErrorScreen,
    })

    renderWithRelay({})

    await waitForElementToBeRemoved(() => screen.queryByTestId("placeholder"))

    expect(
      screen.getByText("Sorry, the page you were looking for doesn't exist at this URL.")
    ).toBeTruthy()
  })

  it("shows artwork recommendations if they're available", async () => {
    const { renderWithRelay } = setupTestWrapper({
      Component: ArtworkErrorScreen,
    })

    renderWithRelay({})

    await waitForElementToBeRemoved(() => screen.queryByTestId("placeholder"))

    expect(screen.getByText("Artworks Recommendations")).toBeTruthy()
  })

  it("shows NWFY if no artworks recommendations are available", async () => {
    const { renderWithRelay } = setupTestWrapper({
      Component: ArtworkErrorScreen,
    })

    renderWithRelay({
      Me: () => ({
        artistRecommendationsCount: {
          totalCount: 0,
        },
      }),
    })

    await waitForElementToBeRemoved(() => screen.queryByTestId("placeholder"))

    expect(screen.getByText("New Works for You")).toBeTruthy()
  })

  it("shows recently viewed artworks", async () => {
    const { renderWithRelay } = setupTestWrapper({
      Component: ArtworkErrorScreen,
    })

    renderWithRelay({})

    await waitForElementToBeRemoved(() => screen.queryByTestId("placeholder"))

    expect(screen.getByText("Recently Viewed")).toBeTruthy()
  })
})
