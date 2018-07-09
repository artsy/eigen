import React from "react"
import * as renderer from "react-test-renderer"

import Spinner from "../../../Spinner"
import { BidInfoRow } from "../../Components/BidInfoRow"
import { Button } from "../../Components/Button"
import { Checkbox } from "../../Components/Checkbox"
import { Serif16 } from "../../Elements/Typography"
import { BillingAddress } from "../BillingAddress"
import { CreditCardForm } from "../CreditCardForm"
import { Registration } from "../Registration"

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
import { RegistrationResult, RegistrationStatus } from "lib/Components/Bidding/Screens/RegistrationResult"
import stripe from "tipsi-stripe"

let nextStep
const mockNavigator = { push: route => (nextStep = route), pop: () => null }
jest.useFakeTimers()

beforeEach(() => {
  // Because of how we mock metaphysics, the mocked value from one test can bleed into another.
  mockphysics.mockReset()
})

it("renders properly for a user without a credit card", () => {
  const component = renderer.create(<Registration {...initialPropsForUserWithoutCreditCard} />).toJSON()
  expect(component).toMatchSnapshot()
})

it("renders properly for a user with a credit card", () => {
  const component = renderer.create(<Registration {...initialPropsForUserWithCreditCard} />).toJSON()
  expect(component).toMatchSnapshot()
})

it("shows the billing address that the user typed in the billing address form", () => {
  const billingAddressRow = renderer
    .create(<Registration {...initialPropsForUserWithoutCreditCard} />)
    .root.findAllByType(BidInfoRow)[1]
  billingAddressRow.instance.props.onPress()
  expect(nextStep.component).toEqual(BillingAddress)

  nextStep.passProps.onSubmit(billingAddress)

  expect(billingAddressRow.findByType(Serif16).props.children).toEqual("401 Broadway 25th floor New York NY")
})

it("shows the credit card form when the user tap the edit text in the credit card row", () => {
  const creditcardRow = renderer
    .create(<Registration {...initialPropsForUserWithoutCreditCard} />)
    .root.findAllByType(BidInfoRow)[0]

  creditcardRow.instance.props.onPress()

  expect(nextStep.component).toEqual(CreditCardForm)
})

it("shows the option for entering payment information if the user does not have a credit card on file", () => {
  const component = renderer.create(<Registration {...initialPropsForUserWithoutCreditCard} />)

  expect(component.root.findAllByType(Checkbox).length).toEqual(1)
  expect(component.root.findAllByType(BidInfoRow).length).toEqual(2)
})

it("shows no option for entering payment information if the user has a credit card on file", () => {
  const component = renderer.create(<Registration {...initialPropsForUserWithCreditCard} />)

  expect(component.root.findAllByType(Checkbox).length).toEqual(1)
  expect(component.root.findAllByType(BidInfoRow).length).toEqual(0)
})

