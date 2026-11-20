import { screen } from "@testing-library/react-native"
import { Shipping_Test_Query } from "__generated__/Shipping_Test_Query.graphql"
import { ShippingFragmentContainer } from "app/Scenes/Inbox/Components/Conversations/Shipping"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

describe("ShippingFragmentContainer", () => {
  const { renderWithRelay } = setupTestWrapper<Shipping_Test_Query>({
    Component: ({ me }) => {
      return (
        <ShippingFragmentContainer order={me!.conversation!.orderConnection!.edges![0]!.node!} />
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

  it("render CommerceShip", async () => {
    await renderWithRelay({
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

    expect(screen.getByText("Ship to")).toBeDefined()
    expect(screen.getByText("Test User")).toBeDefined()
    expect(screen.getByText("Test Street")).toBeDefined()
    expect(screen.getByText("City, Country, 5012")).toBeDefined()
  })

  it("render CommerceShipArta", async () => {
    await renderWithRelay({
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

    expect(screen.getByText("Ship to")).toBeDefined()
    expect(screen.getByText("Test User")).toBeDefined()
    expect(screen.getByText("Test Street")).toBeDefined()
    expect(screen.getByText("City, Country, 5012")).toBeDefined()
  })

  it("render CommercePickup", async () => {
    await renderWithRelay({
      CommerceOrderConnectionWithTotalCount: () => ({
        edges: [
          {
            node: {
              requestedFulfillment: {
                __typename: "CommercePickup",
              },
              lineItems: {
                edges: [
                  {
                    node: {
                      artwork: {
                        shippingOrigin: "City, State, Country",
                      },
                    },
                  },
                ],
              },
            },
          },
        ],
      }),
    })

    expect(screen.getByText("Pick up (City, State, Country)")).toBeDefined()
    expect(
      screen.getByText(
        "After your order is confirmed, a specialist will contact you within 2 business days to coordinate pickup."
      )
    ).toBeDefined()
  })
})
