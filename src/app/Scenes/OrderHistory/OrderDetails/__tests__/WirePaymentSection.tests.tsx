import { screen } from "@testing-library/react-native"
import { WirePaymentSectionTestsQuery } from "__generated__/WirePaymentSectionTestsQuery.graphql"
import { WirePaymentSectionFragmentContainer } from "app/Scenes/OrderHistory/OrderDetails/Components/WirePaymentSection"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

const orderInUSD = {
  code: "111111111",
  currencyCode: "USD",
  source: "artwork_page",
}

const orderInGBP = {
  code: "22222222",
  currencyCode: "GBP",
}

const orderInEUR = {
  code: "33333333",
  currencyCode: "EUR",
}

const privateSaleOrder = {
  code: "44444444",
  currencyCode: "USD",
  source: "private_sale",
}

describe("WirePaymentSection", () => {
  const { renderWithRelay } = setupTestWrapper<WirePaymentSectionTestsQuery>({
    Component: (props) => {
      if (props?.commerceOrder) {
        return <WirePaymentSectionFragmentContainer order={props.commerceOrder} />
      }
      return null
    },
    query: graphql`
      query WirePaymentSectionTestsQuery @relay_test_operation {
        commerceOrder(id: "some-id") {
          ...WirePaymentSection_order
        }
      }
    `,
  })

  it("renders section", async () => {
    renderWithRelay({ CommerceOrder: () => orderInUSD })

    expect(
      screen.getByText("Proceed with the wire transfer to complete your purchase")
    ).toBeTruthy()
    expect(screen.getByText("Send wire transfer to")).toBeTruthy()
    expect(screen.getByText("Bank address")).toBeTruthy()
    expect(screen.getByText(orderInUSD.code)).toBeTruthy()
  })

  it("renders Artsy USD bank account details when order currency is USD", async () => {
    const artsyBankAccountUSD = {
      accountNo: "4243851425",
      routingNo: "121000248",
      swift: "WFBIUS6S",
      addressLine: "420 Montgomery Street",
    }
    renderWithRelay({ CommerceOrder: () => orderInUSD })

    expect(screen.getByText(artsyBankAccountUSD.accountNo)).toBeTruthy()
    expect(screen.getByText(artsyBankAccountUSD.routingNo)).toBeTruthy()
    expect(screen.getByText(artsyBankAccountUSD.swift)).toBeTruthy()
    expect(screen.getByText(artsyBankAccountUSD.addressLine)).toBeTruthy()
  })

  it("renders Artsy GBP bank account details when order currency is GBP", async () => {
    const artsyBankAccountGBP = {
      accountNo: "88005417",
      iban: "GB30PNBP16567188005417",
      swift: "PNBPGB2L",
      sortCode: "16-56-71",
      addressLine: "1 Plantation Place",
      addressLine2: "30 Fenchurch Street",
    }
    renderWithRelay({ CommerceOrder: () => orderInGBP })

    expect(screen.getByText(artsyBankAccountGBP.accountNo)).toBeTruthy()
    expect(screen.getByText(artsyBankAccountGBP.iban)).toBeTruthy()
    expect(screen.getByText(artsyBankAccountGBP.swift)).toBeTruthy()
    expect(screen.getByText(artsyBankAccountGBP.sortCode)).toBeTruthy()
    expect(screen.getByText(artsyBankAccountGBP.addressLine)).toBeTruthy()
    expect(screen.getByText(artsyBankAccountGBP.addressLine2)).toBeTruthy()
  })

  it("renders Artsy EUR bank account details when order currency is EUR", async () => {
    const artsyBankAccountEUR = {
      accountNo: "88005419",
      iban: "GB73PNBP16567188005419",
      swift: "PNBPGB2L",
      addressLine: "1 Plantation Place",
      addressLine2: "30 Fenchurch Street",
    }
    renderWithRelay({ CommerceOrder: () => orderInEUR })

    expect(screen.getByText(artsyBankAccountEUR.accountNo)).toBeTruthy()
    expect(screen.getByText(artsyBankAccountEUR.iban)).toBeTruthy()
    expect(screen.getByText(artsyBankAccountEUR.swift)).toBeTruthy()
    expect(screen.getByText(artsyBankAccountEUR.addressLine)).toBeTruthy()
    expect(screen.getByText(artsyBankAccountEUR.addressLine2)).toBeTruthy()
  })

  it("renders correct email address to send payment receipt for private sale orders", async () => {
    renderWithRelay({ CommerceOrder: () => privateSaleOrder })
    expect(screen.getByText("privatesales@artsy.net")).toBeTruthy()
  })

  it("renders correct email address to send payment receipt for non-private sale orders", async () => {
    renderWithRelay({ CommerceOrder: () => orderInUSD })
    expect(screen.getByText("orders@artsy.net")).toBeTruthy()
  })
})
