import { color, Flex, space, Spacer } from "@artsy/palette"
import { ImageCarousel_images } from "__generated__/ImageCarousel_images.graphql"
import { devCacheBust } from "lib/utils/devCacheBust"
import React, { useCallback, useEffect, useMemo, useState } from "react"
import { Animated, Dimensions, FlatList } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"
import { ImageWithLoadingState } from "./ImageWithLoadingState"

export interface ImageCarouselProps {
  images: ImageCarousel_images
}

const windowWidth = Dimensions.get("window").width
const cardHeight = windowWidth >= 375 ? 340 : 290
const cardBoundingBox: Box = { width: windowWidth, height: cardHeight }

interface Box {
  width: number
  height: number
}
// places a box (child) in the center of another (container), making the child 'fit' within the container
// without overflowing or changing the child's aspect ratio
function fitInside(
  container: Box,
  child: Box
): { width: number; height: number; marginHorizontal: number; marginVertical: number } {
  const aspectRatio = child.width / child.height

  // start out assuming that we need to constrain the image by height
  let height = container.height
  let width = aspectRatio * container.height

  // check whether we actually need to constrain the image by width
  if (width > container.width) {
    width = container.width
    height = container.width / aspectRatio
  }

  // calculate centering margins
  const marginHorizontal = (container.width - width) / 2
  const marginVertical = (container.height - height) / 2

  return { width, height, marginHorizontal, marginVertical }
}

/**
 * Represents geometric data to position images on the carousel rail
 */
interface ImageMeasurements {
  width: number
  height: number
  marginLeft: number
  marginRight: number
  marginTop: number
  marginBottom: number
  cumulativeScrollOffset: number
}

// given an input array of image sources, calculates the dimensions and positions of all the images on the carousel
// rail. boundingBox is the maximum possible size that an image can occupy on the rail
function getMeasurements({ images, boundingBox }: { images: ImageCarousel_images; boundingBox: Box }) {
  const result: ImageMeasurements[] = []

  for (let i = 0; i < images.length; i++) {
    const { width, height, marginHorizontal, marginVertical } = fitInside(boundingBox, images[i])

    // collapse adjacent margins to avoid excess white space between images
    const marginLeft = i === 0 ? marginHorizontal : Math.max(marginHorizontal - result[i - 1].marginRight, 0)

    // calculate cumulative scroll offset taking collapsed margins into account
    const cumulativeScrollOffset =
      i === 0 ? 0 : result[i - 1].cumulativeScrollOffset + windowWidth - (marginHorizontal - marginLeft)

    result.push({
      width,
      height,
      marginLeft,
      marginRight: marginHorizontal,
      marginTop: marginVertical,
      marginBottom: marginVertical,
      cumulativeScrollOffset,
    })
  }

  return result
}

export const ImageCarousel: React.FC<ImageCarouselProps> = ({ images }) => {
  const measurements = useMemo(() => getMeasurements({ images, boundingBox: cardBoundingBox }), [images])
  const offsets = useMemo(() => measurements.map(m => m.cumulativeScrollOffset), [measurements])

  const [imageIndex, setImageIndex] = useState(0)

  // update the imageIndex on scroll
  const onScroll = useCallback(
    e => {
      // This finds the index of the image which is being given the most
      // screen real estate at any given point in time.
      // It uses a binary search algorithm to find the closest cumulative scroll
      // offset to the scrollX offset of the carousel rail
      const x = e.nativeEvent.contentOffset.x
      let lowIndex = 0
      let highIndex = offsets.length - 1

      // do the binary search to find out which indexes the current rail scroll offset is between
      while (highIndex - lowIndex > 1) {
        const midIndex = Math.floor((highIndex + lowIndex) / 2)
        if (x < offsets[midIndex]) {
          highIndex = midIndex
        } else {
          lowIndex = midIndex
        }
      }

      // select the index to which it is closest
      if (Math.abs(x - offsets[lowIndex]) < Math.abs(x - offsets[highIndex])) {
        setImageIndex(lowIndex)
      } else {
        setImageIndex(highIndex)
      }
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
