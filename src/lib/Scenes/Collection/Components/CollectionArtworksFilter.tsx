import { CollectionArtworks_collection } from "__generated__/CollectionArtworks_collection.graphql"
import { ArtworkFilterNavigator, FilterModalMode } from "lib/Components/ArtworkFilter"
import { ArtworksFiltersStore } from "lib/Components/ArtworkFilter/ArtworkFilterStore"
import { isPad } from "lib/utils/hardware"
import { Schema } from "lib/utils/track"
import { useScreenDimensions } from "lib/utils/useScreenDimensions"
import { Box, FilterIcon, Flex, Separator, Text, Touchable } from "palette"
import React, { useEffect, useState } from "react"
import { Animated, Dimensions, LayoutChangeEvent, PixelRatio, Platform } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"
import { useTracking } from "react-tracking"

interface FilterProps {
  collection: CollectionArtworks_collection
  animationValue: Animated.Value
}

const pixelRatio = PixelRatio.get()
// values based on px used in <BackButton>
const BACK_BUTTON_SIZE = {
  top: isPad() ? 10 / pixelRatio : 14 / pixelRatio,
  left: isPad() ? 20 / pixelRatio : 10 / pixelRatio,
  right: 0,
  bottom: 0,
  image: {
    height: 40,
    width: 40,
  },
}

export const CollectionArtworksFilter: React.FC<FilterProps> = ({ collection, animationValue }) => {
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
  const [onLayoutCalled, setOnLayoutCalled] = useState(false)
  const [filterPageY, setPageY] = useState(0)

  useEffect(() => {
    // orientation changed, allow for recalculation of pageY
    Dimensions.addEventListener("change", orientationChanged)
    return () => {
      Dimensions.removeEventListener("change", orientationChanged)
    }
  }, [])

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

  const orientationChanged = () => {
    setOnLayoutCalled(false)
  }

  const _onLayout = (event: LayoutChangeEvent) => {
    // because onLayout can be called multiple times on android
    if (onLayoutCalled) {
      return
    }
    // @ts-ignore
    event.target.measure((x: number, y: number, width: number, height: number, pageX: number, pageY: number) => {
      setPageY(pageY)
    })
    setOnLayoutCalled(true)
  }

  const ANIM_START = BACK_BUTTON_SIZE.image.height * 2

  const TRANSLATE_X_VALUE = BACK_BUTTON_SIZE.image.width
  const extraOffset = Platform.select({ android: -6, ios: 3, default: 3 })
  const TRANSLATE_Y_VALUE = BACK_BUTTON_SIZE.image.height / 2 - BACK_BUTTON_SIZE.top + extraOffset

  return artworksTotal && artworksTotal > 0 ? (
    <Box backgroundColor="white" onLayout={(e) => _onLayout(e)}>
      <Animated.View
        style={{
          opacity: animationValue.interpolate({
            inputRange: filterPageY > 0 ? [0, filterPageY - ANIM_START, filterPageY] : [0, 0, 0],
            outputRange: filterPageY > 0 ? [1, 0, 0] : [1, 1, 1],
            extrapolate: "clamp",
          }),
        }}
      >
        <Separator mt={2} width={screenWidth * 2} />
      </Animated.View>
      <Animated.View
        style={{
          transform: [
            {
              translateY: animationValue.interpolate({
                inputRange: filterPageY > 0 ? [0, filterPageY - ANIM_START, filterPageY] : [0, 0, 0],
                outputRange: filterPageY > 0 ? [0, 0, TRANSLATE_Y_VALUE] : [0, 0, 0],
                extrapolate: "clamp",
              }),
            },
          ],
        }}
      >
        <Box backgroundColor="white" mt={3} px={2} mb={3}>
          <Flex flexDirection="row" justifyContent="space-between" alignItems="center">
            <Animated.View
              style={{
                transform: [
                  {
                    translateX: animationValue.interpolate({
                      inputRange: filterPageY > 0 ? [0, filterPageY - ANIM_START, filterPageY] : [0, 0, 0],
                      outputRange: filterPageY > 0 ? [0, 0, TRANSLATE_X_VALUE] : [0, 0, 0],
                      extrapolate: "clamp",
                    }),
                  },
                ],
              }}
            >
              <Text variant="subtitle" color="black60">
                Showing {artworksTotal} works
              </Text>
            </Animated.View>
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
      </Animated.View>
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
