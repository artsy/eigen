import { ActionType, ContextModule, OwnerType, TappedInfoBubble } from "@artsy/cohesion"
import {
  Box,
  Flex,
  Join,
  NoArtworkIcon,
  Separator,
  Spacer,
  Text,
  useColor,
  useSpace,
  useTheme,
} from "@artsy/palette-mobile"
import { NavigationProp, useNavigation } from "@react-navigation/native"
import { addBreadcrumb } from "@sentry/react-native"
import { AuctionResultQuery } from "__generated__/AuctionResultQuery.graphql"
import { AuctionResult_artist$key } from "__generated__/AuctionResult_artist.graphql"
import {
  AuctionResult_auctionResult$data,
  AuctionResult_auctionResult$key,
} from "__generated__/AuctionResult_auctionResult.graphql"
import { ratioColor } from "app/Components/AuctionResult/AuctionResultMidEstimate"
import { InfoButton } from "app/Components/Buttons/InfoButton"
import { AuthenticatedRoutesParams } from "app/Navigation/AuthenticatedRoutes/Tabs"
import { navigate } from "app/system/navigation/navigate"
import { QAInfoPanel } from "app/utils/QAInfo"
import { useScreenDimensions } from "app/utils/hooks"
import { PlaceholderBox } from "app/utils/placeholders"
import { getImageSquareDimensions } from "app/utils/resizeImage"
import { ProvideScreenTrackingWithCohesionSchema } from "app/utils/track"
import { screen } from "app/utils/track/helpers"
import { capitalize } from "lodash"
import moment from "moment"
import React, { Suspense, useEffect, useLayoutEffect, useState } from "react"
import { Image, ScrollView, TextInput, TouchableWithoutFeedback } from "react-native"
import FastImage from "react-native-fast-image"
import { graphql, useFragment, useLazyLoadQuery } from "react-relay"
import { useTracking } from "react-tracking"
import { ComparableWorksFragmentContainer } from "./ComparableWorks"
import { AuctionResultHelperData, auctionResultText } from "./helpers"

const CONTAINER_HEIGHT = 400

interface Props {
  artist: AuctionResult_artist$key
  auctionResult: AuctionResult_auctionResult$key
}

