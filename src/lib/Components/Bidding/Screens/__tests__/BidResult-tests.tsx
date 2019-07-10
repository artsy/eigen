import { shallow } from "enzyme"
import React from "react"

import { NativeModules } from "react-native"

jest.mock("lib/NativeModules/SwitchBoard", () => ({
  dismissModalViewController: jest.fn(),
  presentModalViewController: jest.fn(),
}))
import SwitchBoard from "lib/NativeModules/SwitchBoard"

import { BidResult_sale_artwork } from "__generated__/BidResult_sale_artwork.graphql"
import * as renderer from "react-test-renderer"
import { BidGhostButton, Button } from "../../Components/Button"
import { BidderPositionResult } from "../../types"
import { BidResult } from "../BidResult"

import { BiddingThemeProvider } from "../../Components/BiddingThemeProvider"

const popToTop = jest.fn()
const mockNavigator = { popToTop }

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

describe("BidResult component", () => {
  Date.now = jest.fn(() => 1525983752116)
  jest.useFakeTimers()

  describe("high bidder", () => {
    // marking this as pending since this component depends on the Timer component that depends on local timezone
    xit("renders winning screen properly", () => {
      const component = renderer.create(
        <BiddingThemeProvider>
          <BidResult
            refreshBidderInfo={refreshBidderInfoMock}
            refreshSaleArtwork={refreshSaleArtworkInfoMock}
            bidderPositionResult={Statuses.winning}
            sale_artwork={saleArtwork}
            navigator={jest.fn() as any}
          />
        </BiddingThemeProvider>
      )

      expect(component.toJSON()).toMatchSnapshot()
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
      const bidResult = renderer.create(
        <BiddingThemeProvider>
          <BidResult
            refreshBidderInfo={refreshBidderInfoMock}
            refreshSaleArtwork={refreshSaleArtworkInfoMock}
            bidderPositionResult={Statuses.winning}
            sale_artwork={saleArtwork}
            navigator={jest.fn() as any}
          />
        </BiddingThemeProvider>
      )
      const mockDismiss = SwitchBoard.dismissModalViewController as jest.Mock<any>
      mockDismiss.mockReturnValueOnce(Promise.resolve())

      bidResult.root.findByType(BidGhostButton).instance.props.onPress()
      jest.runAllTicks()

      expect(SwitchBoard.dismissModalViewController).toHaveBeenCalled()
      expect(SwitchBoard.presentModalViewController).not.toHaveBeenCalled()
    })
  })

  describe("low bidder", () => {
    // marking this as pending since this component depends on the Timer component that depends on local timezone
    xit("renders properly", () => {
      const component = renderer.create(
        <BiddingThemeProvider>
          <BidResult
            refreshBidderInfo={refreshBidderInfoMock}
            refreshSaleArtwork={refreshSaleArtworkInfoMock}
            bidderPositionResult={Statuses.outbid}
            sale_artwork={saleArtwork}
            navigator={jest.fn() as any}
          />
        </BiddingThemeProvider>
      )

      expect(component.toJSON()).toMatchSnapshot()
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
      const bidResult = renderer.create(
        <BiddingThemeProvider>
          <BidResult
            refreshBidderInfo={refreshBidderInfoMock}
            refreshSaleArtwork={refreshSaleArtworkInfoMock}
            bidderPositionResult={Statuses.outbid}
            sale_artwork={saleArtwork}
            navigator={mockNavigator as any}
          />
        </BiddingThemeProvider>
      )

      bidResult.root.findByType(Button).instance.props.onPress()
      expect(refreshBidderInfoMock).toHaveBeenCalled()
      expect(refreshSaleArtworkInfoMock).toHaveBeenCalled()

      expect(popToTop).toHaveBeenCalled()
    })
  })

  describe("live bidding has started", () => {
    // marking this as pending since this component depends on the Timer component that depends on local timezone
    xit("renders properly", () => {
      const component = renderer.create(
        <BiddingThemeProvider>
          <BidResult
            refreshBidderInfo={refreshBidderInfoMock}
            refreshSaleArtwork={refreshSaleArtworkInfoMock}
            bidderPositionResult={Statuses.live_bidding_started}
            sale_artwork={saleArtwork}
            navigator={jest.fn() as any}
          />
        </BiddingThemeProvider>
      )

      expect(component.toJSON()).toMatchSnapshot()
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
      NativeModules.Emission = { predictionURL: "https://live-staging.artsy.net" }
      const bidResult = renderer.create(
        <BiddingThemeProvider>
          <BidResult
            refreshBidderInfo={refreshBidderInfoMock}
            refreshSaleArtwork={refreshSaleArtworkInfoMock}
            bidderPositionResult={Statuses.live_bidding_started}
            sale_artwork={saleArtwork}
            navigator={jest.fn() as any}
          />
        </BiddingThemeProvider>
      )
      const mockDismiss = SwitchBoard.dismissModalViewController as jest.Mock<any>
      mockDismiss.mockReturnValueOnce(Promise.resolve())

      bidResult.root.findByType(BidGhostButton).instance.props.onPress()
      jest.runAllTicks()

      expect(SwitchBoard.presentModalViewController).toHaveBeenCalledWith(
        expect.anything(),
        "https://live-staging.artsy.net/sale-id"
      )
    })
  })
})

const Statuses = {
  winning: {
    status: "WINNING",
    message_header: null,
    message_description_md: null,
    position: null,
  } as BidderPositionResult,
  outbid: {
    status: "OUTBID",
    message_header: "Your bid wasn’t high enough",
    message_description_md: `
      Another bidder placed a higher max bid or the same max bid before you did.
    `,
    position: null,
  } as BidderPositionResult,
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
