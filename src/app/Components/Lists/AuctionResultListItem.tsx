import { AuctionResultListItem_auctionResult } from "__generated__/AuctionResultListItem_auctionResult.graphql"
import OpaqueImageView from "app/Components/OpaqueImageView/OpaqueImageView"
import { auctionResultHasPrice, auctionResultText } from "app/Scenes/AuctionResult/helpers"
import { QAInfoManualPanel, QAInfoRow } from "app/utils/QAInfo"
import { capitalize } from "lodash"
import moment from "moment"
import { bullet, Flex, NoArtworkIcon, Text, Touchable, useColor } from "palette"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"
import { AuctionResultsMidEstimate } from "../AuctionResult/AuctionResultMidEstimate"

interface Props {
  auctionResult: AuctionResultListItem_auctionResult
  onPress: () => void
  showArtistName?: boolean
  withHorizontalPadding?: boolean
}

const AuctionResultListItem: React.FC<Props> = ({
  auctionResult,
  onPress,
  showArtistName,
  withHorizontalPadding = true,
}) => {
  const color = useColor()

  const showPriceUSD = auctionResult.priceRealized?.displayUSD && auctionResult.currency !== "USD"

  const QAInfo: React.FC = () => (
    <QAInfoManualPanel position="absolute" top={0} left={95}>
      <QAInfoRow name="id" value={auctionResult.internalID} />
    </QAInfoManualPanel>
  )

  return (
    <Touchable underlayColor={color("black5")} onPress={onPress}>
      <Flex px={withHorizontalPadding ? 2 : 0} py={2} flexDirection="row">
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
            overflow="hidden"
            // To align the image with the text we have to add top margin to compensate the line height.
            style={{ marginTop: 3 }}
          >
            <OpaqueImageView width={60} height={60} imageURL={auctionResult.images.thumbnail.url} />
          </Flex>
        )}

        {/* Sale Artwork Details */}
        <Flex pl={15} flex={1} flexDirection="row" justifyContent="space-between">
          <Flex flex={3}>
            <Flex>
              {!!showArtistName && !!auctionResult.artist?.name && (
                <Text variant="xs" ellipsizeMode="middle" numberOfLines={2} fontWeight="bold">
                  {auctionResult.artist?.name}
                </Text>
              )}
              <Text variant="xs" ellipsizeMode="middle" numberOfLines={2} style={{ flexShrink: 1 }}>
                {auctionResult.title}
                {!!auctionResult.dateText &&
                  auctionResult.dateText !== "" &&
                  `, ${auctionResult.dateText}`}
              </Text>
            </Flex>
            {!!auctionResult.mediumText && (
              <Text variant="xs" color="black60" numberOfLines={1}>
                {capitalize(auctionResult.mediumText)}
              </Text>
            )}

            {!!auctionResult.saleDate && (
              <Text variant="xs" color="black60" numberOfLines={1} testID="saleInfo">
                {moment(auctionResult.saleDate).utc().format("MMM D, YYYY")}
                {` ${bullet} `}
                {auctionResult.organization}
              </Text>
            )}
          </Flex>

          {/* Sale Artwork Auction Result */}
          <Flex alignItems="flex-end" pl={15}>
            {auctionResultHasPrice(auctionResult) ? (
              <Flex alignItems="flex-end">
                <Text variant="xs" fontWeight="bold" testID="price">
                  {auctionResult.priceRealized?.display}
                </Text>
                {!!showPriceUSD && (
                  <Text variant="xs" color="black60" testID="priceUSD">
                    {auctionResult.priceRealized?.displayUSD}
                  </Text>
                )}
                {!!auctionResult.performance?.mid && (
                  <AuctionResultsMidEstimate
                    value={auctionResult.performance.mid}
                    shortDescription="est"
                  />
                )}
              </Flex>
            ) : (
              <Flex alignItems="flex-end">
                <Text
                  variant="xs"
                  fontWeight="bold"
                  style={{ width: 100 }}
                  textAlign="right"
                  testID="price"
                >
                  {auctionResultText(auctionResult)}
                </Text>
              </Flex>
            )}
          </Flex>
        </Flex>
      </Flex>
      <QAInfo />
    </Touchable>
  )
}

export const AuctionResultListItemFragmentContainer = createFragmentContainer(
  AuctionResultListItem,
  {
    auctionResult: graphql`
      fragment AuctionResultListItem_auctionResult on AuctionResult {
        currency
        dateText
        id
        internalID
        artist {
          name
        }
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
          cents
          display
          displayUSD
        }
        saleDate
        title
      }
    `,
  }
)
