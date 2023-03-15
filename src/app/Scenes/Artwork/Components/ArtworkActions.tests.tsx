import { fireEvent, screen } from "@testing-library/react-native"
import { ArtworkActionsTestQuery } from "__generated__/ArtworkActionsTestQuery.graphql"
import { ArtworkActions_artwork$data } from "__generated__/ArtworkActions_artwork.graphql"
import { LegacyNativeModules } from "app/NativeModules/LegacyNativeModules"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/utils/tests/resolveMostRecentRelayOperation"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"
import { ArtworkActions, ArtworkActionsFragmentContainer, shareContent } from "./ArtworkActions"

jest.unmock("app/NativeModules/LegacyNativeModules")

describe("ArtworkActions", () => {
  beforeEach(() => {
    __globalStoreTestUtils__?.setProductionMode()
  })

  describe("share button message", () => {
    it("displays only 3 artists when there are more than 3 artist", async () => {
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

    it("displays 1 artists", async () => {
      const content = shareContent("Title 1", "/artwork/title-1", [{ name: "Artist 1" }])
      expect(content).toMatchObject({
        title: "Title 1 by Artist 1 on Artsy",
        url: "https://www.artsy.net/artwork/title-1?utm_content=artwork-share",
        message: "Title 1 by Artist 1 on Artsy",
      })
    })

    it("displays only the title if there's no artists", async () => {
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
    const { queryByText } = renderWithWrappers(
      <ArtworkActions shareOnPress={jest.fn} artwork={artworkActionsArtwork} />
    )

    expect(queryByText("View in Room")).toBeTruthy()
    expect(queryByText("Share")).toBeTruthy()
  })

  it("does not show the View in Room option if the artwork is not hangable", () => {
    const artworkActionsArtworkNotHangable = {
      ...artworkActionsArtwork,
      isHangable: false,
    }
    const { queryByText } = renderWithWrappers(
      <ArtworkActions shareOnPress={jest.fn} artwork={artworkActionsArtworkNotHangable} />
    )

    expect(queryByText("Share")).toBeTruthy()
    expect(queryByText("View in Room")).toBeFalsy()
  })

  it("should display 'Save' button", () => {
    const { queryByText } = renderWithWrappers(
      <ArtworkActions shareOnPress={jest.fn()} artwork={artworkActionsArtwork} />
    )

    expect(queryByText("Save")).toBeTruthy()
    expect(queryByText("Saved")).toBeFalsy()
  })

  it("should display 'Save' button if work is in an open auction", () => {
    const artworkActionsArtworkInAuction = {
      ...artworkActionsArtwork,
      sale: {
        isAuction: true,
        isClosed: false,
      },
    }

    const { queryByText, queryByLabelText } = renderWithWrappers(
      <ArtworkActions shareOnPress={jest.fn()} artwork={artworkActionsArtworkInAuction} />
    )

    expect(queryByText("Save")).toBeTruthy()
    expect(queryByText("Saved")).toBeFalsy()
    expect(queryByText("Watch lot")).toBeFalsy()
    expect(queryByLabelText("watch lot icon")).toBeFalsy()
  })

  describe("without AR enabled", () => {
    it("does not show the View in Room option if the phone does not have AREnabled", () => {
      LegacyNativeModules.ARCocoaConstantsModule.AREnabled = false
      const { queryByText } = renderWithWrappers(
        <ArtworkActions shareOnPress={jest.fn()} artwork={artworkActionsArtwork} />
      )

      expect(queryByText("Share")).toBeTruthy()
    })
  })

  describe("Save button", () => {
    const { renderWithRelay } = setupTestWrapper<ArtworkActionsTestQuery>({
      Component: ({ artwork }) => (
        <ArtworkActionsFragmentContainer artwork={artwork!} shareOnPress={() => jest.fn()} />
      ),
      query: graphql`
        query ArtworkActionsTestQuery @relay_test_operation @raw_response_type {
          artwork(id: "some-artwork") {
            ...ArtworkActions_artwork
          }
        }
      `,
    })

    it("should trigger save mutation when user presses save button", async () => {
      const { env } = renderWithRelay({
        Artwork: () => ({
          isSaved: false,
        }),
      })

      expect(screen.getByLabelText("Save artwork")).toBeTruthy()

      fireEvent.press(screen.getByLabelText("Save artwork"))

      expect(env.mock.getMostRecentOperation().request.node.operation.name).toBe(
        "ArtworkActionsSaveMutation"
      )
    })

    it("should track save event when user saves and artwork successfully", async () => {
      const { env } = renderWithRelay({
        Artwork: () => ({
          isSaved: false,
        }),
      })

      fireEvent.press(screen.getByLabelText("Save artwork"))

      resolveMostRecentRelayOperation(env, {})

      expect(mockTrackEvent.mock.calls[0]).toMatchInlineSnapshot(`
        [
          {
            "action_name": "artworkSave",
            "action_type": "success",
            "context_module": "ArtworkActions",
          },
        ]
      `)
    })
  })
})

const artworkActionsArtwork: ArtworkActions_artwork$data = {
  id: "artwork12345",
  slug: "andreas-rod-prinzknecht",
  isSaved: false,
  internalID: "artwork12345",
  image: {
    url: "image.com/image",
  },
  isHangable: true,
  heightCm: 10,
  widthCm: 10,
  " $fragmentType": "ArtworkActions_artwork",
}