export const AuctionResult: React.FC<Props> = (props) => {
  const artist = useFragment(artistFragment, props.artist)
  const auctionResult = useFragment(auctionResultFragment, props.auctionResult)

  const navigation = useNavigation<NavigationProp<AuthenticatedRoutesParams, "AuctionResult">>()

  const color = useColor()
  const { theme } = useTheme()

  const tracking = useTracking()

  const headerTitle = auctionResult.dateText
    ? `${auctionResult.title}, ${auctionResult.dateText}`
    : auctionResult.title

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle,
    })
  }, [navigation])

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
          <Text color="mono60" variant="xs" mb={1}>
            {label}
          </Text>
          <TextInput
            editable={false}
            value={value}
            multiline
            scrollEnabled={false}
            style={{
              color: color("mono100"),
              fontFamily: theme.fonts.sans.regular,
              fontSize: 13, // stands for xs
              lineHeight: 21,
            }}
          />
        </Flex>
      ) : (
        <Flex flexDirection="row" justifyContent="space-between">
          <Text style={{ width: "35%" }} variant="xs" color="mono60">
            {label}
          </Text>
          <Flex width="65%" pl="15px">
            <Text pl={2} textAlign="right" variant="xs" testID={options?.testID} selectable>
              {value}
            </Text>
          </Flex>
        </Flex>
      )}
    </Flex>
  )
  if (auctionResult.estimate?.display && !auctionResult.isUpcoming) {
    details.push(makeRow("Pre-sale estimate", auctionResult.estimate?.display))
  }
  if (auctionResult.mediumText) {
    details.push(makeRow("Materials", capitalize(auctionResult.mediumText)))
  }
  if (auctionResult.dimensionText) {
    details.push(makeRow("Dimensions", auctionResult.dimensionText))
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
  if (auctionResult.location) {
    details.push(makeRow("Sale location", auctionResult.location))
  }
  if (auctionResult.saleTitle) {
    details.push(makeRow("Sale name", auctionResult.saleTitle))
  }
  if (auctionResult.lotNumber) {
    details.push(makeRow("Lot number", auctionResult.lotNumber))
  }

  const salePriceMessage = auctionResultText(auctionResult as AuctionResultHelperData)
  const showPriceUSD = auctionResult.priceRealized?.displayUSD && auctionResult.currency !== "USD"

  const SalePriceInfoModal: React.FC = () => (
    <>
      <Text>
        The sale price includes the hammer price and buyer’s premium, as well as any other
        additional fees (e.g., Artist’s Resale Rights).
      </Text>
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

  const SalePrice = () => {
    if (!auctionResult.isUpcoming) {
      return (
        <>
          <Flex flexDirection="row" mb={1}>
            <InfoButton
              titleElement={
                <Text variant="sm-display" mr={0.5}>
                  Sale Price
                </Text>
              }
              trackEvent={() => {
                tracking.trackEvent(tracks.tapMarketStatsInfo())
              }}
              modalTitle="Sale Price"
              modalContent={<SalePriceInfoModal />}
            />
          </Flex>
          {auctionResult.priceRealized?.display ? (
            <Flex mb={0.5}>
              <Text variant="md">
                {auctionResult.priceRealized.display}
                {!!auctionResult?.performance?.mid && (
                  <Text color={ratioColor(auctionResult.performance.mid)}>
                    {"    "}
                    {auctionResult.performance.mid[0] === "-" ? "-" : "+"}
                    {new Intl.NumberFormat().format(
                      Number(auctionResult.performance.mid.replace(/%|-/gm, ""))
                    )}
                    % est
                  </Text>
                )}
              </Text>

              {!!showPriceUSD && (
                <Text variant="xs" color="mono60" testID="priceUSD">
                  {auctionResult.priceRealized?.displayUSD}
                </Text>
              )}
            </Flex>
          ) : (
            <Text variant="lg-display">{salePriceMessage}</Text>
          )}
        </>
      )
    }
    return (
      <Flex mb={1}>
        <InfoButton
          titleElement={
            <Text variant="sm-display" mr={0.5}>
              Pre-sale Estimate
            </Text>
          }
          trackEvent={() => {
            tracking.trackEvent(tracks.tapMarketStatsInfo())
          }}
          modalTitle="Pre-sale Estimate"
          modalContent={<SalePriceInfoModal />}
        />

        {!!auctionResult.estimate?.display ? (
          <Text variant="md">{auctionResult.estimate.display}</Text>
        ) : (
          <Text variant="md" italic>
            Estimate not available
          </Text>
        )}
      </Flex>
    )
  }

  return (
    <ProvideScreenTrackingWithCohesionSchema info={tracks.screen(auctionResult.internalID)}>
      <ScrollView>
        <Join separator={<Spacer y={2} />}>
          {!!auctionResult?.images?.larger && (
            <AuctionResultImage image={auctionResult.images.larger} />
          )}

          <Flex px={2} mt={2}>
            <TouchableWithoutFeedback
              onPress={() => artist?.href && navigate(artist.href)}
              hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}
            >
              <Text variant="sm-display">{artist?.name}</Text>
            </TouchableWithoutFeedback>

            <Text variant="sm-display">{auctionResult.title}</Text>
            <Text variant="xs" color="mono60" my={0.5}>
              {[
                moment(auctionResult.saleDate).utc().format("MMM D, YYYY"),
                auctionResult.organization,
              ].join(" • ")}
            </Text>
          </Flex>

          <Flex px={2} mb={2}>
            <SalePrice />
          </Flex>
        </Join>
        <Box px={2} pb={4}>
          {details}
          <ComparableWorksFragmentContainer auctionResult={auctionResult} />
        </Box>
        <QAInfo />
      </ScrollView>
    </ProvideScreenTrackingWithCohesionSchema>
  )
}

