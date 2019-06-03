import { color, Flex, space, Spacer } from "@artsy/palette"
import Spinner from "lib/Components/Spinner"
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import {
  Animated,
  Dimensions,
  FlatList,
  Image,
  ImageBackground,
  ImageProps,
  Modal,
  ScrollView,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native"

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
  cumulativeOffset: number
}

interface CarouselProps {
  items: ReadonlyArray<CarouselItemProps>
}

const screenHeight = Dimensions.get("screen").height
const windowWidth = Dimensions.get("window").width
const windowHeight = Dimensions.get("window").height
const cardHeight = windowWidth >= 375 ? 340 : 290
const cardBoundingBox = { width: windowWidth, height: cardHeight }
const windowBoundingBox = { width: windowWidth, height: windowHeight }

function getMeasurements({
  item,
  boundingBox,
}: {
  item: CarouselItemProps
  boundingBox: {
    width: number
    height: number
  }
}) {
  const aspectRatio = item.width / item.height

  let height = boundingBox.height
  let width = aspectRatio * boundingBox.height

  if (width > boundingBox.width) {
    width = boundingBox.width
    height = boundingBox.width / aspectRatio
  }

  const horizontalMargin = (boundingBox.width - width) / 2
  const verticalMargin = (boundingBox.height - height) / 2

  return {
    width,
    height,
    marginLeft: horizontalMargin,
    marginRight: horizontalMargin,
    marginTop: verticalMargin,
    marginBottom: verticalMargin,
  }
}

export function FullScreenCarousel({
  items,
  onDismiss,
  imageIndex,
  setImageIndex,
}: CarouselProps & {
  imageIndex: number
  setImageIndex(index: number): void
  onDismiss(): void
}) {
  const onScroll = useCallback(
    e => {
      const index = Math.round(e.nativeEvent.contentOffset.x / windowWidth)
      setImageIndex(index)
    },
    [setImageIndex]
  )

  const opacity = useMemo(() => new Animated.Value(0), [])
  // fade in
  useEffect(() => {
    Animated.spring(opacity, {
      toValue: 1,
      useNativeDriver: true,
    }).start()
  }, [])

  return (
    <Modal transparent>
      <Animated.View style={{ opacity, zIndex: 1 }}>
        <FlatList<CarouselItemProps>
          data={items}
          horizontal
          bounces={false}
          showsHorizontalScrollIndicator={false}
          snapToInterval={windowWidth}
          decelerationRate="fast"
          keyExtractor={item => item.url}
          onScroll={onScroll}
          initialScrollIndex={imageIndex}
          getItemLayout={(_item, index: number) => ({ length: windowWidth, offset: windowWidth * index, index })}
          renderItem={({ item }) => {
            const { width, height } = getMeasurements({
              item,
              boundingBox: windowBoundingBox,
            })
            return (
              <ScrollView
                bounces={false}
                overScrollMode="never"
                minimumZoomScale={1}
                maximumZoomScale={4}
                centerContent
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                style={{ height: screenHeight, backgroundColor: "white" }}
              >
                <Image
                  style={{
                    width,
                    height,
                  }}
                  source={{ uri: item.url }}
                />
              </ScrollView>
            )
          }}
        />
      </Animated.View>
    </Modal>
  )
}

function useImageLoadingState(): { isLoading: boolean; error: boolean } & Partial<ImageProps> {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)
  return {
    isLoading,
    error,
    onLoadStart() {
      setIsLoading(true)
    },
    onLoadEnd() {
      setIsLoading(false)
    },
    onError() {
      setError(true)
    },
  }
}

const now = Date.now()
const cacheBust = (url: string) => (__DEV__ ? url + "?time=" + now : url)

const ImageWithLoadingState: React.FC<ImageProps> = ({ ...props }) => {
  const { isLoading, error, ...loadingProps } = useImageLoadingState()

  return (
    <ImageBackground
      {...props}
      style={{ ...(props.style as any), alignItems: "center", justifyContent: "center" }}
      {...loadingProps}
    >
      {error ? <Text>Failed to load</Text> : isLoading ? <Spinner /> : null}
    </ImageBackground>
  )
}

export const Carousel: React.FC<CarouselProps> = ({ items }) => {
  const measurements = useMemo(
    () => {
      const result: Measurements[] = []
      for (let item of items) {
        item = item.thumbnail || item
        const sizes = getMeasurements({ item, boundingBox: cardBoundingBox })
        if (result.length === 0) {
          result.push({ ...sizes, cumulativeOffset: 0 })
        } else {
          const prev = result[result.length - 1]
          const marginLeft = Math.max(sizes.marginLeft - prev.marginRight, 0)
          result.push({
            ...sizes,
            cumulativeOffset: prev.cumulativeOffset + windowWidth - (sizes.marginRight - marginLeft),
            marginLeft,
          })
        }
      }
      return result
    },
    [items]
  )

  const offsets = useMemo(() => measurements.map(({ cumulativeOffset }) => cumulativeOffset), [measurements])
  const [fullScreen, setFullScreen] = useState(false)
  const [imageIndex, setImageIndex] = useState(0)

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
  const ref = useRef<FlatList<any>>(null)

  useEffect(
    () => {
      if (ref.current && fullScreen) {
        ref.current.scrollToIndex({ animated: false, index: imageIndex })
      }
    },
    [imageIndex, fullScreen]
  )
  return (
    <View>
      <FlatList<CarouselItemProps>
        ref={ref}
        data={items}
        horizontal
        scrollEnabled={items.length > 1}
        showsHorizontalScrollIndicator={false}
        snapToOffsets={offsets}
        keyExtractor={item => item.url}
        decelerationRate={0.1}
        canCancelContentTouches
        onScroll={onScroll}
        renderItem={({ item, index }) => {
          item = item.thumbnail || item
          let styles = getMeasurements({ item, boundingBox: cardBoundingBox })
          if (index > 0) {
            const prevStyles = getMeasurements({ item: items[index - 1], boundingBox: cardBoundingBox })
            styles = { ...styles, marginLeft: Math.max(styles.marginLeft - prevStyles.marginLeft, 0) }
          }
          return (
            <TouchableWithoutFeedback onPress={() => setFullScreen(true)}>
              <ImageWithLoadingState
                source={{ uri: cacheBust(item.url) }}
                style={{
                  ...styles,
                }}
              />
            </TouchableWithoutFeedback>
          )
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
      {fullScreen && (
        <FullScreenCarousel
          imageIndex={imageIndex}
          setImageIndex={setImageIndex}
          items={items}
          onDismiss={() => setFullScreen(false)}
        />
      )}
    </View>
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
