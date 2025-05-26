import { Flex, Spacer, Tabs, useColor, useSpace } from "@artsy/palette-mobile"
import { MyCollectionInsightsQuery } from "__generated__/MyCollectionInsightsQuery.graphql"
import { LoadFailureView } from "app/Components/LoadFailureView"
import { TabsFlatList } from "app/Components/TabsFlatlist"
import { Tab } from "app/Scenes/MyCollection/MyCollection"
import { MyCollectionArtworkUploadMessages } from "app/Scenes/MyCollection/Screens/ArtworkForm/MyCollectionArtworkUploadMessages"
import { getRelayEnvironment } from "app/system/relay/defaultEnvironment"
import { extractNodes } from "app/utils/extractNodes"
import { setVisualClueAsSeen, useVisualClue } from "app/utils/hooks/useVisualClue"
import { withSuspense } from "app/utils/hooks/withSuspense"
import {
  PlaceholderBox,
  PlaceholderRaggedText,
  PlaceholderText,
  RandomNumberGenerator,
} from "app/utils/placeholders"
import {
  MY_COLLECTION_INSIGHTS_REFRESH_KEY,
  MY_COLLECTION_REFRESH_KEY,
  RefreshEvents,
} from "app/utils/refreshHelpers"
import { useEffect, useState } from "react"
import { RefreshControl } from "react-native"
import { fetchQuery, graphql, useLazyLoadQuery } from "react-relay"
import { ActivateMoreMarketInsightsBanner } from "./ActivateMoreMarketInsightsBanner"
import { AuctionResultsForArtistsYouCollectRail } from "./AuctionResultsForArtistsYouCollectRail"
import { CareerHighlightsRail } from "./CareerHighlightsRail"
import { MedianAuctionPriceRail } from "./MedianAuctionPriceRail"
import { MyCollectionInsightsEmptyState } from "./MyCollectionInsightsEmptyState"
import { MyCollectionInsightsOverview } from "./MyCollectionInsightsOverview"
import { MyCollectionInsightsIncompleteMessage } from "./MyCollectionMessages"

export const MyCollectionInsights: React.FC<{}> = ({}) => {
  const { showVisualClue } = useVisualClue()

  const [areInsightsIncomplete, setAreInsightsIncomplete] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const data = useLazyLoadQuery<MyCollectionInsightsQuery>(
    MyCollectionInsightsScreenQuery,
    {},
    { fetchPolicy: "store-and-network" }
  )

  const myCollectionArtworksCount = extractNodes(data.me?.myCollectionConnection).length

  const showMyCollectionInsightsIncompleteMessage =
    showVisualClue("MyCollectionInsightsIncompleteMessage") && areInsightsIncomplete

  const hasMarketSignals = !!data.me?.auctionResults?.totalCount

  useEffect(() => {
    RefreshEvents.addListener(MY_COLLECTION_REFRESH_KEY, handleRefreshEvent)
    RefreshEvents.addListener(MY_COLLECTION_INSIGHTS_REFRESH_KEY, handleRefreshEvent)
    return () => {
      RefreshEvents.removeListener(MY_COLLECTION_REFRESH_KEY, handleRefreshEvent)
      RefreshEvents.removeListener(MY_COLLECTION_INSIGHTS_REFRESH_KEY, handleRefreshEvent)
    }
  }, [])

  const handleRefreshEvent = (...args: any[]) => {
    refresh()

    setAreInsightsIncomplete(!!args[0]?.collectionHasArtworksWithoutInsights)
  }

  const refresh = () => {
    if (isRefreshing) {
      return
    }

    setIsRefreshing(true)

    fetchQuery(getRelayEnvironment(), MyCollectionInsightsScreenQuery, {}).subscribe({
      complete: () => {
        setIsRefreshing(false)
      },
      error: () => {
        setIsRefreshing(false)
      },
    })
  }

  if (myCollectionArtworksCount === 0) {
    return <MyCollectionInsightsEmptyState />
  }

  return (
    <TabsFlatList
      contentContainerStyle={{
        paddingHorizontal: 0,
      }}
      refreshControl={<RefreshControl onRefresh={refresh} refreshing={isRefreshing} />}
    >
      <Tabs.SubTabBar>
        <Flex px={2}>
          {!!showMyCollectionInsightsIncompleteMessage && (
            <MyCollectionInsightsIncompleteMessage
              onClose={() => setVisualClueAsSeen("MyCollectionInsightsIncompleteMessage")}
            />
          )}
          <MyCollectionArtworkUploadMessages
            sourceTab={Tab.insights}
            hasMarketSignals={hasMarketSignals}
          />
        </Flex>
      </Tabs.SubTabBar>
      {!!data.me?.myCollectionInfo && (
        <MyCollectionInsightsOverview myCollectionInfo={data.me?.myCollectionInfo} />
      )}

      {!!hasMarketSignals /* || average sale price data */ && (
        <>
          <CareerHighlightsRail me={data.me} />
          <AuctionResultsForArtistsYouCollectRail me={data.me} />
          <MedianAuctionPriceRail me={data.me} />
          {/* TODO: The banner should be visible always as long as the user has at least an artwork with insights */}
          <ActivateMoreMarketInsightsBanner />
        </>
      )}
    </TabsFlatList>
  )
}

