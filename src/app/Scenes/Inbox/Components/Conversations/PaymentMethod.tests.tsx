import { setupTestWrapperTL } from "app/tests/setupTestWrapper"
import { Theme } from "palette"
import React from "react"
import { graphql } from "react-relay"
import { PaymentMethodFragmentContainer } from "./PaymentMethod"

jest.unmock("react-relay")

describe("PaymentMethodFragmentContainer", () => {
  const { renderWithRelay } = setupTestWrapperTL({
    Component: ({ me }) => {
      return (
        <Theme>
          <PaymentMethodFragmentContainer order={me.conversation.orderConnection.edges[0].node} />
        </Theme>
      )
    },
    query: graphql`
      query PaymentMethod_Test_Query {
        me {
          conversation(id: "test-id") {
            orderConnection(first: 10) {
              edges {
                node {
                  ...PaymentMethod_order
                }
              }
            }
          }
        }
      }
    `,
  })

  it("render", () => {
    const { getByText } = renderWithRelay({
      CommerceOrderConnectionWithTotalCount: () => ({
        edges: [
          {
            node: {
              creditCard: {
                lastDigits: "1234",
                expirationMonth: "2",
                expirationYear: "2022",
              },
            },
          },
        ],
      }),
    })

    expect(getByText("Payment Method")).toBeDefined()
    expect(getByText("•••• 1234 Exp 02/22")).toBeDefined()
  })
})
