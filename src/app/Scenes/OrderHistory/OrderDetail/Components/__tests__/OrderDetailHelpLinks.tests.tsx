import { fireEvent, screen } from "@testing-library/react-native"
import { OrderDetailHelpLinks } from "app/Scenes/OrderHistory/OrderDetail/Components/OrderDetailHelpLinks"
import { navigate } from "app/system/navigation/navigate"
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

describe("OrderDetailHelpLinks", () => {
  const { renderWithRelay } = setupTestWrapper({
    Component: (props: any) => <OrderDetailHelpLinks order={props.me.order} {...props} />,
    query: graphql`
      query OrderDetailHelpLinksTestsQuery @relay_test_operation {
        me {
          order(id: "order-id") {
            ...OrderDetailHelpLinks_order
          }
        }
      }
    `,
  })

  it("renders the help link section", () => {
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
})
