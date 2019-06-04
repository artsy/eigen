import { Sans } from "@artsy/palette"
import { shallow } from "enzyme"
import { ArtworkFixture } from "lib/__fixtures__/ArtworkFixture"
import { ArtistListItem } from "lib/Components/ArtistListItem"
import React from "react"
import { AboutArtist } from "../AboutArtist"

describe("AboutArtist", () => {
  it("renders about artist correctly for one artist", () => {
    const component = shallow(<AboutArtist artwork={ArtworkFixture} />)
    expect(component.find(Sans).length).toEqual(1)

    expect(
      component
        .find(Sans)
        .at(0)
        .render()
        .text()
    ).toMatchInlineSnapshot(`"About the artist"`)
    expect(component.find(ArtistListItem).length).toEqual(1)
  })

  it("renders about artist correctly for more than one artists", () => {
    const artworkMultipleArtists = {
      ...ArtworkFixture,
      artists: ArtworkFixture.artists.concat(ArtworkFixture.artists),
    }
    const component = shallow(<AboutArtist artwork={artworkMultipleArtists} />)
    expect(component.find(Sans).length).toEqual(1)

    expect(
      component
        .find(Sans)
        .at(0)
        .render()
        .text()
    ).toMatchInlineSnapshot(`"About the artists"`)
    expect(component.find(ArtistListItem).length).toEqual(2)
  })
})
