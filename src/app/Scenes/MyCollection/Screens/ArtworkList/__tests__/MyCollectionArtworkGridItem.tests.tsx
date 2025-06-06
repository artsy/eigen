import { tappedCollectedArtwork } from "@artsy/cohesion"
import { fireEvent, screen } from "@testing-library/react-native"
import { MyCollectionArtworkGridItemTestsQuery } from "__generated__/MyCollectionArtworkGridItemTestsQuery.graphql"
import { MyCollectionArtworkGridItemFragmentContainer } from "app/Scenes/MyCollection/Screens/ArtworkList/MyCollectionArtworkGridItem"
import { navigate } from "app/system/navigation/navigate"
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

const mockArtwork = {
  internalID: "artwork-id",
  slug: "artwork-slug",
  artist: {
    internalID: "artist-id",
  },
  images: null,
  medium: "artwork medium",
  mediumType: {
    name: "artwork category",
  },
}

describe("MyCollectionArtworkGridItem", () => {
  const { renderWithRelay } = setupTestWrapper<MyCollectionArtworkGridItemTestsQuery>({
    Component: ({ artwork }) => <MyCollectionArtworkGridItemFragmentContainer artwork={artwork!} />,
    query: graphql`
      query MyCollectionArtworkGridItemTestsQuery @relay_test_operation {
        artwork(id: "some-slug") {
          ...MyCollectionArtworkGridItem_artwork
        }
      }
    `,
  })

  it("renders correct fields", () => {
    renderWithRelay({
      Artwork: () => ({
        ...mockArtwork,
        artistNames: "artistNames",
        title: "title",
      }),
    })

    expect(screen.getByLabelText("Go to artwork details")).toBeOnTheScreen()
    expect(screen.getByTestId("Fallback")).toBeOnTheScreen()

    expect(screen.getByText("artistNames")).toBeOnTheScreen()
    expect(screen.getByText("title")).toBeOnTheScreen()
  })

  it("navigates to artwork detail on tap", () => {
    renderWithRelay({
      Artwork: () => ({
        ...mockArtwork,
      }),
    })

    fireEvent.press(screen.getByLabelText("Go to artwork details"))

    expect(navigate).toHaveBeenCalledWith("/my-collection/artwork/artwork-slug", {
      passProps: {
        artistInternalID: "artist-id",
        medium: "artwork medium",
        category: "artwork category",
      },
    })
  })

  it("tracks analytics event on tap", () => {
    renderWithRelay({
      Artwork: () => ({
        ...mockArtwork,
      }),
    })

    fireEvent.press(screen.getByLabelText("Go to artwork details"))

    expect(mockTrackEvent).toHaveBeenCalledTimes(1)
    expect(mockTrackEvent).toHaveBeenCalledWith(
      tappedCollectedArtwork({
        destinationOwnerId: "artwork-id",
        destinationOwnerSlug: "artwork-slug",
      })
    )
  })

  it("shows fallback if no image url available", async () => {
    renderWithRelay({
      Artwork: () => ({
        images: [
          {
            url: null,
          },
        ],
      }),
    })

    expect(screen.getByTestId("Fallback")).toBeOnTheScreen()
  })

  it("renders the high demand icon if artist is P1 and demand rank is over 9", () => {
    renderWithRelay({
      Artwork: () => ({
        internalID: "artwork-id",
        slug: "artwork-slug",
        artist: {
          internalID: "artist-id",
          targetSupply: {
            isP1: true,
          },
        },
        medium: "artwork medium",
        marketPriceInsights: {
          demandRank: 0.91,
        },
      }),
    })

    expect(screen.getByTestId("test-high-demand-signal")).toBeTruthy()
  })

  it("does not render the high demand icon if artist is P1 and artwork is submitted for sale", () => {
    renderWithRelay({
      Artwork: () => ({
        internalID: "artwork-id",
        slug: "artwork-slug",
        artist: {
          internalID: "artist-id",
          targetSupply: {
            isP1: false,
          },
        },
        medium: "artwork medium",
        marketPriceInsights: {
          demandRank: 0.91,
        },
      }),
    })

    expect(screen.queryByTestId("test-high-demand-signal")).toBeFalsy()
  })
})
