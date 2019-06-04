import { color, Flex, space, Spacer } from "@artsy/palette"
import { ImageCarousel_images } from "__generated__/ImageCarousel_images.graphql"
import { devCacheBust } from "lib/utils/devCacheBust"
import React, { useCallback, useEffect, useMemo, useState } from "react"
import { Animated, Dimensions, FlatList, NativeScrollEvent, NativeSyntheticEvent } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"
import { findClosestIndex, getMeasurements } from "./geometry"
import { ImageWithLoadingState } from "./ImageWithLoadingState"

export interface ImageCarouselProps {
  images: ImageCarousel_images
}

const windowWidth = Dimensions.get("window").width
const cardHeight = windowWidth >= 375 ? 340 : 290
export const cardBoundingBox = { width: windowWidth, height: cardHeight }

export const ImageCarousel: React.FC<ImageCarouselProps> = ({ images }) => {
  const measurements = useMemo(() => getMeasurements({ images, boundingBox: cardBoundingBox }), [images])
  const offsets = useMemo(() => measurements.map(m => m.cumulativeScrollOffset), [measurements])

  const [imageIndex, setImageIndex] = useState(0)

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
          const { url } = item.thumbnail || item
          const { cumulativeScrollOffset, ...styles } = measurements[index]
          return <ImageWithLoadingState source={{ uri: devCacheBust(url) }} style={styles} />
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
      thumbnail: resized(width: $screenWidth) {
        width
        height
        url
      }
    }
  `,
})
