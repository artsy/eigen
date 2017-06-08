import "react-native"

import * as React from "react"
import * as renderer from "react-test-renderer"

import About from "../about"

it("renders properly", () => {
  const artist = {
    has_metadata: true,
    is_display_auction_link: true,
    articles: [],
    related_artists: [],
  }
  const about = renderer.create(<About artist={artist} />).toJSON()
  expect(about).toMatchSnapshot()
})
