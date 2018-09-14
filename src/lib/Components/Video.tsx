import PropTypes from "prop-types"
import React from "react"
import { Dimensions, requireNativeComponent, ViewProperties } from "react-native"

const { width } = Dimensions.get("window")

interface Props extends ViewProperties {
  // FIXME: Remove ?
  source?: {
    uri: string
  }
  size?: {
    width: number
    height: number
  }
}

export class Video extends React.Component<Props> {
  static propTypes = {
    source: PropTypes.shape({
      uri: PropTypes.string,
    }),
    size: PropTypes.shape({
      width: PropTypes.number,
      height: PropTypes.number,
    }),
  }

  render() {
    return (
      <NativeVideo
        source={{ uri: "http://techslides.com/demos/sample-videos/small.mp4" }}
        size={{
          width,
          height: 220,
        }}
        style={{
          left: -20,
        }}
      />
    )
  }
}

const NativeVideo: React.ComponentClass<any> = requireNativeComponent("ARVideo", Video)
