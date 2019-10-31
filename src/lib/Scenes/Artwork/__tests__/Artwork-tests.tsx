import { Button, Sans } from "@artsy/palette"
import { mount } from "enzyme"
import {
  ArtworkFromLiveAuctionRegistrationClosed,
  ArtworkFromLiveAuctionRegistrationOpen,
  NotRegisteredToBid,
  RegisteredBidder,
} from "lib/__fixtures__/ArtworkBidAction"
import { ArtworkFixture } from "lib/__fixtures__/ArtworkFixture"
import { Countdown } from "lib/Components/Bidding/Components/Timer"
import { merge } from "lodash"
import React from "react"
import { RelayRefetchProp } from "react-relay"
import ReactTestRenderer from "react-test-renderer"
import { useTracking } from "react-tracking"
import { Artwork } from "../Artwork"
import { ArtworkHeader } from "../Components/ArtworkHeader"
import { BidButton } from "../Components/CommercialButtons/BidButton"
import { CommercialPartnerInformation } from "../Components/CommercialPartnerInformation"
import { ContextCard } from "../Components/ContextCard"

const trackEvent = jest.fn()

describe("Artwork", () => {
  beforeEach(() => {
    ;(useTracking as jest.Mock).mockImplementation(() => {
      return {
        trackEvent,
      }
    })
  })
  afterEach(() => {
    jest.clearAllMocks()
  })
  it("renders a snapshot", () => {
    const component = ReactTestRenderer.create(
      <Artwork isVisible artwork={ArtworkFixture as any} relay={{ environment: {} } as RelayRefetchProp} />
    )
    expect(component).toMatchSnapshot()
  })

  it("refetches on re-appear", () => {
    const refetchMock = jest.fn()
    const component = mount(
      <Artwork
        artwork={ArtworkFixture as any}
        relay={({ environment: {}, refetch: refetchMock } as unknown) as RelayRefetchProp}
        isVisible
      />
    )
    component.setProps({ isVisible: false })
    component.setProps({ isVisible: true })
    expect(refetchMock).toHaveBeenCalled()
  })

  it("does not show a contextCard if the work is in a non-auction sale", () => {
    const nonAuctionSaleArtwork = {
      ...ArtworkFixture,
      context: {
        __typename: "Sale",
        isAuction: false,
      },
    }

    const component = mount(
      <Artwork artwork={nonAuctionSaleArtwork as any} relay={{ environment: {} } as RelayRefetchProp} isVisible />
    )
    expect(component.find(ContextCard).length).toEqual(0)
  })

  it("does show a contextCard if the work is in an auction", () => {
    const auctionSaleArtwork = { ...ArtworkFixture, context: { __typename: "Sale", isAuction: true } }

    const component = mount(
      <Artwork artwork={auctionSaleArtwork as any} relay={{ environment: {} } as RelayRefetchProp} isVisible />
    )
    expect(component.find(ContextCard).length).toEqual(1)
  })

  describe("Live Auction States", () => {
    it("has the correct state for a work that is in an auction that is currently live, for which I am registered", () => {
      const liveAuctionArtwork = merge({}, ArtworkFixture, ArtworkFromLiveAuctionRegistrationClosed, RegisteredBidder)
      const component = mount(
        <Artwork artwork={liveAuctionArtwork as any} relay={{ environment: {} } as RelayRefetchProp} isVisible />
      )
      expect(component.find(CommercialPartnerInformation).length).toEqual(0)
      expect(component.find(Countdown).length).toEqual(1)
      expect(
        component
          .find(Countdown)
          .find(Sans)
          .at(1)
          .text()
      ).toContain("In progress")
      expect(component.find(BidButton).text()).toContain("Enter live bidding")
    })

    it("has the correct state for a work that is in an auction that is currently live, for which I am not registered and registration is open", () => {
      const liveAuctionArtwork = merge({}, ArtworkFixture, ArtworkFromLiveAuctionRegistrationClosed, NotRegisteredToBid)
      const component = mount(
        <Artwork artwork={liveAuctionArtwork as any} relay={{ environment: {} } as RelayRefetchProp} isVisible />
      )
      expect(component.find(CommercialPartnerInformation).length).toEqual(0)
      expect(component.find(Countdown).length).toEqual(1)
      expect(
        component
          .find(Countdown)
          .find(Sans)
          .at(1)
          .text()
      ).toContain("In progress")
      expect(
        component
          .find(BidButton)
          .find(Button)
          .text()
      ).toContain("Watch live bidding")
      expect(
        component
          .find(BidButton)
          .find(Sans)
          .at(0)
          .text()
      ).toContain("Registration closed")
    })

    it("has the correct state for a work that is in an auction that is currently live, for which I am not registered and registration is closed", () => {
      const liveAuctionArtwork = merge({}, ArtworkFixture, ArtworkFromLiveAuctionRegistrationOpen, NotRegisteredToBid)
      const component = mount(
        <Artwork artwork={liveAuctionArtwork as any} relay={{ environment: {} } as RelayRefetchProp} isVisible />
      )
      expect(component.find(CommercialPartnerInformation).length).toEqual(0)
      expect(component.find(Countdown).length).toEqual(1)
      expect(
        component
          .find(Countdown)
          .find(Sans)
          .at(1)
          .text()
      ).toContain("In progress")
      expect(
        component
          .find(Countdown)
          .find(Sans)
          .at(0)
          .text()
      ).toContain("00d  00h  00m  00s")
      expect(component.find(BidButton).text()).toContain("Enter live bidding")
    })
  })
})
