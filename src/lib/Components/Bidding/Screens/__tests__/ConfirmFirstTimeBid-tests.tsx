import React from "react"
import { TouchableWithoutFeedback } from "react-native"
import * as renderer from "react-test-renderer"

import { Serif16 } from "../../Elements/Typography"
import { BillingAddress } from "../BillingAddress"
import { ConfirmFirstTimeBid } from "../ConfirmFirstTimeBid"

let nextStep
const mockNavigator = { push: route => (nextStep = route), pop: () => null }
jest.useFakeTimers()

it("renders properly", () => {
  const component = renderer.create(<ConfirmFirstTimeBid {...initialProps} />).toJSON()

  expect(component).toMatchSnapshot()
})

it("shows the billing address that the user typed in the billing address form", () => {
  const billingAddressRow = renderer
    .create(<ConfirmFirstTimeBid {...initialProps} navigator={mockNavigator} />)
    .root.findAllByType(TouchableWithoutFeedback)[1]

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
