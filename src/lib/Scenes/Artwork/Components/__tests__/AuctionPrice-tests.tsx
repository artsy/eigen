import { CheckCircleIcon, CloseCircleIcon, Sans, Theme } from "@artsy/palette"
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
} from "lib/__fixtures__/ArtworkBidInfo"
import { renderRelayTree } from "lib/tests/renderRelayTree"
import React from "react"
import { graphql } from "react-relay"
import { AuctionPriceFragmentContainer as AuctionPrice } from "../AuctionPrice"

jest.unmock("react-relay")

describe("AuctionPrice", () => {
  const getWrapper = async response => {
    return await renderRelayTree({
      Component: (props: any) => (
        <Theme>
          <AuctionPrice {...props} />
        </Theme>
      ),
      query: graphql`
        query AuctionPriceTestsQuery {
          artwork(id: "auction_artwork_estimate_premium") {
            ...AuctionPrice_artwork
          }
        }
      `,
      mockResolvers: {
        Artwork: () => response,
      },
    })
  }

  describe("for closed auction", () => {
    it("displays Auction Closed", async () => {
      const wrapper = await getWrapper(ClosedAuctionArtwork)

      expect(wrapper.text()).toContain("Bidding closed")
    })
  })

  describe("for live sale in progress", () => {
    it("does not display anything", async () => {
      const wrapper = await getWrapper(LiveAuctionInProgeress)

      expect(wrapper.html()).toBe(null)
    })
  })

  describe("for auction preview", () => {
    it("displays proper starting bid info", async () => {
      const wrapper = await getWrapper(AuctionPreview)

      expect(wrapper.text()).toContain("Starting bid")
      expect(wrapper.text()).toContain("CHF 4,000")
    })
  })

  describe("for auction preview with no start bid set", () => {
    it("displays nothing if current bid info is unavailable", async () => {
      const wrapper = await getWrapper(AuctionPreviewNoStartingBid)
      expect(wrapper.html()).toBe(null)
    })
  })

  describe("for open auction with no reserve and no bids", () => {
    it("displays proper starting bid info", async () => {
      const wrapper = await getWrapper(OpenAuctionNoReserveNoBids)

      expect(wrapper.text()).toContain("Starting bid")
      expect(wrapper.text()).toContain("$500")
    })
  })

  describe("open auction with no reserve with bids present", () => {
    it("displays proper current bid info including bid count", async () => {
      const wrapper = await getWrapper(OpenAuctionNoReserveWithBids)

      expect(
        wrapper
          .find(Sans)
          .at(0)
          .text()
      ).toContain("Current bid")
      expect(
        wrapper
          .find(Sans)
          .at(1)
          .text()
      ).toContain("$850")
      expect(
        wrapper
          .find(Sans)
          .at(2)
          .text()
      ).toContain("11 bids")
    })
  })

  describe("for open auction with reserve and no bids", () => {
    it("displays proper starting bid info and resserve message", async () => {
      const wrapper = await getWrapper(OpenAuctionReserveNoBids)

      expect(
        wrapper
          .find(Sans)
          .at(0)
          .text()
      ).toContain("Starting bid")
      expect(
        wrapper
          .find(Sans)
          .at(2)
          .text()
      ).toContain("This work has a reserve.")
      expect(
        wrapper
          .find(Sans)
          .at(1)
          .text()
      ).toContain("$3,000")
    })
  })

  describe("for open auction with some bids and reserve not met", () => {
    it("displays current bid message inculding reserve warning", async () => {
      const wrapper = await getWrapper(OpenAuctionReserveNotMetWithBids)

      expect(
        wrapper
          .find(Sans)
          .at(0)
          .text()
      ).toContain("Current bid")
      expect(
        wrapper
          .find(Sans)
          .at(2)
          .text()
      ).toContain("2 bids, reserve not met.")
      expect(
        wrapper
          .find(Sans)
          .at(1)
          .text()
      ).toContain("$10,000")
    })
  })

  describe("for open auction with some bids and satisfied reserve", () => {
    it("displays current bid message inculding reserve met", async () => {
      const wrapper = await getWrapper(OpenAuctionReserveMetWithBids)

      expect(
        wrapper
          .find(Sans)
          .at(0)
          .text()
      ).toContain("Current bid")
      expect(
        wrapper
          .find(Sans)
          .at(2)
          .text()
      ).toContain("2 bids, reserve met.")
      expect(
        wrapper
          .find(Sans)
          .at(1)
          .text()
      ).toContain("$500")
    })
  })

  describe("for open auction with my bid winning", () => {
    it("displays max bid and winning indicator", async () => {
      const wrapper = await getWrapper(OpenAuctionReserveMetWithMyWinningBid)

      expect(
        wrapper
          .find(Sans)
          .at(3)
          .text()
      ).toContain("Your max: $15,000")
      expect(wrapper.find(CheckCircleIcon).length).toBe(1)
    })
  })

  describe("for open auction with my bid losing", () => {
    it("displays max bid and losing indicator", async () => {
      const wrapper = await getWrapper(OpenAuctionReserveMetWithMyLosingBid)

      expect(
        wrapper
          .find(Sans)
          .at(3)
          .text()
      ).toContain("Your max: $400")
      expect(wrapper.find(CloseCircleIcon).length).toBe(1)
    })
  })

  describe("for open auction with me increasing my max bid while winning", () => {
    it("displays max bid and winning indicator", async () => {
      const wrapper = await getWrapper(OpenAuctionReserveNotMetIncreasingOwnBid)

      expect(
        wrapper
          .find(Sans)
          .at(3)
          .text()
      ).toContain("Your max: $15,000")
      expect(wrapper.find(CheckCircleIcon).length).toBe(1)
    })
  })
})
