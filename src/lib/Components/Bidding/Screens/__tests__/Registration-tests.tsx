import React from "react"
import * as renderer from "react-test-renderer"

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

it("renders properly", () => {
  const component = renderer.create(<Registration {...initialProps} />).toJSON()
  expect(component).toMatchSnapshot()
})

it("shows the billing address that the user typed in the billing address form", () => {
  const billingAddressRow = renderer.create(<Registration {...initialProps} />).root.findAllByType(BidInfoRow)[1]
  billingAddressRow.instance.props.onPress()
  expect(nextStep.component).toEqual(BillingAddress)

  nextStep.passProps.onSubmit(billingAddress)

  expect(billingAddressRow.findByType(Serif16).props.children).toEqual("401 Broadway 25th floor New York NY")
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
  },
}

const initialProps = {
  sale,
  relay: { environment: null },
  navigator: mockNavigator,
} as any
