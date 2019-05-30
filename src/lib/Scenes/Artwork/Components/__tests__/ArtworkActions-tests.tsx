import { Sans } from "@artsy/palette"
import { shallow } from "enzyme"
import React from "react"
import { NativeModules } from "react-native"
import { ArtworkActions } from "../ArtworkActions"

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
})

const artworkActionsArtwork = {
  __id: "artwork12345",
  _id: "12345",
  is_saved: false,
  " $refType": null,
}
