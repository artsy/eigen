import { fireEvent, screen } from "@testing-library/react-native"
import { GameArtworkImageTestQuery } from "__generated__/GameArtworkImageTestQuery.graphql"
import { GameArtworkImage } from "app/Scenes/ArtworkArtistGame/Components/GameArtworkImage"
import { navigate } from "app/system/navigation/navigate"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

describe("GameArtworkImage", () => {
  const { renderWithRelay } = setupTestWrapper<GameArtworkImageTestQuery>({
    Component: ({ artwork }) => (
      <GameArtworkImage
        imageURL="https://example.com/art.jpg"
        width={200}
        height={150}
        href="/artwork/some-artwork"
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        artworkRef={artwork!}
      />
    ),
    query: graphql`
      query GameArtworkImageTestQuery @relay_test_operation {
        artwork(id: "x") {
          ...useSaveArtworkToArtworkLists_artwork
        }
      }
    `,
    wrapperProps: { includeArtworkLists: true },
  })

  it("shows the save affordance and the double-tap hint", () => {
    renderWithRelay({ Artwork: () => ({ isSaved: false }) })

    expect(screen.getByText("Save")).toBeOnTheScreen()
    expect(screen.getByTestId("empty-heart-icon")).toBeOnTheScreen()
    expect(screen.getByText("Double tap the artwork to save it")).toBeOnTheScreen()
  })

  it("renders the saved state when the artwork is already saved", () => {
    renderWithRelay({ Artwork: () => ({ isSaved: true }) })

    expect(screen.getByText("Saved")).toBeOnTheScreen()
    expect(screen.getByTestId("filled-heart-icon")).toBeOnTheScreen()
  })

  it("saves the artwork when the heart button is pressed", () => {
    renderWithRelay({ Artwork: () => ({ isSaved: false }) })

    fireEvent.press(screen.getByLabelText("Save artwork"))

    // Optimistic update flips the heart to the saved state.
    expect(screen.getByText("Saved")).toBeOnTheScreen()
  })

  it("navigates to the artwork page", () => {
    renderWithRelay({ Artwork: () => ({ isSaved: false }) })

    fireEvent.press(screen.getByTestId("game-view-artwork-link"))

    expect(navigate).toHaveBeenCalledWith("/artwork/some-artwork")
  })
})
