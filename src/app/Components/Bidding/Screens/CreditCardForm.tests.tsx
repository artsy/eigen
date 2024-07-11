import { createToken } from "@stripe/stripe-react-native"
import { Details } from "@stripe/stripe-react-native/lib/typescript/src/types/components/CardFieldInput"
import { fireEvent } from "@testing-library/react-native"
import { flushPromiseQueue } from "app/utils/tests/flushPromiseQueue"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { CreditCardForm } from "./CreditCardForm"

const creditCard = {
  number: "4242424242424242",
  expiryMonth: 4,
  expiryYear: 20,
  cvc: "314",
  last4: "4242",
}

jest.mock("@stripe/stripe-react-native", () => {
  const { TextInput } = require("react-native")
  return {
    CardField: ({
      onCardChange,
      testID,
    }: {
      onCardChange: (card: Details) => void
      testID: string
    }) => (
      <TextInput
        testID={testID}
        onChangeText={(text: string) => {
          if (text === "4242424242424242") {
            // valid card
            onCardChange({
              complete: true,
              ...creditCard,
              validCVC: "Valid" as any,
              validExpiryDate: "Valid" as any,
              validNumber: "Valid" as any,
              brand: "Visa",
            })
          } else {
            console.log("Invalid card")
            // invalid card
            onCardChange({
              complete: false,
              ...creditCard,
              validCVC: "Valid" as any,
              validExpiryDate: "Valid" as any,
              validNumber: "Valid" as any,
              brand: "Visa",
            })
          }
        }}
      />
    ),
    createToken: jest.fn(),
  }
})

describe("CreditCardForm", () => {
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

  const originalConsoleError = console.error

  afterEach(() => {
    console.error = originalConsoleError
    jest.clearAllMocks()
    jest.resetAllMocks()
  })

  it("renders without throwing an error", () => {
    const onSubmitMock = jest.fn()

    renderWithWrappers(
      <CreditCardForm navigator={{ push: () => null } as any} onSubmit={onSubmitMock} />
    )
  })

  it("calls the onSubmit() callback with valid credit card when ADD CREDIT CARD is tapped", async () => {
    const onSubmitMock = jest.fn()

    ;(createToken as jest.Mock).mockReturnValueOnce(stripeToken)

    const { getByTestId } = renderWithWrappers(
      <CreditCardForm
        onSubmit={onSubmitMock}
        navigator={
          {
            pop: () => null,
          } as any
        }
      />
    )

    const creditCardField = getByTestId("credit-card-field")
    fireEvent.changeText(creditCardField, creditCard.number)

    const addButton = getByTestId("add-credit-card-button")

    fireEvent.press(addButton)

    await flushPromiseQueue()

    expect(onSubmitMock).toHaveBeenCalledWith(stripeToken.token, {
      expiryMonth: creditCard.expiryMonth,
      expiryYear: creditCard.expiryYear,
      last4: creditCard.last4,
    })
  })

  it("is does not call onSubmit while the form is invalid", async () => {
    const onSubmitMock = jest.fn()

    ;(createToken as jest.Mock).mockReturnValueOnce(stripeToken)

    const { getByTestId } = renderWithWrappers(
      <CreditCardForm
        onSubmit={onSubmitMock}
        navigator={
          {
            pop: () => null,
          } as any
        }
      />
    )

    const creditCardField = getByTestId("credit-card-field")
    fireEvent.changeText(creditCardField, "4242") // incomplete number

    await flushPromiseQueue()

    const addButton = getByTestId("add-credit-card-button")

    fireEvent.press(addButton)

    expect(onSubmitMock).not.toHaveBeenCalled()
  })

  it("is is disabled while the form is invalid", async () => {
    const onSubmitMock = jest.fn()

    ;(createToken as jest.Mock).mockReturnValueOnce(stripeToken)

    const { getByTestId } = renderWithWrappers(
      <CreditCardForm
        onSubmit={onSubmitMock}
        navigator={
          {
            pop: () => null,
          } as any
        }
      />
    )

    const creditCardField = getByTestId("credit-card-field")
    fireEvent.changeText(creditCardField, "4242") // incomplete number

    await flushPromiseQueue()

    const addButton = getByTestId("add-credit-card-button")

    expect(addButton.props.accessibilityState.disabled).toEqual(true)
  })

  it("is enabled while the form is valid", async () => {
    const onSubmitMock = jest.fn()

    ;(createToken as jest.Mock).mockReturnValueOnce(stripeToken)

    const { getByTestId } = renderWithWrappers(
      <CreditCardForm
        onSubmit={onSubmitMock}
        navigator={
          {
            pop: () => null,
          } as any
        }
      />
    )

    const creditCardField = getByTestId("credit-card-field")
    fireEvent.changeText(creditCardField, creditCard.number)

    await flushPromiseQueue()

    const addButton = getByTestId("add-credit-card-button")

    expect(addButton.props.accessibilityState.disabled).toEqual(false)
  })

  it("shows an error when stripe's API returns an error", async () => {
    const onSubmitMock = jest.fn()

    console.error = jest.fn()
    ;(createToken as jest.Mock).mockResolvedValueOnce({ error: "error" })

    const { getByTestId } = renderWithWrappers(
      <CreditCardForm
        onSubmit={onSubmitMock}
        navigator={
          {
            pop: () => null,
          } as any
        }
      />
    )

    const creditCardField = getByTestId("credit-card-field")
    fireEvent.changeText(creditCardField, creditCard.number)

    const addButton = getByTestId("add-credit-card-button")
    fireEvent.press(addButton)

    await flushPromiseQueue()

    const errorMessage = getByTestId("error-message")
    expect(errorMessage.props.children).toEqual("There was an error. Please try again.")
  })
})
