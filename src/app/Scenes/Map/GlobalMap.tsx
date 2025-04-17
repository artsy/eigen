import { Box, ClassTheme, Flex, Text } from "@artsy/palette-mobile"
import MapboxGL from "@rnmapbox/maps"
import { themeGet } from "@styled-system/theme-get"
import { GlobalMap_viewer$data } from "__generated__/GlobalMap_viewer.graphql"
import { Pin } from "app/Components/Icons/Pin"
import PinFairSelected from "app/Components/Icons/PinFairSelected"
import PinSavedSelected from "app/Components/Icons/PinSavedSelected"
import { LegacyNativeModules } from "app/NativeModules/LegacyNativeModules"
import { cityTabs } from "app/Scenes/City/cityTabs"
import {
  convertCityToGeoJSON,
  fairToGeoCityFairs,
  showsToGeoCityShow,
} from "app/utils/convertCityToGeoJSON"
import { extractNodes } from "app/utils/extractNodes"
import { SafeAreaInsets } from "app/utils/hooks"
import { Schema, screenTrack, track } from "app/utils/track"
import { get, isEqual, uniq } from "lodash"
import React from "react"
import { Animated, Dimensions, Image } from "react-native"
import Keys from "react-native-keys"
import { createFragmentContainer, graphql, RelayProp } from "react-relay"
import styled from "styled-components/native"
import Supercluster, { AnyProps, ClusterProperties, PointFeature } from "supercluster"
import { CitySwitcherButton } from "./Components/CitySwitcherButton"
import { PinsShapeLayer } from "./Components/PinsShapeLayer"
import { ShowCard } from "./Components/ShowCard"
import { UserPositionButton } from "./Components/UserPositionButton"
import { EventEmitter } from "./EventEmitter"
import {
  bucketCityResults,
  BucketKey,
  BucketResults,
  emptyBucketResults,
} from "./bucketCityResults"
import { Fair, FilterData, RelayErrorState, Show } from "./types"

MapboxGL.setAccessToken(Keys.secureFor("MAPBOX_API_CLIENT_KEY"))

const ShowCardContainer = styled(Box)`
  position: absolute;
  bottom: 0px;
  left: 0px;
  right: 0px;
  height: 200px;
`

const LoadingScreen = styled(Image)`
  position: absolute;
  left: 0px;
  top: 0px;
`

const TopButtonsContainer = styled(Box)`
  position: absolute;
  left: 0px;
  right: 0px;
  z-index: 1;
  width: 100%;
  height: 100px;
`

interface Props {
  /** Where to center the map initially?  */
  initialCoordinates?: { lat: number; lng: number }
  /** Should the map buttons be hidden...  */
  hideMapButtons: boolean
  /** The map API entry-point */
  viewer?: GlobalMap_viewer$data
  /** API stuff */
  relay?: RelayProp
  /** Tracking */
  tracking?: any
  /** city slug */
  citySlug: string
  /** Whether the bottom sheet drawer is opened */
  isDrawerOpen?: boolean
  /** Whether the user is geographically within the city we're currently rendering. */
  userLocationWithinCity: boolean
  /** Reflects the area not covered by navigation bars, tab bars, toolbars, and other ancestors  */
  safeAreaInsets: SafeAreaInsets
  /** Error from Relay (MapRenderer.tsx). Needed here to send over the EventEmitter. */
  relayErrorState?: RelayErrorState
}

interface State {
  /** The index from the City selector */
  activeIndex: number
  /** Shows which are selected and should show as highlights above the map */
  activeShows: Array<Fair | Show>
  /** An object of objects describing all the artsy elements we want to map */
  bucketResults: BucketResults
  /** The center location for the map right now */
  currentLocation?: { lat: number; lng: number }
  /** The users's location from core location */
  userLocation?: { lat: number; lng: number }
  /** A set of GeoJSON features, which right now is our show clusters */
  featureCollections: { [key in BucketKey]: FilterData } | {}
  /** Has the map fully rendered? */
  mapLoaded: boolean
  /** In the process of saving a show */
  isSavingShow: boolean
  /** Cluster map data used to populate selected cluster annotation */
  nearestFeature: PointFeature<ClusterProperties & AnyProps> | PointFeature<AnyProps> | null
  /** Cluster map data used currently in view window */
  activePin: GeoJSON.Feature | null
  /** Current map zoom level */
  currentZoom: number
}

