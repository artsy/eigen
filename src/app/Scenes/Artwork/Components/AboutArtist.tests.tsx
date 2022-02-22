import { ArtworkFixture } from "app/__fixtures__/ArtworkFixture"
import { ArtistListItem } from "app/Components/ArtistListItem"
// @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
import { mount } from "enzyme"
import { Text, Theme } from "palette"
import React from "react"
import { AboutArtist } from "./AboutArtist"

describe("AboutArtist", () => {
  it("renders about artist correctly for one artist", () => {
    const component = mount(
      <Theme>
        {/* @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏 */}
        <AboutArtist artwork={ArtworkFixture} />
      </Theme>
    )

    expect(component.find(Text).at(0).render().text()).toMatchInlineSnapshot(`"About the artist"`)
    expect(component.find(ArtistListItem).length).toEqual(1)
  })

  it("renders about artist correctly for more than one artists", () => {
    const artworkMultipleArtists = {
      ...ArtworkFixture,
      artists: ArtworkFixture.artists.concat(ArtworkFixture.artists),
    }
    const component = mount(
      <Theme>
        {/* @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏 */}
        <AboutArtist artwork={artworkMultipleArtists} />
      </Theme>
    )

    expect(component.find(Text).at(0).render().text()).toMatchInlineSnapshot(`"About the artists"`)
    expect(component.find(ArtistListItem).length).toEqual(2)
  })
})
