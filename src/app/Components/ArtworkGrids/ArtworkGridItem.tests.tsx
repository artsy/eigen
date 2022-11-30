import { OwnerType } from "@artsy/cohesion"
import { fireEvent, waitFor } from "@testing-library/react-native"
import { ArtworkFiltersStoreProvider } from "app/Components/ArtworkFilter/ArtworkFilterStore"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { mockTrackEvent } from "app/tests/globallyMockedStuff"
import { renderWithHookWrappersTL } from "app/tests/renderWithWrappers"
import { Touchable } from "palette"
import "react-native"
import Artwork from "./ArtworkGridItem"

jest.unmock("react-relay")

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
    const { getByTestId } = renderWithHookWrappersTL(
      <Artwork trackTap={trackTap} artwork={artworkProps({}) as any} itemIndex={1} />
    )

    const touchableArtwork = getByTestId("artworkGridItem-Some Kind of Dinosaur")
    fireEvent(touchableArtwork, "onPress")
    expect(trackTap).toBeCalledWith("cool-artwork", 1)
  })

  it("sends a tracking event when contextScreenOwnerType is included", () => {
    const { getByTestId } = renderWithHookWrappersTL(
      <ArtworkWithProviders
        artwork={artworkProps({})}
        contextScreenOwnerType={OwnerType.artist}
        contextScreenOwnerId="abc124"
        contextScreenOwnerSlug="andy-warhol"
        itemIndex={0}
      />
    )
    const touchableArtwork = getByTestId("artworkGridItem-Some Kind of Dinosaur")
    fireEvent(touchableArtwork, "onPress")
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
    const { container } = renderWithHookWrappersTL(
      <ArtworkWithProviders
        artwork={artworkProps({})}
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
    const { container } = renderWithHookWrappersTL(
      <ArtworkWithProviders
        artwork={artworkProps({})}
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
    renderWithHookWrappersTL(<Artwork artwork={artworkProps({ saleArtwork }) as any} />)
  })

  it("safely handles a missing sale_artwork", () => {
    const props = artworkProps({ saleArtwork: null }) // Passing in empty sale_artwork prop to trigger "sale is live" code in artworkProps({})
    props.saleArtwork = null
    renderWithHookWrappersTL(<Artwork artwork={props as any} />)
  })
})

describe("in a closed sale", () => {
  it("renders without throwing an error without any price information", () => {
    const saleArtwork = {
      sale: {
        isClosed: true,
      },
    }
    renderWithHookWrappersTL(<Artwork artwork={artworkProps({ saleArtwork }) as any} />)
  })

  it("renders without throwing an error when an auction is about to open, but not closed or finished", () => {
    const saleArtwork = {
      currentBid: { display: "$200" },
      sale: {
        isClosed: false,
        // is_open: false (this would be returned from Metaphysics, though we don't fetch this field)
      },
    }
    renderWithHookWrappersTL(<Artwork artwork={artworkProps({ saleArtwork }) as any} />)
  })

  it("does not show the partner name if hidePartner is set to true", () => {
    const saleArtwork = {
      currentBid: { display: "$200" },
      sale: {
        isClosed: false,
        // is_open: false (this would be returned from Metaphysics, though we don't fetch this field)
      },
    }
    const { getByText } = renderWithHookWrappersTL(
      <Artwork artwork={artworkProps({ saleArtwork }) as any} hidePartner />
    )

    expect(() => getByText("partner")).toThrow()
  })

  it("shows the partner name if hidePartner is set to false", () => {
    const saleArtwork = {
      currentBid: { display: "$200" },
      sale: {
        isClosed: false,
        // is_open: false (this would be returned from Metaphysics, though we don't fetch this field)
      },
    }
    const { getByText } = renderWithHookWrappersTL(
      <Artwork artwork={artworkProps({ saleArtwork }) as any} hidePartner={false} />
    )

    expect(getByText("partner")).toBeTruthy()
  })
})

describe("cascading end times", () => {
  it("shows the LotCloseInfo component when the sale has cascading end times", () => {
    const saleArtwork = {
      lotLabel: "Lot 1",
      lotID: "123",
      sale: {
        isClosed: false,
        cascadingEndTimeIntervalMinutes: 1,
        startAt: "2020-11-23T12:41:37.960Z",
        endAt: "2050-11-23T12:41:37.960Z",
        extendedBiddingEndAt: "2051-11-23T12:41:37.960Z",
      },
      endAt: "2050-11-23T12:41:37.960Z",
      startAt: "2050-11-23T12:41:37.960Z",
    }
    const { getByTestId } = renderWithHookWrappersTL(
      <Artwork showLotLabel artwork={artworkProps({ saleArtwork }) as any} />
    )

    expect(getByTestId("lot-close-info")).toBeTruthy()
  })

  it("does not show the LotCloseInfo component when the sale does not have cascading end times", () => {
    const saleArtwork = {
      lotLabel: "Lot 1",
      sale: {
        isClosed: true,
      },
    }
    const { getByTestId } = renderWithHookWrappersTL(
      <Artwork showLotLabel artwork={artworkProps({ saleArtwork }) as any} />
    )
    expect(() => getByTestId("lot-close-info")).toThrow()
  })
})

describe("save artworks", () => {
  beforeEach(() => {
    __globalStoreTestUtils__?.injectFeatureFlags({ AREnableArtworkGridSaveIcon: true })
  })

  it("favourites works", () => {
    const { getByTestId } = renderWithHookWrappersTL(
      <Artwork showLotLabel artwork={artworkProps({}) as any} />
    )

    expect(getByTestId("empty-heart-icon")).toBeTruthy()

    const saveButton = getByTestId("save-artwork-icon")

    fireEvent(saveButton, "onPress")

    waitFor(() => {
      expect(getByTestId("filled-heart-icon")).toBeTruthy()
    })
  })

  it("is not possible when hideSaveIcon prop is specified", () => {
    const { getByTestId } = renderWithHookWrappersTL(
      <Artwork hideSaveIcon artwork={artworkProps({}) as any} />
    )

    expect(() => getByTestId("empty-heart-icon")).toThrow()
  })
})

const artworkProps = ({
  isSaved = false,
  saleArtwork = null,
}: {
  isSaved?: boolean
  saleArtwork?:
    | {
        currentBid?: { display: string }
        sale?: { isClosed: boolean; cascadingEndTimeIntervalMinutes?: number }
      }
    | null
    | undefined
}) => {
  return {
    title: "Some Kind of Dinosaur",
    date: "2015",
    saleMessage: "Contact For Price",
    sale: {
      isAuction: true,
      isClosed: saleArtwork == null,
      displayTimelyAt: "ends in 6d",
      endAt: "2020-08-26T02:50:09+00:00",
      cascadingEndTimeIntervalMinutes: saleArtwork?.sale?.cascadingEndTimeIntervalMinutes || null,
      ...saleArtwork?.sale,
    },
    isSaved,
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
