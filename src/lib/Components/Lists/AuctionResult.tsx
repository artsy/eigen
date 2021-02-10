import { AuctionResult_auctionResult } from "__generated__/AuctionResult_auctionResult.graphql"
import OpaqueImageView from "lib/Components/OpaqueImageView/OpaqueImageView"
import { capitalize } from "lodash"
import moment from "moment"
import { bullet, color, Flex, NoArtworkIcon, Text, Touchable } from "palette"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"
import { AuctionResultsMidEstimate } from "../AuctionResult/AuctionResultMidEstimate"

interface Props {
  auctionResult: AuctionResult_auctionResult
  onPress: () => void
}

const AuctionResult: React.FC<Props> = ({ auctionResult, onPress }) => {
  const now = moment()

  const isFromPastMonth = auctionResult.saleDate
    ? moment(auctionResult.saleDate).isAfter(now.subtract(1, "month"))
    : false

  return (
    <Touchable underlayColor={color("black5")} onPress={onPress}>
      <Flex py="2" px={2} flexDirection="row">
        {/* Sale Artwork Thumbnail Image */}
        {!auctionResult.images?.thumbnail?.url ? (
          <Flex
            width={60}
            height={60}
            borderRadius={2}
            backgroundColor="black10"
            alignItems="center"
            justifyContent="center"
          >
            <NoArtworkIcon width={28} height={28} opacity={0.3} />
          </Flex>
        ) : (
          <Flex
            width={60}
            height={60}
            borderRadius={2}
            backgroundColor="black"
            alignItems="center"
            justifyContent="center"
          >
            <OpaqueImageView width={60} height={60} imageURL={auctionResult.images.thumbnail.url} />
          </Flex>
        )}

        {/* Sale Artwork Details */}
        <Flex pl={15} flex={1} flexDirection="row" justifyContent="space-between">
          <Flex flex={3}>
            <Flex flexDirection="row" mb={"3px"}>
              <Text variant="caption" ellipsizeMode="middle" numberOfLines={2} style={{ flexShrink: 1 }}>
                {auctionResult.title}
                {!!auctionResult.dateText && auctionResult.dateText !== "" && `, ${auctionResult.dateText}`}
              </Text>
            </Flex>
            {!!auctionResult.mediumText && (
              <Text variant="small" color="black60" numberOfLines={1}>
                {capitalize(auctionResult.mediumText)}
              </Text>
            )}

            {!!auctionResult.saleDate && (
              <Text variant="small" color="black60" numberOfLines={1} testID="saleInfo">
                {moment(auctionResult.saleDate).utc().format("MMM D, YYYY")}
                {` ${bullet} `}
                {auctionResult.organization}
              </Text>
            )}
          </Flex>

          {/* Sale Artwork Auction Result */}
          <Flex alignItems="flex-end" pl={15}>
            {!!auctionResult.priceRealized?.display && !!auctionResult.currency ? (
              <Flex alignItems="flex-end">
                <Text variant="caption" fontWeight="bold" testID="price">
                  {(auctionResult.priceRealized?.display ?? "").replace(`${auctionResult.currency} `, "")}
                </Text>
                {!!auctionResult.performance?.mid && (
                  <AuctionResultsMidEstimate value={auctionResult.performance.mid} shortDescription="est" />
                )}
              </Flex>
            ) : (
              <Flex alignItems="flex-end">
                <Text variant="caption" fontWeight="bold" style={{ width: 100 }} textAlign="right" testID="price">
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
      performance {
        mid
      }
      priceRealized {
        display
        cents
      }
      saleDate
      title
    }
  `,
})
