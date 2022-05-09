import { MyCollectionInsights_me } from "__generated__/MyCollectionInsights_me.graphql"
import { MyCollectionInsightsQuery } from "__generated__/MyCollectionInsightsQuery.graphql"
import { StickyTabPageScrollView } from "app/Components/StickyTabPage/StickyTabPageScrollView"
import { defaultEnvironment } from "app/relay/createEnvironment"
import { Flex, Text, useSpace } from "palette"
import React, { Suspense } from "react"
import { createFragmentContainer, QueryRenderer } from "react-relay"
import { graphql } from "relay-runtime"
import { AuctionResultsBasedOnArtistsYouCollect } from "./AuctionResultsBasedOnArtistsYouCollect"
import { MyCollectionInsightsOverview } from "./MyCollectionInsightsOverview"

interface MyCollectionInsightsProps {
  me: MyCollectionInsights_me
}

export const MyCollectionInsights: React.FC<MyCollectionInsightsProps> = ({ me }) => {
  const space = useSpace()
  return (
    <StickyTabPageScrollView contentContainerStyle={{ paddingTop: space("2") }}>
      <MyCollectionInsightsOverview />
      <AuctionResultsBasedOnArtistsYouCollect me={me} />
    </StickyTabPageScrollView>
  )
}

export const MyCollectionInsightsQR: React.FC<{}> = () => (
  <Suspense fallback={<MyCollectionInsightsPlaceHolder />}>
    {/* <MyCollectionInsights /> */}
  </Suspense>
)

// TODO: fix, placeHolder is hidden behind the header
export const MyCollectionInsightsPlaceHolder = () => (
  <Flex>
    <Text>A Placeholder</Text>
  </Flex>
)

export const MyCollectionInsightsContainer = createFragmentContainer(MyCollectionInsights, {
  me: graphql`
    fragment MyCollectionInsights_me on Me {
      myCollectionAuctionResults(first: 3) {
        totalCount
        edges {
          node {
            ...AuctionResultListItem_auctionResult
            id
            internalID
            artistID
          }
        }
      }
    }
  `,
})

export const MyCollectionInsightsQueryRenderer = () => {
  return (
    <QueryRenderer<MyCollectionInsightsQuery>
      environment={defaultEnvironment}
      query={graphql`
        query MyCollectionInsightsQuery {
          me {
            ...MyCollectionInsights_me
          }
        }
      `}
      variables={{}}
      cacheConfig={{ force: true }}
      render={({ props }) => {
        if (props?.me) {
          return <MyCollectionInsightsContainer me={props.me} />
        } else {
          return null
        }
      }}
    />
  )
}
