import { ActionType, ContextModule, OwnerType } from "@artsy/cohesion"
import { ActiveLotStanding_saleArtwork$data } from "__generated__/ActiveLotStanding_saleArtwork.graphql"
import { navigate } from "app/navigation/navigate"
import { Flex, Text } from "palette"
import React from "react"
import { TouchableOpacity } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"
import { useTracking } from "react-tracking"
import { useScreenDimensions } from "shared/hooks"
import { TimelySale } from "../helpers/timely"
import { HighestBid, Outbid, ReserveNotMet } from "./BiddingStatuses"
import { LotFragmentContainer as Lot } from "./Lot"

export const ActiveLotStanding = ({
  saleArtwork,
}: {
  saleArtwork: ActiveLotStanding_saleArtwork$data
}) => {
  const timelySale = TimelySale.create(saleArtwork?.sale!)

  const sellingPrice =
    saleArtwork?.currentBid?.display ||
    saleArtwork?.lotState?.sellingPrice?.display ||
    saleArtwork?.estimate
  const bidCount = saleArtwork?.lotState?.bidCount
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
    saleArtwork && (
      <TouchableOpacity
        onPress={() => handleLotTap()}
        style={{ marginHorizontal: 0, width: "100%" }}
      >
        <Flex flexDirection="row" justifyContent="space-between">
          <Lot saleArtwork={saleArtwork} isSmallScreen={isSmallScreen} />
          <Flex>
            <Flex flexDirection="row" alignItems="center" justifyContent="flex-end">
              <Text variant="xs">{sellingPrice}</Text>
              <Text variant="xs" color="black60">
                {" "}
                {displayBidCount()}
              </Text>
            </Flex>
            <Flex flexDirection="row" alignItems="center" justifyContent="flex-end">
              {!timelySale.isLAI &&
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
        </Flex>
      </TouchableOpacity>
    )
  )
}

export const ActiveLotStandingFragmentContainer = createFragmentContainer(ActiveLotStanding, {
  saleArtwork: graphql`
    fragment ActiveLotStanding_saleArtwork on SaleArtwork {
      ...Lot_saleArtwork
      isHighestBidder
      sale {
        status
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
