import * as Sentry from "@sentry/react-native"
import { ImageCarouselVimeoVideo } from "app/Scenes/Artwork/Components/ImageCarousel/ImageCarouselVimeoVideo"
import { GlobalStore } from "app/store/GlobalStore"
import { isPad } from "app/utils/hardware"
import { useScreenDimensions } from "app/utils/hooks"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import React, { useCallback, useContext } from "react"
import {
  Animated,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  View,
} from "react-native"
import { ImageCarouselContext, ImageCarouselMedia, ImageDescriptor } from "./ImageCarouselContext"
import { ImageWithLoadingState } from "./ImageWithLoadingState"
import { findClosestIndex, getMeasurements, ImageMeasurements } from "./geometry"

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
  const enableAndroidImagesGallery = useFeatureFlag("AREnableAndroidImagesGallery")
  const { setIsDeepZoomModalVisible } = GlobalStore.actions.devicePrefs

  const embeddedCardBoundingBox = {
    width: screenDimensions.width,
    height: isPad() ? 460 : cardHeight,
  }

  const {
    media,
    images,
    embeddedFlatListRef: embeddedFlatListRef,
    embeddedImageRefs: embeddedImageRefs,
    xScrollOffsetAnimatedValue: xScrollOffsetAnimatedValue,
    dispatch,
    imageIndex,
  } = useContext(ImageCarouselContext)

  const measurements = getMeasurements({ media, boundingBox: embeddedCardBoundingBox })
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
    if (
      (Platform.OS === "ios" && !disableFullScreen) ||
      (Platform.OS === "android" && !!enableAndroidImagesGallery && !disableFullScreen)
    ) {
      dispatch({ type: "TAPPED_TO_GO_FULL_SCREEN" })
      // This is here to avoid a bug where the modal would show up with the dev menu at the same
      // time while in dev. This won't happen in prod for users though
      if (Platform.OS === "android") {
        setIsDeepZoomModalVisible(true)
      }
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
    <FlatList<ImageCarouselMedia>
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
      keyExtractor={(item) => item.url!}
      decelerationRate="fast"
      onScroll={onScroll}
      scrollEventThrottle={50}
      onResponderRelease={onResponderRelease}
      accessibilityLabel="Image Carousel"
      initialNumToRender={Math.min(media.length, 20)}
      renderItem={({ item, index }) => {
        return (
          <EmbeddedItem
            item={item}
            index={index}
            measurements={measurements}
            embeddedCardBoundingBox={embeddedCardBoundingBox}
            goFullScreen={goFullScreen}
            embeddedImageRefs={embeddedImageRefs}
            images={images}
          />
        )
      }}
    />
  )
}

const EmbeddedItem: React.FC<{
  item: ImageCarouselMedia
  index: number
  measurements: ImageMeasurements[]
  embeddedImageRefs: View[]
  embeddedCardBoundingBox: { width: number; height: number }
  images: ImageDescriptor[]
  goFullScreen: () => void
}> = ({
  item,
  index,
  measurements,
  embeddedCardBoundingBox,
  goFullScreen,
  embeddedImageRefs,
  images,
}) => {
  const { ...styles } = measurements[index]

  if (item.__typename === "Video") {
    return (
      <ImageCarouselVimeoVideo
        width={styles.width}
        height={styles.height}
        maxHeight={embeddedCardBoundingBox.height}
        vimeoUrl={item.url!}
      />
    )
  }

  if (!item.url) {
    return null
  }

  return (
    <ImageWithLoadingState
      imageURL={item.resized?.src || item.url!}
      width={styles.width}
      height={styles.height}
      onPress={goFullScreen}
      // make sure first image loads first
      highPriority={index === 0}
      ref={(ref) => {
        embeddedImageRefs[index] = ref! /* STRICTNESS_MIGRATION */
      }}
      style={[styles, images.length === 1 ? { marginTop: 0, marginBottom: 0 } : {}]}
    />
  )
}
