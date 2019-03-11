import { Box, color, Flex, Sans, Theme } from "@artsy/palette"
import Mapbox from "@mapbox/react-native-mapbox-gl"
import { GlobalMap_viewer } from "__generated__/GlobalMap_viewer.graphql"
import colors from "lib/data/colors"
import { Pin } from "lib/Icons/Pin"
import PinSavedSelected from "lib/Icons/PinSavedSelected"
import { convertCityToGeoJSON, fairToGeoCityFairs, showsToGeoCityShow } from "lib/utils/convertCityToGeoJSON"
import { Schema, screenTrack, track } from "lib/utils/track"
import { get } from "lodash"
import React from "react"
import { Animated, Dimensions, Easing, Image, NativeModules, View } from "react-native"
import { createFragmentContainer, graphql, RelayProp } from "react-relay"
import { animated, config, Spring } from "react-spring/dist/native.cjs.js"
import styled from "styled-components/native"
import Supercluster from "supercluster"

import { cityTabs } from "../City/cityTabs"
import { bucketCityResults, BucketResults, emptyBucketResults } from "./bucketCityResults"
import { CitySwitcherButton } from "./Components/CitySwitcherButton"
import { PinsShapeLayer } from "./Components/PinsShapeLayer"
import { ShowCard } from "./Components/ShowCard"
import { UserPositionButton } from "./Components/UserPositionButton"
import { EventEmitter } from "./EventEmitter"
import { MapGeoFeature, MapGeoFeatureCollection, OSCoordsUpdate, SafeAreaInsets, Show } from "./types"

const Emission = NativeModules.Emission || {}

Mapbox.setAccessToken(Emission.mapBoxAPIClientKey)

const Map = styled(Mapbox.MapView)`
  height: ${Dimensions.get("window").height};
  width: 100%;
`
const AnimatedView = animated(View)

const ShowCardContainer = styled(Box)`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 200;
`

const LoadingScreen = styled(Image)`
  position: absolute;
  left: 0;
  top: 0;
`

const TopButtonsContainer = styled(Box)`
  position: absolute;
  left: 0;
  right: 0;
  z-index: 1;
  width: 100%;
  height: 100;
`

interface Props {
  /** Where to center the map initially?  */
  initialCoordinates?: { lat: number; lng: number }
  /** Should the map buttons be hidden...  */
  hideMapButtons: boolean
  /** The map API entry-point */
  viewer?: GlobalMap_viewer
  /** API stuff */
  relay?: RelayProp
  /** Tracking */
  tracking?: any
  /** city slug */
  citySlug: string
  /** Whether the bottom sheet drawer is opened */
  isDrawerOpen?: boolean
  /** Reflects the area not covered by navigation bars, tab bars, toolbars, and other ancestors  */
  safeAreaInsets: SafeAreaInsets
}

interface State {
  /** The index from the City selector */
  activeIndex: number
  /** Shows which are selected and should show as highlights above the map */
  activeShows: Show[]
  /** An object of objects describing all the artsy elements we want to map */
  bucketResults: BucketResults
  /** The center location for the map right now */
  currentLocation?: { lat: number; lng: number }
  /** The users's location from core location */
  userLocation?: { lat: number; lng: number }
  /** True when we know that we can get location updates from the OS */
  trackUserLocation?: boolean
  /** A set of GeoJSON features, which right now is our show clusters */
  showsGeoJSONFeature: MapGeoFeatureCollection
  /** Has the map fully rendered? */
  mapLoaded: boolean
  isSavingShow: boolean
  /** Cluster map data used to populate selected cluster annotation */
  nearestFeature: object
}

export const ArtsyMapStyleURL = "mapbox://styles/artsyit/cjrb59mjb2tsq2tqxl17pfoak"

const ButtonAnimation = {
  yDelta: -200,
  duration: 350,
  easing: {
    moveOut: Easing.in(Easing.cubic),
    moveIn: Easing.out(Easing.cubic),
  },
}

enum DrawerPosition {
  open = "open",
  closed = "closed",
  collapsed = "collapsed",
  partiallyRevealed = "partiallyRevealed",
}

const screenSchemaForCurrentTabState = currentSelectedTab => {
  switch (currentSelectedTab) {
    case "all":
      return Schema.PageNames.CityGuideAllMap
    case "saved":
      return Schema.PageNames.CityGuideSavedMap
    case "fairs":
      return Schema.PageNames.CityGuideFairsMap
    case "galleries":
      return Schema.PageNames.CityGuideGalleriesMap
    case "museums":
      return Schema.PageNames.CityGuideMuseumsMap
    default:
      return null
  }
}

