import { Flex, Pill, useScreenDimensions, useSpace } from "@artsy/palette-mobile"
import MapboxGL, { ShapeSource } from "@rnmapbox/maps"
import { MapPins } from "app/Scenes/CityGuide/Components/Map/MapPins"
import { MapPreviewCard } from "app/Scenes/CityGuide/Components/Map/MapPreviewCard"
import { MapRoute } from "app/Scenes/CityGuide/Components/Map/MapRoute"
import {
  flattenMapSections,
  MapPlace,
  mapPlacesToGeoJSON,
  mapPlacesToRouteGeoJSON,
  MapSection,
} from "app/Scenes/CityGuide/Components/Map/utils/mapSectionsToGeoJSON"
import { matchClusterLeavesToPlaces } from "app/Scenes/CityGuide/Components/Map/utils/matchClusterLeavesToPlaces"
import { BOUNDS_PADDING, PREVIEW_BOTTOM_OFFSET } from "app/Scenes/CityGuide/utils/constants"
import { ArtsyMapStyleURL, configureMapbox } from "app/utils/mapbox"
import { useEffect, useMemo, useRef, useState } from "react"
import { Platform, ScrollView } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

configureMapbox()

const ALL_PILL_ID = "__all__"
/** Roughly 200m. Below this, fitting bounds over-zooms rather than framing a place. */
const MIN_BOUNDS_SPAN = 0.002
const SINGLE_STOP_ZOOM = 14

interface Props {
  sections: MapSection[]
  /** Owned by the caller so a list-view "Show on map" action can preselect a pin. */
  selectedPlaceId: string | null
  onSelectPlace: (placeId: string) => void
  /**
   * Off by default. The itinerary map turns this on; event maps show plain pins. See
   * `MapPins` for how clustering reacts to it.
   */
  numbered?: boolean
  /**
   * Off by default. Only the itinerary map draws a route, and only within a single
   * section — across the whole map the line would jump between sections and imply an
   * order nobody walks. The caller decides whether the feature is available at all (the
   * itinerary gates this on `AREnableCityGuideItineraryRoute`); this component decides
   * only whether one section is selected.
   */
  showRoute?: boolean
  /**
   * Extra space above the pill overlay, on top of the safe-area inset. Defaults to 60,
   * the value tuned for the itinerary map, which runs `<Screen safeArea={false}>` with no
   * native or in-flow header of its own — the pills are the topmost thing on screen, so
   * they need this much clearance from the status bar. A screen whose own header already
   * occupies the space above the map (a solid `Screen.Header`, or a native stack header)
   * should pass a smaller value, or 0, rather than inherit this one.
   */
  pillsTopOffset?: number
  /**
   * Off by default, where the pill overlay starts at a flat `space(2)` from the top of the
   * map. Turn it on for a map that runs full bleed under the status bar — the itinerary's
   * does, via `<Screen safeArea={false}>` — and the overlay starts at the safe-area inset
   * instead, so the pills clear the status bar rather than sitting under it. Stacks with
   * `pillsTopOffset`, which pads the overlay further down from wherever this puts it.
   */
  safeArea?: boolean
}

