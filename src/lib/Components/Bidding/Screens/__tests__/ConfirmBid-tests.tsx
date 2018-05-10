import React from "react"
import "react-native"
import * as renderer from "react-test-renderer"

jest.mock("../../../../metaphysics", () => ({ metaphysics: jest.fn() }))
import { metaphysics } from "../../../../metaphysics"
const mockphysics = metaphysics as jest.Mock<any>

import { ConfirmBid } from "../ConfirmBid"
jest.unmock("react-relay")
import relay from "react-relay"

const saleArtwork = {
  artwork: {
    id: "meteor shower",
    title: "Meteor Shower",
    date: "2015",
    artist_names: "Makiko Kudo",
  },
  sale: {
    id: "best-art-sale-in-town",
  },
  lot_label: "538",
}
const initialProps = {
  sale_artwork: saleArtwork,
  bid: { cents: 450000, display: "$45,000" },
  relay: { environment: null },
} as any

it("renders properly", () => {
  const bg = renderer.create(<ConfirmBid {...initialProps} />).toJSON()
  expect(bg).toMatchSnapshot()
})

describe("when pressing bid button", () => {
  it("commits mutation", () => {
    const confirmBid = new ConfirmBid(initialProps)
    relay.commitMutation = jest.fn()

    confirmBid.placeBid()
    expect(relay.commitMutation).toHaveBeenCalled()
  })

  describe("in mutation callback", () => {
    it("commits the mutation and verifies bid position on success", () => {
      const confirmBid = new ConfirmBid(initialProps)
      confirmBid.verifyBidPosition = jest.fn()
      relay.commitMutation = jest.fn((_, { onCompleted }) => {
        onCompleted()
      })

      confirmBid.placeBid()

      expect(relay.commitMutation).toHaveBeenCalled()
      expect(confirmBid.verifyBidPosition).toHaveBeenCalled()
    })

    it("commits the mutation and verifies bid position on success", () => {
      const confirmBid = new ConfirmBid(initialProps)
      confirmBid.verifyBidPosition = jest.fn()
      console.log = jest.fn() // Silences component logging.
      relay.commitMutation = jest.fn((_, { onError }) => {
        onError(new Error("An error occurred."))
      })

      confirmBid.placeBid()

      expect(relay.commitMutation).toHaveBeenCalled()
      expect(confirmBid.verifyBidPosition).not.toHaveBeenCalled()
    })
  })
})

describe("polling to verify bid position", () => {
  const bidAcceptedResults = {
    createBidderPosition: {
      result: {
        status: "SUCCESS",
        position: { id: "some-bidder-position-id" },
      },
    },
  }

  beforeEach(() => {
    jest.useFakeTimers()
  })

  it("calls metaphysics and checks result", () => {
    const confirmBid = new ConfirmBid(initialProps)
    mockphysics.mockReturnValueOnce(Promise.resolve())
    confirmBid.checkBidPosition = jest.fn()
    confirmBid.setState = jest.fn()

    confirmBid.verifyBidPosition(bidAcceptedResults, null)
    jest.runOnlyPendingTimers()
    jest.runAllTicks() // Required as metaphysics async call defers execution to next invocation of Node event loop.

    expect(mockphysics).toHaveBeenCalled()
    const query = mockphysics.mock.calls[0][0].query
    expect(query).toContain(bidAcceptedResults.createBidderPosition.result.position.id)
    expect(confirmBid.checkBidPosition).toHaveBeenCalled()
  })

  describe("bid success", () => {
    const result = {
      data: {
        me: {
          bidder_position: {
            processed_at: "whatever-time",
            is_active: true,
          },
        },
      },
    }

    it("shows successful result when highest bidder", () => {
      const confirmBid = new ConfirmBid(initialProps)
      confirmBid.showBidResult = jest.fn()

      confirmBid.checkBidPosition(result)

      expect(confirmBid.showBidResult).toHaveBeenCalledWith(true)
    })

    it("shows outbid result when outbid", () => {
      const confirmBid = new ConfirmBid(initialProps)
      confirmBid.showBidResult = jest.fn()
      result.data.me.bidder_position.is_active = false

      confirmBid.checkBidPosition(result)

      expect(confirmBid.showBidResult).toHaveBeenCalledWith(false)
    })
  })

  describe("bid failure", () => {
    const bidFailedResults = {
      createBidderPosition: {
        result: {
          status: "ERROR",
          message_header: "An error occurred",
          message_description_md: "Some markdown description",
        },
      },
    }

    it("shows the error screen with a failure", () => {
      const confirmBid = new ConfirmBid(initialProps)
      mockphysics.mockReturnValueOnce(Promise.resolve())
      confirmBid.showBidResult = jest.fn()

      confirmBid.verifyBidPosition(bidFailedResults, null)

      expect(confirmBid.showBidResult).toHaveBeenCalledWith(
        false,
        bidFailedResults.createBidderPosition.result.message_header,
        bidFailedResults.createBidderPosition.result.message_description_md
      )
    })
  })
})
