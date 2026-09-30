import { OwnerType } from "@artsy/cohesion"
import { Flex, useColor, useSpace } from "@artsy/palette-mobile"
import MapboxGL from "@rnmapbox/maps"
import { CityGuideFair_fair$key } from "__generated__/CityGuideFair_fair.graphql"
import { CityGuideMap_viewer$key } from "__generated__/CityGuideMap_viewer.graphql"
import { CityGuideShow_show$key } from "__generated__/CityGuideShow_show.graphql"
import { AddToItineraryProvider } from "app/Scenes/CityGuide/Components/AddToItinerarySheet/AddToItineraryProvider"
import { CityFilterPills } from "app/Scenes/CityGuide/Components/CityFilterPills"
import {
  CityGuideBottomSheet,
  COLLAPSED_SHEET_HEIGHT,
} from "app/Scenes/CityGuide/Components/CityGuideBottomSheet"
import { CityData, CityGuideCityPicker } from "app/Scenes/CityGuide/Components/CityGuideCityPicker"
import { CityGuideMapHeader } from "app/Scenes/CityGuide/Components/CityGuideMapHeader"
import { CityGuideMapPins } from "app/Scenes/CityGuide/Components/CityGuideMapPins"
import { MapPreviewCard } from "app/Scenes/CityGuide/Components/Map/MapPreviewCard"
import { MapPreviewCardRail } from "app/Scenes/CityGuide/Components/Map/MapPreviewCardRail"
import { cityGuideFairFragment } from "app/Scenes/CityGuide/utils/CityGuideFair"
import { cityGuideShowFragment } from "app/Scenes/CityGuide/utils/CityGuideShow"
import { activeItemsToMapPlaces } from "app/Scenes/CityGuide/utils/activeItemsToMapPlaces"
import { bucketCityResults, BucketResults } from "app/Scenes/CityGuide/utils/bucketCityResults"
import { buildFeatureCollections } from "app/Scenes/CityGuide/utils/buildFeatureCollections"
import { cityTabs } from "app/Scenes/CityGuide/utils/cityTabs"
import { PREVIEW_BOTTOM_OFFSET } from "app/Scenes/CityGuide/utils/constants"
import { EventEmitter } from "app/Scenes/CityGuide/utils/eventEmitter"
import { extractShowAndFairMaps } from "app/Scenes/CityGuide/utils/extractShowAndFairMaps"
import { getNearestFeatureToTap } from "app/Scenes/CityGuide/utils/getNearestFeatureToTap"
import { isValidLatLng } from "app/Scenes/CityGuide/utils/isValidLatLng"
import {
  DefaultZoomLevel,
  MaxZoomLevel,
  MinZoomLevel,
} from "app/Scenes/CityGuide/utils/mapZoomLevels"
import { MAX_GRAPHQL_INT } from "app/Scenes/CityGuide/utils/maxGraphQLInt"
import { DrawerPosition, Fair, MapTab, Show } from "app/Scenes/CityGuide/utils/types"
import { GlobalStore } from "app/store/GlobalStore"
import { extractNodes } from "app/utils/extractNodes"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { ArtsyMapStyleURL, configureMapbox } from "app/utils/mapbox"
import { ProvideScreenTracking, Schema } from "app/utils/track"
import React, { useEffect, useMemo, useRef, useState, useTransition } from "react"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { graphql, useFragment, useRefetchableFragment } from "react-relay"
import { useTracking } from "react-tracking"

configureMapbox()

interface Props {
  /** city slug */
  citySlug: string
  cities: CityData[]
  // TODO: Rethink this
  /** Error from Relay (CityGuideMapQueryRenderer.tsx). Needed here to send over the EventEmitter. */
  // relayErrorState?: RelayErrorState
  /** The viewer data */
  viewer: CityGuideMap_viewer$key
}

