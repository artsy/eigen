import "react-native"

import * as React from "react"
import { renderWithLayout } from "../../../../tests/render_with_layout"

import artwork from "../../__tests__/__fixtures__/artwork"
import InfiniteScrollArtworksGrid from "../artist_artworks_grid"

it("renders properly", () => {
  const artist = {
    artworks: {
      edges: [artwork(), artwork(), artwork()],
    },
  }

  const grid = renderWithLayout(<InfiniteScrollArtworksGrid artist={artist} queryKey="artist" />, { width: 768 })
  expect(grid).toMatchSnapshot()
})
