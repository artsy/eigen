import { AuctionResultListItem_auctionResult$data } from "__generated__/AuctionResultListItem_auctionResult.graphql"
import { navigate } from "app/navigation/navigate"
import { auctionResultHasPrice, auctionResultText } from "app/Scenes/AuctionResult/helpers"
import { QAInfoManualPanel, QAInfoRow } from "app/utils/QAInfo"
import { capitalize } from "lodash"
import moment from "moment"
import { bullet, Flex, NoArtworkIcon, Spacer, Text, Touchable, useColor } from "palette"
import { Stopwatch } from "palette/svgs/sf"
import { Dimensions } from "react-native"
import FastImage from "react-native-fast-image"
import { createFragmentContainer, graphql } from "react-relay"
import { AuctionResultsMidEstimate } from "../AuctionResult/AuctionResultMidEstimate"

interface Props {
  auctionResult: AuctionResultListItem_auctionResult$data
  first?: boolean
  onPress?: () => void
  showArtistName?: boolean
  width?: number
  withHorizontalPadding?: boolean
}

const IMAGE_WIDTH = 100
const IMAGE_HEIGHT = 130

const AuctionResultListItem: React.FC<Props> = ({
  auctionResult,
  first,
  onPress,
  showArtistName,
  width,
  withHorizontalPadding = true,
}) => {
  const color = useColor()

  const { width: screenWidth } = Dimensions.get("screen")

  const showPriceUSD = auctionResult.priceRealized?.displayUSD && auctionResult.currency !== "USD"

  const QAInfo: React.FC = () => (
    <QAInfoManualPanel position="absolute" top={0} left={95}>
      <QAInfoRow name="id" value={auctionResult.internalID} />
    </QAInfoManualPanel>
  )

  return (
    <Touchable
      underlayColor={color("black5")}
      onPress={() => {
        if (onPress) {
          onPress()
        } else {
          navigate(`/artist/${auctionResult.artistID}/auction-result/${auctionResult.internalID}`)
        }
      }}
    >
      <Flex
        px={withHorizontalPadding ? 2 : 0}
        pb={1}
        pt={first ? 0 : 1}
        flexDirection="row"
        width={width || screenWidth}
      >
        {/* Sale Artwork Thumbnail Image */}
        {!auctionResult.images?.thumbnail?.url ? (
          <Flex
            width={IMAGE_WIDTH}
            height={IMAGE_HEIGHT}
            borderRadius={2}
            backgroundColor="black5"
            alignItems="center"
            justifyContent="center"
          >
            <NoArtworkIcon width={30} height={30} fill="black60" />
          </Flex>
        ) : (
          <Flex
            width={IMAGE_WIDTH}
            height={IMAGE_HEIGHT}
            borderRadius={2}
            alignItems="center"
            justifyContent="center"
            overflow="hidden"
            // To align the image with the text we have to add top margin to compensate the line height.
            style={{ marginTop: 3 }}
          >
            <FastImage
              style={{
                height: IMAGE_HEIGHT,
                width: 100,
              }}
              source={{
                uri: auctionResult.images.thumbnail.url,
              }}
              resizeMode={FastImage.resizeMode.cover}
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
                  {!!showPriceUSD && auctionResult.priceRealized?.display ? ` ${bullet} ` : ""}
                  {!!showPriceUSD && (
                    <Text variant="xs" testID="priceUSD">
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
        artistID
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
