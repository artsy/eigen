import { TagArtworks_tag } from "__generated__/TagArtworks_tag.graphql"
import { ArtworksFilterHeader } from "app/Components/ArtworkGrids/ArtworksFilterHeader"
import { FilteredArtworkGridZeroState } from "app/Components/ArtworkGrids/FilteredArtworkGridZeroState"
import { InfiniteScrollArtworksGridContainer } from "app/Components/ArtworkGrids/InfiniteScrollArtworksGrid"
import { Schema } from "app/utils/track"
import { Box, Message, Separator, Spacer, Text } from "palette"
import React, { useContext, useRef, useState } from "react"
import { useEffect } from "react"
import { createPaginationContainer, graphql, RelayPaginationProp } from "react-relay"
import { useTracking } from "react-tracking"
import { ArtworkFilterNavigator } from "../ArtworkFilter"
import { FilterModalMode } from "../ArtworkFilter/ArtworkFilterOptionsScreen"
import { ArtworkFiltersStoreProvider } from "../ArtworkFilter/ArtworkFilterStore"
import { useArtworkFilters, useSelectedFiltersCount } from "../ArtworkFilter/useArtworkFilters"
import { StickyTabPageFlatListContext } from "../StickyTabPage/StickyTabPageFlatList"
import { StickyTabPageScrollView } from "../StickyTabPage/StickyTabPageScrollView"

interface TagArtworksContainerProps {
  tag: TagArtworks_tag
  relay: RelayPaginationProp
}

interface TagArtworksProps extends TagArtworksContainerProps {
  openFilterModal: () => void
}

export const TagArtworks: React.FC<TagArtworksProps> = ({ tag, relay, openFilterModal }) => {
  const tracking = useTracking()
  const artworksTotal = tag.artworks?.counts?.total ?? 0
  const initialArtworksTotal = useRef(artworksTotal)
  const selectedFiltersCount = useSelectedFiltersCount()

  const setJSX = useContext(StickyTabPageFlatListContext).setJSX

  const trackClear = () => {
    tracking.trackEvent(tracks.clearFilters(tag.id, tag.slug))
  }

  useArtworkFilters({
    relay,
    aggregations: tag.artworks?.aggregations,
    componentPath: "Tag/TagArtworks",
  })

  useEffect(() => {
    setJSX(
      <Box backgroundColor="white">
        <Spacer mb={1} />
        <Separator />
        <ArtworksFilterHeader
          selectedFiltersCount={selectedFiltersCount}
          onFilterPress={openFilterModal}
        />
      </Box>
    )
  }, [artworksTotal, openFilterModal])

  if (initialArtworksTotal.current === 0) {
    return (
      <Box mt={1}>
        <Message>There aren’t any works available in the tag at this time.</Message>
      </Box>
    )
  }

  if (artworksTotal === 0) {
    return (
      <Box pt={1}>
        <FilteredArtworkGridZeroState id={tag.id} slug={tag.slug} trackClear={trackClear} />
      </Box>
    )
  }

  return (
    <>
      <Spacer mb={1} />
      <Text variant="md" color="black60" mb={2}>
        Showing {artworksTotal} works
      </Text>
      <InfiniteScrollArtworksGridContainer
        connection={tag.artworks!}
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
    tracking.trackEvent(tracks.openFilterWindow(tag.id, tag.slug))
    handleOpenFilterArtworksModal()
  }

  const closeFilterArtworksModal = () => {
    tracking.trackEvent(tracks.closeFilterWindow(tag.id, tag.slug))
    handleCloseFilterArtworksModal()
  }

  return (
    <ArtworkFiltersStoreProvider>
      <StickyTabPageScrollView keyboardShouldPersistTaps="handled">
        <TagArtworks {...props} openFilterModal={openFilterArtworksModal} />
        <ArtworkFilterNavigator
          {...props}
          id={tag.internalID}
          slug={tag.slug}
          visible={isFilterArtworksModalVisible}
          exitModal={handleCloseFilterArtworksModal}
          closeModal={closeFilterArtworksModal}
          mode={FilterModalMode.Tag}
        />
      </StickyTabPageScrollView>
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
      return props.tag.artworks
    },
    getVariables(props, { count, cursor }, fragmentVariables) {
      return {
        input: fragmentVariables.input,
        id: props.tag.slug,
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
