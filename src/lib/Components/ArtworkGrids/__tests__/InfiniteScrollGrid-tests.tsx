import "react-native"

import * as React from "react"
import { renderWithLayout } from "../../../tests/renderWithLayout"

import InfiniteScrollArtworksGrid from "../RelayConnections/ArtistForSaleArtworksGrid"
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
