import "react-native"

import React from "react"
import { renderWithLayout } from "../../../tests/renderWithLayout"

import { ArtistForSaleArtworksGridContainer as ArtistForSaleArtworksGrid } from "../RelayConnections/ArtistForSaleArtworksGrid"
import artwork from "./__fixtures__/artwork"

// FIXME: This needs a Relay based test
xit("renders properly", () => {
  const artist = {
    artworks: {
      edges: [artwork(), artwork(), artwork()],
    },
  }

  const grid = renderWithLayout(<ArtistForSaleArtworksGrid artist={artist as any} />, { width: 768 })
  expect(grid).toMatchSnapshot()
})
