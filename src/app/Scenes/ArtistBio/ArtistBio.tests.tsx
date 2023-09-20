import { screen, waitForElementToBeRemoved } from "@testing-library/react-native"
import { ArtistBioScreen } from "app/Scenes/ArtistBio/ArtistBio"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"

describe("ArtistBioScreen", () => {
  const { renderWithRelay } = setupTestWrapper({
    Component: () => <ArtistBioScreen artistID="andy-warhol" />,
  })

  it("renders without throwing an error", async () => {
    renderWithRelay({
      Artist: () => ({
        name: "Andy Warhol",
        biographyBlurb: {
          text: "Andy Warhol was an American artist, film director, and producer who was a leading figure in the visual art movement known as pop art.",
        },
      }),
    })

    // screen.debug()

    await waitForElementToBeRemoved(() => screen.getByTestId("ArtistBioScreenPlaceholder"))

    // screen.debug()

    expect(screen.queryByText("Andy Warhol")).toBeOnTheScreen()
    expect(
      screen.queryByText(
        "Andy Warhol was an American artist, film director, and producer who was a leading figure in the visual art movement known as pop art."
      )
    ).toBeOnTheScreen()
  })
})
