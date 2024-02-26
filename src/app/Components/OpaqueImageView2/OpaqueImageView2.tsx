import { Image, Text, useColor } from "@artsy/palette-mobile"
import { createGeminiUrl } from "app/Components/OpaqueImageView/createGeminiUrl"
import { useDevToggle } from "app/utils/hooks/useDevToggle"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { isNumber, isString } from "lodash"
import React, { useCallback, useRef, useState } from "react"
import { Animated, ColorValue, PixelRatio, StyleSheet, View } from "react-native"
import FastImage, { ImageStyle } from "react-native-fast-image"

interface Props {
  /** The URL from where to fetch the image. */
  imageURL?: string | null

  /** BlurHash code */
  blurhash?: string | null | undefined

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
  placeholderBackgroundColor?: ColorValue

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

  testID?: string
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

/**
 * @deprecated
 * Use `Image` from palette instead.
 */
export const OpaqueImageView: React.FC<Props> = ({ aspectRatio, ...props }) => {
  const usePaletteImage = useFeatureFlag("ARUsePaletteImage")

  const color = useColor()
  const { layoutHeight, layoutWidth, onLayout } = useComponentSize()
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const isDebugModeEnabled = useDevToggle("DTEnableNewImageLabel")

  const imageScaleValue = useRef(new Animated.Value(0)).current
  const style = StyleSheet.flatten(props.style) ?? {}

  const getActualDimensions = useCallback(() => {
    if (props.height && props.width) {
      return [props.width, props.height]
    }
    if (style.height && style.width) {
      return [Number(style.width), Number(style.height)]
    }
    const width = props.width ?? style.width
    if (isNumber(width)) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return [width, width / aspectRatio!]
    }
    if (isString(width)) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return [layoutWidth, layoutWidth / aspectRatio!]
    }
    const height = props.height ?? style.height
    if (isNumber(height)) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return [height * aspectRatio!, height]
    }
    if (isString(height)) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return [layoutHeight * aspectRatio!, layoutHeight]
    }
    return [layoutWidth, layoutHeight]
  }, [props.height, props.width, style.width, style.height, aspectRatio, layoutHeight, layoutWidth])

  const [fIWidth, fIHeight] = getActualDimensions()

  if (__DEV__) {
    if (
      !(
        (style.width && style.height) ||
        (props.width && props.height) ||
        (aspectRatio && (style.height || props.height)) ||
        (aspectRatio && (style.width || props.width))
      )
    ) {
      console.error(
        "[OpaqueImageView2] Either an aspect ratio or specific dimensions or flex should be specified."
      )
      return <View style={{ height: 100, width: 100, backgroundColor: "red" }} />
    }
  }

  if (React.Children.count(props.children) > 0) {
    console.error("Please don't add children to a OpaqueImageView. Doesn't work on android.")
    return <View style={{ height: 100, width: 100, backgroundColor: "red" }} />
  }

  const getImageURL = () => {
    const { imageURL, useRawURL } = props

    if (!layoutHeight || !layoutWidth) {
      return
    }

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

  if (usePaletteImage && props.imageURL) {
    return (
      <Image
        src={props.imageURL}
        geminiResizeMode={aspectRatio ? "fit" : "fill"}
        performResize={props.useRawURL}
        height={fIHeight}
        width={fIWidth}
        blurhash={props.blurhash}
        aspectRatio={aspectRatio}
        testID={props.testID}
      />
    )
  }

  // If no imageURL is given at all, simply set the placeholder background color as a view backgroundColor style so
  // that it shows immediately.
  const backgroundColorStyle = color("black10")

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

  const fastImageStyle = [{ height: fIHeight, width: fIWidth }, props.style]
  const debugBorderStyles = isDebugModeEnabled
    ? { borderTopWidth: 2, borderColor: color("devpurple") }
    : {}

  return (
    <View onLayout={onLayout} style={[fastImageStyle, debugBorderStyles]}>
      {!!isDebugModeEnabled && (
        <View style={{ position: "absolute", zIndex: 1000, top: "50%" }}>
          <Text weight="medium" italic variant="xl" color="devpurple">
            NewImg
          </Text>
        </View>
      )}
      <FastImage
        {...props}
        style={[
          { position: "absolute" },
          { backgroundColor: backgroundColorStyle },
          ...fastImageStyle,
        ]}
        source={{
          uri: getImageURL(),
          priority: props.highPriority ? "high" : undefined,
        }}
        onLoadEnd={onImageLoadEnd}
      />
      <Animated.View
        style={[
          { position: "absolute", opacity: imageScaleValue, backgroundColor: backgroundColorStyle },
          ...fastImageStyle,
        ]}
      />
    </View>
  )
}

export default OpaqueImageView
