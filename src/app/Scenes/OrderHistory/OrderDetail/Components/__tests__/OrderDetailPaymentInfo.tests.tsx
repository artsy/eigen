import { screen } from "@testing-library/react-native"
import { OrderDetailPaymentInfo } from "app/Scenes/OrderHistory/OrderDetail/Components/OrderDetailPaymentInfo"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

describe("OrderDetailPaymentInfo", () => {
  const { renderWithRelay } = setupTestWrapper({
    Component: (props: any) => <OrderDetailPaymentInfo order={props.me.order} />,
    query: graphql`
      query OrderDetailPaymentInfoTestsQuery @relay_test_operation {
        me {
          order(id: "test-order") {
            ...OrderDetailPaymentInfo_order
          }
        }
      }
    `,
  })

  it("renders Apple Pay payment method", () => {
    renderWithRelay({ Order: () => ({ creditCardWalletType: "APPLE_PAY" }) })

    expect(screen.getByText("Payment method")).toBeOnTheScreen()
    expect(screen.getByText("Apple Pay")).toBeOnTheScreen()
  })

  it("renders Google Pay payment method", () => {
    renderWithRelay({ Order: () => ({ creditCardWalletType: "GOOGLE_PAY" }) })

    expect(screen.getByText("Payment method")).toBeOnTheScreen()
    expect(screen.getByText("Google Pay")).toBeOnTheScreen()
  })

  it("prioritizes wallet type over payment method details", () => {
    renderWithRelay({
      Order: () => ({
        creditCardWalletType: "APPLE_PAY",
        paymentMethodDetails: {
          __typename: "CreditCard",
          brand: "VISA",
          lastDigits: "1234",
          expirationMonth: 3,
          expirationYear: 2028,
        },
      }),
    })

    expect(screen.getByText("Apple Pay")).toBeOnTheScreen()
    expect(screen.queryByText("•••• 1234  Exp 03/28")).not.toBeOnTheScreen()
  })

  it("renders credit card payment method with formatted expiration date", () => {
    renderWithRelay({
      Order: () => ({
        creditCardWalletType: null,
        paymentMethodDetails: {
          __typename: "CreditCard",
          brand: "VISA",
          lastDigits: "4242",
          expirationMonth: 3,
          expirationYear: 2025,
        },
      }),
    })

    expect(screen.getByText("Payment method")).toBeOnTheScreen()
    expect(screen.getByText("•••• 4242  Exp 03/25")).toBeOnTheScreen()
  })

  it("renders bank account payment method", () => {
    renderWithRelay({
      Order: () => ({
        creditCardWalletType: null,
        paymentMethodDetails: { __typename: "BankAccount", last4: "5678" },
      }),
    })

    expect(screen.getByText("Payment method")).toBeOnTheScreen()
    expect(screen.getByText("Bank transfer •••• 5678")).toBeOnTheScreen()
  })

  it("renders wire transfer payment method", () => {
    renderWithRelay({
      Order: () => ({
        creditCardWalletType: null,
        paymentMethodDetails: { __typename: "WireTransfer" },
      }),
    })

    expect(screen.getByText("Payment method")).toBeOnTheScreen()
    expect(screen.getByText("Wire transfer")).toBeOnTheScreen()
  })
})