describe("when pressing register button", () => {
  it("when a credit card needs to be added, it commits two mutations on button press", () => {
    const component = renderer.create(<Registration {...initialPropsForUserWithoutCreditCard} />)
    component.root.instance.setState({ conditionsOfSaleChecked: true, billingAddress, creditCardToken: stripeToken })

    component.root.findByType(Button).instance.props.onPress()
  })

  it("when there is a credit card on file, it commits mutation", () => {
    const component = renderer.create(<Registration {...initialPropsForUserWithCreditCard} />)
    component.root.instance.setState({ conditionsOfSaleChecked: true })

    mockphysics.mockReturnValueOnce(Promise.resolve(mockRequestResponses.qualifiedBidder))

    relay.commitMutation = jest.fn()
    component.root.findByType(Button).instance.props.onPress()

    expect(relay.commitMutation).toHaveBeenCalled()
  })

  it("shows a spinner", () => {
    const component = renderer.create(<Registration {...initialPropsForUserWithCreditCard} />)
    component.root.instance.setState({ conditionsOfSaleChecked: true })
    relay.commitMutation = jest.fn()

    component.root.findByType(Button).instance.props.onPress()

    expect(component.root.findAllByType(Spinner).length).toEqual(1)
  })

  it("displays an error message on a stripe failure", () => {
    stripe.createTokenWithCard.mockImplementation(() => {
      throw new Error("Error tokenizing card")
    })
    console.error = jest.fn() // Silences component logging.
    const component = renderer.create(<Registration {...initialPropsForUserWithoutCreditCard} />)

    component.root.instance.setState({ billingAddress })
    component.root.instance.setState({ creditCardToken: stripeToken })
    component.root.findByType(Checkbox).instance.props.onPress()
    component.root.findByType(Button).instance.props.onPress()

    jest.runAllTicks()

    expect(nextStep.component).toEqual(RegistrationResult)
    expect(nextStep.passProps).toEqual({ status: RegistrationStatus.RegistrationStatusError })
  })

  it("displays an error message on a creditCardMutation failure", () => {
    const error = {
      message: 'GraphQL Timeout Error: Mutation.createCreditCard has timed out after waiting for 5000ms"}',
    }

    console.error = jest.fn() // Silences component logging.
    stripe.createTokenWithCard.mockReturnValueOnce(stripeToken)
    relay.commitMutation = jest.fn((_, { onCompleted }) => onCompleted({}, [error]))

    const component = renderer.create(<Registration {...initialPropsForUserWithoutCreditCard} />)

    component.root.instance.setState({ billingAddress })
    component.root.instance.setState({ creditCardToken: stripeToken })
    component.root.findByType(Checkbox).instance.props.onPress()
    component.root.findByType(Button).instance.props.onPress()

    jest.runAllTicks()

    expect(nextStep.component).toEqual(RegistrationResult)
    expect(nextStep.passProps).toEqual({ status: RegistrationStatus.RegistrationStatusError })
  })

  it("displays an error message on a bidderMutation failure", () => {
    const error = {
      message:
        'https://stagingapi.artsy.net/api/v1/bidder?sale_id=leclere-impressionist-and-modern-art - {"error":"Invalid Sale"}',
    }

    console.error = jest.fn() // Silences component logging.
    relay.commitMutation = jest.fn((_, { onCompleted }) => onCompleted({}, [error]))

    const component = renderer.create(<Registration {...initialPropsForUserWithCreditCard} />)

    component.root.findByType(Checkbox).instance.props.onPress()
    component.root.findByType(Button).instance.props.onPress()

    jest.runAllTicks()

    expect(nextStep.component).toEqual(RegistrationResult)
    expect(nextStep.passProps).toEqual({ status: RegistrationStatus.RegistrationStatusError })
  })

  it("displays an error message on a network failure", () => {
    console.error = jest.fn() // Silences component logging.
    relay.commitMutation = jest.fn((_, { onError }) => onError(new TypeError("Network request failed")))

    const component = renderer.create(<Registration {...initialPropsForUserWithCreditCard} />)

    component.root.findByType(Checkbox).instance.props.onPress()
    component.root.findByType(Button).instance.props.onPress()

    jest.runAllTicks()

    expect(nextStep.component).toEqual(RegistrationResult)
    expect(nextStep.passProps).toEqual({ status: RegistrationStatus.RegistrationStatusNetworkError })
  })

  it("displays the pending result when the bidder is not qualified_for_bidding", () => {
    relay.commitMutation = jest.fn((_, { onCompleted }) =>
      onCompleted({ createBidder: { bidder: { qualified_for_bidding: false } } })
    )

    const component = renderer.create(<Registration {...initialPropsForUserWithCreditCard} />)

    component.root.findByType(Checkbox).instance.props.onPress()
    component.root.findByType(Button).instance.props.onPress()

    jest.runAllTicks()

    expect(nextStep.component).toEqual(RegistrationResult)
    expect(nextStep.passProps).toEqual({ status: RegistrationStatus.RegistrationStatusPending })
  })

  it("displays the completed result when the bidder is qualified_for_bidding", () => {
    relay.commitMutation = jest.fn((_, { onCompleted }) =>
      onCompleted({ createBidder: { bidder: { qualified_for_bidding: true } } })
    )

    const component = renderer.create(<Registration {...initialPropsForUserWithCreditCard} />)

    component.root.findByType(Checkbox).instance.props.onPress()
    component.root.findByType(Button).instance.props.onPress()

    jest.runAllTicks()

    expect(nextStep.component).toEqual(RegistrationResult)
    expect(nextStep.passProps).toEqual({ status: RegistrationStatus.RegistrationStatusComplete })
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

const sale = {
  sale: {
    id: "1",
    live_start_at: "2029-06-11T01:00:00+00:00",
    end_at: null,
    name: "Phillips New Now",
    start_at: "2018-06-11T01:00:00+00:00",
    is_preview: true,
  },
}

const mockRequestResponses = {
  qualifiedBidder: {
    data: {
      bidder: {
        qualified_for_bidding: true,
      },
    },
  },
  creditCard: {
    data: {
      credit_card: {
        id: "123",
        brand: "Visa",
        name: "Stuey Foo",
        last_digits: "1234",
        expiration_month: "12",
        expiration_year: "2022",
      },
    },
  },
}

const initialProps = {
  sale,
  relay: { environment: null },
  navigator: mockNavigator,
} as any

const initialPropsForUserWithCreditCard = {
  ...initialProps,
  me: {
    has_credit_cards: true,
  },
} as any

const initialPropsForUserWithoutCreditCard = {
  ...initialProps,
  me: {
    has_credit_cards: false,
  },
} as any
