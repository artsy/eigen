import { Flex } from "@artsy/palette-mobile"
import { CollectionArtworks_collection$data } from "__generated__/CollectionArtworks_collection.graphql"
import { ArtworkFilterNavigator, FilterModalMode } from "app/Components/ArtworkFilter"
import { HeaderArtworksFilterWithTotalArtworks as HeaderArtworksFilter } from "app/Components/HeaderArtworksFilter/HeaderArtworksFilterWithTotalArtworks"
import { Schema } from "app/utils/track"
import React, { useState } from "react"
import { createFragmentContainer, graphql } from "react-relay"
import { useTracking } from "react-tracking"

interface FilterProps {
  collection: CollectionArtworks_collection$data
}

export const CollectionArtworksFilter: React.FC<FilterProps> = ({ collection }) => {
  const tracking = useTracking()

  const [isFilterArtworksModalVisible, setFilterArtworkModalVisible] = useState(false)

  const openFilterArtworksModal = () => {
    tracking.trackEvent({
      action_name: "filter",
      context_screen_owner_type: Schema.OwnerEntityTypes.Collection,
      context_screen: Schema.PageNames.Collection,
      context_screen_owner_id: collection.id,
      context_screen_owner_slug: collection.slug,
      action_type: Schema.ActionTypes.Tap,
    })
    setFilterArtworkModalVisible(true)
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
    setFilterArtworkModalVisible(false)
  }

  return (
    <Flex borderTopWidth={1} borderColor="mono10">
      <HeaderArtworksFilter onPress={openFilterArtworksModal} hideArtworksCount />
      <ArtworkFilterNavigator
        id={collection.id}
        slug={collection.slug}
        visible={isFilterArtworksModalVisible}
        exitModal={closeFilterArtworksModal}
        closeModal={closeFilterArtworksModal}
        mode={FilterModalMode.Collection}
      />
    </Flex>
  )
}

export const CollectionArtworksFilterFragmentContainer = createFragmentContainer(
  CollectionArtworksFilter,
  {
    collection: graphql`
      fragment CollectionArtworksFilter_collection on MarketingCollection {
        slug
        id
      }
    `,
  }
)
