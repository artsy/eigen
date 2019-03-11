import Mapbox from "@mapbox/react-native-mapbox-gl"
import { isEqual } from "lodash"
import React, { Component } from "react"
import { Animated, Easing } from "react-native"
import { MapGeoFeatureCollection } from "../types"

interface Props {
  featureCollection: MapGeoFeatureCollection
  onPress?: (nativeEvent) => void
  duration: number
}

export class ShapeLayer extends Component<Props, any> {
  static defaultProps = {
    duration: 300,
  }

  state = {
    pinOpacity: new Animated.Value(0),
    clusterOpacity: new Animated.Value(0),
    clusterRadius: new Animated.Value(0),
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

  componentWillReceiveProps(newProps: Props) {
    if (!isEqual(this.props.featureCollection.features, newProps.featureCollection.features)) {
      this.fadeInAnimations()
    }
  }

  fadeInAnimations() {
    this.setState(
      {
        pinOpacity: new Animated.Value(0),
        clusterOpacity: new Animated.Value(0),
        clusterRadius: new Animated.Value(0),
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
    return (
      <Mapbox.Animated.ShapeSource
        id="shows"
        shape={this.props.featureCollection}
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
