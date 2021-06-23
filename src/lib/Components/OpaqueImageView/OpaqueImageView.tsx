import colors from "lib/data/colors"
import _ from "lodash"
import React, { useCallback, useRef, useState } from "react"
import { Animated, PixelRatio, StyleSheet, View } from "react-native"
import FastImage, { ImageStyle } from "react-native-fast-image"
import { createGeminiUrl } from "./createGeminiUrl"

interface Props {
  /** The URL from where to fetch the image. */
  imageURL?: string | null

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
  retryFailedURLs?: boolean

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
  onLoad?: () => void

  /**
   * Turn off the fade-in animation
   */
  noAnimation?: boolean
  // TODO: need to test it in deep zoom

  /**
   * prevents `onLoad` from being called if the image fails to load
   */
  failSilently?: boolean
  // TODO: need to test it in deep zoom

  /**
   * renders the image at a higher threading priority level ('interactive')
   */
  highPriority?: boolean

  style?: ImageStyle[] | ImageStyle
}

const useComponentSize = () => {
  const [layoutHeight, setLayoutHeight] = useState(0)
  const [layoutWidth, setLayoutWidth] = useState(0)

  const onLayout = useCallback((event) => {
    const { width, height } = event.nativeEvent.layout
    const scale = PixelRatio.get()
    setLayoutHeight(height * scale)
    setLayoutWidth(width * scale)
  }, [])

  return { layoutHeight, layoutWidth, onLayout }
}

export const OpaqueImageView: React.FC<Props> = ({ placeholderBackgroundColor = colors["gray-regular"], ...props }) => {
  // Unless `aspectRatio` was not specified at all, default the ratio to 1 to prevent illegal layout calculations.
  const aspectRatio = useState(props.aspectRatio === undefined ? undefined : props.aspectRatio ?? 1)
  const { layoutHeight, layoutWidth, onLayout } = useComponentSize()
  const imageScaleValue = useRef(new Animated.Value(0)).current

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

  const getImageURL = () => {
    const { imageURL, useRawURL } = props

    if (imageURL) {
      if (useRawURL) {
        return imageURL
      }
      return createGeminiUrl({
        imageURL,
        width: layoutWidth,
        height: layoutHeight,
        // Either scale or crop, based on if an aspect ratio is available.
        resizeMode: aspectRatio ? "fit" : "fill",
      })
    }

    return
  }

  // If no imageURL is given at all, simply set the placeholder background color as a view backgroundColor style so
  // that it shows immediately.
  const backgroundColorStyle = colors["gray-regular"]

  const onImageLoadEnd = () => {
    if (props.onLoad) {
      props.onLoad()
    }
    if (props.noAnimation) {
      Animated.timing(imageScaleValue, {
        toValue: 0,
        duration: 0.25,
        useNativeDriver: true,
      }).start()
    }
  }

  if (!props.imageURL) {
    return (
      <View
        style={{
          backgroundColor: backgroundColorStyle,
          width: props.width ?? layoutWidth,
          height: props.height ?? layoutHeight,
        }}
      />
    )
  }

  return (
    <FastImage
      {...props}
      onLayout={onLayout}
      style={[
        { height: props.height ?? layoutHeight, width: props.width ?? layoutWidth },
        props.style,
        { backgroundColor: backgroundColorStyle },
      ]}
      source={{
        uri: getImageURL(),
        priority: props.highPriority ? "high" : undefined,
      }}
      onLoadEnd={onImageLoadEnd}
    >
      <Animated.View
        style={[
          { opacity: imageScaleValue },
          { height: props.height, width: props.width },
          props.style,
          { backgroundColor: backgroundColorStyle },
        ]}
      />
    </FastImage>
  )
}

export default OpaqueImageView
