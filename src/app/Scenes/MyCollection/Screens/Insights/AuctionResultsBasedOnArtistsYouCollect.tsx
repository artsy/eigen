import { MyCollectionInsights_me } from "__generated__/MyCollectionInsights_me.graphql"
import { AuctionResultListItemFragmentContainer } from "app/Components/Lists/AuctionResultListItem"
import { SectionTitle } from "app/Components/SectionTitle"
import { navigate } from "app/navigation/navigate"
import { extractNodes } from "app/utils/extractNodes"
import { useScreenDimensions } from "app/utils/useScreenDimensions"
import { Flex, Separator } from "palette"
import React from "react"
import { FlatList } from "react-native-gesture-handler"

interface AuctionResultsBasedOnArtistsYouCollectProps {
  me: MyCollectionInsights_me
}

export const AuctionResultsBasedOnArtistsYouCollect: React.FC<
  AuctionResultsBasedOnArtistsYouCollectProps
> = ({ me }) => {
  const auctionResults = extractNodes(me.myCollectionAuctionResults)

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
