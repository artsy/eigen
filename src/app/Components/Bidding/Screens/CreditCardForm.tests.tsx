import { Text, Button } from "@artsy/palette-mobile"
import { createToken } from "@stripe/stripe-react-native"
import { flushPromiseQueue } from "app/utils/tests/flushPromiseQueue"
import { renderWithWrappersLEGACY } from "app/utils/tests/renderWithWrappers"
import { CreditCardForm } from "./CreditCardForm"

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
  ;(createToken as jest.Mock).mockReturnValueOnce(stripeToken)
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

  expect(onSubmitMock).toHaveBeenCalledWith(stripeToken.token, creditCard)
})

it("is disabled while the form is invalid", () => {
  ;(createToken as jest.Mock).mockReturnValueOnce(stripeToken)
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
  ;(createToken as jest.Mock).mockReturnValueOnce(stripeToken)
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
// TODO:
// Running this test isolated it's fine, but running altogether fails
// needs to be re-visited to be fixed
it.skip("shows an error when stripe's API returns an error", async () => {
  console.error = jest.fn()
  ;(createToken as jest.Mock).mockResolvedValueOnce({ error: "error" })
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

  jest.runAllTicks()
  expect(
    wrappedComponent.root.findByType(CreditCardForm).findAllByType(Text)[2].props.children
  ).toEqual("There was an error. Please try again.")
})

const creditCard = {
  number: "4242424242424242",
  expMonth: "04",
  expYear: "20",
  cvc: "314",
}

const stripeToken = {
  token: {
    id: "fake-token",
    created: "1528229731",
    livemode: 0,
    card: {
      brand: "VISA",
      last4: "4242",
    },
    bankAccount: null,
    extra: null,
  },
}
