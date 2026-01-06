import { ActionType, ContextModule, OwnerType, TappedChangePaymentMethod } from "@artsy/cohesion"
import { Flex, Box, Text, Button, Image } from "@artsy/palette-mobile"
import {
  OrderHistoryRow_order$data,
  CommerceOrderDisplayStateEnum,
  CommerceBuyerOfferActionEnum,
  CommerceOrderModeEnum,
} from "__generated__/OrderHistoryRow_order.graphql"
import { RouterLink } from "app/system/navigation/RouterLink"
// eslint-disable-next-line no-restricted-imports
import { navigate } from "app/system/navigation/navigate"
import { extractNodes } from "app/utils/extractNodes"
import { getOrderStatus } from "app/utils/getOrderStatus"
import { getTrackingUrl } from "app/utils/getTrackingUrl"
import moment from "moment"
import React from "react"
import { Linking } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"

interface OrderHistoryRowProps {
  order: OrderHistoryRow_order$data
}

type BuyerDisplayStateEnum = CommerceBuyerOfferActionEnum | CommerceOrderDisplayStateEnum
interface OrderActionButtonProps {
  displayState: BuyerDisplayStateEnum
  orderId: string
  mode: CommerceOrderModeEnum | null | undefined
}

const getStateColor = (displayState: BuyerDisplayStateEnum) => {
  switch (displayState) {
    case "CANCELED":
    case "PAYMENT_FAILED":
      return "red100"
    case "OFFER_RECEIVED":
      return "blue100"
    default:
      return "mono60"
  }
}

const OrderActionButton: React.FC<OrderActionButtonProps> = ({ displayState, orderId, mode }) => {
  switch (displayState) {
    case "PAYMENT_FAILED":
      return (
        <Button
          block
          variant="fillDark"
          onPress={() => {
            tracks.tappedChangePaymentMethod({ id: orderId })
            navigate(`/orders/${orderId}/payment/new`, {
              modal: true,
              passProps: { orderID: orderId, title: "Update Payment Details" },
            })
          }}
          testID="update-payment-button"
        >
          Update Payment Method
        </Button>
      )

    case "OFFER_RECEIVED":
      return (
        <Button
          block
          variant="fillDark"
          onPress={() =>
            navigate(`/orders/${orderId}`, {
              modal: true,
              passProps: { orderID: orderId, title: "Review Offer" },
            })
          }
          testID="counteroffer-button"
        >
          Respond to Counteroffer
        </Button>
      )
    case "SUBMITTED":
    case "APPROVED":
    case "FULFILLED":
    case "PROCESSING":
    case "PROCESSING_APPROVAL":
    case "IN_TRANSIT":
      return (
        <RouterLink hasChildTouchable testID="view-order-button" to={`/orders/${orderId}/details`}>
          <Button block variant="fillGray">
            {mode == "OFFER" ? "View Offer" : "View Order"}
          </Button>
        </RouterLink>
      )
    default:
      return null
  }
}

export const OrderHistoryRow: React.FC<OrderHistoryRowProps> = ({ order }) => {
  const { displayState, buyerAction } = order
  const [lineItem] = extractNodes(order.lineItems)
  const { artwork, artworkVersion } = lineItem || {}
  const trackingUrl = getTrackingUrl(lineItem)

  let buyerDisplayState: BuyerDisplayStateEnum = displayState
  if (
    buyerDisplayState == "SUBMITTED" &&
    !!buyerAction &&
    ["OFFER_RECEIVED", "OFFER_RECEIVED_CONFIRM_NEEDED", "OFFER_ACCEPTED_CONFIRM_NEEDED"].includes(
      buyerAction
    )
  ) {
    buyerDisplayState = "OFFER_RECEIVED"
  }
  const orderStatusText = getOrderStatus(buyerDisplayState)
  const orderStatusColor = getStateColor(buyerDisplayState)

  const artworkImageUrl = artworkVersion?.image?.resized?.url

  return (
    <Flex width="100%" testID="order-container">
      <Flex mb={1}>
        <Flex flexDirection="row" justifyContent="space-between">
          <Flex justifyContent="center" testID="image-container" mr={2}>
            {!!artworkImageUrl ? (
              <Image
                src={artworkImageUrl}
                blurhash={artworkVersion.image.blurhash}
                performResize={false}
                height={50}
                width={50}
                testID="image"
              />
            ) : (
              <Box width={50} height={50} backgroundColor="mono10" testID="image-box" />
            )}
          </Flex>
          <Flex width="40%" flexGrow={1} mr={2}>
            <Text variant="sm" testID="artist-names" ellipsizeMode="tail" numberOfLines={1}>
              {artwork?.artistNames}
            </Text>
            <Text
              variant="xs"
              color="mono60"
              testID="partner-name"
              ellipsizeMode="tail"
              numberOfLines={1}
            >
              {artwork?.partner?.name}
            </Text>
            <Text variant="xs" color="mono60" testID="date">
              {moment(order.createdAt).format("l")}
            </Text>
          </Flex>
          <Flex>
            <Text textAlign="right" variant="sm" testID="price">
              {order.buyerTotal}
            </Text>
            {!!orderStatusText && (
              <Text
                textAlign="right"
                variant="xs"
                color={orderStatusColor}
                style={{ textTransform: "capitalize" }}
                testID="order-status"
              >
                {orderStatusText}
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

        <OrderActionButton
          displayState={buyerDisplayState}
          orderId={order.internalID}
          mode={order.mode}
        />
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
      ... on CommerceOfferOrder {
        buyerAction
      }
    }
  `,
})

export const tracks = {
  tappedChangePaymentMethod: ({ id }: { id: string }): TappedChangePaymentMethod => ({
    action: ActionType.tappedChangePaymentMethod,
    context_module: ContextModule.ordersHistory,
    context_screen: OwnerType.ordersHistory,
    item_id: id,
    item_type: "order",
  }),
}
