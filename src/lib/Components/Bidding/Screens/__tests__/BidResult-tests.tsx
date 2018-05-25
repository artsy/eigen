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
  current_bid: {
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
describe("BidResult component", () => {
  Date.now = jest.fn(() => 1525983752116)

  describe("high bidder", () => {
    it("renders winning screen properly", () => {
      jest.useFakeTimers()

      const bidResult = <BidResult winning status={"SUCCESS"} sale_artwork={saleArtwork} navigator={jest.fn() as any} />
      const bg = renderer.create(bidResult).toJSON()

      const component = shallow(bidResult)
      expect(component.find("TimeLeftToBidDisplay")).toHaveLength(1)

      expect(bg).toMatchSnapshot()
    })

    it("dismisses the controller when the continue button is pressed", () => {
      jest.useFakeTimers()
      const bidResult = renderer.create(
        <BidResult winning status={"SUCCESS"} sale_artwork={saleArtwork} navigator={jest.fn() as any} />
      )
      ;(SwitchBoard.dismissModalViewController as jest.Mock<any>).mockImplementationOnce(() => Promise.resolve())

      bidResult.root.findByType(BidGhostButton).instance.props.onPress()
      jest.runAllTicks()

      expect(SwitchBoard.dismissModalViewController).toHaveBeenCalled()
      expect(SwitchBoard.presentModalViewController).not.toHaveBeenCalled()
    })
  })

  describe("low bidder", () => {
    it("renders timer and error message", () => {
      jest.useFakeTimers()
      const messageHeader = "Your bid wasn’t high enough"
      const messageDescriptionMd = `Another bidder placed a higher max bid or the same max bid before you did.  \
 Bid again to take the lead.`

      const bidResult = (
        <BidResult
          winning={false}
          sale_artwork={saleArtwork}
          status="ERROR_BID_LOW"
          message_header={messageHeader}
          message_description_md={messageDescriptionMd}
          navigator={jest.fn() as any}
        />
      )
      const bg = renderer.create(bidResult).toJSON()
      expect(bg).toMatchSnapshot()

      const component = shallow(bidResult)
      expect(component.find("TimeLeftToBidDisplay")).toHaveLength(1)
    })

    it("pops to root when bid-again button is pressed", () => {
      jest.useFakeTimers()
      const messageHeader = "Your bid wasn’t high enough"
      const messageDescriptionMd = `Another bidder placed a higher max bid or the same max bid before you did.  \
 Bid again to take the lead.`
      const bidResult = renderer.create(
        <BidResult
          winning={false}
          sale_artwork={saleArtwork}
          status="ERROR_BID_LOW"
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
    it("doesn't render timer", () => {
      jest.useFakeTimers()
      const status = "ERROR_LIVE_BIDDING_STARTED"
      const messageHeader = "Live bidding has started"
      const messageDescriptionMd = `Sorry, your bid wasn’t received before live bidding started.\
 To continue bidding, please [join the live auction](http://live-staging.artsy.net/).`

      const bidResult = (
        <BidResult
          winning={false}
          sale_artwork={saleArtwork}
          status={status}
          message_header={messageHeader}
          message_description_md={messageDescriptionMd}
          navigator={jest.fn() as any}
        />
      )
      const bg = renderer.create(bidResult).toJSON()

      expect(bg).toMatchSnapshot()

      const component = shallow(bidResult)
      expect(component.find("TimeLeftToBidDisplay")).toHaveLength(0)
    })

    it("dismisses controller and presents live interface when continue button is pressed", () => {
      jest.useFakeTimers()
      const status = "ERROR_LIVE_BIDDING_STARTED"
      const messageHeader = "Live bidding has started"
      const messageDescriptionMd = `Sorry, your bid wasn’t received before live bidding started.\
 To continue bidding, please [join the live auction](http://live-staging.artsy.net/).`

      const bidResult = renderer.create(
        <BidResult
          winning={false}
          sale_artwork={saleArtwork}
          status={status}
          message_header={messageHeader}
          message_description_md={messageDescriptionMd}
          navigator={jest.fn() as any}
        />
      )
      ;(SwitchBoard.dismissModalViewController as jest.Mock<any>).mockImplementationOnce(() => Promise.resolve())

      bidResult.root.findByType(BidGhostButton).instance.props.onPress()
      jest.runAllTicks()

      expect(SwitchBoard.dismissModalViewController).toHaveBeenCalled()
      expect(SwitchBoard.presentModalViewController).toHaveBeenCalledWith(expect.anything(), "/auction/sale-id")
    })
  })
})
