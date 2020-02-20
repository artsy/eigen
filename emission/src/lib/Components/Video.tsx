import PropTypes from "prop-types"
import React from "react"
import { FlexStyle, requireNativeComponent, StyleProp } from "react-native"
import resolveAssetSource from "react-native/Libraries/Image/resolveAssetSource"

type VideoResizeMode = "contain" | "cover" | "stretch" | "none"

interface VideoProps {
  source: {
    uri: string
  }
  size?: {
    width: number
    height: number
  }
  loop?: boolean
  style?: StyleProp<FlexStyle>
  resizeMode?: VideoResizeMode
}

// Note: This is currently unused in Emission,
// but is useful enough that we may want it again in the future.

export class Video extends React.Component<VideoProps> {
  static propTypes = {
    source: PropTypes.oneOfType([
      PropTypes.shape({
        uri: PropTypes.string,
      }),
      // Opaque type returned by require('./video.mp4')
      PropTypes.number,
    ]).isRequired,
    size: PropTypes.shape({
      width: PropTypes.number,
      height: PropTypes.number,
    }).isRequired,
    loop: PropTypes.bool,
    resizeMode: PropTypes.string,
    style: PropTypes.object,
  }

  static defaultProps: Partial<VideoProps> = {
    loop: true,
    resizeMode: "cover",
  }

  // See https://github.com/react-native-community/react-native-video/blob/master/Video.js#L194

  get source(): {
    uri: string
    isNetwork: boolean
    isAsset: boolean
    type: string
    resizeMode: VideoResizeMode
  } {
    const resizeMode = this.props.resizeMode
    const source = resolveAssetSource(this.props.source) || {}

    let uri = source.uri
    if (uri && uri.match(/^\//)) {
      uri = `file://${uri}`
    }

    const isNetwork = !!(uri && uri.match(/^https?:/))
    const isAsset = !!(uri && uri.match(/^(assets-library|file|content):/))
    const type = source.type || "mp4"

    return {
      uri,
      isNetwork,
      isAsset,
      type,
      resizeMode,
    }
  }

  render() {
    return <NativeVideo {...this.props} source={this.source} />
  }
}

const NativeVideo: React.ComponentClass<any> = requireNativeComponent("ARVideo")
