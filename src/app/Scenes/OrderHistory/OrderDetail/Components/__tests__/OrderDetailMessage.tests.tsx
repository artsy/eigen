import { fireEvent, screen, waitFor } from "@testing-library/react-native"
import { OrderDetailMessageTestsQuery } from "__generated__/OrderDetailMessageTestsQuery.graphql"
import { OrderDetailMessage } from "app/Scenes/OrderHistory/OrderDetail/Components/OrderDetailMessage"
import { navigate } from "app/system/navigation/navigate"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { Linking } from "react-native"
import { graphql } from "react-relay"

describe("OrderDetailMessage", () => {
  const { renderWithRelay } = setupTestWrapper<OrderDetailMessageTestsQuery>({
    Component: (props: any) => <OrderDetailMessage order={props.me.order} />,
    query: graphql`
      query OrderDetailMessageTestsQuery @relay_test_operation {
        me {
          order(id: "order-id") {
            ...OrderDetailMessage_order
          }
        }
      }
    `,
  })

  describe("order messages", () => {
    it.each([
      [
        "SUBMITTED_ORDER",
        "Thank you! Your order is being processed.",
        "The gallery will confirm by",
      ],
      [
        "SUBMITTED_OFFER",
        "Thank you! Your offer has been submitted",
        "The gallery will respond to your offer by",
      ],
      ["PAYMENT_FAILED", "To complete your purchase", "update your payment details"],
      [
        "PROCESSING_PAYMENT_PICKUP",
        "Thank you for your purchase.",
        "You will be notified when the work is available for pickup.",
      ],
      [
        "PROCESSING_PAYMENT_SHIP",
        "Thank you for your purchase.",
        "You will be notified when the work has shipped.",
      ],
      [
        "PROCESSING_WIRE",
        "Your order has been confirmed.",
        "Please proceed with the wire transfer within 7 days to complete your purchase.",
      ],
      [
        "APPROVED_PICKUP",
        "Thank you for your purchase.",
        "A specialist will contact you within 2 business days to coordinate pickup.",
      ],
      [
        "APPROVED_SHIP_EXPRESS",
        "Your order will be processed and packaged, and you will be notified once it ships.",
        "Once shipped, your order will be delivered in 2 business days.",
      ],
      [
        "APPROVED_SHIP_STANDARD",
        "Your order will be processed and packaged, and you will be notified once it ships.",
        "Once shipped, your order will be delivered in 3-5 business days.",
      ],
      [
        "APPROVED_SHIP_WHITE_GLOVE",
        "Your order has been confirmed. Thank you for your purchase.",
        "Once shipped, you will receive a notification and further details.",
      ],
      [
        "APPROVED_SHIP",
        "Your order has been confirmed. Thank you for your purchase.",
        "You will be notified when the work has shipped, typically within 5-7 business days.",
      ],
      ["SHIPPED", "Your work is on its way.", "your Collection on Artsy"],
      [
        "COMPLETED_PICKUP",
        "We hope you love your purchase!",
        "Your feedback is valuable—share any thoughts with us at",
      ],
      [
        "COMPLETED_SHIP",
        "We hope you love your purchase!",
        "Your feedback is valuable—share any thoughts with us at",
      ],
      ["CANCELED", "Your order could not be processed.", "orders@artsy.net"],
      [
        "DECLINED_BY_BUYER",
        "The seller will be informed of your decision to decline the offer",
        "We’d love to hear your feedback—reach out to us",
      ],
      [
        "DECLINED_BY_SELLER",
        "Unfortunately, the seller declined your offer, ending the current negotiation.",
        "You can contact the gallery with any questions.",
      ],
      [
        "REFUNDED",
        "Your refund will appear on your bank statement within 5-7 business days.",
        "orders@artsy.net",
      ],
    ])("renders the correct message for %s", (messageType, firstExpect, secondExpect) => {
      renderWithRelay({ Order: () => ({ displayTexts: { messageType } }) })

      expect(screen.getByText(new RegExp(firstExpect))).toBeOnTheScreen()
      expect(screen.getByText(new RegExp(secondExpect))).toBeOnTheScreen()
    })
  })

  describe("wire transfer info", () => {
    it.each([
      [
        "GBP",
        {
          transferInfo: [
            "Art.sy Inc.",
            "88005417",
            "GB30PNBP16567188005417",
            "PNBPGB2L",
            "16-56-7",
          ],
          bankAddress: [
            "Wells Fargo Bank, N.A. London Branch",
            "1 Plantation Place",
            "30 Fenchurch Street",
            "London, United Kingdom, EC3M 3BD",
          ],
          intermediaryReferenceInfo: "NWBKGB2LXXX",
        },
      ],
      [
        "EUR",
        {
          transferInfo: ["Art.sy Inc.", "88005419", "GB73PNBP16567188005419", "PNBPGB2L"],
          bankAddress: [
            "Wells Fargo Bank, N.A. London Branch",
            "1 Plantation Place",
            "30 Fenchurch Street",
            "London, United Kingdom, EC3M 3BD",
          ],
          intermediaryReferenceInfo: "BBRUBEBB010",
        },
      ],
      [
        "USD",
        {
          transferInfo: ["Art.sy Inc.", "4243851425", "121000248", "WFBIUS6S"],
          bankAddress: [
            "Wells Fargo Bank, N.A.",
            "420 Montgomery Street",
            "San Francisco, CA 94104",
            "United States",
          ],
          intermediaryReferenceInfo: "PNBPUS3NNYC",
        },
      ],
    ])(
      "renders the instructions for %s",
      (currencyCode, { transferInfo, bankAddress, intermediaryReferenceInfo }) => {
        renderWithRelay({
          Order: () => ({ displayTexts: { messageType: "PROCESSING_WIRE" }, currencyCode }),
        })

        // assert transfer info lines
        transferInfo.forEach((info) => {
          expect(screen.getByText(info)).toBeOnTheScreen()
        })

        // assert bank address
        bankAddress.forEach((line) => {
          expect(screen.getByText(line)).toBeOnTheScreen()
        })

        // assert reference info
        expect(screen.getByText(new RegExp(intermediaryReferenceInfo))).toBeOnTheScreen()
      }
    )
  })

  describe("gallery shipped order", () => {
    it("renders shipped message with delivery info", () => {
      renderWithRelay({
        Order: () => ({
          displayTexts: { messageType: "SHIPPED" },
          deliveryInfo: {
            shipperName: "DHL",
            trackingNumber: "1231231234",
            trackingURL: "https://dhl.de/track/123456789",
            estimatedDelivery: "2024-04-21T00:00:00Z",
            estimatedDeliveryWindow: null,
          },
        }),
      })

      expect(screen.getByText("Your work is on its way.")).toBeOnTheScreen()
      expect(screen.getByText("Shipper: DHL")).toBeOnTheScreen()
      expect(screen.getByText("Tracking: 1231231234")).toBeOnTheScreen()
      expect(screen.getByText("Estimated delivery: Apr 21, 2024")).toBeOnTheScreen()

      fireEvent.press(screen.getByText("1231231234"))

      expect(navigate).toHaveBeenCalledWith("https://dhl.de/track/123456789")
    })

    it("renders shipped message without delivery info", () => {
      renderWithRelay({
        Order: () => ({ displayTexts: { messageType: "SHIPPED" }, deliveryInfo: null }),
      })

      expect(screen.getByText("Your work is on its way.")).toBeOnTheScreen()

      expect(screen.queryByText("Shipper:")).not.toBeOnTheScreen()
      expect(screen.queryByText("Tracking:")).not.toBeOnTheScreen()
      expect(screen.queryByText("Estimated delivery:")).not.toBeOnTheScreen()
    })

    it("renders shipped message with estimated delivery window", () => {
      renderWithRelay({
        Order: () => ({
          displayTexts: {
            messageType: "SHIPPED",
          },
          deliveryInfo: {
            shipperName: null,
            trackingNumber: null,
            trackingURL: null,
            estimatedDelivery: null,
            estimatedDeliveryWindow: "March 25-27, 2024",
          },
        }),
      })

      expect(screen.getByText("Your work is on its way.")).toBeOnTheScreen()
      expect(screen.getByText("Estimated delivery: March 25-27, 2024")).toBeOnTheScreen()
    })
  })

  describe("links", () => {
    it("navigates the user to Update Payment page when tapping update payment", () => {
      renderWithRelay({
        Order: () => ({ internalID: "order-id", displayTexts: { messageType: "PAYMENT_FAILED" } }),
      })

      expect(screen.getByText("update your payment details")).toBeOnTheScreen()

      fireEvent.press(screen.getByText("update your payment details"))

      expect(navigate).toHaveBeenCalledWith("/orders/order-id/payment/new", {
        modal: true,
        passProps: { orderID: "order-id", title: "Update Payment Details" },
      })
    })

    it("navigates the user to My Collection when tapping your collection", () => {
      renderWithRelay({ Order: () => ({ displayTexts: { messageType: "COMPLETED_PICKUP" } }) })

      expect(screen.getByText("your Collection on Artsy")).toBeOnTheScreen()

      fireEvent.press(screen.getByText("your Collection on Artsy"))

      expect(navigate).toHaveBeenCalledWith("/my-collection")
    })

    it("opens email link when tapping on orders@artsy.net", async () => {
      Linking.canOpenURL = jest.fn().mockReturnValue(Promise.resolve(true))
      const openUrlSpy = jest.spyOn(Linking, "openURL")

      renderWithRelay({ Order: () => ({ displayTexts: { messageType: "COMPLETED_PICKUP" } }) })

      expect(screen.getByText("orders@artsy.net")).toBeOnTheScreen()

      fireEvent.press(screen.getByText("orders@artsy.net"))

      await waitFor(() => expect(openUrlSpy).toHaveBeenCalledWith("mailto:orders@artsy.net"))
    })
  })
})
