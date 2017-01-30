import * as React from 'react'
import {
  processColor,
  requireNativeComponent,
  PixelRatio,
  ColorPropType,
  StyleSheet
} from 'react-native'

import colors from '../../data/colors'
import { LayoutEvent } from '../system/events'

const GeminiHost = 'd7hftxdivxxvm.cloudfront.net'
const ImageQuality = 85

interface Props {
  /** The URL from where to fetch the image. */
  imageURL?: string

  /** The background colour for the image view */
  placeholderBackgroundColor?: ColorPropType

  /** Any additional styling for the imageview */
  style?: any

  /**
  * An aspect ratio created with: width / height.
  *
  * When specified:
  * - The view will be sized in such a way that it maintains the aspect ratio of the image.
  * - The imageURL will be modified so that it resizes the image to the exact size at which the view has been laid out,
  *   thus never fetching more data than absolutely necessary.
  */
  aspectRatio?: number

  /** A callback that is called once the image is loaded. */
  onLoad?: () => void
}

interface State {
  aspectRatio: number
  width?: number
  height?: number
}

export default class OpaqueImageView extends React.Component<Props, State> {
  static defaultProps: {
    placeholderBackgroundColor: string
  }

  constructor(props: Props) {
    super(props)

    // Unless `aspectRatio` was not specified at all, default the ratio to 1 to prevent illegal layout calculations.
    const ratio = props.aspectRatio
    this.state = {
      aspectRatio: ratio === undefined ? undefined : (ratio || 1),
    }

    if (__DEV__) {
      const style = StyleSheet.flatten(props.style)
      if (style == null) { return }

      if (!(this.state.aspectRatio || (style.width && style.height))) {
        console.error('[OpaqueImageView] Either an aspect ratio or specific dimensions should be specified.')
      }
    }
  }

  imageURL() {
    const imageURL = this.props.imageURL
    if (imageURL) {
      // Either scale or crop, based on if an aspect ratio is available.
      const type = this.state.aspectRatio ? 'fit' : 'fill'
      const width = String(this.state.width)
      const height = String(this.state.height)
      return `https://${GeminiHost}/?resize_to=${type}&width=${width}&height=${height}&quality=${ImageQuality}&src=${encodeURIComponent(imageURL)}`
    } else {
      return null
    }
  }

  onLayout = (event: LayoutEvent) => {
    const { width, height } = event.nativeEvent.layout
    const scale = PixelRatio.get()
    this.setState({
      width: width * scale,
      height: height * scale,
    })
  }

  render() {
    const isLaidOut = !!(this.state.width && this.state.height)
    const { style, placeholderBackgroundColor, ...props } = this.props

    Object.assign(props, {
      aspectRatio: this.state.aspectRatio,
      imageURL: isLaidOut ? this.imageURL() : null,
      onLayout: this.onLayout,
    })

    // If no imageURL is given at all, simply set the placeholder background color as a view backgroundColor style so
    // that it shows immediately.
    let backgroundColorStyle = null
    if (this.props.imageURL) {
      props.placeholderBackgroundColor = processColor(placeholderBackgroundColor)
    } else {
      backgroundColorStyle = { backgroundColor: placeholderBackgroundColor }
    }

    return <NativeOpaqueImageView style={[style, backgroundColorStyle]} {...props} />
  }
}

OpaqueImageView.defaultProps = {
  placeholderBackgroundColor: colors['gray-regular'],
}

OpaqueImageView.propTypes = {
  /**
   * The URL from where to fetch the image.
   */
  imageURL: React.PropTypes.string,

  /**
   * An aspect ratio created with: width / height.
   *
   * When specified:
   * - The view will be sized in such a way that it maintains the aspect ratio of the image.
   * - The imageURL will be modified so that it resizes the image to the exact size at which the view has been laid out,
   *   thus never fetching more data than absolutely necessary.
   */
  aspectRatio: React.PropTypes.number,

  /**
   * A callback that is called once the image is loaded.
   */
  onLoad: React.PropTypes.func,

  placeholderBackgroundColor: ColorPropType,
}

const NativeOpaqueImageView = requireNativeComponent('AROpaqueImageView', OpaqueImageView)
