import { WatchedLot_lot } from "__generated__/WatchedLot_lot.graphql"
import { isSmallScreen } from "lib/Scenes/MyBids/helpers/screenDimensions"
import { Flex, Text } from "palette"
import React from "react"
import { TouchableOpacity } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"
import { Watching } from "./BiddingStatuses"
// import { useTracking } from "react-tracking"
// import { navigate } from "lib/navigation/navigate"
// import { ActionType, ContextModule, OwnerType } from "@artsy/cohesion"

import { LotFragmentContainer as Lot } from "./Lot"

interface WatchedLotProps {
  lot: WatchedLot_lot
}

export const WatchedLot: React.FC<WatchedLotProps> = ({ lot }) => {
  const sellingPrice = lot?.lotState?.sellingPrice?.display
  const bidCount = lot?.lotState?.bidCount
  const { saleArtwork } = lot
  // const tracking = useTracking()

  const displayBidCount = (): string | undefined => {
    if (isSmallScreen) {
      return
    } else {
      return `(${bidCount.toString() + (bidCount === 1 ? " bid" : " bids")})`
    }
  }

  // Implement tracking with correct schema
  const handleLotTap = () => {
    // tracking.trackEvent({
    //   action: ActionType.tappedArtworkGroup,
    //   context_module: ContextModule.inboxActiveBids,
    //   context_screen_owner_type: OwnerType.inboxBids,
    //   destination_screen_owner_typ: OwnerType.artwork,
    //   // destination_screen_owner_id: saleArtwork?.artwork?.internalID,
    //   // destination_screen_owner_slug: saleArtwork?.artwork?.slug,
    // })
    // navigate(saleArtwork?.artwork?.href as string)
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
          {/* TODO: Add correct icon to Palette for use here */}
          <Watching />
        </Flex>
      </Lot>
    </TouchableOpacity>
  )
}

export const WatchedLotFragmentContainer = createFragmentContainer(WatchedLot, {
  lot: graphql`
    fragment WatchedLot_lot on Lot {
      lotState: lot {
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
          href
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
