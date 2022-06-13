import { ActionType, ContextModule, OwnerType } from "@artsy/cohesion"
import { navigate } from "app/navigation/navigate"
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

import { ClosedLotStanding_saleArtwork$data } from "../../../../__generated__/ClosedLotStanding_saleArtwork.graphql"

type BidderResult = "won" | "lost" | "passed"

const saleClosedMessage: (sale: {
  endAt: string | null
  status: string | null
}) => string | undefined = (sale) => {
  const timelySale = TimelySale.create(sale)
  if (timelySale.isClosed) {
    const tz = moment.tz.guess(true)
    const endedAtMoment = moment(sale.endAt!).tz(tz)

    return `Closed ${endedAtMoment.format("MMM D")}`
  }
}

export const ClosedLotStanding = ({
  saleArtwork,
  withTimelyInfo = true,
  inActiveSale = false,
  testID,
}: {
  saleArtwork: ClosedLotStanding_saleArtwork$data
  withTimelyInfo?: boolean
  inActiveSale?: boolean
  testID?: string
}) => {
  const sale = saleArtwork?.sale!
  const sellingPrice = saleArtwork.lotState?.sellingPrice?.display || saleArtwork.estimate
  const subtitle = withTimelyInfo ? saleClosedMessage(sale) : undefined

  const result: BidderResult =
    saleArtwork?.lotState?.soldStatus! === "Passed"
      ? "passed"
      : saleArtwork?.isHighestBidder
      ? "won"
      : "lost"
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
      destination_screen_owner_id: saleArtwork?.artwork?.internalID,
      destination_screen_owner_slug: saleArtwork?.artwork?.slug,
    })
    navigate(saleArtwork?.artwork?.href as string)
  }

  return (
    <TouchableOpacity
      onPress={() => handleLotTap()}
      style={{ marginHorizontal: 0, width: "100%" }}
      testID={testID}
    >
      <Flex flexDirection="row" justifyContent="space-between">
        <Lot saleArtwork={saleArtwork!} subtitle={subtitle} ArtworkBadge={Badge} />
        <Flex>
          <Flex flexDirection="row" alignItems="center" justifyContent="flex-end">
            <Text variant="xs">{sellingPrice}</Text>
          </Flex>
          <Flex flexDirection="row" alignItems="center" justifyContent="flex-end">
            <Result />
          </Flex>
        </Flex>
      </Flex>
    </TouchableOpacity>
  )
}

export const ClosedLotStandingFragmentContainer = createFragmentContainer(ClosedLotStanding, {
  saleArtwork: graphql`
    fragment ClosedLotStanding_saleArtwork on SaleArtwork {
      ...Lot_saleArtwork
      isHighestBidder
      estimate
      artwork {
        internalID
        href
        slug
      }
      lotState {
        soldStatus
        sellingPrice {
          display
        }
      }
      sale {
        endAt
        status
      }
    }
  `,
})
