import "react-native"

import React from "react"
import * as renderer from "react-test-renderer"

import Artwork from "../ArtworkGridItem"

import { OwnerType } from "@artsy/cohesion"
import { Theme } from "@artsy/palette"
import { Touchable } from "palette"
import { act } from "react-test-renderer"
import { useTracking } from "react-tracking"

it("renders without throwing an error", () => {
  renderer.create(
    <Theme>
      <Artwork artwork={artworkProps() as any} />
    </Theme>
  )
})

describe("tracking", () => {
  const trackEvent = jest.fn()

  beforeEach(() => {
    ;(useTracking as any).mockImplementation(() => {
      return {
        trackEvent,
      }
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it("sends an event when trackTap is passed", () => {
    const trackTap = jest.fn()
    const rendered = renderer.create(
      <Theme>
        <Artwork trackTap={trackTap} artwork={artworkProps() as any} itemIndex={1} />
      </Theme>
    )

    const touchableArtwork = rendered.root.findByType(Touchable)
    act(() => touchableArtwork.props.onPress())
    expect(trackTap).toBeCalledWith("cool-artwork", 1)
  })

  it("sends a tracking event when contextScreenOwnerType is included", () => {
    const rendered = renderer.create(
      <Theme>
        <Artwork
          artwork={artworkProps() as any}
          contextScreenOwnerType={OwnerType.artist}
          contextScreenOwnerId="abc124"
          contextScreenOwnerSlug="andy-warhol"
        />
      </Theme>
    )

    const touchableArtwork = rendered.root.findByType(Touchable)
    act(() => touchableArtwork.props.onPress())
    expect(trackEvent).toBeCalledWith({
      action: "tappedMainArtworkGrid",
      context_module: "artworkGrid",
      context_screen_owner_id: "abc124",
      context_screen_owner_slug: "andy-warhol",
      context_screen_owner_type: "artist",
      destination_screen_owner_id: "abc1234",
      destination_screen_owner_slug: "cool-artwork",
      destination_screen_owner_type: "artwork",
      type: "thumbnail",
    })
  })
})

describe("in an open sale", () => {
  it("renders without throwing an error with current bid", () => {
    const saleArtwork = {
      currentBid: { display: "$200" },
      sale: {
        isClosed: false,
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
    props.saleArtwork = null
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
      sale: {
        isClosed: true,
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
      currentBid: { display: "$200" },
      sale: {
        isClosed: false,
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
    slug: "cool-artwork",
    internalID: "abc1234",
  }
}
