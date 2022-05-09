import { AuctionResultsBasedOnArtistsYouCollect_me$key } from "__generated__/AuctionResultsBasedOnArtistsYouCollect_me.graphql"
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
  auctionResults: AuctionResultsBasedOnArtistsYouCollect_me$key
}

export const AuctionResultsBasedOnArtistsYouCollect: React.FC<
  AuctionResultsBasedOnArtistsYouCollectProps
> = ({ auctionResults }) => {
  const fragmentData = useFragment<AuctionResultsBasedOnArtistsYouCollect_me$key>(
    auctionResultsBasedOnArtistsYouCollectFragment,
    auctionResults
  )
  const auctionResultsData = extractNodes(fragmentData.myCollectionAuctionResults)

  if (!auctionResultsData.length) {
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
        data={auctionResultsData}
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

const auctionResultsBasedOnArtistsYouCollectFragment = graphql`
  fragment AuctionResultsBasedOnArtistsYouCollect_me on Me {
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
