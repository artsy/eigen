import { MyCollectionInsights_me } from "__generated__/MyCollectionInsights_me.graphql"
import { AuctionResultListItemFragmentContainer } from "app/Components/Lists/AuctionResultListItem"
import { SectionTitle } from "app/Components/SectionTitle"
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

  return (
    <Flex pb={3}>
      <SectionTitle
        title="Auction Results"
        subtitle="Recent Auction Results from the Artists You Collect"
        onPress={() => {
          console.log("navigate to the list of auction results")
        }}
      />
      {auctionResults.length > 0 ? (
        <FlatList
          data={auctionResults}
          listKey="artist-auction-results"
          renderItem={({ item }) => (
            <>
              <AuctionResultListItemFragmentContainer
                auctionResult={item}
                showArtistName
                onPress={() => {
                  console.log("navigate to the auction page")
                }}
              />
            </>
          )}
          ItemSeparatorComponent={() => <Separator px={2} />}
          style={{ width: useScreenDimensions().width, left: -20 }}
        />
      ) : (
        <></>
      )}
    </Flex>
  )
}
