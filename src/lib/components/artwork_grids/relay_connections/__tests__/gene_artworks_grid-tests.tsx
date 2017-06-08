import "react-native"

import * as React from "react"
import { renderWithLayout } from "../../../../tests/render_with_layout"

import artwork from "../../__tests__/__fixtures__/artwork"
import GeneArtworks from "../gene_artworks_grid"

it("renders properly", () => {
  const gene = {
    artworks: {
      edges: [artwork(), artwork(), artwork()],
    },
  }

  const grid = renderWithLayout(<GeneArtworks gene={gene} queryKey="gene" />, { width: 768 })
  expect(grid).toMatchSnapshot()
})
