import React from "react"
import * as renderer from "react-test-renderer"

import { Checkbox } from "../../Components/Checkbox"
import { Serif16 } from "../../Elements/Typography"
import { BillingAddress } from "../BillingAddress"
import { Registration } from "../Registration"

jest.unmock("react-relay")
import { BidInfoRow } from "../../Components/BidInfoRow"

jest.mock("tipsi-stripe", () => ({
  setOptions: jest.fn(),
  paymentRequestWithCardForm: jest.fn(),
  createTokenWithCard: jest.fn(),
}))

let nextStep
const mockNavigator = { push: route => (nextStep = route), pop: () => null }
jest.useFakeTimers()

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

const billingAddress = {
  fullName: "Yuki Stockmeier",
  addressLine1: "401 Broadway",
  addressLine2: "25th floor",
  city: "New York",
  state: "NY",
  postalCode: "10013",
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
