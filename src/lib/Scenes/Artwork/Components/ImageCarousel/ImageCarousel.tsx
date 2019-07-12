import { color, Flex, space, Spacer } from "@artsy/palette"
import { ImageCarousel_images } from "__generated__/ImageCarousel_images.graphql"
import { createGeminiUrl } from "lib/Components/OpaqueImageView"
import React, { useCallback, useEffect, useMemo, useState } from "react"
import { Animated, Dimensions, FlatList, NativeScrollEvent, NativeSyntheticEvent } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"
import { findClosestIndex, getMeasurements } from "./geometry"
import { ImageCarouselFullScreen } from "./ImageCarouselFullScreen"
import { ImageWithLoadingState } from "./ImageWithLoadingState"

export interface ImageCarouselProps {
  images: ImageCarousel_images
}

const windowWidth = Dimensions.get("window").width
// The logic for cardHeight comes from the zeplin spec https://zpl.io/25JLX0Q
const cardHeight = windowWidth >= 375 ? 340 : 290
export const cardBoundingBox = { width: windowWidth, height: cardHeight }

/**
 * ImageCarousel
 * NOTE: This component currently assumes it is being rendered at the full width of the screen.
 * To use it in places where this is not desirable it would need to take explicit width and height props
 * and use those to calculate a dynamic version of cardBoundingBox and perhaps other geometric quantities.
 */
export const ImageCarousel: React.FC<ImageCarouselProps> = props => {
  const images = useMemo(
    () =>
      props.images.map(image => ({
        ...image,
        url: createGeminiUrl({
          imageURL: image.url,
          width: image.width,
          height: image.height,
        }),
      })),
    [props.images]
  )
  const measurements = useMemo(() => getMeasurements({ images, boundingBox: cardBoundingBox }), [images])
  const offsets = useMemo(() => measurements.map(m => m.cumulativeScrollOffset), [measurements])
  const imageRefs = useMemo(() => [], [])

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

  const [fullScreen, setFullScreen] = useState(false)

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
              imageURL={item.url}
              width={styles.width}
              height={styles.height}
              onPress={() => setFullScreen(true)}
              ref={ref => {
                imageRefs[index] = ref
              }}
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
      {fullScreen && (
        <ImageCarouselFullScreen
          imageIndex={imageIndex}
          setImageIndex={setImageIndex}
          baseImageRef={imageRefs[imageIndex]}
          images={images}
          onClose={() => setFullScreen(false)}
        />
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
