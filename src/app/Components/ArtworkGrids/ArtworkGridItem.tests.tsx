import { OwnerType } from "@artsy/cohesion"
import { ArtworkFiltersStoreProvider } from "app/Components/ArtworkFilter/ArtworkFilterStore"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { extractText } from "app/tests/extractText"
import { mockTrackEvent } from "app/tests/globallyMockedStuff"
import { renderWithWrappers, renderWithWrappersTL } from "app/tests/renderWithWrappers"
import { Touchable } from "palette"
import React from "react"
import "react-native"
import { act } from "react-test-renderer"
import Artwork from "./ArtworkGridItem"

const ArtworkWithProviders = (props: any) => {
  return (
    <ArtworkFiltersStoreProvider>
      <Artwork {...props} />
    </ArtworkFiltersStoreProvider>
  )
}

describe("tracking", () => {
  afterEach(() => {
    jest.clearAllMocks()
    __globalStoreTestUtils__?.reset()
  })

  it("sends an event when trackTap is passed", () => {
    const trackTap = jest.fn()
    const rendered = renderWithWrappers(
      <Artwork trackTap={trackTap} artwork={artworkProps() as any} itemIndex={1} />
    )

    const touchableArtwork = rendered.root.findByType(Touchable)
    act(() => touchableArtwork.props.onPress())
    expect(trackTap).toBeCalledWith("cool-artwork", 1)
  })

  it("sends a tracking event when contextScreenOwnerType is included", () => {
    const rendered = renderWithWrappers(
      <ArtworkWithProviders
        artwork={artworkProps()}
        contextScreenOwnerType={OwnerType.artist}
        contextScreenOwnerId="abc124"
        contextScreenOwnerSlug="andy-warhol"
        itemIndex={0}
      />
    )
    const touchableArtwork = rendered.root.findByType(Touchable)
    act(() => touchableArtwork.props.onPress())
    expect(mockTrackEvent).toBeCalledWith({
      action: "tappedMainArtworkGrid",
      context_module: "artworkGrid",
      context_screen_owner_id: "abc124",
      context_screen_owner_slug: "andy-warhol",
      context_screen_owner_type: "artist",
      destination_screen_owner_id: "abc1234",
      destination_screen_owner_slug: "cool-artwork",
      destination_screen_owner_type: "artwork",
      position: 0,
      sort: "-decayed_merch",
      type: "thumbnail",
    })
  })
})

describe("recent searches", () => {
  const getRecentSearches = () => __globalStoreTestUtils__?.getCurrentState().search.recentSearches!

  afterEach(() => {
    __globalStoreTestUtils__?.reset()
  })

  it("is updated when an artwork clicked and updateRecentSearchesOnTap is true", () => {
    const { container } = renderWithWrappersTL(
      <ArtworkWithProviders
        artwork={artworkProps()}
        contextScreenOwnerType={OwnerType.artist}
        contextScreenOwnerId="abc124"
        contextScreenOwnerSlug="andy-warhol"
        itemIndex={0}
        updateRecentSearchesOnTap
      />
    )

    container.findByType(Touchable).props.onPress()

    expect(getRecentSearches()).toEqual([
      {
        type: "AUTOSUGGEST_RESULT_TAPPED",
        props: {
          imageUrl: "artsy.net/image-url",
          href: "/artwork/mikael-olson-some-kind-of-dinosaur",
          slug: "cool-artwork",
          displayLabel: "undefined, Some Kind of Dinosaur (2015)",
          __typename: "Artwork",
          displayType: "Artwork",
        },
      },
    ])
  })

  it("not updated when updateRecentSearchesOnTap is not passed, falling to false by default", () => {
    const { container } = renderWithWrappersTL(
      <ArtworkWithProviders
        artwork={artworkProps()}
        contextScreenOwnerType={OwnerType.artist}
        contextScreenOwnerId="abc124"
        contextScreenOwnerSlug="andy-warhol"
        itemIndex={0}
      />
    )

    container.findByType(Touchable).props.onPress()

    expect(getRecentSearches()).toEqual([])
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
    renderWithWrappers(<Artwork artwork={artworkProps(saleArtwork) as any} />)
  })

  it("safely handles a missing sale_artwork", () => {
    const props = artworkProps(null) // Passing in empty sale_artwork prop to trigger "sale is live" code in artworkProps()
    props.saleArtwork = null
    renderWithWrappers(<Artwork artwork={props as any} />)
  })
})

describe("in a closed sale", () => {
  it("renders without throwing an error without any price information", () => {
    const saleArtwork = {
      sale: {
        isClosed: true,
      },
    }
    renderWithWrappers(<Artwork artwork={artworkProps(saleArtwork) as any} />)
  })

  it("renders without throwing an error when an auction is about to open, but not closed or finished", () => {
    const saleArtwork = {
      currentBid: { display: "$200" },
      sale: {
        isClosed: false,
        // is_open: false (this would be returned from Metaphysics, though we don't fetch this field)
      },
    }
    renderWithWrappers(<Artwork artwork={artworkProps(saleArtwork) as any} />)
  })

  it("does not show the partner name if hidePartner is set to true", () => {
    const saleArtwork = {
      currentBid: { display: "$200" },
      sale: {
        isClosed: false,
        // is_open: false (this would be returned from Metaphysics, though we don't fetch this field)
      },
    }
    const tree = renderWithWrappers(
      <Artwork artwork={artworkProps(saleArtwork) as any} hidePartner />
    )

    expect(extractText(tree.root)).not.toContain("partner")
  })

  it("shows the partner name if hidePartner is set to false", () => {
    const saleArtwork = {
      currentBid: { display: "$200" },
      sale: {
        isClosed: false,
        // is_open: false (this would be returned from Metaphysics, though we don't fetch this field)
      },
    }
    const tree = renderWithWrappers(
      <Artwork artwork={artworkProps(saleArtwork) as any} hidePartner={false} />
    )

    expect(extractText(tree.root)).toContain("partner")
  })
})

const artworkProps = (
  saleArtwork:
    | {
        currentBid?: { display: string }
        sale?: { isClosed: boolean }
      }
    | null
    | undefined = null
) => {
  return {
    title: "Some Kind of Dinosaur",
    date: "2015",
    saleMessage: "Contact For Price",
    sale: {
      isAuction: true,
      isClosed: saleArtwork == null,
      displayTimelyAt: "ends in 6d",
      endAt: "2020-08-26T02:50:09+00:00",
    },
    saleArtwork,
    image: {
      url: "artsy.net/image-url",
      aspectRatio: 0.74,
    },
    artistsNames: "Mikael Olson",
    partner: {
      name: "partner",
    },
    id: "mikael-olson-some-kind-of-dinosaur",
    href: "/artwork/mikael-olson-some-kind-of-dinosaur",
    slug: "cool-artwork",
    internalID: "abc1234",
  }
}
