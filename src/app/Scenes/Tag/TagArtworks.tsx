import { Spacer, Box, Text, SimpleMessage, Tabs } from "@artsy/palette-mobile"
import { TagArtworks_tag$data } from "__generated__/TagArtworks_tag.graphql"
import { ArtworkFilterNavigator } from "app/Components/ArtworkFilter"
import { FilterModalMode } from "app/Components/ArtworkFilter/ArtworkFilterOptionsScreen"
import { ArtworkFiltersStoreProvider } from "app/Components/ArtworkFilter/ArtworkFilterStore"
import { useArtworkFilters } from "app/Components/ArtworkFilter/useArtworkFilters"
import { FilteredArtworkGridZeroState } from "app/Components/ArtworkGrids/FilteredArtworkGridZeroState"
import { InfiniteScrollArtworksGridContainer } from "app/Components/ArtworkGrids/InfiniteScrollArtworksGrid"
import { TabsFlatList } from "app/Components/TabsFlatlist"
import { TagArtworksFilterHeader } from "app/Scenes/Tag/TagArtworksFilterHeader"
import { Schema } from "app/utils/track"
import React, { useRef, useState } from "react"
import { createPaginationContainer, graphql, RelayPaginationProp } from "react-relay"
import { useTracking } from "react-tracking"

interface TagArtworksContainerProps {
  tag?: TagArtworks_tag$data | null
  relay: RelayPaginationProp
}

interface TagArtworksProps extends TagArtworksContainerProps {
  openFilterModal: () => void
}

export const TagArtworks: React.FC<TagArtworksProps> = ({ tag, relay, openFilterModal }) => {
  const tracking = useTracking()
  const artworksTotal = tag?.artworks?.counts?.total ?? 0
  const initialArtworksTotal = useRef(artworksTotal)

  const trackClear = () => {
    if (tag?.id && tag?.slug) {
      tracking.trackEvent(tracks.clearFilters(tag.id, tag.slug))
    }
  }

  useArtworkFilters({
    relay,
    aggregations: tag?.artworks?.aggregations,
    componentPath: "Tag/TagArtworks",
  })

  if (initialArtworksTotal.current === 0) {
    return (
      <Box pt={2}>
        <SimpleMessage>There aren’t any works available in the tag at this time.</SimpleMessage>
      </Box>
    )
  }

  if (artworksTotal === 0) {
    return (
      <Box pt={2}>
        <FilteredArtworkGridZeroState id={tag?.id} slug={tag?.slug} trackClear={trackClear} />
      </Box>
    )
  }

  return (
    <>
      <Tabs.SubTabBar>
        <TagArtworksFilterHeader openFilterArtworksModal={openFilterModal} />
      </Tabs.SubTabBar>
      <Spacer y={1} />
      <Text variant="sm-display" color="black60" mb={2}>
        Showing {artworksTotal} works
      </Text>
      <InfiniteScrollArtworksGridContainer
        connection={tag?.artworks}
        hasMore={relay.hasMore}
        loadMore={relay.loadMore}
      />
    </>
  )
}

const TagArtworksContainer: React.FC<TagArtworksContainerProps> = (props) => {
  const { tag } = props
  const tracking = useTracking()
  const [isFilterArtworksModalVisible, setFilterArtworkModalVisible] = useState(false)

  const handleCloseFilterArtworksModal = () => setFilterArtworkModalVisible(false)
  const handleOpenFilterArtworksModal = () => setFilterArtworkModalVisible(true)

  const openFilterArtworksModal = () => {
    if (tag?.id && tag?.slug) {
      tracking.trackEvent(tracks.openFilterWindow(tag.id, tag.slug))
      handleOpenFilterArtworksModal()
    }
  }

  const closeFilterArtworksModal = () => {
    if (tag?.id && tag?.slug) {
      tracking.trackEvent(tracks.closeFilterWindow(tag.id, tag.slug))
      handleCloseFilterArtworksModal()
    }
  }

  return (
    <ArtworkFiltersStoreProvider>
      <TabsFlatList keyboardShouldPersistTaps="handled">
        <TagArtworks {...props} openFilterModal={openFilterArtworksModal} />
        <ArtworkFilterNavigator
          {...props}
          id={tag?.internalID}
          slug={tag?.slug}
          visible={isFilterArtworksModalVisible}
          exitModal={handleCloseFilterArtworksModal}
          closeModal={closeFilterArtworksModal}
          mode={FilterModalMode.Tag}
        />
      </TabsFlatList>
    </ArtworkFiltersStoreProvider>
  )
}

export const TagArtworksPaginationContainer = createPaginationContainer(
  TagArtworksContainer,
  {
    tag: graphql`
      fragment TagArtworks_tag on Tag
      @argumentDefinitions(
        count: { type: "Int", defaultValue: 10 }
        cursor: { type: "String", defaultValue: "" }
        input: { type: "FilterArtworksInput" }
      ) {
        id
        internalID
        slug
        artworks: filterArtworksConnection(
          first: $count
          after: $cursor
          aggregations: [
            LOCATION_CITY
            ARTIST_NATIONALITY
            PRICE_RANGE
            COLOR
            DIMENSION_RANGE
            PARTNER
            MAJOR_PERIOD
            MEDIUM
            PRICE_RANGE
            ARTIST
            LOCATION_CITY
            MATERIALS_TERMS
          ]
          input: $input
        ) @connection(key: "TagArtworksGrid_artworks") {
          counts {
            total
          }
          aggregations {
            slice
            counts {
              value
              name
              count
            }
          }
          edges {
            node {
              id
            }
          }
          ...InfiniteScrollArtworksGrid_connection
        }
      }
    `,
  },
  {
    getConnectionFromProps(props) {
      return props?.tag?.artworks
    },
    getVariables(props, { count, cursor }, fragmentVariables) {
      return {
        input: fragmentVariables.input,
        id: props?.tag?.slug,
        count,
        cursor,
      }
    },
    query: graphql`
      query TagArtworksPaginationQuery(
        $id: String!
        $count: Int!
        $cursor: String
        $input: FilterArtworksInput
      ) {
        tag(id: $id) {
          ...TagArtworks_tag @arguments(count: $count, cursor: $cursor, input: $input)
        }
      }
    `,
  }
)

export const tracks = {
  clearFilters: (id: string, slug: string) => ({
    action_name: "clearFilters",
    context_screen: Schema.ContextModules.ArtworkGrid,
    context_screen_owner_type: Schema.OwnerEntityTypes.Tag,
    context_screen_owner_id: id,
    context_screen_owner_slug: slug,
    action_type: Schema.ActionTypes.Tap,
  }),
  openFilterWindow: (id: string, slug: string) => ({
    action_name: "filter",
    context_screen_owner_type: Schema.OwnerEntityTypes.Tag,
    context_screen: Schema.PageNames.TagPage,
    context_screen_owner_id: id,
    context_screen_owner_slug: slug,
    action_type: Schema.ActionTypes.Tap,
  }),
  closeFilterWindow: (id: string, slug: string) => ({
    action_name: "closeFilterWindow",
    context_screen_owner_type: Schema.OwnerEntityTypes.Tag,
    context_screen: Schema.PageNames.TagPage,
    context_screen_owner_id: id,
    context_screen_owner_slug: slug,
    action_type: Schema.ActionTypes.Tap,
  }),
}
