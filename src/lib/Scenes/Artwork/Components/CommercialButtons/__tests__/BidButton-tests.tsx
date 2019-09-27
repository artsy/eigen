import { Button, Theme } from "@artsy/palette"
import { BidButtonTestsQueryRawResponse } from "__generated__/BidButtonTestsQuery.graphql"
import {
  ArtworkFromAuctionPreview,
  ArtworkFromClosedAuction,
  ArtworkFromLiveAuctionRegistrationClosed,
  ArtworkFromLiveAuctionRegistrationOpen,
  ArtworkFromTimedAuctionRegistrationClosed,
  ArtworkFromTimedAuctionRegistrationOpen,
  BidderPendingApproval,
  NotRegisteredToBid,
  RegistedBidderWithBids,
  RegisteredBidder,
} from "lib/__fixtures__/ArtworkBidAction"
import { renderRelayTree } from "lib/tests/renderRelayTree"
import { merge as _merge } from "lodash"
import { Settings } from "luxon"
import React from "react"
import { graphql } from "react-relay"
import { AuctionState } from "../../CommercialInformation"
import { BidButtonFragmentContainer as BidButton } from "../BidButton"

jest.unmock("react-relay")

const merge: (...args: object[]) => any = _merge

const realNow = Settings.now
const realDefaultZone = Settings.defaultZoneName

describe("BidButton", () => {
  beforeAll(() => {
    Settings.defaultZoneName = "America/New_York"
    Settings.now = () => new Date("2019-08-15T12:00:00+00:00").valueOf()
  })

  afterAll(() => {
    Settings.now = realNow
    Settings.defaultZoneName = realDefaultZone
  })

  const getWrapper = async (response, auctionState: AuctionState) => {
    return await renderRelayTree({
      Component: (props: any) => (
        <Theme>
          <BidButton {...props} auctionState={auctionState} />
        </Theme>
      ),
      query: graphql`
        query BidButtonTestsQuery @raw_response_type {
          artwork(id: "auction_artwork") {
            ...BidButton_artwork
          }
        }
      `,
      mockResolvers: {
        Artwork: () => response,
      } as BidButtonTestsQueryRawResponse,
    })
  }

  describe("for closed auction", () => {
    it("does not display anything", async () => {
      const wrapper = await getWrapper(ArtworkFromClosedAuction, "hasEnded")

      expect(wrapper.html()).toBe(null)
    })
  })

  describe("for auction preview", () => {
    it("and not registered bidder", async () => {
      const wrapper = await getWrapper(ArtworkFromAuctionPreview, "isPreview")

      expect(wrapper.text()).toContain("Register to bid")
    })

    it("with bidder registration pending approval", async () => {
      const artwork = merge({}, ArtworkFromAuctionPreview, BidderPendingApproval)
      const wrapper = await getWrapper(artwork, "isPreview")

      expect(wrapper.text()).toContain("Registration pending")
    })

    it("with registered bidder", async () => {
      const artwork = merge({}, ArtworkFromAuctionPreview, RegisteredBidder)
      const wrapper = await getWrapper(artwork, "isPreview")

      expect(wrapper.text()).toContain("Registration complete")
    })
  })

  describe("for open auction", () => {
    it("with open registration and not registered bidder ", async () => {
      const artwork = merge({}, ArtworkFromTimedAuctionRegistrationOpen, NotRegisteredToBid)
      const wrapper = await getWrapper(artwork, "hasStarted")

      expect(wrapper.text()).toContain("Bid")
    })

    it("with closed registration and not registered bidder ", async () => {
      const artwork = merge({}, ArtworkFromTimedAuctionRegistrationClosed, NotRegisteredToBid)
      const wrapper = await getWrapper(artwork, "hasStarted")

      expect(wrapper.text()).toContain("Registration closed")
    })

    it("with bidder registration pending approval", async () => {
      const artwork = merge({}, ArtworkFromTimedAuctionRegistrationOpen, BidderPendingApproval)
      const wrapper = await getWrapper(artwork, "hasStarted")

      expect(wrapper.text()).toContain("Registration pending")
    })

    it("with registered bidder", async () => {
      const artwork = merge({}, ArtworkFromTimedAuctionRegistrationOpen, RegisteredBidder)
      const wrapper = await getWrapper(artwork, "hasStarted")

      expect(wrapper.text()).toContain("Bid")
    })

    it("with registered bidder with bids", async () => {
      const artwork = merge({}, ArtworkFromTimedAuctionRegistrationOpen, RegistedBidderWithBids)
      const wrapper = await getWrapper(artwork, "hasStarted")

      expect(wrapper.text()).toContain("Increase max bid")
    })
  })

  describe("for live auction", () => {
    it("with open registration and not registered bidder ", async () => {
      const artwork = merge({}, ArtworkFromLiveAuctionRegistrationOpen, NotRegisteredToBid)
      const wrapper = await getWrapper(artwork, "isLive")

      expect(wrapper.find(Button).text()).toContain("Enter live bidding")
    })

    it("with closed registration and not registered bidder ", async () => {
      const artwork = merge({}, ArtworkFromLiveAuctionRegistrationClosed, NotRegisteredToBid)
      const wrapper = await getWrapper(artwork, "isLive")

      expect(wrapper.text()).toContain("Registration closed")
      expect(wrapper.find(Button).text()).toContain("Watch live bidding")
    })

    it("with bidder registration pending approval", async () => {
      const artwork = merge({}, ArtworkFromLiveAuctionRegistrationOpen, BidderPendingApproval)
      const wrapper = await getWrapper(artwork, "isLive")

      expect(wrapper.find(Button).text()).toContain("Enter live bidding")
    })

    it("with registered bidder", async () => {
      const artwork = merge({}, ArtworkFromLiveAuctionRegistrationOpen, RegisteredBidder)
      const wrapper = await getWrapper(artwork, "isLive")

      expect(wrapper.find(Button).text()).toContain("Enter live bidding")
    })
  })
})
