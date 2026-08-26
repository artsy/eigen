import { Flex, Pill, Spacer, Text } from "@artsy/palette-mobile"
import MapboxGL from "@rnmapbox/maps"
import { ItineraryMapPins } from "app/Scenes/CityGuide/Screens/Itinerary/Components/ItineraryMapPins"
import {
  flattenItineraryStops,
  itineraryStopsToGeoJSON,
} from "app/Scenes/CityGuide/Screens/Itinerary/utils/itineraryStopsToGeoJSON"
import { Itinerary } from "app/Scenes/CityGuide/Screens/Itinerary/utils/itineraryTypes"
import { ArtsyMapStyleURL, configureMapbox } from "app/utils/mapbox"
import { useEffect, useMemo, useRef, useState } from "react"
import { ScrollView } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

configureMapbox()

const ALL_PILL_ID = "__all__"
const BOUNDS_PADDING = 60

export const ItineraryMapView: React.FC<{ itinerary: Itinerary }> = ({ itinerary }) => {
  const [selectedSectionId, setSelectedSectionId] = useState(ALL_PILL_ID)
  const cameraRef = useRef<MapboxGL.Camera>(null)
  const { top } = useSafeAreaInsets()

  const flattened = useMemo(() => flattenItineraryStops(itinerary), [itinerary])
  const collection = useMemo(() => itineraryStopsToGeoJSON(flattened), [flattened])

  const visible = useMemo(
    () =>
      selectedSectionId === ALL_PILL_ID
        ? flattened
        : flattened.filter((f) => f.sectionId === selectedSectionId),
    [flattened, selectedSectionId]
  )

  // Refit whenever the visible set changes, so pins are never off-screen.
  useEffect(() => {
    if (!visible.length) return

    const lngs = visible.map((f) => f.stop.coordinates.lng)
    const lats = visible.map((f) => f.stop.coordinates.lat)

    cameraRef.current?.setCamera({
      bounds: {
        ne: [Math.max(...lngs), Math.max(...lats)],
        sw: [Math.min(...lngs), Math.min(...lats)],
        paddingTop: BOUNDS_PADDING,
        paddingBottom: BOUNDS_PADDING,
        paddingLeft: BOUNDS_PADDING,
        paddingRight: BOUNDS_PADDING,
      },
      animationDuration: 500,
    })
  }, [visible])

  const pills = [
    { id: ALL_PILL_ID, title: "All" },
    ...itinerary.sections.map((section) => ({ id: section.id, title: section.title })),
  ]

  return (
    <Flex flex={1}>
      <MapboxGL.MapView
        style={{ flex: 1 }}
        styleURL={ArtsyMapStyleURL}
        logoEnabled={false}
        attributionEnabled={false}
      >
        <MapboxGL.Camera ref={cameraRef} animationMode="moveTo" />

        <ItineraryMapPins
          collection={collection}
          selectedSectionId={selectedSectionId === ALL_PILL_ID ? null : selectedSectionId}
        />
      </MapboxGL.MapView>

      <Flex position="absolute" top={top} left={0} right={0} pt={1}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <Flex flexDirection="row" px={2} gap={1}>
            {pills.map((pill) => (
              <Pill
                key={pill.id}
                selected={selectedSectionId === pill.id}
                onPress={() => setSelectedSectionId(pill.id)}
              >
                {pill.title}
              </Pill>
            ))}
          </Flex>
        </ScrollView>

        <Spacer y={1} />

        <Text testID="itinerary-map-stop-count" variant="xs" px={2}>
          {visible.length} stops
        </Text>
      </Flex>
    </Flex>
  )
}
