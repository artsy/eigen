import { fireEvent, screen } from "@testing-library/react-native"
import { OrderDetailsBuyerProtection } from "app/Scenes/OrderHistory/OrderDetails/Components/OrderDetailsBuyerProtection"
import { navigate } from "app/system/navigation/navigate"
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

describe("OrderDetailsBuyerProtection", () => {
  const { renderWithRelay } = setupTestWrapper({
    Component: (props: any) => <OrderDetailsBuyerProtection order={props.me.order} {...props} />,
    query: graphql`
      query OrderDetailsBuyerProtectionTestsQuery @relay_test_operation {
        me {
          order(id: "order-id") {
            ...OrderDetailsBuyerProtection_order
          }
        }
      }
    `,
  })

  it("renders the Artsy buyer protection section", () => {
    renderWithRelay({ Order: () => ({ internalID: "order-id" }) })

    expect(screen.getByText("Artsy’s buyer protection")).toBeOnTheScreen()

    fireEvent.press(screen.getByText("Artsy’s buyer protection"))

    expect(navigate).toBeCalledWith("https://support.artsy.net/s/article/The-Artsy-Guarantee")

    expect(mockTrackEvent).toHaveBeenCalledTimes(1)
    expect(mockTrackEvent.mock.calls[0]).toMatchInlineSnapshot(`
    [
      {
        "action": "tappedBuyerProtection",
        "context_module": "ordersDetail",
        "context_screen_owner_id": "order-id",
        "context_screen_owner_type": "orders-detail",
        "destination_screen_owner_slug": "The-Artsy-Guarantee",
        "destination_screen_owner_type": "articles",
      },
    ]
  `)
  })
})
