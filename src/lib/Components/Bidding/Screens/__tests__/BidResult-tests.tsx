import { BidResult_sale_artwork } from "__generated__/BidResult_sale_artwork.graphql"
// @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
import { shallow } from "enzyme"
import { dismissModal, navigate } from "lib/navigation/navigate"
import { __globalStoreTestUtils__ } from "lib/store/GlobalStore"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import { Button } from "palette"
import React from "react"
import { BiddingThemeProvider } from "../../Components/BiddingThemeProvider"
import { BidderPositionResult } from "../../types"
import { BidResult } from "../BidResult"

const popToTopMock = jest.fn()
const refreshBidderInfoMock = jest.fn()
const refreshSaleArtworkInfoMock = jest.fn()

const saleArtwork: BidResult_sale_artwork = ({
  increments: [
    {
      display: "$10,000",
      cents: 1000000,
    },
    {
      display: "$11,000",
      cents: 1100000,
    },
    {
      display: "$12,000",
      cents: 1200000,
    },
    {
      display: "$13,000",
      cents: 1300000,
    },
    {
      display: "$14,000",
      cents: 1400000,
    },
  ],
  minimum_next_bid: {
    amount: "CHF10,000",
    cents: 1000000,
    display: "CHF 10,000",
  },
  sale: {
    live_start_at: "2022-01-01T00:03:00+00:00",
    end_at: "2022-05-01T00:03:00+00:00",
    slug: "sale-id",
  },
} as any) as BidResult_sale_artwork

const getNavMock = (params: object = {}) => ({
  navigation: {
    navigate: jest.fn(),
    goBack: jest.fn(),
    popToTop: popToTopMock,
  },
  route: {
    params,
  },
})

