import { fireEvent, screen, waitFor } from "@testing-library/react-native"
import { MedianSalePriceAtAuction } from "app/Scenes/MyCollection/Screens/Insights/MedianSalePriceAtAuction"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"

const collectedArtists = [
  { internalID: "andy-warhol-id", name: "Andy Warhol" },
  { internalID: "banksy-id", name: "Banksy" },
  { internalID: "amoako-boafo-id", name: "Amoako Boafo" },
]

const screenData = (artist: { internalID: string; name: string }) => ({
  Query: () => ({
    artist: { ...artist, imageUrl: null },
    me: {
      myCollectionInfo: { artistsCount: collectedArtists.length },
      userInterestsConnection: {
        edges: collectedArtists.map((node) => ({ node: { __typename: "Artist", ...node } })),
      },
    },
  }),
})

describe("SelectArtist", () => {
  const { renderWithRelay } = setupTestWrapper({
    Component: () => (
      <MedianSalePriceAtAuction artistID="andy-warhol-id" initialCategory="Painting" />
    ),
  })

  const renderScreen = () => renderWithRelay(screenData(collectedArtists[0]))

  it("refetches the screen for the artist picked from the list", async () => {
    const { env } = await renderScreen()

    expect(screen.getByText("Andy Warhol")).toBeOnTheScreen()

    await fireEvent.press(screen.getByText("Change Artist"))
    expect(screen.getByTestId("artist-section-item-Amoako Boafo")).toBeOnTheScreen()

    await fireEvent.press(screen.getByTestId("artist-section-item-Banksy"))

    await waitFor(() =>
      expect(env.mock.getMostRecentOperation().request.variables).toEqual(
        expect.objectContaining({ artistID: "banksy-id", artistId: "banksy-id" })
      )
    )
  })

  it("narrows the list to the artists matching the search", async () => {
    await renderScreen()

    await fireEvent.press(screen.getByText("Change Artist"))
    await fireEvent.changeText(screen.getByTestId("select-artists-search-input"), "Boafo")

    expect(screen.getByTestId("artist-section-item-Amoako Boafo")).toBeOnTheScreen()
    expect(screen.queryByTestId("artist-section-item-Banksy")).not.toBeOnTheScreen()
    expect(screen.queryByTestId("artist-section-item-Andy Warhol")).not.toBeOnTheScreen()
  })

  it("shows an error when no artist matches the search", async () => {
    await renderScreen()

    await fireEvent.press(screen.getByText("Change Artist"))
    await fireEvent.changeText(
      screen.getByTestId("select-artists-search-input"),
      "Artist doesn't exist"
    )

    expect(
      screen.getByText(
        "Please select from the list of artists in your collection with insights available."
      )
    ).toBeOnTheScreen()
    expect(screen.queryByTestId("artist-section-item-Banksy")).not.toBeOnTheScreen()
  })
})
