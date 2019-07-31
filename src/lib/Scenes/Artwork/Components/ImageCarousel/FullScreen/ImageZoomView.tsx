import { ImageCarouselContext, ImageDescriptor } from "../ImageCarouselContext"

import { observer } from "mobx-react"

import {
  useCallback,
  useContext,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react"

import {
  Animated,
  NativeSyntheticEvent,
  NativeTouchEvent,
  ScrollView,
  TouchableWithoutFeedback,
  View,
} from "react-native"

import { useAnimatedValue } from "../useAnimatedValue"

import { fitInside } from "../geometry"

import OpaqueImageView from "lib/Components/OpaqueImageView/OpaqueImageView"
import { screenSafeAreaInsets } from "lib/utils/screenSafeAreaInsets"
import React from "react"
import { ImageDeepZoomView } from "./ImageDeepZoomView"
import { screenBoundingBox, screenHeight, screenWidth } from "./screen"
import { useDoublePressCallback } from "./useDoublePressCallback"

const MAX_ZOOM_SCALE = 4

export interface ImageZoomView {
  resetZoom(): void
}
export interface ImageZoomViewProps {
  image: ImageDescriptor
  ref: React.Ref<ImageZoomView>
  index: number
}

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

// calculates the transition offset between the embedded thumbnail (fromRef)
// and the full-screen image position (toBox)
async function getTransitionOffset({ fromRef, toBox }: { fromRef: any; toBox: Box }): Promise<TransitionOffset> {
  const fromBox = await measure(fromRef)

  fromBox.y += screenSafeAreaInsets.top

  const scale = fromBox.width / toBox.width
  const translateX = fromBox.x + fromBox.width / 2 - (toBox.x + toBox.width / 2)
  const translateY = fromBox.y + fromBox.height / 2 - (toBox.y + toBox.height / 2)

  return { translateX, translateY, scale }
}

// Interpolates a transform for the given transitionOffset
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

/**
 * ImageZoomView is responsible for providing the 'pinch-to-zoom' full screen image view.
 * It is also responsible for animating the shared element transition on entry.
 *
 * It also provides one method `resetZoom` which can be used on a ref of an ImageZoomView
 * The zoom on an ImageZoomView resets after paging to another image in full screen mode.
 *
 * The animation is achieved using the FLIP technique. Here's a great introduction to it
 *
 *  https://css-tricks.com/animating-layouts-with-the-flip-technique/
 */
export const ImageZoomView: React.RefForwardingComponent<ImageZoomView, ImageZoomViewProps> = observer(
  // need to do this ref forwarding to expose the `resetZoom` method to consumers
  React.forwardRef(({ image, index }, ref) => {
    const { state, embeddedImageRefs, dispatch } = useContext(ImageCarouselContext)

    const [imageTransitionOffset, setImageTransitionOffset] = useState<TransitionOffset>({
      scale: 1,
      translateX: 0,
      translateY: 0,
    })

    const transition = useAnimatedValue(0)
    const transform = useMemo(() => createTransform(transition, imageTransitionOffset), [imageTransitionOffset])

    useEffect(() => {
      // animate image transition on mount
      if (state.fullScreenState !== "entered" && state.imageIndex === index) {
        const { marginHorizontal, marginVertical, ...dimensions } = fitInside(screenBoundingBox, image)
        getTransitionOffset({
          fromRef: embeddedImageRefs[state.imageIndex],
          toBox: { ...dimensions, x: marginHorizontal, y: marginVertical },
        })
          .then(setImageTransitionOffset)
          .then(() => {
            dispatch({ type: "FULL_SCREEN_INITIAL_RENDER_COMPLETED" })
            requestAnimationFrame(() => {
              // start the 'zoom' shared element transition!
              Animated.spring(transition, {
                bounciness: 0,
                toValue: 1,
                useNativeDriver: true,
              }).start()
              // to make this feel snappy we'll actually finish earlier than the animation ends.
              setTimeout(() => {
                dispatch({ type: "FULL_SCREEN_FINISHED_ENTERING" })
              }, 50)
            })
          })
      }
    }, [])

    const { width, height } = fitInside(screenBoundingBox, image)

    // we need to be able to reset the scroll view zoom level when the user
    // swipes to another image
    const scrollViewRef = useRef<ScrollView>()
    const zoomScale = useRef<number>(0)
    const contentOffset = useRef<{ x: number; y: number }>({ x: 0, y: 0 })

    const resetZoom = useCallback(() => {
      if (scrollViewRef.current && zoomScale.current !== 1) {
        scrollViewRef.current.scrollResponderZoomTo({
          x: 0,
          y: 0,
          width: screenWidth,
          height: screenHeight,
        })
      }
    }, [])

    // expose resetZoom so that when the user swipes, the off-screen zoom levels can be reset
    useImperativeHandle(ref, () => ({ resetZoom }), [])

    const handleDoubleTapToZoom = useDoublePressCallback((ev: NativeSyntheticEvent<NativeTouchEvent>) => {
      const { pageX, pageY } = ev.nativeEvent
      if (zoomScale.current > 3) {
        resetZoom()
      } else {
        // zoom to tapped point
        const tapX = (contentOffset.current.x + pageX) / zoomScale.current
        const tapY = (contentOffset.current.y + pageY) / zoomScale.current
        const w = screenWidth / MAX_ZOOM_SCALE
        const h = screenHeight / MAX_ZOOM_SCALE
        scrollViewRef.current.scrollResponderZoomTo({
          x: tapX - w / 2,
          y: tapY - h / 2,
          width: w,
          height: h,
        })
      }
    })

    useLayoutEffect(() => {
      // trigger an onScroll event after mounting to initialize
      // the contentOffset properly
      resetZoom()
    }, [])

    // as a perf optimisation, when doing the 'zoom in' transition, we only render the
    // current zoomable image in place of the other images we just render a blank box
    if (state.fullScreenState !== "entered" && index !== state.imageIndex) {
      return <View style={screenBoundingBox} />
    }

    return (
      // scroll view to allow pinch-to-zoom behaviour
      <ScrollView
        ref={scrollViewRef}
        // disable accidental scrolling before the image has finished entering
        scrollEnabled={state.fullScreenState === "entered"}
        onScroll={ev => {
          zoomScale.current = ev.nativeEvent.zoomScale
          contentOffset.current = { ...ev.nativeEvent.contentOffset }
          if (state.imageIndex === index) {
            dispatch({ type: "ZOOM_SCALE_CHANGED", nextZoomScale: zoomScale.current })
          }
        }}
        scrollEventThrottle={100}
        bounces={false}
        overScrollMode="never"
        minimumZoomScale={1}
        maximumZoomScale={MAX_ZOOM_SCALE}
        centerContent
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        style={[
          {
            height: screenBoundingBox.height,
            // hide this scroll view until the image is ready to start its transition in.
            opacity: state.fullScreenState !== "doing first render" ? 1 : 0,
          },
        ]}
      >
        <TouchableWithoutFeedback onPress={handleDoubleTapToZoom}>
          {/* wrapper to apply transform to underlying image */}
          <Animated.View
            style={{
              width,
              height,
              transform,
            }}
          >
            <OpaqueImageView
              noAnimation
              imageURL={image.url}
              useRawURL
              style={{
                width,
                height,
              }}
            />
            {state.fullScreenState !== "doing first render" &&
              state.imageIndex === index && <ImageDeepZoomView image={image} width={width} height={height} />}
          </Animated.View>
        </TouchableWithoutFeedback>
      </ScrollView>
    )
  })
)
