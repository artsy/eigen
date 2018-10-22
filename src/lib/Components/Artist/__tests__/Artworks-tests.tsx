import "react-native"

import React from "react"
import * as renderer from "react-test-renderer"

import Artworks from "../Artworks"

it("renders properly", () => {
  const artist = {
    counts: {
      artworks: 5,
      for_sale_artworks: 2,
    },
  }
  const artworks = renderer.create(<Artworks artist={artist as any} />).toJSON()
  expect(artworks).toMatchSnapshot()
})
