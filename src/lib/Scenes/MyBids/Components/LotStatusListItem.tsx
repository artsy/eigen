import { ActiveLot_lotStanding } from "__generated__/ActiveLot_lotStanding.graphql"
import { ClosedLot_lotStanding } from "__generated__/ClosedLot_lotStanding.graphql"
import { LotStatusListItem_lot } from "__generated__/LotStatusListItem_lot.graphql"
import { MyBids_me } from "__generated__/MyBids_me.graphql"
import { WatchedLot_lot } from "__generated__/WatchedLot_lot.graphql"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"
import { lotInActiveSale } from "../helpers/timely"
import { ActiveLot } from "./ActiveLot"
import { ClosedLot } from "./ClosedLot"
import { WatchedLot } from "./WatchedLot"

// type LotLike = WatchedLot_lot | LotStanding
interface Props {
  lot: LotStatusListItem_lot
}

function isLotStanding(lot: any): lot is ActiveLot_lotStanding | ClosedLot_lotStanding {
  return lot.type === "AuctionsLotStanding"
}

function isLot(lot: any): lot is WatchedLot_lot {
  return lot.type === "Lot"
}

const LotStatusListItem: React.FC<Props> = ({ lot }) => {
  const completeStatuses = ["sold", "passed"]
  const soldStatus = lot?.lot?.soldStatus?.toLowerCase() as string
  const isComplete = completeStatuses.includes(soldStatus)

  if (isLotStanding(lot)) {
    return isComplete ? <ClosedLot lotStanding={lot} /> : <ActiveLot lotStanding={lot} />
  } else if (isLot(lot)) {
    return <WatchedLot lot={lot} />
  } else {
    return null
  }
}

export const LotStatusListItemContainer = createFragmentContainer(LotStatusListItem, {
  lot: graphql`
    fragment LotStatusListItem_lot on LotLike {
      type: __typename
      lot {
        soldStatus
      }
      ...ActiveLot_lotStanding
      ...ClosedLot_lotStanding
      ...WatchedLot_lot
    }
  `,
})
