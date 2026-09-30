import { Flex, useScreenDimensions, useSpace } from "@artsy/palette-mobile"
import { MapPreviewCard } from "app/Scenes/CityGuide/Components/Map/MapPreviewCard"
import { MapPlace } from "app/Scenes/CityGuide/Components/Map/utils/mapSectionsToGeoJSON"
import React from "react"
import { ScrollView } from "react-native"

interface Props {
  places: MapPlace[]
  citySlug: string
  onPressPlace?: (placeId: string) => void
}

/** A tapped cluster's places, as a horizontal rail of preview cards. The caller positions it. */
export const MapPreviewCardRail: React.FC<Props> = ({ places, citySlug, onPressPlace }) => {
  const { width: screenWidth } = useScreenDimensions()
  const space = useSpace()
  const width = screenWidth - 2 * space(2)

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <Flex flexDirection="row">
        {places.map((place, index) => (
          // Fixed width: a single card relies on its absolute-positioned parent to size it,
          // which a horizontal ScrollView doesn't provide.
          <Flex key={place.id} width={width}>
            <MapPreviewCard
              isLast={index === places.length - 1}
              place={place}
              citySlug={citySlug}
              onPress={onPressPlace ? () => onPressPlace(place.id) : undefined}
            />
          </Flex>
        ))}
      </Flex>
    </ScrollView>
  )
}
