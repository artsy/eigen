import { ClosedLot_lotStanding } from "__generated__/ClosedLot_lotStanding.graphql"
import moment from "moment-timezone"
import { Flex, Text } from "palette"
import { StarCircleFill } from "palette/svgs/sf"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"
import { TimelySale } from "../helpers/timely"
import { Lost, Passed, Won } from "./BiddingStatuses"
import { LotFragmentContainer as Lot } from "./Lot"

type BidderResult = "won" | "lost" | "passed"

const saleClosedMessage: (sale: { endAt: string | null; status: string | null }) => string | undefined = (sale) => {
  const timelySale = TimelySale.create(sale)
  if (timelySale.isClosed) {
    const tz = moment.tz.guess(true)
    const endedAtMoment = moment(sale.endAt!).tz(tz)

    return `Closed ${endedAtMoment.format("MMM D")}`
  }
}

export const ClosedLot = ({
  lotStanding,
  withTimelyInfo = true,
}: {
  lotStanding: ClosedLot_lotStanding
  withTimelyInfo?: boolean
}) => {
  const sale = lotStanding?.saleArtwork?.sale!
  const sellingPrice = lotStanding?.lot?.sellingPrice?.display
  const subtitle = withTimelyInfo ? saleClosedMessage(sale) : undefined

  const result: BidderResult =
    lotStanding?.lot.soldStatus === "Passed" ? "passed" : lotStanding?.isHighestBidder ? "won" : "lost"
  const Badge = result === "won" ? StarCircleFill : undefined

  const bidderMessages: { [k in BidderResult]: React.ComponentType } = {
    won: Won,
    lost: Lost,
    passed: Passed,
  }

  const Result = bidderMessages[result]

  return (
    <Lot saleArtwork={lotStanding.saleArtwork!} subtitle={subtitle} ArtworkBadge={Badge}>
      <Flex flexDirection="row">
        <Text variant="caption">{sellingPrice}</Text>
      </Flex>
      <Flex flexDirection="row" alignItems="center">
        <Result />
      </Flex>
    </Lot>
  )
}

export const ClosedLotFragmentContainer = createFragmentContainer(ClosedLot, {
  lotStanding: graphql`
    fragment ClosedLot_lotStanding on AuctionsLotStanding {
      isHighestBidder
      lot {
        internalID
        saleId
        bidCount
        reserveStatus
        soldStatus
        sellingPrice {
          display
        }
      }
      saleArtwork {
        ...Lot_saleArtwork
        sale {
          endAt
          status
        }
      }
    }
  `,
})
