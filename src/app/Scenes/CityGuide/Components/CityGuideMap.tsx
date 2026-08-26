import { Flex, useColor, useSpace } from "@artsy/palette-mobile"
import MapboxGL from "@rnmapbox/maps"
import { CityGuideFair_fair$key } from "__generated__/CityGuideFair_fair.graphql"
import { CityGuideMap_viewer$key } from "__generated__/CityGuideMap_viewer.graphql"
import { CityGuideShow_show$key } from "__generated__/CityGuideShow_show.graphql"
import { CityGuideBottomSheet } from "app/Scenes/CityGuide/Components/CityGuideBottomSheet"
import { CityData, CityGuideCityPicker } from "app/Scenes/CityGuide/Components/CityGuideCityPicker"
import { CityGuideMapHeader } from "app/Scenes/CityGuide/Components/CityGuideMapHeader"
import { CityGuideMapPins } from "app/Scenes/CityGuide/Components/CityGuideMapPins"
import {
  CityGuideShowCardOverlay,
  SHOW_CARD_HEIGHT,
} from "app/Scenes/CityGuide/Components/CityGuideShowCardOverlay"
import { cityGuideFairFragment } from "app/Scenes/CityGuide/utils/CityGuideFair"
import { cityGuideShowFragment } from "app/Scenes/CityGuide/utils/CityGuideShow"
import { bucketCityResults, BucketResults } from "app/Scenes/CityGuide/utils/bucketCityResults"
import { buildFeatureCollections } from "app/Scenes/CityGuide/utils/buildFeatureCollections"
import { cityTabs } from "app/Scenes/CityGuide/utils/cityTabs"
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
import { DrawerPosition, Fair, Show } from "app/Scenes/CityGuide/utils/types"
import { GlobalStore } from "app/store/GlobalStore"
import { extractNodes } from "app/utils/extractNodes"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { ProvideScreenTracking, Schema } from "app/utils/track"
import { AnimatePresence } from "moti"
import React, { useEffect, useMemo, useRef, useState } from "react"
import { Platform } from "react-native"
import Keys from "react-native-keys"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { graphql, useFragment, useRefetchableFragment } from "react-relay"
import { useTracking } from "react-tracking"

MapboxGL.setAccessToken(Keys.secureFor("MAPBOX_API_CLIENT_KEY"))

interface Props {
  /** city slug */
  citySlug: string
  // TODO: Rethink this
  /** Error from Relay (CityGuideMapQueryRenderer.tsx). Needed here to send over the EventEmitter. */
  // relayErrorState?: RelayErrorState
  /** The viewer data */
  viewer: CityGuideMap_viewer$key
}

export const ArtsyMapStyleURL = "mapbox://styles/artsyit/cjrb59mjb2tsq2tqxl17pfoak"

export const CityGuideMap: React.FC<Props> = (props) => {
  const color = useColor()
  const space = useSpace()
  const safeAreaInsets = useSafeAreaInsets()

  const [viewer, refetch] = useRefetchableFragment(cityGuideMapFragment, props.viewer)
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

  const [isSavingShow, setIsSavingShow] = useState(false)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [activePin, setActivePin] = useState<GeoJSON.Feature | null>(null)
  const [showCityPicker, setShowCityPicker] = useState(false)
  const [drawerPosition, setDrawerPosition] = useState<DrawerPosition>(DrawerPosition.closed)

  const enableGlobalMapList = useFeatureFlag("AREnableGlobalMapList")

  useEffect(() => {
    EventEmitter.subscribe("filters:change", handleFilterChange)
    return () => {
      EventEmitter.unsubscribe("filters:change", handleFilterChange)
    }
  }, [])

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

    // The native side sends updates with an empty `coords` object before the first location fix
    // lands (and for heading-only updates), which would otherwise leave us with a location made of
    // `undefined`s and crash the camera.
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
    if (!isSavingShow) {
      setActiveShows([])
      setActivePin(null)
    }
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

  const onSelectCity = (newCity: CityData) => {
    setShowCityPicker(false)
    console.warn("setPreviouslySelectedCitySlug", newCity.slug)
    setPreviouslySelectedCitySlug(newCity.slug)
    refetch({ citySlug: newCity.slug, maxInt: MAX_GRAPHQL_INT })
  }

  return (
    <ProvideScreenTracking
      info={{
        context_screen: Schema.PageNames.CityGuideMap,
        context_screen_owner_type: Schema.OwnerEntityTypes.CityGuide,
        context_screen_owner_slug: props.citySlug,
        context_screen_owner_id: props.citySlug,
      }}
    >
      <CityGuideMapHeader
        safeAreaInsetTop={safeAreaInsets.top}
        cityName={viewer.city?.name}
        userLocation={userLocation}
        currentLocation={currentLocation}
        onPressCitySwitcherButton={onPressCitySwitcherButton}
        onPressUserPositionButton={onPressUserPositionButton}
      />
      {/* TODO: think of a better way to animate the appearance of the city picker */}
      <AnimatePresence>
        <CityGuideCityPicker
          showCityPicker={showCityPicker}
          setShowCityPicker={setShowCityPicker}
          selectedCity={city?.name ?? ""}
          onSelectCity={onSelectCity}
        />
      </AnimatePresence>
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
          scaleBarPosition={{
            top: Platform.OS === "ios" ? safeAreaInsets.top - 20 : safeAreaInsets.top + 40,
            left: space(2),
          }}
        >
          <MapboxGL.Camera
            ref={cameraRef}
            animationMode="moveTo"
            zoomLevel={DefaultZoomLevel}
            minZoomLevel={MinZoomLevel}
            maxZoomLevel={MaxZoomLevel}
            centerCoordinate={[centerLng, centerLat]}
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
        {!!city && activeShows.length > 0 && (
          <Flex
            position="absolute"
            bottom={0}
            left={0}
            right={0}
            height={SHOW_CARD_HEIGHT}
            justifyContent="flex-end"
          >
            <CityGuideShowCardOverlay
              activeShows={activeShows}
              showsRef={showsRef}
              fairsRef={fairsRef}
              onSaveStarted={() => setIsSavingShow(true)}
              onSaveEnded={() => setIsSavingShow(false)}
            />
          </Flex>
        )}
        {!enableGlobalMapList && (
          <CityGuideBottomSheet
            drawerPosition={drawerPosition}
            citySlug={viewer.city?.slug || ""}
          />
        )}
      </Flex>
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
