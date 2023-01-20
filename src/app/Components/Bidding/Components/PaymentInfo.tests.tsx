import { renderWithWrappersLEGACY } from "app/utils/tests/renderWithWrappers"
import { Text } from "palette"

import { BillingAddress } from "../Screens/BillingAddress"
import { CreditCardForm } from "../Screens/CreditCardForm"
import { PaymentInfo } from "./PaymentInfo"

import NavigatorIOS, {
  NavigatorIOSPushArgs,
} from "app/utils/__legacy_do_not_use__navigator-ios-shim"
import { BidInfoRow } from "../Components/BidInfoRow"

jest.mock("tipsi-stripe", () => ({
  setOptions: jest.fn(),
  paymentRequestWithCardForm: jest.fn(),
  createTokenWithCard: jest.fn(),
}))

let nextStep: NavigatorIOSPushArgs
const mockNavigator: Partial<NavigatorIOS> = {
  push: (route) => {
    nextStep = route
  },
  pop: () => null,
}
jest.useFakeTimers({
  legacyFakeTimers: true,
})

it("renders without throwing an error", () => {
  renderWithWrappersLEGACY(<PaymentInfo {...initialProps} />)
})

it("shows the billing address that the user typed in the billing address form", () => {
  const billingAddressRow = renderWithWrappersLEGACY(
    <PaymentInfo {...initialProps} />
  ).root.findAllByType(BidInfoRow)[1]
  billingAddressRow.instance.props.onPress()
  expect(nextStep.component).toEqual(BillingAddress)

  expect(billingAddressRow.findAllByType(Text)[1].props.children).toEqual(
    "401 Broadway 25th floor New York NY"
  )
})

it("shows the cc info that the user had typed into the form", () => {
  const creditCardRow = renderWithWrappersLEGACY(
    <PaymentInfo {...initialProps} />
  ).root.findAllByType(BidInfoRow)[0]
  creditCardRow.instance.props.onPress()
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