export const CityGuideMap: React.FC<Props> = (props) => {
  const color = useColor()
  const space = useSpace()
  const safeAreaInsets = useSafeAreaInsets()

  const [viewer, refetch] = useRefetchableFragment(cityGuideMapFragment, props.viewer)
  const [isLoadingCity, startLoadingCity] = useTransition()
  const [loadingCityName, setLoadingCityName] = useState<string>()
  const { trackEvent } = useTracking()

  const showRefs: CityGuideShow_show$key = extractNodes(viewer.city?.shows)
  const upcomingShowRefs: CityGuideShow_show$key = extractNodes(viewer.city?.upcomingShows)
  const fairRefs: CityGuideFair_fair$key = extractNodes(viewer.city?.fairs)
  const shows = useFragment(cityGuideShowFragment, showRefs)
  const upcomingShows = useFragment(cityGuideShowFragment, upcomingShowRefs)
  const fairs = useFragment(cityGuideFairFragment, fairRefs)

  const mapRef = useRef<MapboxGL.MapView>(null)
  const cameraRef = useRef<MapboxGL.Camera>(null)
  const shapeSourceRef = useRef<MapboxGL.ShapeSource>(null)
  const cameraCitySlugRef = useRef(props.citySlug)
  const parentCitySlugRef = useRef(props.citySlug)
  const currentZoomRef = useRef(DefaultZoomLevel)
  const showsRef = useRef<{ [key: string]: Show }>({})
  const fairsRef = useRef<{ [key: string]: Fair }>({})

  const [activeShows, setActiveShows] = useState<Array<Fair | Show>>([])
  const [activeIndex, setActiveIndex] = useState(0)
  const currentLocation = viewer.city?.coordinates
  const [userLocation, setUserLocation] = useState(currentLocation)

  // Derived from the fragment data rather than held in state, so that a show being saved anywhere
  // else in the app re-buckets the results and repaints its pin with the saved variant.
  const bucketResults = useMemo(
    () => bucketCityResults(shows, upcomingShows, fairs),
    [shows, upcomingShows, fairs]
  )
  const featureCollections = useMemo(() => buildFeatureCollections(bucketResults), [bucketResults])

  const [mapLoaded, setMapLoaded] = useState(false)
  const [activePin, setActivePin] = useState<GeoJSON.Feature | null>(null)
  const [showCityPicker, setShowCityPicker] = useState(false)
  const [drawerPosition, setDrawerPosition] = useState<DrawerPosition>(DrawerPosition.closed)

  const enableGlobalMapList = useFeatureFlag("AREnableCityGuideItineraries")

  useEffect(() => {
    EventEmitter.subscribe("filters:change", handleFilterChange)
    return () => {
      EventEmitter.unsubscribe("filters:change", handleFilterChange)
    }
  }, [])

  // The parent can switch city too (e.g. a late location fix), and the camera only reads its
  // `defaultSettings` on mount. A new cities array must not replay the parent's old slug
  // while a picker selection is loading.
  useEffect(() => {
    if (props.citySlug === parentCitySlugRef.current) {
      return
    }
    const coordinates = props.cities.find((city) => city.slug === props.citySlug)?.coordinates
    if (coordinates) {
      parentCitySlugRef.current = props.citySlug
      if (props.citySlug !== cameraCitySlugRef.current) {
        flyToCity(props.citySlug, coordinates)
      }
    }
  }, [props.citySlug, props.cities])

  useEffect(() => {
    updateShowIdMap()
    emitFilteredBucketResults(bucketResults)
  }, [bucketResults])

  const onPressCitySwitcherButton = () => {
    if (!showCityPicker) {
      // Show the city picker
      setShowCityPicker(true)
      setActiveShows([])
      setActivePin(null)
    } else {
      // Hide the city picker
      setShowCityPicker(false)
    }
  }

  const onPressUserPositionButton = () => {
    if (!isValidLatLng(userLocation)) {
      return
    }

    cameraRef.current?.setCamera({
      centerCoordinate: [userLocation.lng, userLocation.lat],
      zoomLevel: DefaultZoomLevel,
      animationDuration: 500,
    })
  }

  const handleFilterChange = (activeIndex: number) => {
    setActiveIndex(activeIndex)
    setActivePin(null)
    setActiveShows([])
  }

  const handleSelectMapFilterPill = (tab: MapTab) => {
    const index = cityTabs.findIndex((cityTab) => cityTab.id === tab.id)

    if (index === -1) {
      return
    }

    trackFilterPillTap(tab.id)

    // Dispatch through the EventEmitter (rather than calling handleFilterChange directly) so
    // there's exactly one path into the filter state — a tab press elsewhere and a pill press
    // both stay in sync for free.
    EventEmitter.dispatch("filters:change", index)
  }

  // Mirrors CityGuideTabs' trackTab, which fires the same event for the bottom-sheet tabs.
  // context_module distinguishes a pill press from a tab press on the same underlying filter.
  const trackFilterPillTap = (filter: MapTab["id"]) => {
    let actionName
    switch (filter) {
      case "all":
        actionName = Schema.ActionNames.AllTab
        break
      case "saved":
        actionName = Schema.ActionNames.SavedTab
        break
      case "fairs":
        actionName = Schema.ActionNames.FairsTab
        break
      case "galleries":
        actionName = Schema.ActionNames.GalleriesTab
        break
      case "museums":
        actionName = Schema.ActionNames.MuseumsTab
        break
      default:
        actionName = null
        break
    }
    if (actionName) {
      trackEvent(tracks.trackFilterPillTap(actionName))
    }
  }

  const trackPinTap = (actionName: string, show: any, type: string) => {
    trackEvent(tracks.trackPinTap(actionName, show, type))
  }

  const emitFilteredBucketResults = (newBucketResults: BucketResults) => {
    if (!viewer) {
      return
    }

    const filter = cityTabs[activeIndex]

    const cityName = viewer.city?.name
    const citySlug = viewer.city?.slug

    EventEmitter.dispatch("map:change", {
      filter,
      buckets: newBucketResults,
      cityName,
      citySlug,
    })
  }

  const updateShowIdMap = () => {
    if (!viewer) {
      return
    }

    const { shows: showsById, fairs: fairsById } = extractShowAndFairMaps(
      shows,
      upcomingShows,
      fairs
    )
    showsRef.current = { ...showsRef.current, ...showsById }
    fairsRef.current = { ...fairsRef.current, ...fairsById }
  }

  const onUserLocationUpdate = (location: MapboxGL.Location) => {
    const coords = location?.coords

    // The native side can send an empty `coords` object before the first location fix (and for
    // heading-only updates); guard so we don't build a location out of `undefined`s and crash.
    if (typeof coords?.latitude !== "number" || typeof coords?.longitude !== "number") {
      return
    }

    setUserLocation(longCoordsToLocation(coords))
  }

  const onRegionIsChanging = async () => {
    if (!mapRef.current) {
      return
    }
    const zoom = Math.ceil((await mapRef.current.getZoom()) ?? DefaultZoomLevel)

    if (currentZoomRef.current !== zoom) {
      setActivePin(null)
    }

    currentZoomRef.current = zoom
  }

  const onPressMap = () => {
    setActiveShows([])
    setActivePin(null)
  }

  const onDidFinishLoadingMap = () => {
    setMapLoaded(true)
  }

  const { setPreviouslySelectedCitySlug } = GlobalStore.actions.userPrefs

  const { city } = viewer
  const centerLat = city?.coordinates?.lat || 0
  const centerLng = city?.coordinates?.lng || 0

  const mapProps = {
    styleURL: ArtsyMapStyleURL,
    userTrackingMode: MapboxGL.UserTrackingModes.Follow,
    logoEnabled: !!city,
    attributionEnabled: false,
    compassEnabled: false,
  }

  /** Maps a pin's (or cluster leaf's) GeoJSON properties back to the show or fair it was built from. */
  const featurePropertiesToShow = (properties: any): Fair | Show | null => {
    if (!properties?.slug) {
      return null
    }

    // The live Relay records, which the cards need for fragment data and save mutations.
    if (properties.type === "Fair") {
      return fairsRef.current[properties.slug] ?? null
    }
    return showsRef.current[properties.slug] ?? null
  }

  const handleFeaturePress = async (event: any) => {
    const feature: any = getNearestFeatureToTap(event.features ?? [], event.coordinates)

    if (!feature) {
      return
    }

    const { cluster, type, point_count: pointCount } = feature.properties

    updateDrawerPosition(DrawerPosition.collapsed)

    let activeShows: Array<Fair | Show> = []

    if (!cluster) {
      const show = featurePropertiesToShow(feature.properties)
      activeShows = show ? [show] : []
      trackPinTap(
        Schema.ActionNames.SingleMapPin,
        activeShows,
        type === "Fair" ? Schema.OwnerEntityTypes.Fair : Schema.OwnerEntityTypes.Show
      )
    } else if (shapeSourceRef.current) {
      trackPinTap(Schema.ActionNames.ClusteredMapPin, null, Schema.OwnerEntityTypes.Show)

      // Mapbox is asked which points the tapped cluster contains, so the cards always match the
      // count drawn on the cluster.
      const leaves = await shapeSourceRef.current.getClusterLeaves(feature, pointCount, 0)
      const parsed = typeof leaves === "string" ? JSON.parse(leaves) : leaves
      const leafFeatures: any[] = Array.isArray(parsed) ? parsed : parsed?.features ?? []

      activeShows = leafFeatures
        .map((leaf) => featurePropertiesToShow(leaf?.properties))
        .filter((item): item is Fair | Show => item != null)
    }

    setActiveShows(activeShows)
    setActivePin(feature)
  }

  const updateDrawerPosition = (position: DrawerPosition) => {
    setDrawerPosition(position)
  }

  const flyToCity = (citySlug: string, coordinates: CityData["coordinates"]) => {
    cameraCitySlugRef.current = citySlug
    cameraRef.current?.setCamera({
      centerCoordinate: [coordinates.lng, coordinates.lat],
      zoomLevel: DefaultZoomLevel,
      animationMode: "flyTo",
      animationDuration: 2000,
    })
  }

  const onSelectCity = (newCity: CityData) => {
    setShowCityPicker(false)
    setLoadingCityName(newCity.name)
    flyToCity(newCity.slug, newCity.coordinates)

    // A transition keeps the current map on screen while the new city loads, rather than
    // suspending into the full-screen spinner.
    startLoadingCity(() => {
      refetch(
        { citySlug: newCity.slug, maxInt: MAX_GRAPHQL_INT },
        {
          // Saved only once the data is in the store: the parent derives its query from this
          // slug, and would otherwise suspend and fetch the city a second time.
          onComplete: (error) => {
            if (!error) {
              setPreviouslySelectedCitySlug(newCity.slug)
            }
          },
        }
      )
    })
  }

  // Follows the city picker: switching cities refetches `viewer.city` without new props.
  const cardCitySlug = viewer.city?.slug ?? props.citySlug
  const currentItemsById = useMemo(
    () => new Map([...shows, ...upcomingShows, ...fairs].map((item) => [item.id, item])),
    [shows, upcomingShows, fairs]
  )
  const activePlaces = useMemo(
    () =>
      activeItemsToMapPlaces(
        activeShows.map((item) => currentItemsById.get(item.id) ?? item),
        {
          contextScreenOwnerType: OwnerType.cityGuideMap,
          contextScreenOwnerSlug: cardCitySlug,
        }
      ),
    [activeShows, cardCitySlug, currentItemsById]
  )

  // Without the flag, a pin tap collapses the bottom sheet, which renders over the card.
  const previewBottomOffset = enableGlobalMapList
    ? PREVIEW_BOTTOM_OFFSET
    : COLLAPSED_SHEET_HEIGHT + safeAreaInsets.bottom

  const content = (
    <>
      <CityGuideMapHeader
        safeAreaInsetTop={safeAreaInsets.top}
        cityName={isLoadingCity ? loadingCityName : viewer.city?.name}
        userLocation={userLocation}
        currentLocation={currentLocation}
        onPressCitySwitcherButton={onPressCitySwitcherButton}
        onPressUserPositionButton={onPressUserPositionButton}
      />
      {!showCityPicker && (
        <CityFilterPills
          selectedTabId={cityTabs[activeIndex].id}
          onSelectTab={handleSelectMapFilterPill}
          bucketResults={bucketResults}
        />
      )}
      <CityGuideCityPicker
        cities={props.cities}
        showCityPicker={showCityPicker}
        setShowCityPicker={setShowCityPicker}
        selectedCity={city?.name ?? ""}
        onSelectCity={onSelectCity}
      />
      <Flex flexDirection="column" style={{ backgroundColor: color("mono5") }}>
        <MapboxGL.MapView
          ref={mapRef}
          style={{ width: "100%", height: "100%" }}
          {...mapProps}
          onCameraChanged={onRegionIsChanging}
          onDidFinishLoadingMap={onDidFinishLoadingMap}
          attributionEnabled
          logoEnabled
          attributionPosition={{
            bottom: space(2),
            right: space(2),
          }}
          logoPosition={{
            bottom: space(2),
            left: space(2),
          }}
          onPress={onPressMap}
          scaleBarEnabled={false}
        >
          <MapboxGL.Camera
            ref={cameraRef}
            // Only the initial position: city switches move the camera imperatively, so a new
            // city's data arriving mid-flight doesn't snap the map to its destination.
            defaultSettings={{
              centerCoordinate: [centerLng, centerLat],
              zoomLevel: DefaultZoomLevel,
            }}
            minZoomLevel={MinZoomLevel}
            maxZoomLevel={MaxZoomLevel}
          />
          <MapboxGL.UserLocation onUpdate={onUserLocationUpdate} />
          {!!city && (
            <>
              {!!featureCollections && !!mapLoaded && (
                <CityGuideMapPins
                  filterID={cityTabs[activeIndex].id}
                  featureCollections={featureCollections}
                  onPress={(e) => handleFeaturePress(e)}
                  shapeSourceRef={shapeSourceRef}
                  activePinSlug={
                    activePin?.properties?.cluster ? null : activePin?.properties?.slug
                  }
                  activeClusterId={
                    activePin?.properties?.cluster ? activePin?.properties?.cluster_id : null
                  }
                />
              )}
            </>
          )}
        </MapboxGL.MapView>
        {!!city && activePlaces.length > 0 && (
          <Flex
            testID="city-guide-map-preview"
            position="absolute"
            bottom={previewBottomOffset}
            left={0}
            right={0}
          >
            {activePlaces.length === 1 ? (
              <MapPreviewCard place={activePlaces[0]} citySlug={cardCitySlug} />
            ) : (
              <MapPreviewCardRail places={activePlaces} citySlug={cardCitySlug} />
            )}
          </Flex>
        )}
        {!enableGlobalMapList && (
          <CityGuideBottomSheet
            drawerPosition={drawerPosition}
            citySlug={viewer.city?.slug || ""}
          />
        )}
      </Flex>
    </>
  )

  return (
    <ProvideScreenTracking
      info={{
        context_screen: Schema.PageNames.CityGuideMap,
        context_screen_owner_type: Schema.OwnerEntityTypes.CityGuide,
        context_screen_owner_slug: props.citySlug,
        context_screen_owner_id: props.citySlug,
      }}
    >
      {/* The provider is what makes the cards' add-to-itinerary plus render at all. */}
      {enableGlobalMapList ? (
        <AddToItineraryProvider citySlug={viewer.city?.slug} cityName={viewer.city?.name ?? ""}>
          {content}
        </AddToItineraryProvider>
      ) : (
        content
      )}
    </ProvideScreenTracking>
  )
}

