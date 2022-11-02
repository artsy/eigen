import { LotEndDateTime_artwork$key } from "__generated__/LotEndDateTime_artwork.graphql"
import { useArtworkBidding } from "app/Websockets/auctions/useArtworkBidding"
import { useFragment } from "react-relay"
import { graphql } from "relay-runtime"
import { ArtworkLotDetailsRow } from "./ArtworkLotDetailsRow"
import { formateLotDateTime } from "./utils/formateLotDateTime"

interface LotEndDateTimeProps {
  artwork: LotEndDateTime_artwork$key
}

export const LotEndDateTime: React.FC<LotEndDateTimeProps> = ({ artwork }) => {
  const data = useFragment(lotEndDateTimeFragment, artwork)
  const { endAt: saleEndAt } = data.sale ?? {}
  const { lotID, extendedBiddingEndAt, endAt: lotEndAt } = data.saleArtwork ?? {}
  const { currentBiddingEndAt: biddingEndAt } = useArtworkBidding({
    lotID,
    lotEndAt,
    biddingEndAt: extendedBiddingEndAt ?? lotEndAt ?? saleEndAt,
  })

  if (!biddingEndAt) {
    return null
  }

  return <ArtworkLotDetailsRow title="Lot closes" value={formateLotDateTime(biddingEndAt)} />
}

const lotEndDateTimeFragment = graphql`
  fragment LotEndDateTime_artwork on Artwork {
    sale {
      endAt
    }
    saleArtwork {
      lotID
      endAt
      extendedBiddingEndAt
    }
  }
`