export const ArtsyMapStyleURL = "mapbox://styles/artsyit/cjrb59mjb2tsq2tqxl17pfoak"

const DefaultZoomLevel = 11
const MinZoomLevel = 9
const MaxZoomLevel = 17.5

enum DrawerPosition {
  open = "open",
  closed = "closed",
  collapsed = "collapsed",
  partiallyRevealed = "partiallyRevealed",
}

@screenTrack<Props>((props) => {
  return {
    context_screen: Schema.PageNames.CityGuideMap,
    context_screen_owner_type: Schema.OwnerEntityTypes.CityGuide,
    context_screen_owner_slug: props.citySlug,
    context_screen_owner_id: props.citySlug,
  }
})
export class GlobalMap extends React.Component<Props, State> {
  /** Makes sure we're consistently using { lat, lng } internally */
  static longCoordsToLocation(coords: { longitude: number; latitude: number }) {
    return { lat: coords.latitude, lng: coords.longitude }
  }

  map: React.RefObject<MapboxGL.MapView>
  camera: React.RefObject<MapboxGL.Camera>
  // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
  filters: { [key: string]: FilterData }
  hideButtons = new Animated.Value(0)
  // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
  currentZoom: number

  shows: { [id: string]: Show } = {}
  fairs: { [id: string]: Fair } = {}

  // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
  constructor(props) {
    super(props)

    this.map = React.createRef()
    this.camera = React.createRef()

    const currentLocation =
      this.props.initialCoordinates || get(this.props, "viewer.city.coordinates")
    this.state = {
      activeShows: [],
      activeIndex: 0,
      currentLocation,
      bucketResults: emptyBucketResults,
      // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
      featureCollections: null,
      mapLoaded: false,
      isSavingShow: false,
      nearestFeature: null,
      activePin: null,
      currentZoom: DefaultZoomLevel,
    }

    this.updateShowIdMap()
  }

  // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
  handleFilterChange = (activeIndex) => {
    this.setState({ activeIndex, activePin: null, activeShows: [] })
  }

  componentDidMount() {
    EventEmitter.subscribe("filters:change", this.handleFilterChange)
  }

  componentWillUnmount() {
    EventEmitter.unsubscribe("filters:change", this.handleFilterChange)
  }

  // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
  componentDidUpdate(_, prevState) {
    // Update the clusterMap if new bucket results
    if (this.state.bucketResults) {
      const shouldUpdate = !isEqual(
        // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
        prevState.bucketResults.saved.map((g) => g.is_followed),
        // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
        this.state.bucketResults.saved.map((g) => g.is_followed)
      )

      if (shouldUpdate) {
        this.updateClusterMap()
      }
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps: Props) {
    const { relayErrorState } = this.props

    // If there is a new city, enity it and update our map.
    if (nextProps.viewer) {
      // TODO: This is currently really inefficient.
      const bucketResults = bucketCityResults(nextProps.viewer)

      this.setState({ bucketResults }, () => {
        this.emitFilteredBucketResults()
        this.updateShowIdMap()
        this.updateClusterMap()
      })
    }
    // If the relayErrorState changes, emit a new event.
    if (!!relayErrorState !== !!nextProps.relayErrorState) {
      EventEmitter.dispatch("map:error", { relayErrorState: nextProps.relayErrorState })
    }
  }

  @track((__, _, args) => {
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
  })
  // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
  trackPinTap(_actionName, _show, _type) {
    return null
  }

  updateClusterMap() {
    if (!this.props.viewer) {
      return
    }

    const featureCollections: State["featureCollections"] = {}
    cityTabs.forEach((tab) => {
      const shows = tab.getShows(this.state.bucketResults)
      const fairs = tab.getFairs(this.state.bucketResults)
      const showData = showsToGeoCityShow(shows)
      const fairData = fairToGeoCityFairs(fairs)
      const data = showData.concat(fairData as any as Show[])
      const geoJSONFeature = convertCityToGeoJSON(data)

      const clusterEngine = new Supercluster({
        radius: 50,
        minZoom: Math.floor(MinZoomLevel),
        maxZoom: Math.floor(MaxZoomLevel),
      })

      clusterEngine.load(geoJSONFeature.features as any)

      // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
      featureCollections[tab.id] = {
        featureCollection: geoJSONFeature,
        filter: tab.id,
        clusterEngine,
      }
    })

    this.setState({
      featureCollections,
    })
  }

  emitFilteredBucketResults() {
    if (!this.props.viewer) {
      return
    }

    const filter = cityTabs[this.state.activeIndex]
    const {
      // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
      city: { name: cityName, slug: citySlug },
    } = this.props.viewer

    EventEmitter.dispatch("map:change", {
      filter,
      buckets: this.state.bucketResults,
      cityName,
      citySlug,
      relay: this.props.relay,
    })
  }

  updateShowIdMap() {
    if (!this.props.viewer) {
      return
    }

    const { city } = this.props.viewer
    if (city) {
      const savedUpcomingShows = extractNodes(city.upcomingShows).filter((node) => node.is_followed)
      const shows = extractNodes(city.shows)
      const concatedShows = uniq(shows.concat(savedUpcomingShows))

      concatedShows.forEach((node) => {
        if (!node || !node.location || !node.location.coordinates) {
          return null
        }

        this.shows[node.slug] = node
      })

      extractNodes(city.fairs).forEach((node) => {
        if (!node || !node.location || !node.location.coordinates) {
          return null
        }

        this.fairs[node.slug] = {
          ...node,
          type: "Fair",
        }
      })
    }
  }

  renderSelectedPin() {
    const { activeShows, activePin } = this.state
    if (activePin === null || activePin.properties === null) {
      return null
    }

    const {
      properties: { cluster, type },
    } = activePin

    if (cluster) {
      const {
        // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
        nearestFeature: { properties, geometry },
      } = this.state
      const [clusterLat, clusterLng] = geometry.coordinates

      const clusterId = properties.cluster_id.toString()
      let pointCount = properties.point_count

      const radius = pointCount < 4 ? 40 : pointCount < 21 ? 50 : 65
      pointCount = pointCount.toString()

      return (
        clusterId &&
        clusterLat &&
        clusterLng &&
        pointCount && (
          <ClassTheme>
            {({ color }) => (
              <MapboxGL.PointAnnotation
                key={clusterId}
                id={clusterId}
                selected
                coordinate={[clusterLat, clusterLng]}
              >
                <SelectedCluster width={radius} height={radius}>
                  <Text variant="sm" weight="medium" color={color("mono0")}>
                    {pointCount}
                  </Text>
                </SelectedCluster>
              </MapboxGL.PointAnnotation>
            )}
          </ClassTheme>
        )
      )
    }

    const item = activeShows[0]

    if (!item || !item.location) {
      return null
    }

    const lat = item.location.coordinates?.lat
    const lng = item.location.coordinates?.lng
    const id = item.slug

    if (type === "Fair") {
      return (
        lat &&
        lng &&
        id && (
          <MapboxGL.PointAnnotation key={id} id={id} coordinate={[lng, lat]}>
            <PinFairSelected />
          </MapboxGL.PointAnnotation>
        )
      )
    } else if (type === "Show") {
      const isSaved = (item as Show).is_followed

      return (
        lat &&
        lng &&
        id && (
          <MapboxGL.PointAnnotation key={id} id={id} selected coordinate={[lng, lat]}>
            {isSaved ? (
              <PinSavedSelected pinHeight={45} pinWidth={45} />
            ) : (
              <Pin pinHeight={45} pinWidth={45} selected />
            )}
          </MapboxGL.PointAnnotation>
        )
      )
    }
  }

  renderShowCard() {
    const { activeShows } = this.state
    const hasShows = activeShows.length > 0

    // Check if it's an iPhone with ears (iPhone X, Xr, Xs, etc...)
    const iPhoneHasEars = this.props.safeAreaInsets.top > 20

    // We need to update activeShows in case of a mutation (save show)
    const updatedShows: Array<Fair | Show> = activeShows.map((item: any) => {
      if (item.type === "Show") {
        return this.shows[item.slug]
      } else if (item.type === "Fair") {
        return this.fairs[item.slug]
      }
      return item
    })

    return (
      <Flex
        style={{
          bottom: hasShows ? (iPhoneHasEars ? 80 : 45) : -150,
          left: 0,
          right: 0,
          position: "absolute",
          height: 150,
        }}
      >
        {!!hasShows && (
          <ShowCard
            shows={updatedShows}
            // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
            relay={this.props.relay}
            onSaveStarted={() => {
              this.setState({ isSavingShow: true })
            }}
            onSaveEnded={() => {
              this.setState({ isSavingShow: false })
            }}
          />
        )}
      </Flex>
    )
  }

  onUserLocationUpdate = (location: MapboxGL.Location) => {
    if (!location || !location.coords) {
      return
    }

    this.setState({
      userLocation: GlobalMap.longCoordsToLocation(location.coords),
    })
  }

  onRegionIsChanging = async () => {
    if (!this.map.current) {
      return
    }
    const zoom = Math.floor((await this.map.current.getZoom()) ?? DefaultZoomLevel)

    if (!this.currentZoom) {
      this.currentZoom = zoom
    }

    if (this.currentZoom !== zoom) {
      this.setState({
        activePin: null,
      })
    }
  }

  onDidFinishRenderingMapFully = () => {
    LegacyNativeModules.ARNotificationsManager.postNotificationName(
      "ARLocalDiscoveryMapHasRendered",
      {}
    )
    this.setState({ mapLoaded: true })
  }

  onPressMap = () => {
    if (!this.state.isSavingShow) {
      this.setState({
        activeShows: [],
        activePin: null,
      })
    }
  }

  onPressCitySwitcherButton = () => {
    this.setState({
      activeShows: [],
      activePin: null,
    })
  }

  onPressUserPositionButton = () => {
    // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
    const { lat, lng } = this.state.userLocation
    this.camera.current?.setCamera({
      centerCoordinate: [lng, lat],
      zoomLevel: DefaultZoomLevel,
      animationDuration: 500,
    })
  }

  get currentFeatureCollection(): FilterData {
    const filterID = cityTabs[this.state.activeIndex].id
    // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
    return this.state.featureCollections[filterID]
  }

  // @TODO: Implement tests for this component https://artsyproduct.atlassian.net/browse/LD-564
  render() {
    const city = get(this.props, "viewer.city")
    const { relayErrorState, userLocationWithinCity } = this.props
    const { lat: centerLat, lng: centerLng } =
      this.props.initialCoordinates || get(city, "coordinates")
    const { mapLoaded, activeShows, activePin } = this.state

    const mapProps = {
      styleURL: ArtsyMapStyleURL,
      userTrackingMode: MapboxGL.UserTrackingModes.Follow,
      logoEnabled: !!city,
      attributionEnabled: false,
      compassEnabled: false,
    }

    return (
      <ClassTheme>
        {({ color }) => (
          <Flex mb={0.5} flexDirection="column" style={{ backgroundColor: color("mono5") }}>
            <LoadingScreen
              source={require("images/map-bg.webp")}
              resizeMode="cover"
              style={{ ...this.backgroundImageSize }}
            />

            {/* TODO: safeArea insets are being reported back incorrectly here, so we have to subtract, we should look further into why, possibly with how we register these components, possibly because they are partially native.
             */}
            <TopButtonsContainer style={{ top: this.props.safeAreaInsets.top - 12 - 10 }}>
              <Animated.View
                style={{
                  transform: [
                    {
                      translateY: this.hideButtons.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, -(this.props.safeAreaInsets.top + 12 + 50)],
                      }),
                    },
                  ],
                }}
              >
                <Flex flexDirection="row" justifyContent="flex-end" alignContent="flex-end" px={4}>
                  <CitySwitcherButton
                    city={city}
                    isLoading={!city && !(relayErrorState && !relayErrorState.isRetrying)}
                    onPress={this.onPressCitySwitcherButton}
                  />
                  {!!(this.state.userLocation && userLocationWithinCity) && (
                    <Box style={{ marginLeft: 10 }}>
                      <UserPositionButton
                        highlight={this.state.userLocation === this.state.currentLocation}
                        onPress={this.onPressUserPositionButton}
                      />
                    </Box>
                  )}
                </Flex>
              </Animated.View>
            </TopButtonsContainer>

            <Flex flex={1}>
              <MapboxGL.MapView
                ref={this.map}
                style={{ width: "100%", height: Dimensions.get("window").height }}
                {...mapProps}
                onCameraChanged={this.onRegionIsChanging}
                onDidFinishLoadingMap={this.onDidFinishRenderingMapFully}
                attributionEnabled
                logoEnabled
                logoPosition={{ bottom: 150, left: 10 }}
                onPress={this.onPressMap}
              >
                <MapboxGL.Camera
                  ref={this.camera}
                  animationMode="flyTo"
                  zoomLevel={DefaultZoomLevel}
                  minZoomLevel={MinZoomLevel}
                  maxZoomLevel={MaxZoomLevel}
                  centerCoordinate={[centerLng, centerLat]}
                />
                <MapboxGL.UserLocation onUpdate={this.onUserLocationUpdate} />
                {!!city && (
                  <>
                    {!!this.state.featureCollections && (
                      <PinsShapeLayer
                        filterID={cityTabs[this.state.activeIndex].id}
                        featureCollections={this.state.featureCollections}
                        onPress={(e) => this.handleFeaturePress(e)}
                      />
                    )}
                    <ShowCardContainer>{this.renderShowCard()}</ShowCardContainer>
                    {!!mapLoaded && !!activeShows && !!activePin && this.renderSelectedPin()}
                  </>
                )}
              </MapboxGL.MapView>
            </Flex>
          </Flex>
        )}
      </ClassTheme>
    )
  }

  get backgroundImageSize() {
    const { width, height } = Dimensions.get("window")
    return {
      width,
      height,
    }
  }

  /**
   * This function is complicated, because the work we have to do is tricky.
   * What's happening is that we have to replicate a subset of the map's clustering algorithm to get
   * access to the shows that the user has tapped on.
   */
  async handleFeaturePress(event: any) {
    if (!this.map.current) {
      return
    }
    const {
      properties: { slug, cluster, type },
      geometry: { coordinates },
    } = event.features[0]

    this.updateDrawerPosition(DrawerPosition.collapsed)

    let activeShows: Array<Fair | Show> = []

    // If the user only taps on the pin we can use the
    // id directly to retrieve the corresponding show
    // @TODO: Adding active Fairs to state only to handle Selecting Fairs
    // The rest of the logic for displaying active show shows and fairs in the
    // maps pins and cards will remain the same for now.
    if (!cluster) {
      if (type === "Show") {
        activeShows = [this.shows[slug]]
        this.trackPinTap(Schema.ActionNames.SingleMapPin, activeShows, Schema.OwnerEntityTypes.Show)
      } else if (type === "Fair") {
        activeShows = [this.fairs[slug]]
        this.trackPinTap(Schema.ActionNames.SingleMapPin, activeShows, Schema.OwnerEntityTypes.Fair)
      }
    }

    // Otherwise the logic is as follows
    // We use our clusterEngine which is map of our clusters
    // 1. Fetch all features (pins, clusters) based on the current map visible bounds
    // 2. Sort them by distance to the user tap coordinates
    // 3. Retrieve points within the cluster and map them back to shows
    else {
      this.trackPinTap(Schema.ActionNames.ClusteredMapPin, null, Schema.OwnerEntityTypes.Show)
      // Get map zoom level and coordinates of where the user tapped
      const zoom = Math.floor(await this.map.current.getZoom())
      const [lat, lng] = coordinates

      // Get coordinates of the map's current viewport bounds
      const visibleBounds = await this.map.current.getVisibleBounds()
      const [ne, sw] = visibleBounds
      const [eastLng, northLat] = ne
      const [westLng, southLat] = sw

      const clusterEngine = this.currentFeatureCollection.clusterEngine
      const visibleFeatures = clusterEngine.getClusters(
        [westLng, southLat, eastLng, northLat],
        zoom
      )
      const nearestFeature = this.getNearestPointToLatLongInCollection(
        { lat, lng },
        visibleFeatures
      )
      const points = clusterEngine.getLeaves(nearestFeature?.properties?.cluster_id, Infinity)
      activeShows = points.map((a) => a.properties) as any
      this.setState({
        nearestFeature,
      })
    }

    this.setState({
      activeShows,
      activePin: event.features[0],
    })
  }

  getNearestPointToLatLongInCollection(values: { lat: number; lng: number }, features: any[]) {
    // https://stackoverflow.com/a/21623206
    function distance(lat1: number, lon1: number, lat2: number, lon2: number) {
      const p = 0.017453292519943295 // Math.PI / 180
      const c = Math.cos
      const a =
        0.5 -
        c((lat2 - lat1) * p) / 2 +
        (c(lat1 * p) * c(lat2 * p) * (1 - c((lon2 - lon1) * p))) / 2

      return 12742 * Math.asin(Math.sqrt(a)) // 2 * R; R = 6371 km
    }

    const distances = features
      .map((feature) => {
        const [featureLat, featureLng] = feature.geometry.coordinates
        return {
          ...feature,
          distance: distance(values.lat, values.lng, featureLat, featureLng),
        }
      })
      .sort((a, b) => a.distance - b.distance)

    return distances[0]
  }

  updateDrawerPosition(position: DrawerPosition) {
    const notificationName = "ARLocalDiscoveryUpdateDrawerPosition"
    LegacyNativeModules.ARNotificationsManager.postNotificationName(notificationName, {
      position,
    })
  }
}

