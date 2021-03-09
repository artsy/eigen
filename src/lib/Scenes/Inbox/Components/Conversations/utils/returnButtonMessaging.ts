interface ReturnButtonMessaging {
  state: string
  stateReason: string | null
  isCounter: boolean
  lastOfferFromParticipant: string | null | undefined
  hoursTillExpiration?: string
}

export const returnButtonMessaging = ({
  state,
  stateReason,
  isCounter,
  lastOfferFromParticipant,
  hoursTillExpiration,
}: ReturnButtonMessaging) => {
  const offerType = isCounter ? "Counteroffer" : "Offer"
  let message = ""
  let subMessage = "Tap to view"
  let backgroundColor = "green100"
  let showMoneyIcon = true

  if (state === "CANCELED" && stateReason?.includes("seller_rejected")) {
    message = `${offerType} Declined`
    backgroundColor = "red100"
  } else if (state === "CANCELED" && stateReason?.includes("_lapsed")) {
    message = `${offerType} Expired`
    backgroundColor = "black60"
  } else if (lastOfferFromParticipant === "SELLER") {
    backgroundColor = "copper100"
    message = `${offerType} Received`
    subMessage = `Expires in ${hoursTillExpiration}hr`
    console.log("WOOO")
    showMoneyIcon = false
  } else if (state === "APPROVED" && lastOfferFromParticipant === "BUYER") {
    message = `${offerType} Accepted - Please Confirm`
    subMessage = `Expires in ${hoursTillExpiration}hr`
  }
  return {
    backgroundColor,
    message,
    subMessage,
    showMoneyIcon,
  }
}
