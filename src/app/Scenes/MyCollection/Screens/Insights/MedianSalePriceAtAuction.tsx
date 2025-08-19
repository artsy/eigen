import { OwnerType } from "@artsy/cohesion"
import { NoArtIcon } from "@artsy/icons/native"
import { Spacer, Flex, Text, Touchable, Image, Screen } from "@artsy/palette-mobile"
import { MedianSalePriceAtAuctionQuery } from "__generated__/MedianSalePriceAtAuctionQuery.graphql"
import { goBack } from "app/system/navigation/navigate"
import { useScreenDimensions } from "app/utils/hooks"
import {
  PlaceholderBox,
  PlaceholderText,
  ProvidePlaceholderContext,
  RandomNumberGenerator,
} from "app/utils/placeholders"
import { ProvideScreenTrackingWithCohesionSchema } from "app/utils/track"
import { screen } from "app/utils/track/helpers"
import { Suspense, useCallback, useEffect, useRef, useState } from "react"
import { ScrollView } from "react-native"
import { graphql, useLazyLoadQuery } from "react-relay"
import { CareerHighlightBottomSheet } from "./CareerHighlightBottomSheet"
import { MedianSalePriceChartTracking } from "./Components/MedianSalePriceChartTracking"
import { MedianSalePriceChart } from "./MedianSalePriceChart"
import { SelectArtistModal } from "./SelectArtistModal"
import { MedianSalePriceChartDataContextProvider } from "./providers/MedianSalePriceChartDataContext"

const PAGE_SIZE = 50

interface MedianSalePriceAtAuctionProps {
  refetch: (newArtistID: string) => void
  queryArgs: Record<string, any>
  initialCategory: string
}

const MedianSalePriceAtAuctionScreen: React.FC<MedianSalePriceAtAuctionProps> = ({
  refetch,
  queryArgs,
  initialCategory,
}) => {
  const [isVisible, setVisible] = useState<boolean>(false)
  const [newArtistID, setNewArtistID] = useState<string | null>(null)

  const isFirstMount = useRef(true)

  useEffect(() => {
    if (!isFirstMount.current && newArtistID) {
      refetch(newArtistID)
      return
    }
    if (isFirstMount.current) {
      isFirstMount.current = false
    }
  }, [newArtistID])

  const data = useLazyLoadQuery<MedianSalePriceAtAuctionQuery>(
    MedianSalePriceAtAuctionScreenQuery,
    queryArgs.variables,
    { ...queryArgs.options, fetchPolicy: "store-and-network" }
  )

  const enableChangeArtist =
    !!data.me?.myCollectionInfo?.artistsCount && data.me.myCollectionInfo.artistsCount > 1

  return (
    <Screen>
      <Screen.Header onBack={goBack} />
      <Screen.Body fullwidth>
        <Screen.ScrollView showsVerticalScrollIndicator={false}>
          <Flex mx={2}>
            <Text variant="lg-display" mb={0.5} testID="Median_Auction_Price_title">
              Median Auction Price
            </Text>
            <Text variant="xs">Track price stability or growth for your artists.</Text>

            {/* Artists Info */}
            <Flex py={2} flexDirection="row" justifyContent="space-between" alignItems="center">
              <Flex
                width={40}
                height={40}
                borderRadius={20}
                backgroundColor="mono10"
                alignItems="center"
                justifyContent="center"
                overflow="hidden"
                // To align the image with the text we have to add top margin to compensate the line height.
                style={{ marginTop: 3 }}
              >
                {data.artist?.imageUrl ? (
                  <Image width={40} height={40} src={data.artist.imageUrl} />
                ) : (
                  <NoArtIcon width={28} height={28} opacity={0.3} />
                )}
              </Flex>
              {/* Sale Artwork Artist Name */}
              <Flex flex={1} pl={1}>
                {!!data.artist?.name && (
                  <Text variant="sm-display" ellipsizeMode="middle" numberOfLines={2}>
                    {data.artist.name}
                  </Text>
                )}
              </Flex>

              {!!enableChangeArtist && (
                <Touchable
                  accessibilityRole="button"
                  testID="change-artist-touchable"
                  onPress={() => setVisible(true)}
                  haptic
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Text style={{ textDecorationLine: "underline" }} variant="xs" color="mono60">
                    Change Artist
                  </Text>
                </Touchable>
              )}
            </Flex>
          </Flex>

          <MedianSalePriceChartDataContextProvider
            artistId={queryArgs.variables.artistId}
            initialCategory={initialCategory}
            queryData={data}
          >
            <MedianSalePriceChartTracking artistID={queryArgs.variables.artistID} />
            <MedianSalePriceChart />
            <CareerHighlightBottomSheet artistSparklines={data} />
          </MedianSalePriceChartDataContextProvider>

          <SelectArtistModal
            queryData={data}
            visible={isVisible}
            closeModal={() => setVisible(false)}
            onItemPress={(artistId) => {
              setVisible(false)
              setNewArtistID(artistId)
            }}
          />
        </Screen.ScrollView>
      </Screen.Body>
    </Screen>
  )
}

