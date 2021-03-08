import { OfferNotification_offer } from "__generated__/OfferNotification_offer.graphql"
import { AlertCircleFillIcon, Flex, MoneyFillIcon, Text } from "palette"
import React, { useEffect } from "react"
import { createFragmentContainer, graphql } from "react-relay"
import { TimeSince } from "./TimeSince"

export interface OfferNotificationProps {
  offer: OfferNotification_offer
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

export const OfferNotificationFragmentContainer = createFragmentContainer(OfferNotification, {
  offer: graphql`
    fragment OfferNotification_offer on CommerceOffer {
      __typename
      amount
      createdAt
      fromParticipant
      from {
        __typename
      }
      respondsTo {
        fromParticipant
      }
      order {
        state
        stateReason
      }
    }
  `,
})
