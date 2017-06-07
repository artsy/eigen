import "react-native"

import * as React from "react"
import * as renderer from "react-test-renderer"

import Artworks from "../artworks"

it("renders properly", () => {
  const props = {
    gene: {
      id: "deep-time",
    },
    medium: "painting",
    queryState: null,
    queryForPage: null,
  }
  const artworks = renderer.create(<Artworks gene={props} />).toJSON()
  expect(artworks).toMatchSnapshot()
})
