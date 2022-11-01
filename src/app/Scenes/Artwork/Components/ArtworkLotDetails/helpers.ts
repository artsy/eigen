export const getBidStateText = (bidsCount: number, message: string | null) => {
  const textParts = []

  if (bidsCount > 0) {
    const label = bidsCount === 1 ? "1 bid" : `${bidsCount} bids`
    textParts.push(label)
  }

  if (message) {
    textParts.push(message.toLocaleLowerCase())
  }

  return textParts.join(", ")
}

export const getBidText = (bidsCount: number, reserveMessage: string | null) => {
  const bidsPresent = bidsCount > 0
  const bidStateText = getBidStateText(bidsCount, reserveMessage)
  const bidStatusText = bidsPresent ? "Current bid" : "Starting bid"

  if (bidStateText) {
    return `${bidStatusText} (${bidStateText})`
  }

  return bidStatusText
}
