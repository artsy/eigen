import { Text } from "@artsy/palette-mobile"
import { BidInfoRow } from "app/Components/Bidding/Components/BidInfoRow"
import { CreditCardForm } from "app/Components/Bidding/Screens/CreditCardForm"
import NavigatorIOS, {
  NavigatorIOSPushArgs,
} from "app/utils/__legacy_do_not_use__navigator-ios-shim"
import { renderWithWrappersLEGACY } from "app/utils/tests/renderWithWrappers"

import { PaymentInfo } from "./PaymentInfo"

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

it("shows the cc info that the user had typed into the form", async () => {
  const { root } = renderWithWrappersLEGACY(<PaymentInfo {...initialProps} />)

  const creditCardRow = await root.findAllByType(BidInfoRow)

  creditCardRow[0].instance.props.onPress()
  expect(nextStep.component).toEqual(CreditCardForm)

  const creditCardRowText = await creditCardRow[0].findAllByType(Text)

  expect(creditCardRowText[1].props.children).toEqual("VISA •••• 4242")
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
