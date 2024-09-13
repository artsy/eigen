import {
  bullet,
  Flex,
  NoArtworkIcon,
  Spacer,
  Stopwatch,
  Text,
  useColor,
  Touchable,
} from "@artsy/palette-mobile"
import { addBreadcrumb } from "@sentry/react-native"
import { AuctionResultListItem_auctionResult$data } from "__generated__/AuctionResultListItem_auctionResult.graphql"
import { auctionResultHasPrice, auctionResultText } from "app/Scenes/AuctionResult/helpers"
import { navigate } from "app/system/navigation/navigate"
import { QAInfoManualPanel, QAInfoRow } from "app/utils/QAInfo"
import { capitalize } from "lodash"
import moment from "moment"
import { useState } from "react"
import FastImage from "react-native-fast-image"
import { createFragmentContainer, graphql } from "react-relay"
import { useTracking } from "react-tracking"

interface Props {
  auctionResult: AuctionResultListItem_auctionResult$data
  first?: boolean
  onPress?: () => void
  onTrack?: () => void
  showArtistName?: boolean
  trackingEventPayload?: {}
  width?: number
  withHorizontalPadding?: boolean
}

const IMAGE_WIDTH = 100
const IMAGE_HEIGHT = 130

const AuctionResultListItem: React.FC<Props> = ({
  auctionResult,
  onPress,
  showArtistName,
  trackingEventPayload,
  onTrack,
  width,
  withHorizontalPadding = true,
}) => {
  const tracking = useTracking()
  const [couldNotLoadImage, setCouldNotLoadImage] = useState(false)

  const color = useColor()

  const QAInfo: React.FC = () => (
    <QAInfoManualPanel position="absolute" top={0} left={95}>
      <QAInfoRow name="id" value={auctionResult.internalID} />
    </QAInfoManualPanel>
  )

  const handlePress = () => {
    if (onPress) {
      onPress()
      return
    }

    if (onTrack) {
      onTrack()
    } else if (trackingEventPayload) {
      tracking.trackEvent(trackingEventPayload)
    }

    // For upcoming auction results that are happening in Artsy we want to navigate to the lot page
    if (auctionResult.isUpcoming && auctionResult.isInArtsyAuction && auctionResult.externalURL) {
      navigate(auctionResult.externalURL)
    } else {
      navigate(`/artist/${auctionResult.artistID}/auction-result/${auctionResult.internalID}`)
    }
  }

  return (
    <Touchable underlayColor={color("black5")} onPress={handlePress}>
      <Flex px={withHorizontalPadding ? 2 : 0} flexDirection="row" width={width}>
        {/* Sale Artwork Thumbnail Image */}
        {!auctionResult.images?.thumbnail?.url || couldNotLoadImage ? (
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
              onError={() => {
                addBreadcrumb({
                  message: `Failed to load auction result image for id: ${auctionResult.internalID}`,
                  level: "info",
                })
                setCouldNotLoadImage(true)
              }}
              resizeMode={FastImage.resizeMode.cover}
            />
          </Flex>
        )}

        {/* Sale Artwork Details */}
        <Flex pl="15px" flex={1} flexDirection="row" justifyContent="space-between">
          <Flex flex={4}>
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

            <Spacer y={1} />

            {!!auctionResult.saleDate && (
              <Text variant="xs" color="black60" numberOfLines={1} testID="saleInfo">
                {moment(auctionResult.saleDate).utc().format("MMM D, YYYY")}
                {` ${bullet} `}
                {auctionResult.organization}
              </Text>
            )}

            <AuctionResultPriceSection auctionResult={auctionResult} />
          </Flex>
        </Flex>
      </Flex>
      <QAInfo />
    </Touchable>
  )
}

const AuctionResultPriceSection = ({
  auctionResult,
}: {
  auctionResult: AuctionResultListItem_auctionResult$data
}) => {
  if (auctionResult.isUpcoming) {
    if (!!auctionResult.estimate?.display) {
      return (
        <Text variant="xs" fontWeight="500" testID="price">
          {auctionResult.estimate.display}
          <Text variant="xs" fontWeight="400">
            {" "}
            (est)
          </Text>
        </Text>
      )
    }
    return (
      <Text variant="xs" testID="price" italic>
        Estimate not available
      </Text>
    )
  }

  const showPriceUSD = auctionResult.priceRealized?.displayUSD && auctionResult.currency !== "USD"

  if (auctionResultHasPrice(auctionResult)) {
    return (
      <Text testID="price">
        <Text variant="xs" fontWeight="500">
          {auctionResult.priceRealized?.display}
          {!!showPriceUSD && auctionResult.priceRealized?.display ? ` ${bullet} ` : ""}
          {!!showPriceUSD && (
            <Text variant="xs" testID="priceUSD">
              {auctionResult.priceRealized?.displayUSD}
            </Text>
          )}
        </Text>
      </Text>
    )
  }

  const resultText = auctionResultText(auctionResult)

  return (
    <Flex flexDirection="row" alignItems="center">
      {resultText === "Awaiting results" && <Stopwatch height={15} width={15} mr={0.5} />}
      <Text variant="xs" testID="price" italic>
        {resultText}
      </Text>
    </Flex>
  )
}

export const AuctionResultListSeparator = () => <Spacer y={2} />

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
        isUpcoming
        isInArtsyAuction
        externalURL
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
          display
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
