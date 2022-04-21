import { BidResult_sale_artwork } from "__generated__/BidResult_sale_artwork.graphql"
import { dismissModal, navigate } from "app/navigation/navigate"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { renderWithWrappers, renderWithWrappersTL } from "app/tests/renderWithWrappers"
// @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
import { shallow } from "enzyme"
import { Button } from "palette"
import React from "react"
import { BidderPositionResult } from "../types"
import { BidResult } from "./BidResult"

const popToTop = jest.fn()
const mockNavigator = { popToTop }

const refreshBidderInfoMock = jest.fn()
const refreshSaleArtworkInfoMock = jest.fn()

const saleArtwork: BidResult_sale_artwork = {
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
} as any as BidResult_sale_artwork

describe("BidResult component", () => {
  Date.now = jest.fn(() => 1525983752116)
  jest.useFakeTimers()

  describe("high bidder", () => {
    // marking this as pending since this component depends on the Timer component that depends on local timezone
    it("renders winning screen properly", () => {
      renderWithWrappers(
        <BidResult
          refreshBidderInfo={refreshBidderInfoMock}
          refreshSaleArtwork={refreshSaleArtworkInfoMock}
          bidderPositionResult={Statuses.winning}
          sale_artwork={saleArtwork}
          navigator={jest.fn() as any}
        />
      )
    })

    it("renders a timer", () => {
      const component = shallow(
        <BidResult
          refreshBidderInfo={refreshBidderInfoMock}
          refreshSaleArtwork={refreshSaleArtworkInfoMock}
          bidderPositionResult={Statuses.winning}
          sale_artwork={saleArtwork}
          navigator={jest.fn() as any}
        />
      )

      expect(component.find("Timer")).toHaveLength(1)
    })

    it("dismisses the controller when the continue button is pressed", () => {
      const bidResult = renderWithWrappers(
        <BidResult
          refreshBidderInfo={refreshBidderInfoMock}
          refreshSaleArtwork={refreshSaleArtworkInfoMock}
          bidderPositionResult={Statuses.winning}
          sale_artwork={saleArtwork}
          navigator={jest.fn() as any}
        />
      )

      bidResult.root.findByType(Button).props.onPress()
      jest.runAllTicks()

      expect(dismissModal).toHaveBeenCalled()
      expect(navigate).not.toHaveBeenCalled()
    })
  })

  describe("low bidder", () => {
    // marking this as pending since this component depends on the Timer component that depends on local timezone
    it("renders without throwing an error", () => {
      renderWithWrappers(
        <BidResult
          refreshBidderInfo={refreshBidderInfoMock}
          refreshSaleArtwork={refreshSaleArtworkInfoMock}
          bidderPositionResult={Statuses.outbid}
          sale_artwork={saleArtwork}
          navigator={jest.fn() as any}
        />
      )
    })

    it("renders timer and error message", () => {
      const component = shallow(
        <BidResult
          refreshBidderInfo={refreshBidderInfoMock}
          refreshSaleArtwork={refreshSaleArtworkInfoMock}
          bidderPositionResult={Statuses.outbid}
          sale_artwork={saleArtwork}
          navigator={jest.fn() as any}
        />
      )

      expect(component.find("Timer")).toHaveLength(1)
    })

    it("pops to root when bid-again button is pressed", () => {
      const bidResult = renderWithWrappers(
        <BidResult
          refreshBidderInfo={refreshBidderInfoMock}
          refreshSaleArtwork={refreshSaleArtworkInfoMock}
          bidderPositionResult={Statuses.outbid}
          sale_artwork={saleArtwork}
          navigator={mockNavigator as any}
        />
      )

      bidResult.root.findByType(Button).props.onPress()
      expect(refreshBidderInfoMock).toHaveBeenCalled()
      expect(refreshSaleArtworkInfoMock).toHaveBeenCalled()

      expect(popToTop).toHaveBeenCalled()
    })
  })

  describe("live bidding has started", () => {
    // marking this as pending since this component depends on the Timer component that depends on local timezone
    it("renders without throwing an error", () => {
      renderWithWrappers(
        <BidResult
          refreshBidderInfo={refreshBidderInfoMock}
          refreshSaleArtwork={refreshSaleArtworkInfoMock}
          bidderPositionResult={Statuses.live_bidding_started}
          sale_artwork={saleArtwork}
          navigator={jest.fn() as any}
        />
      )
    })

    it("doesn't render timer", () => {
      const component = shallow(
        <BidResult
          refreshBidderInfo={refreshBidderInfoMock}
          refreshSaleArtwork={refreshSaleArtworkInfoMock}
          bidderPositionResult={Statuses.live_bidding_started}
          sale_artwork={saleArtwork}
          navigator={jest.fn() as any}
        />
      )

      expect(component.find("Timer")).toHaveLength(0)
    })

    it("dismisses controller and presents live interface when continue button is pressed", () => {
      const bidResult = renderWithWrappers(
        <BidResult
          refreshBidderInfo={refreshBidderInfoMock}
          refreshSaleArtwork={refreshSaleArtworkInfoMock}
          bidderPositionResult={Statuses.live_bidding_started}
          sale_artwork={saleArtwork}
          navigator={jest.fn() as any}
        />
      )

      bidResult.root.findByType(Button).props.onPress()
      jest.runAllTicks()

      expect(navigate).toHaveBeenCalledWith("https://live-staging.artsy.net/sale-id", {
        modal: true,
      })
    })
  })

  describe("cascading end times", () => {
    describe("with cascading end times turned on", () => {
      beforeEach(() => {
        Date.now = () => 1525983752000 // Thursday, May 10, 2018 8:22:32.000 PM UTC in milliseconds
        __globalStoreTestUtils__?.injectFeatureFlags({ AREnableCascadingEndTimerLotPage: true })
      })

      it("shows the sale artwork's end time if the sale has cascading end times", () => {
        const { getByText } = renderWithWrappersTL(<BidResult {...propsForCascadingSale} />)
        // Today is May 10. Sale artwork's end time is May 13. Sale's end day is May 10.

        const timerText = getByText("03d 00h 00m 10s")
        expect(timerText).toBeTruthy()
      })

      it("shows the sale's end time if the sale does not have cascading end times", () => {
        const { getByText } = renderWithWrappersTL(<BidResult {...propsForNonCascadingSale} />)
        // Today is May 10. Sale artwork's end time is May 13. Sale's end day is May 10.
        const timerText = getByText("00d 00h 00m 10s")
        expect(timerText).toBeTruthy()
      })
    })

    describe("with cacsading end time feature disabled", () => {
      beforeEach(() => {
        __globalStoreTestUtils__?.injectFeatureFlags({ AREnableCascadingEndTimerLotPage: false })
      })
      it("shows the sale's end time", () => {
        const { getByText } = renderWithWrappersTL(<BidResult {...propsForCascadingSale} />)
        // Today is May 10. Sale artwork's end time is May 13. Sale's end day is May 10.
        const timerText = getByText("00d 00h 00m 10s")
        expect(timerText).toBeTruthy()
      })
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

const cascadingSaleArtwork: BidResult_sale_artwork = {
  endAt: "2018-05-13T20:22:42+00:00",
  sale: {
    liveStartAt: null,
    endAt: "2018-05-10T20:22:42+00:00",
    slug: "sale-id",
    cascadingEndTimeIntervalMinutes: 1,
  },
  // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
  " $refType": null, // needs this to keep TS happy
}

const nonCascadingSaleArtwork: BidResult_sale_artwork = {
  endAt: null,
  sale: {
    liveStartAt: null,
    endAt: "2018-05-10T20:22:42+00:00",
    slug: "sale-id",
    cascadingEndTimeIntervalMinutes: null,
  },
  // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
  " $refType": null, // needs this to keep TS happy
}

const propsForCascadingSale = {
  refreshBidderInfo: refreshBidderInfoMock,
  refreshSaleArtwork: refreshSaleArtworkInfoMock,
  bidderPositionResult: Statuses.outbid,
  sale_artwork: cascadingSaleArtwork,
  navigator: jest.fn() as any,
}

const propsForNonCascadingSale = {
  refreshBidderInfo: refreshBidderInfoMock,
  refreshSaleArtwork: refreshSaleArtworkInfoMock,
  bidderPositionResult: Statuses.outbid,
  sale_artwork: nonCascadingSaleArtwork,
  navigator: jest.fn() as any,
}
