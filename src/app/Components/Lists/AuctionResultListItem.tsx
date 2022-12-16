import { AuctionResultListItem_auctionResult$data } from "__generated__/AuctionResultListItem_auctionResult.graphql"
import { auctionResultHasPrice, auctionResultText } from "app/Scenes/AuctionResult/helpers"
import { QAInfoManualPanel, QAInfoRow } from "app/utils/QAInfo"
import { capitalize } from "lodash"
import moment from "moment"
import { bullet, Flex, NoArtworkIcon, Spacer, Text, Touchable, useColor } from "palette"
import { Stopwatch } from "palette/svgs/sf"
import FastImage from "react-native-fast-image"
import { createFragmentContainer, graphql } from "react-relay"
import { AuctionResultsMidEstimate } from "../AuctionResult/AuctionResultMidEstimate"

interface Props {
  auctionResult: AuctionResultListItem_auctionResult$data
  onPress: () => void
  showArtistName?: boolean
  withHorizontalPadding?: boolean
  first?: boolean
}

const AuctionResultListItem: React.FC<Props> = ({
  auctionResult,
  onPress,
  showArtistName,
  withHorizontalPadding = true,
  first,
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
      <Flex px={withHorizontalPadding ? 2 : 0} pb={1} pt={first ? 0 : 1} flexDirection="row">
        {/* Sale Artwork Thumbnail Image */}
        {!auctionResult.images?.thumbnail?.url ? (
          <Flex
            width={100}
            height={130}
            borderRadius={2}
            backgroundColor="black5"
            alignItems="center"
            justifyContent="center"
          >
            <NoArtworkIcon width={30} height={30} fill="black60" />
          </Flex>
        ) : (
          <Flex
            width={100}
            height={130}
            borderRadius={2}
            backgroundColor="bla ck"
            alignItems="center"
            justifyContent="center"
            overflow="hidden"
            // To align the image with the text we have to add top margin to compensate the line height.
            style={{ marginTop: 3 }}
          >
            <FastImage
              style={{ backgroundColor: color("black5"), height: 130, width: 100 }}
              source={{
                uri: auctionResult.images.thumbnail.url,
              }}
              resizeMode={FastImage.resizeMode.contain}
            />
          </Flex>
        )}

        {/* Sale Artwork Details */}
        <Flex pl={15} flex={1} flexDirection="row" justifyContent="space-between">
          <Flex flex={3}>
            <Flex>
              {!!showArtistName && !!auctionResult.artist?.name && (
                <Text variant="xs" color="black100" numberOfLines={2}>
                  {auctionResult.artist?.name}
                </Text>
              )}
              <Text
                variant="xs"
                ellipsizeMode="middle"
                color="black100"
                numberOfLines={1}
                style={{ flexShrink: 1 }}
              >
                {auctionResult.title}
                {!!auctionResult.dateText &&
                  auctionResult.dateText !== "" &&
                  `, ${auctionResult.dateText}`}
                {/* </Text> */}
              </Text>
            </Flex>

            {!!auctionResult.mediumText && (
              <Text variant="xs" color="black60" numberOfLines={1}>
                {capitalize(auctionResult.mediumText)}
              </Text>
            )}

            {!!auctionResult.dimensionText && (
              <Text variant="xs" color="black60" numberOfLines={1}>
                {auctionResult.dimensionText}
              </Text>
            )}

            <Spacer mt={1} />

            {!!auctionResult.saleDate && (
              <Text variant="xs" color="black60" numberOfLines={1} testID="saleInfo">
                {moment(auctionResult.saleDate).utc().format("MMM D, YYYY")}
                {` ${bullet} `}
                {auctionResult.organization}
              </Text>
            )}

            {auctionResultHasPrice(auctionResult) ? (
              <Flex>
                <Text variant="xs" fontWeight="500" testID="price">
                  {auctionResult.priceRealized?.display}
                  {!!showPriceUSD && (
                    <Text variant="xs" testID="priceUSD">
                      {` ${bullet} `}
                      {auctionResult.priceRealized?.displayUSD}
                    </Text>
                  )}{" "}
                  {!!auctionResult.performance?.mid && (
                    <AuctionResultsMidEstimate
                      value={auctionResult.performance.mid}
                      shortDescription="est"
                    />
                  )}
                </Text>
              </Flex>
            ) : (
              <Flex flexDirection="row" alignItems="center">
                <Stopwatch height={15} width={15} mr={0.5} />
                <Text variant="xs" testID="price" italic>
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

export const AuctionResultListSeparator = () => <Spacer px={2} />

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
        dimensionText
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
