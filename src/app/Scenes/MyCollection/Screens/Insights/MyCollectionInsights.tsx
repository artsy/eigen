import { Flex, Spacer, Text, useColor } from "@artsy/palette-mobile"
import { useRoute } from "@react-navigation/native"
import { MyCollectionInsightsQuery } from "__generated__/MyCollectionInsightsQuery.graphql"
import { StickTabPageRefreshControl } from "app/Components/StickyTabPage/StickTabPageRefreshControl"
import { StickyTabPageFlatListContext } from "app/Components/StickyTabPage/StickyTabPageFlatList"
import { StickyTabPageScrollView } from "app/Components/StickyTabPage/StickyTabPageScrollView"
import { MyCollectionArtworkUploadMessages } from "app/Scenes/MyCollection/Screens/ArtworkForm/MyCollectionArtworkUploadMessages"
import { Tab } from "app/Scenes/MyProfile/MyProfileHeaderMyCollectionAndSavedWorks"
import { setVisualClueAsSeen, useVisualClue } from "app/store/GlobalStore"
import { defaultEnvironment } from "app/system/relay/createEnvironment"
import { extractNodes } from "app/utils/extractNodes"
import { PlaceholderBox, PlaceholderText } from "app/utils/placeholders"
import {
  MY_COLLECTION_INSIGHTS_REFRESH_KEY,
  MY_COLLECTION_REFRESH_KEY,
  RefreshEvents,
} from "app/utils/refreshHelpers"
import { times } from "lodash"
import { Suspense, useContext, useEffect, useState } from "react"
import { RefreshControl } from "react-native"
import { Tabs } from "react-native-collapsible-tab-view"
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

  const enableNewTabs = useMyCollectionNewTabs()

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

  const setJSX = useContext(StickyTabPageFlatListContext)?.setJSX

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
    if (!enableNewTabs) {
      showMessages()
    }
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

  const Wrapper = ({ children }: { children: React.ReactNode }) => {
    if (!enableNewTabs) {
      return (
        <StickyTabPageScrollView
          refreshControl={
            <StickTabPageRefreshControl onRefresh={refresh} refreshing={isRefreshing} />
          }
          contentContainerStyle={{
            // Extend the container flex when there are no artworks for accurate vertical centering
            flexGrow: myCollectionArtworksCount > 0 ? undefined : 1,
            justifyContent: myCollectionArtworksCount > 0 ? "flex-start" : "center",
            height: myCollectionArtworksCount > 0 ? "auto" : "100%",
          }}
          paddingHorizontal={0}
        >
          {children}
        </StickyTabPageScrollView>
      )
    }

    return (
      <Tabs.ScrollView
        refreshControl={<RefreshControl onRefresh={refresh} refreshing={isRefreshing} />}
      >
        {children}
      </Tabs.ScrollView>
    )
  }

  return (
    <Wrapper>
      {myCollectionArtworksCount > 0 ? renderContent() : <MyCollectionInsightsEmptyState />}
    </Wrapper>
  )
}

export const MyCollectionInsightsQR: React.FC<{}> = () => (
  <Suspense fallback={<MyCollectionInsightsPlaceHolder />}>
    <MyCollectionInsightsPlaceHolder />
    {/* <MyCollectionInsights /> */}
  </Suspense>
)

const useMyCollectionNewTabs = () => {
  const route = useRoute()

  if (route.name === "screen:profile2") {
    return true
  }
  return false
}

export const MyCollectionInsightsPlaceHolder = () => {
  const enableNewTabs = useMyCollectionNewTabs()
  const color = useColor()

  const Wrapper = ({ children }: { children: React.ReactNode }) => {
    if (!enableNewTabs) {
      return (
        <StickyTabPageScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
          scrollEnabled={false}
        >
          {children}
        </StickyTabPageScrollView>
      )
    }

    return <Tabs.ScrollView scrollEnabled={false}>{children}</Tabs.ScrollView>
  }

  return (
    <Wrapper>
      <Flex flex={1}>
        {/* icon, name, time joined */}
        <Flex p={2} pb={2} flexDirection="row">
          <Flex flex={1} alignSelf="flex-start">
            <Text variant="xs" mb={1}>
              Total Artworks
            </Text>
            <PlaceholderText width="30%" height={50} />
          </Flex>
          <Flex flex={1} alignSelf="flex-start">
            <Text variant="xs" mb={1}>
              Total Artists
            </Text>
            <PlaceholderText width="30%" height={50} />
          </Flex>
        </Flex>
        {/* Career Highlights */}
        <Flex mb={4} height={150} backgroundColor={color("black5")}></Flex>
        {/* Recently Sold At Auction */}
        <Flex px={2}>
          <PlaceholderText width="100%" height={20} />
          {times(3).map((i) => {
            return (
              <Flex height={120} flexDirection="row" key={i} mt={2}>
                <PlaceholderBox width={100} height="100%" />
                <Flex ml={2} justifyContent="space-around">
                  <PlaceholderBox width={100 + Math.random() * 50} height={18} />
                  <Spacer y={0.5} />
                  <PlaceholderBox width={150 + Math.random() * 50} height={18} />
                  <Spacer y={0.5} />
                  <PlaceholderBox width={150 + Math.random() * 50} height={15} />
                  <Spacer y={2} />
                  <PlaceholderBox width={100 + Math.random() * 50} height={15} />
                  <Spacer y={0.5} />
                  <PlaceholderBox width={100 + Math.random() * 50} height={15} />
                </Flex>
              </Flex>
            )
          })}
        </Flex>
      </Flex>
    </Wrapper>
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
