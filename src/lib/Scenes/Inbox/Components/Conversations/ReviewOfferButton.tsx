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

export interface ReviewOfferButtonProps {
  order: ReviewOfferButton_order
}

export const ReviewOfferButton: React.FC<ReviewOfferButtonProps> = ({ order }) => {
  if (order.state == null || order.state === "ABANDONED" || order.state === "PENDING") {
    return null
  }

  const [buttonBackgroundColor, setButtonBackgroundColor] = React.useState("green100")
  const [buttonMessage, setButtonMessage] = React.useState("")
  const [buttonSubMessage, setButtonSubMessage] = React.useState("Tap to view")
  const [showMoneyIconInButton, setShowMoneyIconInButton] = React.useState(true)

  const { hours } = useEventTiming({
    currentTime: DateTime.local().toString(),
    startAt: order.lastOffer?.createdAt,
    endAt: order.stateExpiresAt || undefined,
  })

  useEffect(() => {
    const isCounter = extractNodes(order.offers).length > 1

    const { backgroundColor, message, subMessage, showMoneyIcon } = returnButtonMessaging({
      state: order.state,
      stateReason: order.stateReason,
      isCounter,
      lastOfferFromParticipant: order.lastOffer?.fromParticipant,
      hoursTillExpiration: hours,
    })

    console.log("showmoneyicon", showMoneyIcon)

    setButtonMessage(message)
    setButtonSubMessage(subMessage)
    setShowMoneyIconInButton(showMoneyIcon)
    setButtonBackgroundColor(backgroundColor)
    console.log("showmoneyicon IN BUTTON", showMoneyIconInButton)
  })

  const onTap = (orderID: string | null) => {
    navigate(`/orders/${orderID}/review`)
  }

  return (
    <TouchableWithoutFeedback onPress={() => onTap(order?.internalID)}>
      <Flex
        px={2}
        justifyContent="space-between"
        alignItems="center"
        bg={buttonBackgroundColor}
        flexDirection="row"
        height={60}
      >
        <Flex flexDirection="row">
          {showMoneyIconInButton ? (
            <AlertCircleFillIcon mt="3px" fill="white100" />
          ) : (
            <MoneyFillIcon mt="3px" fill="white100" />
          )}
          <Flex flexDirection="column" pl={1}>
            <Text color="white100" variant="mediumText">
              {buttonMessage}
            </Text>
            <Text color="white100" variant="caption">
              {buttonSubMessage}
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
    fragment ReviewOfferButton_order on CommerceOfferOrder {
      internalID
      state
      stateReason
      stateExpiresAt(format: "MMM D")
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
  `,
})
