import { ImageCarousel_images } from "__generated__/ImageCarousel_images.graphql"
import OpaqueImageView from "lib/Components/OpaqueImageView"
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Animated, Dimensions, Image, Modal, PanResponder, ScrollView, TouchableWithoutFeedback } from "react-native"
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

  const isReadyToEnter = imageTransitionOffset !== null

  // we only want the modal to fade when exiting, so it should appear instantly
  // when entering.
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
      <VerticalSwipeToDismiss onDismiss={() => onClosed()}>
        {/* horizontal flatlist to handle the carousel behaviour */}
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
            opacity: isReadyToEnter ? 1 : 0,
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
                disableGemini
                style={{
                  width,
                  height,
                }}
              />
            </Animated.View>
          </TouchableWithoutFeedback>
        </ScrollView>
      </VerticalSwipeToDismiss>
    </Modal>
  )
}

const animatedQuadraticBezier = ({ p0, p1, p2, t }: { t: Animated.Animated; p0: number; p1: number; p2: number }) => {
  // (1-t)[(1-t)p0 + tp1] + t[(1-t)p1 + t(p2)]
  const oneMinusT = Animated.subtract(1, t)
  return Animated.add(
    Animated.multiply(oneMinusT, Animated.add(Animated.multiply(oneMinusT, p0), Animated.multiply(t, p1))),
    Animated.multiply(t, Animated.add(Animated.multiply(oneMinusT, p1), Animated.multiply(t, p2)))
  )
}

const VerticalSwipeToDismiss: React.FC<{ onDismiss(): void }> = ({ children, onDismiss }) => {
  const scrollY = useMemo(() => new Animated.Value(0), [])
  const goodbyeY = useMemo(() => new Animated.Value(0), [])
  const goodbyeOpacity = useMemo(() => new Animated.Value(1), [])

  const maxScroll = 500
  const maxTranslate = 200

  const p0 = 0
  const p1 = maxTranslate
  const p2 = maxTranslate

  // do a quadratic bezier curve using proportion of maxScroll as t

  const t = useMemo(() => Animated.divide(scrollY, maxScroll), [])
  const translateY = useMemo(() => Animated.add(goodbyeY, animatedQuadraticBezier({ p0, p1, p2, t })), [])

  const scrollOpacity = useMemo(
    () =>
      translateY.interpolate({
        inputRange: [0, 300],
        outputRange: [1, 0],
      }),
    []
  )

  const opacity = useMemo(() => Animated.multiply(goodbyeOpacity, scrollOpacity), [])
  const [exiting, setExiting] = useState(false)
  useEffect(
    () => {
      if (exiting) {
        setTimeout(onDismiss, 10)
      }
    },
    [exiting]
  )

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        // Ask to be the responder:
        onStartShouldSetPanResponder: (evt, gestureState) => true,
        onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
        onMoveShouldSetPanResponder: (evt, gestureState) => true,
        onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,

        onPanResponderGrant: (evt, gestureState) => {
          // The gesture has started. Show visual feedback so the user knows
          // what is happening!
          // gestureState.d{x,y} will be set to zero now
        },
        // onPanResponderMove: Animated.event([null, { dy: scrollY }]),
        onPanResponderMove: (_, gestureState) => {
          scrollY.setValue(Math.min(Math.max(gestureState.dy, 0), maxScroll))
        },
        onPanResponderTerminationRequest: (evt, gestureState) => true,
        onPanResponderRelease: (evt, gestureState) => {
          if (gestureState.dy > 100) {
            Animated.parallel([
              Animated.spring(goodbyeY, {
                toValue: Dimensions.get("screen").height,
                useNativeDriver: true,
              }),
              Animated.timing(goodbyeOpacity, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
              }),
            ]).start()
            setTimeout(() => setExiting(true), 200)
          } else {
            Animated.spring(scrollY, { toValue: 0, useNativeDriver: true }).start()
          }
          // The user has released all touches while this view is the
          // responder. This typically means a gesture has succeeded
        },
        onPanResponderTerminate: (evt, gestureState) => {
          // Another component has become the responder, so this gesture
          // should be cancelled
        },
        onShouldBlockNativeResponder: (evt, gestureState) => {
          // Returns whether this component should block native components from becoming the JS
          // responder. Returns true by default. Is currently only supported on android.
          return true
        },
      }),
    []
  )

  /* outer vertical scrollview to handle the swipe-down-to-dismiss behaviour */
  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={[{ opacity: exiting ? 0 : opacity, transform: [{ translateY }] }]}
    >
      {children}
    </Animated.View>
  )
}
