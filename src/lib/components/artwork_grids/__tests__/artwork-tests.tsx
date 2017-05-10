import "react-native"

import * as React from "react"
import * as renderer from "react-test-renderer"

import Artwork from "../artwork"

it("renders properly", () => {
  const artwork = renderer.create(<Artwork artwork={artworkProps()} />).toJSON()
  expect(artwork).toMatchSnapshot()
})

describe("in a sale", () => {
  it("renders with starting bid", () => {
    const saleArtwork = {
      opening_bid: { display: "$100" },
      current_bid: null,
      bidder_positions_count: 0,
    }
    const artwork = renderer.create(<Artwork artwork={artworkProps(saleArtwork)} />).toJSON()
    expect(artwork).toMatchSnapshot()
  })

  it("renders with current bid", () => {
    const saleArtwork = {
      opening_bid: { display: "$100" },
      current_bid: { display: "$200" },
      bidder_positions_count: 1,
    }
    const artwork = renderer.create(<Artwork artwork={artworkProps(saleArtwork)} />).toJSON()
    expect(artwork).toMatchSnapshot()
  })
})

let artworkProps = (saleArtwork = null) => {
  return {
    title: "Some Kind of Dinosaur",
    date: "2015",
    sale_message: "$875",
    is_in_auction: (saleArtwork !== null),
    sale_artwork: saleArtwork,
    image: {
      url: "artsy.net/image-url",
      aspect_ratio: 0.74,
    },
    artists: [
      {
        name: "Mikael Olson",
      },
    ],
    partner: {
      name: "Gallery 1261",
    },
    href: "/artwork/mikael-olson-some-kind-of-dinosaur",
  }
}
