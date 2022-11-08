import { LotUpcomingLiveDateTime_artwork$key } from "__generated__/LotUpcomingLiveDateTime_artwork.graphql"
import { useFragment } from "react-relay"
import { graphql } from "relay-runtime"
import { ArtworkLotDetailsRow } from "./ArtworkLotDetailsRow"
import { formatLotDateTime } from "./utils/formatLotDateTime"

interface LotUpcomingLiveDateTimeProps {
  artwork: LotUpcomingLiveDateTime_artwork$key
}

export const LotUpcomingLiveDateTime: React.FC<LotUpcomingLiveDateTimeProps> = ({ artwork }) => {
  const data = useFragment(lotUpcomingLiveDateTimeFragment, artwork)
  const { liveStartAt } = data.sale ?? {}

  if (!liveStartAt) {
    return null
  }

  return <ArtworkLotDetailsRow title="Lot live" value={formatLotDateTime(liveStartAt)} />
}

const lotUpcomingLiveDateTimeFragment = graphql`
  fragment LotUpcomingLiveDateTime_artwork on Artwork {
    sale {
      liveStartAt
    }
  }
`
