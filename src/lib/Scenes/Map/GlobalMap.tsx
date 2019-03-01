import { Box, Flex, Theme } from "@artsy/palette"
import Mapbox from "@mapbox/react-native-mapbox-gl"
import { GlobalMap_viewer } from "__generated__/GlobalMap_viewer.graphql"
import React from "react"
import { Animated, Dimensions, NativeModules, SafeAreaView, View } from "react-native"
import { createRefetchContainer, graphql, RelayProp } from "react-relay"
import { animated, config, Spring } from "react-spring/dist/native.cjs.js"
import styled from "styled-components/native"

import { Pin } from "lib/Icons/Pin"
import { bucketCityResults, BucketResults } from "./Bucket"
import { CitySwitcherButton } from "./Components/CitySwitcherButton"
import { ShowCard } from "./Components/ShowCard"
import { UserPositionButton } from "./Components/UserPositionButton"
import { EventEmitter } from "./EventEmitter"
import { Show, Tab } from "./types"

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
  height: 250;
`

interface Props {
  initialCoordinates?: { lat: number; lng: number }
  viewer: GlobalMap_viewer
  relay: RelayProp
}
interface State {
  activeIndex: number
  activeShowID?: string
  bucketResults: BucketResults
  currentLocation?: any
  userLocation?: any
  trackUserLocation?: boolean
}

export const ArtsyMapStyleURL = "mapbox://styles/artsyit/cjrb59mjb2tsq2tqxl17pfoak"
export class GlobalMap extends React.Component<Props, State> {
  map: Mapbox.MapView
  scaleIn: Animated.Value
  scaleOut: Animated.Value

  filters: Tab[] = [
    { id: "all", text: "All" },
    { id: "saved", text: "Saved" },
    { id: "fairs", text: "Fairs" },
    { id: "galleries", text: "Galleries" },
    { id: "museums", text: "Museums" },
  ]
  shows: { [id: string]: Show } = {}

  stylesheet = Mapbox.StyleSheet.create({
    symbol: {
      iconImage: "pin",
      iconSize: Mapbox.StyleSheet.composite(
        {
          0: [0, 0],
          5: [0.5, 0.5],
          12: [1, 1],
        },
        "",
        Mapbox.InterpolationMode.Exponential
      ),
      iconAllowOverlap: true,
    },
  })

  constructor(props) {
    super(props)

    const currentLocation = this.props.initialCoordinates || this.props.viewer.city.coordinates
    const bucketResults = bucketCityResults(props.viewer)
    this.state = {
      activeIndex: 0,
      currentLocation,
      bucketResults,
      trackUserLocation: false,
    }
  }

  componentDidMount() {
    EventEmitter.subscribe("filters:change", activeIndex =>
      this.setState({ activeIndex }, () => this.emitFilteredBucketResults())
    )
  }

  componentWillReceiveProps() {
    this.emitFilteredBucketResults()
  }

  emitFilteredBucketResults() {
    // TODO: map region filtering can live here.
    const filter = this.filters[this.state.activeIndex]
    const {
      city: { name: cityName },
    } = this.props.viewer
    EventEmitter.dispatch("map:change", {
      filter,
      buckets: this.state.bucketResults,
      cityName,
      relay: this.props.relay,
    })
  }

  onAnnotationSelected(showID: string) {
    if (this.state.activeShowID === showID) {
      return
    }

    this.setState({ activeShowID: showID })
  }

  onAnnotationDeselected(showID: string) {
    const nextState: State = { activeIndex: this.state.activeIndex, bucketResults: this.state.bucketResults }

    if (this.state.activeShowID === showID) {
      nextState.activeShowID = null
    }

    this.setState(nextState)
  }

  renderAnnotations() {
    const { city } = this.props.viewer
    return !!city
      ? city.shows.edges
          .map(({ node }) => {
            if (!node || !node.location || !node.location.coordinates) {
              return null
            }

            const { id, location } = node
            const { lat, lng } = location.coordinates
            const selected = id === this.state.activeShowID

            this.shows[id] = node

            return (
              <Mapbox.PointAnnotation
                key={id}
                id={id}
                selected={selected}
                onSelected={() => this.onAnnotationSelected(id)}
                onDeselected={() => this.onAnnotationDeselected(id)}
                coordinate={[lng, lat]}
              >
                <Pin selected={selected} />
              </Mapbox.PointAnnotation>
            )
          })
          .filter(Boolean)
      : []
  }

  renderShowCard() {
    const id = this.state.activeShowID

    const show = this.shows[id]

    return (
      <Spring
        native
        from={{ bottom: -150, progress: 0, opacity: 0 }}
        to={!!id ? { bottom: 0, progress: 1, opacity: 1.0 } : { bottom: -150, progress: 0, opacity: 0 }}
        config={config.stiff}
        precision={1}
      >
        {({ bottom, opacity }) => (
          <AnimatedView
            style={{
              bottom,
              left: 0,
              right: 0,
              height: 106,
              opacity,
            }}
          >
            <Theme>
              <ShowCard show={show as any} />
            </Theme>
          </AnimatedView>
        )}
      </Spring>
    )
  }

  render() {
    const { city } = this.props.viewer
    const { lat: centerLat, lng: centerLng } = this.props.initialCoordinates || city.coordinates

    return (
      <Flex mb={0.5} flexDirection="column">
        <Map
          ref={(c: any) => {
            if (c) {
              this.map = c.root
            }
          }}
          showUserLocation={true}
          styleURL={ArtsyMapStyleURL}
          userTrackingMode={Mapbox.UserTrackingModes.Follow}
          centerCoordinate={[centerLng, centerLat]}
          zoomLevel={13}
          logoEnabled={false}
          attributionEnabled={false}
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
        >
          <SafeAreaView style={{ flex: 1 }}>
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
            <ShowCardContainer>{this.renderShowCard()}</ShowCardContainer>
          </SafeAreaView>
          {this.renderAnnotations()}
        </Map>
      </Flex>
    )
  }
}

export const GlobalMapContainer = createRefetchContainer(
  GlobalMap,
  graphql`
    fragment GlobalMap_viewer on Viewer @argumentDefinitions(near: { type: "Near!" }) {
      city(near: $near) {
        name
        coordinates {
          lat
          lng
        }

        shows(discoverable: true, first: 50, sort: START_AT_ASC) {
          edges {
            node {
              id
              _id
              __id
              name
              status
              href
              is_followed
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

        fairs(first: 10) {
          edges {
            node {
              id
              name

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
  `,
  graphql`
    query GlobalMapRefetchQuery($near: Near) {
      viewer {
        ...GlobalMap_viewer @arguments(near: $near)
      }
    }
  `
)
