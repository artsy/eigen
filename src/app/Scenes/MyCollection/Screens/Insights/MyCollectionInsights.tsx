import { MyCollectionInsightsQuery } from "__generated__/MyCollectionInsightsQuery.graphql"
import { StickyTabPageFlatListContext } from "app/Components/StickyTabPage/StickyTabPageFlatList"
import { StickyTabPageScrollView } from "app/Components/StickyTabPage/StickyTabPageScrollView"
import { defaultEnvironment } from "app/relay/createEnvironment"
import { Tab } from "app/Scenes/MyProfile/MyProfileHeaderMyCollectionAndSavedWorks"
import { setVisualClueAsSeen, useFeatureFlag, useVisualClue } from "app/store/GlobalStore"
import { extractNodes } from "app/utils/extractNodes"
import {
  MY_COLLECTION_INSIGHTS_REFRESH_KEY,
  MY_COLLECTION_REFRESH_KEY,
  RefreshEvents,
} from "app/utils/refreshHelpers"
import { Flex, Spinner, useSpace } from "palette"
import React, { Suspense, useContext, useEffect, useState } from "react"
import { RefreshControl } from "react-native"
import { useLazyLoadQuery } from "react-relay"
import { fetchQuery, graphql } from "relay-runtime"
import { MyCollectionArtworkUploadMessages } from "../ArtworkForm/MyCollectionArtworkUploadMessages"
import { ActivateMoreMarketInsightsBanner } from "./ActivateMoreMarketInsightsBanner"
import { AuctionResultsForArtistsYouCollectRail } from "./AuctionResultsForArtistsYouCollectRail"
import { AverageAuctionPriceRail } from "./AverageAuctionPriceRail"
import { MarketSignalsSectionHeader } from "./MarketSignalsSectionHeader"
import { MyCollectionInsightsEmptyState } from "./MyCollectionInsightsEmptyState"
import { MyCollectionInsightsOverview } from "./MyCollectionInsightsOverview"
import { MyCollectionInsightsIncompleteMessage } from "./MyCollectionMessages"

export const MyCollectionInsights: React.FC<{}> = ({}) => {
  const { showVisualClue } = useVisualClue()
  const space = useSpace()
  const enablePhase1Part1 = useFeatureFlag("AREnableMyCollectionInsightsPhase1Part1")
  const enablePhase1Part2 = useFeatureFlag("AREnableMyCollectionInsightsPhase1Part2")

  const [areInsightsIncomplete, setAreInsightsIncomplete] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const data = useLazyLoadQuery<MyCollectionInsightsQuery>(MyCollectionInsightsScreenQuery, {}, {})

  const myCollectionArtworksCount = extractNodes(data.me?.myCollectionConnection).length

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

    fetchQuery(defaultEnvironment, MyCollectionInsightsScreenQuery, {}).subscribe({
      complete: () => {
        setIsRefreshing(false)
      },
      error: () => {
        setIsRefreshing(false)
      },
    })
  }

  const setJSX = useContext(StickyTabPageFlatListContext).setJSX

  const showMessages = async () => {
    const showMyCollectionInsightsIncompleteMessage =
      showVisualClue("MyCollectionInsightsIncompleteMessage") && areInsightsIncomplete

    setJSX(
      <>
        {!!showMyCollectionInsightsIncompleteMessage && (
          <MyCollectionInsightsIncompleteMessage
            onClose={() => setVisualClueAsSeen("MyCollectionInsightsIncompleteMessage")}
          />
        )}
        <MyCollectionArtworkUploadMessages
          sourceTab={Tab.insights}
          hasMarketSignals={hasMarketSignals}
        />
      </>
    )
  }

  useEffect(() => {
    showMessages()
  }, [data.me?.myCollectionInfo?.artworksCount, areInsightsIncomplete])

  const renderContent = () => {
    return (
      <>
        <MyCollectionInsightsOverview myCollectionInfo={data.me?.myCollectionInfo!} />
        {hasMarketSignals /* || average sale price data */ && enablePhase1Part1 && (
          <>
            <MarketSignalsSectionHeader />
            <AuctionResultsForArtistsYouCollectRail me={data.me!} />
            {!!enablePhase1Part2 && <AverageAuctionPriceRail me={data.me} />}
            {/* TODO: The banner should be visible always as long as the user has at least an artwork with insights */}
            <ActivateMoreMarketInsightsBanner />
          </>
        )}
      </>
    )
  }

  return (
    <StickyTabPageScrollView
      style={{
        flex: 1,
      }}
      refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={refresh} />}
      contentContainerStyle={{
        paddingTop: space("2"),
        // Extend the container flex when there are no artworks for accurate vertical centering
        flexGrow: myCollectionArtworksCount > 0 ? undefined : 1,
        justifyContent: myCollectionArtworksCount > 0 ? "flex-start" : "center",
      }}
      paddingHorizontal={0}
    >
      {myCollectionArtworksCount > 0 ? renderContent() : <MyCollectionInsightsEmptyState />}
    </StickyTabPageScrollView>
  )
}

export const MyCollectionInsightsQR: React.FC<{}> = () => (
  <Suspense fallback={<MyCollectionInsightsPlaceHolder />}>
    <MyCollectionInsights />
  </Suspense>
)

export const MyCollectionInsightsPlaceHolder = () => (
  <StickyTabPageScrollView
    style={{ flex: 1 }}
    contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
    scrollEnabled={false}
  >
    <Flex alignItems="center">
      <Spinner />
    </Flex>
  </StickyTabPageScrollView>
)

export const MyCollectionInsightsScreenQuery = graphql`
  query MyCollectionInsightsQuery {
    me {
      ...AuctionResultsForArtistsYouCollectRail_me
      ...AverageAuctionPriceRail_me
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
