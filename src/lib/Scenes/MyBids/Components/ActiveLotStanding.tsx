import { ActionType, ContextModule, OwnerType } from "@artsy/cohesion"
import { ActiveLotStanding_lotStanding } from "__generated__/ActiveLotStanding_lotStanding.graphql"
import { navigate } from "lib/navigation/navigate"
import { isSmallScreen } from "lib/Scenes/MyBids/helpers/screenDimensions"
import { Flex, Text } from "palette"
import React from "react"
import { TouchableOpacity } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"
import { useTracking } from "react-tracking"
import { TimelySale } from "../helpers/timely"
import { HighestBid, Outbid, ReserveNotMet } from "./BiddingStatuses"
import { LotFragmentContainer as Lot } from "./Lot"

export const ActiveLotStanding = ({ lotStanding }: { lotStanding: ActiveLotStanding_lotStanding }) => {
  const timelySale = TimelySale.create(lotStanding?.saleArtwork?.sale!)

  const sellingPrice = lotStanding?.lot?.sellingPrice?.display
  const bidCount = lotStanding?.lot?.bidCount
  const { saleArtwork, lot } = lotStanding
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
      destination_screen_owner_id: saleArtwork?.artwork?.internalID,
      destination_screen_owner_slug: saleArtwork?.artwork?.slug,
    })
    navigate(saleArtwork?.artwork?.href as string)
  }

  return (
    saleArtwork &&
    lot && (
      <TouchableOpacity onPress={() => handleLotTap()} style={{ marginHorizontal: 0, width: "100%" }}>
        <Lot saleArtwork={saleArtwork} isSmallScreen={isSmallScreen}>
          <Flex flexDirection="row" justifyContent="flex-end">
            <Text variant="caption">{sellingPrice}</Text>
            <Text variant="caption" color="black60">
              {" "}
              {displayBidCount()}
            </Text>
          </Flex>
          <Flex flexDirection="row" alignItems="center" justifyContent="flex-end">
            {!timelySale.isLAI && lotStanding?.isHighestBidder && lotStanding.lot.reserveStatus === "ReserveNotMet" ? (
              <ReserveNotMet />
            ) : lotStanding?.isHighestBidder ? (
              <HighestBid />
            ) : (
              <Outbid />
            )}
          </Flex>
        </Lot>
      </TouchableOpacity>
    )
  )
}

export const ActiveLotStandingFragmentContainer = createFragmentContainer(ActiveLotStanding, {
  lotStanding: graphql`
    fragment ActiveLotStanding_lotStanding on AuctionsLotStanding {
      isHighestBidder
      lot {
        internalID
        bidCount
        reserveStatus
        soldStatus
        askingPrice: onlineAskingPrice {
          display
        }
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
          liveStartAt
        }
      }
    }
  `,
})
