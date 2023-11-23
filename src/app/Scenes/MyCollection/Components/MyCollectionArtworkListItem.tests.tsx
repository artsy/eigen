import { tappedCollectedArtwork } from "@artsy/cohesion"
import { fireEvent, screen } from "@testing-library/react-native"
import { MyCollectionArtworkListItemTestsQuery } from "__generated__/MyCollectionArtworkListItemTestsQuery.graphql"
import { OpaqueImageView } from "app/Components/OpaqueImageView2"
import { navigate } from "app/system/navigation/navigate"
import * as LocalImageStore from "app/utils/LocalImageStore"
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"
import { MyCollectionArtworkListItem } from "./MyCollectionArtworkListItem"

jest.mock("app/utils/LocalImageStore", () => ({
  ...jest.requireActual("app/utils/LocalImageStore"),
  useLocalImage: jest.fn(),
}))

describe("MyCollectionArtworkListItem", () => {
  const { renderWithRelay } = setupTestWrapper<MyCollectionArtworkListItemTestsQuery>({
    Component: ({ artwork }) => <MyCollectionArtworkListItem artwork={artwork!} />,
    query: graphql`
      query MyCollectionArtworkListItemTestsQuery @relay_test_operation {
        artwork(id: "artwork-id") {
          ...MyCollectionArtworkListItem_artwork
        }
      }
    `,
  })

  it("renders the fields correctly", () => {
    renderWithRelay({
      Artwork: () => ({
        internalID: "artwork-id",
        slug: "artwork-slug",
        artist: {
          internalID: "artist-id",
        },
        image: null,
        medium: "artwork medium",
      }),
    })

    expect(screen.getByTestId("no-artwork-icon")).toBeOnTheScreen()
    expect(screen.getByTestId("artwork-title")).toBeOnTheScreen()
    expect(screen.getByTestId("artwork-date")).toBeOnTheScreen()
    expect(screen.getByTestId("artwork-medium")).toBeOnTheScreen()
  })

  it("navigates to artwork details on tap", () => {
    renderWithRelay({
      Artwork: () => ({
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
      }),
    })

    const touchable = screen.getByTestId("list-item-touchable")
    fireEvent.press(touchable)

    expect(navigate).toHaveBeenCalledWith("/my-collection/artwork/artwork-slug", {
      passProps: {
        medium: "artwork medium",
        artistInternalID: "artist-id",
        category: "artwork category",
      },
    })
  })

  it("tracks analytics event on tap", () => {
    renderWithRelay({
      Artwork: () => ({
        internalID: "artwork-id",
        slug: "artwork-slug",
        artist: {
          internalID: "artist-id",
        },
        images: null,
        medium: "artwork medium",
      }),
    })

    const touchable = screen.getByTestId("list-item-touchable")
    fireEvent.press(touchable)

    expect(mockTrackEvent).toHaveBeenCalledTimes(1)
    expect(mockTrackEvent).toHaveBeenCalledWith(
      tappedCollectedArtwork({
        destinationOwnerId: "artwork-id",
        destinationOwnerSlug: "artwork-slug",
      })
    )
  })

  it("renders the high demand icon if the artists is P1 and demand rank is over 9", () => {
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

    expect(screen.getByTestId("test-high-demand-icon")).toBeOnTheScreen()
  })

  describe("Images", () => {
    const localImage: LocalImageStore.LocalImage = {
      path: "some-local-path",
      width: 10,
      height: 10,
    }

    beforeEach(() => {
      ;(LocalImageStore.useLocalImage as jest.Mock).mockReturnValue(localImage)
    })

    it("displays local image if available", () => {
      renderWithRelay({})

      expect(screen.UNSAFE_getByType(OpaqueImageView)).toHaveProp("imageURL", "some-local-path")
    })
  })
})
