import React from "react"
import "react-native"
import { renderWithLayout } from "../../../tests/renderWithLayout"

import RelayGenericArtworksGrid, { GenericArtworksGrid } from "../GenericGrid"

it("renders properly", () => {
  const artworks = [artwork(), artwork(), artwork()]

  const layout = { width: 768 }

  const grid = renderWithLayout(<RelayGenericArtworksGrid artworks={artworks as any} />, layout)
  expect(grid).toMatchSnapshot()
})

it("handles showing an update when there are new artworks", () => {
  const artworks = [artwork(), artwork()] as any
  const newArtworks = [artwork(), artwork(), artwork()] as any

  const grid = new GenericArtworksGrid({ artworks })
  const shouldUpdate = grid.shouldComponentUpdate({ artworks: newArtworks }, {} as any)

  expect(shouldUpdate).toBeTruthy()
})

const artwork = () => {
  return {
    id: "artwork-long-title",
    gravityID: "long-title",
    title: "DO WOMEN STILL HAVE TO BE NAKED TO GET INTO THE MET. MUSEUM",
    date: "2012",
    sale_message: null,
    is_in_auction: false,
    image: {
      url: "artsy.net/image-url",
      aspect_ratio: 2.18,
    },
    artists: [
      {
        name: "Guerrilla Girls",
      },
    ],
    partner: {
      name: "Whitechapel Gallery",
    },
    href: "/artwork/guerrilla-girls-do-women-still-have-to-be-naked-to-get-into-the-met-museum",
  }
}
