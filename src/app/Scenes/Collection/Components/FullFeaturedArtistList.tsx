import { Box, Flex, Join, Skeleton, Spacer } from "@artsy/palette-mobile"
import { FullFeaturedArtistListQuery } from "__generated__/FullFeaturedArtistListQuery.graphql"
import { FullFeaturedArtistList_collection$data } from "__generated__/FullFeaturedArtistList_collection.graphql"
import {
  ArtistListItemContainer as ArtistListItem,
  ArtistListItemPlaceholder,
} from "app/Components/ArtistListItem"
import { LoadFailureView } from "app/Components/LoadFailureView"
import { withSuspense } from "app/utils/hooks/withSuspense"
import { compact, times } from "lodash"
import React from "react"
import { FlatList, ViewProps } from "react-native"
import { createFragmentContainer, graphql, useLazyLoadQuery } from "react-relay"

interface Props extends ViewProps {
  collection: FullFeaturedArtistList_collection$data
}

export class FullFeaturedArtistList extends React.Component<Props> {
  getFeaturedArtists = () => {
    const allArtists = compact(
      this.props.collection?.artworksConnection?.merchandisableArtists || []
    )
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
      return allArtists.filter((artist) => !featuredArtistExclusionIds.includes(artist?.internalID))
    }
    return allArtists
  }

  render() {
    const allArtists = this.getFeaturedArtists()

    return (
      <FlatList
        contentContainerStyle={{ marginLeft: 20, marginRight: 20, paddingVertical: 20 }}
        data={allArtists}
        keyExtractor={(_item, index) => String(index)}
        renderItem={({ item }) => {
          return (
            // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
            <Box width="100%" key={item.internalID} pb={20}>
              <ArtistListItem artist={item} />
            </Box>
          )
        }}
      />
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

const FullFeaturedArtistListQueryRenderer: React.FC<{ collectionID: string }> = ({
  collectionID,
}) => {
  const data = useLazyLoadQuery<FullFeaturedArtistListQuery>(
    graphql`
      query FullFeaturedArtistListQuery($collectionID: String!) {
        collection: marketingCollection(slug: $collectionID) {
          ...FullFeaturedArtistList_collection
        }
      }
    `,
    { collectionID },
    { fetchPolicy: "store-and-network" }
  )

  if (!data.collection) {
    return null
  }

  return <CollectionFeaturedArtistsContainer collection={data.collection} />
}

const CollectionFullFeaturedArtistListPlacholder: React.FC = () => {
  return (
    <Skeleton>
      <Flex mx={2} mt={2}>
        <Join separator={<Spacer y={2} />}>
          {times(6).map((i) => (
            <ArtistListItemPlaceholder key={i} />
          ))}
        </Join>
      </Flex>
    </Skeleton>
  )
}

export const CollectionFullFeaturedArtistListScreen = withSuspense({
  Component: (props) => <FullFeaturedArtistListQueryRenderer {...props} />,
  LoadingFallback: CollectionFullFeaturedArtistListPlacholder,
  ErrorFallback: () => {
    return <LoadFailureView trackErrorBoundary={false} />
  },
})
