import { ArtistInsightsAuctionResults_artist } from "__generated__/ArtistInsightsAuctionResults_artist.graphql"
import { extractNodes } from "lib/utils/extractNodes"
import { capitalize } from "lodash"
import moment from "moment"
import { bullet, Flex, NoArtworkIcon, Separator, Text } from "palette"
import React from "react"
import { FlatList } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"
import { ArtistInsightsAuctionResultFragmentContainer } from "./ArtistInsightsAuctionResult"

interface Props {
  artist: ArtistInsightsAuctionResults_artist
}

const ArtistInsightsAuctionResults: React.FC<Props> = ({ artist }) => {
  const auctionResults = extractNodes(artist.auctionResultsConnection)

  return (
    <FlatList
      data={auctionResults}
      keyExtractor={(item) => `${item.id}`}
      renderItem={({ item }) => <ArtistInsightsAuctionResultFragmentContainer auctionResult={item} />}
      ListHeaderComponent={() => (
        <>
          <Text variant="title">Auction results</Text>
          <Text variant="small" color="black60">
            Sorted by most recent sale date
          </Text>
          <Separator mt="2" />
        </>
      )}
      ItemSeparatorComponent={() => <Separator />}
    />
  )
}

export const ArtistInsightsAuctionResultsPaginationContainer = createFragmentContainer(ArtistInsightsAuctionResults, {
  artist: graphql`
    fragment ArtistInsightsAuctionResults_artist on Artist {
      auctionResultsConnection(first: 10, sort: DATE_DESC) {
        edges {
          node {
            id
            ...ArtistInsightsAuctionResult_auctionResult
          }
        }
      }
    }
  `,
})
