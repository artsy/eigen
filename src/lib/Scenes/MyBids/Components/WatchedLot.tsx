import { ActionType, ContextModule, OwnerType } from "@artsy/cohesion"
import { WatchedLot_lot } from "__generated__/WatchedLot_lot.graphql"
import { navigate } from "lib/navigation/navigate"
import { isSmallScreen } from "lib/Scenes/MyBids/helpers/screenDimensions"
import { Flex, Text } from "palette"
import React from "react"
import { TouchableOpacity } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"
import { useTracking } from "react-tracking"
import { Watching } from "./BiddingStatuses"
import { LotFragmentContainer as Lot } from "./Lot"

interface WatchedLotProps {
  lot: WatchedLot_lot
}

export const WatchedLot: React.FC<WatchedLotProps> = ({ lot }) => {
  const { saleArtwork, lot: lotState } = lot
  if (!lotState) {
    return null
  }

  const bidCount = lotState.bidCount
  const sellingPrice = lotState?.sellingPrice?.display
  const tracking = useTracking()

  const displayBidCount = (): string | undefined => {
    if (isSmallScreen) {
      return
    } else {
      return `(${bidCount.toString() + (bidCount === 1 ? " bid" : " bids")})`
    }
  }

  const handleLotTap = () => {
    tracking.trackEvent({
      action: ActionType.tappedArtworkGroup,
      context_module: ContextModule.inboxActiveBids,
      context_screen_owner_type: OwnerType.inboxBids,
      destination_screen_owner_typ: OwnerType.artwork,
      destination_screen_owner_id: lot.saleArtwork?.artwork?.internalID,
      destination_screen_owner_slug: lot.saleArtwork?.artwork?.slug,
    })
    navigate(saleArtwork?.artwork?.href as string)
  }

  return (
    <TouchableOpacity style={{ marginHorizontal: 0, width: "100%" }} onPress={handleLotTap}>
      <Lot saleArtwork={saleArtwork!} isSmallScreen={isSmallScreen}>
        <Flex flexDirection="row" justifyContent="flex-end">
          <Text variant="caption">{sellingPrice}</Text>
          <Text variant="caption" color="black60">
            {" "}
            {displayBidCount()}
          </Text>
        </Flex>
        <Flex flexDirection="row" alignItems="center" justifyContent="flex-end">
          <Watching />
        </Flex>
      </Lot>
    </TouchableOpacity>
  )
}

export const WatchedLotFragmentContainer = createFragmentContainer(WatchedLot, {
  lot: graphql`
    fragment WatchedLot_lot on Lot {
      lot {
        internalID
        bidCount
        sellingPrice {
          display
        }
        soldStatus
      }
      saleArtwork {
        ...Lot_saleArtwork
        artwork {
          internalID
          href
          slug
        }
        sale {
          liveStartAt
          endAt
          status
        }
      }
    }
  `,
})
