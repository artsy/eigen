import { Box, Flex, Theme } from "@artsy/palette"
import Mapbox from "@mapbox/react-native-mapbox-gl"
import { GlobalMap_viewer } from "__generated__/GlobalMap_viewer.graphql"
import { get } from "lodash"
import React from "react"
import { Animated, Dimensions, Easing, NativeModules, SafeAreaView, View } from "react-native"
import { createFragmentContainer, graphql, RelayProp } from "react-relay"
import { animated, config, Spring } from "react-spring/dist/native.cjs.js"
import styled from "styled-components/native"
import Supercluster from "supercluster"

import colors from "lib/data/colors"
import { convertCityToGeoJSON } from "lib/utils/convertCityToGeoJSON"
import { bucketCityResults, BucketResults, emptyBucketResults } from "./Bucket"
import { CitySwitcherButton } from "./Components/CitySwitcherButton"
import { ShowCard } from "./Components/ShowCard"
import { UserPositionButton } from "./Components/UserPositionButton"
import { EventEmitter } from "./EventEmitter"
import { MapTab, Show } from "./types"

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
  height: 260;
`

interface Props {
  initialCoordinates?: { lat: number; lng: number }
  hideMapButtons: boolean
  viewer?: GlobalMap_viewer
  relay: RelayProp
}
interface State {
  activeIndex: number
  activeShows: Show[]
  bucketResults: BucketResults
  currentLocation?: any
  userLocation?: any
  trackUserLocation?: boolean
  featureCollection: any
  mapLoaded: boolean
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

export class GlobalMap extends React.Component<Props, State> {
  map: Mapbox.MapView
  clusterEngine: Supercluster
  featureCollection: any
  moveButtons: Animated.Value

  filters: MapTab[] = [
    { id: "all", text: "All" },
    { id: "saved", text: "Saved" },
    { id: "fairs", text: "Fairs" },
    { id: "galleries", text: "Galleries" },
    { id: "museums", text: "Museums" },
  ]
  shows: { [id: string]: Show } = {}

  stylesheet = Mapbox.StyleSheet.create({
    singleShow: {
      iconImage: Mapbox.StyleSheet.identity("icon"),
      iconSize: 0.8,
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
      featureCollection: {},
      mapLoaded: false,
    }
    this.clusterEngine = new Supercluster({
      radius: 50,
      maxZoom: 13,
    })

    this.updateShowIdMap()
    this.updateClusterMap(false)
  }

  componentDidMount() {
    EventEmitter.subscribe("filters:change", activeIndex =>
      this.setState({ activeIndex }, () => this.emitFilteredBucketResults())
    )
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

  updateClusterMap(updateState: boolean = true) {
    if (!this.props.viewer) {
      return
    }
    const { city } = this.props.viewer
    const data = city.shows.edges.filter(a => a.node.type === "Show").map(({ node }) => {
      return {
        node: {
          ...node,
          icon: node.is_followed ? "pin-saved" : "pin",
        },
      }
    })

    const featureCollection = convertCityToGeoJSON(data)

    if (updateState) {
      this.setState({
        featureCollection,
      })
    }
    this.featureCollection = featureCollection
    this.clusterEngine.load(this.featureCollection.features)
    return featureCollection
  }

  emitFilteredBucketResults() {
    if (!this.props.viewer) {
      return
    }

    console.log("emitting")

    // TODO: map region filtering can live here.
    const filter = this.filters[this.state.activeIndex]
    const {
      city: { name: cityName, sponsoredContent },
    } = this.props.viewer
    EventEmitter.dispatch("map:change", {
      filter,
      buckets: this.state.bucketResults,
      cityName,
      sponsoredContent,
      relay: this.props.relay,
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

  renderShowCard() {
    const { activeShows } = this.state
    const hasShows = activeShows.length > 0

    return (
      <Spring
        native
        from={{ bottom: -150, progress: 0, opacity: 0 }}
        to={hasShows ? { bottom: 0, progress: 1, opacity: 1.0 } : { bottom: -150, progress: 0, opacity: 0 }}
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
            }}
          >
            <Theme>{hasShows && <ShowCard shows={activeShows as any} />}</Theme>
          </AnimatedView>
        )}
      </Spring>
    )
  }

  render() {
    const city = get(this.props, "viewer.city")
    const { lat: centerLat, lng: centerLng } = this.props.initialCoordinates || get(city, "coordinates")
    const { mapLoaded } = this.state

    // TODO: Need to hide the map while showing the top buttons.
    return (
      <Flex mb={0.5} flexDirection="column" style={{ backgroundColor: colors["gray-light"] }}>
        <Map
          ref={(c: any) => {
            if (c) {
              this.map = c.root
            }
          }}
          style={{ opacity: mapLoaded && city ? 1 : 0 }} // TODO: Animate this opacity change.
          showUserLocation={true}
          styleURL={ArtsyMapStyleURL}
          userTrackingMode={Mapbox.UserTrackingModes.Follow}
          centerCoordinate={[centerLng, centerLat]}
          zoomLevel={13}
          logoEnabled={false}
          attributionEnabled={true}
          compassEnabled={false}
          onRegionDidChange={location => {
            this.emitFilteredBucketResults()
            this.setState({
              trackUserLocation: false,
              currentLocation: location.geometry.coordinate,
            })
          }}
          onUserLocationUpdate={location => {
            this.setState({
              userLocation: location,
              currentLocation: location,
              trackUserLocation: true,
            })
          }}
          onDidFinishRenderingMapFully={() => this.setState({ mapLoaded: true })}
          onPress={() => {
            this.setState({
              activeShows: [],
            })
          }}
        >
          {city && (
            <>
              <SafeAreaView style={{ flex: 1 }}>
                <Animated.View style={this.moveButtons && { transform: [{ translateY: this.moveButtons }] }}>
                  <Flex flexDirection="row" justifyContent="flex-start" alignContent="flex-start" px={3} pt={1}>
                    <CitySwitcherButton city={city} />
                    <Box style={{ marginLeft: "auto" }}>
                      <UserPositionButton
                        highlight={this.state.userLocation === this.state.currentLocation}
                        onPress={() => {
                          const { latitude, longitude } = this.state.userLocation.coords
                          this.map.moveTo([longitude, latitude], 500)
                        }}
                      />
                    </Box>
                  </Flex>
                </Animated.View>
                <ShowCardContainer>{this.renderShowCard()}</ShowCardContainer>
              </SafeAreaView>
              {this.featureCollection && (
                <Mapbox.ShapeSource
                  id="shows"
                  shape={this.featureCollection}
                  cluster
                  clusterRadius={50}
                  clusterMaxZoom={13}
                  onPress={e => {
                    this.handleFeaturePress(e.nativeEvent)
                  }}
                >
                  <Mapbox.SymbolLayer
                    id="singleShow"
                    filter={["!has", "point_count"]}
                    style={this.stylesheet.singleShow}
                  />
                  <Mapbox.SymbolLayer id="pointCount" style={this.stylesheet.clusterCount} />

                  <Mapbox.CircleLayer
                    id="clusteredPoints"
                    belowLayerID="pointCount"
                    filter={["has", "point_count"]}
                    style={this.stylesheet.clusteredPoints}
                  />
                </Mapbox.ShapeSource>
              )}
            </>
          )}
        </Map>
      </Flex>
    )
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

export const GlobalMapContainer = createFragmentContainer(
  GlobalMap,
  graphql`
    fragment GlobalMap_viewer on Viewer @argumentDefinitions(citySlug: { type: "String!" }, maxInt: { type: "Int!" }) {
      city(slug: $citySlug) {
        name
        sponsoredContent {
          introText
          artGuideUrl
        }
        coordinates {
          lat
          lng
        }

        shows(discoverable: true, first: $maxInt, sort: START_AT_ASC) {
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
