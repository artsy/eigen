import { ActionType, ContextModule, OwnerType } from "@artsy/cohesion"
import { Flex, Text } from "@artsy/palette-mobile"
import { WatchedLot_saleArtwork$data } from "__generated__/WatchedLot_saleArtwork.graphql"
import { navigate } from "app/system/navigation/navigate"
import { useScreenDimensions } from "app/utils/hooks"
import { TouchableOpacity } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"
import { useTracking } from "react-tracking"
import { Watching } from "./BiddingStatuses"
import { LotFragmentContainer as Lot } from "./Lot"

interface WatchedLotProps {
  saleArtwork: WatchedLot_saleArtwork$data
}

export const WatchedLot: React.FC<WatchedLotProps> = ({ saleArtwork }) => {
  const { lotState } = saleArtwork

  const bidCount = lotState?.bidCount
  const sellingPrice = saleArtwork?.currentBid?.display || saleArtwork?.estimate
  const tracking = useTracking()
  const { isSmallScreen } = useScreenDimensions()

  const displayBidCount = (): string | undefined => {
    if (isSmallScreen) {
      return
    }

    return `(${bidCount?.toString() + (bidCount === 1 ? " bid" : " bids")})`
  }

  const handleLotTap = () => {
    tracking.trackEvent({
      action: ActionType.tappedArtworkGroup,
      context_module: ContextModule.inboxActiveBids,
      context_screen_owner_type: OwnerType.inboxBids,
      destination_screen_owner_typ: OwnerType.artwork,
      destination_screen_owner_id: saleArtwork?.artwork?.internalID,
      destination_screen_owner_slug: saleArtwork?.artwork?.slug,
    })
    navigate(saleArtwork?.artwork?.href as string)
  }

  return (
    <TouchableOpacity style={{ marginHorizontal: 0, width: "100%" }} onPress={handleLotTap}>
      <Flex flexDirection="row" justifyContent="space-between">
        <Lot saleArtwork={saleArtwork} isSmallScreen={isSmallScreen} />
        <Flex>
          <Flex flexDirection="row" alignItems="center" justifyContent="flex-end">
            <Text variant="xs">{sellingPrice}</Text>
            {!!bidCount && (
              <Text variant="xs" color="mono60">
                {" "}
                {displayBidCount()}
              </Text>
            )}
          </Flex>
          <Flex flexDirection="row" alignItems="center" justifyContent="flex-end">
            <Watching />
          </Flex>
        </Flex>
      </Flex>
    </TouchableOpacity>
  )
}

export const WatchedLotFragmentContainer = createFragmentContainer(WatchedLot, {
  saleArtwork: graphql`
    fragment WatchedLot_saleArtwork on SaleArtwork {
      ...Lot_saleArtwork
      lotState {
        bidCount
        sellingPrice {
          display
        }
      }
      artwork {
        internalID
        href
        slug
      }
      currentBid {
        display
      }
      estimate
    }
  `,
})
