import { Flex, Text } from "@artsy/palette-mobile"
import { SaleActiveBidItem_lotStanding$data } from "__generated__/SaleActiveBidItem_lotStanding.graphql"
import {
  HighestBid,
  Outbid,
  ReserveNotMet,
  BiddingLiveNow,
} from "app/Scenes/MyBids/Components/BiddingStatuses"
import { LotFragmentContainer } from "app/Scenes/MyBids/Components/Lot"
import { navigate } from "app/system/navigation/navigate"
import { TouchableOpacity } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"

interface SaleActiveBidItemProps {
  lotStanding: SaleActiveBidItem_lotStanding$data
}

export const SaleActiveBidItem: React.FC<SaleActiveBidItemProps> = ({ lotStanding }) => {
  const saleArtwork = lotStanding?.saleArtwork
  if (!saleArtwork) {
    return null
  }

  const sellingPrice = lotStanding.mostRecentBid?.maxBid?.display
  const bidCount = saleArtwork.counts?.bidderPositions

  return (
    <TouchableOpacity
      onPress={() => saleArtwork.artwork?.href && navigate(saleArtwork.artwork.href)}
    >
      <Flex flexDirection="row" justifyContent="space-between">
        <LotFragmentContainer saleArtwork={saleArtwork} />
        <Flex>
          {!saleArtwork.sale?.isLiveOpen && (
            <Flex flexDirection="row" alignItems="center" justifyContent="flex-end">
              <Text variant="xs">{sellingPrice}</Text>
              <Text variant="xs" color="mono60">
                {" "}
                ({bidCount} {bidCount === 1 ? "bid" : "bids"})
              </Text>
            </Flex>
          )}
          <Flex flexDirection="row" alignItems="center" justifyContent="flex-end">
            {saleArtwork.sale?.isLiveOpen ? (
              <BiddingLiveNow />
            ) : lotStanding?.activeBid?.isWinning &&
              saleArtwork.reserveStatus === "ReserveNotMet" ? (
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
        ...Lot_saleArtwork
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
        sale {
          isLiveOpen
          slug
        }
      }
    }
  `,
})
