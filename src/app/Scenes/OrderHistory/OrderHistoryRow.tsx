import { ActionType, ContextModule, OwnerType, TappedChangePaymentMethod } from "@artsy/cohesion"
import { Flex, Box, Text, Button, Image } from "@artsy/palette-mobile"
import {
  OrderHistoryRow_order$data,
  OrderBuyerStateEnum,
} from "__generated__/OrderHistoryRow_order.graphql"
import { RouterLink } from "app/system/navigation/RouterLink"
// eslint-disable-next-line no-restricted-imports
import { navigate } from "app/system/navigation/navigate"
import { DateTime } from "luxon"
import React from "react"
import { Linking } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"

interface OrderHistoryRowProps {
  order: OrderHistoryRow_order$data
}
interface OrderActionButtonProps {
  buyerState: OrderBuyerStateEnum | null | undefined
  orderId: string
  actionPrompt: string | null | undefined
  isOffer: boolean
}

const getStateColor = (buyerState: OrderBuyerStateEnum | null | undefined) => {
  if (!buyerState) {
    return "mono60"
  }

  switch (buyerState) {
    case "CANCELED":
    case "PAYMENT_FAILED":
    case "DECLINED_BY_SELLER":
    case "DECLINED_BY_BUYER":
      return "red100"
    case "OFFER_RECEIVED":
      return "blue100"
    default:
      return "mono60"
  }
}

const TERMINAL_STATES: OrderBuyerStateEnum[] = [
  "DECLINED_BY_SELLER",
  "DECLINED_BY_BUYER",
  "CANCELED",
  "REFUNDED",
]

const OrderActionButton: React.FC<OrderActionButtonProps> = ({
  buyerState,
  orderId,
  actionPrompt,
  isOffer,
}) => {
  // Don't show action button for terminal states
  if (buyerState && TERMINAL_STATES.includes(buyerState)) {
    return null
  }

  if (buyerState === "PAYMENT_FAILED") {
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
        {actionPrompt}
      </Button>
    )
  }

  if (buyerState === "OFFER_RECEIVED") {
    return (
      <Button
        block
        variant="fillDark"
        onPress={() =>
          navigate(`/orders/${orderId}/respond`, {
            modal: true,
            passProps: { orderID: orderId, title: "Respond" },
          })
        }
        testID="counteroffer-button"
      >
        {actionPrompt}
      </Button>
    )
  }

  // Default view order action for all other states (App is overwriting actionPrompt for now)
  const defaultLabel = isOffer ? "View Offer" : "View Order"
  return (
    <RouterLink hasChildTouchable testID="view-order-button" to={`/orders/${orderId}/details`}>
      <Button block variant="outline">
        {actionPrompt || defaultLabel}
      </Button>
    </RouterLink>
  )
}

export const OrderHistoryRow: React.FC<OrderHistoryRowProps> = ({ order }) => {
  const { buyerState, displayTexts } = order
  const [lineItem] = order.lineItems || []
  const { artwork, artworkVersion } = lineItem || {}
  const trackingUrl = order.deliveryInfo?.trackingURL

  const orderStatusText = displayTexts?.stateName
  const orderStatusColor = getStateColor(buyerState)

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
              {order?.createdAt ? DateTime.fromISO(order.createdAt).toLocaleString(DateTime.DATE_SHORT) : ""}
            </Text>
          </Flex>
          <Flex>
            <Text textAlign="right" variant="sm" testID="price">
              {order.buyerTotal?.display}
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
          buyerState={buyerState}
          orderId={order.internalID}
          actionPrompt={displayTexts?.actionPrompt}
          isOffer={order.mode === "OFFER"}
        />
      </Box>
    </Flex>
  )
}

export const OrderHistoryRowContainer = createFragmentContainer(OrderHistoryRow, {
  order: graphql`
    fragment OrderHistoryRow_order on Order {
      __typename
      internalID
      buyerState
      mode
      buyerTotal {
        display
      }
      createdAt
      itemsTotal {
        display
      }
      displayTexts {
        stateName
        actionPrompt
      }
      deliveryInfo {
        trackingURL
        trackingNumber
      }
      lineItems {
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
