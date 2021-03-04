import { AlertCircleFillIcon, Flex, MoneyFillIcon, Text } from "palette"
import React, { useEffect } from "react"
import { TimeSince } from "./TimeSince"
import { returnButtonMessaging } from "./utils/returnButtonMessaging"

export interface OfferNotificationProps {
  offer: any
  showTimeSince: boolean
}

export const OfferNotification: React.FC<OfferNotificationProps> = ({ offer, showTimeSince }) => {
  const [notificationColor, setNotificationColor] = React.useState("black100")
  const [notificationMessage, setNotificationMessage] = React.useState("")
  const [showMoneyIconInNotification, setShowMoneyIconInNotification] = React.useState(true)

  useEffect(() => {
    if (offer.fromParticipant === "BUYER" && offer.respondsTo === null) {
      setNotificationMessage(`You sent an offer for ${offer.amount}`)
    } else if (offer.fromParticipant === "BUYER" && offer.respondsTo !== null) {
      setNotificationMessage(`You sent a counteroffer for ${offer.amount}`)
    } else if (offer.fromParticipant === "SELLER") {
      if (offer.respondsTo === null) {
        setNotificationMessage(`You recieved an offer for ${offer.amount}`)
      } else {
        setNotificationMessage(`You recieved a counteroffer for ${offer.amount}`)
      }
      // const { message, backgroundColor, showMoneyIcon } = returnButtonMessaging({
      //   state: offer.order.state,
      //   stateReason: offer.order.stateReason,
      //   isCounter: offer.respondsTo.fromParticipant != null,
      //   lastOfferFromParticipant: offer.fromParticipant,
      // })
      setShowMoneyIconInNotification(false)
      setNotificationColor("copper100")
    }
  })

  return (
    <Flex>
      <Flex px={2} justifyContent="center" flexDirection="row">
        <Flex flexDirection="row">
          {showMoneyIconInNotification ? (
            <AlertCircleFillIcon mt="3px" fill={notificationColor} />
          ) : (
            <MoneyFillIcon mt="3px" fill={notificationColor} />
          )}
          <Flex flexDirection="column" pl={1}>
            <Text color={notificationColor} variant="small">
              {notificationMessage}
            </Text>
          </Flex>
        </Flex>
      </Flex>
      <Flex flexDirection="row" justifyContent="center">
        {!!showTimeSince && <TimeSince time={offer.createdAt} mt={0.5} />}
      </Flex>
    </Flex>
  )
}
