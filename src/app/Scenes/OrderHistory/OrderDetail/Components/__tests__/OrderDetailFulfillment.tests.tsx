import { screen } from "@testing-library/react-native"
import { OrderDetailFulfillmentTestsQuery } from "__generated__/OrderDetailFulfillmentTestsQuery.graphql"
import { OrderDetailFulfillment } from "app/Scenes/OrderHistory/OrderDetail/Components/OrderDetailFulfillment"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

describe("OrderDetailFulfillment", () => {
  const { renderWithRelay } = setupTestWrapper<OrderDetailFulfillmentTestsQuery>({
    Component: (props: any) => <OrderDetailFulfillment order={props.me.order} />,
    query: graphql`
      query OrderDetailFulfillmentTestsQuery @relay_test_operation {
        me {
          order(id: "order-id") {
            ...OrderDetailFulfillment_order
          }
        }
      }
    `,
  })

  it("renders shipping section with complete address", () => {
    renderWithRelay({
      Order: () => ({
        fulfillmentDetails: {
          name: "Percy",
          addressLine1: "401 Broadway",
          addressLine2: "Apt 4BC",
          city: "New York",
          region: "NY",
          postalCode: "10013",
          country: "US",
          phoneNumber: { display: "(123) 456-7890" },
        },
      }),
    })

    expect(screen.getByText("Ship to")).toBeOnTheScreen()
    expect(screen.getByText("Percy")).toBeOnTheScreen()
    expect(screen.getByText("401 Broadway")).toBeOnTheScreen()
    expect(screen.getByText("Apt 4BC")).toBeOnTheScreen()
    expect(screen.getByText("New York, NY, 10013")).toBeOnTheScreen()
    expect(screen.getByText("United States")).toBeOnTheScreen()
    expect(screen.getByText("(123) 456-7890")).toBeOnTheScreen()
  })

  it("renders pickup section with pickup location", () => {
    renderWithRelay({
      Order: () => ({
        selectedFulfillmentOption: { type: "PICKUP" },
        shippingOrigin: "Gagosian Gallery, 980 Madison Avenue, New York, NY 10075",
      }),
    })

    expect(screen.getByText("Pickup")).toBeOnTheScreen()
    expect(
      screen.getByText("Gagosian Gallery, 980 Madison Avenue, New York, NY 10075")
    ).toBeOnTheScreen()
  })
})
