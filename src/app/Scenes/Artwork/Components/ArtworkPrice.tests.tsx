import { screen } from "@testing-library/react-native"
import { ArtworkPrice_Test_Query } from "__generated__/ArtworkPrice_Test_Query.graphql"
import { AuctionTimerState } from "app/Components/Bidding/Components/Timer"
import {
  ArtworkStoreModel,
  ArtworkStoreProvider,
  artworkModel,
} from "app/Scenes/Artwork/ArtworkStore"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { DateTime } from "luxon"
import { graphql } from "react-relay"
import { ArtworkPrice } from "./ArtworkPrice"

interface TestProps {
  initialData?: Partial<ArtworkStoreModel>
}

describe("ArtworkPrice", () => {
  const { renderWithRelay } = setupTestWrapper<ArtworkPrice_Test_Query, TestProps>({
    Component: ({ artwork, me, initialData }) => {
      if (artwork && me) {
        return (
          <ArtworkStoreProvider runtimeModel={{ ...artworkModel, ...initialData }}>
            <ArtworkPrice artwork={artwork} me={me} />
          </ArtworkStoreProvider>
        )
      }

      return null
    },
    query: graphql`
      query ArtworkPrice_Test_Query {
        artwork(id: "artworkID") {
          ...ArtworkPrice_artwork
        }
        me {
          ...ArtworkPrice_me @arguments(artworkID: "artworkID")
        }
      }
    `,
  })

  describe("Auction bid info", () => {
    it("should be displayed", () => {
      renderWithRelay({ Artwork: () => ({ isInAuction: true }) })

      expect(screen.getByLabelText("Auction Bid Info")).toBeOnTheScreen()
    })

    it("should NOT be displayed for live sale in progress", () => {
      renderWithRelay(
        { Artwork: () => ({ isInAuction: true }) },
        { initialData: { auctionState: AuctionTimerState.LIVE_INTEGRATION_ONGOING } }
      )

      expect(screen.queryByLabelText("Auction Bid Info")).not.toBeOnTheScreen()
    })
  })

  describe("Exclude shipping and taxes label", () => {
    it("should NOT be displayed", () => {
      renderWithRelay({
        Artwork: () => ({
          isEligibleForOnPlatformTransaction: false,
          isInAuction: false,
          isPriceHidden: false,
        }),
      })

      expect(screen.queryByText("excl. Shipping and Taxes")).not.toBeOnTheScreen()
    })

    it("should NOT be displayed when artworks is in auction", () => {
      renderWithRelay({
        Artwork: () => ({
          isEligibleForOnPlatformTransaction: true,
          isInAuction: true,
          isPriceHidden: false,
        }),
      })

      expect(screen.queryByText("excl. Shipping and Taxes")).not.toBeOnTheScreen()
    })

    it("should NOT be displayed when price is hidden for artwork", () => {
      renderWithRelay({
        Artwork: () => ({
          isEligibleForOnPlatformTransaction: true,
          isInAuction: false,
          isPriceHidden: true,
        }),
      })

      expect(screen.queryByText("excl. Shipping and Taxes")).not.toBeOnTheScreen()
    })

    it("should be displayed when artworks is eligible for on-platform transaction", () => {
      renderWithRelay({
        Artwork: () => ({
          isEligibleForOnPlatformTransaction: true,
          isInAuction: false,
          isPriceHidden: false,
        }),
      })

      expect(screen.getByText("excl. Shipping and Taxes")).toBeOnTheScreen()
    })
  })

  it("should render the sale message of the selected edition set", () => {
    renderWithRelay(
      {
        Artwork: () => ({
          isInAuction: false,
          editionSets: [
            { internalID: "edition-set-one", saleMessage: "$1000" },
            { internalID: "edition-set-two", saleMessage: "$2000" },
          ],
        }),
      },
      { initialData: { selectedEditionId: "edition-set-one" } }
    )

    expect(screen.getByText("$1000")).toBeOnTheScreen()
  })

  it("should render the sale message", () => {
    renderWithRelay({ Artwork: () => ({ isInAuction: false, saleMessage: "$1000" }) })

    expect(screen.getByText("$1000")).toBeOnTheScreen()
  })

  describe("Partner Offer", () => {
    beforeEach(() => {
      __globalStoreTestUtils__?.injectFeatureFlags({ AREnablePartnerOfferV1Improvements: true })
    })

    it("should NOT render if there is not partner offers", () => {
      renderWithRelay({
        Artwork: () => ({ isInAuction: false }),
        Me: () => ({ partnerOffersConnection: { edges: [] } }),
      })

      expect(screen.queryByText("Limited-Time Offer")).not.toBeOnTheScreen()
    })

    it("should NOT render if the partner offer is not available", () => {
      renderWithRelay({
        Artwork: () => ({ isInAuction: false }),
        Me: () => ({ partnerOffersConnection: { edges: [{ node: unavailablePartnerOffer }] } }),
      })

      expect(screen.queryByText("Limited-Time Offer")).not.toBeOnTheScreen()
    })

    describe("when a Partner Offer is available", () => {
      it("should render the partner offer details", () => {
        renderWithRelay({
          Artwork: () => ({ isInAuction: false, isPriceHidden: false, saleMessage: "US$500" }),
          Me: () => ({ partnerOffersConnection: { edges: [{ node: testPartnerOffer }] } }),
        })

        expect(screen.getByText("Limited-Time Offer")).toBeOnTheScreen()
        expect(screen.getByText("$350")).toBeOnTheScreen()
        expect(screen.getByText("(List Price: US$500)")).toBeOnTheScreen()
      })

      it("should render 'Not publicly listed' if the artwork price is hidden", () => {
        renderWithRelay({
          Artwork: () => ({ isInAuction: false, isPriceHidden: true }),
          Me: () => ({ partnerOffersConnection: { edges: [{ node: testPartnerOffer }] } }),
        })

        expect(screen.getByText("(List Price: Not publicly listed)")).toBeOnTheScreen()
      })
    })
  })
})

const testPartnerOffer = {
  endAt: DateTime.now().toUTC().plus({ days: 3 }).toISO(),
  internalID: "partner-offer-id",
  isAvailable: true,
  priceWithDiscount: {
    display: "$350",
  },
}

const unavailablePartnerOffer = {
  ...testPartnerOffer,
  isAvailable: false,
}
