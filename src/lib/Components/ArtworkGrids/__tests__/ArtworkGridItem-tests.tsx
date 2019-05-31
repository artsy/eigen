import "react-native"

import React from "react"
import * as renderer from "react-test-renderer"

import Artwork from "../ArtworkGridItem"

import { Theme } from "@artsy/palette"

it("renders properly", () => {
  const artwork = renderer
    .create(
      <Theme>
        <Artwork artwork={artworkProps() as any} />
      </Theme>
    )
    .toJSON()
  expect(artwork).toMatchSnapshot()
})

describe("in an open sale", () => {
  it("renders with starting bid", () => {
    const saleArtwork = {
      opening_bid: { display: "$100" },
      current_bid: null,
      bidder_positions_count: 0,
      sale: {
        is_closed: false,
      },
    }
    const artwork = renderer
      .create(
        <Theme>
          <Artwork artwork={artworkProps(saleArtwork) as any} />
        </Theme>
      )
      .toJSON()
    expect(artwork).toMatchSnapshot()
  })

  it("renders with current bid", () => {
    const saleArtwork = {
      opening_bid: { display: "$100" },
      current_bid: { display: "$200" },
      bidder_positions_count: 1,
      sale: {
        is_closed: false,
      },
    }
    const artwork = renderer
      .create(
        <Theme>
          <Artwork artwork={artworkProps(saleArtwork) as any} />
        </Theme>
      )
      .toJSON()
    expect(artwork).toMatchSnapshot()
  })

  it("safely handles a missing sale_artwork", () => {
    const props = artworkProps({}) // Passing in empty sale_artwork prop to trigger "sale is live" code in artworkProps()
    props.sale_artwork = null
    expect(() =>
      renderer
        .create(
          <Theme>
            <Artwork artwork={props as any} />
          </Theme>
        )
        .toJSON()
    ).not.toThrowError()
  })
})

describe("in a closed sale", () => {
  it("renders without any price information", () => {
    const saleArtwork = {
      opening_bid: { display: "$100" },
      current_bid: { display: "$200" },
      bidder_positions_count: 1,
      sale: {
        is_closed: true,
      },
    }
    const artwork = renderer
      .create(
        <Theme>
          <Artwork artwork={artworkProps(saleArtwork) as any} />
        </Theme>
      )
      .toJSON()
    expect(artwork).toMatchSnapshot()
  })

  it("renders bid when an auction is about to open, but not closed or finished", () => {
    const saleArtwork = {
      opening_bid: { display: "$100" },
      current_bid: { display: "$200" },
      bidder_positions_count: 1,
      sale: {
        is_closed: false,
        // is_open: false (this would be returned from Metaphysics, though we don't fetch this field)
      },
    }
    const artwork = renderer
      .create(
        <Theme>
          <Artwork artwork={artworkProps(saleArtwork) as any} />
        </Theme>
      )
      .toJSON()
    expect(artwork).toMatchSnapshot()
  })
})

const artworkProps = (saleArtwork = null) => {
  return {
    title: "Some Kind of Dinosaur",
    date: "2015",
    is_in_auction: saleArtwork !== null,
    sale_message: "Contact For Price",
    sale: {
      is_auction: true,
      is_live_open: false,
      is_open: true,
      is_closed: saleArtwork == null,
      display_timely_at: "ends in 6d",
    },
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
    is_biddable: true,
    is_acquireable: true,
  }
}
