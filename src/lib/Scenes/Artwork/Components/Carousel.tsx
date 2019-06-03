import { color, Flex, space, Spacer } from "@artsy/palette"
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Animated, Dimensions, FlatList, TouchableWithoutFeedback, View } from "react-native"
import { ImageWithLoadingState } from "./ImageWithLoadingState"

interface CarouselImageProps {
  url: string
  width: number
  height: number
}

interface CarouselItemProps extends CarouselImageProps {
  thumbnail?: CarouselImageProps
}

interface Measurements {
  width: number
  height: number
  marginLeft: number
  marginRight: number
  marginTop: number
  marginBottom: number
  cumulativeScrollOffset: number
}

interface CarouselProps {
  items: ReadonlyArray<CarouselItemProps>
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
function constrainBoxSizeAndCenter(
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

// given an input array of image sources, calculates the dimensions and positions of all the images on the carousel
// rail. boundingBox is the maximum possible size that an image can occupy on the rail
function getMeasurements({ items, boundingBox }: { items: ReadonlyArray<CarouselItemProps>; boundingBox: Box }) {
  const result: Measurements[] = []

  for (let i = 0; i < items.length; i++) {
    const { width, height, marginHorizontal, marginVertical } = constrainBoxSizeAndCenter(boundingBox, items[i])

    // constrain left margin to avoid excess white space between images
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

const now = Date.now()
const devCacheBust = (url: string) => (__DEV__ ? url + "?time=" + now : url)

export const Carousel: React.FC<CarouselProps> = ({ items }) => {
  const measurements = useMemo(
    () => {
      return getMeasurements({ items, boundingBox: cardBoundingBox })
    },
    [items]
  )
  const offsets = useMemo(() => measurements.map(m => m.cumulativeScrollOffset), [measurements])
  const [imageIndex, setImageIndex] = useState(0)

  // update the imageIndex on scroll
  const onScroll = useCallback(
    e => {
      // binary search to find closest element in offsets
      const x = e.nativeEvent.contentOffset.x
      let lowIndex = 0
      let highIndex = offsets.length - 1

      while (highIndex - lowIndex > 1) {
        const midIndex = Math.floor((highIndex + lowIndex) / 2)
        if (x < offsets[midIndex]) {
          highIndex = midIndex
        } else {
          lowIndex = midIndex
        }
      }

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
      <FlatList<CarouselItemProps>
        data={items}
        horizontal
        showsHorizontalScrollIndicator={false}
        scrollEnabled={items.length > 1}
        snapToOffsets={offsets}
        keyExtractor={item => item.url}
        decelerationRate="fast"
        onScroll={onScroll}
        renderItem={({ item, index }) => {
          item = item.thumbnail || item
          const { cumulativeScrollOffset, ...styles } = measurements[index]
          return <ImageWithLoadingState source={{ uri: devCacheBust(item.url) }} style={styles} />
        }}
      />
      <Spacer mb={space(2)} />
      {items.length > 1 && (
        <Flex flexDirection="row" justifyContent="center">
          {items.map((_, index) => (
            <PaginationDot key={index} diameter={5} selected={index === imageIndex} />
          ))}
        </Flex>
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
