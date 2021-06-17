import React, { useState } from "react"
import FastImage, { FastImageProps } from "react-native-fast-image"
import { Image, LayoutChangeEvent, PixelRatio, Platform, processColor, StyleSheet, View, ViewProps } from "react-native"

import colors from "lib/data/colors"
import { createGeminiUrl } from "./createGeminiUrl"
import { Text } from "palette"

interface Props extends ViewProps {
  /** The URL from where to fetch the image. */
  imageURL: string | null

  /**
   * By default we fetch a resized version of the image from gemini
   * Use this option to prevent that from happening.
   */
  useRawURL?: boolean

  /**
   * By default SDWebImage will not attempt to refetch
   * imageURLs that previously failed
   * Use this option to override that behavior and refetch
   */
  // retryFailedURLs?: boolean
  // mallon mporei na figei

  /** The background color for the image view */
  placeholderBackgroundColor?: string

  width?: number
  height?: number

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
  // onLoad?: () => void

  /**
   * Turn off the fade-in animation
   */
  // noAnimation?: boolean
  // test it sto deep zoom

  /**
   * prevents `onLoad` from being called if the image fails to load
   */
  // failSilently?: boolean
  // test it sto deep zoom

  /**
   * renders the image at a higher threading priority level ('interactive')
   */
  highPriority?: boolean
}

export const OpaqueImageView: React.FC<Props> = ({ placeholderBackgroundColor = colors["gray-regular"], ...props }) => {
  // Unless `aspectRatio` was not specified at all, default the ratio to 1 to prevent illegal layout calculations.
  const aspectRatio = useState(props.aspectRatio === undefined ? undefined : props.aspectRatio ?? 1)
  const [width, setWidth] = useState<number | undefined>()
  const [height, setHeight] = useState<number | undefined>()

  if (__DEV__) {
    const style = StyleSheet.flatten(props.style)
    if (
      !(
        aspectRatio ||
        (style.width && style.height) ||
        (props.width && props.height) ||
        (style.height && style.flexGrow) ||
        style.flex
      )
    ) {
      console.error("[OpaqueImageView] Either an aspect ratio or specific dimensions or flex should be specified.")
      return null
    }
  }

  if (React.Children.count(props.children) > 0) {
    console.error("Please don't add children to a OpaqueImageView. Doesn't work on android.")
    return null
  }

  const imageURL = () => {
    const { imageURL, useRawURL } = props

    if (imageURL) {
      if (useRawURL) {
        return imageURL
      }
      return createGeminiUrl({
        imageURL,
        width: width!,
        height: height!,
        // Either scale or crop, based on if an aspect ratio is available.
        resizeMode: aspectRatio ? "fit" : "fill",
      })
    }

    return null
  }

  // onLayout = (event: LayoutChangeEvent) => {
  //   const { width, height } = event.nativeEvent.layout
  //   console.log("ON LAYOUTTTTT ")
  //   this.setState({
  //     width: width,
  //     height: height,
  //   })
  // }

  // const isLaidOut = !!(this.state.width && this.state.height)
  // const { style, ...props } = this.props

  // Object.assign(props, {
  //   aspectRatio,
  //   // imageURL: isLaidOut ? this.imageURL() : null,
  //   onLayout: this.onLayout,
  // })

  // If no imageURL is given at all, simply set the placeholder background color as a view backgroundColor style so
  // that it shows immediately.
  let backgroundColorStyle = null
  // let remainderProps = props
  // if (Platform.OS === "ios" && this.props.imageURL) {
  //   const anyProps = props as any
  // anyProps.placeholderBackgroundColor = processColor(props.placeholderBackgroundColor)
  // } else {
  //   const { placeholderBackgroundColor, ...remainder } = props
  //   remainderProps = remainder
  //   backgroundColorStyle = { backgroundColor: props.placeholderBackgroundColor }
  // }

  // if (props.imageURL === null) {
  return <View style={{ backgroundColor: "red", width: props.width, height: props.height }} />
  // }
  return (
    <FastImage
      style={{ width: props.width, height: props.height }}
      // style={[style, backgroundColorStyle] as any}
      // {...remainderProps}
      // source={{ uri: remainderProps.imageURL! }}
      source={{
        uri: null,
        //props.imageURL,
        priority: props.highPriority ? "high" : undefined,
      }}
    />
  )

  // return (
  //   <Image
  //     style={[style, backgroundColorStyle] as any}
  //     {...remainderProps}
  //     source={{ uri: remainderProps.imageURL! }}
  //   />
  // )
}

export default OpaqueImageView
