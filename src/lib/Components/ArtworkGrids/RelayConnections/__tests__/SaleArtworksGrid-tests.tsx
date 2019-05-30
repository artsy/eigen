import "react-native"

import React from "react"
import { renderWithLayout } from "../../../../tests/renderWithLayout"

import artwork from "../../__tests__/__fixtures__/artwork"
import SaleArtworks from "../SaleArtworksGrid"

const saleArtwork = () => ({
  artwork: artwork(),
})

it("renders properly", () => {
  const sale = {
    id: "sale-id",
    salerArtworks: {
      edges: [saleArtwork(), saleArtwork(), saleArtwork()],
    },
  }

  const grid = renderWithLayout(
    <SaleArtworks sale={sale} mapPropsToArtworksConnection={props => props.saleArtworks} />,
    {
      width: 768,
    }
  )
  expect(grid).toMatchSnapshot()
})
