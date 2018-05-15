import React from "react"
import "react-native"
import * as renderer from "react-test-renderer"

jest.mock("../../../../metaphysics", () => ({ metaphysics: jest.fn() }))
import { metaphysics } from "../../../../metaphysics"
const mockphysics = metaphysics as jest.Mock<any>

import { Button } from "../../Components/Button"
import { BidResult } from "../BidResult"
import { ConfirmBid } from "../ConfirmBid"

// This let's us import the actual react-relay module, and replace specific functions within it with mocks.
jest.unmock("react-relay")
import relay from "react-relay"
const mockRelay = relay as any

let nextStep
const mockNavigator = { push: route => (nextStep = route) }
jest.useFakeTimers()

beforeEach(() => {
  mockphysics.mockReset()
})

it("renders properly", () => {
  const bg = renderer.create(<ConfirmBid {...initialProps} />).toJSON()
  expect(bg).toMatchSnapshot()
})

describe("when pressing bid button", () => {
  it("commits mutation", () => {
    const component = renderer.create(<ConfirmBid {...initialProps} />)
    mockRelay.commitMutation = jest.fn()

    component.root.findByType(Button).instance.props.onPress()

    expect(relay.commitMutation).toHaveBeenCalled()
    expect(mockphysics).not.toHaveBeenCalled()
  })

  describe("when pressing bid", () => {
    it("commits the mutation", () => {
      const component = renderer.create(<ConfirmBid {...initialProps} navigator={mockNavigator} />)
      mockphysics.mockReturnValueOnce(Promise.resolve(mockRequestResponses.pollingForBid.highestedBidder))
      relay.commitMutation = jest.fn()

      component.root.findByType(Button).instance.props.onPress()

      expect(relay.commitMutation).toHaveBeenCalled()
    })

    describe("when mutation fails", () => {
      it("does not verify bid position", () => {
        // Probably due to a network problem.
        const component = renderer.create(<ConfirmBid {...initialProps} navigator={mockNavigator} />)
        console.error = jest.fn() // Silences component logging.
        relay.commitMutation = jest.fn((_, { onError }) => {
          onError(new Error("An error occurred."))
        })

        component.root.findByType(Button).instance.props.onPress()

        expect(relay.commitMutation).toHaveBeenCalled()
        expect(mockphysics).not.toHaveBeenCalled()
      })
    })
  })
})

describe("polling to verify bid position", () => {
  xdescribe("bid pending", () => {
    xit("polls for new results")
  })

  describe("bid success", () => {
    it("shows successful bid result when highest bidder", () => {
      const component = renderer.create(<ConfirmBid {...initialProps} navigator={mockNavigator} />)
      mockphysics.mockReturnValueOnce(Promise.resolve(mockRequestResponses.pollingForBid.highestedBidder))
      relay.commitMutation = jest.fn((_, { onCompleted }) => {
        onCompleted(mockRequestResponses.placeingBid.bidAccepted)
      })

      component.root.findByType(Button).instance.props.onPress()
      jest.runAllTicks() // Required as metaphysics async call defers execution to next invocation of Node event loop.

      expect(nextStep.component).toEqual(BidResult)
      expect(nextStep.passProps.winning).toBeTruthy()
    })

    it("shows outbid bidSuccessResult when outbid", () => {
      const component = renderer.create(<ConfirmBid {...initialProps} navigator={mockNavigator} />)
      mockphysics.mockReturnValueOnce(Promise.resolve(mockRequestResponses.pollingForBid.outbid))
      relay.commitMutation = jest.fn((_, { onCompleted }) => {
        onCompleted(mockRequestResponses.placeingBid.bidAccepted)
      })

      component.root.findByType(Button).instance.props.onPress()
      jest.runAllTicks()

      expect(nextStep.component).toEqual(BidResult)
      expect(nextStep.passProps.winning).toBeFalsy()
    })
  })

  describe("bid failure", () => {
    it("shows the error screen with a failure", () => {
      const component = renderer.create(<ConfirmBid {...initialProps} navigator={mockNavigator} />)
      relay.commitMutation = jest.fn((_, { onCompleted }) => {
        onCompleted(mockRequestResponses.placeingBid.bidRejected)
      })

      component.root.findByType(Button).instance.props.onPress()
      jest.runAllTicks()

      expect(nextStep.passProps).toEqual(
        expect.objectContaining({
          message_header: "An error occurred",
        })
      )
    })

    xit("shows the error screen with a network failure")
  })
})

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
const mockRequestResponses = {
  placeingBid: {
    bidAccepted: {
      createBidderPosition: {
        result: {
          status: "SUCCESS",
          position: { id: "some-bidder-position-id" },
        },
      },
    },
    bidRejected: {
      createBidderPosition: {
        result: {
          status: "ERROR",
          message_header: "An error occurred",
          message_description_md: "Some markdown description",
        },
      },
    },
  },
  pollingForBid: {
    highestedBidder: {
      data: {
        me: {
          bidder_position: {
            processed_at: "whatever-time",
            is_active: true,
          },
        },
      },
    },
    outbid: {
      data: {
        me: {
          bidder_position: {
            processed_at: "whatever-time",
            is_active: false,
          },
        },
      },
    },
  },
}
const initialProps = {
  sale_artwork: saleArtwork,
  bid: { cents: 450000, display: "$45,000" },
  relay: { environment: null },
} as any
