import PropTypes from "prop-types"
import React from "react"
import { FlexStyle, requireNativeComponent, StyleProp } from "react-native"

interface VideoProps {
  source: {
    uri: string
  }
  size?: {
    width: number
    height: number
  }
  style?: StyleProp<FlexStyle>
}

export class Video extends React.Component<VideoProps> {
  static propTypes = {
    source: PropTypes.shape({
      uri: PropTypes.string,
    }).isRequired,
    size: PropTypes.shape({
      width: PropTypes.number,
      height: PropTypes.number,
    }).isRequired,
    style: PropTypes.object,
  }

  render() {
    return <NativeVideo {...this.props} />
  }
}

const NativeVideo: React.ComponentClass<any> = requireNativeComponent("ARVideo", Video)
