import { OwnerType } from "@artsy/cohesion"
import { fireEvent, screen } from "@testing-library/react-native"
import { ArtworkGridItemTestsQuery } from "__generated__/ArtworkGridItemTestsQuery.graphql"
import { ArtworkFiltersStoreProvider } from "app/Components/ArtworkFilter/ArtworkFilterStore"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { getMockRelayEnvironment } from "app/system/relay/defaultEnvironment"
import { flushPromiseQueue } from "app/utils/tests/flushPromiseQueue"
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"
import { renderWithHookWrappersTL } from "app/utils/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/utils/tests/resolveMostRecentRelayOperation"
import { graphql, useLazyLoadQuery } from "react-relay"
import { createMockEnvironment } from "relay-test-utils"
import Artwork, { ArtworkProps } from "./ArtworkGridItem"

describe("ArtworkGridItem", () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>

  beforeEach(() => {
    mockEnvironment = getMockRelayEnvironment()
  })

  const TestRenderer = (props: Omit<ArtworkProps, "artwork">) => {
    const data = useLazyLoadQuery<ArtworkGridItemTestsQuery>(query, {})

    if (!data.artwork) {
      return null
    }

    return (
      <ArtworkFiltersStoreProvider>
        <Artwork {...props} artwork={data.artwork} />
      </ArtworkFiltersStoreProvider>
    )
  }

  afterEach(() => {
    jest.clearAllMocks()
    __globalStoreTestUtils__?.reset()
  })

  describe("tracking", () => {
    it("sends an event when trackTap is passed", async () => {
      const trackTap = jest.fn()
      renderWithHookWrappersTL(<TestRenderer trackTap={trackTap} itemIndex={1} />, mockEnvironment)

      resolveMostRecentRelayOperation(mockEnvironment, {
        Artwork: () => artwork,
      })

      await flushPromiseQueue()

      fireEvent.press(screen.getByText("Some Kind of Dinosaur"))

      expect(trackTap).toBeCalledWith("cool-artwork", 1)
    })

    it("sends a tracking event when contextScreenOwnerType is included", async () => {
      renderWithHookWrappersTL(
        <TestRenderer
          contextScreenOwnerType={OwnerType.artist}
          contextScreenOwnerId="abc124"
          contextScreenOwnerSlug="andy-warhol"
          itemIndex={0}
        />,
        mockEnvironment
      )

      resolveMostRecentRelayOperation(mockEnvironment, {
        Artwork: () => artwork,
      })

      await flushPromiseQueue()

      fireEvent.press(screen.getByText("Some Kind of Dinosaur"))

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
    const getRecentSearches = () => {
      return __globalStoreTestUtils__?.getCurrentState().search.recentSearches ?? []
    }

    it("is updated when an artwork clicked and updateRecentSearchesOnTap is true", async () => {
      renderWithHookWrappersTL(
        <TestRenderer
          contextScreenOwnerType={OwnerType.artist}
          contextScreenOwnerId="abc124"
          contextScreenOwnerSlug="andy-warhol"
          itemIndex={0}
          updateRecentSearchesOnTap
        />,
        mockEnvironment
      )

      resolveMostRecentRelayOperation(mockEnvironment, {
        Artwork: () => artwork,
      })

      await flushPromiseQueue()

      fireEvent.press(screen.getByText("Some Kind of Dinosaur"))

      expect(getRecentSearches()).toEqual([
        {
          type: "AUTOSUGGEST_RESULT_TAPPED",
          props: {
            imageUrl: "artsy.net/image-url",
            href: "/artwork/mikael-olson-some-kind-of-dinosaur",
            slug: "cool-artwork",
            displayLabel: "Mikael Olson, Some Kind of Dinosaur (2015)",
            __typename: "Artwork",
            displayType: "Artwork",
          },
        },
      ])
    })

    it("not updated when updateRecentSearchesOnTap is not passed, falling to false by default", async () => {
      renderWithHookWrappersTL(
        <TestRenderer
          contextScreenOwnerType={OwnerType.artist}
          contextScreenOwnerId="abc124"
          contextScreenOwnerSlug="andy-warhol"
          itemIndex={0}
        />,
        mockEnvironment
      )

      resolveMostRecentRelayOperation(mockEnvironment, {
        Artwork: () => artwork,
      })

      await flushPromiseQueue()

      fireEvent.press(screen.getByText("Some Kind of Dinosaur"))

      expect(getRecentSearches()).toEqual([])
    })
  })

  describe("in an open sale", () => {
    it("renders without throwing an error with current bid", async () => {
      renderWithHookWrappersTL(<TestRenderer />, mockEnvironment)

      const saleArtwork = {
        currentBid: { display: "$200" },
        sale: {
          isClosed: false,
        },
      }

      resolveMostRecentRelayOperation(mockEnvironment, {
        Artwork: () => ({
          ...artwork,
          saleArtwork,
          sale: {
            ...artwork.sale,
            ...saleArtwork.sale,
          },
        }),
      })

      await flushPromiseQueue()

      expect(screen.getByText("Some Kind of Dinosaur")).toBeTruthy()
    })

    it("safely handles a missing saleArtwork", async () => {
      renderWithHookWrappersTL(<TestRenderer />, mockEnvironment)

      // Passing in empty saleArtwork prop to trigger "sale is live" code
      resolveMostRecentRelayOperation(mockEnvironment, {
        Artwork: () => ({
          ...artwork,
          saleArtwork: null,
        }),
      })

      await flushPromiseQueue()

      expect(screen.getByText("Some Kind of Dinosaur")).toBeTruthy()
    })
  })

  it("renders without throwing an error without any price information in a closed sale", async () => {
    renderWithHookWrappersTL(<TestRenderer />, mockEnvironment)

    const saleArtwork = {
      sale: {
        isClosed: true,
      },
    }

    resolveMostRecentRelayOperation(mockEnvironment, {
      Artwork: () => ({
        ...artwork,
        saleArtwork,
        sale: {
          ...artwork.sale,
          ...saleArtwork.sale,
        },
      }),
    })

    await flushPromiseQueue()

    expect(screen.getByText("Some Kind of Dinosaur")).toBeTruthy()
  })

  it("renders without throwing an error when an auction is about to open, but not closed or finished", async () => {
    renderWithHookWrappersTL(<TestRenderer />, mockEnvironment)

    const saleArtwork = {
      currentBid: { display: "$200" },
      sale: {
        isClosed: false,
        // is_open: false (this would be returned from Metaphysics, though we don't fetch this field)
      },
    }

    resolveMostRecentRelayOperation(mockEnvironment, {
      Artwork: () => ({
        ...artwork,
        saleArtwork,
        sale: {
          ...artwork.sale,
          ...saleArtwork.sale,
        },
      }),
    })

    await flushPromiseQueue()

    expect(screen.getByText("Some Kind of Dinosaur")).toBeTruthy()
  })

  describe("partner name", () => {
    it("does not show it if hidePartner is set to true", async () => {
      renderWithHookWrappersTL(<TestRenderer hidePartner />, mockEnvironment)

      const saleArtwork = {
        currentBid: { display: "$200" },
        sale: {
          isClosed: false,
          // is_open: false (this would be returned from Metaphysics, though we don't fetch this field)
        },
      }

      resolveMostRecentRelayOperation(mockEnvironment, {
        Artwork: () => ({
          ...artwork,
          saleArtwork,
          sale: {
            ...artwork.sale,
            ...saleArtwork.sale,
          },
        }),
      })

      await flushPromiseQueue()

      expect(screen.queryByText("partner")).toBeNull()
    })

    it("shows it if hidePartner is set to false", async () => {
      renderWithHookWrappersTL(<TestRenderer hidePartner={false} />, mockEnvironment)

      const saleArtwork = {
        currentBid: { display: "$200" },
        sale: {
          isClosed: false,
          // is_open: false (this would be returned from Metaphysics, though we don't fetch this field)
        },
      }

      resolveMostRecentRelayOperation(mockEnvironment, {
        Artwork: () => ({
          ...artwork,
          saleArtwork,
          sale: {
            ...artwork.sale,
            ...saleArtwork.sale,
          },
        }),
      })

      await flushPromiseQueue()

      expect(screen.queryByText("partner")).toBeTruthy()
    })
  })

  describe("cascading end times", () => {
    it("shows the LotCloseInfo component when the sale has cascading end times", async () => {
      renderWithHookWrappersTL(<TestRenderer showLotLabel />, mockEnvironment)

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

      resolveMostRecentRelayOperation(mockEnvironment, {
        Artwork: () => ({
          ...artwork,
          saleArtwork,
          sale: {
            ...artwork.sale,
            ...saleArtwork.sale,
          },
        }),
      })

      await flushPromiseQueue()

      expect(screen.getByTestId("lot-close-info")).toBeTruthy()
    })

    it("does not show the LotCloseInfo component when the sale does not have cascading end times", async () => {
      renderWithHookWrappersTL(<TestRenderer showLotLabel />, mockEnvironment)

      const saleArtwork = {
        lotLabel: "Lot 1",
        sale: {
          isClosed: true,
        },
      }

      resolveMostRecentRelayOperation(mockEnvironment, {
        Artwork: () => ({
          ...artwork,
          saleArtwork,
          sale: {
            ...artwork.sale,
            ...saleArtwork.sale,
          },
        }),
      })

      expect(screen.queryByTestId("lot-close-info")).toBeNull()
    })
  })

  describe("save artworks", () => {
    it("favourites works", async () => {
      renderWithHookWrappersTL(<TestRenderer />, mockEnvironment)

      resolveMostRecentRelayOperation(mockEnvironment, {
        Artwork: () => artwork,
      })

      await flushPromiseQueue()

      expect(screen.queryByTestId("empty-heart-icon")).toBeTruthy()
      expect(screen.queryByTestId("filled-heart-icon")).toBeNull()

      fireEvent.press(screen.getByTestId("save-artwork-icon"))

      expect(screen.queryByTestId("filled-heart-icon")).toBeTruthy()
      expect(screen.queryByTestId("empty-heart-icon")).toBeNull()
    })

    it("is not visible when hideSaveIcon prop is specified", () => {
      renderWithHookWrappersTL(<TestRenderer hideSaveIcon />, mockEnvironment)

      expect(screen.queryByTestId("empty-heart-icon")).toBeNull()
      expect(screen.queryByTestId("filled-heart-icon")).toBeNull()
    })
  })
})

const artwork = {
  title: "Some Kind of Dinosaur",
  date: "2015",
  saleMessage: "Contact For Price",
  sale: {
    isAuction: true,
    isClosed: true,
    endAt: "2020-08-26T02:50:09+00:00",
    cascadingEndTimeIntervalMinutes: null,
  },
  isSaved: false,
  saleArtwork: null,
  image: {
    url: "artsy.net/image-url",
    aspectRatio: 0.74,
  },
  artistNames: "Mikael Olson",
  partner: {
    name: "partner",
  },
  id: "mikael-olson-some-kind-of-dinosaur",
  href: "/artwork/mikael-olson-some-kind-of-dinosaur",
  slug: "cool-artwork",
  internalID: "abc1234",
  preview: {
    url: "artsy.net/image-url",
  },
  customArtworkLists: {
    totalCount: 0,
  },
}

const query = graphql`
  query ArtworkGridItemTestsQuery {
    artwork(id: "artworkID") {
      ...ArtworkGridItem_artwork
    }
  }
`
