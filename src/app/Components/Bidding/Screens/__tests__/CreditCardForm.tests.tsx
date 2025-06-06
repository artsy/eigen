import { createToken } from "@stripe/stripe-react-native"
import { Details } from "@stripe/stripe-react-native/lib/typescript/src/types/components/CardFieldInput"
import { fireEvent, screen, waitFor } from "@testing-library/react-native"
import { CreditCardForm } from "app/Components/Bidding/Screens/CreditCardForm"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

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
        accessibilityLabel="Text input field"
        testID={testID}
        onChangeText={(text: string) => {
          const validCard = text === "4242424242424242"
          onCardChange({
            complete: validCard,
            ...creditCard,
            validCVC: "Valid" as any,
            validExpiryDate: "Valid" as any,
            validNumber: "Valid" as any,
            brand: "Visa",
          })
        }}
      />
    ),
    createToken: jest.fn(),
  }
})

const onSubmitMock = jest.fn()

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
  })

  it("renders without throwing an error", () => {
    renderWithWrappers(
      <CreditCardForm navigation={null!} route={{ params: { onSubmit: onSubmitMock } } as any} />
    )
  })

  it("calls the onSubmit() callback with valid credit card when ADD CREDIT CARD is tapped", async () => {
    ;(createToken as jest.Mock).mockReturnValueOnce(stripeToken)

    renderWithWrappers(
      <CreditCardForm
        navigation={null!}
        route={
          {
            params: {
              onSubmit: onSubmitMock,
              billingAddress: { country: { shortName: "US", longName: "United States" } },
            },
          } as any
        }
      />
    )

    const creditCardField = screen.getByTestId("credit-card-field")
    fireEvent.changeText(creditCardField, creditCard.number)

    const nameInput = screen.getByTestId("input-full-name")
    const address1Input = screen.getByTestId("input-address-1")
    const address2Input = screen.getByTestId("input-address-2")
    const cityInput = screen.getByTestId("input-city")
    const stateInput = screen.getByTestId("input-state")
    const postalCodeInput = screen.getByTestId("input-postal-code")
    const phoneInput = screen.getByTestId("input-phone")

    fireEvent.changeText(nameInput, "mockName")
    fireEvent.changeText(address1Input, "mockAddress1")
    fireEvent.changeText(address2Input, "mockAddress2")
    fireEvent.changeText(cityInput, "mockCity")
    fireEvent.changeText(stateInput, "mockState")
    fireEvent.changeText(postalCodeInput, "mockPostcode")
    fireEvent.changeText(phoneInput, "mockPhone")

    const addButton = screen.getByTestId("credit-card-form-button")

    fireEvent.press(addButton)

    await waitFor(() => expect(createToken).toHaveBeenCalled())

    expect(onSubmitMock).toHaveBeenCalledWith(stripeToken.token, {
      addressLine1: "mockAddress1",
      addressLine2: "mockAddress2",
      city: "mockCity",
      country: {
        longName: "United States",
        shortName: "US",
      },
      fullName: "mockName",
      phoneNumber: "mockPhone",
      postalCode: "mockPostcode",
      state: "mockState",
    })
  })

  it("is does not call onSubmit while the form is invalid", () => {
    ;(createToken as jest.Mock).mockReturnValueOnce(stripeToken)

    renderWithWrappers(
      <CreditCardForm navigation={null!} route={{ params: { onSubmit: onSubmitMock } } as any} />
    )

    const creditCardField = screen.getByTestId("credit-card-field")
    fireEvent.changeText(creditCardField, "4242") // incomplete number

    const addButton = screen.getByTestId("credit-card-form-button")

    fireEvent.press(addButton)

    expect(onSubmitMock).not.toHaveBeenCalled()
  })

  it("is is disabled while the form is invalid", async () => {
    ;(createToken as jest.Mock).mockReturnValueOnce(stripeToken)

    renderWithWrappers(
      <CreditCardForm navigation={null!} route={{ params: { onSubmit: onSubmitMock } } as any} />
    )

    const creditCardField = screen.getByTestId("credit-card-field")
    fireEvent.changeText(creditCardField, "4242") // incomplete number

    const addButton = screen.getByTestId("credit-card-form-button")

    await waitFor(() => expect(addButton.props.accessibilityState.disabled).toEqual(true))
  })

  it("is enabled while the form is valid", async () => {
    ;(createToken as jest.Mock).mockReturnValueOnce(stripeToken)

    renderWithWrappers(
      <CreditCardForm
        navigation={null!}
        route={
          {
            params: {
              onSubmit: onSubmitMock,
              billingAddress: {
                fullName: "mockName",
                addressLine1: "mockAddress1",
                addressLine2: "mockAddress2",
                city: "mockCity",
                state: "mockState",
                postalCode: "mockPostalCode",
                phoneNumber: "mockPhone",
                country: { shortName: "US", longName: "United States" },
              },
            },
          } as any
        }
      />
    )

    const creditCardField = screen.getByTestId("credit-card-field")
    fireEvent.changeText(creditCardField, creditCard.number)

    const addButton = screen.getByTestId("credit-card-form-button")

    await waitFor(() => expect(addButton.props.accessibilityState.disabled).toEqual(false))
  })

  it("is disabled when the form is invalid", async () => {
    renderWithWrappers(
      <CreditCardForm
        navigation={null!}
        route={
          {
            params: {
              onSubmit: onSubmitMock,
              billingAddress: {
                fullName: "mockName",
                addressLine1: "mockAddress1",
                addressLine2: "mockAddress2",
                city: "mockCity",
                state: "mockState",
                postalCode: "mockPostalCode",
                phoneNumber: "mockPhone",
                country: { shortName: "US", longName: "United States" },
              },
            },
          } as any
        }
      />
    )

    const creditCardField = screen.getByTestId("credit-card-field")
    fireEvent.changeText(creditCardField, "4242") // incomplete number

    const addButton = screen.getByTestId("credit-card-form-button")

    await waitFor(() => expect(addButton.props.accessibilityState.disabled).toEqual(true))
  })

  it("shows an error when stripe's API returns an error", async () => {
    console.error = jest.fn()
    ;(createToken as jest.Mock).mockResolvedValueOnce({ error: "error" })

    renderWithWrappers(
      <CreditCardForm
        navigation={null!}
        route={
          {
            params: {
              onSubmit: onSubmitMock,
              billingAddress: {
                fullName: "mockName",
                addressLine1: "mockAddress1",
                addressLine2: "mockAddress2",
                city: "mockCity",
                state: "mockState",
                postalCode: "mockPostalCode",
                phoneNumber: "mockPhone",
                country: { shortName: "US", longName: "United States" },
              },
            },
          } as any
        }
      />
    )

    const creditCardField = screen.getByTestId("credit-card-field")
    fireEvent.changeText(creditCardField, creditCard.number)

    const addButton = screen.getByTestId("credit-card-form-button")
    fireEvent.press(addButton)

    await waitFor(() => expect(console.error).toHaveBeenCalled())

    expect(screen.getByTestId("credit-card-error-message")).toBeOnTheScreen()
    expect(screen.getByText("There was an error. Please try again.")).toBeOnTheScreen()
  })
})
