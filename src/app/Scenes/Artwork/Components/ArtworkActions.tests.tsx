import { ArtworkActions_artwork$data } from "__generated__/ArtworkActions_artwork.graphql"
import { LegacyNativeModules } from "app/NativeModules/LegacyNativeModules"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { ArtworkActions, shareContent } from "./ArtworkActions"

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
      is_hangable: false,
    }
    const { queryByText } = renderWithWrappers(
      <ArtworkActions shareOnPress={jest.fn} artwork={artworkActionsArtworkNotHangable} />
    )

    expect(queryByText("Share")).toBeTruthy()
    expect(queryByText("View in Room")).toBeFalsy()
  })

  it("should NOT display 'Save' button if work is in an open auction ", () => {
    const { queryByText } = renderWithWrappers(
      <ArtworkActions shareOnPress={jest.fn()} artwork={artworkActionsArtwork} />
    )

    expect(queryByText("Save")).toBeFalsy()
    expect(queryByText("Saved")).toBeFalsy()
  })

  it("should NOT display 'Watch lot' button if work is in an open auction ", () => {
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
})

const artworkActionsArtwork: ArtworkActions_artwork$data = {
  id: "artwork12345",
  internalID: "12345",
  title: "test title",
  slug: "andreas-rod-prinzknecht",
  href: "/artwork/andreas-rod-prinzknecht",
  artists: [
    {
      name: "Andreas Rod",
    },
    {
      name: "Arthur Sopin",
    },
  ],
  image: {
    url: "image.com/image",
  },
  sale: {
    isAuction: false,
    isClosed: false,
  },
  is_saved: false,
  is_hangable: true,
  heightCm: 10,
  widthCm: 10,
  " $fragmentType": "ArtworkActions_artwork",
}
