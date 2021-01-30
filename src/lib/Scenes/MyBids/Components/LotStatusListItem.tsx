import { LotStatusListItem_lot } from "__generated__/LotStatusListItem_lot.graphql"
import { LotStatusListItem_lotStanding } from "__generated__/LotStatusListItem_lotStanding.graphql"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"
import { ActiveLotFragmentContainer as ActiveLot } from "./ActiveLot"
import { ClosedLotFragmentContainer as ClosedLot } from "./ClosedLot"
import { WatchedLotFragmentContainer as WatchedLot } from "./WatchedLot"

// type LotLike = WatchedLot_lot | LotStanding
interface Props {
  lot: LotStatusListItem_lot | null
  lotStanding?: LotStatusListItem_lotStanding | null
  saleIsClosed?: boolean
}

const completeStatuses = ["sold", "passed"]

const LotStatusListItem: React.FC<Props> = ({ lot, lotStanding, saleIsClosed = false }) => {
  if (lotStanding) {
    const lotState = lotStanding.lot
    const soldStatus = lotState.soldStatus?.toLowerCase() as string
    const isComplete = completeStatuses.includes(soldStatus)
    if (saleIsClosed) {
      return <ClosedLot withTimelyInfo data-test-id="closed-sale-lot" lotStanding={lotStanding} />
    } else {
      return isComplete ? <ClosedLot lotStanding={lotStanding} /> : <ActiveLot lotStanding={lotStanding} />
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
      ...ActiveLot_lotStanding
      ...ClosedLot_lotStanding
      lot {
        soldStatus
      }
    }
  `,
})