export const MapView: React.FC<Props> = ({
  sections,
  selectedPlaceId,
  onSelectPlace,
  numbered = false,
  showRoute = false,
  pillsTopOffset = 60,
  safeArea = false,
}) => {
  const [selectedSectionId, setSelectedSectionId] = useState(ALL_PILL_ID)
  const [isMapLoaded, setIsMapLoaded] = useState(false)
  const [overlayHeight, setOverlayHeight] = useState(0)
  // The tapped cluster: its id (for recolouring its own circle purple) and the places it
  // contains (for the rail). Kept as one state so the two can never drift apart — a
  // separate id state alongside the places would be a second, parallel place to track
  // the same selection.
  const [clusterSelection, setClusterSelection] = useState<{
    clusterId: number
    places: MapPlace[]
  } | null>(null)
  const cameraRef = useRef<MapboxGL.Camera>(null)
  const shapeSourceRef = useRef<ShapeSource>(null)
  // Bumped on every cluster tap and on dismissal, so a `getClusterLeaves` promise that
  // resolves after the user has already moved on — tapped another cluster, or dismissed
  // the rail — is recognised as stale and doesn't overwrite newer state.
  const clusterRequestIdRef = useRef(0)
  const { top } = useSafeAreaInsets()
  const { width: screenWidth } = useScreenDimensions()
  const space = useSpace()
  const flattened = useMemo(() => flattenMapSections(sections), [sections])

  const visible = useMemo(
    () =>
      selectedSectionId === ALL_PILL_ID
        ? flattened
        : flattened.filter((f) => f.sectionId === selectedSectionId),
    [flattened, selectedSectionId]
  )

  // Built from the visible places only, never filtered at the layer. The converter numbers
  // by position, so a filtered section renumbers from 1.
  const collection = useMemo(() => mapPlacesToGeoJSON(visible, { numbered }), [visible, numbered])

  const selectedPlace = visible.find((f) => f.place.id === selectedPlaceId)?.place

  const dismissClusterRail = () => {
    // Invalidates any in-flight getClusterLeaves lookup too, so a late resolution can't
    // bring the rail back after the user has dismissed it.
    clusterRequestIdRef.current += 1
    setClusterSelection(null)
  }

  // Reused by both a direct pin tap and a rail card tap, so selecting a card behaves
  // exactly like selecting its pin — one path, not two.
  const handleSelectPlace = (placeId: string) => {
    dismissClusterRail()
    onSelectPlace(placeId)
  }

  const handleSelectCluster = async (feature: any) => {
    const pointCount = feature?.properties?.point_count
    const clusterId = feature?.properties?.cluster_id

    if (!shapeSourceRef.current || !pointCount || clusterId == null) return

    const requestId = ++clusterRequestIdRef.current

    // Defensive parsing: getClusterLeaves' return type varies by platform (CityGuideMap.tsx
    // copies the same handling, since that map is frozen).
    const leaves = await shapeSourceRef.current.getClusterLeaves(feature, pointCount, 0)
    const parsed = typeof leaves === "string" ? JSON.parse(leaves) : leaves
    const leafFeatures: any[] = Array.isArray(parsed) ? parsed : parsed?.features ?? []

    // A newer cluster tap, or a dismissal, happened while this was in flight.
    if (requestId !== clusterRequestIdRef.current) return

    const places = matchClusterLeavesToPlaces(
      leafFeatures,
      visible.map((f) => f.place)
    )

    setClusterSelection({ clusterId, places })
  }

  const routeCollection = useMemo(
    () =>
      showRoute && selectedSectionId !== ALL_PILL_ID
        ? mapPlacesToRouteGeoJSON(visible)
        : { type: "FeatureCollection" as const, features: [] },
    [showRoute, selectedSectionId, visible]
  )

  const cameraStop = useMemo(() => {
    if (!visible.length) return undefined

    const lngs = visible.map((f) => f.place.coordinates.lng)
    const lats = visible.map((f) => f.place.coordinates.lat)
    const minLng = Math.min(...lngs)
    const maxLng = Math.max(...lngs)
    const minLat = Math.min(...lats)
    const maxLat = Math.max(...lats)

    // One place — or several at the same address — gives a zero-size box, and fitting to
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
    ...sections.map((section) => ({ id: section.id, title: section.title })),
  ]

  return (
    <Flex flex={1}>
      <MapboxGL.MapView
        style={{ flex: 1 }}
        styleURL={ArtsyMapStyleURL}
        logoEnabled={false}
        attributionEnabled={false}
        onDidFinishLoadingMap={() => setIsMapLoaded(true)}
        // Tapping empty map dismisses the rail, the same way tapping empty map dismisses
        // the frozen City Guide map's selection (CityGuideMap.tsx's onPressMap).
        onPress={dismissClusterRail}
        scaleBarPosition={{
          top: overlayHeight + (Platform.OS === "ios" ? space(2) : top),
          left: space(2),
        }}
      >
        <MapboxGL.Camera
          ref={cameraRef}
          animationMode="moveTo"
          defaultSettings={initialCameraStop}
        />

        <MapRoute collection={routeCollection} />

        <MapPins
          collection={collection}
          selectedPlaceId={selectedPlaceId}
          onSelectPlace={handleSelectPlace}
          numbered={numbered}
          onSelectCluster={handleSelectCluster}
          shapeSourceRef={shapeSourceRef}
          activeClusterId={clusterSelection?.clusterId}
        />
      </MapboxGL.MapView>

      <Flex
        position="absolute"
        top={safeArea ? top : 2}
        left={0}
        right={0}
        style={{ paddingTop: pillsTopOffset }}
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
                  onPress={() => {
                    // Filtering can drop places the rail is currently showing.
                    dismissClusterRail()
                    setSelectedSectionId(pill.id)
                  }}
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
        -60 translate. selectedPlace comes from the visible set, so switching filters
        away from the selected pin drops its card too. Hidden while the cluster rail is
        up, so the two overlays are never shown at once.
      */}
      {!!selectedPlace && !clusterSelection && (
        <Flex position="absolute" bottom={PREVIEW_BOTTOM_OFFSET} left={0} right={0}>
          <MapPreviewCard place={selectedPlace} />
        </Flex>
      )}

      {/*
        The cluster's contents, revealed rather than zoomed into (see MapPins'
        onSelectCluster). One card type reused from the single-pin preview above —
        `disableNavigation` plus `onPress` makes tapping a card select that place instead
        of navigating straight off the map, matching a direct pin tap.
      */}
      {!!clusterSelection && (
        <Flex position="absolute" bottom={PREVIEW_BOTTOM_OFFSET} left={0} right={0}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <Flex flexDirection="row">
              {clusterSelection.places.map((place, index) => (
                // Fixed width: the single-card usage above relies on the absolute-positioned
                // parent (left:0, right:0) to size it, which a horizontal ScrollView doesn't
                // provide.
                <Flex key={place.id} width={screenWidth - 2 * space(2)}>
                  <MapPreviewCard
                    isLast={index === clusterSelection.places.length - 1}
                    place={place}
                    disableNavigation
                    onPress={() => handleSelectPlace(place.id)}
                  />
                </Flex>
              ))}
            </Flex>
          </ScrollView>
        </Flex>
      )}
    </Flex>
  )
}
