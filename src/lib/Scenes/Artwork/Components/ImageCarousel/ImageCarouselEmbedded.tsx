import { useScreenDimensions } from "lib/utils/useScreenDimensions"
import React, { useCallback, useContext } from "react"
import { FlatList, NativeScrollEvent, NativeSyntheticEvent } from "react-native"
import { isPad } from "../../hardware"
import { findClosestIndex, getMeasurements } from "./geometry"
import { ImageCarouselContext, ImageDescriptor } from "./ImageCarouselContext"
import { ImageWithLoadingState } from "./ImageWithLoadingState"

// This is the main image caoursel visible on the root of the artwork page
export const ImageCarouselEmbedded = () => {
  const screenDimensions = useScreenDimensions()
  // The logic for cardHeight comes from the zeplin spec https://zpl.io/25JLX0Q
  const cardHeight = screenDimensions.width >= 375 ? 340 : 290

  const embeddedCardBoundingBox = { width: screenDimensions.width, height: isPad() ? 460 : cardHeight }

  const {
    images,
    embeddedFlatListRef: embeddedFlatListRef,
    embeddedImageRefs: embeddedImageRefs,
    dispatch,
    imageIndex,
  } = useContext(ImageCarouselContext)

  const measurements = getMeasurements({ images, boundingBox: embeddedCardBoundingBox })
  const offsets = measurements.map(m => m.cumulativeScrollOffset)

  // update the imageIndex on scroll
  const onScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
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
    dispatch({ type: "TAPPED_TO_GO_FULL_SCREEN" })
  }, [dispatch])

  // this exists as a hack to get onPress functionality while the flat list is still coming to a stop after a swipe.
  // without this the user can tap the image to go fullscreen but nothing happens and it feels baaaad.
  const onResponderRelease = useCallback((ev: any) => {
    const { touchBank, indexOfSingleActiveTouch, numberActiveTouches } = ev.touchHistory || ({} as any)
    if (numberActiveTouches !== 0) {
      return
    }

    // here we basically find out how long the press took and how far it travelled
    // if either of those is above a certain threshold then we don't condiser it a 'tap'.

    const info = touchBank[indexOfSingleActiveTouch]

    const duration = info.currentTimeStamp - info.startTimeStamp

    const distance = Math.sqrt(
      Math.pow(info.currentPageX - info.startPageX, 2) + Math.pow(info.currentPageY - info.startPageY, 2)
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
      data={images}
      horizontal
      ref={embeddedFlatListRef}
      showsHorizontalScrollIndicator={false}
      scrollEnabled={images.length > 1}
      getItemLayout={(_, index) => ({ index, offset: offsets[index], length: embeddedCardBoundingBox.width })}
      snapToOffsets={offsets}
      keyExtractor={item => item.url}
      decelerationRate="fast"
      onScroll={onScroll}
      scrollEventThrottle={50}
      onResponderRelease={onResponderRelease}
      initialNumToRender={Math.min(images.length, 20)}
      renderItem={({ item, index }) => {
        const { cumulativeScrollOffset, ...styles } = measurements[index]
        return (
          <ImageWithLoadingState
            imageURL={item.url}
            width={styles.width}
            height={styles.height}
            onPress={goFullScreen}
            // make sure first image loads first
            highPriority={index === 0}
            ref={ref => {
              embeddedImageRefs[index] = ref
            }}
            style={[styles, images.length === 1 ? { marginTop: 0, marginBottom: 0 } : {}]}
          />
        )
      }}
    />
  )
}