export const MyCollectionInsightsQR: React.FC<{}> = withSuspense({
  Component: MyCollectionInsights,
  LoadingFallback: () => <MyCollectionInsightsPlaceholder />,
  ErrorFallback: (fallbackProps) => {
    return (
      <LoadFailureView
        onRetry={fallbackProps.resetErrorBoundary}
        showBackButton={false}
        useSafeArea={false}
        error={fallbackProps.error}
        trackErrorBoundary={false}
      />
    )
  },
})

const MyCollectionInsightsPlaceholder = () => {
  const space = useSpace()
  const color = useColor()
  const rng = new RandomNumberGenerator(Math.random())

  return (
    <Tabs.ScrollView scrollEnabled={false} contentContainerStyle={{ paddingHorizontal: 0 }}>
      {/* MyCollectionInsightsOverview */}
      <Flex p={2} pb={4} flexDirection="row">
        <Flex flex={1} alignSelf="flex-start">
          <PlaceholderText width={100} marginBottom={space(1)} />
          <PlaceholderText width={20} height={24} />
        </Flex>

        <Flex flex={1} alignSelf="flex-start">
          <PlaceholderText width={85} marginBottom={space(1)} />
          <PlaceholderText width={20} height={24} />
        </Flex>
      </Flex>
      {/* MyCollectionInsightsOverview */}

      {/* CareerHighlightsRail */}
      <Flex py={1} pl={1} mb={4} backgroundColor={color("mono5")} flexDirection="row">
        {/* CareerHighlighCard */}
        {[...Array(3)].map((_, i) => (
          <Flex
            key={`career-highlight-placeholder-${i}`}
            p={1}
            ml={1}
            height={135}
            width={205}
            backgroundColor="background"
            border={1}
            borderColor="mono10"
          >
            <Flex flexDirection="row" alignItems="center" justifyContent="flex-end">
              <Flex
                width={26}
                height={26}
                alignSelf="flex-end"
                alignItems="center"
                justifyContent="center"
                border={1}
                borderColor="mono10"
                borderRadius={24}
              >
                <PlaceholderBox width={15} height={15} />
              </Flex>
            </Flex>
            <Flex justifyContent="flex-end" flex={1}>
              <PlaceholderText width={20} height={24} />
              <>
                <PlaceholderText width={180} />
                <PlaceholderText width={70} />
              </>
            </Flex>
          </Flex>
        ))}
      </Flex>
      {/* CareerHighlightsRail */}

      {/* AuctionResultsForArtistsYouCollectRail */}
      <Flex mb={4} px={2}>
        <PlaceholderText width={170} height={20} />

        {[...Array(3)].map((_, i) => (
          <Flex key={`auction-results-placeholder-${i}`} mt={i ? 2 : 0} flexDirection="row">
            {/* Sale Artwork Thumbnail Image */}
            <PlaceholderBox width={100} height={130} />

            {/* Sale Artwork Details */}
            <Flex pl="15px" flex={1} flexDirection="row" justifyContent="space-between">
              <Flex flex={4}>
                <Flex>
                  <PlaceholderText width={100} />
                  <PlaceholderRaggedText seed={rng.next()} numLines={1} />
                  <PlaceholderRaggedText seed={200 + rng.next()} numLines={1} />
                  <PlaceholderRaggedText seed={180 + rng.next()} numLines={1} />
                  <Spacer y={1} />
                  <PlaceholderText width={150} />
                  <PlaceholderText width={80} />
                </Flex>
              </Flex>
            </Flex>
          </Flex>
        ))}
      </Flex>
      {/* AuctionResultsForArtistsYouCollectRail */}
    </Tabs.ScrollView>
  )
}

export const MyCollectionInsightsScreenQuery = graphql`
  query MyCollectionInsightsQuery {
    me {
      ...AuctionResultsForArtistsYouCollectRail_me
      ...MedianAuctionPriceRail_me
      ...CareerHighlightsRail_me
      auctionResults: myCollectionAuctionResults(first: 3) {
        totalCount
      }
      myCollectionInfo {
        artworksCount
        ...MyCollectionInsightsOverview_myCollectionInfo
      }
      myCollectionConnection(first: 1) {
        edges {
          node {
            id
          }
        }
      }
    }
  }
`
