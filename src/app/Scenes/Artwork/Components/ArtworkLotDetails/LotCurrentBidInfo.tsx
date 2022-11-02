import { LotCurrentBidInfo_saleArtwork$key } from "__generated__/LotCurrentBidInfo_saleArtwork.graphql"
import { graphql, useFragment } from "react-relay"
import { ArtworkLotDetailsRow } from "./ArtworkLotDetailsRow"

interface LotCurrentBidInfoProps {
  saleArtwork: LotCurrentBidInfo_saleArtwork$key
}

export const LotCurrentBidInfo: React.FC<LotCurrentBidInfoProps> = ({ saleArtwork }) => {
  const data = useFragment(lotCurrentBidInfoFragment, saleArtwork)
  const { reserveMessage, counts, currentBid } = data ?? {}
  const bidsCount = counts?.bidderPositions ?? 0
  const bidText = getBidText(bidsCount, reserveMessage ?? "")

  return <ArtworkLotDetailsRow title={bidText} value={currentBid?.display!} />
}

const lotCurrentBidInfoFragment = graphql`
  fragment LotCurrentBidInfo_saleArtwork on SaleArtwork {
    reserveMessage
    currentBid {
      display
    }
    counts {
      bidderPositions
    }
  }
`

const getBidStateText = (bidsCount: number, message: string) => {
  const textParts = []

  if (bidsCount > 0) {
    const label = bidsCount === 1 ? "1 bid" : `${bidsCount} bids`
    textParts.push(label)
  }

  if (message.length > 0) {
    textParts.push(message.toLocaleLowerCase())
  }

  return textParts.join(", ")
}

const getBidText = (bidsCount: number, reserveMessage: string) => {
  const bidsPresent = bidsCount > 0
  const bidStateText = getBidStateText(bidsCount, reserveMessage)
  const bidStatusText = bidsPresent ? "Current bid" : "Starting bid"

  if (bidStateText) {
    return `${bidStatusText} (${bidStateText})`
  }

  return bidStatusText
}
