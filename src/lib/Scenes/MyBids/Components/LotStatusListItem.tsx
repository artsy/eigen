import React from "react"
import { createFragmentContainer, graphql } from "react-relay"
import { ActiveLotStandingFragmentContainer } from "./ActiveLotStanding"
import { ClosedLotStandingFragmentContainer } from "./ClosedLotStanding"
import { WatchedLotFragmentContainer } from "./WatchedLot"

import { LotStatusListItem_sale } from "../../../../__generated__/LotStatusListItem_sale.graphql"
import { LotStatusListItem_saleArtwork } from "../../../../__generated__/LotStatusListItem_saleArtwork.graphql"

interface Props {
  /** A general lot to display. */
  saleArtwork: LotStatusListItem_saleArtwork
  /** A general lot to display. */
  sale: LotStatusListItem_sale
}

const completeStatuses = ["sold", "passed"]

const LotStatusListItem: React.FC<Props> = ({ saleArtwork, sale }) => {
  console.warn("SALE", sale.isClosed)
  if (sale.isClosed) {
    return (
      <ClosedLotStandingFragmentContainer withTimelyInfo data-test-id="closed-sale-lot" saleArtwork={saleArtwork} />
    )
  }

  if (saleArtwork.isWatching) {
    return <WatchedLotFragmentContainer saleArtwork={saleArtwork} />
  }

  const isComplete = completeStatuses.includes(saleArtwork.lotState?.soldStatus!)
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
  sale: graphql`
    fragment LotStatusListItem_sale on Sale {
      internalID
      registrationStatus {
        qualifiedForBidding
      }
      internalID
      liveStartAt
      endAt
      status
      isClosed
    }
  `,
})
