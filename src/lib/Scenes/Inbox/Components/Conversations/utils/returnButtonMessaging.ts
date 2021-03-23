interface ReturnButtonMessaging {
  state: string
  lastTransactionFailed: boolean | null
  isCounter: boolean
  lastOfferFromParticipant: string | null | undefined
  hoursTillExpiration?: string
}

export const returnButtonMessaging = ({
  state,
  lastTransactionFailed,
  isCounter,
  lastOfferFromParticipant,
  hoursTillExpiration,
}: ReturnButtonMessaging) => {
  const offerType = isCounter ? "Counteroffer" : "Offer"
  let message = ""
  let subMessage = "Tap to view"
  let backgroundColor = "green100"
  let showMoneyIcon = true

  if (state === "SUBMITTED" && lastOfferFromParticipant === "SELLER") {
    backgroundColor = "copper100"
    message = `${offerType} Received`
    subMessage = `Expires in ${hoursTillExpiration}hr`
    showMoneyIcon = false
  } else if (state === "APPROVED" && lastOfferFromParticipant === "BUYER") {
    message = `${offerType} Accepted - Please Confirm`
    subMessage = `Expires in ${hoursTillExpiration}hr`
  } else if (lastTransactionFailed) {
    backgroundColor = "copper100"
    message = `Payment Failed`
    subMessage = `Please update payment method`
    showMoneyIcon = false
  }

  return {
    backgroundColor,
    message,
    subMessage,
    showMoneyIcon,
  }
}
