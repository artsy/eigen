import { screen } from "@testing-library/react-native"
import { ArtworkTombstone_Test_Query } from "__generated__/ArtworkTombstone_Test_Query.graphql"
import { ArtworkTombstone_artwork$data } from "__generated__/ArtworkTombstone_artwork.graphql"
import { ArtworkStoreProvider } from "app/Scenes/Artwork/ArtworkStore"
import { ArtworkFixture } from "app/__fixtures__/ArtworkFixture"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"
import { ArtworkTombstoneFragmentContainer } from "./ArtworkTombstone"

jest.unmock("react-relay")

describe("ArtworkTombstone", () => {
  const { renderWithRelay } = setupTestWrapper<ArtworkTombstone_Test_Query>({
    Component: ({ artwork }) => (
      <ArtworkStoreProvider>
        <ArtworkTombstoneFragmentContainer artwork={artwork!} refetchArtwork={jest.fn()} />
      </ArtworkStoreProvider>
    ),
    query: graphql`
      query ArtworkTombstone_Test_Query {
        artwork(id: "test-artwork") {
          ...ArtworkTombstone_artwork
        }
      }
    `,
  })

  beforeEach(() => {
    __globalStoreTestUtils__?.injectFeatureFlags({
      ARArtworkRedesingPhase2: false,
    })
  })

  it("renders fields correctly", async () => {
    renderWithRelay({
      Artwork: () => ({
        ...artworkTombstoneArtwork,
      }),
    })

    expect(screen.queryByText("Hello im a title, 1992")).toBeTruthy()

    expect(screen.queryByText("Lot 8")).toBeNull()
    expect(screen.queryByText("Cool Auction")).toBeNull()
    expect(screen.queryByText("Estimated value: CHF 160,000–CHF 230,000")).toBeNull()
  })

  it("renders auction fields correctly", async () => {
    renderWithRelay({
      Artwork: () => ({
        ...artworkTombstoneAuctionArtwork,
      }),
    })

    expect(screen.queryByText("Lot 8")).toBeTruthy()
    expect(screen.queryByText("Cool Auction")).toBeTruthy()
    expect(screen.queryByText("Estimated value: CHF 160,000–CHF 230,000")).toBeTruthy()
  })

  describe("for an artwork in a sale with cascading end times or popcorn bidding", () => {
    const cascadingMessage = /Lots will close at 1-minute intervals./
    const popcornMessage = /Closing times may be extended due to last-minute competitive bidding./
    it("renders the notification banner with cascading message", () => {
      renderWithRelay({
        Artwork: () => ({
          ...artworkTombstoneCascadingEndTimesAuctionArtwork(),
        }),
      })

      expect(screen.queryByText(cascadingMessage)).toBeTruthy()
      expect(screen.queryByText(popcornMessage)).toBeNull()
    })

    it("renders the notification banner with popcorn message", async () => {
      renderWithRelay({
        Artwork: () => ({
          ...artworkTombstoneCascadingEndTimesAuctionArtwork(true),
        }),
      })

      expect(screen.queryByText(cascadingMessage)).toBeNull()
      expect(screen.queryByText(popcornMessage)).toBeTruthy()
    })
  })

  describe("for an artwork in a sale without cascading end times", () => {
    it("renders the notification banner", () => {
      renderWithRelay({
        Artwork: () => ({
          ...artworkTombstoneAuctionArtwork,
        }),
      })

      expect(screen.queryByText("Lots will close at 1-minute intervals.")).toBeNull()
    })
  })

  describe("Sale Message for not for sale artworks", () => {
    describe("with ARArtworkRedesingPhase2 switched set to true", () => {
      beforeEach(() => {
        __globalStoreTestUtils__?.injectFeatureFlags({ ARArtworkRedesingPhase2: true })
      })

      it("should render the sale message when artwork is not for sale", () => {
        renderWithRelay({
          Artwork: () => ({
            isForSale: false,
            saleMessage: "On loan",
          }),
        })

        expect(screen.queryByText("On loan")).toBeTruthy()
      })

      it("should not render the sale message when artwork is not for sale", () => {
        renderWithRelay({
          Artwork: () => ({
            isForSale: true,
            saleMessage: "For sale",
          }),
        })

        expect(screen.queryByText("For sale")).toBeNull()
      })
    })

    describe("with ARArtworkRedesingPhase2 switched set to false", () => {
      beforeEach(() => {
        __globalStoreTestUtils__?.injectFeatureFlags({ ARArtworkRedesingPhase2: false })
      })

      it("should not render the sale message when artwork is not for sale", () => {
        renderWithRelay({
          Artwork: () => ({
            isForSale: false,
            saleMessage: "On loan",
          }),
        })

        expect(screen.queryByText("On loan")).toBeNull()
      })

      it("should not render the sale message when artwork is not for sale", () => {
        renderWithRelay({
          Artwork: () => ({
            isForSale: true,
            saleMessage: "For sale",
          }),
        })

        expect(screen.queryByText("For sale")).toBeNull()
      })
    })
  })
})

const artworkTombstoneArtwork: ArtworkTombstone_artwork$data = {
  ...ArtworkFixture,
  artists: [{ name: "Artist", href: "/artist" }],
  title: "Hello im a title",
  date: "1992",
  isForSale: true,
}

const artworkTombstoneAuctionArtwork = {
  ...artworkTombstoneArtwork,
  isInAuction: true,
  saleArtwork: {
    lotLabel: "8",
    estimate: "CHF 160,000–CHF 230,000",
  },
  partner: {
    name: "Cool Auction",
  },
  sale: {
    isClosed: false,
    cascadingEndTimeIntervalMinutes: null,
    extendedBiddingIntervalMinutes: null,
  },
}

const artworkTombstoneCascadingEndTimesAuctionArtwork = (withextendedBidding = false) => ({
  ...artworkTombstoneArtwork,
  isInAuction: true,
  saleArtwork: {
    lotLabel: "8",
    estimate: "CHF 160,000–CHF 230,000",
  },
  partner: {
    name: "Cool Auction",
  },
  sale: {
    isClosed: false,
    cascadingEndTimeIntervalMinutes: 1,
    extendedBiddingIntervalMinutes: withextendedBidding ? 1 : null,
  },
})
