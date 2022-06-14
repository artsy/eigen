import React from "react"
import { createFragmentContainer, graphql } from "react-relay"
import { LotStatusListItem_saleArtwork$data } from "../../../../__generated__/LotStatusListItem_saleArtwork.graphql"
import { ActiveLotStandingFragmentContainer } from "./ActiveLotStanding"
import { ClosedLotStandingFragmentContainer } from "./ClosedLotStanding"
import { WatchedLotFragmentContainer } from "./WatchedLot"

interface Props {
  /** A general lot to display. */
  saleArtwork: LotStatusListItem_saleArtwork$data
  saleIsClosed?: boolean
}

const completeStatuses = ["sold", "passed"]

const LotStatusListItem: React.FC<Props> = ({ saleArtwork, saleIsClosed }) => {
  if (saleIsClosed) {
    return (
      <ClosedLotStandingFragmentContainer
        withTimelyInfo
        testID="closed-sale-lot"
        saleArtwork={saleArtwork}
      />
    )
  }

  if (saleArtwork.isWatching) {
    return <WatchedLotFragmentContainer saleArtwork={saleArtwork} />
  }

  const isComplete = completeStatuses.includes(saleArtwork.lotState?.soldStatus?.toLowerCase()!)

  return isComplete ? (
    <ClosedLotStandingFragmentContainer saleArtwork={saleArtwork} />
  ) : (
    <ActiveLotStandingFragmentContainer saleArtwork={saleArtwork} />
  )
}

export const LotStatusListItemContainer = createFragmentContainer(LotStatusListItem, {
  saleArtwork: graphql`
    fragment LotStatusListItem_saleArtwork on SaleArtwork {
      ...ClosedLotStanding_saleArtwork
      ...ActiveLotStanding_saleArtwork
      ...WatchedLot_saleArtwork
      isWatching
      lotState {
        soldStatus
      }
    }
  `,
})
