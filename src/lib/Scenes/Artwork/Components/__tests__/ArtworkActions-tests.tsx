import { Sans } from "@artsy/palette"
import { shallow } from "enzyme"
import React from "react"
import { ArtworkActions } from "../ArtworkActions"

describe("ArtworkActions", () => {
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

const artworkActionsArtwork = {
  __id: "artwork12345",
  _id: "12345",
  is_saved: false,
  " $refType": null,
}
