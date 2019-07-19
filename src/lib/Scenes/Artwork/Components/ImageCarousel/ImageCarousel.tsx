import { color, Flex, space, Spacer } from "@artsy/palette"
import { ImageCarousel_images } from "__generated__/ImageCarousel_images.graphql"
import { devCacheBust } from "lib/utils/devCacheBust"
import { Schema } from "lib/utils/track"
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Animated, Dimensions, FlatList, NativeScrollEvent, NativeSyntheticEvent } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"
import { useTracking } from "react-tracking"
import { findClosestIndex, getMeasurements } from "./geometry"
import { ImageWithLoadingState } from "./ImageWithLoadingState"

export interface ImageCarouselProps {
  images: ImageCarousel_images
}

const windowWidth = Dimensions.get("window").width
// The logic for cardHeight comes from the zeplin spec https://zpl.io/25JLX0Q
const cardHeight = windowWidth >= 375 ? 340 : 290
export const cardBoundingBox = { width: windowWidth, height: cardHeight }

const usePrevious = value => {
  const ref = useRef()
  useEffect(
    () => {
      ref.current = value
    },
    [value]
  )
  return ref.current
}

/**
 * ImageCarousel
 * NOTE: This component currently assumes it is being rendered at the full width of the screen.
 * To use it in places where this is not desirable it would need to take explicit width and height props
 * and use those to calculate a dynamic version of cardBoundingBox and perhaps other geometric quantities.
 */
export const ImageCarousel: React.FC<ImageCarouselProps> = ({ images }) => {
  const tracking = useTracking()
  const measurements = useMemo(() => getMeasurements({ images, boundingBox: cardBoundingBox }), [images])
  const offsets = useMemo(() => measurements.map(m => m.cumulativeScrollOffset), [measurements])

  const [imageIndex, setImageIndex] = useState(0)
  const prevImageIndex = usePrevious(imageIndex)

  // Track swipe when index updates
  useEffect(
    () => {
      if (prevImageIndex && imageIndex !== prevImageIndex) {
        tracking.trackEvent({
          action_name: Schema.ActionNames.ArtworkImageSwipe,
          action_type: Schema.ActionTypes.Swipe,
          context_module: Schema.ContextModules.ArtworkImage,
        })
      }
    },
    [imageIndex]
  )

  // update the imageIndex on scroll
  const onScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      // This finds the index of the image which is being given the most
      // screen real estate at any given point in time.
      setImageIndex(findClosestIndex(offsets, e.nativeEvent.contentOffset.x))
    },
    [setImageIndex, offsets]
  )

  return (
    <Flex>
      <FlatList<ImageCarousel_images[number]>
        data={images}
        horizontal
        showsHorizontalScrollIndicator={false}
        scrollEnabled={images.length > 1}
        snapToOffsets={offsets}
        keyExtractor={item => item.url}
        decelerationRate="fast"
        onScroll={onScroll}
        renderItem={({ item, index }) => {
          const { cumulativeScrollOffset, ...styles } = measurements[index]
          return (
            <ImageWithLoadingState
              imageURL={devCacheBust(item.url)}
              width={styles.width}
              height={styles.height}
              style={styles}
            />
          )
        }}
      />
      {images.length > 1 && (
        <>
          <Spacer mb={space(2)} />
          <Flex flexDirection="row" justifyContent="center">
            {images.map((_, index) => (
              <PaginationDot key={index} diameter={5} selected={index === imageIndex} />
            ))}
          </Flex>
        </>
      )}
    </Flex>
  )
}

const PaginationDot: React.FC<{ diameter: number; selected: boolean }> = ({ diameter, selected }) => {
  const animatedValues = useMemo(() => {
    const toggle = new Animated.Value(selected ? 1 : 0)
    const dotColor = toggle.interpolate({
      inputRange: [0, 1],
      outputRange: [color("black10"), "black"],
    })
    return { toggle, dotColor }
  }, [])

  useEffect(
    () => {
      Animated.spring(animatedValues.toggle, {
        toValue: selected ? 1 : 0,
      }).start()
    },
    [selected]
  )

  return (
    <Animated.View
      style={{
        marginHorizontal: diameter * 0.8,
        borderRadius: diameter / 2,
        width: diameter,
        height: diameter,
        backgroundColor: animatedValues.dotColor,
      }}
    />
  )
}

export const ImageCarouselFragmentContainer = createFragmentContainer(ImageCarousel, {
  images: graphql`
    fragment ImageCarousel_images on Image @relay(plural: true) {
      url
      width
      height
    }
  `,
})
