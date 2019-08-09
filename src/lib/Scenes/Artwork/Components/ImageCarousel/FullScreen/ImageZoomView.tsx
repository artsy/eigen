import { ImageCarouselContext, ImageDescriptor } from "../ImageCarouselContext"

import { observer } from "mobx-react"

import { useCallback, useContext, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react"

import {
  Animated,
  NativeScrollEvent,
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
import { calculateMaxZoomViewScale, ImageDeepZoomView } from "./ImageDeepZoomView"
import { screenBoundingBox, screenHeight, screenWidth } from "./screen"
import { useDoublePressCallback } from "./useDoublePressCallback"

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

    const { width, height, marginHorizontal, marginVertical } = fitInside(screenBoundingBox, image)

    useEffect(() => {
      // animate image transition on mount
      if (state.fullScreenState !== "entered" && state.imageIndex === index) {
        getTransitionOffset({
          fromRef: embeddedImageRefs[state.imageIndex],
          toBox: { width, height, x: marginHorizontal, y: marginVertical },
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

    // we need to be able to reset the scroll view zoom level when the user
    // swipes to another image
    const scrollViewRef = useRef<{ getNode(): ScrollView }>()
    const zoomScale = useRef<number>(1)
    const contentOffset = useRef<{ x: number; y: number }>({ x: -marginHorizontal, y: -marginVertical })

    const resetZoom = useCallback(() => {
      if (scrollViewRef.current && zoomScale.current !== 1) {
        scrollViewRef.current.getNode().scrollResponderZoomTo({
          x: 0,
          y: 0,
          width: screenWidth,
          height: screenHeight,
        })
      }
    }, [])

    const maxZoomScale = calculateMaxZoomViewScale({ width, height }, image.deepZoom.Image.Size)
    console.log({ maxZoomScale })

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
        const w = screenWidth / maxZoomScale
        const h = screenHeight / maxZoomScale
        scrollViewRef.current.getNode().scrollResponderZoomTo({
          x: tapX - w / 2,
          y: tapY - h / 2,
          width: w,
          height: h,
        })
      }
    })

    useEffect(
      () => {
        // hack to get a sane starting contentOffset our ScrollView gives some _whack_ values occasionally
        // for it's first onScroll before the user has actually done any scrolling
        contentOffset.current = { x: -marginHorizontal, y: -marginVertical }
      },
      [state.fullScreenState]
    )

    const [viewPort, setViewPort] = useState({
      x: contentOffset.current.x / zoomScale.current,
      y: contentOffset.current.y / zoomScale.current,
      width: screenWidth / zoomScale.current,
      height: screenHeight / zoomScale.current,
    })

    const $contentOffsetX = useAnimatedValue(-marginHorizontal)
    const $contentOffsetY = useAnimatedValue(-marginVertical)
    const $zoomScale = useAnimatedValue(1)

    // as a perf optimisation, when doing the 'zoom in' transition, we only render the
    // current zoomable image in place of the other images we just render a blank box
    if (state.fullScreenState !== "entered" && index !== state.imageIndex) {
      return <View style={screenBoundingBox} />
    }

    const onScroll = useCallback((ev: NativeSyntheticEvent<NativeScrollEvent>) => {
      console.log("tha zoom scale be lik", ev.nativeEvent.zoomScale)
      zoomScale.current = Math.max(ev.nativeEvent.zoomScale, 1)
      contentOffset.current = { ...ev.nativeEvent.contentOffset }
      console.log("contentOffset", contentOffset.current)
      setViewPort({
        x: ev.nativeEvent.contentOffset.x / zoomScale.current,
        y: ev.nativeEvent.contentOffset.y / zoomScale.current,
        width: screenWidth / zoomScale.current,
        height: screenHeight / zoomScale.current,
      })
      if (state.imageIndex === index) {
        dispatch({ type: "ZOOM_SCALE_CHANGED", nextZoomScale: zoomScale.current })
      }
    }, [])

    return (
      <>
        <Animated.ScrollView
          ref={scrollViewRef}
          scrollEnabled={state.fullScreenState === "entered"}
          onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: $contentOffsetY } } }], {
            useNativeDriver: true,
          })}
          scrollEventThrottle={100}
          bounces={false}
          overScrollMode="never"
          minimumZoomScale={1}
          maximumZoomScale={maxZoomScale}
          centerContent
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          style={[
            {
              ...screenBoundingBox,
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
            </Animated.View>
          </TouchableWithoutFeedback>
        </Animated.ScrollView>
        {state.fullScreenState !== "doing first render" &&
          state.imageIndex === index && (
            <ImageDeepZoomView
              image={image}
              width={width}
              height={height}
              viewPort={viewPort}
              $zoomScale={$zoomScale}
              $contentOffsetX={$contentOffsetX}
              $contentOffsetY={$contentOffsetY}
            />
          )}
      </>
    )
  })
)

function convert(val: string | number): string | number {
  return typeof val === "string" ? Number(val) : String(val)
}

function convert2<T>(val: string | number): string | number {
  return typeof val === "string" ? Number(val) : String(val)
}

convert("hello")
