import "react-native"

import React from "react"
import * as renderer from "react-test-renderer"

import Artwork from "../ArtworkGridItem"

import { Theme } from "@artsy/palette"

it("renders without throwing an error", () => {
  renderer.create(
    <Theme>
      <Artwork artwork={artworkProps() as any} />
    </Theme>
  )
})

describe("in an open sale", () => {
  it("renders without throwing an error with starting bid", () => {
    const saleArtwork = {
      opening_bid: { display: "$100" },
      current_bid: null,
      bidder_positions_count: 0,
      sale: {
        is_closed: false,
      },
    }
    renderer.create(
      <Theme>
        <Artwork
          artwork={
            artworkProps(
              // @ts-ignore STRICTNESS_MIGRATION
              saleArtwork
            ) as any
          }
        />
      </Theme>
    )
  })

  it("renders without throwing an error with current bid", () => {
    const saleArtwork = {
      opening_bid: { display: "$100" },
      current_bid: { display: "$200" },
      bidder_positions_count: 1,
      sale: {
        is_closed: false,
      },
    }
    renderer.create(
      <Theme>
        <Artwork
          artwork={
            artworkProps(
              // @ts-ignore STRICTNESS_MIGRATION
              saleArtwork
            ) as any
          }
        />
      </Theme>
    )
  })

  it("safely handles a missing sale_artwork", () => {
    // @ts-ignore STRICTNESS_MIGRATION
    const props = artworkProps({}) // Passing in empty sale_artwork prop to trigger "sale is live" code in artworkProps()
    props.sale_artwork = null
    renderer.create(
      <Theme>
        <Artwork artwork={props as any} />
      </Theme>
    )
  })
})

describe("in a closed sale", () => {
  it("renders without throwing an error without any price information", () => {
    const saleArtwork = {
      opening_bid: { display: "$100" },
      current_bid: { display: "$200" },
      bidder_positions_count: 1,
      sale: {
        is_closed: true,
      },
    }
    renderer.create(
      <Theme>
        <Artwork
          artwork={
            artworkProps(
              // @ts-ignore STRICTNESS_MIGRATION
              saleArtwork
            ) as any
          }
        />
      </Theme>
    )
  })

  it("renders without throwing an error when an auction is about to open, but not closed or finished", () => {
    const saleArtwork = {
      opening_bid: { display: "$100" },
      current_bid: { display: "$200" },
      bidder_positions_count: 1,
      sale: {
        is_closed: false,
        // is_open: false (this would be returned from Metaphysics, though we don't fetch this field)
      },
    }
    renderer.create(
      <Theme>
        <Artwork
          artwork={
            artworkProps(
              // @ts-ignore STRICTNESS_MIGRATION
              saleArtwork
            ) as any
          }
        />
      </Theme>
    )
  })
})

const artworkProps = (saleArtwork = null) => {
  return {
    title: "Some Kind of Dinosaur",
    date: "2015",
    sale_message: "Contact For Price",
    sale: {
      is_auction: true,
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