/** Makes sure we're consistently using { lat, lng } internally */
const longCoordsToLocation = (coords: { longitude: number; latitude: number }) => {
  return { lat: coords.latitude, lng: coords.longitude }
}

const tracks = {
  trackPinTap: (_: any, __: any, args: any) => {
    const actionName = args[0]
    const show = args[1]
    const type = args[2]

    return {
      action_name: actionName,
      action_type: Schema.ActionTypes.Tap,
      owner_id: !!show ? show[0].internalID : "",
      owner_slug: !!show ? show[0].id : "",
      owner_type: !!type ? type : "",
    } as any
  },
  trackFilterPillTap: (filter: string) => {
    return {
      action_name: filter,
      action_type: Schema.ActionTypes.Tap,
      context_module: "MapFilterPills",
    } as any
  },
}

const cityGuideMapFragment = graphql`
  fragment CityGuideMap_viewer on Viewer
  @refetchable(queryName: "CityGuideMap_viewerRefetch")
  @argumentDefinitions(citySlug: { type: "String!" }, maxInt: { type: "Int!" }) {
    city(slug: $citySlug) {
      name
      slug
      coordinates {
        lat
        lng
      }
      upcomingShows: showsConnection(
        includeStubShows: true
        status: UPCOMING
        dayThreshold: 14
        first: $maxInt
        sort: START_AT_ASC
      ) {
        edges {
          node {
            ...CityGuideShow_show
          }
        }
      }
      shows: showsConnection(
        includeStubShows: true
        status: RUNNING
        first: $maxInt
        sort: PARTNER_ASC
      ) {
        edges {
          node {
            ...CityGuideShow_show
          }
        }
      }
      fairs: fairsConnection(first: $maxInt, status: CURRENT, sort: START_AT_ASC) {
        edges {
          node {
            ...CityGuideFair_fair
          }
        }
      }
    }
  }
`
