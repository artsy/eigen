import { times } from "lodash"
import React from "react"
import { NativeModules, TouchableWithoutFeedback } from "react-native"
import "react-native"
import * as renderer from "react-test-renderer"

import Spinner from "../../../Spinner"
import { Serif16 } from "../../Elements/Typography"

import { BidInfoRow } from "../../Components/BidInfoRow"
import { Button } from "../../Components/Button"
import { Checkbox } from "../../Components/Checkbox"

import { BidResultScreen } from "../BidResult"
import { BillingAddress } from "../BillingAddress"
import { ConfirmBid } from "../ConfirmBid"
import { CreditCardForm } from "../CreditCardForm"

jest.mock("../../../../metaphysics", () => ({ metaphysics: jest.fn() }))
import { metaphysics } from "../../../../metaphysics"
const mockphysics = metaphysics as jest.Mock<any>

// This lets us import the actual react-relay module, and replace specific functions within it with mocks.
jest.unmock("react-relay")
import relay from "react-relay"

jest.mock("tipsi-stripe", () => ({
  setOptions: jest.fn(),
  paymentRequestWithCardForm: jest.fn(),
  createTokenWithCard: jest.fn(),
}))
import stripe from "tipsi-stripe"

import objectContaining = jasmine.objectContaining
import any = jasmine.any

let nextStep
const mockNavigator = { push: route => (nextStep = route) }
jest.useFakeTimers()
const mockPostNotificationName = jest.fn()

beforeEach(() => {
  // Because of how we mock metaphysics, the mocked value from one test can bleed into another.
  mockphysics.mockReset()
  mockPostNotificationName.mockReset()
  NativeModules.ARNotificationsManager = { postNotificationName: mockPostNotificationName }
})

it("renders properly", () => {
  const component = renderer.create(<ConfirmBid {...initialProps} />).toJSON()
  expect(component).toMatchSnapshot()
})

it("enables the bid button when checkbox is ticked", () => {
  const component = renderer.create(<ConfirmBid {...initialProps} />)

  expect(component.root.findByType(Button).instance.props.onPress).toBeFalsy()

  component.root.instance.setState({ conditionsOfSaleChecked: true })

  expect(component.root.findByType(Button).instance.props.onPress).toBeDefined()
})

it("enables the bid button by default if the user is registered", () => {
  const component = renderer.create(<ConfirmBid {...initialPropsForRegisteredUser} />)

  expect(component.root.findByType(Button).instance.props.onPress).toBeDefined()
})

describe("checkbox and payment info display", () => {
  it("shows no checkbox or payment info if the user is registered", () => {
    const component = renderer.create(<ConfirmBid {...initialPropsForRegisteredUser} />)

    expect(component.root.findAllByType(Checkbox).length).toEqual(0)
    expect(component.root.findAllByType(BidInfoRow).length).toEqual(1)
  })

  it("shows a checkbox but no payment info if the user is not registered and has cc on file", () => {
    const component = renderer.create(<ConfirmBid {...initialProps} />)

    expect(component.root.findAllByType(Checkbox).length).toEqual(1)
    expect(component.root.findAllByType(BidInfoRow).length).toEqual(1)
  })

  it("shows a checkbox and payment info if the user is not registered and has no cc on file", () => {
    const component = renderer.create(<ConfirmBid {...initialPropsForUnqualifiedUser} />)

    expect(component.root.findAllByType(Checkbox).length).toEqual(1)
    expect(component.root.findAllByType(BidInfoRow).length).toEqual(3)
  })
})

