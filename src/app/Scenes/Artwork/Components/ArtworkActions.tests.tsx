import { fireEvent } from "@testing-library/react-native"
import { ArtworkActions_artwork$data } from "__generated__/ArtworkActions_artwork.graphql"
import { ArtworkActionsTestsQuery } from "__generated__/ArtworkActionsTestsQuery.graphql"
import { LegacyNativeModules } from "app/NativeModules/LegacyNativeModules"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { rejectMostRecentRelayOperation } from "app/tests/rejectMostRecentRelayOperation"
import { renderWithWrappers } from "app/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/tests/resolveMostRecentRelayOperation"
import { graphql, QueryRenderer } from "react-relay"
import { createMockEnvironment } from "relay-test-utils"
import { ArtworkActions, ArtworkActionsFragmentContainer, shareContent } from "./ArtworkActions"

jest.unmock("react-relay")
jest.unmock("app/NativeModules/LegacyNativeModules")

describe("ArtworkActions", () => {
  beforeEach(() => {
    __globalStoreTestUtils__?.setProductionMode()
    __globalStoreTestUtils__?.injectFeatureFlags({
      ARArtworkRedesingPhase2: false,
    })
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

  describe("with AR enabled", () => {
    it("renders buttons correctly", () => {
      const { queryByText } = renderWithWrappers(
        <ArtworkActions shareOnPress={jest.fn} artwork={artworkActionsArtwork} />
      )

      expect(queryByText("Save")).toBeTruthy()

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

      expect(queryByText("Save")).toBeTruthy()
      expect(queryByText("Share")).toBeTruthy()
      expect(queryByText("View in Room")).toBeFalsy()
    })
  })

  it("shows a bell icon and 'Watch lot' text instead of herart icon and 'Save' if work is in an open auction", () => {
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
    expect(queryByText("Watch lot")).toBeTruthy()
    expect(queryByLabelText("watch lot icon")).toBeTruthy()
    expect(queryByText("Share")).toBeTruthy()

    expect(queryByText("Save")).toBeFalsy()
    expect(queryByText("Saved")).toBeFalsy()
  })

  describe("when ARArtworkRedesingPhase2 is enabled", () => {
    beforeEach(() => {
      __globalStoreTestUtils__?.injectFeatureFlags({
        ARArtworkRedesingPhase2: true,
      })
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
  })

  describe("without AR enabled", () => {
    it("does not show the View in Room option if the phone does not have AREnabled", () => {
      LegacyNativeModules.ARCocoaConstantsModule.AREnabled = false
      const { queryByText } = renderWithWrappers(
        <ArtworkActions shareOnPress={jest.fn()} artwork={artworkActionsArtwork} />
      )

      expect(queryByText("Watch lot")).toBeFalsy()
      expect(queryByText("Save")).toBeTruthy()
      expect(queryByText("Share")).toBeTruthy()
    })
  })

  describe("Saving an artwork", () => {
    let env: ReturnType<typeof createMockEnvironment>

    beforeEach(() => {
      env = createMockEnvironment()
    })

    const TestRenderer = () => {
      return (
        <QueryRenderer<ArtworkActionsTestsQuery>
          environment={env}
          variables={{ id: "artworkID" }}
          render={({ props, error }) => {
            if (props) {
              return (
                <ArtworkActionsFragmentContainer
                  artwork={props.artwork!}
                  shareOnPress={jest.fn()}
                />
              )
            } else if (error) {
              console.log(error)
              return
            }
          }}
          query={graphql`
            query ArtworkActionsTestsQuery @raw_response_type {
              artwork(id: "artworkID") {
                ...ArtworkActions_artwork
              }
            }
          `}
        />
      )
    }

    it("correctly displays when the work is already saved, and allows unsaving", async () => {
      const artworkActionsArtworkSaved = {
        ...artworkActionsArtwork,
        is_saved: true,
      }

      const unsaveResponse = {
        ...artworkActionsArtwork,
        is_saved: false,
      }

      const { queryByText, getByText } = await renderWithWrappers(<TestRenderer />)

      resolveMostRecentRelayOperation(env, {
        Artwork: () => artworkActionsArtworkSaved,
      })

      expect(queryByText("Saved")).toBeTruthy()
      const saveButton = getByText("Saved")
      expect(saveButton).toHaveProp("color", "#1023D7")

      fireEvent.press(saveButton)

      const saveMutation = env.mock.getMostRecentOperation()
      expect(saveMutation.request.node.operation.name).toEqual("ArtworkActionsSaveMutation")

      resolveMostRecentRelayOperation(env, {
        Artwork: () => unsaveResponse,
      })

      expect(queryByText("Save")).toBeTruthy()
      expect(queryByText("Save")).toHaveProp("color", "#000000")
    })

    it("correctly displays when the work is not saved, and allows saving", async () => {
      const saveResponse = {
        ...artworkActionsArtwork,
        is_saved: true,
      }

      const { queryByText, getByText } = await renderWithWrappers(<TestRenderer />)
      resolveMostRecentRelayOperation(env, {
        Artwork: () => artworkActionsArtwork,
      })

      const saveButton = getByText("Save")
      expect(queryByText("Save")).toBeTruthy()
      expect(queryByText("Save")).toHaveProp("color", "#000000")

      fireEvent.press(saveButton)

      const saveMutation = env.mock.getMostRecentOperation()
      expect(saveMutation.request.node.operation.name).toEqual("ArtworkActionsSaveMutation")

      resolveMostRecentRelayOperation(env, {
        Artwork: () => saveResponse,
      })

      expect(queryByText("Saved")).toBeTruthy()
      expect(saveButton).toHaveProp("color", "#1023D7")
    })

    it("handles errors in saving gracefully", async () => {
      const { queryByText, getByText } = await renderWithWrappers(<TestRenderer />)
      resolveMostRecentRelayOperation(env, {
        Artwork: () => artworkActionsArtwork,
      })

      const saveButton = getByText("Save")
      expect(queryByText("Save")).toBeTruthy()
      expect(queryByText("Save")).toHaveProp("color", "#000000")

      fireEvent.press(saveButton)

      const saveMutation = env.mock.getMostRecentOperation()
      expect(saveMutation.request.node.operation.name).toEqual("ArtworkActionsSaveMutation")

      rejectMostRecentRelayOperation(env, new Error("Error saving artwork"))

      expect(queryByText("Save")).toBeTruthy()
      expect(queryByText("Save")).toHaveProp("color", "#000000")
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
