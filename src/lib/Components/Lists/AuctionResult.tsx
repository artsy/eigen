import { AuctionResult_auctionResult } from "__generated__/AuctionResult_auctionResult.graphql"
import OpaqueImageView from "lib/Components/OpaqueImageView/OpaqueImageView"
import { capitalize } from "lodash"
import moment from "moment"
import { bullet, color, Flex, NoArtworkIcon, Text, Touchable } from "palette"
import React, { useCallback } from "react"
import { createFragmentContainer, graphql } from "react-relay"

interface Props {
  auctionResult: AuctionResult_auctionResult
  onPress: () => void
}

const AuctionResult: React.FC<Props> = ({ auctionResult, onPress }) => {
  const now = moment()

  const isFromPastMonth = auctionResult.saleDate
    ? moment(auctionResult.saleDate).isAfter(now.subtract(1, "month"))
    : false

  const getRatio = useCallback(() => {
    if (!auctionResult.priceRealized?.cents || !auctionResult.estimate?.low) {
      return null
    }
    return auctionResult.priceRealized.cents / auctionResult.estimate.low
  }, [auctionResult.priceRealized, auctionResult.estimate])

  const ratio = getRatio()

  return (
    <Touchable underlayColor={color("black5")} onPress={onPress}>
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
            <Flex flexDirection="row" mb={0.5}>
              <Text variant="subtitle" numberOfLines={1} style={{ flexShrink: 1 }}>
                {auctionResult.title}
              </Text>
              {!!auctionResult.dateText && auctionResult.dateText !== "" && (
                <Text variant="subtitle" numberOfLines={1}>
                  , {auctionResult.dateText}
                </Text>
              )}
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
                <Text variant="subtitle" fontWeight="bold">
                  {(auctionResult.priceRealized?.display ?? "").replace(`${auctionResult.currency} `, "")}
                </Text>
                {!!ratio && (
                  <Flex borderRadius={2} overflow="hidden">
                    <Flex
                      position="absolute"
                      width="100%"
                      height="100%"
                      backgroundColor={ratioColor(ratio)}
                      opacity={0.1}
                    />
                    <Text variant="mediumText" color={ratioColor(ratio)} px="5px">
                      {ratio.toFixed(2)}x
                    </Text>
                  </Flex>
                )}
              </Flex>
            ) : (
              <Flex alignItems="flex-end">
                <Text variant="subtitle" fontWeight="bold" style={{ width: 70 }} textAlign="right">
                  {auctionResult.boughtIn === true
                    ? "Bought in"
                    : isFromPastMonth
                    ? "Awaiting results"
                    : "Not available"}
                </Text>
              </Flex>
            )}
          </Flex>
        </Flex>
      </Flex>
    </Touchable>
  )
}

export const ratioColor = (ratio: number) => {
  if (ratio >= 1.05) {
    return "green100"
  }
  if (ratio <= 0.95) {
    return "red100"
  }

  return "black60"
}

export const AuctionResultFragmentContainer = createFragmentContainer(AuctionResult, {
  auctionResult: graphql`
    fragment AuctionResult_auctionResult on AuctionResult {
      currency
      dateText
      id
      internalID
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
      boughtIn
      priceRealized {
        display
        cents
      }
      saleDate
      title
    }
  `,
})