const AuctionResultImage = ({
  image,
}: {
  image: NonNullable<NonNullable<AuctionResult_auctionResult$data["images"]>["larger"]>
}) => {
  const [imageHeight, setImageHeight] = useState<number>(0)
  const [imageWidth, setImageWidth] = useState<number>(0)
  const [isLoading, setIsLoading] = useState(true)
  const [couldNotLoadImage, setCouldNotLoadImage] = useState(false)

  const { width } = useScreenDimensions()
  const space = useSpace()

  const containerLength = Math.min(400, width - 2 * space(2))

  useEffect(() => {
    if (image.url) {
      Image.getSize(
        image.url,
        (width, height) => {
          const imageDimensions = getImageSquareDimensions(height, width, CONTAINER_HEIGHT)
          setImageHeight(imageDimensions.height)
          setImageWidth(imageDimensions.width)
          setIsLoading(false)
        },
        () => {
          setIsLoading(false)
        }
      )
    } else {
      setIsLoading(false)
    }
  }, [])

  if (!!image.url && !!imageHeight && !!imageWidth && !couldNotLoadImage) {
    return (
      <Flex width="100%" height={CONTAINER_HEIGHT} justifyContent="center" alignItems="center">
        <FastImage
          style={{ height: imageHeight, width: imageWidth, overflow: "hidden" }}
          source={{ uri: image.url }}
          onError={() => {
            addBreadcrumb({
              message: `Failed to load auction result image`,
              level: "info",
            })
            setCouldNotLoadImage(true)
          }}
        />
      </Flex>
    )
  }

  return (
    <Box
      style={{ height: containerLength, width: "100%" }}
      backgroundColor="mono10"
      alignItems="center"
      justifyContent="center"
    >
      {!isLoading && <NoArtworkIcon width={30} height={30} fill="mono60" />}
    </Box>
  )
}

const auctionResultFragment = graphql`
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
    isUpcoming
    images {
      larger {
        url
        height
        width
        aspectRatio
      }
    }
    location
    lotNumber
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
`

const artistFragment = graphql`
  fragment AuctionResult_artist on Artist {
    name
    href
  }
`

export const AuctionResultScreenQuery = graphql`
  query AuctionResultQuery($auctionResultInternalID: String!, $artistID: String!) {
    auctionResult(id: $auctionResultInternalID) {
      ...AuctionResult_auctionResult
    }
    artist(id: $artistID) {
      ...AuctionResult_artist
    }
  }
`

interface AuctionResultQueryRendererProps {
  auctionResultInternalID: string
  artistID: string
}

export const AuctionResultScreenContainer: React.FC<AuctionResultQueryRendererProps> = ({
  auctionResultInternalID,
  artistID,
}) => {
  const data = useLazyLoadQuery<AuctionResultQuery>(AuctionResultScreenQuery, {
    auctionResultInternalID,
    artistID,
  })

  if (!data?.auctionResult || !data?.artist) {
    return (
      <Flex>
        <Text>Wrong link</Text>
      </Flex>
    )
  }

  return <AuctionResult artist={data.artist} auctionResult={data.auctionResult} />
}

export const AuctionResultQueryRenderer: React.FC<AuctionResultQueryRendererProps> = (props) => {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <AuctionResultScreenContainer {...props} />
    </Suspense>
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
    <Flex>
      <Spacer y="60px" />

      {/* Image */}
      <PlaceholderBox width="100%" height={CONTAINER_HEIGHT} />

      <Flex px={2}>
        <Spacer y={4} />
        {/* "Realized price" */}
        <PlaceholderBox width={100} height={15} />
        <Spacer y={1} />
        {/* Price */}
        <PlaceholderBox width={120} height={40} />
        <Spacer y={1} />
        {/* Ratio */}
        <PlaceholderBox width={200} height={20} />
        <Spacer y={4} />
        {/* "details" */}
        <PlaceholderBox width={60} height={30} />
        <Spacer y={2} />
      </Flex>
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
