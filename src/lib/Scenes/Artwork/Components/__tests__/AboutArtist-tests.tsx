import { Sans } from "@artsy/palette"
import { shallow } from "enzyme"
import { ArtworkFixture } from "lib/__fixtures__/ArtworkFixture"
import React from "react"
import { AboutArtist } from "../AboutArtist"

describe("AboutArtist", () => {
  it("renders artwork availability correctly", () => {
    const component = shallow(<AboutArtist artwork={ArtworkFixture} />)
    expect(component.find(Sans).length).toEqual(1)

    expect(
      component
        .find(Sans)
        .at(0)
        .render()
        .text()
    ).toMatchInlineSnapshot(`"About the artist"`)
  })
})
