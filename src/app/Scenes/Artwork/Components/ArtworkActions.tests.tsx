import { ArtworkActions_artwork$data } from "__generated__/ArtworkActions_artwork.graphql"
import { ArtworkActionsTestsQuery$data } from "__generated__/ArtworkActionsTestsQuery.graphql"
import { LegacyNativeModules } from "app/NativeModules/LegacyNativeModules"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { flushPromiseQueue } from "app/tests/flushPromiseQueue"
import { renderRelayTree } from "app/tests/renderRelayTree"
import { renderWithWrappersTL } from "app/tests/renderWithWrappers"
import { Text } from "palette"
import React from "react"
import { TouchableWithoutFeedback } from "react-native"
import { graphql } from "react-relay"
import { ArtworkActions, ArtworkActionsFragmentContainer, shareContent } from "./ArtworkActions"

jest.unmock("react-relay")
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
      const content = shareContent(null as any /* STRICTNESS_MIGRATION */, "/artwork/title-1", null)
      expect(content).toMatchObject({
        url: "https://www.artsy.net/artwork/title-1?utm_content=artwork-share",
      })
      expect(content.message).not.toBeDefined()
      expect(content.title).not.toBeDefined()
    })
  })

  describe("with AR enabled", () => {
    it("renders buttons correctly", () => {
      const { queryByText, getByText } = renderWithWrappersTL(
        <ArtworkActions shareOnPress={jest.fn} artwork={artworkActionsArtwork} />
      )

      expect(queryByText("Save")).toBeTruthy()
      expect(queryByText("Saved")).toBeTruthy()
      expect(getByText("Saved")).toHaveProp("color", "transparent")
      expect(queryByText("View in Room")).toBeTruthy()
      expect(queryByText("Share")).toBeTruthy()
    })

    it("does not show the View in Room option if the artwork is not hangable", () => {
      const artworkActionsArtworkNotHangable = {
        ...artworkActionsArtwork,
        is_hangable: false,
      }
      const { getByText, queryByText } = renderWithWrappersTL(
        <ArtworkActions shareOnPress={jest.fn} artwork={artworkActionsArtworkNotHangable} />
      )

      expect(queryByText("Save")).toBeTruthy()
      expect(queryByText("Share")).toBeTruthy()
      expect(getByText("Saved")).toHaveProp("color", "transparent")
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
    const { queryByText, queryByLabelText } = renderWithWrappersTL(
      <ArtworkActions shareOnPress={jest.fn()} artwork={artworkActionsArtworkInAuction} />
    )
    expect(queryByText("Watch lot")).toBeTruthy()
    expect(queryByLabelText("watch lot icon")).toBeTruthy()
    expect(queryByText("Share")).toBeTruthy()

    expect(queryByText("Save")).toBeFalsy()
    expect(queryByText("Saved")).toBeFalsy()
  })

  describe("without AR enabled", () => {
    it("does not show the View in Room option if the phone does not have AREnabled", () => {
      LegacyNativeModules.ARCocoaConstantsModule.AREnabled = false
      const { queryByText } = renderWithWrappersTL(
        <ArtworkActions shareOnPress={jest.fn()} artwork={artworkActionsArtwork} />
      )

      expect(queryByText("Watch lot")).toBeFalsy()
      expect(queryByText("Save")).toBeTruthy()
      expect(queryByText("Share")).toBeTruthy()
    })
  })

  describe("Saving an artwork", () => {
    // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
    const getWrapper = async ({ mockArtworkData, mockSaveResults }) => {
      return await renderRelayTree({
        Component: ArtworkActionsFragmentContainer,
        query: graphql`
          query ArtworkActionsTestsQuery @raw_response_type {
            artwork(id: "artworkID") {
              ...ArtworkActions_artwork
            }
          }
        `,
        mockData: { artwork: mockArtworkData } as ArtworkActionsTestsQuery$data,
        mockMutationResults: { saveArtwork: mockSaveResults },
      })
    }

    it("correctly displays when the work is already saved, and allows unsaving", async () => {
      const artworkActionsArtworkSaved = {
        ...artworkActionsArtwork,
        is_saved: true,
      }

      const unsaveResponse = {
        artwork: {
          id: artworkActionsArtwork.id,
          is_saved: false,
        },
      }

      const artworkActions = await getWrapper({
        mockArtworkData: artworkActionsArtworkSaved,
        mockSaveResults: unsaveResponse,
      })

      const saveButton = artworkActions.find(Text).at(1)
      expect(saveButton.text()).toMatchInlineSnapshot(`"Saved"`)
      expect(saveButton.props().color).toMatchInlineSnapshot(`"#1023D7"`)

      await artworkActions.find(TouchableWithoutFeedback).at(0).props().onPress()

      await flushPromiseQueue()
      artworkActions.update()

      const updatedSaveButton = artworkActions.find(Text).at(1)
      expect(updatedSaveButton.text()).toMatchInlineSnapshot(`"Saved"`)
      expect(updatedSaveButton.props().color).toMatchInlineSnapshot(`"#1023D7"`)
    })

    it("correctly displays when the work is not saved, and allows saving", async () => {
      const saveResponse = { artwork: { id: artworkActionsArtwork.id, is_saved: true } }

      const artworkActions = await getWrapper({
        mockArtworkData: artworkActionsArtwork,
        mockSaveResults: saveResponse,
      })

      const saveButton = artworkActions.find(Text).at(1)
      expect(saveButton.text()).toMatchInlineSnapshot(`"Save"`)
      expect(saveButton.props().color).toMatchInlineSnapshot(`"#000000"`)

      await artworkActions.find(TouchableWithoutFeedback).at(0).props().onPress()

      await flushPromiseQueue()
      artworkActions.update()

      const updatedSaveButton = artworkActions.find(Text).at(1)
      expect(updatedSaveButton.text()).toMatchInlineSnapshot(`"Save"`)
      expect(updatedSaveButton.props().color).toMatchInlineSnapshot(`"#000000"`)
    })

    // TODO: Update once we can use relay's new facilities for testing
    it("handles errors in saving gracefully", async () => {
      const artworkActions = await renderRelayTree({
        Component: ArtworkActionsFragmentContainer,
        query: graphql`
          query ArtworkActionsTestsErrorQuery @raw_response_type {
            artwork(id: "artworkID") {
              ...ArtworkActions_artwork
            }
          }
        `,
        mockData: { artwork: artworkActionsArtwork }, // Enable/fix this when making large change to these components/fixtures: as ArtworkActionsTestsErrorQuery,
        mockMutationResults: {
          saveArtwork: () => {
            return Promise.reject(new Error("failed to fetch"))
          },
        },
      })

      const saveButton = artworkActions.find(Text).at(1)
      expect(saveButton.text()).toMatchInlineSnapshot(`"Save"`)
      expect(saveButton.props().color).toMatchInlineSnapshot(`"#000000"`)

      await artworkActions.find(TouchableWithoutFeedback).at(0).props().onPress()

      await flushPromiseQueue()
      artworkActions.update()

      const updatedSaveButton = artworkActions.find(Text).at(1)
      expect(updatedSaveButton.text()).toMatchInlineSnapshot(`"Save"`)
      expect(updatedSaveButton.props().color).toMatchInlineSnapshot(`"#000000"`)
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
