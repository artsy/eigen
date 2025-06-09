import { OwnerType } from "@artsy/cohesion"
import { fireEvent, screen } from "@testing-library/react-native"
import { ArtworkGridItemTestsQuery } from "__generated__/ArtworkGridItemTestsQuery.graphql"
import { ArtworkFiltersStoreProvider } from "app/Components/ArtworkFilter/ArtworkFilterStore"
import Artwork from "app/Components/ArtworkGrids/ArtworkGridItem"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { navigate } from "app/system/navigation/navigate"
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { DateTime } from "luxon"
import { graphql } from "react-relay"

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

  describe("navigation", () => {
    it("navigates to the Artwork screen", () => {
      renderWithRelay({
        Artwork: () => ({
          title: "Some Kind of Dinosaur",
          slug: "cool-artwork",
        }),
      })

      fireEvent.press(screen.getByTestId("artworkGridItem-Some Kind of Dinosaur"))

      expect(navigate).toHaveBeenCalledExactlyOnceWith('<mock-value-for-field-"href">')
    })
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
            collectorSignals: null,
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

    it("sends a tracking event when partner offer is available", () => {
      renderWithRelay(
        {
          Artwork: () => ({
            title: "Some Kind of Dinosaur",
            slug: "cool-artwork",
            internalID: "abc1234",
            sale: { isAuction: false },
            collectorSignals: {
              partnerOffer: {
                isAvailable: true,
                endAt: DateTime.fromMillis(Date.now()).plus({ hours: 12 }).toISO(),
                priceWithDiscount: { display: "$2,750" },
              },
              primaryLabel: "PARTNER_OFFER",
              auction: null,
            },
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
        signal_label: "Limited-Time Offer",
      })
    })

    describe("with auction signals", () => {
      it("sends a tracking event when with time left to bid label", () => {
        renderWithRelay(
          {
            Artwork: () => ({
              title: "Some Kind of Dinosaur",
              slug: "cool-artwork",
              internalID: "abc1234",
              sale: { isAuction: true },
              collectorSignals: {
                partnerOffer: null,
                primaryLabel: null,
                auction: {
                  bidCount: 7,
                  lotWatcherCount: 49,
                },
              },
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
          signal_bid_count: 7,
          signal_lot_watcher_count: 49,
          signal_label: "",
        })
      })

      it("sends a tracking event when with live bidding signal", () => {
        renderWithRelay(
          {
            Artwork: () => ({
              title: "Some Kind of Dinosaur",
              slug: "cool-artwork",
              internalID: "abc1234",
              sale: { isAuction: true },
              collectorSignals: {
                primaryLabel: null,
                partnerOffer: null,
                auction: { bidCount: 2, lotWatcherCount: 29 },
              },
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
          signal_bid_count: 2,
          signal_lot_watcher_count: 29,
          signal_label: "",
        })
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

      expect(screen.getByText("Some Kind of Dinosaur")).toBeOnTheScreen()
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

      expect(screen.getByText("Some Kind of Dinosaur")).toBeOnTheScreen()
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
          collectorSignals: {
            auction: {
              bidCount: 1,
            },
          },
          realizedPrice: null,
        }),
      })

      expect(screen.getByText("$200 (1 bid)")).toBeOnTheScreen()
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

      expect(screen.getByText("partner")).toBeOnTheScreen()
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

      expect(screen.getByText("Lot 1")).toBeOnTheScreen()
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

      expect(screen.queryByText("Lot 1")).not.toBeOnTheScreen()
    })
  })

  describe("Save and Follow CTAs", () => {
    describe("Save CTA when ff and experiment are disabled", () => {
      it("renders Save old CTA", () => {
        renderWithRelay({
          Artwork: () => artwork,
        })

        expect(screen.getByTestId("empty-heart-icon")).toBeOnTheScreen()
        expect(screen.queryByTestId("filled-heart-icon")).not.toBeOnTheScreen()

        fireEvent.press(screen.getByTestId("save-artwork-icon"))

        expect(screen.getByTestId("filled-heart-icon")).toBeOnTheScreen()
        expect(screen.queryByTestId("empty-heart-icon")).not.toBeOnTheScreen()
      })

      it("does not render Save CTA if hideSaveIcon is true", () => {
        renderWithRelay({}, { hideSaveIcon: true })

        expect(screen.queryByTestId("empty-heart-icon")).not.toBeOnTheScreen()
        expect(screen.queryByTestId("filled-heart-icon")).not.toBeOnTheScreen()
      })

      it("does not render new Save and Follow CTAs", () => {
        renderWithRelay({}, { hideSaveIcon: false })

        expect(screen.queryByTestId("heart-icon-empty")).not.toBeOnTheScreen()
        expect(screen.queryByTestId("heart-icon-filled")).not.toBeOnTheScreen()

        expect(screen.queryByTestId("follow-icon-empty")).not.toBeOnTheScreen()
        expect(screen.queryByTestId("follow-icon-filled")).not.toBeOnTheScreen()
      })
    })
  })

  describe("unlisted artworks", () => {
    it("shows exclusive access", () => {
      renderWithRelay({
        Artwork: () => ({
          isUnlisted: true,
        }),
      })

      expect(screen.getByText("Exclusive Access")).toBeOnTheScreen()
    })
  })

  describe("artwork signals", () => {
    describe("partner offer signal", () => {
      const futureDate = DateTime.fromMillis(Date.now())
        .plus({ days: 1, hours: 12, minutes: 1 })
        .toISO()

      const collectorSignals = {
        partnerOffer: {
          isAvailable: true,
          endAt: futureDate,
          priceWithDiscount: { display: "$2,750" },
        },
      }

      it("shows the limited-time offer signal for non-auction artworks", () => {
        renderWithRelay({
          Artwork: () => ({
            ...artwork,
            saleMessage: "$120,500",
            sale: { ...artwork.sale, isAuction: false },
            realizedPrice: null,
            collectorSignals,
          }),
        })

        expect(screen.getByText("$120,500")).toBeOnTheScreen()
        expect(screen.getByText("Offer Expires 1d 12h")).toBeOnTheScreen()
      })

      it("doesn't show the limited-time offer signal for auction artworks", () => {
        renderWithRelay({
          // artwork is by default an auction
          Artwork: () => ({ ...artwork, realizedPrice: null, collectorSignals }),
        })

        expect(screen.queryByText("Limited-Time Offer")).not.toBeOnTheScreen()
        expect(screen.queryByText("Exp. 1d 12h")).not.toBeOnTheScreen()
      })

      it("doesn't show the limited-time offer signal if priceOfferMessage is present", () => {
        renderWithRelay(
          {
            Artwork: () => ({
              ...artwork,
              sale: { ...artwork.sale, isAuction: false },
              realizedPrice: null,
              collectorSignals,
            }),
          },
          {
            priceOfferMessage: {
              priceListedMessage: "$12,500",
              priceWithDiscountMessage: "$10,000",
            },
          }
        )

        expect(screen.queryByText("Limited-Time Offer")).not.toBeOnTheScreen()
        expect(screen.queryByText("Exp. 1d 12h")).not.toBeOnTheScreen()
      })
    })

    describe("auction signals", () => {
      describe("live auction", () => {
        it("shows the bidding live now signal", () => {
          renderWithRelay({
            Artwork: () => ({
              ...artwork,
              sale: { ...artwork.sale, isClosed: false },
              realizedPrice: null,
              collectorSignals: { auction: { liveBiddingStarted: true } },
            }),
          })

          expect(screen.getByText("Bidding live now")).toBeOnTheScreen()
        })

        it("shows the bidding closed signal", () => {
          renderWithRelay({
            Artwork: () => ({
              ...artwork,
              sale: { ...artwork.sale, isClosed: false },
              realizedPrice: null,
              collectorSignals: {
                auction: {
                  lotClosesAt: DateTime.fromMillis(Date.now()).minus({ days: 1 }).toISO(),
                },
              },
            }),
          })

          expect(screen.getByText("Bidding closed")).toBeOnTheScreen()
        })
      })

      describe("bidding timers", () => {
        it("shows the Register by date", () => {
          const registerDate = DateTime.fromMillis(Date.now()).plus({ days: 1 })

          renderWithRelay({
            Artwork: () => ({
              ...artwork,
              sale: { ...artwork.sale, isClosed: false },
              realizedPrice: null,
              collectorSignals: { auction: { registrationEndsAt: registerDate.toISO() } },
            }),
          })

          // Register by Aug 26
          expect(
            screen.getByText(`Register by ${registerDate.toFormat("MMM d")}`)
          ).toBeOnTheScreen()
        })

        it("shows the time left to bid", () => {
          renderWithRelay({
            Artwork: () => ({
              ...artwork,
              sale: { ...artwork.sale, isClosed: false },
              realizedPrice: null,
              collectorSignals: {
                auction: {
                  lotClosesAt: DateTime.fromMillis(Date.now()).plus({ days: 1 }).toISO(),
                },
              },
            }),
          })

          expect(screen.getByText("23h 59m left to bid")).toBeOnTheScreen()
        })

        it("shows the extended left to bid in minutes", () => {
          renderWithRelay({
            Artwork: () => ({
              ...artwork,
              sale: { ...artwork.sale, isClosed: false },
              realizedPrice: null,
              collectorSignals: {
                auction: {
                  lotClosesAt: DateTime.fromMillis(Date.now()).plus({ minutes: 1 }).toISO(),
                  onlineBiddingExtended: true,
                },
              },
            }),
          })

          expect(screen.getByText("Extended, 59s left")).toBeOnTheScreen()
        })
      })

      it("shows number of bids", () => {
        renderWithRelay({
          Artwork: () => ({
            ...artwork,
            sale: { ...artwork.sale, isClosed: false },
            saleArtwork: { currentBid: { display: "$3,700" } },
            realizedPrice: null,
            collectorSignals: { auction: { bidCount: 7 } },
          }),
        })

        expect(screen.getByText("$3,700 (7 bids)")).toBeOnTheScreen()
      })
    })

    describe("social signal", () => {
      it("renders the increased interest signal", () => {
        renderWithRelay({
          Artwork: () => ({
            collectorSignals: {
              increasedInterest: true,
              curatorsPick: false,
            },
          }),
        })

        expect(screen.getByText("Increased Interest")).toBeOnTheScreen()
      })

      it("renders the curators' pick signal even when there's a increased interest signal", () => {
        renderWithRelay({
          Artwork: () => ({
            collectorSignals: {
              increasedInterest: true,
              curatorsPick: true,
            },
          }),
        })

        expect(screen.getByText("Curators’ Pick")).toBeOnTheScreen()
        expect(screen.queryByText("Increased Interest")).not.toBeOnTheScreen()
      })

      it("renders the curators pick signal", () => {
        renderWithRelay({
          Artwork: () => ({
            collectorSignals: {
              increasedInterest: false,
              curatorsPick: true,
            },
          }),
        })

        expect(screen.getByText("Curators’ Pick")).toBeOnTheScreen()
      })
    })
  })

  //
})

const artwork = {
  title: "Some Kind of Dinosaur",
  date: "2015",
  saleMessage: "Price on request",
  sale: {
    isAuction: true,
    isClosed: true,
    endAt: "2020-08-26T02:50:09+00:00",
    cascadingEndTimeIntervalMinutes: null,
  },
  isSaved: false,
  isUnlisted: false,
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
