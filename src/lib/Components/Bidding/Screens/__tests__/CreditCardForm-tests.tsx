import { Sans, Theme } from "@artsy/palette"
import React from "react"
import * as renderer from "react-test-renderer"

import { Button } from "../../Components/Button"
import { CreditCardForm } from "../CreditCardForm"

jest.mock("tipsi-stripe", () => ({
  setOptions: jest.fn(),
  PaymentCardTextField: () => "PaymentCardTextField",
  createTokenWithCard: jest.fn(),
}))
import stripe from "tipsi-stripe"

const onSubmitMock = jest.fn()

const originalConsoleError = console.error

afterEach(() => {
  console.error = originalConsoleError
})

it("renders properly", () => {
  const component = renderer.create(<CreditCardForm onSubmit={onSubmitMock} />).toJSON()
  expect(component).toMatchSnapshot()
})

it("calls the onSubmit() callback with valid credit card when ADD CREDIT CARD is tapped", () => {
  stripe.createTokenWithCard.mockReturnValueOnce(stripeToken)
  jest.useFakeTimers()
  const component = renderer.create(
    <CreditCardForm
      onSubmit={onSubmitMock}
      navigator={
        {
          pop: () => null,
        } as any
      }
    />
  )

  component.root.instance.setState({ valid: true, params: creditCard })
  component.root.findByType(Button).instance.props.onPress()

  jest.runAllTicks()

  expect(onSubmitMock).toHaveBeenCalledWith(stripeToken, creditCard)
})

it("is disabled while the form is invalid", () => {
  stripe.createTokenWithCard.mockReturnValueOnce(stripeToken)
  jest.useFakeTimers()
  const component = renderer.create(
    <CreditCardForm
      onSubmit={onSubmitMock}
      navigator={
        {
          pop: () => null,
        } as any
      }
    />
  )

  component.root.instance.setState({ valid: false, params: creditCard })
  expect(component.root.findByType(Button).props.disabled).toEqual(true)
})

it("is enabled while the form is valid", () => {
  stripe.createTokenWithCard.mockReturnValueOnce(stripeToken)
  jest.useFakeTimers()
  const component = renderer.create(
    <CreditCardForm
      onSubmit={onSubmitMock}
      navigator={
        {
          pop: () => null,
        } as any
      }
    />
  )

  component.root.instance.setState({ valid: true, params: creditCard })
  expect(component.root.findByType(Button).props.disabled).toEqual(false)
})

// FIXME: Reenable test
xit("shows an error when stripe's API returns an error", () => {
  console.error = jest.fn()

  stripe.createTokenWithCard = jest.fn()
  stripe.createTokenWithCard.mockImplementationOnce(() => {
    throw new Error("Error tokenizing card")
  })
  jest.useFakeTimers()
  const component = renderer.create(
    <CreditCardForm
      onSubmit={onSubmitMock}
      navigator={
        {
          pop: () => null,
        } as any
      }
    />
  )

  component.root.instance.setState({ valid: true, params: creditCard })
  component.root.findByType(Button).instance.props.onPress()

  jest.runAllTicks()
  expect(component.root.findByType(Sans).props.children).toEqual("There was an error. Please try again.")
})

const creditCard = {
  number: "4242424242424242",
  expMonth: "04",
  expYear: "20",
  cvc: "314",
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
