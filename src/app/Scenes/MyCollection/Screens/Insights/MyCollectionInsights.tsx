import { MyCollectionInsightsQuery } from "__generated__/MyCollectionInsightsQuery.graphql"
import { StickyTabPageScrollView } from "app/Components/StickyTabPage/StickyTabPageScrollView"
import { InfoModal } from "app/Scenes/SellWithArtsy/SubmitArtwork/ArtworkDetails/InfoModal/InfoModal"
import { extractNodes } from "app/utils/extractNodes"
import { Flex, Spinner, Text, Touchable, useSpace } from "palette"
import React, { Suspense, useState } from "react"
import { useLazyLoadQuery } from "react-relay"
import { graphql } from "relay-runtime"
import { ActivateMoreMarketInsightsBanner } from "./ActivateMoreMarketInsightsBanner"
import { AuctionResultsForArtistsYouCollectRail } from "./AuctionResultsForArtistsYouCollectRail"
import { MyCollectionInsightsEmptyState } from "./MyCollectionInsightsEmptyState"
import { MyCollectionInsightsOverview } from "./MyCollectionInsightsOverview"

export const MyCollectionInsights: React.FC<{}> = ({}) => {
  const space = useSpace()
  const data = useLazyLoadQuery<MyCollectionInsightsQuery>(MyCollectionInsightsScreenQuery, {})

  const myCollectionArtworksCount = extractNodes(data.me?.myCollectionConnection).length

  const hasMarketSignals = !!data.me?.auctionResults?.totalCount

  const renderContent = () => {
    return (
      <>
        <MyCollectionInsightsOverview />
        {hasMarketSignals && (
          <>
            <MarketSignalsSectionHeader />
            <AuctionResultsForArtistsYouCollectRail auctionResults={data.me!} />
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
      contentContainerStyle={{ paddingTop: space("2"), flexGrow: 1, justifyContent: "center" }}
      paddingHorizontal={0}
    >
      {myCollectionArtworksCount > 0 ? renderContent() : <MyCollectionInsightsEmptyState />}
    </StickyTabPageScrollView>
  )
}

const MarketSignalsSectionHeader = () => {
  const [shouldShowarketSignalsModal, setShouldShowarketSignalsModal] = useState(false)

  return (
    <Flex justifyContent="space-between" flexDirection="row" mb={2} alignItems="center" px={2}>
      <Text variant="lg">Market Signals</Text>
      <Touchable onPress={() => setShouldShowarketSignalsModal(true)} haptic>
        <Text style={{ textDecorationLine: "underline" }} variant="sm" color="black60">
          What is this?
        </Text>
      </Touchable>
      <InfoModal
        title="Market Signals"
        visible={shouldShowarketSignalsModal}
        onDismiss={() => setShouldShowarketSignalsModal(false)}
      >
        <Flex mt={1}>
          <Text caps>what are artsy insights</Text>
          <Text>
            Artsy insights are free, at-a glance insights into the market and career of artists in
            your collection.
          </Text>
          <Text caps mt={2}>
            where do insights come from?
          </Text>
          <Text>
            Our market data comes from the Artsy price database, which includes millions of results
            from leading auction houses across the globe.
          </Text>
          <Text caps mt={2}>
            will I see insights on my entire collection?
          </Text>
          <Text>
            Our database covers 300,000 artists — and counting. Not all artists in your collection
            will have insights right now, but we're adding more all the time.
          </Text>
        </Flex>
      </InfoModal>
    </Flex>
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
      auctionResults: myCollectionAuctionResults(first: 1) {
        totalCount
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
