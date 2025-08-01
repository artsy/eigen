import { ActionType, ContextModule, OwnerType } from "@artsy/cohesion"
import { Flex, Text } from "@artsy/palette-mobile"
import { ActiveLotStanding_saleArtwork$data } from "__generated__/ActiveLotStanding_saleArtwork.graphql"
// eslint-disable-next-line no-restricted-imports
import { navigate } from "app/system/navigation/navigate"
import { useScreenDimensions } from "app/utils/hooks"
import { TouchableOpacity } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"
import { useTracking } from "react-tracking"
import { HighestBid, Outbid, ReserveNotMet } from "./BiddingStatuses"
import { LotFragmentContainer as Lot } from "./Lot"

export const ActiveLotStanding = ({
  saleArtwork,
}: {
  saleArtwork: ActiveLotStanding_saleArtwork$data
}) => {
  const tracking = useTracking()
  const { isSmallScreen } = useScreenDimensions()

  const sale = saleArtwork?.sale
  if (!sale) {
    return null
  }

  const sellingPrice =
    saleArtwork?.currentBid?.display ||
    saleArtwork?.lotState?.sellingPrice?.display ||
    saleArtwork?.estimate
  const bidCount = saleArtwork?.lotState?.bidCount

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
    // eslint-disable-next-line no-restricted-imports
    navigate(saleArtwork?.artwork?.href as string)
  }

  return (
    <TouchableOpacity
      accessibilityRole="button"
      onPress={() => handleLotTap()}
      style={{ marginHorizontal: 0, width: "100%" }}
    >
      <Flex flexDirection="row" justifyContent="space-between">
        <Lot saleArtwork={saleArtwork} isSmallScreen={isSmallScreen} />
        {!sale.isLiveOpenHappened && (
          <Flex>
            <Flex flexDirection="row" alignItems="center" justifyContent="flex-end">
              <Text variant="xs">{sellingPrice}</Text>
              <Text variant="xs" color="mono60">
                {" "}
                {displayBidCount()}
              </Text>
            </Flex>
            <Flex flexDirection="row" alignItems="center" justifyContent="flex-end">
              {!sale.liveStartAt &&
              saleArtwork?.isHighestBidder &&
              saleArtwork?.lotState?.reserveStatus === "ReserveNotMet" ? (
                <ReserveNotMet />
              ) : saleArtwork?.isHighestBidder ? (
                <HighestBid />
              ) : (
                <Outbid />
              )}
            </Flex>
          </Flex>
        )}
      </Flex>
    </TouchableOpacity>
  )
}

export const ActiveLotStandingFragmentContainer = createFragmentContainer(ActiveLotStanding, {
  saleArtwork: graphql`
    fragment ActiveLotStanding_saleArtwork on SaleArtwork {
      ...Lot_saleArtwork
      isHighestBidder
      sale {
        status
        isLiveOpenHappened
        liveStartAt
        endAt
      }
      lotState {
        bidCount
        reserveStatus
        soldStatus
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
