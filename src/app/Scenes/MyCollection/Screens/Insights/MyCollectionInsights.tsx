import { Flex, Spinner } from "@artsy/palette-mobile"
import { MyCollectionInsightsQuery } from "__generated__/MyCollectionInsightsQuery.graphql"
import { StickTabPageRefreshControl } from "app/Components/StickyTabPage/StickTabPageRefreshControl"
import { StickyTabPageFlatListContext } from "app/Components/StickyTabPage/StickyTabPageFlatList"
import { StickyTabPageScrollView } from "app/Components/StickyTabPage/StickyTabPageScrollView"
import { MyCollectionArtworkUploadMessages } from "app/Scenes/MyCollection/Screens/ArtworkForm/MyCollectionArtworkUploadMessages"
import { Tab } from "app/Scenes/MyProfile/MyProfileHeaderMyCollectionAndSavedWorks"
import { defaultEnvironment } from "app/system/relay/createEnvironment"
import { extractNodes } from "app/utils/extractNodes"
import { setVisualClueAsSeen, useVisualClue } from "app/utils/hooks/useVisualClue"
import {
  MY_COLLECTION_INSIGHTS_REFRESH_KEY,
  MY_COLLECTION_REFRESH_KEY,
  RefreshEvents,
} from "app/utils/refreshHelpers"
import { Suspense, useContext, useEffect, useState } from "react"
import { useLazyLoadQuery } from "react-relay"
import { fetchQuery, graphql } from "relay-runtime"
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

        {hasMarketSignals /* || average sale price data */ && (
          <>
            <CareerHighlightsRail me={data.me!} />
            <AuctionResultsForArtistsYouCollectRail me={data.me!} />
            <MedianAuctionPriceRail me={data.me} />
            {/* TODO: The banner should be visible always as long as the user has at least an artwork with insights */}
            <ActivateMoreMarketInsightsBanner />
          </>
        )}
      </>
    )
  }

  return (
    <StickyTabPageScrollView
      refreshControl={<StickTabPageRefreshControl onRefresh={refresh} refreshing={isRefreshing} />}
      contentContainerStyle={{
        // Extend the container flex when there are no artworks for accurate vertical centering
        flexGrow: myCollectionArtworksCount > 0 ? undefined : 1,
        justifyContent: myCollectionArtworksCount > 0 ? "flex-start" : "center",
        height: myCollectionArtworksCount > 0 ? "auto" : "100%",
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
