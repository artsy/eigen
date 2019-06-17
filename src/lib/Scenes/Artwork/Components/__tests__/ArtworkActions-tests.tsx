import { Sans } from "@artsy/palette"
import { shallow } from "enzyme"
import { flushPromiseQueue } from "lib/tests/flushPromiseQueue"
import { renderRelayTree } from "lib/tests/renderRelayTree"
import React from "react"
import { NativeModules, TouchableWithoutFeedback } from "react-native"
import { graphql } from "react-relay"
import { ArtworkActions, ArtworkActionsFragmentContainer } from "../ArtworkActions"

jest.unmock("react-relay")

describe("ArtworkActions", () => {
  describe("with AR enabled", () => {
    it("renders buttons correctly", () => {
      const component = shallow(<ArtworkActions artwork={artworkActionsArtwork} />)
      expect(component.find(Sans).length).toEqual(3)

      expect(
        component
          .find(Sans)
          .at(0)
          .render()
          .text()
      ).toMatchInlineSnapshot(`"Save"`)

      expect(
        component
          .find(Sans)
          .at(1)
          .render()
          .text()
      ).toMatchInlineSnapshot(`"View in Room"`)

      expect(
        component
          .find(Sans)
          .at(2)
          .render()
          .text()
      ).toMatchInlineSnapshot(`"Share"`)
    })
  })

  describe("without AR enabled", () => {
    beforeAll(() => {
      NativeModules.ARCocoaConstantsModule.AREnabled = false
    })

    it("does not show the View in Room option if the phone does not have AREnabled", () => {
      const component = shallow(<ArtworkActions artwork={artworkActionsArtwork} />)
      expect(component.find(Sans).length).toEqual(2)

      expect(
        component
          .find(Sans)
          .at(0)
          .render()
          .text()
      ).toMatchInlineSnapshot(`"Save"`)

      expect(
        component
          .find(Sans)
          .at(1)
          .render()
          .text()
      ).toMatchInlineSnapshot(`"Share"`)
    })
  })

  describe("Saving an artwork", () => {
    const getWrapper = async ({ mockArtworkData, mockSaveResults }) => {
      return await renderRelayTree({
        Component: ArtworkActionsFragmentContainer,
        query: graphql`
          query ArtworkActionsTestsQuery {
            artwork(id: "artworkID") {
              ...ArtworkActions_artwork
            }
          }
        `,
        mockData: { artwork: mockArtworkData },
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
      expect(saveButton.props().color).toMatchInlineSnapshot(`"#6E1EFF"`)

      await artworkActions
        .find(TouchableWithoutFeedback)
        .at(0)
        .props()
        .onPress()

      await flushPromiseQueue()
      artworkActions.update()

      const updatedSaveButton = artworkActions.find(Sans).at(0)
      expect(updatedSaveButton.text()).toMatchInlineSnapshot(`"Save"`)
      expect(updatedSaveButton.props().color).toMatchInlineSnapshot(`"#000"`)
    })

    it("correctly displays when the work is not saved, and allows saving", async () => {
      const saveResponse = { artwork: { id: artworkActionsArtwork.id, is_saved: true } }

      const artworkActions = await getWrapper({
        mockArtworkData: artworkActionsArtwork,
        mockSaveResults: saveResponse,
      })

      const saveButton = artworkActions.find(Sans).at(0)
      expect(saveButton.text()).toMatchInlineSnapshot(`"Save"`)
      expect(saveButton.props().color).toMatchInlineSnapshot(`"#000"`)

      await artworkActions
        .find(TouchableWithoutFeedback)
        .at(0)
        .props()
        .onPress()

      await flushPromiseQueue()
      artworkActions.update()

      const updatedSaveButton = artworkActions.find(Sans).at(0)
      expect(updatedSaveButton.text()).toMatchInlineSnapshot(`"Saved"`)
      expect(updatedSaveButton.props().color).toMatchInlineSnapshot(`"#6E1EFF"`)
    })

    // TODO Update once we can use relay's new facilities for testing
    xit("handles errors in saving gracefully", async () => {
      const artworkActions = await renderRelayTree({
        Component: ArtworkActionsFragmentContainer,
        query: graphql`
          query ArtworkActionsTestsErrorQuery {
            artwork(id: "artworkID") {
              ...ArtworkActions_artwork
            }
          }
        `,
        mockData: { artwork: artworkActionsArtwork },
        mockMutationResults: {
          saveArtwork: () => {
            return Promise.reject(new Error("failed to fetch"))
          },
        },
      })

      const saveButton = artworkActions.find(Sans).at(0)
      expect(saveButton.text()).toMatchInlineSnapshot(`"Save"`)
      expect(saveButton.props().color).toMatchInlineSnapshot(`"#000"`)

      await artworkActions
        .find(TouchableWithoutFeedback)
        .at(0)
        .props()
        .onPress()

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
  artists: [
    {
      name: "Andreas Rod",
    },
    {
      name: "Arthur Sopin",
    },
  ],
  is_saved: false,
  " $refType": null,
}
