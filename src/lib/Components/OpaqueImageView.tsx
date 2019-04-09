import * as PropTypes from "prop-types"
import React from "react"

import {
  ColorPropType,
  LayoutChangeEvent,
  PixelRatio,
  processColor,
  requireNativeComponent,
  StyleSheet,
} from "react-native"

import colors from "lib/data/colors"

const GeminiHost = "d7hftxdivxxvm.cloudfront.net"
const ImageQuality = 80

interface Props {
  /** The URL from where to fetch the image. */
  imageURL?: string

  /** The background colour for the image view */
  placeholderBackgroundColor?: string | number

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
  width?: number | string
  height?: number | string
}

export default class OpaqueImageView extends React.Component<Props, State> {
  // These are only needed because they are exposed to a native component.
  static propTypes: any = {
    imageURL: PropTypes.string,
    aspectRatio: PropTypes.number,
    onLoad: PropTypes.func,
    placeholderBackgroundColor: ColorPropType,
  }

  static defaultProps: Props = {
    placeholderBackgroundColor: colors["gray-regular"],
  }

  constructor(props: Props) {
    super(props)

    // Unless `aspectRatio` was not specified at all, default the ratio to 1 to prevent illegal layout calculations.
    const ratio = props.aspectRatio
    this.state = {
      aspectRatio: ratio === undefined ? undefined : ratio || 1,
    }

    if (__DEV__) {
      const style: React.CSSProperties = StyleSheet.flatten(props.style)
      if (style == null) {
        return
      }
      if (!(this.state.aspectRatio || (style.width && style.height) || (style.height && style.flexGrow))) {
        console.error("[OpaqueImageView] Either an aspect ratio or specific dimensions should be specified.")
      }
    }
  }

  imageURL() {
    const imageURL = this.props.imageURL
    if (imageURL) {
      // Either scale or crop, based on if an aspect ratio is available.
      const type = this.state.aspectRatio ? "fit" : "fill"
      const width = String(this.state.width)
      const height = String(this.state.height)
      // tslint:disable-next-line:max-line-length
      return `https://${GeminiHost}/?resize_to=${type}&width=${width}&height=${height}&quality=${ImageQuality}&src=${encodeURIComponent(
        imageURL
      )}`
    } else {
      return null
    }
  }

  onLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout
    const scale = PixelRatio.get()
    this.setState({
      width: width * scale,
      height: height * scale,
    })
  }

  render() {
    const isLaidOut = !!(this.state.width && this.state.height)
    const { style, ...props } = this.props

    Object.assign(props, {
      aspectRatio: this.state.aspectRatio,
      imageURL: isLaidOut ? this.imageURL() : null,
      onLayout: this.onLayout,
    })

    // If no imageURL is given at all, simply set the placeholder background color as a view backgroundColor style so
    // that it shows immediately.
    let backgroundColorStyle = null
    let remainderProps = props
    if (this.props.imageURL) {
      const anyProps = props as any
      anyProps.placeholderBackgroundColor = processColor(props.placeholderBackgroundColor)
    } else {
      const { placeholderBackgroundColor, ...remainder } = props
      remainderProps = remainder
      backgroundColorStyle = { backgroundColor: props.placeholderBackgroundColor }
    }

    return <NativeOpaqueImageView style={[style, backgroundColorStyle]} {...remainderProps} />
  }
}

const NativeOpaqueImageView = requireNativeComponent("AROpaqueImageView")