describe("when pressing bid button", () => {
  it("commits mutation", () => {
    const component = renderer.create(<ConfirmBid {...initialProps} />)
    component.root.instance.setState({ conditionsOfSaleChecked: true })

    relay.commitMutation = jest.fn()

    component.root.findByType(Button).instance.props.onPress()
    expect(relay.commitMutation).toHaveBeenCalled()
  })

  it("shows a spinner", () => {
    const component = renderer.create(<ConfirmBid {...initialProps} />)
    component.root.instance.setState({ conditionsOfSaleChecked: true })
    relay.commitMutation = jest.fn()

    component.root.findByType(Button).instance.props.onPress()

    expect(component.root.findAllByType(Spinner).length).toEqual(1)
  })

  describe("when pressing bid", () => {
    it("commits the mutation", () => {
      const component = renderer.create(<ConfirmBid {...initialProps} />)
      component.root.instance.setState({ conditionsOfSaleChecked: true })
      mockphysics.mockReturnValueOnce(Promise.resolve(mockRequestResponses.pollingForBid.highestedBidder))
      relay.commitMutation = jest.fn()

      component.root.findByType(Button).instance.props.onPress()

      expect(relay.commitMutation).toHaveBeenCalled()
    })

    describe("when mutation fails", () => {
      it("does not verify bid position", () => {
        // Probably due to a network problem.
        const component = renderer.create(<ConfirmBid {...initialProps} />)
        component.root.instance.setState({ conditionsOfSaleChecked: true })
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
  describe("bid success", () => {
    it("polls for new results", () => {
      const component = renderer.create(<ConfirmBid {...initialProps} />)
      component.root.instance.setState({ conditionsOfSaleChecked: true })
      relay.commitMutation = jest.fn((_, { onCompleted }) => {
        onCompleted(mockRequestResponses.placeingBid.bidAccepted)
      })
      let requestCounter = 0 // On the fifth attempt, return highestBidder
      mockphysics.mockImplementation(() => {
        requestCounter++
        if (requestCounter > 5) {
          return Promise.resolve(mockRequestResponses.pollingForBid.highestedBidder)
        } else {
          return Promise.resolve(mockRequestResponses.pollingForBid.pending)
        }
      })

      component.root.findByType(Button).instance.props.onPress()
      times(6, () => {
        jest.runOnlyPendingTimers()
        jest.runAllTicks()
      })

      expect(nextStep.component).toEqual(BidResultScreen)
      expect(nextStep.passProps).toEqual(
        objectContaining({
          bidderPositionResult: mockRequestResponses.pollingForBid.highestedBidder.data.me.bidder_position,
        })
      )
    })

    it("shows error when polling attempts exceed max", () => {
      const component = renderer.create(<ConfirmBid {...initialProps} />)
      component.root.instance.setState({ conditionsOfSaleChecked: true })
      mockphysics.mockReturnValue(Promise.resolve(mockRequestResponses.pollingForBid.pending))
      relay.commitMutation = jest.fn((_, { onCompleted }) => {
        onCompleted(mockRequestResponses.placeingBid.bidAccepted)
      })

      component.root.findByType(Button).instance.props.onPress()

      times(22, () => {
        jest.runOnlyPendingTimers()
        jest.runAllTicks()
      })

      expect(nextStep.component).toEqual(BidResultScreen)
      expect(nextStep.passProps).toEqual(
        objectContaining({
          bidderPositionResult: mockRequestResponses.pollingForBid.pending.data.me.bidder_position,
        })
      )
    })

    it("shows successful bid result when highest bidder", () => {
      const component = renderer.create(<ConfirmBid {...initialProps} />)
      component.root.instance.setState({ conditionsOfSaleChecked: true })
      mockphysics.mockReturnValueOnce(Promise.resolve(mockRequestResponses.pollingForBid.highestedBidder))
      relay.commitMutation = jest.fn((_, { onCompleted }) => {
        onCompleted(mockRequestResponses.placeingBid.bidAccepted)
      })

      component.root.findByType(Button).instance.props.onPress()
      jest.runAllTicks() // Required as metaphysics async call defers execution to next invocation of Node event loop.

      expect(nextStep.component).toEqual(BidResultScreen)
      expect(nextStep.passProps).toEqual(
        objectContaining({
          bidderPositionResult: mockRequestResponses.pollingForBid.highestedBidder.data.me.bidder_position,
        })
      )
    })

    it("shows outbid bidSuccessResult when outbid", () => {
      const component = renderer.create(<ConfirmBid {...initialProps} />)
      component.root.instance.setState({ conditionsOfSaleChecked: true })
      mockphysics.mockReturnValueOnce(Promise.resolve(mockRequestResponses.pollingForBid.outbid))
      relay.commitMutation = jest.fn((_, { onCompleted }) => {
        onCompleted(mockRequestResponses.placeingBid.bidAccepted)
      })

      component.root.findByType(Button).instance.props.onPress()
      jest.runAllTicks()

      expect(nextStep.component).toEqual(BidResultScreen)
      expect(nextStep.passProps).toEqual(
        objectContaining({
          bidderPositionResult: mockRequestResponses.pollingForBid.outbid.data.me.bidder_position,
        })
      )
    })

    it("shows reserve not met when reserve is not met", () => {
      const component = renderer.create(<ConfirmBid {...initialProps} />)
      component.root.instance.setState({ conditionsOfSaleChecked: true })
      mockphysics.mockReturnValueOnce(Promise.resolve(mockRequestResponses.pollingForBid.reserveNotMet))
      relay.commitMutation = jest.fn((_, { onCompleted }) => {
        onCompleted(mockRequestResponses.placeingBid.bidAccepted)
      })

      component.root.findByType(Button).instance.props.onPress()
      jest.runAllTicks()

      expect(nextStep.component).toEqual(BidResultScreen)
      expect(nextStep.passProps).toEqual(
        objectContaining({
          bidderPositionResult: mockRequestResponses.pollingForBid.reserveNotMet.data.me.bidder_position,
        })
      )
    })
    it("updates the main auction screen", () => {
      const component = renderer.create(<ConfirmBid {...initialProps} navigator={mockNavigator} />)
      component.root.instance.setState({ conditionsOfSaleChecked: true })
      mockphysics.mockReturnValueOnce(Promise.resolve(mockRequestResponses.pollingForBid.reserveNotMet))
      relay.commitMutation = jest.fn((_, { onCompleted }) => {
        onCompleted(mockRequestResponses.placeingBid.bidAccepted)
      })

      component.root.findByType(Button).instance.props.onPress()
      jest.runAllTicks()

      expect(mockPostNotificationName).toHaveBeenCalledWith("ARAuctionArtworkRegistrationUpdatedNotification", {
        ARAuctionID: "best-art-sale-in-town",
      })
      expect(mockPostNotificationName).toHaveBeenCalledWith("ARAuctionArtworkBidUpdated", {
        ARAuctionID: "best-art-sale-in-town",
        ARAuctionArtworkID: "meteor shower",
      })
    })
  })

  describe("bid failure", () => {
    it("shows the error screen with a failure", () => {
      const component = renderer.create(<ConfirmBid {...initialProps} />)
      component.root.instance.setState({ conditionsOfSaleChecked: true })
      relay.commitMutation = jest.fn((_, { onCompleted }) => {
        onCompleted(mockRequestResponses.placeingBid.bidRejected)
      })

      component.root.findByType(Button).instance.props.onPress()
      jest.runAllTicks()

      expect(nextStep.component).toEqual(BidResultScreen)
      expect(nextStep.passProps).toEqual(
        objectContaining({
          bidderPositionResult: mockRequestResponses.placeingBid.bidRejected.createBidderPosition.result,
        })
      )
    })

    xit("shows the error screen with a network failure")
  })
})

describe("ConfirmBid for unqualified user", () => {
  it("shows the billing address that the user typed in the billing address form", () => {
    const billingAddressRow = renderer
      .create(<ConfirmBid {...initialPropsForUnqualifiedUser} />)
      .root.findAllByType(TouchableWithoutFeedback)[2]

    billingAddressRow.instance.props.onPress()

    expect(nextStep.component).toEqual(BillingAddress)

    nextStep.passProps.onSubmit(billingAddress)

    expect(billingAddressRow.findByType(Serif16).props.children).toEqual("401 Broadway 25th floor New York NY")
  })

  it("shows the credit card form when the user tap the edit text in the credit card row", () => {
    const creditcardRow = renderer
      .create(<ConfirmBid {...initialPropsForUnqualifiedUser} />)
      .root.findAllByType(TouchableWithoutFeedback)[1]

    creditcardRow.instance.props.onPress()

    expect(nextStep.component).toEqual(CreditCardForm)
  })

  describe("successful bid", () => {
    beforeEach(() => {
      stripe.createTokenWithCard.mockReturnValueOnce(stripeToken)
      relay.commitMutation = jest
        .fn()
        .mockImplementationOnce((_, { onCompleted }) => onCompleted())
        .mockImplementationOnce((_, { onCompleted }) => onCompleted(mockRequestResponses.placeingBid.bidAccepted))
    })

    it("commits two mutations, createCreditCard followed by createBidderPosition", () => {
      mockphysics.mockReturnValueOnce(Promise.resolve(mockRequestResponses.pollingForBid.highestedBidder))

      const component = renderer.create(<ConfirmBid {...initialPropsForUnqualifiedUser} />)

      // manually setting state to avoid dplicating tests for skipping UI interation, but practically better not to do this.
      component.root.instance.setState({ billingAddress })
      component.root.instance.setState({ creditCardToken: stripeToken })
      component.root.findByType(Checkbox).instance.props.onPress()
      component.root.findByType(Button).instance.props.onPress()

      jest.runAllTicks()

      expect(relay.commitMutation).toHaveBeenCalledWith(
        any(Object),
        objectContaining({
          variables: {
            input: {
              token: "fake-token",
            },
          },
        })
      )

      expect(relay.commitMutation).toHaveBeenCalledWith(
        any(Object),
        objectContaining({
          variables: {
            input: {
              sale_id: saleArtwork.sale.id,
              artwork_id: saleArtwork.artwork.id,
              max_bid_amount_cents: 450000,
            },
          },
        })
      )
    })
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
    endsAt: "2018-05-10T20:22:42+00:00",
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
            status: "WINNING",
            position: {},
          },
        },
      },
    },
    outbid: {
      data: {
        me: {
          bidder_position: {
            status: "OUTBID",
            position: {},
          },
        },
      },
    },
    pending: {
      data: {
        me: {
          bidder_position: {
            position: {},
            status: "PENDING",
          },
        },
      },
    },
    reserveNotMet: {
      data: {
        me: {
          bidder_position: {
            position: {},
            status: "RESERVE_NOT_MET",
          },
        },
      },
    },
  },
}

const billingAddress = {
  fullName: "Yuki Stockmeier",
  addressLine1: "401 Broadway",
  addressLine2: "25th floor",
  city: "New York",
  state: "NY",
  postalCode: "10013",
}

const stripeToken = {
  tokenId: "fake-token",
  created: "1528229731",
  livemode: 0,
  card: {
    brand: "VISA",
    last4: "4242",
  },
  bankAccount: null,
  extra: null,
}

const initialProps = {
  sale_artwork: saleArtwork,
  bid: {
    cents: 450000,
    display: "$45,000",
  },
  relay: {
    environment: null,
  },
  me: {
    has_qualified_credit_cards: true,
    bidders: null,
  },
  navigator: mockNavigator,
} as any

const initialPropsForUnqualifiedUser = {
  ...initialProps,
  me: {
    has_qualified_credit_cards: false,
  },
} as any

const initialPropsForRegisteredUser = {
  ...initialProps,
  me: {
    bidders: [{ qualified_for_bidding: true }],
  },
} as any
