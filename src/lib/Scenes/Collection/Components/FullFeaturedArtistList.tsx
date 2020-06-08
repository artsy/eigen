import { Box, color, Sans, Theme } from "@artsy/palette"
import { FullFeaturedArtistList_collection } from "__generated__/FullFeaturedArtistList_collection.graphql"
import { FullFeaturedArtistListQuery } from "__generated__/FullFeaturedArtistListQuery.graphql"
import { ArtistListItemContainer as ArtistListItem } from "lib/Components/ArtistListItem"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import renderWithLoadProgress from "lib/utils/renderWithLoadProgress"
import React from "react"
import { Dimensions, FlatList, ViewProperties } from "react-native"
import { createFragmentContainer, graphql, QueryRenderer } from "react-relay"
import styled from "styled-components/native"

interface Props extends ViewProperties {
  collection: FullFeaturedArtistList_collection
}

export class FullFeaturedArtistList extends React.Component<Props> {
  getFeaturedArtists = () => {
    const allArtists = this.props.collection?.artworksConnection?.merchandisableArtists || []
    const featuredArtistExclusionIds = this.props.collection?.featuredArtistExclusionIds || []
    const artistIDs = this.props.collection?.query?.artistIDs || []

    // When a collection contains artistsIDs we want to only display those artists as featured
    // instead of all the artists in the collection.
    if (artistIDs.length > 0) {
      // @ts-ignore STRICTNESS_MIGRATION
      return allArtists.filter(artist => artistIDs.includes(artist.internalID))
    }

    // Some artist even though they are within the collection shouldn't be displayed as featured artists
    // https://artsyproduct.atlassian.net/browse/FX-1595
    if (featuredArtistExclusionIds.length > 0) {
      // @ts-ignore STRICTNESS_MIGRATION
      return allArtists.filter(artist => !featuredArtistExclusionIds.includes(artist.internalID))
    }
    return allArtists
  }

  render() {
    const allArtists = this.getFeaturedArtists()

    return (
      <Theme>
        <FlatList
          contentContainerStyle={{ marginLeft: 20, marginRight: 20 }}
          data={allArtists}
          keyExtractor={(_item, index) => String(index)}
          ListHeaderComponent={() => (
            <HeaderContainer mb={2}>
              <Sans size="4" textAlign="center" weight="medium">
                Featured Artists
              </Sans>
            </HeaderContainer>
          )}
          renderItem={({ item }) => {
            return (
              // @ts-ignore STRICTNESS_MIGRATION
              <Box width="100%" key={item.internalID} pb={20}>
                <ArtistListItem
                  // @ts-ignore STRICTNESS_MIGRATION
                  artist={item}
                />
              </Box>
            )
          }}
        />
      </Theme>
    )
  }
}

export const CollectionFeaturedArtistsContainer = createFragmentContainer(FullFeaturedArtistList, {
  collection: graphql`
    fragment FullFeaturedArtistList_collection on MarketingCollection
      @argumentDefinitions(screenWidth: { type: "Int", defaultValue: 500 }) {
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

const HeaderContainer = styled(Box)`
  border-bottom-width: 1px;
  border-color: ${color("black10")};
  margin-left: -20px;
  margin-right: -20px;
  padding-top: 25px;
  padding-bottom: 25px;
`

export const CollectionFullFeaturedArtistListQueryRenderer: React.SFC<{ collectionID: string }> = ({
  collectionID,
}) => (
  <QueryRenderer<FullFeaturedArtistListQuery>
    environment={defaultEnvironment}
    query={graphql`
      query FullFeaturedArtistListQuery($collectionID: String!, $screenWidth: Int) {
        collection: marketingCollection(slug: $collectionID) {
          ...FullFeaturedArtistList_collection @arguments(screenWidth: $screenWidth)
        }
      }
    `}
    variables={{
      collectionID,
      screenWidth: Dimensions.get("screen").width,
    }}
    cacheConfig={{
      // Bypass Relay cache on retries.
      force: true,
    }}
    render={renderWithLoadProgress(CollectionFeaturedArtistsContainer)}
  />
)
