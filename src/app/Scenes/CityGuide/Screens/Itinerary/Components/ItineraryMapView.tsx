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
  const [isMapLoaded, setIsMapLoaded] = useState(false)
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

  const bounds = useMemo(() => {
    if (!visible.length) return undefined

    const lngs = visible.map((f) => f.stop.coordinates.lng)
    const lats = visible.map((f) => f.stop.coordinates.lat)

    return {
      ne: [Math.max(...lngs), Math.max(...lats)] as [number, number],
      sw: [Math.min(...lngs), Math.min(...lats)] as [number, number],
      paddingTop: BOUNDS_PADDING,
      paddingBottom: BOUNDS_PADDING,
      paddingLeft: BOUNDS_PADDING,
      paddingRight: BOUNDS_PADDING,
    }
  }, [visible])

  // The very first frame comes from defaultSettings, not from the effect below: on mount
  // the camera ref is not attached yet, so an imperative setCamera silently no-ops and the
  // map opens on Mapbox's default world view until something else moves it.
  const initialBounds = useRef(bounds).current

  // Refit on later changes only, and only once the map is ready — same gating as
  // CityGuideMap.tsx:89,207,317. Without the mapLoaded gate this fires too early and is lost.
  useEffect(() => {
    if (!isMapLoaded || !bounds) return

    cameraRef.current?.setCamera({ ...bounds, animationDuration: 500 })
  }, [bounds, isMapLoaded])

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
        onDidFinishLoadingMap={() => setIsMapLoaded(true)}
      >
        <MapboxGL.Camera
          ref={cameraRef}
          animationMode="moveTo"
          defaultSettings={initialBounds ? { bounds: initialBounds } : undefined}
        />

        <ItineraryMapPins
          collection={collection}
          selectedSectionId={selectedSectionId === ALL_PILL_ID ? null : selectedSectionId}
        />
      </MapboxGL.MapView>

      <Flex position="absolute" top={top} left={0} right={0} pt={1}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <Flex flexDirection="row" px={2} gap={1}>
            {pills.map((pill) => {
              const isSelected = selectedSectionId === pill.id

              return (
                <Pill
                  key={pill.id}
                  variant="filter"
                  selected={isSelected}
                  // Set explicitly: the default Pill state declares no background-color at
                  // all, so over a map the pills would be see-through and unreadable.
                  backgroundColor={isSelected ? "mono100" : "mono0"}
                  color={isSelected ? "mono0" : "mono100"}
                  onPress={() => setSelectedSectionId(pill.id)}
                >
                  {pill.title}
                </Pill>
              )
            })}
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