describe("BidResult component", () => {
  Date.now = jest.fn(() => 1525983752116)
  jest.useFakeTimers()

  describe("high bidder", () => {
    // marking this as pending since this component depends on the Timer component that depends on local timezone
    xit("renders winning screen properly", () => {
      renderWithWrappers(
        <BiddingThemeProvider>
          <BidResult
            sale_artwork={saleArtwork}
            {...(getNavMock({
              bidderPositionResult: Statuses.winning,
              refreshBidderInfo: refreshBidderInfoMock,
              refreshSaleArtwork: refreshSaleArtworkInfoMock,
            }) as any)}
          />
        </BiddingThemeProvider>
      )
    })

    it("renders a timer", () => {
      const component = shallow(
        <BidResult
          sale_artwork={saleArtwork}
          {...(getNavMock({
            bidderPositionResult: Statuses.winning,
            refreshBidderInfo: refreshBidderInfoMock,
            refreshSaleArtwork: refreshSaleArtworkInfoMock,
          }) as any)}
        />
      )

      expect(component.find("Timer")).toHaveLength(1)
    })

    it("dismisses the controller when the continue button is pressed", () => {
      const bidResult = renderWithWrappers(
        <BiddingThemeProvider>
          <BidResult
            sale_artwork={saleArtwork}
            {...(getNavMock({
              bidderPositionResult: Statuses.winning,
              refreshBidderInfo: refreshBidderInfoMock,
              refreshSaleArtwork: refreshSaleArtworkInfoMock,
            }) as any)}
          />
        </BiddingThemeProvider>
      )

      bidResult.root.findByType(Button).props.onPress()
      jest.runAllTicks()

      expect(dismissModal).toHaveBeenCalled()
      expect(navigate).not.toHaveBeenCalled()
    })
  })

  describe("low bidder", () => {
    // marking this as pending since this component depends on the Timer component that depends on local timezone
    xit("renders without throwing an error", () => {
      renderWithWrappers(
        <BiddingThemeProvider>
          <BidResult
            sale_artwork={saleArtwork}
            {...(getNavMock({
              bidderPositionResult: Statuses.outbid,
              refreshBidderInfo: refreshBidderInfoMock,
              refreshSaleArtwork: refreshSaleArtworkInfoMock,
            }) as any)}
          />
        </BiddingThemeProvider>
      )
    })

    it("renders timer and error message", () => {
      const component = shallow(
        <BidResult
          sale_artwork={saleArtwork}
          {...(getNavMock({
            bidderPositionResult: Statuses.outbid,
            refreshBidderInfo: refreshBidderInfoMock,
            refreshSaleArtwork: refreshSaleArtworkInfoMock,
          }) as any)}
        />
      )

      expect(component.find("Timer")).toHaveLength(1)
    })

    it("pops to root when bid-again button is pressed", () => {
      const bidResult = renderWithWrappers(
        <BiddingThemeProvider>
          <BidResult
            sale_artwork={saleArtwork}
            {...(getNavMock({
              bidderPositionResult: Statuses.outbid,
              refreshBidderInfo: refreshBidderInfoMock,
              refreshSaleArtwork: refreshSaleArtworkInfoMock,
            }) as any)}
          />
        </BiddingThemeProvider>
      )

      bidResult.root.findByType(Button).props.onPress()
      expect(refreshBidderInfoMock).toHaveBeenCalled()
      expect(refreshSaleArtworkInfoMock).toHaveBeenCalled()

      expect(popToTopMock).toHaveBeenCalled()
    })
  })

  describe("live bidding has started", () => {
    // marking this as pending since this component depends on the Timer component that depends on local timezone
    xit("renders without throwing an error", () => {
      renderWithWrappers(
        <BiddingThemeProvider>
          <BidResult
            sale_artwork={saleArtwork}
            {...(getNavMock({
              bidderPositionResult: Statuses.live_bidding_started,
              refreshBidderInfo: refreshBidderInfoMock,
              refreshSaleArtwork: refreshSaleArtworkInfoMock,
            }) as any)}
          />
        </BiddingThemeProvider>
      )
    })

    it("doesn't render timer", () => {
      const component = shallow(
        <BidResult
          sale_artwork={saleArtwork}
          {...(getNavMock({
            bidderPositionResult: Statuses.live_bidding_started,
            refreshBidderInfo: refreshBidderInfoMock,
            refreshSaleArtwork: refreshSaleArtworkInfoMock,
          }) as any)}
        />
      )

      expect(component.find("Timer")).toHaveLength(0)
    })

    it("dismisses controller and presents live interface when continue button is pressed", () => {
      __globalStoreTestUtils__?.injectState({
        native: { sessionState: { predictionURL: "https://live-staging.artsy.net" } },
      })
      const bidResult = renderWithWrappers(
        <BiddingThemeProvider>
          <BidResult
            sale_artwork={saleArtwork}
            {...(getNavMock({
              bidderPositionResult: Statuses.live_bidding_started,
              refreshBidderInfo: refreshBidderInfoMock,
              refreshSaleArtwork: refreshSaleArtworkInfoMock,
            }) as any)}
          />
        </BiddingThemeProvider>
      )

      bidResult.root.findByType(Button).props.onPress()
      jest.runAllTicks()

      expect(navigate).toHaveBeenCalledWith("https://live-staging.artsy.net/sale-id", { modal: true })
    })
  })
})

const Statuses = {
  // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
  winning: {
    status: "WINNING",
    message_header: null,
    message_description_md: null,
    position: null,
  } as BidderPositionResult,
  // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
  outbid: {
    status: "OUTBID",
    message_header: "Your bid wasn’t high enough",
    message_description_md: `
      Another bidder placed a higher max bid or the same max bid before you did.
    `,
    position: null,
  } as BidderPositionResult,
  // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
  live_bidding_started: {
    status: "LIVE_BIDDING_STARTED",
    message_header: "Live bidding has started",
    message_description_md: `
      Sorry, your bid wasn’t received before live bidding started.
      To continue bidding, please [join the live auction](http://live-staging.artsy.net/).
    `,
    position: null,
  } as BidderPositionResult,
}
