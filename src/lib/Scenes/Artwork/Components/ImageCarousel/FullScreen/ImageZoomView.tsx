import { ImageCarouselContext, ImageDescriptor } from "../ImageCarouselContext"

import { observer } from "mobx-react"

import { useCallback, useContext, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react"

import {
  Animated,
  findNodeHandle,
  NativeModules,
  NativeScrollEvent,
  NativeSyntheticEvent,
  NativeTouchEvent,
  ScrollView,
  TouchableWithoutFeedback,
  View,
} from "react-native"

const { ARScrollViewHelpers } = NativeModules

import { useAnimatedValue } from "../useAnimatedValue"

import { fitInside, Position, Rect } from "../geometry"

import OpaqueImageView from "lib/Components/OpaqueImageView/OpaqueImageView"
import { screenSafeAreaInsets } from "lib/utils/screenSafeAreaInsets"
import React from "react"
import { calculateMaxZoomViewScale } from "./DeepZoom/deepZoomGeometry"
import { DeepZoomOverlay } from "./DeepZoom/DeepZoomOverlay"
import { screenBoundingBox, screenHeight, screenWidth } from "./screen"
import { useDoublePressCallback } from "./useDoublePressCallback"
import { useNewEventStream } from "./useEventStream"

export interface ImageZoomView {
  resetZoom(): void
}
export interface ImageZoomViewProps {
  image: ImageDescriptor
  ref: React.Ref<ImageZoomView>
  index: number
}

const measure = (ref: any): Promise<Rect> =>
  new Promise(resolve => ref.measure((_, __, width, height, x, y) => resolve({ x, y, width, height })))

interface TransitionOffset {
  translateX: number
  translateY: number
  scale: number
}

// calculates the transition offset between the embedded thumbnail (fromRef)
// and the full-screen image position (toBox)
async function getTransitionOffset({ fromRef, toBox }: { fromRef: any; toBox: Rect }): Promise<TransitionOffset> {
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
              }).start(() => {
                dispatch({ type: "FULL_SCREEN_FINISHED_ENTERING" })
              })
            })
          })
      }
    }, [])

    // we need to be able to reset the scroll view zoom level when the user
    // swipes to another image
    const scrollViewRef = useRef<{ getNode(): ScrollView }>()
    const zoomScale = useRef<number>(1)
    const contentOffset = useRef<Position>({ x: -marginHorizontal, y: -marginVertical })

    const resetZoom = useCallback(() => {
      if (scrollViewRef.current && zoomScale.current !== 1) {
        ARScrollViewHelpers.smoothZoom(
          findNodeHandle(scrollViewRef.current.getNode()),
          -marginHorizontal,
          -marginVertical,
          width,
          height
        )
      }
    }, [])

    const maxZoomScale = image.deepZoom ? calculateMaxZoomViewScale({ width, height }, image.deepZoom.Image.Size) : 2

    // expose resetZoom so that when the user swipes, the off-screen zoom levels can be reset
    useImperativeHandle(ref, () => ({ resetZoom }), [])

    const handleDoubleTapToZoom = useDoublePressCallback((ev: NativeSyntheticEvent<NativeTouchEvent>) => {
      const { pageX, pageY } = ev.nativeEvent
      if (Math.ceil(zoomScale.current) >= maxZoomScale) {
        resetZoom()
      } else {
        // zoom to tapped point
        let newZoomScale = Math.min(zoomScale.current * 3, maxZoomScale)
        if (newZoomScale * 2 >= maxZoomScale) {
          newZoomScale = maxZoomScale
        }
        const tapX = (contentOffset.current.x + pageX) / zoomScale.current
        const tapY = (contentOffset.current.y + pageY) / zoomScale.current
        const w = screenWidth / newZoomScale
        const h = screenHeight / newZoomScale

        let x = tapX - w / 2
        let y = tapY - h / 2

        if (w > width) {
          // handle centering with margins
          x = -(w - width) / 2
        } else if (x + w > width) {
          // handle constraining right edge
          x = width - w
        } else if (x < 0) {
          // handle constraining left edge
          x = 0
        }

        if (h > height) {
          // handle centering with margins
          y = -(h - height) / 2
        } else if (y + h > height) {
          // handle constraining bottom edge
          y = height - h
        } else if (y < 0) {
          // handle constraining top edge
          y = 0
        }

        ARScrollViewHelpers.smoothZoom(findNodeHandle(scrollViewRef.current.getNode()), x, y, w, h)
      }
    })

    useEffect(
      () => {
        // hack to get a sane starting contentOffset our ScrollView gives some _whack_ values occasionally
        // for it's first onScroll before the user has actually done any scrolling
        contentOffset.current = { x: -marginHorizontal, y: -marginVertical }

        // opt out of parent scroll events to prevent double transforms while doing vertical dismiss
        if (state.fullScreenState === "entered" && scrollViewRef.current) {
          const tag = findNodeHandle(scrollViewRef.current.getNode())
          ARScrollViewHelpers.optOutOfParentScrollEvents(tag)
        }
      },
      [state.fullScreenState]
    )

    const viewPortChanges = useNewEventStream<Rect>()

    const $contentOffsetX = useAnimatedValue(-marginHorizontal)
    const $contentOffsetY = useAnimatedValue(-marginVertical)
    const $zoomScale = useAnimatedValue(1)

    const onScroll = useCallback((ev: NativeSyntheticEvent<NativeScrollEvent>) => {
      zoomScale.current = Math.max(ev.nativeEvent.zoomScale, 1)
      contentOffset.current = { ...ev.nativeEvent.contentOffset }
      viewPortChanges.dispatch({
        x: ev.nativeEvent.contentOffset.x / zoomScale.current,
        y: ev.nativeEvent.contentOffset.y / zoomScale.current,
        width: screenWidth / zoomScale.current,
        height: screenHeight / zoomScale.current,
      })
      if (state.imageIndex === index) {
        dispatch({ type: "ZOOM_SCALE_CHANGED", nextZoomScale: zoomScale.current })
      }
    }, [])

    const triggerScrollEvent = useCallback(() => {
      ARScrollViewHelpers.triggerScrollEvent(findNodeHandle(scrollViewRef.current.getNode()))
    }, [])

    // as a perf optimisation, when doing the 'zoom in' transition, we only render the
    // current zoomable image in place of the other images we just render a blank box
    if (state.fullScreenState !== "entered" && index !== state.imageIndex) {
      return <View style={screenBoundingBox} />
    }

    return (
      <>
        <Animated.ScrollView
          ref={scrollViewRef}
          scrollEnabled={state.fullScreenState === "entered"}
          onScroll={Animated.event(
            [{ nativeEvent: { zoomScale: $zoomScale, contentOffset: { x: $contentOffsetX, y: $contentOffsetY } } }],
            {
              useNativeDriver: true,
              listener: onScroll,
            }
          )}
          scrollEventThrottle={0.0000001}
          bounces={false}
          bouncesZoom={false}
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
        {(state.fullScreenState === "entered" || state.fullScreenState === "exiting") &&
          (state.imageIndex === index || state.lastImageIndex === index) &&
          image.deepZoom && (
            <DeepZoomOverlay
              image={image}
              width={width}
              height={height}
              viewPortChanges={viewPortChanges}
              $zoomScale={$zoomScale}
              $contentOffsetX={$contentOffsetX}
              $contentOffsetY={$contentOffsetY}
              triggerScrollEvent={triggerScrollEvent}
            />
          )}
      </>
    )
  })
)
