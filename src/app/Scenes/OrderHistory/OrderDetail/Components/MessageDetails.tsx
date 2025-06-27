import { Flex, LinkText, Spacer, Text } from "@artsy/palette-mobile"
import { OrderDetailMessage_order$data } from "__generated__/OrderDetailMessage_order.graphql"
import { WireTransferInfo } from "app/Scenes/OrderHistory/OrderDetail/Components/WireTransferInfo"
// eslint-disable-next-line no-restricted-imports
import { navigate } from "app/system/navigation/navigate"
import { sendEmail } from "app/utils/sendEmail"
import { DateTime } from "luxon"

interface MessageDetailsProps {
  order: OrderDetailMessage_order$data
}

export const MessageDetails: React.FC<MessageDetailsProps> = ({ order }) => {
  const messageType = order.displayTexts.messageType

  const formattedStateExpireTime =
    order.buyerStateExpiresAt &&
    DateTime.fromISO(order.buyerStateExpiresAt).toFormat("MMM dd, h:mm a ZZZZ")

  switch (messageType) {
    case "SUBMITTED_ORDER":
      return (
        <>
          <Text variant="sm">
            Thank you! Your order is being processed. You will receive an email shortly with all the
            details.
          </Text>

          <Spacer y={2} />

          <Text variant="sm">
            The gallery will confirm by{" "}
            <Text variant="sm" fontWeight="bold">
              {formattedStateExpireTime}
            </Text>
            .
          </Text>

          <Spacer y={2} />

          <Text variant="sm">You can contact the gallery with any questions about your order.</Text>
        </>
      )

    case "SUBMITTED_OFFER":
      return (
        <>
          <Text variant="sm">
            Thank you! Your offer has been submitted. You will receive an email shortly with all the
            details. Please note making an offer doesn’t guarantee you the work.
          </Text>

          <Spacer y={2} />

          <Text variant="sm">
            The gallery will respond to your offer by{" "}
            <Text variant="sm" fontWeight="bold">
              {formattedStateExpireTime}
            </Text>
            .
          </Text>

          <Spacer y={2} />

          <Text variant="sm">You can contact the gallery with any questions about your offer.</Text>
        </>
      )

    case "PAYMENT_FAILED":
      return (
        <Text variant="sm">
          To complete your purchase, please{" "}
          <LinkText
            onPress={() => {
              navigate(`/orders/${order.internalID}/payment/new`, {
                modal: true,
                passProps: { orderID: order.internalID, title: "Update Payment Details" },
              })
            }}
          >
            update your payment details
          </LinkText>{" "}
          or provide an alternative payment method by{" "}
          <Text fontWeight="bold">{formattedStateExpireTime}</Text>.
        </Text>
      )

    case "PROCESSING_PAYMENT_PICKUP":
      return (
        <Text variant="sm">
          Thank you for your purchase. You will be notified when the work is available for pickup.
        </Text>
      )

    case "PROCESSING_PAYMENT_SHIP":
      return (
        <Text variant="sm">
          Thank you for your purchase. You will be notified when the work has shipped.
        </Text>
      )

    case "PROCESSING_WIRE":
      return (
        <>
          <Text variant="sm">Your order has been confirmed. Thank you for your purchase.</Text>

          <Spacer y={2} />

          <Text variant="sm" fontWeight="bold">
            Please proceed with the wire transfer within 7 days to complete your purchase.
          </Text>

          <Spacer y={1} />

          <NumberedListItem index={1}>
            <Text variant="sm">Find the total amount due and Artsy’s banking details below.</Text>
          </NumberedListItem>

          <NumberedListItem index={2}>
            <Text variant="sm">
              Please inform your bank that you are responsible for all wire transfer fees.
            </Text>
          </NumberedListItem>

          <NumberedListItem index={3}>
            <Text variant="sm">
              Please make the transfer in the currency displayed on the order breakdown and then
              email proof of payment to{" "}
              <ContactOrders emailSubject={`Proof of wire transfer payment (#${order.code})`} />.
            </Text>
          </NumberedListItem>

          <Spacer y={2} />

          <WireTransferInfo order={order} />
        </>
      )

    case "APPROVED_PICKUP":
      return (
        <>
          <Text variant="sm">
            Thank you for your purchase. A specialist will contact you within 2 business days to
            coordinate pickup.
          </Text>

          <Spacer y={2} />

          <Text variant="sm">You can contact the gallery with any questions about your order.</Text>
        </>
      )

    case "APPROVED_SHIP_EXPRESS":
      return (
        <>
          <Text variant="sm">Your order has been confirmed. Thank you for your purchase.</Text>

          <Spacer y={2} />

          <Text variant="sm">
            Your order will be processed and packaged, and you will be notified once it ships.
          </Text>

          <Text variant="sm">Once shipped, your order will be delivered in 2 business days.</Text>
        </>
      )

    case "APPROVED_SHIP_STANDARD":
      return (
        <>
          <Text variant="sm">Your order has been confirmed. Thank you for your purchase.</Text>

          <Spacer y={2} />

          <Text variant="sm">
            Your order will be processed and packaged, and you will be notified once it ships.
          </Text>

          <Text variant="sm">Once shipped, your order will be delivered in 3-5 business days.</Text>
        </>
      )

    case "APPROVED_SHIP_WHITE_GLOVE":
      return (
        <>
          <Text variant="sm">Your order has been confirmed. Thank you for your purchase.</Text>

          <Spacer y={2} />

          <Text variant="sm">
            Once shipped, you will receive a notification and further details.
          </Text>

          <Text variant="sm">
            You can contact <ContactOrders /> with any questions.
          </Text>
        </>
      )

    case "APPROVED_SHIP":
      return (
        <>
          <Text variant="sm">Your order has been confirmed. Thank you for your purchase.</Text>

          <Spacer y={2} />

          <Text variant="sm">
            You will be notified when the work has shipped, typically within 5-7 business days.
          </Text>

          <Text variant="sm">
            You can contact <ContactOrders /> with any questions.
          </Text>
        </>
      )

    case "SHIPPED": {
      const {
        shipperName,
        trackingNumber,
        trackingURL,
        estimatedDelivery,
        estimatedDeliveryWindow,
      } = order.deliveryInfo || {}

      const isDeliveryInfoPresent =
        !!shipperName ||
        !!trackingNumber ||
        !!trackingURL ||
        !!estimatedDelivery ||
        !!estimatedDeliveryWindow

      const formattedEstimatedDelivery =
        estimatedDelivery && DateTime.fromISO(estimatedDelivery).toFormat("MMM dd, yyyy")

      const estimatedDeliveryDisplay =
        (estimatedDeliveryWindow || formattedEstimatedDelivery) &&
        (estimatedDeliveryWindow ? estimatedDeliveryWindow : formattedEstimatedDelivery)

      return (
        <>
          <Text variant="sm">Your work is on its way.</Text>
          {!!isDeliveryInfoPresent && (
            <>
              <Spacer y={2} />

              {!!shipperName && <Text variant="sm">Shipper: {shipperName}</Text>}
              {!!trackingNumber && (
                <Text variant="sm">
                  Tracking:{" "}
                  {trackingURL ? (
                    <LinkText onPress={() => navigate(trackingURL)}>{trackingNumber}</LinkText>
                  ) : (
                    trackingNumber
                  )}
                </Text>
              )}
              {!!estimatedDeliveryDisplay && (
                <Text variant="sm">Estimated delivery: {estimatedDeliveryDisplay}</Text>
              )}
            </>
          )}

          <Spacer y={2} />

          <YourCollectionNote />
        </>
      )
    }

    case "COMPLETED_PICKUP":
    case "COMPLETED_SHIP":
      return (
        <>
          <Text variant="sm">We hope you love your purchase!</Text>

          <Text variant="sm">
            Your feedback is valuable—share any thoughts with us at <ContactOrders />.
          </Text>

          <Spacer y={2} />

          <YourCollectionNote />
        </>
      )

    case "CANCELED":
      return (
        <>
          <Text variant="sm">
            Your order could not be processed. You can contact <ContactOrders /> with any questions.
          </Text>
        </>
      )

    case "DECLINED_BY_BUYER":
      return (
        <>
          <Text variant="sm">
            Thank you for your response. The seller will be informed of your decision to decline the
            offer, ending the current negotiation.
          </Text>

          <Spacer y={2} />

          <Text variant="sm">
            We’d love to hear your feedback—reach out to us at <ContactOrders /> with any thoughts.
          </Text>
        </>
      )

    case "DECLINED_BY_SELLER":
      return (
        <>
          <Text variant="sm">
            Unfortunately, the seller declined your offer, ending the current negotiation.
          </Text>

          <Text variant="sm">You can contact the gallery with any questions.</Text>
        </>
      )

    case "REFUNDED":
      return (
        <>
          <Text variant="sm">
            Your refund will appear on your bank statement within 5-7 business days.
          </Text>

          <Spacer y={2} />

          <Text variant="sm">
            You can contact <ContactOrders /> with any questions.
          </Text>
        </>
      )

    default:
      return <></>
  }
}

const NumberedListItem: React.FC<{ index: number }> = ({ children, index }) => (
  <Flex flexDirection="row" mb={0.5}>
    <Flex minWidth={20}>
      <Text variant="sm">{index}.</Text>
    </Flex>
    <Flex flex={1}>{children}</Flex>
  </Flex>
)

const ContactOrders: React.FC<{ emailSubject?: string }> = ({ emailSubject }) => (
  <LinkText
    onPress={() =>
      sendEmail("orders@artsy.net", emailSubject ? { subject: emailSubject } : undefined)
    }
    variant="sm"
  >
    orders@artsy.net
  </LinkText>
)

const YourCollectionNote: React.FC = () => (
  <Text variant="sm">
    This artwork will be added to{" "}
    <LinkText onPress={() => navigate("/my-collection")}>your Collection on Artsy</LinkText>.
  </Text>
)
