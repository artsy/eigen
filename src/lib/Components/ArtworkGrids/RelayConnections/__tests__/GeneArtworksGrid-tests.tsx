import "react-native"

import React from "react"
import { renderWithLayout } from "../../../../tests/renderWithLayout"

import artwork from "../../__tests__/__fixtures__/artwork"
import GeneArtworks from "../GeneArtworksGrid"

it("renders properly", () => {
  const gene = {
    artworks: {
      edges: [artwork(), artwork(), artwork()],
    },
  }

  const grid = renderWithLayout(<GeneArtworks gene={gene} mapPropsToArtworksConnection={props => props.gene} />, {
    width: 768,
  })
  expect(grid).toMatchSnapshot()
})
