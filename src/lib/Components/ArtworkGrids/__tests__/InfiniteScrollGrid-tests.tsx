import "react-native"

import React from "react"
import { renderWithLayout } from "../../../tests/renderWithLayout"

import { InfiniteScrollArtworksGridContainer as InfiniteScrollArtworksGrid } from "../InfiniteScrollArtworksGrid"
import artwork from "./__fixtures__/artwork"

// FIXME: This needs a Relay based test
xit("renders properly", () => {
  const artist = {
    artworks: {
      edges: [artwork(), artwork(), artwork()],
    },
  }

  const grid = renderWithLayout(
    <InfiniteScrollArtworksGrid connection={artist as any} loadMore={() => null} componentRef={{} as any} />,
    { width: 768 }
  )
  expect(grid).toMatchSnapshot()
})
