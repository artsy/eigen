import {
  BidButtonTestsQuery,
  BidButtonTestsQuery$data,
} from "__generated__/BidButtonTestsQuery.graphql"
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
} from "app/__fixtures__/ArtworkBidAction"
import { AuctionTimerState } from "app/Components/Bidding/Components/Timer"
import { renderRelayTree } from "app/tests/renderRelayTree"
import { merge as _merge } from "lodash"
import { Settings } from "luxon"
import { Button, Theme } from "palette"
import React from "react"
import { View } from "react-native"
import { graphql } from "react-relay"

import { GlobalStoreProvider } from "app/store/GlobalStore"
import { BidButtonFragmentContainer as BidButton } from "./BidButton"

jest.unmock("react-relay")

const merge: (...args: object[]) => any = _merge

const realNow = Settings.now
const realDefaultZone = Settings.defaultZone

const meFixture: BidButtonTestsQuery["rawResponse"]["me"] = {
  id: "id",
  identityVerified: false,
}

describe("BidButton", () => {
  beforeAll(() => {
    Settings.defaultZone = "America/New_York"
    Settings.now = () => new Date("2019-08-15T12:00:00+00:00").valueOf()
  })

  afterAll(() => {
    Settings.now = realNow
    Settings.defaultZone = realDefaultZone
  })

  // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
  const getWrapper = async (artwork, me, auctionState) => {
    return await renderRelayTree({
      Component: (props: any) => (
        <GlobalStoreProvider>
          <Theme>
            <View>
              <BidButton {...props} auctionState={auctionState} />
            </View>
          </Theme>
        </GlobalStoreProvider>
      ),
      query: graphql`
        query BidButtonTestsQuery @raw_response_type {
          artwork(id: "auction_artwork") {
            ...BidButton_artwork
          }
          me {
            ...BidButton_me
          }
        }
      `,
      mockData: { artwork, me } as BidButtonTestsQuery$data,
    })
  }

  describe("for closed auction", () => {
    it("does not display anything", async () => {
      const wrapper = await getWrapper(ArtworkFromClosedAuction, meFixture, "hasEnded")

      expect(wrapper.text()).toBe("")
    })
  })

  describe("for auction preview", () => {
    it("and not registered bidder", async () => {
      const wrapper = await getWrapper(
        ArtworkFromAuctionPreview,
        meFixture,
        AuctionTimerState.PREVIEW
      )

      expect(wrapper.text()).toContain("Register to bid")
    })

    it("displays 'Identity verification is required' if the sale requires identity verification but the user is not verified", async () => {
      const artworkWithIDVRequired = merge({}, ArtworkFromAuctionPreview, {
        sale: { requireIdentityVerification: true },
      })
      const me = { identityVerified: false }

      const wrapper = await getWrapper(artworkWithIDVRequired, me, AuctionTimerState.PREVIEW)

      expect(wrapper.text()).toContain("Register to bid")
      expect(wrapper.text()).toContain("Identity verification required to bid.")
    })

    it("does not display 'Identity verification is required' if the sale requires identity verification and the user is verified", async () => {
      const artworkWithIDVRequired = merge({}, ArtworkFromAuctionPreview, {
        sale: { requireIdentityVerification: true },
      })
      const me = { identityVerified: true }

      const wrapper = await getWrapper(artworkWithIDVRequired, me, AuctionTimerState.PREVIEW)

      expect(wrapper.text()).toContain("Register to bid")
      expect(wrapper.text()).not.toContain("Identity verification required to bid.")
    })

    it("with bidder registration pending approval", async () => {
      const artwork = merge({}, ArtworkFromAuctionPreview, BidderPendingApproval)
      const wrapper = await getWrapper(artwork, meFixture, AuctionTimerState.PREVIEW)

      expect(wrapper.text()).toContain("Registration pending")
    })

    it("displays 'Identity verification is required' if the sale requires identity verification and the user is registered but not verified", async () => {
      const artworkWithIDVRequired = merge({}, ArtworkFromAuctionPreview, BidderPendingApproval, {
        sale: { requireIdentityVerification: true },
      })
      const me = { identityVerified: false }

      const wrapper = await getWrapper(artworkWithIDVRequired, me, AuctionTimerState.PREVIEW)

      expect(wrapper.text()).toContain("Registration pending")
      expect(wrapper.text()).toContain("Identity verification required to bid.")
    })

    it("does not display 'Identity verification is required' if the sale requires identity verification and the user is registered and verified", async () => {
      const artworkWithIDVRequired = merge({}, ArtworkFromAuctionPreview, BidderPendingApproval, {
        sale: { requireIdentityVerification: true },
      })
      const me = { identityVerified: true }

      const wrapper = await getWrapper(artworkWithIDVRequired, me, AuctionTimerState.PREVIEW)

      expect(wrapper.text()).toContain("Registration pending")
      expect(wrapper.text()).not.toContain("Identity verification required to bid.")
    })

    it("with registered bidder", async () => {
      const artwork = merge({}, ArtworkFromAuctionPreview, RegisteredBidder)
      const wrapper = await getWrapper(artwork, meFixture, AuctionTimerState.PREVIEW)

      expect(wrapper.text()).toContain("Registration complete")
    })
  })

  describe("for open, timed auction", () => {
    it("with open registration and not registered bidder ", async () => {
      const artwork = merge({}, ArtworkFromTimedAuctionRegistrationOpen, NotRegisteredToBid)
      const wrapper = await getWrapper(artwork, meFixture, AuctionTimerState.CLOSING)

      expect(wrapper.text()).toContain("Bid")
    })

    it("with closed registration and not registered bidder ", async () => {
      const artwork = merge({}, ArtworkFromTimedAuctionRegistrationClosed, NotRegisteredToBid)
      const wrapper = await getWrapper(artwork, meFixture, AuctionTimerState.CLOSING)

      expect(wrapper.text()).toContain("Registration closed")
    })

    it("with bidder registration pending approval", async () => {
      const artwork = merge({}, ArtworkFromTimedAuctionRegistrationOpen, BidderPendingApproval)
      const wrapper = await getWrapper(artwork, meFixture, AuctionTimerState.CLOSING)

      expect(wrapper.text()).toContain("Registration pending")
    })

    it("with registered bidder", async () => {
      const artwork = merge({}, ArtworkFromTimedAuctionRegistrationOpen, RegisteredBidder)
      const wrapper = await getWrapper(artwork, meFixture, AuctionTimerState.CLOSING)

      expect(wrapper.text()).toContain("Bid")
    })

    it("with registered bidder with bids", async () => {
      const artwork = merge({}, ArtworkFromTimedAuctionRegistrationOpen, RegistedBidderWithBids)
      const wrapper = await getWrapper(artwork, meFixture, AuctionTimerState.CLOSING)

      expect(wrapper.text()).toContain("Increase max bid")
    })

    describe("and sale requires identity verification", () => {
      const lotWithIDVRequired = merge({}, ArtworkFromTimedAuctionRegistrationOpen, {
        sale: { requireIdentityVerification: true },
      })

      it("displays 'Register to bid' if the user is not verified", async () => {
        const me = { identityVerified: false }

        const wrapper = await getWrapper(lotWithIDVRequired, me, AuctionTimerState.CLOSING)

        expect(wrapper.text()).toContain("Register to bid")
        expect(wrapper.text()).toContain("Identity verification required to bid.")
      })

      it("displays 'Bid' if the user is verified", async () => {
        const me = { identityVerified: true }

        const wrapper = await getWrapper(lotWithIDVRequired, me, AuctionTimerState.CLOSING)

        expect(wrapper.text()).toContain("Bid")
        expect(wrapper.text()).not.toContain("Identity verification required to bid.")
      })

      it("displays 'Bid' if the user is not verified but manually approved", async () => {
        const me = { identityVerified: false }

        const wrapper = await getWrapper(
          merge(lotWithIDVRequired, {
            sale: {
              registrationStatus: {
                qualifiedForBidding: true,
              },
            },
          }),
          me,
          AuctionTimerState.CLOSING
        )

        expect(wrapper.text()).toContain("Bid")
        expect(wrapper.text()).not.toContain("Identity verification required to bid.")
      })
    })
  })

  describe("for open, live auction during pre-bidding", () => {
    it("with open registration and not registered bidder ", async () => {
      const artwork = merge({}, ArtworkFromTimedAuctionRegistrationOpen, NotRegisteredToBid)
      const wrapper = await getWrapper(
        artwork,
        meFixture,
        AuctionTimerState.LIVE_INTEGRATION_UPCOMING
      )

      expect(wrapper.text()).toContain("Bid")
    })

    it("with closed registration and not registered bidder ", async () => {
      const artwork = merge({}, ArtworkFromTimedAuctionRegistrationClosed, NotRegisteredToBid)
      const wrapper = await getWrapper(
        artwork,
        meFixture,
        AuctionTimerState.LIVE_INTEGRATION_UPCOMING
      )

      expect(wrapper.text()).toContain("Registration closed")
    })

    it("with bidder registration pending approval", async () => {
      const artwork = merge({}, ArtworkFromTimedAuctionRegistrationOpen, BidderPendingApproval)
      const wrapper = await getWrapper(
        artwork,
        meFixture,
        AuctionTimerState.LIVE_INTEGRATION_UPCOMING
      )

      expect(wrapper.text()).toContain("Registration pending")
    })

    it("with registered bidder", async () => {
      const artwork = merge({}, ArtworkFromTimedAuctionRegistrationOpen, RegisteredBidder)
      const wrapper = await getWrapper(
        artwork,
        meFixture,
        AuctionTimerState.LIVE_INTEGRATION_UPCOMING
      )

      expect(wrapper.text()).toContain("Bid")
    })

    it("with registered bidder with bids", async () => {
      const artwork = merge({}, ArtworkFromTimedAuctionRegistrationOpen, RegistedBidderWithBids)
      const wrapper = await getWrapper(
        artwork,
        meFixture,
        AuctionTimerState.LIVE_INTEGRATION_UPCOMING
      )

      expect(wrapper.text()).toContain("Increase max bid")
    })

    describe("and sale requires identity verification", () => {
      const lotWithIDVRequired = merge({}, ArtworkFromTimedAuctionRegistrationOpen, {
        sale: { requireIdentityVerification: true },
      })

      it("displays 'Register to bid' if the user is not verified", async () => {
        const me = { identityVerified: false }

        const wrapper = await getWrapper(
          lotWithIDVRequired,
          me,
          AuctionTimerState.LIVE_INTEGRATION_UPCOMING
        )

        expect(wrapper.text()).toContain("Register to bid")
        expect(wrapper.text()).toContain("Identity verification required to bid.")
      })

      it("displays 'Bid' if the user is verified", async () => {
        const me = { identityVerified: true }

        const wrapper = await getWrapper(
          lotWithIDVRequired,
          me,
          AuctionTimerState.LIVE_INTEGRATION_UPCOMING
        )

        expect(wrapper.text()).toContain("Bid")
        expect(wrapper.text()).not.toContain("Identity verification required to bid.")
      })

      it("displays 'Bid' if the user is not verified but manually approved", async () => {
        const me = { identityVerified: false }

        const wrapper = await getWrapper(
          merge(lotWithIDVRequired, {
            sale: {
              registrationStatus: {
                qualifiedForBidding: true,
              },
            },
          }),
          me,
          AuctionTimerState.LIVE_INTEGRATION_UPCOMING
        )

        expect(wrapper.text()).toContain("Bid")
        expect(wrapper.text()).not.toContain("Identity verification required to bid.")
      })
    })
  })

  describe("for live auction", () => {
    it("with open registration and not registered bidder ", async () => {
      const artwork = merge({}, ArtworkFromLiveAuctionRegistrationOpen, NotRegisteredToBid)
      const wrapper = await getWrapper(
        artwork,
        meFixture,
        AuctionTimerState.LIVE_INTEGRATION_ONGOING
      )

      expect(wrapper.find(Button).text()).toContain("Enter live bidding")
    })

    it("with closed registration and not registered bidder ", async () => {
      const artwork = merge({}, ArtworkFromLiveAuctionRegistrationClosed, NotRegisteredToBid)
      const wrapper = await getWrapper(
        artwork,
        meFixture,
        AuctionTimerState.LIVE_INTEGRATION_ONGOING
      )

      expect(wrapper.text()).toContain("Registration closed")
      expect(wrapper.find(Button).text()).toContain("Watch live bidding")
    })

    it("with bidder registration pending approval", async () => {
      const artwork = merge({}, ArtworkFromLiveAuctionRegistrationOpen, BidderPendingApproval)
      const wrapper = await getWrapper(
        artwork,
        meFixture,
        AuctionTimerState.LIVE_INTEGRATION_ONGOING
      )

      expect(wrapper.find(Button).text()).toContain("Enter live bidding")
    })

    it("with registered bidder", async () => {
      const artwork = merge({}, ArtworkFromLiveAuctionRegistrationOpen, RegisteredBidder)
      const wrapper = await getWrapper(
        artwork,
        meFixture,
        AuctionTimerState.LIVE_INTEGRATION_ONGOING
      )

      expect(wrapper.find(Button).text()).toContain("Enter live bidding")
    })
  })
})
