interface ReturnButtonMessaging {
  state: string
  stateReason: string | null
  nodeCount: number
  lastOfferFromParticipant: string | null | undefined
  hoursTillExpiration: string
}

export const returnButtonMessaging = ({
  state,
  stateReason,
  nodeCount,
  lastOfferFromParticipant,
  hoursTillExpiration,
}: ReturnButtonMessaging) => {
  const offerType = nodeCount > 1 ? "Counteroffer" : "Offer"
  let message = ""
  let subMessage = "Tap to view"
  let backgroundColor = "green100"
  let showMoneyIcon = true

  if (state === "PENDING") {
    message = `${offerType} Accepted - Please Confirm`
    subMessage = `Expires in ${hoursTillExpiration}hr`
  } else if (state === "CANCELED" && stateReason?.includes("seller_rejected")) {
    message = `${offerType} Declined`
    backgroundColor = "red100"
  } else if (lastOfferFromParticipant === "SELLER") {
    backgroundColor = "copper100"
    message = `${offerType} Received`
    subMessage = `Expires in ${hoursTillExpiration}hr`
    showMoneyIcon = false
  }
  return {
    backgroundColor,
    message,
    subMessage,
    showMoneyIcon,
  }
}
