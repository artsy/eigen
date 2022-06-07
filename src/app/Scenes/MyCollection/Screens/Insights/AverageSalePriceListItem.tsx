import { AuctionResultsMidEstimate } from "app/Components/AuctionResult/AuctionResultMidEstimate"
import OpaqueImageView from "app/Components/OpaqueImageView/OpaqueImageView"
import { auctionResultHasPrice, auctionResultText } from "app/Scenes/AuctionResult/helpers"
import { QAInfoManualPanel, QAInfoRow } from "app/utils/QAInfo"
import { capitalize } from "lodash"
import moment from "moment"
import { bullet, Flex, NoArtworkIcon, Spacer, Text, Touchable, useColor } from "palette"
import React from "react"

interface Props {
  estimatedArtwork: any
  onPress: () => void
  showArtistName?: boolean
  withHorizontalPadding?: boolean
  first?: boolean
  rounded?: boolean
}

export const AverageSalePriceListItem: React.FC<Props> = ({
  estimatedArtwork,
  onPress,
  showArtistName,
  withHorizontalPadding = true,
  first,
  rounded,
}) => {
  const color = useColor()

  const showPriceUSD =
    estimatedArtwork.priceRealized?.displayUSD && estimatedArtwork.currency !== "USD"

  const QAInfo: React.FC = () => (
    <QAInfoManualPanel position="absolute" top={0} left={95}>
      <QAInfoRow name="id" value={estimatedArtwork.internalID} />
    </QAInfoManualPanel>
  )
  console.log("estimatedArtwork = ", estimatedArtwork)
  return (
    <Touchable underlayColor={color("black5")} onPress={onPress}>
      <Flex px={withHorizontalPadding ? 2 : 0} pb={1} pt={first ? 0 : 1} flexDirection="row">
        {/* Sale Artwork Thumbnail Image */}
        {!estimatedArtwork.images?.thumbnail?.url ? (
          <Flex
            width={60}
            height={60}
            borderRadius={rounded ? 60 / 2 : 2}
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
            borderRadius={rounded ? 60 / 2 : 2}
            backgroundColor="black"
            alignItems="center"
            justifyContent="center"
            overflow="hidden"
            // To align the image with the text we have to add top margin to compensate the line height.
            style={{ marginTop: 3 }}
          >
            <OpaqueImageView
              width={60}
              height={60}
              imageURL={estimatedArtwork.images.thumbnail.url}
            />
          </Flex>
        )}
        {/* Sale Artwork Details */}
        <Flex pl={15} flex={1} flexDirection="row" justifyContent="space-between">
          <Flex flex={3}>
            <Flex>
              {!!showArtistName && !!estimatedArtwork.artist?.name && (
                <Text variant="xs" ellipsizeMode="middle" numberOfLines={2}>
                  {estimatedArtwork.artist?.name}
                </Text>
              )}
              <Text
                variant="xs"
                ellipsizeMode="middle"
                color="black60"
                numberOfLines={2}
                italic
                style={{ flexShrink: 1 }}
              >
                {estimatedArtwork.title}
                <Text variant="xs" color="black60">
                  {!!estimatedArtwork.dateText &&
                    estimatedArtwork.dateText !== "" &&
                    `, ${estimatedArtwork.dateText}`}
                </Text>
              </Text>
            </Flex>
            {!!estimatedArtwork.mediumText && (
              <Text variant="xs" color="black60" numberOfLines={1}>
                {capitalize(estimatedArtwork.mediumText)}
              </Text>
            )}

            {!!estimatedArtwork.saleDate && (
              <Text variant="xs" color="black60" numberOfLines={1} testID="saleInfo">
                {moment(estimatedArtwork.saleDate).utc().format("MMM D, YYYY")}
                {` ${bullet} `}
                {estimatedArtwork.organization}
              </Text>
            )}
          </Flex>

          {/* Sale Artwork Auction Result */}
          <Flex alignItems="flex-end" pl={15}>
            {false /* auctionResultHasPrice(estimatedArtwork) */ ? (
              <Flex alignItems="flex-end">
                <Text variant="xs" fontWeight="500" testID="price">
                  {estimatedArtwork.priceRealized?.display}
                </Text>
                {!!showPriceUSD && (
                  <Text variant="xs" color="black60" testID="priceUSD">
                    {estimatedArtwork.priceRealized?.displayUSD}
                  </Text>
                )}
                {!!estimatedArtwork.performance?.mid && (
                  <AuctionResultsMidEstimate
                    value={estimatedArtwork.performance.mid}
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
                  {auctionResultText(estimatedArtwork)}
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

export const AverageSalePriceListSeparator = () => <Spacer px={2} />

/* export const AuctionResultListItemFragmentContainer = createFragmentContainer(
  AuctionResultListItem,
  {
    estimatedArtwork: graphql`
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
) */
