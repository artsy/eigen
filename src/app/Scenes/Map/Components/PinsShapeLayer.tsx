import MapboxGL, {
  CircleLayerStyle,
  ShapeSourceProps,
  SymbolLayerStyle,
} from "@react-native-mapbox-gl/maps"
import { isEqual } from "lodash"
import React, { Component } from "react"
import { Animated, StyleProp } from "react-native"
import { BucketKey } from "../bucketCityResults"
import { FilterData } from "../types"

interface Props {
  featureCollections: { [key in BucketKey]: FilterData } | {}
  onPress?: ShapeSourceProps["onPress"]
  duration?: number
  filterID: string
}

interface State {
  pinOpacity: Animated.Value
  clusterOpacity: Animated.Value
  rendered: boolean
}

export class PinsShapeLayer extends Component<Props, State> {
  static defaultProps = {
    duration: 300,
  }

  state = {
    pinOpacity: new Animated.Value(0),
    clusterOpacity: new Animated.Value(0),
    rendered: false,
  }

  singleShowStyle: StyleProp<SymbolLayerStyle> = {
    iconImage: ["get", "icon"],
    iconSize: 0.8,
  }

  clusteredPointsStyle: StyleProp<CircleLayerStyle> = {
    circlePitchAlignment: "map",
    circleColor: "black",

    // prettier-ignore
    circleRadius: [
          "step",
          ["get", "point_count"],
              15,
           5, 20,
          30, 30,
        ],
  }

  clusterCountStyle: StyleProp<SymbolLayerStyle> = {
    textField: "{point_count}",
    textSize: 14,
    textColor: "white",
    textFont: ["Unica77 LL Medium"],
    textPitchAlignment: "map",
  }

  componentDidMount() {
    this.fadeInAnimations()
  }

  shouldComponentUpdate(nextProps: Props, nextState: State) {
    const { filterID } = this.props

    const getFeatures = (props: Props) =>
      // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
      props.featureCollections[filterID].featureCollection.features.map((g) => g.is_followed)

    return (
      !isEqual(getFeatures(nextProps), getFeatures(this.props)) ||
      this.state.rendered !== nextState.rendered ||
      this.props.filterID !== nextProps.filterID
    )
  }

  fadeInAnimations() {
    this.setState(
      {
        pinOpacity: new Animated.Value(0),
        clusterOpacity: new Animated.Value(0),
        rendered: true,
      },
      () => {
        Animated.timing(this.state.pinOpacity, {
          toValue: 1,
          duration: this.props.duration,
          // mapbox opacities are not animatable with native driver for some reason
          useNativeDriver: false,
        }).start()

        Animated.timing(this.state.clusterOpacity, {
          toValue: 1,
          duration: this.props.duration,
          // mapbox opacities are not animatable with native driver for some reason
          useNativeDriver: false,
        }).start()
      }
    )
  }

  render() {
    const { featureCollections, filterID } = this.props
    // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
    const collection: MapGeoFeatureCollection = featureCollections[filterID].featureCollection

    return (
      <MapboxGL.Animated.ShapeSource
        id="shows"
        shape={collection}
        cluster
        clusterRadius={50}
        onPress={this.props.onPress}
      >
        <MapboxGL.Animated.SymbolLayer
          id="singleShow"
          filter={["!", ["has", "point_count"]]}
          // @ts-ignore
          style={[this.singleShowStyle, { iconOpacity: this.state.pinOpacity }]}
        />
        <MapboxGL.Animated.SymbolLayer id="pointCount" style={this.clusterCountStyle} />
        <MapboxGL.Animated.CircleLayer
          id="clusteredPoints"
          belowLayerID="pointCount"
          filter={["has", "point_count"]}
          // @ts-ignore
          style={[this.clusteredPointsStyle, { circleOpacity: this.state.clusterOpacity }]}
        />
      </MapboxGL.Animated.ShapeSource>
    )
  }
}
