import "react-native"

import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import React from "react"

import Artwork from "../ArtworkGridItem"

import { Theme } from "@artsy/palette"

it("renders without throwing an error", () => {
  renderWithWrappers(
    <Theme>
      <Artwork artwork={artworkProps() as any} />
    </Theme>
  )
})

describe("in an open sale", () => {
  it("renders without throwing an error with current bid", () => {
    const saleArtwork = {
      currentBid: { display: "$200" },
      sale: {
        isClosed: false,
      },
    }
    renderWithWrappers(
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
    props.saleArtwork = null
    renderWithWrappers(
      <Theme>
        <Artwork artwork={props as any} />
      </Theme>
    )
  })
})

describe("in a closed sale", () => {
  it("renders without throwing an error without any price information", () => {
    const saleArtwork = {
      sale: {
        isClosed: true,
      },
    }
    renderWithWrappers(
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
      currentBid: { display: "$200" },
      sale: {
        isClosed: false,
        // is_open: false (this would be returned from Metaphysics, though we don't fetch this field)
      },
    }
    renderWithWrappers(
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
    saleMessage: "Contact For Price",
    sale: {
      isAuction: true,
      isClosed: saleArtwork == null,
      displayTimelyAt: "ends in 6d",
    },
    saleArtwork,
    image: {
      url: "artsy.net/image-url",
      aspectRatio: 0.74,
    },
    artistsNames: "Mikael Olson",
    id: "mikael-olson-some-kind-of-dinosaur",
    href: "/artwork/mikael-olson-some-kind-of-dinosaur",
  }
}
