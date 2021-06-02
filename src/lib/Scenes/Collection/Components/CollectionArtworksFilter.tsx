import { CollectionArtworks_collection } from "__generated__/CollectionArtworks_collection.graphql"
import { ArtworkFilterNavigator, FilterModalMode } from "lib/Components/ArtworkFilter"
import { ArtworksFiltersStore } from "lib/Components/ArtworkFilter/ArtworkFilterStore"
import { Schema } from "lib/utils/track"
import { useScreenDimensions } from "lib/utils/useScreenDimensions"
import { Box, FilterIcon, Flex, Separator, Text, Touchable } from "palette"
import React, { useState } from "react"
import { createFragmentContainer, graphql } from "react-relay"
import { useTracking } from "react-tracking"

interface FilterProps {
  collection: CollectionArtworks_collection
}
export const CollectionArtworksFilter: React.FC<FilterProps> = ({ collection }) => {
  const tracking = useTracking()

  const filteredTotal = ArtworksFiltersStore.useStoreState((state) => state.counts.total) || 0
  const filtersPresent = ArtworksFiltersStore.useStoreState((state) => state.appliedFilters.length > 0)

  const screenWidth = useScreenDimensions().width

  const artworksTotal = filtersPresent
    ? filteredTotal > 0
      ? filteredTotal
      : 0
    : collection.collectionArtworks?.counts?.total

  const [isFilterArtworksModalVisible, setFilterArtworkModalVisible] = useState(false)

  const toggleFilterArtworksModal = () => {
    setFilterArtworkModalVisible(!isFilterArtworksModalVisible)
  }

  const openFilterArtworksModal = () => {
    tracking.trackEvent({
      action_name: "filter",
      context_screen_owner_type: Schema.OwnerEntityTypes.Collection,
      context_screen: Schema.PageNames.Collection,
      context_screen_owner_id: collection.id,
      context_screen_owner_slug: collection.slug,
      action_type: Schema.ActionTypes.Tap,
    })
    toggleFilterArtworksModal()
  }

  const closeFilterArtworksModal = () => {
    tracking.trackEvent({
      action_name: "closeFilterWindow",
      context_screen_owner_type: Schema.OwnerEntityTypes.Collection,
      context_screen: Schema.PageNames.Collection,
      context_screen_owner_id: collection.id,
      context_screen_owner_slug: collection.slug,
      action_type: Schema.ActionTypes.Tap,
    })
    toggleFilterArtworksModal()
  }

  return artworksTotal && artworksTotal > 0 ? (
    <Box backgroundColor="white">
      <Separator mt={2} ml={-2} width={screenWidth} />
      <Box backgroundColor="white" mt={3} px={2} mb={3}>
        <Flex flexDirection="row" justifyContent="space-between" alignItems="center">
          <Text variant="subtitle" color="black60">
            Showing {artworksTotal} works
          </Text>
          <Touchable haptic onPress={openFilterArtworksModal}>
            <Flex flexDirection="row">
              <FilterIcon fill="black100" width="20px" height="20px" />
              <Text variant="subtitle" color="black100">
                Sort & Filter
              </Text>
            </Flex>
          </Touchable>
        </Flex>

        <ArtworkFilterNavigator
          id={collection.id}
          slug={collection.slug}
          isFilterArtworksModalVisible={isFilterArtworksModalVisible}
          exitModal={toggleFilterArtworksModal}
          closeModal={closeFilterArtworksModal}
          mode={FilterModalMode.Collection}
        />
      </Box>
    </Box>
  ) : null
}

export const CollectionArtworksFilterFragmentContainer = createFragmentContainer(CollectionArtworksFilter, {
  collection: graphql`
    fragment CollectionArtworks_collection on MarketingCollection
    @argumentDefinitions(input: { type: "FilterArtworksInput" }) {
      slug
      id
      collectionArtworks: artworksConnection(input: $input) @connection(key: "Collection_collectionArtworks") {
        counts {
          total
        }
      }
    }
  `,
})
