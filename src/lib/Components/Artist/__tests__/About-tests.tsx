import { Theme } from "@artsy/palette"
import React from "react"
import "react-native"
import * as renderer from "react-test-renderer"
import ArtistAbout from "../ArtistAbout"

it("renders properly", () => {
  const artist = {
    id: "banksy",
    has_metadata: true,
    is_display_auction_link: true,
    articles: [],
    related_artists: [],
  }
  const about = renderer
    .create(
      <Theme>
        <ArtistAbout artist={artist as any} />
      </Theme>
    )
    .toJSON()
  expect(about).toMatchSnapshot()
})
