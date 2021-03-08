import { ReviewOfferButton_order } from "__generated__/ReviewOfferButton_order.graphql"
import { navigate } from "lib/navigation/navigate"
import { extractNodes } from "lib/utils/extractNodes"
import { useEventTiming } from "lib/utils/useEventTiming"
import { DateTime } from "luxon"
import { AlertCircleFillIcon, ArrowRightIcon, Flex, MoneyFillIcon, Text } from "palette"
import React, { useEffect } from "react"
import { TouchableWithoutFeedback } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"
import { returnButtonMessaging } from "./utils/returnButtonMessaging"
import { useFeatureFlag } from "lib/store/GlobalStore"
import { OrderCTA_conversation } from "__generated__/OrderCTA_conversation.graphql"

export interface Props {
  conversation: OrderCTA_conversation
}

export const OrderCTA: React.FC<Props> = ({ conversation }) => {
  const { slug: artworkSlug, isOfferableFromInquiry } = { ...artwork }
  if (!isOfferableFromInquiry) {
    return null
  }
  const firstItem = conversation?.items?.[0]?.item
  const artwork = firstItem?.__typename === "Artwork" ? firstItem : null

  const hasActiveOrder = Boolean(
    (conversation?.orderConnection?.edges || []).filter((edge) => edge?.node?.state === "SUBMITTED").length
  )
  const showOfferableInquiryButton = isOfferableFromInquiry && !hasActiveOrder

  // const showOfferableInquiryButton =
  //   conversation?.items?.[0]?.item?.__typename === "Artwork" && conversation?.items?.[0]?.item?.isOfferableFromInquiry

  const orders = extractNodes(conversation.orderConnection)
  const showOpenInquiryModalButton = useFeatureFlag("AROptionsInquiryCheckout") // && this.props.isOfferableFromInquiry

  return null

  // if (
  //   order.state == null ||
  //   order.state === "ABANDONED" ||
  //   order.state === "PENDING" ||
  //   (order.state === "SUBMITTED" && order.lastOffer?.fromParticipant === "BUYER")
  // ) {
  //   return null
  // }

  // const [buttonBackgroundColor, setButtonBackgroundColor] = React.useState("green100")
  // const [buttonMessage, setButtonMessage] = React.useState("")
  // const [buttonSubMessage, setButtonSubMessage] = React.useState("Tap to view")
  // const [showMoneyIconInButton, setShowMoneyIconInButton] = React.useState(true)

  // const { hours } = useEventTiming({
  //   currentTime: DateTime.local().toString(),
  //   startAt: order.lastOffer?.createdAt,
  //   endAt: order.stateExpiresAt || undefined,
  // })

  // useEffect(() => {
  //   const isCounter = extractNodes(order.offers).length > 1

  //   const { backgroundColor, message, subMessage, showMoneyIcon } = returnButtonMessaging({
  //     state: order.state,
  //     stateReason: order.stateReason,
  //     isCounter,
  //     lastOfferFromParticipant: order.lastOffer?.fromParticipant,
  //     hoursTillExpiration: hours,
  //   })

  //   setButtonMessage(message)
  //   setButtonSubMessage(subMessage)
  //   setShowMoneyIconInButton(showMoneyIcon)
  //   setButtonBackgroundColor(backgroundColor)
  // })

  // const onTap = (orderID: string | null) => {
  //   navigate(`/orders/${orderID}`, {
  //     modal: true,
  //     passProps: { orderID },
  //   })
  // }

  // return (
  //   <TouchableWithoutFeedback onPress={() => onTap(order?.internalID)}>
  //     <Flex
  //       px={2}
  //       justifyContent="space-between"
  //       alignItems="center"
  //       bg={buttonBackgroundColor}
  //       flexDirection="row"
  //       height={60}
  //     >
  //       <Flex flexDirection="row">
  //         {showMoneyIconInButton ? (
  //           <MoneyFillIcon mt="3px" fill="white100" />
  //         ) : (
  //           <AlertCircleFillIcon mt="3px" fill="white100" />
  //         )}
  //         <Flex flexDirection="column" pl={1}>
  //           <Text color="white100" variant="mediumText">
  //             {buttonMessage}
  //           </Text>
  //           <Text color="white100" variant="caption">
  //             {buttonSubMessage}
  //           </Text>
  //         </Flex>
  //       </Flex>
  //       <Flex>
  //         <ArrowRightIcon fill="white100" />
  //       </Flex>
  //     </Flex>
  //   </TouchableWithoutFeedback>
  // )
}

export const OrderCTAFragmentContainer = createFragmentContainer(OrderCTA, {
  conversation: graphql`
    fragment OrderCTA_conversation on Conversation {
      items {
        item {
          __typename
          ... on Artwork {
            href
            slug
            isOfferableFromInquiry
          }
          ... on Show {
            href
          }
        }
      }
      orderConnection(first: 10, participantType: BUYER) {
        edges {
          node {
            ... on CommerceOrder {
              internalID
              state
              stateReason
              stateExpiresAt
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
          }
        }
      }
    }
  `,
})
