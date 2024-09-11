import { fireEvent, screen } from "@testing-library/react-native"
import { ArtworkRailCardTestsQuery } from "__generated__/ArtworkRailCardTestsQuery.graphql"
import { ArtworkRailCard } from "app/Components/ArtworkRail/ArtworkRailCard"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { DateTime } from "luxon"
import { graphql } from "react-relay"

describe("ArtworkRailCard", () => {
  const { renderWithRelay } = setupTestWrapper<ArtworkRailCardTestsQuery>({
    Component: (props) => (
      <ArtworkRailCard {...props} artwork={props.artwork!} size={(props as any).size || "large"} />
    ),
    query: graphql`
      query ArtworkRailCardTestsQuery @relay_test_operation {
        artwork(id: "the-artwork") {
          ...ArtworkRailCard_artwork
        }
      }
    `,
  })

  describe("in an open sale", () => {
    it("gracefully handles a missing sale_artwork", () => {
      renderWithRelay({
        Artwork: () => ({ saleArtwork: null, title: "Some Kind of Dinosaur", date: "2015" }),
      })

      expect(screen.getByText("Some Kind of Dinosaur, 2015")).toBeOnTheScreen()
    })
  })

  describe("in a closed sale", () => {
    it("renders without throwing an error without any price information", () => {
      renderWithRelay({
        Artwork: () => ({
          sale: { isClosed: true },
          realizedPrice: null,
          title: "Some Kind of Dinosaur",
          date: "2015",
        }),
      })

      expect(screen.getByText("Some Kind of Dinosaur, 2015")).toBeOnTheScreen()
    })

    it("renders without throwing an error when an auction is about to open, but not closed or finished", () => {
      renderWithRelay({
        Artwork: () => ({
          title: "Some Kind of Dinosaur",
          sale: { isClosed: false, isAuction: true },
          saleArtwork: { currentBid: { display: "$200" }, counts: { bidderPositions: 1 } },
          realizedPrice: null,
          collectorSignals: { auction: { bidCount: 1 } },
        }),
      })

      expect(screen.getByText("$200 (1 bid)")).toBeOnTheScreen()
    })

    it("shows the partner name if showPartnerName is set to true", () => {
      renderWithRelay(
        { Artwork: () => ({ partner: { name: "partner" } }) },
        { showPartnerName: true }
      )
      expect(screen.getByText("partner")).toBeOnTheScreen()
    })

    it("does not show the partner name if showPartnerName is set to false", () => {
      renderWithRelay(
        {
          Artwork: () => ({
            saleArtwork: { currentBid: { display: "$200" } },
            sale: { isClosed: false, isAuction: true },
            partner: { name: "partner" },
          }),
        },
        { showPartnerName: false }
      )

      expect(() => screen.getByText("partner")).toThrow()
    })
  })

  describe("cascading end times", () => {
    // skipping since we don't use the UrgencyTag after releasing the auction signals
    it.skip("shows the UrgencyTag component when the sale has cascading end times", () => {
      renderWithRelay({
        Artwork: () => ({
          sale: {
            isClosed: false,
            isAuction: true,
            endAt: "2020-08-23T11:10:09.000+00:00",
          },
          saleArtwork: {
            extendedBiddingEndAt: "2020-08-23T13:13:09.000+00:00",
            endAt: "2020-08-23T11:10:09.000+00:00",
          },
        }),
      })

      expect(screen.getByTestId("auction-urgency-tag")).toBeOnTheScreen()
      expect(screen.getByText("3 days left")).toBeOnTheScreen()
    })

    it("does not show the UrgencyTag component when the sale does not have cascading end times", () => {
      renderWithRelay({ Artwork: () => ({ sale: { isClosed: true, isAuction: true } }) })

      expect(screen.queryByTestId("auction-urgency-tag")).not.toBeOnTheScreen()
    })
  })

  describe("lot label", () => {
    it("shows the lot number when provided", () => {
      renderWithRelay(
        { Artwork: () => ({ sale: { isClosed: false, isAuction: true } }) },
        { lotLabel: "123" }
      )

      expect(screen.getByText("Lot 123")).toBeOnTheScreen()
    })

    it("does not show the lot number when not provided", () => {
      renderWithRelay(
        { Artwork: () => ({ sale: { isClosed: false, isAuction: true } }) },
        { lotLabel: null }
      )

      expect(() => screen.getByText("Lot")).toThrow()
    })
  })

  describe("save artworks", () => {
    it("saving artworks works when showSaveIcon is set to true", () => {
      renderWithRelay({ Artwork: () => artwork }, { showSaveIcon: true })

      expect(screen.getByTestId("empty-heart-icon")).toBeOnTheScreen()
      expect(screen.queryByTestId("filled-heart-icon")).not.toBeOnTheScreen()

      fireEvent.press(screen.getByTestId("save-artwork-icon"))

      expect(screen.getByTestId("filled-heart-icon")).toBeOnTheScreen()
      expect(screen.queryByTestId("empty-heart-icon")).not.toBeOnTheScreen()
    })

    it("does not show heart icon when showSaveIcon is set to false", () => {
      renderWithRelay({}, { showSaveIcon: false })

      expect(screen.queryByTestId("empty-heart-icon")).not.toBeOnTheScreen()
      expect(screen.queryByTestId("filled-heart-icon")).not.toBeOnTheScreen()
    })
  })

  describe("unlisted artworks", () => {
    it("shows exclusive access", () => {
      renderWithRelay({ Artwork: () => ({ isUnlisted: true }) })

      expect(screen.getByText("Exclusive Access")).toBeOnTheScreen()
    })
  })

  describe("artwork signals", () => {
    describe("partner offer signal", () => {
      beforeEach(
        () => __globalStoreTestUtils__?.injectFeatureFlags({ AREnablePartnerOfferSignals: true })
      )

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
            sale: { ...artwork.sale, isAuction: false },
            realizedPrice: null,
            collectorSignals: { ...collectorSignals, primaryLabel: "PARTNER_OFFER" },
          }),
        })

        expect(screen.getByText("Limited-Time Offer")).toBeOnTheScreen()
        expect(screen.getByText("Exp. 1d 12h")).toBeOnTheScreen()
      })

      it("doesn't show the limited-time offer signal for auction artworks", () => {
        renderWithRelay({
          // artwork is by default an auction
          Artwork: () => ({
            ...artwork,
            realizedPrice: null,
            collectorSignals: { ...collectorSignals, primaryLabel: null },
          }),
        })

        expect(screen.queryByText("Limited-Time Offer")).not.toBeOnTheScreen()
        expect(screen.queryByText("Exp. 1d 12h")).not.toBeOnTheScreen()
      })
    })

    describe("auction signals", () => {
      beforeEach(
        () =>
          __globalStoreTestUtils__?.injectFeatureFlags({ AREnableAuctionImprovementsSignals: true })
      )

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
                auction: { lotClosesAt: DateTime.fromMillis(Date.now()).plus({ days: 1 }).toISO() },
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

          expect(screen.getByText("Extended, 59s left to bid")).toBeOnTheScreen()
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
  })
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