@screenTrack<Props>(props => ({
  context_screen: screenSchemaForCurrentTabState("all"),
  context_screen_owner_type: Schema.OwnerEntityTypes.CityGuide,
  context_screen_owner_slug: props.citySlug,
  context_screen_owner_id: props.citySlug,
}))
export class GlobalMap extends React.Component<Props, State> {
  /** Makes sure we're consistently using { lat, lng } internally */
  static lngLatArrayToLocation(arr: [number, number] | undefined) {
    if (!arr || arr.length !== 2) {
      return undefined
    }
    return { lng: arr[0], lat: arr[1] }
  }

  /** Makes sure we're consistently using { lat, lng } internally */
  static longCoordsToLocation(coords: { longitude: number; latitude: number }) {
    return { lat: coords.latitude, lng: coords.longitude }
  }

  map: Mapbox.MapView
  clusterEngine: Supercluster
  showsGeoJSONFeatureCollection: MapGeoFeatureCollection
  fairsGeoJSONFeatureCollection: MapGeoFeatureCollection
  moveButtons: Animated.Value

  shows: { [id: string]: Show } = {}

  stylesheet = Mapbox.StyleSheet.create({
    singleShow: {
      iconImage: Mapbox.StyleSheet.identity("icon"),
      iconSize: 0.8,
      // iconOffset: [0, -21], @TODO: This property causes with the selected shows icon. Does this need to be here?
    },

    clusteredPoints: {
      circlePitchAlignment: "map",
      circleColor: "black",

      circleRadius: Mapbox.StyleSheet.source(
        [[0, 15], [5, 20], [30, 30]],
        "point_count",
        Mapbox.InterpolationMode.Exponential
      ),
    },

    clusterCount: {
      textField: "{point_count}",
      textSize: 14,
      textColor: "white",
      textFont: ["Unica77 LL Medium"],
      textPitchAlignment: "map",
    },
  })

  constructor(props) {
    super(props)

    const currentLocation = this.props.initialCoordinates || get(this.props, "viewer.city.coordinates")
    this.state = {
      activeShows: [],
      activeIndex: 0,
      currentLocation,
      bucketResults: emptyBucketResults,
      trackUserLocation: false,
      showsGeoJSONFeature: undefined,
      mapLoaded: false,
      isSavingShow: false,
      nearestFeature: null,
    }

    this.clusterEngine = new Supercluster({
      radius: 50,
    })

    this.updateShowIdMap()
    this.updateClusterMap(false)
  }

  handleEvent = activeIndex => this.setState({ activeIndex }, () => this.emitFilteredBucketResults())

  componentDidMount() {
    EventEmitter.subscribe("filters:change", this.handleEvent)
  }

  componentWillUnmount() {
    EventEmitter.unsubscribe("filters:change", this.handleEvent)
  }

