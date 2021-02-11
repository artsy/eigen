import { ReviewOfferButton_order } from "__generated__/ReviewOfferButton_order.graphql"
import { navigate } from "lib/navigation/navigate"
import { extractNodes } from "lib/utils/extractNodes"
import { useEventTiming } from "lib/utils/useEventTiming"
import { DateTime } from "luxon"
import { AlertCircleFillIcon, ArrowRightIcon, Flex, MoneyFillIcon, Text } from "palette"
import React from "react"
import { TouchableWithoutFeedback } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"

export interface ReviewOfferButtonProps {
  order: ReviewOfferButton_order
}

export const ReviewOfferButton: React.FC<ReviewOfferButtonProps> = ({ order }) => {
  const offerNodes = extractNodes(order.offers)

  let backgroundColor = "green100"
  let message = ""
  let subMessage = "Tap to view"
  let icon = <MoneyFillIcon mt="3px" fill="white100" />
  const offerType = offerNodes.length > 1 ? "Counteroffer" : "Offer"

  const expiration = useEventTiming({
    currentTime: DateTime.local().toString(),
    startAt: order?.lastOffer?.createdAt,
    endAt: order?.stateExpiresAt || undefined,
  }).hours

  if (order.state === "APPROVED") {
    message = `${offerType} Accepted - Please Confirm`
    backgroundColor = "green100"
    subMessage = `Expires in ${expiration}hr`
  } else if (order.state === "CANCELED" && order?.stateReason?.includes("seller_rejected")) {
    message = `${offerType} Declined`
    backgroundColor = "red100"
  } else if (order?.lastOffer?.fromParticipant === "SELLER") {
    backgroundColor = "copper100"
    message = `${offerType} Received`
    subMessage = `Expires in ${expiration}hr`
    icon = <AlertCircleFillIcon mt="3px" fill="white100" />
  }

  const onTap = (orderID: string | null, state: string | null) => {
    if (state === "APPROVED") {
      // ORDER CONFIRMATION PAGE DOESN'T EXIST YET
    } else {
      navigate(`/orders/${orderID}/review`)
    }
  }

  return (
    <TouchableWithoutFeedback onPress={() => onTap(order?.internalID, order?.state)}>
      <Flex
        px={2}
        justifyContent="space-between"
        alignItems="center"
        bg={backgroundColor}
        flexDirection="row"
        height={60}
      >
        <Flex flexDirection="row">
          {icon}
          <Flex flexDirection="column" pl={1}>
            <Text color="white100" variant="mediumText">
              {message}
            </Text>
            <Text color="white100" variant="caption">
              {subMessage}
            </Text>
          </Flex>
        </Flex>
        <Flex>
          <ArrowRightIcon fill="white100" />
        </Flex>
      </Flex>
    </TouchableWithoutFeedback>
  )
}

export const ReviewOfferButtonFragmentContainer = createFragmentContainer(ReviewOfferButton, {
  order: graphql`
    fragment ReviewOfferButton_order on CommerceOrder {
      __typename
      internalID
      state
      stateReason
      stateExpiresAt(format: "MMM D")
      ... on CommerceOfferOrder {
        lastOffer {
          fromParticipant
          createdAt
        }
        offers(first: 5) {
          edges {
            node {
              internalID
            }
          }
        }
      }
    }
  `,
})
