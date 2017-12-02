import "react-native"

import React from "react"
import * as renderer from "react-test-renderer"

import Artwork from "../Artwork"

it("renders properly", () => {
  const artwork = renderer.create(<Artwork artwork={artworkProps()} />).toJSON()
  expect(artwork).toMatchSnapshot()
})

describe("in an open sale", () => {
  it("renders with starting bid", () => {
    const saleArtwork = {
      opening_bid: { display: "$100" },
      current_bid: null,
      bidder_positions_count: 0,
      sale: {
        is_open: true,
      },
    }
    const artwork = renderer.create(<Artwork artwork={artworkProps(saleArtwork)} />).toJSON()
    expect(artwork).toMatchSnapshot()
  })

  it("renders with current bid", () => {
    const saleArtwork = {
      opening_bid: { display: "$100" },
      current_bid: { display: "$200" },
      bidder_positions_count: 1,
      sale: {
        is_open: true,
      },
    }
    const artwork = renderer.create(<Artwork artwork={artworkProps(saleArtwork)} />).toJSON()
    expect(artwork).toMatchSnapshot()
  })
})

describe("in a closed sale", () => {
  it("renders without any price information", () => {
    const saleArtwork = {
      opening_bid: { display: "$100" },
      current_bid: { display: "$200" },
      bidder_positions_count: 1,
      sale: {
        is_open: false,
      },
    }
    const artwork = renderer.create(<Artwork artwork={artworkProps(saleArtwork)} />).toJSON()
    expect(artwork).toMatchSnapshot()
  })
})

const artworkProps = (saleArtwork = null) => {
  return {
    title: "Some Kind of Dinosaur",
    date: "2015",
    is_in_auction: saleArtwork !== null,
    sale_message: "Contact Gallery",
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
    id: "mikael-olson-some-kind-of-dinosaur",
    href: "/artwork/mikael-olson-some-kind-of-dinosaur",
  }
}
