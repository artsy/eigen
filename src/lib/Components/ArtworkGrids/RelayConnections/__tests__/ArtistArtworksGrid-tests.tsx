import "react-native"

import React from "react"
import { renderWithLayout } from "../../../../tests/renderWithLayout"

import artwork from "../../__tests__/__fixtures__/artwork"
import { ArtistForSaleArtworksGridContainer } from "../ArtistForSaleArtworksGrid"

// FIXME: This needs a Relay based test
xit("renders properly", () => {
  const artist = {
    artworks: {
      edges: [artwork(), artwork(), artwork()],
    },
  }

  const grid = renderWithLayout(<ArtistForSaleArtworksGridContainer artist={artist as any} />, { width: 768 })
  expect(grid).toMatchSnapshot()
})
