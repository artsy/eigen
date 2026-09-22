import { Flex, Pill, useScreenDimensions, useSpace } from "@artsy/palette-mobile"
import MapboxGL, { ShapeSource } from "@rnmapbox/maps"
import { MapPins } from "app/Scenes/CityGuide/Components/Map/MapPins"
import { MapPreviewCard } from "app/Scenes/CityGuide/Components/Map/MapPreviewCard"
import {
  flattenMapSections,
  MapPlace,
  mapPlacesToGeoJSON,
  MapSection,
} from "app/Scenes/CityGuide/Components/Map/utils/mapSectionsToGeoJSON"
import { matchClusterLeavesToPlaces } from "app/Scenes/CityGuide/Components/Map/utils/matchClusterLeavesToPlaces"
import { BOUNDS_PADDING, PREVIEW_BOTTOM_OFFSET } from "app/Scenes/CityGuide/utils/constants"
import { ArtsyMapStyleURL, configureMapbox } from "app/utils/mapbox"
import { useEffect, useMemo, useRef, useState } from "react"
import { ScrollView } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

configureMapbox()

const ALL_PILL_ID = "__all__"
/** Roughly 200m. Below this, fitting bounds over-zooms rather than framing a place. */
const MIN_BOUNDS_SPAN = 0.002
const SINGLE_STOP_ZOOM = 14

interface Props {
  sections: MapSection[]
  /** The city this map belongs to, threaded down to the pin-tap preview card's tracking. */
  citySlug: string
  /** Owned by the caller so a list-view "Show on map" action can preselect a pin. */
  selectedPlaceId: string | null
  onSelectPlace: (placeId: string) => void
  /**
   * Off by default. The itinerary map turns this on; event maps show plain pins. See
   * `MapPins` for how clustering reacts to it.
   */
  numbered?: boolean
  /**
   * Extra space above the pill overlay, on top of the safe-area inset. Defaults to 60, tuned
   * for the itinerary map's headerless screen — pass less (or 0) when the screen has its own header.
   */
  pillsTopOffset?: number
  /**
   * Off by default, where the pill overlay starts at a flat `space(2)`. Turn it on for a map
   * that runs full bleed under the status bar, so the overlay starts at the safe-area inset instead.
   */
  safeArea?: boolean
}

export const MapView: React.FC<Props> = ({
  sections,
  citySlug,
  selectedPlaceId,
  onSelectPlace,
  numbered = false,
  pillsTopOffset = 60,
  safeArea = false,
}) => {
  const [selectedSectionId, setSelectedSectionId] = useState(ALL_PILL_ID)
  const [isMapLoaded, setIsMapLoaded] = useState(false)
  // Only remaining use is the camera bounds' paddingTop below: how much of an overlay sits
  // on top of the map that fitted pins need clearance from. 0 until the pills row renders
  // and measures itself — a single-section itinerary never renders that row (see
  // `showPills`), and correctly has no overlay to clear. Previously also fed the scale
  // bar's top offset, which needed `pillsTopOffset` as a floor before the pills row
  // measured anything bigger; now moot, since the scale bar is disabled outright below.
  const [overlayHeight, setOverlayHeight] = useState(0)
  // The tapped cluster's id (to recolour its circle) and places (for the rail), kept as one
  // state so the two can never drift apart.
  const [clusterSelection, setClusterSelection] = useState<{
    clusterId: number
    places: MapPlace[]
  } | null>(null)
  const cameraRef = useRef<MapboxGL.Camera>(null)
  const shapeSourceRef = useRef<ShapeSource>(null)
  // Bumped on every cluster tap and dismissal, so a stale `getClusterLeaves` promise that
  // resolves after the user moved on doesn't overwrite newer state.
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
        // `top` (the safe-area inset) clears the notch/Dynamic Island even when there's no
        // pills row yet to push pins down (e.g. a single-section itinerary shows no pills).
        paddingTop: BOUNDS_PADDING + top + overlayHeight,
        paddingBottom: BOUNDS_PADDING,
        paddingLeft: BOUNDS_PADDING,
        paddingRight: BOUNDS_PADDING,
      },
    }
  }, [visible, overlayHeight, top])

  // The first frame comes from defaultSettings, not the effect below — on mount the camera
  // ref isn't attached yet, so an imperative setCamera silently no-ops.
  const initialCameraStop = useRef(cameraStop).current

  // Refit on later changes only, and only once the map is ready — same gating as
  // CityGuideMap.tsx:89,207,317. Without the mapLoaded gate this fires too early and is lost.
  useEffect(() => {
    if (!isMapLoaded || !cameraStop) return

    cameraRef.current?.setCamera({ ...cameraStop, animationDuration: 500 })
  }, [cameraStop, isMapLoaded])

  // A section with no pins on it is nothing to filter to — its pill would only ever clear the
  // map. An itinerary section whose every stop lacks coordinates arrives here like this.
  const filterableSections = sections.filter((section) => section.places.length > 0)

  const pills = [
    { id: ALL_PILL_ID, title: "All" },
    ...filterableSections.map((section) => ({ id: section.id, title: section.title })),
  ]

  // One section is nothing to filter between: "All" and that section show the same pins, so
  // the row is a control with no effect.
  const showPills = filterableSections.length > 1

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
        scaleBarEnabled={false}
      >
        <MapboxGL.Camera
          ref={cameraRef}
          animationMode="moveTo"
          defaultSettings={initialCameraStop}
        />

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

      {!!showPills && (
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
      )}

      {/*
        Sits above the list/map toggle (bottom -50, -60 translate). Hidden while the cluster
        rail is up, so the two overlays are never shown at once.
      */}
      {!!selectedPlace && !clusterSelection && (
        <Flex position="absolute" bottom={PREVIEW_BOTTOM_OFFSET} left={0} right={0}>
          <MapPreviewCard place={selectedPlace} citySlug={citySlug} />
        </Flex>
      )}

      {/*
        The cluster's contents, revealed rather than zoomed into. `onPress` keeps the selected
        pin in sync (so back-navigation lands on the right one still highlighted); the card's
        own `href` navigates straight there on a single tap, same as any other card.
      */}
      {!!clusterSelection && (
        <Flex position="absolute" bottom={PREVIEW_BOTTOM_OFFSET} left={0}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <Flex flexDirection="row">
              {clusterSelection.places.map((place, index) => {
                const clusterLength = clusterSelection.places.length

                const width = screenWidth - 2 * space(2)
                return (
                  // Fixed width: the single-card usage above relies on the absolute-positioned
                  // parent to size it, which a horizontal ScrollView doesn't provide.
                  <Flex key={place.id} width={width}>
                    <MapPreviewCard
                      isLast={index === clusterLength - 1}
                      place={place}
                      citySlug={citySlug}
                      onPress={() => handleSelectPlace(place.id)}
                    />
                  </Flex>
                )
              })}
            </Flex>
          </ScrollView>
        </Flex>
      )}
    </Flex>
  )
}
