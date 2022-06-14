import { ActionType, ContextModule, OwnerType, TappedInfoBubble } from "@artsy/cohesion"
import { AuctionResult_artist$data } from "__generated__/AuctionResult_artist.graphql"
import { AuctionResult_auctionResult$data } from "__generated__/AuctionResult_auctionResult.graphql"
import { AuctionResultQuery } from "__generated__/AuctionResultQuery.graphql"
import { AuctionResultsMidEstimate } from "app/Components/AuctionResult/AuctionResultMidEstimate"
import { InfoButton } from "app/Components/Buttons/InfoButton"
import { FancyModalHeader } from "app/Components/FancyModal/FancyModalHeader"
import { navigate } from "app/navigation/navigate"
import { defaultEnvironment } from "app/relay/createEnvironment"
import { PlaceholderBox } from "app/utils/placeholders"
import { QAInfoPanel } from "app/utils/QAInfo"
import { renderWithPlaceholder } from "app/utils/renderWithPlaceholder"
import { ProvideScreenTrackingWithCohesionSchema } from "app/utils/track"
import { screen } from "app/utils/track/helpers"
import { useStickyScrollHeader } from "app/utils/useStickyScrollHeader"
import { capitalize } from "lodash"
import moment from "moment"
import { Box, Flex, NoArtworkIcon, Separator, Spacer, Text, useTheme } from "palette"
import React, { useEffect, useState } from "react"
import { Animated, Image, TextInput, TouchableWithoutFeedback } from "react-native"
import { createFragmentContainer, graphql, QueryRenderer } from "react-relay"
import { useTracking } from "react-tracking"
import { getImageDimensions } from "../Sale/Components/SaleArtworkListItem"
import { ComparableWorksFragmentContainer } from "./ComparableWorks"
import { auctionResultHasPrice, AuctionResultHelperData, auctionResultText } from "./helpers"

const CONTAINER_HEIGHT = 80

interface Props {
  artist: AuctionResult_artist$data
  auctionResult: AuctionResult_auctionResult$data
}

