import { Box } from "@artsy/palette-mobile"
import { FullFeaturedArtistListQuery } from "__generated__/FullFeaturedArtistListQuery.graphql"
import { FullFeaturedArtistList_collection$data } from "__generated__/FullFeaturedArtistList_collection.graphql"
import { ArtistListItemContainer as ArtistListItem } from "app/Components/ArtistListItem"
import { PageWithSimpleHeader } from "app/Components/PageWithSimpleHeader"
import { getRelayEnvironment } from "app/system/relay/defaultEnvironment"
import renderWithLoadProgress from "app/utils/renderWithLoadProgress"
import React from "react"
import { FlatList, ViewProps } from "react-native"
import { createFragmentContainer, graphql, QueryRenderer } from "react-relay"

interface Props extends ViewProps {
  collection: FullFeaturedArtistList_collection$data
}

export class FullFeaturedArtistList extends React.Component<Props> {
  getFeaturedArtists = () => {
    const allArtists = this.props.collection?.artworksConnection?.merchandisableArtists || []
    const featuredArtistExclusionIds = this.props.collection?.featuredArtistExclusionIds || []
    const artistIDs = this.props.collection?.query?.artistIDs || []

    // When a collection contains artistsIDs we want to only display those artists as featured
    // instead of all the artists in the collection.
    if (artistIDs.length > 0) {
      return allArtists.filter((artist) => artistIDs.includes(artist?.internalID))
    }

    // Some artist even though they are within the collection shouldn't be displayed as featured artists
    // https://artsyproduct.atlassian.net/browse/FX-1595
    if (featuredArtistExclusionIds.length > 0) {
      // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
      return allArtists.filter((artist) => !featuredArtistExclusionIds.includes(artist.internalID))
    }
    return allArtists
  }

  render() {
    const allArtists = this.getFeaturedArtists()

    return (
      <PageWithSimpleHeader title="Featured Artists">
        <FlatList
          contentContainerStyle={{ marginLeft: 20, marginRight: 20, paddingVertical: 20 }}
          data={allArtists}
          keyExtractor={(_item, index) => String(index)}
          renderItem={({ item }) => {
            return (
              // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
              <Box width="100%" key={item.internalID} pb={20}>
                <ArtistListItem
                  // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
                  artist={item}
                />
              </Box>
            )
          }}
        />
      </PageWithSimpleHeader>
    )
  }
}

export const CollectionFeaturedArtistsContainer = createFragmentContainer(FullFeaturedArtistList, {
  collection: graphql`
    fragment FullFeaturedArtistList_collection on MarketingCollection {
      artworksConnection(aggregations: [MERCHANDISABLE_ARTISTS], size: 0, sort: "-decayed_merch") {
        merchandisableArtists {
          internalID
          ...ArtistListItem_artist
        }
      }
      query {
        artistIDs
      }
      featuredArtistExclusionIds
    }
  `,
})

export const CollectionFullFeaturedArtistListQueryRenderer: React.FC<{ collectionID: string }> = ({
  collectionID,
}) => (
  <QueryRenderer<FullFeaturedArtistListQuery>
    environment={getRelayEnvironment()}
    query={graphql`
      query FullFeaturedArtistListQuery($collectionID: String!) {
        collection: marketingCollection(slug: $collectionID) {
          ...FullFeaturedArtistList_collection
        }
      }
    `}
    variables={{
      collectionID,
    }}
    cacheConfig={{
      // Bypass Relay cache on retries.
      force: true,
    }}
    render={renderWithLoadProgress(CollectionFeaturedArtistsContainer)}
  />
)
