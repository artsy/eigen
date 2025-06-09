import { fireEvent, screen } from "@testing-library/react-native"
import { ArtworkActionsTestQuery } from "__generated__/ArtworkActionsTestQuery.graphql"
import { ArtworkListsProvider } from "app/Components/ArtworkLists/ArtworkListsStore"
import { LegacyNativeModules } from "app/NativeModules/LegacyNativeModules"
import {
  ArtworkActionsFragmentContainer,
  shareContent,
} from "app/Scenes/Artwork/Components/ArtworkActions"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

jest.unmock("app/NativeModules/LegacyNativeModules")

describe("ArtworkActions", () => {
  const { renderWithRelay } = setupTestWrapper<ArtworkActionsTestQuery>({
    Component: ({ artwork }) => (
      <ArtworkListsProvider>
        <ArtworkActionsFragmentContainer artwork={artwork!} shareOnPress={() => jest.fn()} />
      </ArtworkListsProvider>
    ),
    query: graphql`
      query ArtworkActionsTestQuery @relay_test_operation @raw_response_type {
        artwork(id: "some-artwork") {
          ...ArtworkActions_artwork
        }
      }
    `,
  })

  beforeEach(() => {
    __globalStoreTestUtils__?.setProductionMode()
  })

  describe("share button message", () => {
    it("displays only 3 artists when there are more than 3 artist", () => {
      const content = shareContent("Title 1", "/artwork/title-1", [
        { name: "Artist 1" },
        { name: "Artist 2" },
        { name: "Artist 3" },
        { name: "Artist 4" },
      ])
      expect(content).toMatchObject({
        title: "Title 1 by Artist 1, Artist 2, Artist 3 on Artsy",
        url: "https://www.artsy.net/artwork/title-1?utm_content=artwork-share",
        message: "Title 1 by Artist 1, Artist 2, Artist 3 on Artsy",
      })
    })

    it("displays 1 artists", () => {
      const content = shareContent("Title 1", "/artwork/title-1", [{ name: "Artist 1" }])
      expect(content).toMatchObject({
        title: "Title 1 by Artist 1 on Artsy",
        url: "https://www.artsy.net/artwork/title-1?utm_content=artwork-share",
        message: "Title 1 by Artist 1 on Artsy",
      })
    })

    it("displays only the title if there's no artists", () => {
      const content = shareContent("Title 1", "/artwork/title-1", null)
      expect(content).toMatchObject({
        title: "Title 1 on Artsy",
        url: "https://www.artsy.net/artwork/title-1?utm_content=artwork-share",
        message: "Title 1 on Artsy",
      })
    })

    it("displays only the URL if no artists or title", async () => {
      const content = shareContent(null as any, "/artwork/title-1", null)
      expect(content).toMatchObject({
        url: "https://www.artsy.net/artwork/title-1?utm_content=artwork-share",
      })
      expect(content.message).toBeNull()
      expect(content.title).toBeNull()
    })
  })

  it("renders buttons correctly", () => {
    renderWithRelay({
      Artwork: () => artworkActionsArtwork,
    })

    expect(screen.getByText("View in Room")).toBeOnTheScreen()
    expect(screen.getByText("Share")).toBeOnTheScreen()
  })

  it("does not show the View in Room option if the artwork is not hangable", () => {
    const artworkActionsArtworkNotHangable = {
      ...artworkActionsArtwork,
      isHangable: false,
    }
    renderWithRelay({
      Artwork: () => artworkActionsArtworkNotHangable,
    })

    expect(screen.getByText("Share")).toBeOnTheScreen()
    expect(screen.queryByText("View in Room")).not.toBeOnTheScreen()
  })

  it("should display 'Save' button", () => {
    renderWithRelay({
      Artwork: () => artworkActionsArtwork,
    })

    expect(screen.getByText("Save")).toBeOnTheScreen()
    expect(screen.queryByText("Saved")).not.toBeOnTheScreen()
  })

  it("should display 'Watch lot' button if work is in an open auction", () => {
    const artworkActionsArtworkInAuction = {
      ...artworkActionsArtwork,
      sale: { isAuction: true, isClosed: false },
    }

    renderWithRelay({
      Artwork: () => artworkActionsArtworkInAuction,
    })

    expect(screen.queryByText("Save")).not.toBeOnTheScreen()
    expect(screen.queryByText("Saved")).not.toBeOnTheScreen()
    expect(screen.getByText("Watch lot")).toBeOnTheScreen()
    expect(screen.getByLabelText("watch lot icon")).toBeOnTheScreen()
  })

  describe("without AR enabled", () => {
    it("does not show the View in Room option if the phone does not have AREnabled", () => {
      LegacyNativeModules.ARCocoaConstantsModule.AREnabled = false

      renderWithRelay({
        Artwork: () => artworkActionsArtwork,
      })

      expect(screen.getByText("Share")).toBeOnTheScreen()
    })
  })

  describe("Save button", () => {
    it("should trigger save mutation when user presses save button", () => {
      const { env } = renderWithRelay({
        Artwork: () => ({
          ...artworkActionsArtwork,
          isSaved: false,
        }),
      })

      expect(screen.getByLabelText("Save artwork")).toBeOnTheScreen()

      fireEvent.press(screen.getByLabelText("Save artwork"))

      expect(env.mock.getMostRecentOperation().request.node.operation.name).toBe(
        "useSaveArtworkMutation"
      )
    })
  })
})

const artworkActionsArtwork = {
  id: "artwork12345",
  slug: "andreas-rod-prinzknecht",
  image: {
    url: "image.com/image",
  },
  isHangable: true,
  heightCm: 10,
  widthCm: 10,
  customArtworkLists: {
    totalCount: 0,
  },
}
