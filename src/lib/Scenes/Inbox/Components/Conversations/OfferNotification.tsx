import { AlertCircleFillIcon, Flex, MoneyFillIcon, Text } from "palette"
import React, { useEffect } from "react"
import { returnButtonMessaging } from "./utils/returnButtonMessaging"

export interface ReviewOfferButtonProps {
  offer: any
}

export const ReviewOfferButton: React.FC<ReviewOfferButtonProps> = ({ offer }) => {
  const [notificationBackgroundColor, setNotificationBackgroundColor] = React.useState("black100")
  const [notificationMessage, setNotificationMessage] = React.useState("")
  const [showMoneyIconInNotification, setShowMoneyIconInNotification] = React.useState(true)

  useEffect(() => {
    if (offer.fromParticipant === "BUYER" && offer.respondsTo.fromParticipant == null) {
      setNotificationMessage(`You sent an offer for ${offer.amount}`)
    } else if (offer.fromParticipant === "BUYER" && offer.respondsTo.fromParticipant != null) {
      setNotificationMessage(`You sent a counteroffer for ${offer.amount}`)
    } else {
      const { message, backgroundColor, showMoneyIcon } = returnButtonMessaging({
        state: offer.order.state,
        stateReason: offer.order.stateReason,
        isCounter: offer.respondsTo.fromParticipant != null,
        lastOfferFromParticipant: offer.respondsTo.fromParticipant,
      })

      setNotificationMessage(message)
      setShowMoneyIconInNotification(showMoneyIcon)
      setNotificationBackgroundColor(backgroundColor)
    }
  })

  return (
    <Flex
      px={2}
      justifyContent="space-between"
      alignItems="center"
      bg={notificationBackgroundColor}
      flexDirection="row"
      height={60}
    >
      <Flex flexDirection="row">
        {showMoneyIconInNotification ? (
          <AlertCircleFillIcon mt="3px" fill="white100" />
        ) : (
          <MoneyFillIcon mt="3px" fill="white100" />
        )}
        <Flex flexDirection="column" pl={1}>
          <Text color="white100" variant="mediumText">
            {notificationMessage}
          </Text>
        </Flex>
      </Flex>
    </Flex>
  )
}
