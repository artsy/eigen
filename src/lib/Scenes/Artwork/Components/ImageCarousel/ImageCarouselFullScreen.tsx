import { ImageCarousel_images } from "__generated__/ImageCarousel_images.graphql"
import OpaqueImageView from "lib/Components/OpaqueImageView"
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Animated, Dimensions, Image, Modal, ScrollView, TouchableWithoutFeedback } from "react-native"
import { fitInside } from "./geometry"

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

const screenBoundingBox = { width: Dimensions.get("screen").width, height: Dimensions.get("screen").height }

export const ImageCarouselFullScreen: React.FC<{
  imageRefs: Image[]
  images: ImageCarousel_images
  imageIndex: number
  setImageIndex(index: number): void
  onClosed(): void
}> = ({ imageRefs, imageIndex, images, onClosed }) => {
  const zoomImageRef = useRef<Image | null>(null)
  const [imageTransitionOffset, setImageTransitionOffset] = useState<TransitionOffset | null>(null)
  const image = images[imageIndex]

  const imageOpacity = useMemo(() => new Animated.Value(1), [])

  const transition = useMemo(() => new Animated.Value(0), [])
  const transform = useMemo(
    () =>
      imageTransitionOffset
        ? [
            {
              translateX: transition.interpolate({
                inputRange: [0, 1],
                outputRange: [imageTransitionOffset.translateX, 0],
              }),
            },
            {
              translateY: transition.interpolate({
                inputRange: [0, 1],
                outputRange: [imageTransitionOffset.translateY, 0],
              }),
            },
            {
              scale: transition.interpolate({
                inputRange: [0, 1],
                outputRange: [imageTransitionOffset.scale, 1],
              }),
            },
          ]
        : [],
    [imageTransitionOffset]
  )

  const animateTransition = useCallback(() => {
    Animated.spring(transition, {
      bounciness: 0,
      toValue: 1,
      useNativeDriver: true,
    }).start()
  }, [])

  useEffect(() => {
    // animate image transition on mount
    getTransitionOffset({
      fromRef: imageRefs[imageIndex],
      // @ts-ignore
      toRef: zoomImageRef.current.getNode(),
    })
      .then(setImageTransitionOffset)
      .then(() => requestAnimationFrame(animateTransition))
  }, [])

  const { width, height } = fitInside(screenBoundingBox, image)

  const [exiting, setExiting] = useState(false)

  return (
    <Modal transparent animated={exiting} animationType="fade">
      {/* Underlay. this fades in while the image is opaque instantly */}
      <Animated.View
        style={{
          backgroundColor: "white",
          opacity: transition,
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
        }}
      />
      <ScrollView
        bounces={false}
        overScrollMode="never"
        minimumZoomScale={1}
        maximumZoomScale={4}
        centerContent
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        style={{
          height: screenBoundingBox.height,
          // prevent entry flicker
          opacity: imageTransitionOffset ? 1 : 0,
        }}
      >
        <TouchableWithoutFeedback
          onPress={() => {
            setExiting(true)
            setTimeout(onClosed, 10)
          }}
        >
          <Animated.View
            ref={zoomImageRef}
            style={{
              width,
              height,
              transform,
              opacity: imageOpacity,
            }}
          >
            <OpaqueImageView
              noAnimation
              imageURL={image.url}
              style={{
                width,
                height,
              }}
            />
          </Animated.View>
        </TouchableWithoutFeedback>
      </ScrollView>
    </Modal>
  )
}