  componentDidUpdate(_, prevState) {
    if (prevState.activeIndex !== this.state.activeIndex) {
      console.log("updating here")
      this.fireGlobalMapScreenViewAnalytics()
    }
  }

  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.viewer) {
      const bucketResults = bucketCityResults(nextProps.viewer)

      this.setState({ bucketResults }, () => {
        this.emitFilteredBucketResults()
        this.updateShowIdMap()
        this.updateClusterMap()
      })
    }

    if (nextProps.hideMapButtons !== this.props.hideMapButtons) {
      if (nextProps.hideMapButtons) {
        this.moveButtons = new Animated.Value(0)
        Animated.timing(this.moveButtons, {
          toValue: ButtonAnimation.yDelta,
          duration: ButtonAnimation.duration,
          easing: ButtonAnimation.easing.moveOut,
          useNativeDriver: true,
        }).start()
      } else {
        this.moveButtons = new Animated.Value(ButtonAnimation.yDelta)
        Animated.timing(this.moveButtons, {
          toValue: 0,
          duration: ButtonAnimation.duration,
          easing: ButtonAnimation.easing.moveIn,
          useNativeDriver: true,
        }).start()
      }
    }
  }

  @track((__, _, args) => {
    const actionName = args[0]
    const show = args[1]
    return {
      action_name: actionName,
      action_type: Schema.ActionTypes.Tap,
      owner_id: !!show ? show[0]._id : "",
      owner_slug: !!show ? show[0].id : "",
      owner_type: !!show ? Schema.OwnerEntityTypes.Show : "",
    } as any
  })
  trackPinTap(_actionName, _show) {
    return null
  }

  updateClusterMap(updateState: boolean = true) {
    if (!this.props.viewer) {
      return
    }

    const tab = cityTabs[this.state.activeIndex]
    const shows = tab.getShows(this.state.bucketResults)
    const fairs = tab.getFairs(this.state.bucketResults)

    const showData = showsToGeoCityShow(shows)
    const showsGeoJSONFeature = convertCityToGeoJSON(showData)

    const fairData = fairToGeoCityFairs(fairs)
    const fairsGeoJSONFeature = convertCityToGeoJSON(fairData)

    if (updateState) {
      this.setState({
        showsGeoJSONFeature,
      })
    }

    this.fairsGeoJSONFeatureCollection = fairsGeoJSONFeature
    this.showsGeoJSONFeatureCollection = showsGeoJSONFeature
    // close but not enough yet
    this.clusterEngine.load(this.showsGeoJSONFeatureCollection.features as any)
  }

  emitFilteredBucketResults() {
    if (!this.props.viewer) {
      return
    }

    // TODO: map region filtering can live here.
    const filter = cityTabs[this.state.activeIndex]
    const {
      city: { name: cityName, slug: citySlug, sponsoredContent },
    } = this.props.viewer

    this.updateClusterMap(true)

    EventEmitter.dispatch("map:change", {
      filter,
      buckets: this.state.bucketResults,
      cityName,
      citySlug,
      sponsoredContent,
      relay: this.props.relay,
    })
  }

  fireGlobalMapScreenViewAnalytics = () => {
    this.props.tracking.trackEvent({
      context_screen: screenSchemaForCurrentTabState(cityTabs[this.state.activeIndex].id),
      context_screen_owner_type: Schema.OwnerEntityTypes.CityGuide,
      context_screen_owner_slug: this.props.citySlug,
      context_screen_owner_id: this.props.citySlug,
    })
  }

  updateShowIdMap() {
    if (!this.props.viewer) {
      return
    }

    const { city } = this.props.viewer
    if (city) {
      city.shows.edges.forEach(({ node }) => {
        if (!node || !node.location || !node.location.coordinates) {
          return null
        }

        this.shows[node.id] = node
      })
    }
  }

  renderSelectedPin() {
    const { activeShows } = this.state
    console.log("TCL: renderSelectedPin -> activeShows", activeShows)
    const isCluster = activeShows.length > 1
    const isSingleShow = activeShows.length === 1

    if (isCluster) {
      console.log("TCL: renderSelectedPin -> isCluster", isCluster)
      const { nearestFeature } = this.state
      const activeClusterLat = get(nearestFeature, "geometry.coordinates[0]")
      const activeClusterLng = get(nearestFeature, "geometry.coordinates[1]")
      const clusterId = get(nearestFeature, "properties.cluster_id", "").toString()
      let pointCount = get(nearestFeature, "properties.point_count", "")
      const width = pointCount < 5 ? 35 : pointCount < 21 ? 45 : 60
      const height = pointCount < 5 ? 35 : pointCount < 21 ? 45 : 60
      pointCount = pointCount.toString()

      return (
        clusterId &&
        activeClusterLat &&
        activeClusterLng &&
        pointCount && (
          <Mapbox.PointAnnotation
            key={clusterId}
            id={clusterId}
            selected={true}
            coordinate={[activeClusterLat, activeClusterLng]}
          >
            <SelectedCluster width={width} height={height}>
              <Sans size="2" weight="medium" color={color("white100")}>
                {pointCount}
              </Sans>
            </SelectedCluster>
          </Mapbox.PointAnnotation>
        )
      )
    }
    if (isSingleShow) {
      console.log("TCL: renderSelectedPin -> isSingleShow", isSingleShow)
      const lat = get(activeShows, "[0].location.coordinates.lat")
      const lng = get(activeShows, "[0].location.coordinates.lng")
      const showId = get(activeShows, "[0].id")
      const isSaved = get(activeShows, "[0].is_followed")

      return (
        lat &&
        lng &&
        showId && (
          <Mapbox.PointAnnotation key={showId} id={showId} selected={true} coordinate={[lng, lat]}>
            {isSaved ? (
              <PinSavedSelected pinHeight={45} pinWidth={45} />
            ) : (
              <Pin pinHeight={45} pinWidth={45} selected={true} />
            )}
          </Mapbox.PointAnnotation>
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
    const updatedShows = activeShows.map(show => this.shows[show.id])

    return (
      <Spring
        native
        from={{ bottom: -150, progress: 0, opacity: 0 }}
        to={
          hasShows
            ? { bottom: iPhoneHasEars ? 80 : 45, progress: 1, opacity: 1.0 }
            : { bottom: -150, progress: 0, opacity: 0 }
        }
        config={config.stiff}
        precision={1}
      >
        {({ bottom, opacity }) => (
          <AnimatedView
            style={{
              bottom,
              left: 0,
              right: 0,
              opacity,
              position: "absolute",
              height: 150,
            }}
          >
            <Theme>
              {hasShows && (
                <ShowCard
                  shows={updatedShows as any}
                  relay={this.props.relay}
                  onSaveStarted={() => {
                    this.setState({ isSavingShow: true })
                  }}
                  onSaveEnded={() => {
                    this.setState({ isSavingShow: false })
                  }}
                />
              )}
            </Theme>
          </AnimatedView>
        )}
      </Spring>
    )
  }

  render() {
    const city = get(this.props, "viewer.city")
    const { lat: centerLat, lng: centerLng } = this.props.initialCoordinates || get(city, "coordinates")
    const { mapLoaded, activeShows } = this.state

    const mapProps = {
      showUserLocation: true,
      styleURL: ArtsyMapStyleURL,
      userTrackingMode: Mapbox.UserTrackingModes.Follow,
      centerCoordinate: [centerLng, centerLat],
      zoomLevel: 13,
      minZoomLevel: 11,
      logoEnabled: false,
      attributionEnabled: true,
      compassEnabled: false,
    }

    const mapInteractions = {
      onRegionDidChange: (location: MapGeoFeature) => {
        this.emitFilteredBucketResults()
        this.setState({
          trackUserLocation: false,
          currentLocation: GlobalMap.lngLatArrayToLocation(location.geometry && location.geometry.coordinates),
        })
      },
      onUserLocationUpdate: (location: OSCoordsUpdate) => {
        this.setState({
          userLocation: location.coords && GlobalMap.longCoordsToLocation(location.coords),
          currentLocation: location.coords && GlobalMap.longCoordsToLocation(location.coords),
          trackUserLocation: true,
        })
      },
      onDidFinishRenderingMapFully: () => this.setState({ mapLoaded: true }),
      onPress: () => {
        if (!this.state.isSavingShow) {
          this.setState({
            activeShows: [],
          })
        }
      },
    }

    return (
      <Flex mb={0.5} flexDirection="column" style={{ backgroundColor: colors["gray-light"] }}>
        <LoadingScreen
          source={require("../../../../images/map-bg.png")}
          resizeMode="cover"
          style={{ ...this.backgroundImageSize }}
        />
        <TopButtonsContainer style={{ top: this.props.safeAreaInsets.top }}>
          <Animated.View style={this.moveButtons && { transform: [{ translateY: this.moveButtons }] }}>
            <Flex flexDirection="row" justifyContent="flex-start" alignContent="flex-start" px={3} pt={1}>
              <CitySwitcherButton
                city={city}
                onPress={() => {
                  this.setState({
                    activeShows: [],
                  })
                }}
              />
              <Box style={{ marginLeft: "auto" }}>
                <UserPositionButton
                  highlight={this.state.userLocation === this.state.currentLocation}
                  onPress={() => {
                    const { lat, lng } = this.state.userLocation
                    this.map.moveTo([lng, lat], 500)
                  }}
                />
              </Box>
            </Flex>
          </Animated.View>
        </TopButtonsContainer>
        <Spring
          native
          from={{ opacity: 0 }}
          to={mapLoaded ? { opacity: 1.0 } : { opacity: 0 }}
          config={{
            duration: 300,
          }}
          precision={1}
        >
          {({ opacity }) => (
            <AnimatedView style={{ flex: 1, opacity }}>
              <Map
                {...mapProps}
                {...mapInteractions}
                ref={(c: any) => {
                  if (c) {
                    this.map = c.root
                  }
                }}
              >
                {city && (
                  <>
                    {this.showsGeoJSONFeatureCollection && (
                      <PinsShapeLayer
                        featureCollection={this.showsGeoJSONFeatureCollection}
                        onPress={e => this.handleFeaturePress(e.nativeEvent)}
                      />
                    )}
                    <ShowCardContainer>{this.renderShowCard()}</ShowCardContainer>
                    {mapLoaded && activeShows && this.renderSelectedPin()}
                  </>
                )}
              </Map>
            </AnimatedView>
          )}
        </Spring>
      </Flex>
    )
  }

  get backgroundImageSize() {
    const { width, height } = Dimensions.get("window")
    return {
      width,
      height,
    }
  }

  async handleFairPress(_event: any) {
    // NOOP for now
  }

  /**
   * This function is complicated, because the work we have to do is tricky.
   * What's happening is that we have to replicate a subset of the map's clustering algorithm to get
   * access to the shows that the user has tapped on.
   */
  async handleFeaturePress(nativeEvent: any) {
    const {
      payload: {
        properties: { id, cluster },
        geometry: { coordinates },
      },
    } = nativeEvent

    this.updateDrawerPosition(DrawerPosition.collapsed)

    let activeShows: Show[] = []
    // If the user only taps on the pin we can use the
    // id directly to retrieve the corresponding show
    if (!cluster) {
      activeShows = [this.shows[id]]
    }

    // Otherwise the logic is as follows
    // We use our clusterEngine which is map of our clusters
    // 1. Fetch all features (pins, clusters) based on the current map visible bounds
    // 2. Sort them by distance to the user tap coordinates
    // 3. Retrieve points within the cluster and map them back to shows
    else {
      // Get map zoom level and coordinates of where the user tapped
      const zoom = Math.floor(await this.map.getZoom())
      const [lat, lng] = coordinates

      // Get coordinates of the map's current viewport bounds
      const visibleBounds = await this.map.getVisibleBounds()
      const [ne, sw] = visibleBounds
      const [eastLng, northLat] = ne
      const [westLng, southLat] = sw

      const visibleFeatures = this.clusterEngine.getClusters([westLng, southLat, eastLng, northLat], zoom)
      const nearestFeature = this.getNearestPointToLatLongInCollection({ lat, lng }, visibleFeatures)
      const points = this.clusterEngine.getLeaves(nearestFeature.properties.cluster_id, Infinity)
      activeShows = points.map(a => a.properties) as any
      this.setState({
        nearestFeature,
      })
    }

    this.setState({
      activeShows,
    })
  }

  getNearestPointToLatLongInCollection(values: { lat: number; lng: number }, features: any[]) {
    // https://stackoverflow.com/a/21623206
    function distance(lat1, lon1, lat2, lon2) {
      const p = 0.017453292519943295 // Math.PI / 180
      const c = Math.cos
      const a = 0.5 - c((lat2 - lat1) * p) / 2 + (c(lat1 * p) * c(lat2 * p) * (1 - c((lon2 - lon1) * p))) / 2

      return 12742 * Math.asin(Math.sqrt(a)) // 2 * R; R = 6371 km
    }

    const distances = features
      .map(feature => {
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
    NativeModules.ARNotificationsManager.postNotificationName(notificationName, {
      position,
    })
  }
}

const SelectedCluster = styled(Flex)`
  background-color: ${colors["purple-regular"]};
  border-radius: 60;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`

export const GlobalMapContainer = createFragmentContainer(
  GlobalMap,
  graphql`
    fragment GlobalMap_viewer on Viewer @argumentDefinitions(citySlug: { type: "String!" }, maxInt: { type: "Int!" }) {
      city(slug: $citySlug) {
        name
        slug
        sponsoredContent {
          introText
          artGuideUrl
        }
        coordinates {
          lat
          lng
        }

        shows(includeStubShows: true, first: $maxInt, sort: START_AT_ASC) {
          edges {
            node {
              id
              _id
              __id

              name
              status
              href
              is_followed
              exhibition_period
              cover_image {
                url
              }
              location {
                coordinates {
                  lat
                  lng
                }
              }
              type
              start_at
              end_at
              partner {
                ... on Partner {
                  name
                  type
                }
                ... on ExternalPartner {
                  name
                }
              }
            }
          }
        }

        fairs(first: $maxInt) {
          edges {
            node {
              id
              name
              exhibition_period
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
                image_url
                aspect_ratio
                url
              }

              profile {
                icon {
                  id
                  href
                  height
                  width
                  url(version: "square140")
                }
                __id
                id
                name
              }

              start_at
              end_at
            }
          }
        }
      }
    }
  `
)
