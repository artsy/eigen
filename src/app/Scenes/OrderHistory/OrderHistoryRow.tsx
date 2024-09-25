import { Flex, Box, Text, Button, Image } from "@artsy/palette-mobile"
import { OrderHistoryRow_order$data } from "__generated__/OrderHistoryRow_order.graphql"
import { navigate } from "app/system/navigation/navigate"
import { extractNodes } from "app/utils/extractNodes"
import { getOrderStatus } from "app/utils/getOrderStatus"
import { getTrackingUrl } from "app/utils/getTrackingUrl"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import moment from "moment"
import { Linking } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"

interface OrderHistoryRowProps {
  order: OrderHistoryRow_order$data
}

export const OrderHistoryRow: React.FC<OrderHistoryRowProps> = ({ order }) => {
  const [lineItem] = extractNodes(order?.lineItems)
  const { artwork, artworkVersion } = lineItem || {}
  const showBlurhash = useFeatureFlag("ARShowBlurhashImagePlaceholder")
  const trackingUrl = getTrackingUrl(lineItem)

  const orderStatus = getOrderStatus(order.displayState)
  const orderStatusColor = ["canceled", "payment failed"].includes(orderStatus as string)
    ? "red100"
    : "black60"

  const showFixPayment = orderStatus === "payment failed"
  const showViewOrder =
    !showFixPayment && orderStatus && !(["canceled", "refunded"] as string[]).includes(orderStatus)
  const isViewOffer = orderStatus === "pending" && order?.mode === "OFFER"

  const artworkImageUrl = artworkVersion?.image?.resized?.url

  return (
    <Flex width="100%" testID="order-container">
      <Flex mb={1}>
        <Flex flexDirection="row" justifyContent="space-between">
          <Flex justifyContent="center" testID="image-container" mr={2}>
            {!!artworkImageUrl ? (
              <Image
                src={artworkImageUrl}
                blurhash={showBlurhash ? artworkVersion.image.blurhash : undefined}
                height={50}
                width={50}
                testID="image"
              />
            ) : (
              <Box width={50} height={50} backgroundColor="black10" testID="image-box" />
            )}
          </Flex>
          <Flex width="40%" flexGrow={1} mr={2}>
            <Text variant="sm" testID="artist-names" ellipsizeMode="tail" numberOfLines={1}>
              {artwork?.artistNames}
            </Text>
            <Text
              variant="xs"
              color="black60"
              testID="partner-name"
              ellipsizeMode="tail"
              numberOfLines={1}
            >
              {artwork?.partner?.name}
            </Text>
            <Text variant="xs" color="black60" testID="date">
              {moment(order.createdAt).format("l")}
            </Text>
          </Flex>
          <Flex>
            <Text textAlign="right" variant="sm" testID="price">
              {order.buyerTotal}
            </Text>
            {!!orderStatus && (
              <Text
                textAlign="right"
                variant="xs"
                color={orderStatusColor}
                style={{ textTransform: "capitalize" }}
                testID="order-status"
              >
                {orderStatus}
              </Text>
            )}
          </Flex>
        </Flex>
      </Flex>
      <Box mb={1} testID="view-order-button-box">
        {!!trackingUrl && (
          <Button
            mb={1}
            block
            variant="fillDark"
            onPress={() => Linking.openURL(trackingUrl)}
            testID="track-package-button"
          >
            Track Package
          </Button>
        )}
        {!!showViewOrder && (
          <Button
            block
            variant="fillGray"
            onPress={
              isViewOffer
                ? () =>
                    navigate(`/orders/${order.internalID}`, {
                      modal: true,
                      passProps: { orderID: order.internalID, title: "Make Offer" },
                    })
                : () => navigate(`/user/purchases/${order.internalID}`)
            }
            testID="view-order-button"
          >
            {isViewOffer ? "View Offer" : "View Order"}
          </Button>
        )}
        {!!showFixPayment && (
          <Button
            block
            variant="fillDark"
            onPress={() =>
              navigate(`/orders/${order.internalID}/payment/new`, {
                modal: true,
                passProps: { orderID: order.internalID, title: "Update Payment Details" },
              })
            }
            testID="update-payment-button"
          >
            Update Payment Method
          </Button>
        )}
      </Box>
    </Flex>
  )
}

export const OrderHistoryRowContainer = createFragmentContainer(OrderHistoryRow, {
  order: graphql`
    fragment OrderHistoryRow_order on CommerceOrder {
      internalID
      displayState
      mode
      buyerTotal(precision: 2)
      createdAt
      itemsTotal
      lineItems(first: 1) {
        edges {
          node {
            shipment {
              trackingUrl
              trackingNumber
            }
            artworkVersion {
              image {
                resized(width: 55) {
                  url
                }
                blurhash
              }
            }
            artwork {
              partner {
                name
              }
              title
              artistNames
            }
            fulfillments(first: 1) {
              edges {
                node {
                  trackingId
                }
              }
            }
          }
        }
      }
    }
  `,
})
