import { ActionType, ContextModule, OwnerType } from "@artsy/cohesion"
import { WatchedLot_lotStanding } from "__generated__/WatchedLot_lotStanding.graphql"
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

interface WatchedLotProps {
  lotStanding: WatchedLot_lotStanding
}

export const WatchedLot: React.FC<WatchedLotProps> = ({ lotStanding }) => {
  console.log("lotStandingggggg:", JSON.stringify(lotStanding, null, 4))
  // const timelySale = TimelySale.create(lotStanding?.saleArtwork?.sale!)

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
      // destination_screen_owner_id: saleArtwork?.artwork?.internalID,
      // destination_screen_owner_slug: saleArtwork?.artwork?.slug,
    })
    navigate(saleArtwork?.artwork?.href as string)
  }

  return (
    <TouchableOpacity style={{ marginHorizontal: 0, width: "100%" }}>
      <Lot saleArtwork={saleArtwork} isSmallScreen={isSmallScreen}>
        <Flex flexDirection="row" justifyContent="flex-end">
          <Text variant="caption">{sellingPrice}</Text>
          <Text variant="caption" color="black60">
            {" "}
            {displayBidCount()}
          </Text>
        </Flex>
        <Flex flexDirection="row" alignItems="center" justifyContent="flex-end"></Flex>
      </Lot>
    </TouchableOpacity>
  )
}

export const WatchedLotFragmentContainer = createFragmentContainer(WatchedLot, {
  lotStanding: graphql`
    fragment WatchedLot_lotStanding on Lot {
      lot {
        internalID
        bidCount
        sellingPrice {
          display
        }
        soldStatus
      }
      # isHighestBidder
      saleArtwork {
        lotLabel
        artwork {
          # internalID
          href
          # slug
          artistNames
          image {
            url(version: "medium")
          }
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
