import { ImageCarousel_images } from "__generated__/ImageCarousel_images.graphql"
import OpaqueImageView from "lib/Components/OpaqueImageView"
import { once } from "lodash"
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import {
  Animated,
  Dimensions,
  Image,
  Modal,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  View,
} from "react-native"
import { fitInside } from "./geometry"

const useAnimatedValue = (init: number) => useMemo(() => new Animated.Value(init), [])

interface Box {
  width: number
  height: number
  x: number
  y: number
}

const measure = (ref: any): Promise<Box> =>
  new Promise(resolve => ref.measure((_, __, width, height, x, y) => resolve({ x, y, width, height })))

interface TransitionOffset {
  translateX: number
  translateY: number
  scale: number
}
async function getTransitionOffset({ fromRef, toRef }: { fromRef: any; toRef: any }): Promise<TransitionOffset> {
  const fromBox = await measure(fromRef)
  const toBox = await measure(toRef)

  const scale = fromBox.width / toBox.width
  const translateX = fromBox.x + fromBox.width / 2 - (toBox.x + toBox.width / 2)
  const translateY = fromBox.y + fromBox.height / 2 - (toBox.y + toBox.height / 2)

  return { translateX, translateY, scale }
}
function createTransform(
  // control value between 0 (out) and 1 (in)
  transition: Animated.Value,
  transitionOffset: TransitionOffset
) {
  return [
    {
      translateX: transition.interpolate({
        inputRange: [0, 1],
        outputRange: [transitionOffset.translateX, 0],
      }),
    },
    {
      translateY: transition.interpolate({
        inputRange: [0, 1],
        outputRange: [transitionOffset.translateY, 0],
      }),
    },
    {
      scale: transition.interpolate({
        inputRange: [0, 1],
        outputRange: [transitionOffset.scale, 1],
      }),
    },
  ]
}

const screenBoundingBox = { width: Dimensions.get("screen").width, height: Dimensions.get("screen").height }

export const ImageCarouselFullScreen: React.FC<{
  baseImageRef: Image
  images: ImageCarousel_images
  imageIndex: number
  setImageIndex(index: number): void
  onClose(): void
}> = ({ baseImageRef, images, onClose, imageIndex }) => {
  const [hasEntered, setHasEntered] = useState(false)
  const [isEntering, setIsEntering] = useState(false)

  return (
    // on mount we want the modal to be visible instantly and handle transitions elsewhere ourselves
    // on unmount we use it's built-in fade transition
    <Modal transparent animated={hasEntered} animationType="fade">
      {/* This underlay fades in while the image is opaque instantly */}
      <WhiteUnderlay isEntering={isEntering} />
      <VerticalSwipeToDismiss onClose={onClose}>
        <ImageZoomView
          // prevent entry flicker
          image={images[imageIndex]}
          baseImageRef={baseImageRef}
          hasEntered={hasEntered}
          setHasEntered={setHasEntered}
          isEntering={isEntering}
          setIsEntering={setIsEntering}
        />
      </VerticalSwipeToDismiss>
    </Modal>
  )
}

const screenHeight = Dimensions.get("screen").height

const VerticalSwipeToDismiss: React.FC<{ onClose(): void }> = ({ children, onClose }) => {
  const scrollY = useAnimatedValue(screenHeight)

  const scrollOpacity = useMemo(
    () =>
      scrollY.interpolate({
        inputRange: [0, screenHeight, screenHeight * 2],
        outputRange: [0, 1, 0],
      }),
    []
  )
  const [isDragging, setIsDragging] = useState(false)
  const dismiss = useMemo(() => once(() => setTimeout(onClose, 200)), [onClose])

  return (
    <Animated.ScrollView
      contentOffset={{ x: 0, y: screenHeight }}
      onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
        useNativeDriver: true,
        listener(ev: NativeSyntheticEvent<NativeScrollEvent>) {
          if (isDragging) {
            return
          }
          const y = ev.nativeEvent.contentOffset.y
          if (y > screenHeight + screenHeight / 2 || y < screenHeight / 2) {
            dismiss()
          }
        },
      })}
      showsVerticalScrollIndicator={false}
      onScrollBeginDrag={() => {
        setIsDragging(true)
      }}
      onScrollEndDrag={(ev: NativeSyntheticEvent<NativeScrollEvent>) => {
        setIsDragging(false)
        const y = ev.nativeEvent.contentOffset.y
        if (y > screenHeight + screenHeight / 2 || y < screenHeight / 2) {
          dismiss()
        }
      }}
      style={[{ opacity: scrollOpacity }]}
      snapToInterval={screenHeight}
      decelerationRate="fast"
      scrollEventThrottle={16}
    >
      <View style={{ height: screenHeight * 3, alignItems: "flex-start", justifyContent: "flex-start" }}>
        <View style={{ height: screenHeight, marginTop: screenHeight }}>{children}</View>
      </View>
    </Animated.ScrollView>
  )
}

const ImageZoomView: React.FC<{
  image: ImageCarousel_images[number]
  baseImageRef: Image
  hasEntered: boolean
  setHasEntered: (hasEntered: boolean) => void
  isEntering: boolean
  setIsEntering: (isEntering: boolean) => void
}> = ({ image, baseImageRef, hasEntered, setHasEntered, isEntering, setIsEntering }) => {
  const imageWrapperRef = useRef<{ getNode(): View }>(null)

  const [imageTransitionOffset, setImageTransitionOffset] = useState<TransitionOffset | null>(null)

  const transition = useAnimatedValue(0)
  const transform = useMemo(() => (imageTransitionOffset ? createTransform(transition, imageTransitionOffset) : []), [
    imageTransitionOffset,
  ])

  const animateTransition = useCallback(() => {
    setIsEntering(true)
    Animated.spring(transition, {
      bounciness: 0,
      toValue: 1,
      useNativeDriver: true,
    }).start(() => {
      setIsEntering(false)
      setHasEntered(true)
    })
  }, [])

  useEffect(() => {
    // animate image transition on mount
    if (!hasEntered) {
      getTransitionOffset({
        fromRef: baseImageRef,
        // @ts-ignore
        toRef: imageWrapperRef.current.getNode(),
      })
        .then(setImageTransitionOffset)
        .then(() => requestAnimationFrame(animateTransition))
    }
  }, [])

  const { width, height } = fitInside(screenBoundingBox, image)

  return (
    // scroll view to allow pinch-to-zoom behaviour
    <ScrollView
      scrollEnabled={hasEntered}
      bounces={false}
      overScrollMode="never"
      minimumZoomScale={1}
      maximumZoomScale={4}
      centerContent
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      style={[
        {
          height: screenBoundingBox.height,
          opacity: hasEntered || isEntering ? 1 : 0,
        },
      ]}
    >
      {/* wrapper to apply transform to underlying image */}
      <Animated.View
        ref={imageWrapperRef}
        style={{
          width,
          height,
          transform,
        }}
      >
        <OpaqueImageView
          noAnimation
          imageURL={image.url}
          disableGemini
          style={{
            width,
            height,
          }}
        />
      </Animated.View>
    </ScrollView>
  )
}
const WhiteUnderlay: React.FC<{ isEntering: boolean }> = ({ isEntering }) => {
  const opacity = useAnimatedValue(0)

  useEffect(
    () => {
      if (isEntering) {
        Animated.spring(opacity, {
          toValue: 1,
          useNativeDriver: true,
        }).start()
      }
    },
    [isEntering]
  )

  return (
    <Animated.View
      style={{
        backgroundColor: "white",
        opacity,
        position: "absolute",
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
      }}
    />
  )
}
