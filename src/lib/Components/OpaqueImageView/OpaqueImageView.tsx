import * as PropTypes from "prop-types"
import React from "react"

import {
  ColorPropType,
  LayoutChangeEvent,
  NativeModules,
  PixelRatio,
  processColor,
  requireNativeComponent,
  StyleSheet,
} from "react-native"

import colors from "lib/data/colors"
import { createGeminiUrl } from "./createGeminiUrl"

const { AROpaqueImageViewManager } = NativeModules

interface Props {
  /** The URL from where to fetch the image. */
  imageURL?: string

  /**
   * By default we fetch a resized version of the image from gemini
   * Use this option to prevent that from happening.
   */
  useRawURL?: boolean

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

  /**
   * Turn off the fade-in animation
   */
  noAnimation?: boolean

  /**
   * prevents `onLoad` from being called if the image fails to load
   */
  failSilently?: boolean

  /**
   * renders the image at a higher threading priority level ('interactive')
   */
  highPriorty?: boolean
}

interface State {
  aspectRatio: number
  width?: number
  height?: number
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

  /**
   * Given a list of URLs, prefetches them in the background.
   * @param urls
   */
  static prefetch(urls: string[]) {
    AROpaqueImageViewManager.prefetch(urls)
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
    const { imageURL, useRawURL } = this.props

    if (imageURL) {
      if (useRawURL) {
        return imageURL
      }
      return createGeminiUrl({
        imageURL,
        width: this.state.width,
        height: this.state.height,
        // Either scale or crop, based on if an aspect ratio is available.
        resizeMode: this.state.aspectRatio ? "fit" : "fill",
      })
    }

    return null
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
