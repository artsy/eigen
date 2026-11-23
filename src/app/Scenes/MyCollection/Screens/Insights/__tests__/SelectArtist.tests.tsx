import { fireEvent, screen, waitFor } from "@testing-library/react-native"
import { MedianSalePriceAtAuction } from "app/Scenes/MyCollection/Screens/Insights/MedianSalePriceAtAuction"
import { getMockRelayEnvironment } from "app/system/relay/defaultEnvironment"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/utils/tests/resolveMostRecentRelayOperation"

const collectedArtists = [
  { internalID: "andy-warhol-id", name: "Andy Warhol" },
  { internalID: "banksy-id", name: "Banksy" },
  { internalID: "amoako-boafo-id", name: "Amoako Boafo" },
]

const resolveScreenQuery = (artist: { internalID: string; name: string }) =>
  resolveMostRecentRelayOperation(getMockRelayEnvironment(), {
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

const waitForScreenQuery = () =>
  waitFor(() =>
    expect(
      getMockRelayEnvironment().mock.getMostRecentOperation().request.node.operation.name
    ).toBe("MedianSalePriceAtAuctionQuery")
  )

describe("SelectArtist", () => {
  const renderScreen = async () => {
    await renderWithWrappers(
      <MedianSalePriceAtAuction artistID="andy-warhol-id" initialCategory="Painting" />
    )
    await waitForScreenQuery()
    await resolveScreenQuery(collectedArtists[0])
  }

  it("refetches the screen for the artist picked from the list", async () => {
    await renderScreen()

    expect(screen.getByText("Andy Warhol")).toBeOnTheScreen()

    await fireEvent.press(screen.getByText("Change Artist"))
    expect(screen.getByTestId("artist-section-item-Amoako Boafo")).toBeOnTheScreen()

    await fireEvent.press(screen.getByTestId("artist-section-item-Banksy"))

    await waitFor(() =>
      expect(getMockRelayEnvironment().mock.getMostRecentOperation().request.variables).toEqual(
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
