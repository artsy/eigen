import { shallow } from "enzyme"
import React from "react"
import "react-native"

jest.mock("lib/NativeModules/SwitchBoard", () => ({
  dismissModalViewController: jest.fn(),
  presentModalViewController: jest.fn(),
}))
import SwitchBoard from "lib/NativeModules/SwitchBoard"

import * as renderer from "react-test-renderer"
import { BidGhostButton, Button } from "../../Components/Button"
import { BidResult } from "../BidResult"

const popToTop = jest.fn()
const mockNavigator = { popToTop }

const saleArtwork = {
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
    id: "sale-id",
  },
}
const bid = {
  display: "$11,000",
  cents: 1100000,
}

describe("BidResult component", () => {
  Date.now = jest.fn(() => 1525983752116)
  jest.useFakeTimers()

  describe("high bidder", () => {
    // marking this as pending since this component depends on the Timer component that depends on local timezone
    xit("renders winning screen properly", () => {
      const component = renderer.create(
        <BidResult winning status={"SUCCESS"} sale_artwork={saleArtwork} bid={bid} navigator={jest.fn() as any} />
      )

      expect(component.toJSON()).toMatchSnapshot()
    })

    it("renders a timer", () => {
      const component = shallow(
        <BidResult winning status={"SUCCESS"} sale_artwork={saleArtwork} bid={bid} navigator={jest.fn() as any} />
      )

      expect(component.find("Timer")).toHaveLength(1)
    })

    it("dismisses the controller when the continue button is pressed", () => {
      const bidResult = renderer.create(
        <BidResult winning status={"SUCCESS"} sale_artwork={saleArtwork} bid={bid} navigator={jest.fn() as any} />
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
    const messageHeader = "Your bid wasn’t high enough"
    const messageDescriptionMd =
      "Another bidder placed a higher max bid or the same max bid before you did.  \
 Bid again to take the lead."

    // marking this as pending since this component depends on the Timer component that depends on local timezone
    xit("renders properly", () => {
      const component = renderer.create(
        <BidResult
          winning={false}
          sale_artwork={saleArtwork}
          status="OUTBID"
          bid={bid}
          message_header={messageHeader}
          message_description_md={messageDescriptionMd}
          navigator={jest.fn() as any}
        />
      )

      expect(component.toJSON()).toMatchSnapshot()
    })

    it("renders timer and error message", () => {
      const component = shallow(
        <BidResult
          winning={false}
          sale_artwork={saleArtwork}
          status="OUTBID"
          bid={bid}
          message_header={messageHeader}
          message_description_md={messageDescriptionMd}
          navigator={jest.fn() as any}
        />
      )

      expect(component.find("Timer")).toHaveLength(1)
    })

    it("pops to root when bid-again button is pressed", () => {
      const bidResult = renderer.create(
        <BidResult
          winning={false}
          sale_artwork={saleArtwork}
          status="OUTBID"
          bid={bid}
          message_header={messageHeader}
          message_description_md={messageDescriptionMd}
          navigator={mockNavigator as any}
        />
      )

      bidResult.root.findByType(Button).instance.props.onPress()

      expect(popToTop).toHaveBeenCalled()
    })
  })

  describe("live bidding has started", () => {
    const status = "LIVE_BIDDING_STARTED"
    const messageHeader = "Live bidding has started"
    const messageDescriptionMd = `Sorry, your bid wasn’t received before live bidding started. \
To continue bidding, please [join the live auction](http://live-staging.artsy.net/).`

    // marking this as pending since this component depends on the Timer component that depends on local timezone
    xit("renders properly", () => {
      const component = renderer.create(
        <BidResult
          winning={false}
          sale_artwork={saleArtwork}
          status={status}
          bid={bid}
          message_header={messageHeader}
          message_description_md={messageDescriptionMd}
          navigator={jest.fn() as any}
        />
      )

      expect(component.toJSON()).toMatchSnapshot()
    })

    it("doesn't render timer", () => {
      const component = shallow(
        <BidResult
          winning={false}
          sale_artwork={saleArtwork}
          status={status}
          bid={bid}
          message_header={messageHeader}
          message_description_md={messageDescriptionMd}
          navigator={jest.fn() as any}
        />
      )

      expect(component.find("Timer")).toHaveLength(0)
    })

    it("dismisses controller and presents live interface when continue button is pressed", () => {
      const bidResult = renderer.create(
        <BidResult
          winning={false}
          sale_artwork={saleArtwork}
          status={status}
          bid={bid}
          message_header={messageHeader}
          message_description_md={messageDescriptionMd}
          navigator={jest.fn() as any}
        />
      )
      const mockDismiss = SwitchBoard.dismissModalViewController as jest.Mock<any>
      mockDismiss.mockReturnValueOnce(Promise.resolve())

      bidResult.root.findByType(BidGhostButton).instance.props.onPress()
      jest.runAllTicks()

      expect(SwitchBoard.presentModalViewController).toHaveBeenCalledWith(expect.anything(), "/auction/sale-id")
    })
  })
})
