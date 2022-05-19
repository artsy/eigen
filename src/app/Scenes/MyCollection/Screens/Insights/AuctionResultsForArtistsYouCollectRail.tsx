import { AuctionResultsForArtistsYouCollectRail_me$key } from "__generated__/AuctionResultsForArtistsYouCollectRail_me.graphql"
import { AuctionResultListItemFragmentContainer } from "app/Components/Lists/AuctionResultListItem"
import { SectionTitle } from "app/Components/SectionTitle"
import { navigate } from "app/navigation/navigate"
import { extractNodes } from "app/utils/extractNodes"
import { Flex, Separator } from "palette"
import React from "react"
import { FlatList } from "react-native-gesture-handler"
import { graphql, useFragment } from "react-relay"
import { useScreenDimensions } from "shared/hooks"

interface AuctionResultsForArtistsYouCollectRailProps {
  auctionResults: AuctionResultsForArtistsYouCollectRail_me$key
}

export const AuctionResultsForArtistsYouCollectRail: React.FC<
  AuctionResultsForArtistsYouCollectRailProps
> = ({ auctionResults }) => {
  const fragmentData = useFragment<AuctionResultsForArtistsYouCollectRail_me$key>(
    auctionResultsForArtistsYouCollectRailFragment,
    auctionResults
  )
  const auctionResultsData = extractNodes(fragmentData.myCollectionAuctionResults)

  if (!auctionResultsData.length) {
    return null
  }

  return (
    <Flex pb={2}>
      <SectionTitle
        title="Auction Results"
        subtitle="Based on Auction Results for the Last 36 Months"
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

const auctionResultsForArtistsYouCollectRailFragment = graphql`
  fragment AuctionResultsForArtistsYouCollectRail_me on Me {
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
