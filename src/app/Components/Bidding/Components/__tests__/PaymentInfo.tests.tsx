import { fireEvent, screen } from "@testing-library/react-native"
import { PaymentInfo } from "app/Components/Bidding/Components/PaymentInfo"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

const mockNavigator = {
  navigate: jest.fn(),
}

jest.useFakeTimers({
  legacyFakeTimers: true,
})

it("renders without throwing an error", () => {
  renderWithWrappers(<PaymentInfo {...initialProps} />)
})

it("shows the cc info that the user had typed into the form", () => {
  renderWithWrappers(<PaymentInfo {...initialProps} />)

  fireEvent.press(screen.getByText("Credit card"))
  expect(mockNavigator.navigate).toHaveBeenCalledWith("CreditCardForm", {
    billingAddress: initialProps.billingAddress,
    onSubmit: expect.any(Function),
  })

  expect(screen.getByText("VISA •••• 4242")).toBeOnTheScreen()
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
  id: "fake-token",
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
