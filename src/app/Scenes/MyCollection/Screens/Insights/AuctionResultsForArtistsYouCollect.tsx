import { AuctionResultsForArtistsYouCollect_me$key } from "__generated__/AuctionResultsForArtistsYouCollect_me.graphql"
import { AuctionResultListItemFragmentContainer } from "app/Components/Lists/AuctionResultListItem"
import { SectionTitle } from "app/Components/SectionTitle"
import { navigate } from "app/navigation/navigate"
import { extractNodes } from "app/utils/extractNodes"
import { useScreenDimensions } from "app/utils/useScreenDimensions"
import { Flex, Separator } from "palette"
import React from "react"
import { FlatList } from "react-native-gesture-handler"
import { graphql, useFragment } from "react-relay"

interface AuctionResultsForArtistsYouCollectProps {
  auctionResults: AuctionResultsForArtistsYouCollect_me$key
}

export const AuctionResultsForArtistsYouCollect: React.FC<
  AuctionResultsForArtistsYouCollectProps
> = ({ auctionResults }) => {
  const fragmentData = useFragment<AuctionResultsForArtistsYouCollect_me$key>(
    auctionResultsForArtistsYouCollectFragment,
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
          navigate("/auction-results-for-artists-you-collect")
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

const auctionResultsForArtistsYouCollectFragment = graphql`
  fragment AuctionResultsForArtistsYouCollect_me on Me {
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
