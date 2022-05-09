import { MyCollectionInsights_me$key } from "__generated__/MyCollectionInsights_me.graphql"
import { AuctionResultListItemFragmentContainer } from "app/Components/Lists/AuctionResultListItem"
import { SectionTitle } from "app/Components/SectionTitle"
import { navigate } from "app/navigation/navigate"
import { extractNodes } from "app/utils/extractNodes"
import { useScreenDimensions } from "app/utils/useScreenDimensions"
import { Flex, Separator } from "palette"
import React from "react"
import { FlatList } from "react-native-gesture-handler"
import { graphql, useFragment } from "react-relay"

interface AuctionResultsBasedOnArtistsYouCollectProps {
  me: MyCollectionInsights_me$key
}

export const AuctionResultsBasedOnArtistsYouCollect: React.FC<
  AuctionResultsBasedOnArtistsYouCollectProps
> = ({ me }) => {
  const meData = useFragment<MyCollectionInsights_me$key>(myCollectionInsightsFragment, me)
  const auctionResults = extractNodes(meData.myCollectionAuctionResults)

  if (!auctionResults.length) {
    return null
  }

  return (
    <Flex pb={3}>
      <SectionTitle
        title="Auction Results"
        subtitle="Recent Auction Results from the Artists You Collect"
        onPress={() => {
          console.log("navigate to the list of auction results")
        }}
      />
      <FlatList
        data={auctionResults}
        listKey="artist-auction-results"
        renderItem={({ item }) => (
          <AuctionResultListItemFragmentContainer
            auctionResult={item}
            showArtistName
            onPress={() => navigate(`/artist/${item.artistID}/auction-result/${item.internalID}`)}
          />
        )}
        ItemSeparatorComponent={() => <Separator px={2} />}
        style={{ width: useScreenDimensions().width, left: -20 }}
      />
    </Flex>
  )
}

const myCollectionInsightsFragment = graphql`
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
`
