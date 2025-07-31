import { fireEvent, screen } from "@testing-library/react-native"
import { OrderDetailHelpLinksTestsQuery } from "__generated__/OrderDetailHelpLinksTestsQuery.graphql"
import { OrderDetailHelpLinks } from "app/Scenes/OrderHistory/OrderDetail/Components/OrderDetailHelpLinks"
import { navigate } from "app/system/navigation/navigate"
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

describe("OrderDetailHelpLinks", () => {
  const { renderWithRelay } = setupTestWrapper<OrderDetailHelpLinksTestsQuery>({
    Component: (props) => <OrderDetailHelpLinks order={props.me!.order!} me={props.me!} />,
    query: graphql`
      query OrderDetailHelpLinksTestsQuery @relay_test_operation {
        me {
          ...OrderDetailHelpLinks_me
          order(id: "order-id") {
            ...OrderDetailHelpLinks_order
          }
        }
      }
    `,
  })

  it("navigates to the help link", () => {
    renderWithRelay({
      Order: () => ({ mode: "BUY", source: "PARTNER_OFFER", internalID: "order-id" }),
    })

    expect(screen.getByText("Visit our help center")).toBeOnTheScreen()

    fireEvent.press(screen.getByText("Visit our help center"))

    expect(navigate).toBeCalledWith("https://support.artsy.net/s/topic/0TO3b000000UessGAC/buy")
    expect(mockTrackEvent).toHaveBeenCalledTimes(1)
    expect(mockTrackEvent.mock.calls[0]).toMatchInlineSnapshot(`
    [
      {
        "action": "tappedVisitHelpCenter",
        "context_module": "ordersDetail",
        "context_screen_owner_id": "order-id",
        "context_screen_owner_type": "orders-detail",
        "destination_screen_owner_slug": "0TO3b000000UessGAC/buy",
        "destination_screen_owner_type": "articles",
        "flow": "Partner offer",
      },
    ]
  `)
  })

  it("opens ask specialist modal", () => {
    renderWithRelay({ Order: () => ({ mode: "OFFER", internalID: "order-id" }) })

    expect(screen.getByText("ask a question")).toBeOnTheScreen()
    fireEvent.press(screen.getByText("ask a question"))

    expect(
      screen.getByText(
        "An Artsy Specialist is available to answer your questions and help you collect through Artsy."
      )
    ).toBeOnTheScreen()
    expect(mockTrackEvent).toHaveBeenCalledTimes(1)
    expect(mockTrackEvent.mock.calls[0]).toMatchInlineSnapshot(`
    [
      {
        "action": "tappedAskSpecialist",
        "context_module": "ordersDetail",
        "context_screen_owner_id": "order-id",
        "context_screen_owner_type": "orders-detail",
        "flow": "Make offer",
      },
    ]
  `)
  })
})
