import { AuctionPriceTestsQuery$data } from "__generated__/AuctionPriceTestsQuery.graphql"
import {
  AuctionPreview,
  AuctionPreviewNoStartingBid,
  ClosedAuctionArtwork,
  LiveAuctionInProgeress,
  OpenAuctionNoReserveNoBids,
  OpenAuctionNoReserveWithBids,
  OpenAuctionReserveMetWithBids,
  OpenAuctionReserveMetWithMyLosingBid,
  OpenAuctionReserveMetWithMyWinningBid,
  OpenAuctionReserveNoBids,
  OpenAuctionReserveNotMetIncreasingOwnBid,
  OpenAuctionReserveNotMetWithBids,
} from "app/__fixtures__/ArtworkBidInfo"
import { AuctionTimerState } from "app/Components/Bidding/Components/Timer"
import { GlobalStoreProvider } from "app/store/GlobalStore"
import { renderRelayTree } from "app/tests/renderRelayTree"
import { CheckCircleIcon, CloseCircleIcon, Sans, Theme } from "palette"
import React from "react"
import { graphql } from "react-relay"
import { AuctionPriceFragmentContainer as AuctionPrice } from "./AuctionPrice"

jest.unmock("react-relay")

describe("AuctionPrice", () => {
  // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
  const getWrapper = async (response, auctionState: AuctionTimerState) => {
    return await renderRelayTree({
      Component: (props: any) => (
        <GlobalStoreProvider>
          <Theme>
            <AuctionPrice {...props} auctionState={auctionState} />
          </Theme>
        </GlobalStoreProvider>
      ),
      query: graphql`
        query AuctionPriceTestsQuery @raw_response_type {
          artwork(id: "auction_artwork_estimate_premium") {
            ...AuctionPrice_artwork
          }
        }
      `,
      mockData: {
        artwork: response,
      } as AuctionPriceTestsQuery$data,
    })
  }

  describe("for closed auction", () => {
    it("displays Auction Closed", async () => {
      const wrapper = await getWrapper(ClosedAuctionArtwork, AuctionTimerState.CLOSED)

      expect(wrapper.text()).toContain("Bidding closed")
    })
  })

  describe("for live sale in progress", () => {
    it("does not display anything", async () => {
      const wrapper = await getWrapper(
        LiveAuctionInProgeress,
        AuctionTimerState.LIVE_INTEGRATION_ONGOING
      )

      expect(wrapper.html()).toBe(null)
    })
  })

  describe("for auction preview", () => {
    it("displays proper starting bid info", async () => {
      const wrapper = await getWrapper(AuctionPreview, AuctionTimerState.PREVIEW)

      expect(wrapper.text()).toContain("Starting bid")
      expect(wrapper.text()).toContain("CHF 4,000")
    })
  })

  describe("for auction preview with no start bid set", () => {
    it("displays nothing if current bid info is unavailable", async () => {
      const wrapper = await getWrapper(AuctionPreviewNoStartingBid, AuctionTimerState.PREVIEW)
      expect(wrapper.html()).toBe(null)
    })
  })

  describe("for open auction with no reserve and no bids", () => {
    it("displays proper starting bid info", async () => {
      const wrapper = await getWrapper(OpenAuctionNoReserveNoBids, AuctionTimerState.CLOSING)

      expect(wrapper.text()).toContain("Starting bid")
      expect(wrapper.text()).toContain("$500")
    })
  })

  describe("open auction with no reserve with bids present", () => {
    it("displays proper current bid info including bid count", async () => {
      const wrapper = await getWrapper(OpenAuctionNoReserveWithBids, AuctionTimerState.CLOSING)
      // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
      const texts = wrapper.find(Sans).map((x) => x.text())

      expect(texts).toContain("Current bid")
      expect(texts).toContain("$850")
      expect(texts).toContain("11 bids")
    })
  })

  describe("for open auction with reserve and no bids", () => {
    it("displays proper starting bid info and resserve message", async () => {
      const wrapper = await getWrapper(OpenAuctionReserveNoBids, AuctionTimerState.CLOSING)
      // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
      const texts = wrapper.find(Sans).map((x) => x.text())

      expect(texts).toContain("Starting bid")
      expect(texts).toContain("This work has a reserve")
      expect(texts).toContain("$3,000")
    })
  })

  describe("for open auction with some bids and reserve not met", () => {
    it("displays current bid message inculding reserve warning", async () => {
      const wrapper = await getWrapper(OpenAuctionReserveNotMetWithBids, AuctionTimerState.CLOSING)
      // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
      const texts = wrapper.find(Sans).map((x) => x.text())

      expect(texts).toContain("Current bid")
      expect(texts).toContain("2 bids, reserve not met")
      expect(texts).toContain("$10,000")
    })
  })

  describe("for open auction with some bids and satisfied reserve", () => {
    it("displays current bid message inculding reserve met", async () => {
      const wrapper = await getWrapper(OpenAuctionReserveMetWithBids, AuctionTimerState.CLOSING)
      // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
      const texts = wrapper.find(Sans).map((x) => x.text())

      expect(texts).toContain("Current bid")
      expect(texts).toContain("2 bids, reserve met")
      expect(texts).toContain("$500")
    })
  })

  describe("for open auction with my bid winning", () => {
    it("displays max bid and winning indicator", async () => {
      const wrapper = await getWrapper(
        OpenAuctionReserveMetWithMyWinningBid,
        AuctionTimerState.CLOSING
      )
      // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
      const texts = wrapper.find(Sans).map((x) => x.text())

      expect(texts).toContain("Your max: $15,000")
      expect(wrapper.find(CheckCircleIcon).length).toBe(1)
    })
  })

  describe("for open auction with my bid losing", () => {
    it("displays max bid and losing indicator", async () => {
      const wrapper = await getWrapper(
        OpenAuctionReserveMetWithMyLosingBid,
        AuctionTimerState.CLOSING
      )
      // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
      const texts = wrapper.find(Sans).map((x) => x.text())

      expect(texts).toContain("Your max: $400")
      expect(wrapper.find(CloseCircleIcon).length).toBe(1)
    })
  })

  describe("for open auction with me increasing my max bid while winning", () => {
    it("displays max bid and winning indicator", async () => {
      const wrapper = await getWrapper(
        OpenAuctionReserveNotMetIncreasingOwnBid,
        AuctionTimerState.CLOSING
      )
      // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
      const texts = wrapper.find(Sans).map((x) => x.text())

      expect(texts).toContain("Your max: $15,000")
      expect(wrapper.find(CheckCircleIcon).length).toBe(1)
    })
  })
})
