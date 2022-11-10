import * as Sentry from "@sentry/react-native"
import querystring from "querystring"
import { isPad } from "app/utils/hardware"
import React, { useCallback, useContext } from "react"
import { Animated, FlatList, NativeScrollEvent, NativeSyntheticEvent, Platform } from "react-native"
import { useScreenDimensions } from "shared/hooks"

import { findClosestIndex, getMeasurements } from "./geometry"
import { ImageCarouselContext, ImageDescriptor } from "./ImageCarouselContext"
import { ImageWithLoadingState } from "./ImageWithLoadingState"
import { Vimeo } from "react-native-vimeo-iframe"
import { Box } from "palette"

interface ImageCarouselEmbeddedProps {
  cardHeight: number
  disableFullScreen?: boolean
  onImagePressed?: () => void
}

// This is the main image caoursel visible on the root of the artwork page
export const ImageCarouselEmbedded: React.FC<ImageCarouselEmbeddedProps> = ({
  cardHeight,
  disableFullScreen = false,
  onImagePressed,
}) => {
  const screenDimensions = useScreenDimensions()

  const embeddedCardBoundingBox = {
    width: screenDimensions.width,
    height: isPad() ? 460 : cardHeight,
  }

  const {
    media,
    embeddedFlatListRef: embeddedFlatListRef,
    embeddedImageRefs: embeddedImageRefs,
    xScrollOffsetAnimatedValue: xScrollOffsetAnimatedValue,
    dispatch,
    imageIndex,
  } = useContext(ImageCarouselContext)

  const measurements = getMeasurements({ images: media, boundingBox: embeddedCardBoundingBox })
  const offsets = measurements.map((m) => m.cumulativeScrollOffset)

  const scrollEnabled = media.length > 1

  // update the imageIndex on scroll
  const onScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (scrollEnabled) {
        Animated.spring(xScrollOffsetAnimatedValue.current!, {
          toValue: e.nativeEvent.contentOffset.x / Math.max(...offsets),
          useNativeDriver: true,
          speed: 20,
        }).start()
      }
      // This finds the index of the image which is being given the most
      // screen real estate at any given point in time.
      const nextImageIndex = findClosestIndex(offsets, e.nativeEvent.contentOffset.x)
      if (nextImageIndex !== imageIndex.current) {
        dispatch({
          type: "IMAGE_INDEX_CHANGED",
          nextImageIndex,
        })
      }
    },
    [offsets]
  )

  const goFullScreen = useCallback(() => {
    onImagePressed?.()
    if (Platform.OS === "ios" && !disableFullScreen) {
      dispatch({ type: "TAPPED_TO_GO_FULL_SCREEN" })
    }
  }, [dispatch])

  // this exists as a hack to get onPress functionality while the flat list is still coming to a stop after a swipe.
  // without this the user can tap the image to go fullscreen but nothing happens and it feels baaaad.
  const onResponderRelease = useCallback((ev: any) => {
    const { touchBank, indexOfSingleActiveTouch, numberActiveTouches } =
      ev.touchHistory || ({} as any)
    if (numberActiveTouches !== 0) {
      return
    }

    // here we basically find out how long the press took and how far it travelled
    // if either of those is above a certain threshold then we don't condiser it a 'tap'.

    const info = touchBank[indexOfSingleActiveTouch]

    // We were seeing a very rare exception thrown in production where info would be undefined here
    // https://artsyproduct.atlassian.net/browse/MX-161
    if (!info) {
      if (!__DEV__) {
        Sentry.withScope((scope) => {
          scope.setExtra(touchBank, indexOfSingleActiveTouch)
          Sentry.captureMessage("touchBank has unexpected structure")
        })
      }
      return
    }

    const duration = info.currentTimeStamp - info.startTimeStamp

    const distance = Math.sqrt(
      Math.pow(info.currentPageX - info.startPageX, 2) +
        Math.pow(info.currentPageY - info.startPageY, 2)
    )

    if (distance > 5) {
      return
    }
    if (duration > 150) {
      return
    }

    goFullScreen()
  }, [])

  return (
    <FlatList<ImageDescriptor>
      // force full re-render on orientation change
      key={screenDimensions.orientation}
      data={media}
      horizontal
      ref={embeddedFlatListRef}
      showsHorizontalScrollIndicator={false}
      scrollEnabled={scrollEnabled}
      getItemLayout={(_, index) => ({
        index,
        offset: offsets[index],
        length: embeddedCardBoundingBox.width,
      })}
      snapToOffsets={offsets}
      // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
      keyExtractor={(item) => item.url ?? item.playerUrl}
      decelerationRate="fast"
      onScroll={onScroll}
      scrollEventThrottle={50}
      onResponderRelease={onResponderRelease}
      accessibilityLabel="Image Carousel"
      initialNumToRender={Math.min(media.length, 20)}
      renderItem={({ item, index }) => {
        const { cumulativeScrollOffset, ...styles } = measurements[index]

        if (item.__typename === "Video") {
          const { videoId, width, height, token } = extractVimeoData(item.playerUrl)
          //player.vimeo.com/video/767444845?h=5ad7aa84ee&width=400&height=300'

          return (
            <Box background={"black"} width={styles.width} height={styles.height}>
              <Vimeo videoId={videoId} params={`h=${token}`} />
            </Box>
          )
        }

        return (
          <ImageWithLoadingState
            // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
            imageURL={item.url}
            width={styles.width}
            height={styles.height}
            onPress={goFullScreen}
            // make sure first image loads first
            highPriority={index === 0}
            ref={(ref) => {
              embeddedImageRefs[index] = ref! /* STRICTNESS_MIGRATION */
            }}
            style={[styles, media.length === 1 ? { marginTop: 0, marginBottom: 0 } : {}]}
          />
        )
      }}
    />
  )
}

const extractVimeoData = (playerUrl: string) => {
  const [url, queryParams] = playerUrl.split("?")
  const videoId = url.replace("https://player.vimeo.com/video/", "")
  const params = querystring.parse("?" + queryParams)

  return {
    videoId,
    token: params["?h"],
    width: params.width,
    height: params.height,
  }
}
