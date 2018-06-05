import React from "react"
import { TouchableWithoutFeedback } from "react-native"
import * as renderer from "react-test-renderer"

import Spinner from "../../../Spinner"
import { Button } from "../../Components/Button"
import { Checkbox } from "../../Components/Checkbox"
import { Serif16 } from "../../Elements/Typography"
import { BidResultScreen } from "../BidResult"
import { BillingAddress } from "../BillingAddress"
import { ConfirmFirstTimeBid } from "../ConfirmFirstTimeBid"

jest.mock("../../../../metaphysics", () => ({ metaphysics: jest.fn() }))
import { metaphysics } from "../../../../metaphysics"
const mockphysics = metaphysics as jest.Mock<any>

jest.unmock("react-relay")
import relay from "react-relay"

jest.mock("tipsi-stripe", () => ({
  setOptions: jest.fn(),
  paymentRequestWithCardForm: jest.fn(),
  createTokenWithCard: jest.fn(),
}))

let nextStep
const mockNavigator = { push: route => (nextStep = route), pop: () => null }
jest.useFakeTimers()

const { any, objectContaining } = jasmine

it("shows the billing address that the user typed in the billing address form", () => {
  const billingAddressRow = renderer
    .create(<ConfirmFirstTimeBid {...initialProps} />)
    .root.findAllByType(TouchableWithoutFeedback)[2]

  billingAddressRow.instance.props.onPress()

  expect(nextStep.component).toEqual(BillingAddress)

  nextStep.passProps.onSubmit(billingAddress)

  expect(billingAddressRow.findByType(Serif16).props.children).toEqual("401 Broadway 25th floor New York NY")
})

describe("successful bid", () => {
  beforeEach(() => {
    relay.commitMutation = jest
      .fn()
      .mockImplementationOnce((_, { onCompleted }) => onCompleted())
      .mockImplementationOnce((_, { onCompleted }) => onCompleted(mockRequestResponses.placeingBid.bidAccepted))
  })

  it("commits two mutations, one for createCreditCard followed by createBidderPosition", () => {
    mockphysics.mockReturnValueOnce(Promise.resolve(mockRequestResponses.pollingForBid.highestBid))

    const component = renderer.create(<ConfirmFirstTimeBid {...initialProps} />)

    component.root.instance.setState({ creditCardToken: stripeToken })
    component.root.findByType(Checkbox).instance.props.onPress()
    component.root.findByType(Button).instance.props.onPress()

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

  it("polls for new results", () => {
    mockphysics.mockReturnValueOnce(Promise.resolve(mockRequestResponses.pollingForBid.pending))
    mockphysics.mockReturnValueOnce(Promise.resolve(mockRequestResponses.pollingForBid.highestBid))

    const component = renderer.create(<ConfirmFirstTimeBid {...initialProps} />)

    component.root.instance.setState({ creditCardToken: stripeToken })
    component.root.findByType(Checkbox).instance.props.onPress()
    component.root.findByType(Button).instance.props.onPress()

    jest.runOnlyPendingTimers()
    jest.runAllTicks()
    jest.runOnlyPendingTimers()
    jest.runAllTicks()

    expect(nextStep.component).toEqual(BidResultScreen)
    expect((nextStep.passProps as any).winning).toBeTruthy()
  })

  it("shows a spinner", () => {
    mockphysics.mockReturnValueOnce(Promise.resolve(mockRequestResponses.pollingForBid.pending))

    const component = renderer.create(<ConfirmFirstTimeBid {...initialProps} />)

    component.root.instance.setState({ creditCardToken: stripeToken })
    component.root.findByType(Checkbox).instance.props.onPress()
    component.root.findByType(Button).instance.props.onPress()

    expect(component.root.findAllByType(Spinner).length).toEqual(1)
  })
})

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
  },
  pollingForBid: {
    highestBid: {
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
  navigator: mockNavigator,
} as any
