import "react-native"

import * as React from "react"
import { renderWithLayout } from "../../../tests/render_with_layout"

import InfiniteScrollArtworksGrid from "../relay_connections/artist_artworks_grid"
import artwork from "./__fixtures__/artwork"

it("renders properly", () => {
  const artist = {
    artworks: {
      edges: [artwork(), artwork(), artwork()],
    },
  }

  const grid = renderWithLayout(<InfiniteScrollArtworksGrid artist={artist} queryKey="artist" />, { width: 768 })
  expect(grid).toMatchSnapshot()
})
