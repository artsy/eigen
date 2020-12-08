import { ArtistInsightsAuctionResult_auctionResult } from "__generated__/ArtistInsightsAuctionResult_auctionResult.graphql"
import OpaqueImageView from "lib/Components/OpaqueImageView/OpaqueImageView"
import { capitalize } from "lodash"
import moment from "moment"
import { bullet, Flex, NoArtworkIcon, Text, Touchable } from "palette"
import React, { useCallback } from "react"
import { createFragmentContainer, graphql } from "react-relay"

interface Props {
  auctionResult: ArtistInsightsAuctionResult_auctionResult
}

const ArtistInsightsAuctionResult: React.FC<Props> = ({ auctionResult }) => {
  const now = moment()

  const awaitingResults = auctionResult.saleDate ? moment(auctionResult.saleDate).isAfter(now) : false

  const getRatio = useCallback(() => {
    if (!auctionResult.priceRealized?.cents || !auctionResult.estimate?.low) {
      return null
    }
    return auctionResult.priceRealized.cents / auctionResult.estimate.low
  }, [auctionResult.priceRealized, auctionResult.estimate])

  const ratio = getRatio()

  return (
    <Touchable
      withBlackUnderlayColor
      onPress={() => {
        console.log("do nothing")
      }}
    >
      <Flex height={100} py="2" px={2} flexDirection="row">
        {/* Sale Artwork Thumbnail Image */}
        {!auctionResult.images?.thumbnail?.url ? (
          <Flex width={60} height={60} backgroundColor="black10" alignItems="center" justifyContent="center">
            <NoArtworkIcon width={28} height={28} opacity={0.3} />
          </Flex>
        ) : (
          <Flex width={60} height={60} backgroundColor="black" alignItems="center" justifyContent="center">
            <OpaqueImageView width={60} height={60} imageURL={auctionResult.images.thumbnail.url} />
          </Flex>
        )}

        {/* Sale Artwork Details */}
        <Flex pl={15} flex={1} flexDirection="row" justifyContent="space-between">
          <Flex flex={3}>
            <Flex flexDirection="row">
              <Text variant="title" numberOfLines={1} style={{ flexShrink: 1 }}>
                {auctionResult.title}
              </Text>
              <Text variant="title" numberOfLines={1}>
                , {auctionResult.dateText}
              </Text>
            </Flex>
            {!!auctionResult.mediumText && (
              <Text variant="small" color="black60" numberOfLines={1}>
                {capitalize(auctionResult.mediumText)}
              </Text>
            )}

            {!!auctionResult.saleDate && (
              <Text variant="small" color="black60" numberOfLines={1}>
                {moment(auctionResult.saleDate).format("MMM D, YYYY")}
                {` ${bullet} `}
                {auctionResult.organization}
              </Text>
            )}
          </Flex>

          {/* Sale Artwork Auction Result */}
          <Flex alignItems="flex-end" pl={15}>
            {!!auctionResult.priceRealized?.display && !!auctionResult.currency ? (
              <Flex alignItems="flex-end">
                <Text variant="mediumText">
                  {(auctionResult.priceRealized?.display ?? "").replace(`${auctionResult.currency} `, "")}
                </Text>
                {!!ratio && (
                  <Flex borderRadius={2} overflow="hidden">
                    <Flex
                      position="absolute"
                      width="100%"
                      height="100%"
                      backgroundColor={ratioColor(ratio)}
                      opacity={0.05}
                    />
                    <Text variant="mediumText" color={ratioColor(ratio)} px="5px">
                      {ratio.toFixed(2)}x
                    </Text>
                  </Flex>
                )}
              </Flex>
            ) : (
              <Text variant="mediumText" style={{ width: 70 }} textAlign="right">
                {awaitingResults ? "Awaiting results" : "Not available"}
              </Text>
            )}
          </Flex>
        </Flex>
      </Flex>
    </Touchable>
  )
}

const ratioColor = (ratio: number) => {
  if (ratio >= 1.05) {
    return "green100"
  }
  if (ratio <= 0.95) {
    return "red100"
  }

  return "black60"
}

export const ArtistInsightsAuctionResultFragmentContainer = createFragmentContainer(ArtistInsightsAuctionResult, {
  auctionResult: graphql`
    fragment ArtistInsightsAuctionResult_auctionResult on AuctionResult {
      currency
      dateText
      id
      images {
        thumbnail {
          url(version: "square140")
          height
          width
          aspectRatio
        }
      }
      estimate {
        low
      }
      mediumText
      organization
      priceRealized {
        display
        cents
      }
      saleDate
      title
    }
  `,
})
