import { SaleActiveBidItem_lotStanding$data } from "__generated__/SaleActiveBidItem_lotStanding.graphql"
import { navigate } from "app/navigation/navigate"
import { HighestBid, Outbid, ReserveNotMet } from "app/Scenes/MyBids/Components/BiddingStatuses"
import { LotFragmentContainer } from "app/Scenes/MyBids/Components/Lot"
import { TimelySale } from "app/Scenes/MyBids/helpers/timely"
import { Flex, Text } from "palette"
import React from "react"
import { TouchableOpacity } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"

interface SaleActiveBidItemProps {
  lotStanding: SaleActiveBidItem_lotStanding$data
}

export const SaleActiveBidItem: React.FC<SaleActiveBidItemProps> = ({ lotStanding }) => {
  const timelySale = TimelySale.create(lotStanding?.sale!)
  const isLAI = timelySale.isLiveBiddingNow()

  const sellingPrice = lotStanding?.mostRecentBid?.maxBid?.display
  const bidCount = lotStanding?.saleArtwork?.counts?.bidderPositions
  const { saleArtwork } = lotStanding

  return (
    saleArtwork && (
      <TouchableOpacity
        onPress={() =>
          lotStanding?.saleArtwork?.artwork?.href && navigate(lotStanding.saleArtwork.artwork.href)
        }
      >
        <Flex flexDirection="row" justifyContent="space-between">
          <LotFragmentContainer saleArtwork={saleArtwork} />
          <Flex>
            <Flex flexDirection="row" alignItems="center" justifyContent="flex-end">
              <Text variant="xs">{sellingPrice}</Text>
              <Text variant="xs" color="black60">
                {" "}
                ({bidCount} {bidCount === 1 ? "bid" : "bids"})
              </Text>
            </Flex>
            <Flex flexDirection="row" alignItems="center" justifyContent="flex-end">
              {!isLAI &&
              lotStanding?.activeBid?.isWinning &&
              lotStanding?.saleArtwork?.reserveStatus === "ReserveNotMet" ? (
                <ReserveNotMet />
              ) : lotStanding?.activeBid?.isWinning ? (
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

export const SaleActiveBidItemContainer = createFragmentContainer(SaleActiveBidItem, {
  lotStanding: graphql`
    fragment SaleActiveBidItem_lotStanding on LotStanding {
      activeBid {
        isWinning
      }
      mostRecentBid {
        maxBid {
          display
        }
      }
      saleArtwork {
        reserveStatus
        counts {
          bidderPositions
        }
        currentBid {
          display
        }
        artwork {
          href
        }
        ...Lot_saleArtwork
      }
      sale {
        liveStartAt
      }
    }
  `,
})
