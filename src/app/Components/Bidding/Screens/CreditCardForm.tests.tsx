import { Text } from "@artsy/palette-mobile"
import { flushPromiseQueue } from "app/utils/tests/flushPromiseQueue"
import { renderWithWrappersLEGACY } from "app/utils/tests/renderWithWrappers"
import { Button } from "app/Components/Button"
// @ts-expect-error
import stripe from "tipsi-stripe"
import { CreditCardForm } from "./CreditCardForm"

jest.mock("tipsi-stripe", () => ({
  setOptions: jest.fn(),
  PaymentCardTextField: () => "PaymentCardTextField",
  createTokenWithCard: jest.fn(),
}))

const onSubmitMock = jest.fn()

const originalConsoleError = console.error

afterEach(() => {
  console.error = originalConsoleError
})

it("renders without throwing an error", () => {
  renderWithWrappersLEGACY(
    <CreditCardForm navigator={{ push: () => null } as any} onSubmit={onSubmitMock} />
  )
})

it("calls the onSubmit() callback with valid credit card when ADD CREDIT CARD is tapped", async () => {
  stripe.createTokenWithCard.mockReturnValueOnce(stripeToken)
  const wrappedComponent = renderWithWrappersLEGACY(
    <CreditCardForm
      onSubmit={onSubmitMock}
      navigator={
        {
          pop: () => null,
        } as any
      }
    />
  )

  const component = wrappedComponent.root.findByType(CreditCardForm)
  component.instance.setState({ valid: true, params: creditCard })
  component.findByType(Button).props.onPress()

  await flushPromiseQueue()

  expect(onSubmitMock).toHaveBeenCalledWith(stripeToken, creditCard)
})

it("is disabled while the form is invalid", () => {
  stripe.createTokenWithCard.mockReturnValueOnce(stripeToken)
  jest.useFakeTimers({
    legacyFakeTimers: true,
  })
  const wrappedComponent = renderWithWrappersLEGACY(
    <CreditCardForm
      onSubmit={onSubmitMock}
      navigator={
        {
          pop: () => null,
        } as any
      }
    />
  )

  const component = wrappedComponent.root.findByType(CreditCardForm)
  component.instance.setState({ valid: false, params: creditCard })
  expect(component.findByType(Button).props.disabled).toEqual(true)
})

it("is enabled while the form is valid", () => {
  stripe.createTokenWithCard.mockReturnValueOnce(stripeToken)
  jest.useFakeTimers({
    legacyFakeTimers: true,
  })
  const wrappedComponent = renderWithWrappersLEGACY(
    <CreditCardForm
      onSubmit={onSubmitMock}
      navigator={
        {
          pop: () => null,
        } as any
      }
    />
  )

  const component = wrappedComponent.root.findByType(CreditCardForm)
  component.instance.setState({ valid: true, params: creditCard })
  expect(component.findByType(Button).props.disabled).toEqual(false)
})

it("shows an error when stripe's API returns an error", () => {
  console.error = jest.fn()

  stripe.createTokenWithCard = jest.fn()
  stripe.createTokenWithCard.mockImplementationOnce(() => {
    throw new Error("Error tokenizing card")
  })
  jest.useFakeTimers({
    legacyFakeTimers: true,
  })
  const wrappedComponent = renderWithWrappersLEGACY(
    <CreditCardForm
      onSubmit={onSubmitMock}
      navigator={
        {
          pop: () => null,
        } as any
      }
    />
  )

  const component = wrappedComponent.root.findByType(CreditCardForm)
  component.instance.setState({ valid: true, params: creditCard })
  component.findByType(Button).props.onPress()

  // jest.runAllTicks()
  expect(component.findAllByType(Text)[2].props.children).toEqual(
    "There was an error. Please try again."
  )
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
