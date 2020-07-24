import { Flex, Sans } from "@artsy/palette"
import { ArtistSeriesMoreSeries_artist } from "__generated__/ArtistSeriesMoreSeries_artist.graphql"
import OpaqueImageView from "lib/Components/OpaqueImageView/OpaqueImageView"
import React from "react"
import { FlatList, View } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"

interface ArtistSeriesMoreSeriesProps {
  artist: ArtistSeriesMoreSeries_artist | null | undefined
}

export const ArtistSeriesMoreSeries: React.FC<ArtistSeriesMoreSeriesProps> = ({ artist }) => {
  const series = artist?.artistSeriesConnection?.edges ?? []
  console.log("series", artist)

  if (!artist || series?.length <= 1) {
    return null
  }
  // sort order should be by forSaleArtworksCount
  return (
    <FlatList
      data={series}
      renderItem={({ item }) => (
        <Flex flexDirection="row">
          <OpaqueImageView imageURL={item?.node?.image?.url} height={70} width={70} />
          <Flex flexDirection="column">
            <Sans size="3t">{item?.node?.title}</Sans>
            <Sans size="3" color="black60">
              {item?.node?.forSaleArtworksCount}
            </Sans>
          </Flex>
        </Flex>
      )}
      keyExtractor={(item, index) => String(item?.node?.internalID || index)}
      ItemSeparatorComponent={() => <View style={{ marginBottom: 20 }} />}
    />
  )
}

export const ArtistSeriesMoreSeriesFragmentContainer = createFragmentContainer(ArtistSeriesMoreSeries, {
  artist: graphql`
    fragment ArtistSeriesMoreSeries_artist on Artist {
      artistSeriesConnection(first: 4) {
        edges {
          node {
            internalID
            title
            forSaleArtworksCount
            image {
              url
            }
          }
        }
      }
    }
  `,
})
