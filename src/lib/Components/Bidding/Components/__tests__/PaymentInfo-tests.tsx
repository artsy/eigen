import { Serif } from "@artsy/palette"
import React from "react"
import * as renderer from "react-test-renderer"

import { BillingAddress } from "../../Screens/BillingAddress"
import { CreditCardForm } from "../../Screens/CreditCardForm"
import { PaymentInfo } from "../PaymentInfo"

import { BidInfoRow } from "../../Components/BidInfoRow"

import { Theme } from "@artsy/palette"

jest.mock("tipsi-stripe", () => ({
  setOptions: jest.fn(),
  paymentRequestWithCardForm: jest.fn(),
  createTokenWithCard: jest.fn(),
}))

let nextStep
const mockNavigator = { push: route => (nextStep = route), pop: () => null }
jest.useFakeTimers()

it("renders properly", () => {
  const component = renderer
    .create(
      <Theme>
        <PaymentInfo {...initialProps} />
      </Theme>
    )
    .toJSON()
  expect(component).toMatchSnapshot()
})

it("shows the billing address that the user typed in the billing address form", () => {
  const billingAddressRow = renderer
    .create(
      <Theme>
        <PaymentInfo {...initialProps} />
      </Theme>
    )
    .root.findAllByType(BidInfoRow)[1]
  billingAddressRow.instance.props.onPress()
  expect(nextStep.component).toEqual(BillingAddress)

  expect(billingAddressRow.findAllByType(Serif)[1].props.children).toEqual("401 Broadway 25th floor New York NY")
})

it("shows the cc info that the user had typed into the form", () => {
  const creditCardRow = renderer
    .create(
      <Theme>
        <PaymentInfo {...initialProps} />
      </Theme>
    )
    .root.findAllByType(BidInfoRow)[0]
  creditCardRow.instance.props.onPress()
  expect(nextStep.component).toEqual(CreditCardForm)

  expect(creditCardRow.findAllByType(Serif)[1].props.children).toEqual("VISA •••• 4242")
})

const billingAddress = {
  fullName: "Yuki Stockmeier",
  addressLine1: "401 Broadway",
  addressLine2: "25th floor",
  city: "New York",
  state: "NY",
  postalCode: "10013",
}

const creditCardToken = {
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
  navigator: mockNavigator,
  onCreditCardAdded: jest.fn(),
  onBillingAddressAdded: jest.fn(),
  billingAddress,
  creditCardToken,
} as any
