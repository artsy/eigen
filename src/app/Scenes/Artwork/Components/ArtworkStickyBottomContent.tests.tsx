import { screen } from "@testing-library/react-native"
import { ArtworkStickyBottomContent_Test_Query } from "__generated__/ArtworkStickyBottomContent_Test_Query.graphql"
import { AuctionTimerState } from "app/Components/Bidding/Components/Timer"
import {
  ArtworkStoreModel,
  ArtworkStoreProvider,
  artworkModel,
} from "app/Scenes/Artwork/ArtworkStore"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { DateTime } from "luxon"
import { graphql } from "react-relay"
import { ArtworkStickyBottomContent } from "./ArtworkStickyBottomContent"

interface TestProps {
  initialData?: Partial<ArtworkStoreModel>
}

describe("ArtworkStickyBottomContent", () => {
  const { renderWithRelay } = setupTestWrapper<ArtworkStickyBottomContent_Test_Query, TestProps>({
    Component: ({ artwork, me, initialData }) => {
      if (artwork && me) {
        return (
          <ArtworkStoreProvider runtimeModel={{ ...artworkModel, ...initialData }}>
            <ArtworkStickyBottomContent artwork={artwork} me={me} />
          </ArtworkStoreProvider>
        )
      }

      return null
    },
    query: graphql`
      query ArtworkStickyBottomContent_Test_Query {
        artwork(id: "artworkID") {
          ...ArtworkStickyBottomContent_artwork
        }
        me {
          ...ArtworkStickyBottomContent_me @arguments(artworkID: "artworkID")
        }
      }
    `,
  })

  it("should NOT be rendered when artwork is NOT for sale", () => {
    renderWithRelay({ Artwork: () => ({ ...artwork, isForSale: false }) })

    expect(screen.queryByLabelText("Sticky bottom commercial section")).not.toBeOnTheScreen()
  })

  it("should NOT be rendered when artwork is sold", () => {
    renderWithRelay({ Artwork: () => ({ ...artwork, isSold: true }) })

    expect(screen.queryByLabelText("Sticky bottom commercial section")).not.toBeOnTheScreen()
  })

  it("should NOT be rendered when auction is closed", () => {
    renderWithRelay(
      { Artwork: () => artwork },
      { initialData: { auctionState: AuctionTimerState.CLOSED } }
    )

    expect(screen.queryByLabelText("Sticky bottom commercial section")).not.toBeOnTheScreen()
  })

  it("should NOT be rendered when lot is ended", () => {
    renderWithRelay(
      {
        Artwork: () => ({
          ...artwork,
          saleArtwork: { ...artwork.saleArtwork, endAt: DateTime.now().minus({ day: 1 }).toISO() },
        }),
      },
      { initialData: { auctionState: AuctionTimerState.CLOSING } }
    )

    expect(screen.queryByLabelText("Sticky bottom commercial section")).not.toBeOnTheScreen()
  })

  it("should NOT be rendered when extended lot is ended", () => {
    renderWithRelay(
      {
        Artwork: () => ({
          ...artwork,
          saleArtwork: {
            ...artwork.saleArtwork,
            endAt: DateTime.now().minus({ minutes: 20 }).toISO(),
            extendedBiddingEndAt: DateTime.now().minus({ minutes: 5 }).toISO(),
          },
        }),
      },
      { initialData: { auctionState: AuctionTimerState.CLOSING } }
    )

    expect(screen.queryByLabelText("Sticky bottom commercial section")).not.toBeOnTheScreen()
  })

  it("should be rendered", () => {
    renderWithRelay({ Artwork: () => artwork })

    expect(screen.getByLabelText("Sticky bottom commercial section")).toBeOnTheScreen()
  })
})

const artwork = {
  isForSale: true,
  isSold: false,
  saleArtwork: {
    extendedBiddingEndAt: null,
    endAt: null,
  },
}
