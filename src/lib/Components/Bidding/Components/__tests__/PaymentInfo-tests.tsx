import { Serif } from "@artsy/palette"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import React from "react"

import { BillingAddress } from "../../Screens/BillingAddress"
import { CreditCardForm } from "../../Screens/CreditCardForm"
import { PaymentInfo } from "../PaymentInfo"

import { BidInfoRow } from "../../Components/BidInfoRow"

import { BiddingThemeProvider } from "../BiddingThemeProvider"

jest.mock("tipsi-stripe", () => ({
  setOptions: jest.fn(),
  paymentRequestWithCardForm: jest.fn(),
  createTokenWithCard: jest.fn(),
}))

// @ts-ignore STRICTNESS_MIGRATION
let nextStep
// @ts-ignore STRICTNESS_MIGRATION
const mockNavigator = { push: route => (nextStep = route), pop: () => null }
jest.useFakeTimers()

it("renders without throwing an error", () => {
  renderWithWrappers(
    <BiddingThemeProvider>
      <PaymentInfo {...initialProps} />
    </BiddingThemeProvider>
  )
})

it("shows the billing address that the user typed in the billing address form", () => {
  const billingAddressRow = renderWithWrappers(
    <BiddingThemeProvider>
      <PaymentInfo {...initialProps} />
    </BiddingThemeProvider>
  ).root.findAllByType(BidInfoRow)[1]
  billingAddressRow.instance.props.onPress()
  // @ts-ignore STRICTNESS_MIGRATION
  expect(nextStep.component).toEqual(BillingAddress)

  expect(billingAddressRow.findAllByType(Serif)[1].props.children).toEqual("401 Broadway 25th floor New York NY")
})

it("shows the cc info that the user had typed into the form", () => {
  const creditCardRow = renderWithWrappers(
    <BiddingThemeProvider>
      <PaymentInfo {...initialProps} />
    </BiddingThemeProvider>
  ).root.findAllByType(BidInfoRow)[0]
  creditCardRow.instance.props.onPress()
  // @ts-ignore STRICTNESS_MIGRATION
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
