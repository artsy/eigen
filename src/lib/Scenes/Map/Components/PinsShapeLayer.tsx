import Mapbox from "@mapbox/react-native-mapbox-gl"
import { isEqual } from "lodash"
import React, { Component } from "react"
import { Animated, Easing } from "react-native"
import { BucketKey } from "../bucketCityResults"
import { FilterData, MapGeoFeatureCollection } from "../types"

interface Props {
  featureCollections: { [key in BucketKey]: FilterData }
  onPress?: (nativeEvent) => void
  duration: number
  filterID: string
}

interface State {
  pinOpacity: Animated.Value
  clusterOpacity: Animated.Value
  clusterRadius: Animated.Value
  rendered: boolean
}

export class ShapeLayer extends Component<Props, State> {
  static defaultProps = {
    duration: 300,
  }

  state = {
    pinOpacity: new Animated.Value(0),
    clusterOpacity: new Animated.Value(0),
    clusterRadius: new Animated.Value(0),
    rendered: false,
  }

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

  componentDidMount() {
    this.fadeInAnimations()
  }

  shouldComponentUpdate(nextProps: Props, nextState: State) {
    const { filterID } = this.props

    const getFeatures = (props: Props) =>
      props.featureCollections[filterID].featureCollection.features.map(g => g.is_followed)

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
        clusterRadius: new Animated.Value(0),
        rendered: true,
      },
      () => {
        Animated.timing(this.state.pinOpacity, {
          toValue: 1,
          duration: this.props.duration,
        }).start()

        Animated.timing(this.state.clusterOpacity, {
          toValue: 1,
          duration: this.props.duration,
        }).start()

        Animated.timing(this.state.clusterRadius, {
          toValue: 1,
          duration: this.props.duration,
          easing: Easing.in(Easing.cubic),
        }).start()
      }
    )
  }

  render() {
    const { featureCollections, filterID } = this.props
    const collection: MapGeoFeatureCollection = featureCollections[filterID].featureCollection

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
          filter={["!has", "point_count"]}
          style={[this.stylesheet.singleShow, { iconOpacity: this.state.pinOpacity }]}
        />
        <Mapbox.Animated.SymbolLayer id="pointCount" style={this.stylesheet.clusterCount} />
        <Mapbox.Animated.CircleLayer
          id="clusteredPoints"
          belowLayerID="pointCount"
          filter={["has", "point_count"]}
          style={[this.stylesheet.clusteredPoints, { circleOpacity: this.state.clusterOpacity }]}
        />
      </Mapbox.Animated.ShapeSource>
    )
  }
}

export const PinsShapeLayer = Animated.createAnimatedComponent(ShapeLayer)
