import "react-native"

import React from "react"
import * as renderer from "react-test-renderer"

import About from "../About"

import { Theme } from "@artsy/palette"

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
        <About artist={artist as any} />
      </Theme>
    )
    .toJSON()
  expect(about).toMatchSnapshot()
})
