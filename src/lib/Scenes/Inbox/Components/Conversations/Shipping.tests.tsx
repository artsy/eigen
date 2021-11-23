import { setupTestWrapperTL } from "lib/tests/setupTestWrapper"
import { Theme } from "palette"
import React from "react"
import { graphql } from "react-relay"
import { ShippingFragmentContainer } from "./Shipping"

jest.unmock("react-relay")

describe("ShippingFragmentContainer", () => {
  const { renderWithRelay } = setupTestWrapperTL({
    Component: ({ me }) => {
      return (
        <Theme>
          <ShippingFragmentContainer order={me.conversation.orderConnection.edges[0].node} />
        </Theme>
      )
    },
    query: graphql`
      query Shipping_Test_Query {
        me {
          conversation(id: "test-id") {
            orderConnection(first: 10) {
              edges {
                node {
                  ...Shipping_order
                }
              }
            }
          }
        }
      }
    `,
  })

  it("render CommerceShip", () => {
    const { getByText } = renderWithRelay({
      CommerceOrderConnectionWithTotalCount: () => ({
        edges: [
          {
            node: {
              requestedFulfillment: {
                __typename: "CommerceShip",
                name: "Test User",
                addressLine1: "Test Street",
                city: "City",
                country: "Country",
                postalCode: "5012",
              },
            },
          },
        ],
      }),
    })

    expect(getByText("Ship to")).toBeDefined()
    expect(getByText("Test User")).toBeDefined()
    expect(getByText("Test Street")).toBeDefined()
    expect(getByText("City, Country, 5012")).toBeDefined()
  })

  it("render CommerceShipArta", () => {
    const { getByText } = renderWithRelay({
      CommerceOrderConnectionWithTotalCount: () => ({
        edges: [
          {
            node: {
              requestedFulfillment: {
                __typename: "CommerceShipArta",
                name: "Test User",
                addressLine1: "Test Street",
                city: "City",
                country: "Country",
                postalCode: "5012",
              },
            },
          },
        ],
      }),
    })

    expect(getByText("Ship to")).toBeDefined()
    expect(getByText("Test User")).toBeDefined()
    expect(getByText("Test Street")).toBeDefined()
    expect(getByText("City, Country, 5012")).toBeDefined()
  })
})
