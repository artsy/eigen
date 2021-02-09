import { ReviewOfferButton_order } from "__generated__/ReviewOfferButton_order.graphql"
import { MoneyIcon } from "lib/Icons/Consignments"
import { navigate } from "lib/navigation/navigate"
import { useEventTiming } from "lib/utils/useEventTiming"
import { DateTime } from "luxon"
import { ArrowRightIcon, Flex, Text } from "palette"
import React from "react"
import { TouchableWithoutFeedback } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"

export interface ReviewOfferButtonProps {
  order: ReviewOfferButton_order
}
export const ReviewOfferButton: React.FC = () => {
  // export const ReviewOfferButton: React.FC<ReviewOfferButtonProps> = ({ order }) => {
  const order = {
    internalID: "",
    state: "APPROVED",
    lastOffer: {
      fromParticipant: "",
      createdAt: "2018-05-01T10:24:31+00:00",
    },
    stateExpiresAt: "2018-05-12T10:24:31+00:00",
    stateReason: "seller_rejectd",
    offers: [{}, {}],
  }

  let backgroundColor = "green100"
  let message = ""
  let subMessage = "Tap to view"
  const offerType = order?.offers?.length > 1 ? "Counteroffer" : "Offer"

  const expiration = useEventTiming({
    currentTime: "2018-05-10T20:22:32.000Z",
    startAt: order.lastOffer.createdAt,
    endAt: order.stateExpiresAt,
  }).hours

  if (order.state === "APPROVED") {
    message = `${offerType} Accepted - Please Confirm`
    backgroundColor = "green100"
    subMessage = `Expires in ${expiration}hr`
  } else if (order.state === "CANCELED" && order.stateReason.includes("seller_rejected")) {
    message = `${offerType} Declined`
    backgroundColor = "red100"
  } else if (order.lastOffer.fromParticipant === "SELLER") {
    backgroundColor = "copper100"
    message = `${offerType} Received`
    subMessage = `Expires in ${expiration}hr`
  } else {
    return null
  }

  const onTap = (orderID: string, stateReason: string) => {
    if (stateReason === "APPROVED") {
      // ORDER CONFIRMATION PAGE DOESN'T EXIST YET
    } else {
      navigate(`/orders/${orderID}/review`)
    }
  }

  return (
    <TouchableWithoutFeedback onPress={() => onTap(order.internalID, order.stateReason)}>
      <Flex
        px={2}
        justifyContent="space-between"
        alignItems="center"
        bg={backgroundColor}
        flexDirection="row"
        height={60}
      >
        <Flex flexDirection="row">
          <MoneyIcon mt={1.5} height="18px" width="18px" fill="white100" />
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
        offers {
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