export const AuctionResult: React.FC<Props> = ({ artist, auctionResult }) => {
  const { theme } = useTheme()
  const [imageHeight, setImageHeight] = useState<number>(0)
  const [imageWidth, setImageWidth] = useState<number>(0)

  const tracking = useTracking()

  if (!auctionResult) {
    // The only chance someone would land on this case is using a deep link for an auction result
    // that is no longer there
    return <Flex />
  }

  useEffect(() => {
    if (auctionResult.images?.thumbnail?.url) {
      Image.getSize(auctionResult.images.thumbnail.url, (width, height) => {
        const imageDimensions = getImageDimensions(height, width, CONTAINER_HEIGHT)
        setImageHeight(imageDimensions.height)
        setImageWidth(imageDimensions.width)
      })
    }
  }, [])

  const { headerElement, scrollProps } = useStickyScrollHeader({
    header: (
      <Flex flex={1} pl={6} pr={4} pt={0.5} flexDirection="row">
        <Text variant="sm" numberOfLines={1} style={{ flexShrink: 1 }}>
          {auctionResult.title}
        </Text>
        {!!auctionResult.dateText && <Text variant="sm">, {auctionResult.dateText}</Text>}
      </Flex>
    ),
  })

  const details = []
  const makeRow = (
    label: string,
    value: string,
    options?: { fullWidth?: boolean; testID?: string }
  ) => (
    <Flex key={label} mb={1}>
      <Flex style={{ opacity: 0.5 }}>
        <Separator mb={1} />
      </Flex>
      {options?.fullWidth ? (
        <Flex>
          <Text color="black60" mb={1}>
            {label}
          </Text>
          <TextInput
            editable={false}
            value={value}
            multiline
            scrollEnabled={false}
            style={{
              fontFamily: theme.fonts.sans.regular,
              fontSize: 14,
              lineHeight: 21,
            }}
          />
        </Flex>
      ) : (
        <Flex flexDirection="row" justifyContent="space-between">
          <Text style={{ width: "35%" }} color="black60">
            {label}
          </Text>
          <Flex width="65%" pl={15}>
            <Text pl={2} textAlign="right" testID={options?.testID} selectable>
              {value}
            </Text>
          </Flex>
        </Flex>
      )}
    </Flex>
  )
  if (auctionResult.estimate?.display) {
    details.push(makeRow("Pre-sale estimate", auctionResult.estimate?.display))
  }
  if (auctionResult.mediumText) {
    details.push(makeRow("Materials", capitalize(auctionResult.mediumText)))
  }
  if (auctionResult.dimensionText) {
    details.push(makeRow("Dimensions", auctionResult.dimensionText))
  }
  if (auctionResult.dateText) {
    details.push(makeRow("Artwork date", auctionResult.dateText))
  }
  if (auctionResult.saleDate) {
    details.push(
      makeRow("Sale date", moment(auctionResult.saleDate).utc().format("MMM D, YYYY"), {
        testID: "saleDate",
      })
    )
  }
  if (auctionResult.organization) {
    details.push(makeRow("Auction house", auctionResult.organization))
  }
  if (auctionResult.saleTitle) {
    details.push(makeRow("Sale name", auctionResult.saleTitle))
  }
  if (auctionResult.location) {
    details.push(makeRow("Sale location", auctionResult.location))
  }

  const hasSalePrice = auctionResultHasPrice(auctionResult as AuctionResultHelperData)
  const salePriceMessage = auctionResultText(auctionResult as AuctionResultHelperData)
  const showPriceUSD = auctionResult.priceRealized?.displayUSD && auctionResult.currency !== "USD"

  const renderRealizedPriceModal = () => (
    <>
      <Spacer my={1} />
      <Text>
        The sale price includes the hammer price and buyer’s premium, as well as any other
        additional fees (e.g., Artist’s Resale Rights).
      </Text>
      <Spacer mb={2} />
    </>
  )

  const QAInfo = () => (
    <QAInfoPanel
      style={{ position: "absolute", top: 200, right: 40 }}
      info={[
        ["id", auctionResult.internalID],
        ["bought in", `${auctionResult.boughtIn}`],
        ["cents", `${auctionResult.priceRealized?.centsUSD}`],
      ]}
    />
  )

  return (
    <ProvideScreenTrackingWithCohesionSchema info={tracks.screen(auctionResult.internalID)}>
      <Animated.ScrollView {...scrollProps}>
        <FancyModalHeader hideBottomDivider />
        <Box px={2} pb={4}>
          <Flex mt={1} mb={4} style={{ flexDirection: "row" }}>
            {!!auctionResult.images?.thumbnail?.url && !!imageHeight && !!imageWidth ? (
              <Flex height={CONTAINER_HEIGHT} width={CONTAINER_HEIGHT} justifyContent="center">
                <Image
                  style={{ height: imageHeight, width: imageWidth }}
                  source={{ uri: auctionResult.images?.thumbnail?.url }}
                />
              </Flex>
            ) : (
              <Box
                style={{ height: CONTAINER_HEIGHT, width: CONTAINER_HEIGHT }}
                backgroundColor="black10"
                alignItems="center"
                justifyContent="center"
              >
                {!auctionResult.images?.thumbnail?.url && (
                  <NoArtworkIcon width={28} height={28} opacity={0.3} />
                )}
              </Box>
            )}
            <Flex justifyContent="center" flex={1} ml={2}>
              <TouchableWithoutFeedback
                onPress={() => artist?.href && navigate(artist.href)}
                hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}
              >
                <Text variant="sm">{artist?.name}</Text>
              </TouchableWithoutFeedback>
              <Text variant="md">
                {auctionResult.title}
                {!!auctionResult.dateText && `, ${auctionResult.dateText}`}
              </Text>
            </Flex>
          </Flex>
          {!!hasSalePrice && (
            <Flex flexDirection="row" mb={1}>
              <InfoButton
                titleElement={
                  <Text variant="md" mr={0.5}>
                    Sale Price
                  </Text>
                }
                trackEvent={() => {
                  tracking.trackEvent(tracks.tapMarketStatsInfo())
                }}
                modalTitle="Sale Price"
                maxModalHeight={180}
                modalContent={renderRealizedPriceModal()}
              />
            </Flex>
          )}
          {hasSalePrice ? (
            <>
              <Flex mb={0.5}>
                <Text variant="lg">{auctionResult.priceRealized?.display}</Text>
                {!!showPriceUSD && (
                  <Text variant="sm" color="black60" testID="priceUSD">
                    {auctionResult.priceRealized?.displayUSD}
                  </Text>
                )}
              </Flex>
              {!!auctionResult.performance?.mid && (
                <AuctionResultsMidEstimate
                  textVariant="xs"
                  value={auctionResult.performance.mid}
                  shortDescription="mid-estimate"
                />
              )}
            </>
          ) : (
            <Text variant="lg">{salePriceMessage}</Text>
          )}

          <Text variant="md" mt={4} mb={1}>
            Stats
          </Text>
          {details}
          <ComparableWorksFragmentContainer auctionResult={auctionResult} />
        </Box>
        <QAInfo />
      </Animated.ScrollView>
      {headerElement}
    </ProvideScreenTrackingWithCohesionSchema>
  )
}

