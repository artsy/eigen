import { ArtworkActionsTestsQueryRawResponse } from "__generated__/ArtworkActionsTestsQuery.graphql"
import { LegacyNativeModules } from "app/NativeModules/LegacyNativeModules"
import { __globalStoreTestUtils__, GlobalStoreProvider } from "app/store/GlobalStore"
import { flushPromiseQueue } from "app/tests/flushPromiseQueue"
import { renderRelayTree } from "app/tests/renderRelayTree"
// @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
import { mount } from "enzyme"
import { BellIcon, Sans, Theme } from "palette"
import React from "react"
import { TouchableWithoutFeedback } from "react-native"
import { graphql } from "react-relay"
import { ArtworkActions, ArtworkActionsFragmentContainer, shareContent } from "./ArtworkActions"

jest.unmock("react-relay")

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
      const component = mount(
        <GlobalStoreProvider>
          <Theme>
            {/* @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏 */}
            <ArtworkActions artwork={artworkActionsArtwork} />
          </Theme>
        </GlobalStoreProvider>
      )
      expect(component.find(Sans).length).toEqual(3)

      expect(component.find(Sans).at(0).render().text()).toMatchInlineSnapshot(`"Save"`)

      expect(component.find(Sans).at(1).render().text()).toMatchInlineSnapshot(`"View in Room"`)

      expect(component.find(Sans).at(2).render().text()).toMatchInlineSnapshot(`"Share"`)
    })

    it("does not show the View in Room option if the artwork is not hangable", () => {
      const artworkActionsArtworkNotHangable = {
        ...artworkActionsArtwork,
        is_hangable: false,
      }
      const component = mount(
        <GlobalStoreProvider>
          <Theme>
            {/* @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏 */}
            <ArtworkActions artwork={artworkActionsArtworkNotHangable} />
          </Theme>
        </GlobalStoreProvider>
      )
      expect(component.find(Sans).length).toEqual(2)

      expect(component.find(Sans).at(0).render().text()).toMatchInlineSnapshot(`"Save"`)

      expect(component.find(Sans).at(1).render().text()).toMatchInlineSnapshot(`"Share"`)
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
    const component = mount(
      <GlobalStoreProvider>
        <Theme>
          {/* @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏 */}
          <ArtworkActions artwork={artworkActionsArtworkInAuction} />
        </Theme>
      </GlobalStoreProvider>
    )
    expect(component.find(Sans).length).toEqual(3)

    expect(component.find(Sans).at(0).render().text()).toMatchInlineSnapshot(`"Watch lot"`)

    expect(component.find(BellIcon).length).toEqual(1)
  })

  describe("without AR enabled", () => {
    it("does not show the View in Room option if the phone does not have AREnabled", () => {
      LegacyNativeModules.ARCocoaConstantsModule.AREnabled = false
      const component = mount(
        <GlobalStoreProvider>
          <Theme>
            {/* @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏 */}
            <ArtworkActions artwork={artworkActionsArtwork} />
          </Theme>
        </GlobalStoreProvider>
      )
      expect(component.find(Sans).length).toEqual(2)

      expect(component.find(Sans).at(0).render().text()).toMatchInlineSnapshot(`"Save"`)

      expect(component.find(Sans).at(1).render().text()).toMatchInlineSnapshot(`"Share"`)
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
        mockData: { artwork: mockArtworkData } as ArtworkActionsTestsQueryRawResponse,
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

      const saveButton = artworkActions.find(Sans).at(0)
      expect(saveButton.text()).toMatchInlineSnapshot(`"Saved"`)
      expect(saveButton.props().color).toMatchInlineSnapshot(`"#1023D7"`)

      await artworkActions.find(TouchableWithoutFeedback).at(0).props().onPress()

      await flushPromiseQueue()
      artworkActions.update()

      const updatedSaveButton = artworkActions.find(Sans).at(0)
      expect(updatedSaveButton.text()).toMatchInlineSnapshot(`"Saved"`)
      expect(updatedSaveButton.props().color).toMatchInlineSnapshot(`"#1023D7"`)
    })

    it("correctly displays when the work is not saved, and allows saving", async () => {
      const saveResponse = { artwork: { id: artworkActionsArtwork.id, is_saved: true } }

      const artworkActions = await getWrapper({
        mockArtworkData: artworkActionsArtwork,
        mockSaveResults: saveResponse,
      })

      const saveButton = artworkActions.find(Sans).at(0)
      expect(saveButton.text()).toMatchInlineSnapshot(`"Save"`)
      expect(saveButton.props().color).toMatchInlineSnapshot(`"#000000"`)

      await artworkActions.find(TouchableWithoutFeedback).at(0).props().onPress()

      await flushPromiseQueue()
      artworkActions.update()

      const updatedSaveButton = artworkActions.find(Sans).at(0)
      expect(updatedSaveButton.text()).toMatchInlineSnapshot(`"Save"`)
      expect(updatedSaveButton.props().color).toMatchInlineSnapshot(`"#000000"`)
    })

    // TODO: Update once we can use relay's new facilities for testing
    xit("handles errors in saving gracefully", async () => {
      const artworkActions = await renderRelayTree({
        Component: ArtworkActionsFragmentContainer,
        query: graphql`
          query ArtworkActionsTestsErrorQuery @raw_response_type {
            artwork(id: "artworkID") {
              ...ArtworkActions_artwork
            }
          }
        `,
        mockData: { artwork: artworkActionsArtwork }, // Enable/fix this when making large change to these components/fixtures: as ArtworkActionsTestsErrorQueryRawResponse,
        mockMutationResults: {
          saveArtwork: () => {
            return Promise.reject(new Error("failed to fetch"))
          },
        },
      })

      const saveButton = artworkActions.find(Sans).at(0)
      expect(saveButton.text()).toMatchInlineSnapshot(`"Save"`)
      expect(saveButton.props().color).toMatchInlineSnapshot(`"#000"`)

      await artworkActions.find(TouchableWithoutFeedback).at(0).props().onPress()

      await flushPromiseQueue()
      artworkActions.update()

      const updatedSaveButton = artworkActions.find(Sans).at(0)
      expect(updatedSaveButton.text()).toMatchInlineSnapshot(`"Save"`)
      expect(updatedSaveButton.props().color).toMatchInlineSnapshot(`"#000"`)
    })
  })
})

const artworkActionsArtwork = {
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
  " $refType": null,
}
