import { screen } from "@testing-library/react-native"
import { ArtworkErrorScreen } from "app/Scenes/Artwork/Components/ArtworkError"
import { getMockRelayEnvironment } from "app/system/relay/defaultEnvironment"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { act } from "react"

describe("ArtworkError", () => {
  it("shows error message", async () => {
    const { renderWithRelay } = setupTestWrapper({
      Component: ArtworkErrorScreen,
    })

    await renderWithRelay({})

    expect(screen.queryByTestId("placeholder")).not.toBeOnTheScreen()

    expect(screen.getByText("The artwork you were looking for isn't available.")).toBeTruthy()
  })

  it("doesn't add a second back button when loading fails", async () => {
    await renderWithWrappers(<ArtworkErrorScreen />)

    await act(async () => {
      getMockRelayEnvironment().mock.rejectMostRecentOperation(new Error("Network request failed"))
    })

    expect(await screen.findByText("Unable to load")).toBeOnTheScreen()
    // The Artwork route's header already provides the back button
    expect(screen.queryByLabelText("Go back")).not.toBeOnTheScreen()
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
