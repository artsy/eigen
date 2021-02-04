import { LotStatusListItem_lot } from "__generated__/LotStatusListItem_lot.graphql"
import { LotStatusListItem_lotStanding } from "__generated__/LotStatusListItem_lotStanding.graphql"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"
import { ActiveLotStandingFragmentContainer as ActiveLotStanding } from "./ActiveLotStanding"
import { ClosedLotStandingFragmentContainer as ClosedLotStanding } from "./ClosedLotStanding"
import { WatchedLotFragmentContainer as WatchedLot } from "./WatchedLot"

interface Props {
  /** A general lot to display. */
  lot: LotStatusListItem_lot | null
  /** A user's lot standing. Takes precedence over `lot` */
  lotStanding?: LotStatusListItem_lotStanding | null
  /** Whether the lot's entire sale has closed */
  saleIsClosed?: boolean
}

const completeStatuses = ["sold", "passed"]

const LotStatusListItem: React.FC<Props> = ({ lot, lotStanding, saleIsClosed = false }) => {
  if (lotStanding) {
    if (saleIsClosed) {
      return <ClosedLotStanding withTimelyInfo data-test-id="closed-sale-lot" lotStanding={lotStanding} />
    } else {
      const lotState = lotStanding.lot
      const soldStatus = lotState.soldStatus?.toLowerCase() as string
      const isComplete = completeStatuses.includes(soldStatus)
      return isComplete ? (
        <ClosedLotStanding lotStanding={lotStanding} />
      ) : (
        <ActiveLotStanding lotStanding={lotStanding} />
      )
    }
  } else if (lot) {
    return <WatchedLot lot={lot} />
  } else {
    return null
  }
}

export const LotStatusListItemContainer = createFragmentContainer(LotStatusListItem, {
  lot: graphql`
    fragment LotStatusListItem_lot on Lot {
      ...WatchedLot_lot
    }
  `,
  lotStanding: graphql`
    fragment LotStatusListItem_lotStanding on AuctionsLotStanding {
      ...ActiveLotStanding_lotStanding
      ...ClosedLotStanding_lotStanding
      lot {
        soldStatus
      }
    }
  `,
})
