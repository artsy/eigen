import { MyCollectionInsightsQuery } from "__generated__/MyCollectionInsightsQuery.graphql"
import { StickyTabPageScrollView } from "app/Components/StickyTabPage/StickyTabPageScrollView"
import { InfoModal } from "app/Scenes/SellWithArtsy/SubmitArtwork/ArtworkDetails/InfoModal/InfoModal"
import { Flex, Text, Touchable, useSpace } from "palette"
import React, { Suspense, useState } from "react"
import { useLazyLoadQuery } from "react-relay"
import { graphql } from "relay-runtime"
import { AuctionResultsForArtistsYouCollectRail } from "./AuctionResultsForArtistsYouCollectRail"
import { Banner } from "./Banner"
import { MyCollectionInsightsOverview } from "./MyCollectionInsightsOverview"

export const MyCollectionInsights: React.FC<{}> = ({}) => {
  const space = useSpace()
  const [shouldShowarketSignalsModal, setShouldShowarketSignalsModal] = useState<boolean>(false)
  const data = useLazyLoadQuery<MyCollectionInsightsQuery>(MyCollectionInsightsScreenQuery, {})

  const renderTitle = () => {
    return (
      <Flex justifyContent="space-between" flexDirection="row" mb={2} alignItems="center">
        <Text variant="lg">Market Signals</Text>
        <Touchable onPress={() => setShouldShowarketSignalsModal(true)}>
          <Text style={{ textDecorationLine: "underline" }} variant="sm" color="black60">
            What is this?
          </Text>
        </Touchable>
        <InfoModal
          title="Market Signals"
          visible={shouldShowarketSignalsModal}
          onDismiss={() => setShouldShowarketSignalsModal(false)}
        >
          {renderMarketSignalsModal()}
        </InfoModal>
      </Flex>
    )
  }

  return (
    <StickyTabPageScrollView
      contentContainerStyle={{ paddingTop: space("2") }}
      paddingHorizontal={0}
    >
      <Flex paddingX={space("2")}>
        <MyCollectionInsightsOverview />
        {renderTitle()}
        <AuctionResultsForArtistsYouCollectRail auctionResults={data.me!} />
      </Flex>
      {
        // TODO: The banner should be visible always as long as the user has at least an artwork with insights
        // waiting for the backend
        <Banner />
      }
    </StickyTabPageScrollView>
  )
}

export const MyCollectionInsightsQR: React.FC<{}> = () => (
  <Suspense fallback={<MyCollectionInsightsPlaceHolder />}>
    <MyCollectionInsights />
  </Suspense>
)

// TODO: fix, placeHolder is hidden behind the header
export const MyCollectionInsightsPlaceHolder = () => (
  <Flex>
    <Text>A Placeholder</Text>
  </Flex>
)

export const MyCollectionInsightsScreenQuery = graphql`
  query MyCollectionInsightsQuery {
    me {
      ...AuctionResultsForArtistsYouCollectRail_me
    }
  }
`

const renderMarketSignalsModal = () => {
  return (
    <Flex mt={1}>
      <Text caps>what are artsy insights</Text>
      <Text>
        Artsy insights are free, at-a glance insights into the market and career of artists in your
        collection.
      </Text>
      <Text caps mt={2}>
        where do insights come from?
      </Text>
      <Text>
        Our market data comes from the Artsy price database, which includes millions of results from
        leading auction houses across the globe.
      </Text>
      <Text caps mt={2}>
        will I see insights on my entire collection?
      </Text>
      <Text>
        Our database covers 300,000 artists — and counting. Not all artists in your collection will
        have insights right now, but we're adding more all the time.
      </Text>
    </Flex>
  )
}
