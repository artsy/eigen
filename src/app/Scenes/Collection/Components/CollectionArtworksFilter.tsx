import { CollectionArtworks_collection$data } from "__generated__/CollectionArtworks_collection.graphql"
import { ArtworkFilterNavigator, FilterModalMode } from "app/Components/ArtworkFilter"
import { HeaderArtworksFilterWithTotalArtworks as HeaderArtworksFilter } from "app/Components/HeaderArtworksFilter/HeaderArtworksFilterWithTotalArtworks"
import { Schema } from "app/utils/track"
import React, { useState } from "react"
import { Animated } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"
import { useTracking } from "react-tracking"

interface FilterProps {
  collection: CollectionArtworks_collection$data
  animationValue: Animated.Value
}

export const CollectionArtworksFilter: React.FC<FilterProps> = ({ collection, animationValue }) => {
  const tracking = useTracking()

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

  return (
    <>
      <HeaderArtworksFilter animationValue={animationValue} onPress={openFilterArtworksModal} />
      <ArtworkFilterNavigator
        id={collection.id}
        slug={collection.slug}
        visible={isFilterArtworksModalVisible}
        exitModal={toggleFilterArtworksModal}
        closeModal={closeFilterArtworksModal}
        mode={FilterModalMode.Collection}
      />
    </>
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