const SelectedCluster = styled(Flex)`
  background-color: ${themeGet("colors.blue100")};
  border-radius: 60px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`

// FIXME:
// * This should not take the Query type but just City.
// * Use fragments to reduce the size of this fragment.
// * Test if there are unnused field selections.
//
// NOTE: Not renamed the prop from `viewer` becuase there's too much indirection in how the city data is used and it's
//       too easy to miss a place that needs to be updated. This should be cleaned up when the above FIXME is addressed.
export const GlobalMapContainer = createFragmentContainer(GlobalMap, {
  viewer: graphql`
    fragment GlobalMap_viewer on Query
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
              slug
              internalID
              id
              isStubShow
              name
              status
              href
              is_followed: isFollowed
              exhibition_period: exhibitionPeriod(format: SHORT)
              cover_image: coverImage {
                url
              }
              location {
                coordinates {
                  lat
                  lng
                }
              }
              type
              start_at: startAt
              end_at: endAt
              partner {
                ... on Partner {
                  name
                  type
                  profile {
                    image {
                      url(version: "square")
                    }
                  }
                }
              }
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
              slug
              internalID
              id
              isStubShow
              name
              status
              href
              is_followed: isFollowed
              exhibition_period: exhibitionPeriod(format: SHORT)
              cover_image: coverImage {
                url
              }
              location {
                coordinates {
                  lat
                  lng
                }
              }
              type
              start_at: startAt
              end_at: endAt
              partner {
                ... on Partner {
                  name
                  type
                  profile {
                    image {
                      url(version: "square")
                    }
                  }
                }
              }
            }
          }
        }
        fairs: fairsConnection(first: $maxInt, status: CURRENT, sort: START_AT_ASC) {
          edges {
            node {
              id
              slug
              name
              exhibition_period: exhibitionPeriod(format: SHORT)
              counts {
                partners
              }
              location {
                coordinates {
                  lat
                  lng
                }
              }
              image {
                image_url: imageURL
                aspect_ratio: aspectRatio
                url
              }
              profile {
                icon {
                  internalID
                  href
                  height
                  width
                  url(version: "square140")
                }
                id
                slug
                name
              }
              start_at: startAt
              end_at: endAt
            }
          }
        }
      }
    }
  `,
})
