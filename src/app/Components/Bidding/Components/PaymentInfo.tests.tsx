import { renderWithWrappers } from "app/tests/renderWithWrappers"
import { Text } from "palette"
import React from "react"

import { BillingAddress } from "../Screens/BillingAddress"
import { CreditCardForm } from "../Screens/CreditCardForm"
import { PaymentInfo } from "./PaymentInfo"

import { BidInfoRow } from "../Components/BidInfoRow"

jest.mock("tipsi-stripe", () => ({
  setOptions: jest.fn(),
  paymentRequestWithCardForm: jest.fn(),
  createTokenWithCard: jest.fn(),
}))

// @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
let nextStep
// @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
const mockNavigator = { push: (route) => (nextStep = route), pop: () => null }
jest.useFakeTimers()

it("renders without throwing an error", () => {
  renderWithWrappers(<PaymentInfo {...initialProps} />)
})

it("shows the billing address that the user typed in the billing address form", () => {
  const billingAddressRow = renderWithWrappers(
    <PaymentInfo {...initialProps} />
  ).root.findAllByType(BidInfoRow)[1]
  billingAddressRow.instance.props.onPress()
  // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
  expect(nextStep.component).toEqual(BillingAddress)

  expect(billingAddressRow.findAllByType(Text)[1].props.children).toEqual(
    "401 Broadway 25th floor New York NY"
  )
})

it("shows the cc info that the user had typed into the form", () => {
  const creditCardRow = renderWithWrappers(<PaymentInfo {...initialProps} />).root.findAllByType(
    BidInfoRow
  )[0]
  creditCardRow.instance.props.onPress()
  // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
  expect(nextStep.component).toEqual(CreditCardForm)

  expect(creditCardRow.findAllByType(Text)[1].props.children).toEqual("VISA •••• 4242")
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
