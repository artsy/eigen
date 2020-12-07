import { ArtistInsightsAuctionResult_auctionResult } from "__generated__/ArtistInsightsAuctionResult_auctionResult.graphql"
import { capitalize } from "lodash"
import moment from "moment"
import { bullet, Flex, NoArtworkIcon, Text } from "palette"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"

interface Props {
  auctionResult: ArtistInsightsAuctionResult_auctionResult
}

const ArtistInsightsAuctionResult: React.FC<Props> = ({ auctionResult }) => {
  const now = moment()

  const awaitingResults = moment(auctionResult.saleDate).isAfter(now)
  const getRatio = () => {
    if (!auctionResult.priceRealized?.cents || !auctionResult.estimate?.low) {
      return null
    }
    return auctionResult.priceRealized.cents / auctionResult.estimate.low
  }
  const ratio = getRatio()

  return (
    <Flex height={100} py="2" flexDirection="row">
      {true ? (
        <Flex width={60} height={60} backgroundColor="black10" alignItems="center" justifyContent="center">
          <NoArtworkIcon width={28} height={28} opacity={0.3} />
        </Flex>
      ) : (
        <Flex width={60} height={60} backgroundColor="green" alignItems="center" justifyContent="center"></Flex>
      )}
      <Flex mx={15} flex={1}>
        <Flex flexDirection="row">
          <Text variant="title" numberOfLines={1} style={{ flexShrink: 1 }}>
            {auctionResult.title}
          </Text>
          <Text variant="title" numberOfLines={1}>
            , {auctionResult.dateText}
          </Text>
        </Flex>
        <Flex flex={1} backgroundColor="pink" />
        <Text variant="small" color="black60" numberOfLines={1}>
          {capitalize(auctionResult.mediumText)}
        </Text>
        <Text variant="small" color="black60" numberOfLines={1}>
          {moment(auctionResult.saleDate).format("MMM D, YYYY")}
          {` ${bullet} `}
          {auctionResult.organization}
        </Text>
      </Flex>
      <Flex>
        {auctionResult.priceRealized !== null ? (
          <Flex alignItems="flex-end">
            <Text variant="mediumText">
              {(auctionResult.priceRealized?.display ?? "").replace(`${auctionResult.currency} `, "")}
            </Text>
            <Flex borderRadius={2} overflow="hidden">
              <Flex position="absolute" width="100%" height="100%" backgroundColor={ratioColor} opacity={0.05} />
              <Text variant="mediumText" color={ratioColor} px={5}>
                {ratio.toFixed(2)}x
              </Text>
            </Flex>
          </Flex>
        ) : (
          <Text variant="mediumText">{awaitingResults ? "Awaiting results" : "Not available"}</Text>
        )}
      </Flex>
    </Flex>
  )
}

const ratioColor = (ratio: number | null) => {
  if (Number(ratio) >= 1.05) {
    return "green100"
  }
  if (Number(ratio) <= 0.95) {
    return "red100"
  }

  return "black60"
}

export const ArtistInsightsAuctionResultFragmentContainer = createFragmentContainer(ArtistInsightsAuctionResult, {
  auctionResult: graphql`
    fragment ArtistInsightsAuctionResult_auctionResult on AuctionResult {
      id
      title
      dateText
      mediumText
      saleDate
      organization
      currency
      priceRealized {
        display
        cents
      }
      estimate {
        low
      }
    }
  `,
})
