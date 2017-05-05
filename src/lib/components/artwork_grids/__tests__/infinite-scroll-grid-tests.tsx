import "react-native"

import * as React from "react"
import { renderWithLayout } from "../../../tests/render_with_layout"

import InfiniteScrollArtworksGrid from "../relay_connections/artist_artworks_grid"

it("renders properly", () => {
  const artist = {
    artworks: {
      edges: [ artwork(), artwork(), artwork() ],
    },
  }

  const grid = renderWithLayout(<InfiniteScrollArtworksGrid artist={artist} queryKey="artist" />, { width: 768})
  expect(grid).toMatchSnapshot()
})

let artwork = () => {
  return {
    node: {
      __id: "artwork-talking-politics",
      title: "TALKING POLITICS",
      date: "2008",
      sale_message: "Not for sale",
      is_in_auction: false,
      image: {
        url: "artsy.net/image-url",
        aspect_ratio: 1.27,
      },
      artists: [
        {
          name: "Jenny Holzer",
        },
      ],
      partner: {
        name: "Kukje Gallery",
      },
      href: "/artwork/jenny-holzer-talking-politics",
    },
  }
}