export const MedianSalePriceAtAuction: React.FC<{ artistID: string; initialCategory: string }> = ({
  artistID,
  initialCategory,
}) => {
  const end = new Date().getFullYear()
  const startYear = (end - 8).toString()
  const endYear = end.toString()

  const [queryArgs, setQueryArgs] = useState({
    options: { fetchKey: 0 },
    variables: {
      ...artistsQueryVariables,
      artistID,
      artistId: artistID,
      endYear,
      startYear,
    },
  })

  const refetch = useCallback(
    (newArtistID) => {
      if (newArtistID !== queryArgs.variables.artistID) {
        setQueryArgs((prev) => ({
          options: { fetchKey: (prev?.options.fetchKey ?? 0) + 1 },
          variables: { ...queryArgs.variables, artistID: newArtistID, artistId: newArtistID },
        }))
      }
    },
    [queryArgs.variables.artistID]
  )

  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <ProvideScreenTrackingWithCohesionSchema
        info={screen({
          context_screen_owner_type: OwnerType.myCollectionInsightsMedianAuctionPrice,
        })}
      >
        <MedianSalePriceAtAuctionScreen
          refetch={refetch}
          queryArgs={queryArgs}
          initialCategory={initialCategory}
        />
      </ProvideScreenTrackingWithCohesionSchema>
    </Suspense>
  )
}

export const MedianSalePriceAtAuctionScreenQuery = graphql`
  query MedianSalePriceAtAuctionQuery(
    $artistID: String!
    $artistId: ID!
    $count: Int
    $after: String
    $endYear: String
    $startYear: String
  ) {
    ...SelectArtistModal_myCollectionInfo @arguments(count: $count, after: $after)
    ...MedianSalePriceChartDataContextProvider_query
      @arguments(artistId: $artistId, artistID: $artistID, endYear: $endYear, startYear: $startYear)
    ...CareerHighlightBottomSheet_query @arguments(artistID: $artistID)
    artist(id: $artistID) {
      internalID
      name
      imageUrl
    }
    me {
      myCollectionInfo {
        artistsCount
      }
    }
  }
`

export const artistsQueryVariables = {
  count: PAGE_SIZE,
}

const LoadingSkeleton = () => {
  const { height: screenHeight } = useScreenDimensions()
  const rng = new RandomNumberGenerator(100)
  return (
    <ProvidePlaceholderContext>
      <Screen>
        <Screen.Header onBack={goBack} />
        <Screen.Body fullwidth>
          <Flex mx={2}>
            <Text variant="lg-display" mb={0.5}>
              Median Auction Price
            </Text>
            <Text variant="xs">Track price stability or growth for your artists.</Text>

            <Flex py={2} flexDirection="row" justifyContent="space-between" alignItems="center">
              <Flex flexDirection="row" alignItems="center">
                <Flex
                  width={40}
                  height={40}
                  borderRadius={20}
                  backgroundColor="mono10"
                  alignItems="center"
                  justifyContent="center"
                  overflow="hidden"
                  style={{ marginTop: 3 }}
                />
                <Spacer x={1} />
                <PlaceholderText width={150} height={10} marginTop={6} />
              </Flex>

              <PlaceholderText width={70} height={10} marginTop={6} />
            </Flex>
            <Spacer y={0.5} />
            <PlaceholderText width={30} height={20} />
            <Flex flexDirection="row" alignItems="center">
              <PlaceholderBox width={10} height={10} borderRadius={5} marginRight={7} />
              <PlaceholderText width={60} height={7} marginTop={6} />
            </Flex>
            <PlaceholderText width={100} height={7} />
            <Spacer y={2} />
            <PlaceholderBox width="100%" height={screenHeight / 2.8} marginVertical={10} />
            <Flex flexDirection="row" my="25px" justifyContent="center">
              <PlaceholderBox height={15} width={25} marginHorizontal={10} />
              <PlaceholderBox height={15} width={25} marginHorizontal={10} />
            </Flex>

            <Flex>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((c) => {
                  const w = rng.next() * 100 + 100
                  return (
                    <PlaceholderBox
                      key={`${c}`}
                      width={w}
                      height={25}
                      borderRadius={10}
                      marginRight={10}
                    />
                  )
                })}
              </ScrollView>
            </Flex>
          </Flex>
        </Screen.Body>
      </Screen>
    </ProvidePlaceholderContext>
  )
}
