import { ActionType, ContextModule, OwnerType } from "@artsy/cohesion"
import { ClosedLot_lotStanding } from "__generated__/ClosedLot_lotStanding.graphql"
import { navigate } from "lib/navigation/navigate"
import moment from "moment-timezone"
import { Flex, Text } from "palette"
import { StarCircleFill } from "palette/svgs/sf"
import React from "react"
import { TouchableOpacity } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"
import { useTracking } from "react-tracking"
import { TimelySale } from "../helpers/timely"
import { Lost, Passed, Won } from "./BiddingStatuses"
import { LotFragmentContainer as Lot } from "./Lot"

type BidderResult = "won" | "lost" | "passed"

const saleClosedMessage: (sale: { endAt: string | null; status: string | null }) => string | undefined = (sale) => {
  const timelySale = TimelySale.create(sale)
  if (timelySale.isClosed) {
    const tz = moment.tz.guess(true)
    const endedAtMoment = moment(sale.endAt!).tz(tz)

    return `Closed ${endedAtMoment.format("MMM D")}`
  }
}

export const ClosedLot = ({
  lotStanding,
  withTimelyInfo = true,
  inActiveSale = false,
}: {
  lotStanding: ClosedLot_lotStanding
  withTimelyInfo?: boolean
  inActiveSale?: boolean
}) => {
  const sale = lotStanding?.saleArtwork?.sale!
  const sellingPrice = lotStanding?.lot?.sellingPrice?.display
  const subtitle = withTimelyInfo ? saleClosedMessage(sale) : undefined

  const result: BidderResult =
    lotStanding?.lot.soldStatus === "Passed" ? "passed" : lotStanding?.isHighestBidder ? "won" : "lost"
  const Badge = result === "won" ? StarCircleFill : undefined

  const bidderMessages: { [k in BidderResult]: React.ComponentType } = {
    won: Won,
    lost: Lost,
    passed: Passed,
  }

  const Result = bidderMessages[result]
  const tracking = useTracking()

  const handleLotTap = () => {
    tracking.trackEvent({
      action: ActionType.tappedArtworkGroup,
      context_module: inActiveSale ? ContextModule.inboxActiveBids : ContextModule.inboxClosedBids,
      context_screen_owner_type: OwnerType.inboxBids,
      destination_screen_owner_typ: OwnerType.artwork,
      destination_screen_owner_id: lotStanding?.saleArtwork?.artwork?.internalID,
      destination_screen_owner_slug: lotStanding?.saleArtwork?.artwork?.slug,
    })
    navigate(lotStanding.saleArtwork?.artwork?.href as string)
  }

  return (
    <TouchableOpacity onPress={() => handleLotTap()} style={{ marginHorizontal: 0, width: "100%" }}>
      <Lot saleArtwork={lotStanding.saleArtwork!} subtitle={subtitle} ArtworkBadge={Badge}>
        <Flex flexDirection="row">
          <Text variant="caption">{sellingPrice}</Text>
        </Flex>
        <Flex flexDirection="row" alignItems="center">
          <Result />
        </Flex>
      </Lot>
    </TouchableOpacity>
  )
}

export const ClosedLotFragmentContainer = createFragmentContainer(ClosedLot, {
  lotStanding: graphql`
    fragment ClosedLot_lotStanding on AuctionsLotStanding {
      isHighestBidder
      lot {
        internalID
        saleId
        bidCount
        reserveStatus
        soldStatus
        sellingPrice {
          display
        }
      }
      saleArtwork {
        ...Lot_saleArtwork
        artwork {
          internalID
          href
          slug
        }
        sale {
          endAt
          status
        }
      }
    }
  `,
})
