import { OwnerType } from "@artsy/cohesion"
import { fireEvent, screen } from "@testing-library/react-native"
import { ArtworkGridItemTestsQuery } from "__generated__/ArtworkGridItemTestsQuery.graphql"
import { ArtworkFiltersStoreProvider } from "app/Components/ArtworkFilter/ArtworkFilterStore"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { flushPromiseQueue } from "app/utils/tests/flushPromiseQueue"
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"
import Artwork from "./ArtworkGridItem"

describe("ArtworkGridItem", () => {
  const { renderWithRelay } = setupTestWrapper<ArtworkGridItemTestsQuery>({
    Component: (props) => (
      <ArtworkFiltersStoreProvider>
        <Artwork {...props} artwork={props.artwork!} />
      </ArtworkFiltersStoreProvider>
    ),
    query: graphql`
      query ArtworkGridItemTestsQuery @relay_test_operation {
        artwork(id: "the-artwork") {
          ...ArtworkGridItem_artwork
        }
      }
    `,
  })

  describe("tracking", () => {
    const trackTap = jest.fn()

    afterEach(() => {
      jest.clearAllMocks()
      __globalStoreTestUtils__?.reset()
    })

    it("sends an event when trackTap is passed", () => {
      renderWithRelay(
        {
          Artwork: () => ({
            title: "Some Kind of Dinosaur",
            slug: "cool-artwork",
          }),
        },
        { itemIndex: 1, trackTap }
      )

      const touchableArtwork = screen.getByTestId("artworkGridItem-Some Kind of Dinosaur")
      fireEvent.press(touchableArtwork)

      expect(trackTap).toBeCalledWith("cool-artwork", 1)
    })

    it("sends a tracking event when contextScreenOwnerType is included", () => {
      renderWithRelay(
        {
          Artwork: () => ({
            title: "Some Kind of Dinosaur",
            slug: "cool-artwork",
            internalID: "abc1234",
          }),
        },
        {
          contextScreenOwnerType: OwnerType.artist,
          contextScreenOwnerId: "abc124",
          contextScreenOwnerSlug: "andy-warhol",
          itemIndex: 0,
        }
      )

      const touchableArtwork = screen.getByTestId("artworkGridItem-Some Kind of Dinosaur")
      fireEvent.press(touchableArtwork)

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
    const getRecentSearches = () =>
      __globalStoreTestUtils__?.getCurrentState().search.recentSearches!

    afterEach(() => {
      __globalStoreTestUtils__?.reset()
    })

    it("is updated when an artwork clicked and updateRecentSearchesOnTap is true", () => {
      renderWithRelay(
        {
          Artwork: () => ({
            title: "Some Kind of Dinosaur",
            slug: "cool-artwork",
            internalID: "abc1234",
            href: "/artwork/mikael-olson-some-kind-of-dinosaur",
            image: {
              url: "artsy.net/image-url",
            },
            artistNames: "Mikael Olson",
            date: 2015,
          }),
        },
        {
          contextScreenOwnerType: OwnerType.artist,
          contextScreenOwnerId: "abc124",
          contextScreenOwnerSlug: "andy-warhol",
          itemIndex: 0,
          updateRecentSearchesOnTap: true,
        }
      )

      fireEvent.press(screen.getByTestId("artworkGridItem-Some Kind of Dinosaur"))

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

    it("not updated when updateRecentSearchesOnTap is not passed, falling to false by default", () => {
      renderWithRelay(
        {
          Artwork: () => ({ title: "Some Kind of Dinosaur" }),
        },
        {
          contextScreenOwnerType: OwnerType.artist,
          contextScreenOwnerId: "abc124",
          contextScreenOwnerSlug: "andy-warhol",
          itemIndex: 0,
        }
      )

      fireEvent.press(screen.getByTestId("artworkGridItem-Some Kind of Dinosaur"))

      expect(getRecentSearches()).toEqual([])
    })
  })

  describe("in an open sale", () => {
    it("safely handles a missing sale_artwork", () => {
      renderWithRelay({
        Artwork: () => ({
          saleArtwork: null,
          title: "Some Kind of Dinosaur",
        }),
      })

      expect(screen.queryByText("Some Kind of Dinosaur")).toBeOnTheScreen()
    })
  })

  describe("in a closed sale", () => {
    it("renders without throwing an error without any price information", () => {
      renderWithRelay({
        Artwork: () => ({
          sale: {
            isClosed: true,
          },
          realizedPrice: null,
          title: "Some Kind of Dinosaur",
        }),
      })

      expect(screen.queryByText("Some Kind of Dinosaur")).toBeOnTheScreen()
    })

    it("renders without throwing an error when an auction is about to open, but not closed or finished", () => {
      renderWithRelay({
        Artwork: () => ({
          title: "Some Kind of Dinosaur",
          sale: {
            isClosed: false,
            isAuction: true,
          },
          saleArtwork: {
            currentBid: { display: "$200" },
            counts: {
              bidderPositions: 1,
            },
          },
          realizedPrice: null,
        }),
      })

      expect(screen.queryByText("$200 (1 bid)")).toBeOnTheScreen()
    })

    it("does not show the partner name if hidePartner is set to true", () => {
      renderWithRelay(
        {
          Artwork: () => ({
            saleArtwork: {
              currentBid: { display: "$200" },
            },
            sale: {
              isClosed: false,
              isAuction: true,
            },
            partner: {
              name: "partner",
            },
          }),
        },
        {
          hidePartner: true,
        }
      )

      expect(() => screen.getByText("partner")).toThrow()
    })

    it("shows the partner name if hidePartner is set to false", () => {
      renderWithRelay(
        {
          Artwork: () => ({
            partner: {
              name: "partner",
            },
          }),
        },
        { hidePartner: false }
      )

      expect(screen.queryByText("partner")).toBeOnTheScreen()
    })
  })

  describe("cascading end times", () => {
    it("shows the LotCloseInfo component when the sale has cascading end times", () => {
      renderWithRelay(
        {
          Artwork: () => ({
            sale: {
              isClosed: false,
              isAuction: true,
              cascadingEndTimeIntervalMinutes: 1,
              startAt: "2020-11-23T12:41:37.960Z",
              extendedBiddingEndAt: "2051-11-23T12:41:37.960Z",
              endAt: "2050-11-23T12:41:37.960Z",
            },
            saleArtwork: {
              lotLabel: "1",
              lotID: "123",
            },
          }),
        },
        { showLotLabel: true }
      )

      expect(screen.queryByText("Lot 1")).toBeOnTheScreen()
      expect(screen.queryByTestId("lot-close-info")).toBeOnTheScreen()
    })

    it("does not show the LotCloseInfo component when the sale does not have cascading end times", () => {
      renderWithRelay(
        {
          Artwork: () => ({
            sale: {
              isClosed: true,
              isAuction: true,
              cascadingEndTimeIntervalMinutes: null,
            },
            saleArtwork: {
              lotLabel: "Lot 1",
            },
          }),
        },
        {}
      )

      expect(screen.queryByTestId("lot-close-info")).toBeFalsy()
    })
  })

  describe("save artworks", () => {
    it("favourites works", async () => {
      renderWithRelay({
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
      renderWithRelay({}, { hideSaveIcon: true })

      expect(screen.queryByTestId("empty-heart-icon")).toBeNull()
      expect(screen.queryByTestId("filled-heart-icon")).toBeNull()
    })
  })

  describe("unlisted artworks", () => {
    it("shows exclusive access", async () => {
      renderWithRelay({
        Artwork: () => artwork,
      })

      expect(screen.getByText("Exclusive Access")).toBeTruthy()
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
