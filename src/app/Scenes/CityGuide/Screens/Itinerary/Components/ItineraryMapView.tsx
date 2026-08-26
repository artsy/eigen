import { Flex, Pill } from "@artsy/palette-mobile"
import MapboxGL from "@rnmapbox/maps"
import { ItineraryMapPins } from "app/Scenes/CityGuide/Screens/Itinerary/Components/ItineraryMapPins"
import { ItineraryMapPreview } from "app/Scenes/CityGuide/Screens/Itinerary/Components/ItineraryMapPreview"
import { ItineraryMapRoute } from "app/Scenes/CityGuide/Screens/Itinerary/Components/ItineraryMapRoute"
import {
  flattenItineraryStops,
  itineraryStopsToGeoJSON,
  itineraryStopsToRouteGeoJSON,
} from "app/Scenes/CityGuide/Screens/Itinerary/utils/itineraryStopsToGeoJSON"
import { Itinerary } from "app/Scenes/CityGuide/Screens/Itinerary/utils/itineraryTypes"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { ArtsyMapStyleURL, configureMapbox } from "app/utils/mapbox"
import { useEffect, useMemo, useRef, useState } from "react"
import { Platform, ScrollView } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

configureMapbox()

const ALL_PILL_ID = "__all__"
const BOUNDS_PADDING = 60
/** Roughly 200m. Below this, fitting bounds over-zooms rather than framing a place. */
const MIN_BOUNDS_SPAN = 0.002
const SINGLE_STOP_ZOOM = 14
/** Breathing room between the pill overlay and the scale bar below it. */
const SCALE_BAR_GAP = 8
/** Clears the floating list/map toggle, which sits ~10pt off the bottom. */
const PREVIEW_BOTTOM_OFFSET = 70
/** Close enough to separate two stops sharing one venue. */
const CLUSTER_EXPAND_ZOOM = 17

export const ItineraryMapView: React.FC<{ itinerary: Itinerary }> = ({ itinerary }) => {
  const [selectedSectionId, setSelectedSectionId] = useState(ALL_PILL_ID)
  const [isMapLoaded, setIsMapLoaded] = useState(false)
  const [overlayHeight, setOverlayHeight] = useState(0)
  const [selectedStopId, setSelectedStopId] = useState<string | null>(null)
  const cameraRef = useRef<MapboxGL.Camera>(null)
  const { top } = useSafeAreaInsets()
  const showRoute = useFeatureFlag("AREnableCityGuideItineraryRoute")

  const flattened = useMemo(() => flattenItineraryStops(itinerary), [itinerary])

  const visible = useMemo(
    () =>
      selectedSectionId === ALL_PILL_ID
        ? flattened
        : flattened.filter((f) => f.sectionId === selectedSectionId),
    [flattened, selectedSectionId]
  )

  // Built from the visible stops only, never filtered at the layer. The converter numbers
  // by position, so a filtered section renumbers from 1.
  const collection = useMemo(() => itineraryStopsToGeoJSON(visible), [visible])

  const selectedStop = visible.find((f) => f.stop.id === selectedStopId)?.stop

  // Only within a single section: across the whole itinerary the line would jump
  // between days and imply an order nobody walks.
  const routeCollection = useMemo(
    () =>
      showRoute && selectedSectionId !== ALL_PILL_ID
        ? itineraryStopsToRouteGeoJSON(visible)
        : { type: "FeatureCollection" as const, features: [] },
    [showRoute, selectedSectionId, visible]
  )

  const cameraStop = useMemo(() => {
    if (!visible.length) return undefined

    const lngs = visible.map((f) => f.stop.coordinates.lng)
    const lats = visible.map((f) => f.stop.coordinates.lat)
    const minLng = Math.min(...lngs)
    const maxLng = Math.max(...lngs)
    const minLat = Math.min(...lats)
    const maxLat = Math.max(...lats)

    // One stop — or several at the same address — gives a zero-size box, and fitting to
    // that zooms Mapbox all the way in on a rooftop. Centre at a readable zoom instead.
    if (maxLng - minLng < MIN_BOUNDS_SPAN && maxLat - minLat < MIN_BOUNDS_SPAN) {
      return {
        centerCoordinate: [(minLng + maxLng) / 2, (minLat + maxLat) / 2] as [number, number],
        zoomLevel: SINGLE_STOP_ZOOM,
      }
    }

    return {
      bounds: {
        ne: [maxLng, maxLat] as [number, number],
        sw: [minLng, minLat] as [number, number],
        paddingTop: BOUNDS_PADDING + overlayHeight,
        paddingBottom: BOUNDS_PADDING,
        paddingLeft: BOUNDS_PADDING,
        paddingRight: BOUNDS_PADDING,
      },
    }
  }, [visible, overlayHeight])

  // The very first frame comes from defaultSettings, not from the effect below: on mount
  // the camera ref is not attached yet, so an imperative setCamera silently no-ops and the
  // map opens on Mapbox's default world view until something else moves it.
  const initialCameraStop = useRef(cameraStop).current

  // Refit on later changes only, and only once the map is ready — same gating as
  // CityGuideMap.tsx:89,207,317. Without the mapLoaded gate this fires too early and is lost.
  useEffect(() => {
    if (!isMapLoaded || !cameraStop) return

    cameraRef.current?.setCamera({ ...cameraStop, animationDuration: 500 })
  }, [cameraStop, isMapLoaded])

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
        scaleBarPosition={{
          top: overlayHeight + (Platform.OS === "ios" ? 0 : top),
          left: SCALE_BAR_GAP,
        }}
      >
        <MapboxGL.Camera
          ref={cameraRef}
          animationMode="moveTo"
          defaultSettings={initialCameraStop}
        />

        <ItineraryMapRoute collection={routeCollection} />

        <ItineraryMapPins
          collection={collection}
          selectedStopId={selectedStopId}
          onSelectStop={setSelectedStopId}
          onSelectCluster={(centerCoordinate) => {
            cameraRef.current?.setCamera({
              centerCoordinate,
              zoomLevel: CLUSTER_EXPAND_ZOOM,
              animationDuration: 400,
            })
          }}
        />
      </MapboxGL.MapView>

      <Flex
        position="absolute"
        top={top}
        left={0}
        right={0}
        style={{ paddingTop: 60 }}
        // Measured rather than hardcoded so the scale bar clears the pills on every
        // device, whatever the safe-area inset and font scale work out to.
        onLayout={(event) => setOverlayHeight(event.nativeEvent.layout.height)}
      >
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <Flex flexDirection="row" px={2} gap={1}>
            {pills.map((pill) => {
              const isSelected = selectedSectionId === pill.id

              return (
                <Pill
                  key={pill.id}
                  // "link" rather than the default variant: the default state declares no
                  // background-color at all, so over a map the pills are see-through.
                  variant="link"
                  selected={isSelected}
                  color={isSelected ? "mono0" : "mono100"}
                  onPress={() => setSelectedSectionId(pill.id)}
                >
                  {pill.title}
                </Pill>
              )
            })}
          </Flex>
        </ScrollView>
      </Flex>

      {/*
        Sits above the list/map toggle, which the screen renders at bottom -50 with a
        -60 translate. selectedStop comes from the visible set, so switching filters
        away from the selected pin drops its card too.
      */}
      {!!selectedStop && (
        <Flex position="absolute" bottom={PREVIEW_BOTTOM_OFFSET} left={0} right={0}>
          <ItineraryMapPreview stop={selectedStop} />
        </Flex>
      )}
    </Flex>
  )
}