export const AuctionResultFragmentContainer = createFragmentContainer(AuctionResult, {
  auctionResult: graphql`
    fragment AuctionResult_auctionResult on AuctionResult {
      id
      internalID
      artistID
      boughtIn
      currency
      categoryText
      dateText
      dimensions {
        height
        width
      }
      dimensionText
      estimate {
        display
        high
        low
      }
      images {
        thumbnail {
          url(version: "square140")
          height
          width
          aspectRatio
        }
      }
      location
      mediumText
      organization
      performance {
        mid
      }
      currency
      priceRealized {
        cents
        centsUSD
        display
        displayUSD
      }
      saleDate
      saleTitle
      title
      ...ComparableWorks_auctionResult
    }
  `,
  artist: graphql`
    fragment AuctionResult_artist on Artist {
      name
      href
    }
  `,
})

interface AuctionResultQueryRendererProps {
  auctionResultInternalID: string
  artistID: string
}

export const AuctionResultQueryRenderer: React.FC<AuctionResultQueryRendererProps> = ({
  auctionResultInternalID,
  artistID,
}) => {
  return (
    <QueryRenderer<AuctionResultQuery>
      environment={defaultEnvironment}
      query={graphql`
        query AuctionResultQuery($auctionResultInternalID: String!, $artistID: String!) {
          auctionResult: auctionResult(id: $auctionResultInternalID) {
            ...AuctionResult_auctionResult
          }
          artist: artist(id: $artistID) {
            ...AuctionResult_artist
          }
        }
      `}
      variables={{
        auctionResultInternalID,
        artistID,
      }}
      render={renderWithPlaceholder({
        Container: AuctionResultFragmentContainer,
        renderPlaceholder: LoadingSkeleton,
      })}
    />
  )
}

const LoadingSkeleton = () => {
  const details = []
  for (let i = 0; i < 8; i++) {
    details.push(
      <Flex flexDirection="row" justifyContent="space-between" mb={2} key={i}>
        <PlaceholderBox
          width={CONTAINER_HEIGHT + Math.round(Math.random() * CONTAINER_HEIGHT)}
          height={20}
        />
        <PlaceholderBox
          width={CONTAINER_HEIGHT + Math.round(Math.random() * CONTAINER_HEIGHT)}
          height={20}
        />
      </Flex>
    )
  }
  return (
    <Flex mx={2}>
      <Spacer height={70} />

      <Flex flexDirection="row">
        {/* Image */}
        <PlaceholderBox width={CONTAINER_HEIGHT} height={CONTAINER_HEIGHT} />
        <Flex ml={2} mt={1}>
          {/* Artist name */}
          <PlaceholderBox width={100} height={20} />
          <Spacer mb={1} />
          {/* Artwork name */}
          <PlaceholderBox width={150} height={25} />
        </Flex>
      </Flex>
      <Spacer mb={4} />
      {/* "Realized price" */}
      <PlaceholderBox width={100} height={15} />
      <Spacer mb={1} />
      {/* Price */}
      <PlaceholderBox width={120} height={40} />
      <Spacer mb={1} />
      {/* Ratio */}
      <PlaceholderBox width={200} height={20} />
      <Spacer mb={4} />
      {/* "details" */}
      <PlaceholderBox width={60} height={30} />
      <Spacer mb={2} />
      {details}
    </Flex>
  )
}

export const tracks = {
  screen: (id: string) =>
    screen({
      context_screen_owner_type: OwnerType.auctionResult,
      context_screen_owner_id: id,
    }),

  tapMarketStatsInfo: (): TappedInfoBubble => ({
    action: ActionType.tappedInfoBubble,
    context_module: ContextModule.auctionResult,
    context_screen_owner_type: OwnerType.artistAuctionResults,
    subject: "auctionResultSalePrice",
  }),
}
