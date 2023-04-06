import { WirePaymentSectionTestsQuery } from "__generated__/WirePaymentSectionTestsQuery.graphql"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"
import { WirePaymentSectionFragmentContainer } from "./Components/WirePaymentSection"

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
    const { getByText } = renderWithRelay({ CommerceOrder: () => orderInUSD })

    expect(getByText("Proceed with the wire transfer to complete your purchase")).toBeTruthy()
    expect(getByText("Send wire transfer to")).toBeTruthy()
    expect(getByText("Bank address")).toBeTruthy()
    expect(getByText(orderInUSD.code)).toBeTruthy()
  })

  it("renders Artsy USD bank account details when order currency is USD", async () => {
    const artsyBankAccountUSD = {
      accountNo: "4243851425",
      routingNo: "121000248",
      swift: "WFBIUS6S",
      addressLine: "420 Montgomery Street",
    }
    const { getByText } = renderWithRelay({ CommerceOrder: () => orderInUSD })

    expect(getByText(artsyBankAccountUSD.accountNo)).toBeTruthy()
    expect(getByText(artsyBankAccountUSD.routingNo)).toBeTruthy()
    expect(getByText(artsyBankAccountUSD.swift)).toBeTruthy()
    expect(getByText(artsyBankAccountUSD.addressLine)).toBeTruthy()
  })

  it("renders Artsy GBP bank account details when order currency is GBP", async () => {
    const artsyBankAccountGBP = {
      accountNo: "88005417",
      iban: "GB30PNBP16567188005417",
      swift: "PNBPGB2L",
      sortCode: "16-56-71",
      addressLine: "30 Fenchurch Street",
    }
    const { getByText } = renderWithRelay({ CommerceOrder: () => orderInGBP })

    expect(getByText(artsyBankAccountGBP.accountNo)).toBeTruthy()
    expect(getByText(artsyBankAccountGBP.iban)).toBeTruthy()
    expect(getByText(artsyBankAccountGBP.swift)).toBeTruthy()
    expect(getByText(artsyBankAccountGBP.sortCode)).toBeTruthy()
    expect(getByText(artsyBankAccountGBP.addressLine)).toBeTruthy()
  })

  it("renders Artsy EUR bank account details when order currency is EUR", async () => {
    const artsyBankAccountEUR = {
      accountNo: "88005419",
      iban: "GB73PNBP16567188005419",
      swift: "PNBPGB2L",
      addressLine: "30 Fenchurch Street",
    }
    const { getByText } = renderWithRelay({ CommerceOrder: () => orderInEUR })

    expect(getByText(artsyBankAccountEUR.accountNo)).toBeTruthy()
    expect(getByText(artsyBankAccountEUR.iban)).toBeTruthy()
    expect(getByText(artsyBankAccountEUR.swift)).toBeTruthy()
    expect(getByText(artsyBankAccountEUR.addressLine)).toBeTruthy()
  })

  it("renders correct email address to send payment receipt for private sale orders", async () => {
    const { getByText } = renderWithRelay({ CommerceOrder: () => privateSaleOrder })
    expect(getByText("privatesales@artsy.net")).toBeTruthy()
  })

  it("renders correct email address to send payment receipt for non-private sale orders", async () => {
    const { getByText } = renderWithRelay({ CommerceOrder: () => orderInUSD })
    expect(getByText("orders@artsy.net")).toBeTruthy()
  })
})
