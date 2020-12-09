import Mapbox, { CircleLayerStyle, SymbolLayerStyle } from "@react-native-mapbox-gl/maps"
import { isEqual } from "lodash"
import React, { Component } from "react"
import { Animated, StyleProp } from "react-native"
import { BucketKey } from "../bucketCityResults"
import { FilterData } from "../types"

interface Props {
  featureCollections: { [key in BucketKey]: FilterData }
  // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
  onPress?: (nativeEvent) => void
  duration?: number
  filterID: BucketKey
}

interface State {
  pinOpacity: Animated.Value
  clusterOpacity: Animated.Value
  rendered: boolean
}

const singleShowStyle: StyleProp<SymbolLayerStyle> = {
  iconImage: ["get", "icon"],
  iconSize: 0.8,
}

const clusteredPointsStyle: StyleProp<CircleLayerStyle> = {
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

const clusterCountStyle: StyleProp<SymbolLayerStyle> = {
  textField: "{point_count}",
  textSize: 14,
  textColor: "white",
  textFont: ["Unica77 LL Medium"],
  textPitchAlignment: "map",
}

export class ShapeLayer extends Component<Props, State> {
  static defaultProps = {
    duration: 300,
  }

  state = {
    pinOpacity: new Animated.Value(0),
    clusterOpacity: new Animated.Value(0),
    rendered: false,
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
    const collection = featureCollections[filterID].featureCollection

    return (
      <Mapbox.Animated.ShapeSource
        id="shows"
        shape={collection}
        cluster
        clusterRadius={50}
        onPress={this.props.onPress}
      >
        <Mapbox.Animated.SymbolLayer
          id="singleShow"
          filter={["!", "has", "point_count"]}
          // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
          style={[singleShowStyle, { iconOpacity: this.state.pinOpacity }]}
        />
        <Mapbox.Animated.SymbolLayer id="pointCount" style={clusterCountStyle} />
        <Mapbox.Animated.CircleLayer
          id="clusteredPoints"
          belowLayerID="pointCount"
          filter={["has", "point_count"]}
          // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
          style={[clusteredPointsStyle, { circleOpacity: this.state.clusterOpacity }]}
        />
      </Mapbox.Animated.ShapeSource>
    )
  }
}

export const PinsShapeLayer = Animated.createAnimatedComponent(ShapeLayer)
