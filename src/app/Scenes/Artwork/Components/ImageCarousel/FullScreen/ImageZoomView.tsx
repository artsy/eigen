import { Image } from "@artsy/palette-mobile"
import { captureMessage } from "@sentry/react-native"
import {
  ImageCarouselContext,
  ImageDescriptor,
} from "app/Scenes/Artwork/Components/ImageCarousel/ImageCarouselContext"
import { fitInside, Position, Rect } from "app/Scenes/Artwork/Components/ImageCarousel/geometry"
import { useAnimatedValue } from "app/Scenes/Artwork/Components/ImageCarousel/useAnimatedValue"
import { useScreenDimensions } from "app/utils/hooks"
import React, {
  useCallback,
  useContext,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react"
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
import { DeepZoomOverlay } from "./DeepZoom/DeepZoomOverlay"
import { calculateMaxZoomViewScale } from "./DeepZoom/deepZoomGeometry"
import { useDoublePressCallback } from "./useDoublePressCallback"
import { useNewEventStream } from "./useEventStream"

const { ARScrollViewHelpers } = NativeModules
export interface ImageZoomView {
  resetZoom(): void
}
export interface ImageZoomViewProps {
  image: ImageDescriptor
  ref: React.Ref<ImageZoomView>
  index: number
}

const measure = (ref: View): Promise<Rect> =>
  new Promise((resolve) =>
    ref.measure((_, __, width, height, x, y) => resolve({ x, y, width, height }))
  )

interface TransitionOffset {
  translateX: number
  translateY: number
  scale: number
}

// calculates the transition offset between the embedded thumbnail (fromRef)
// and the full-screen image position (toBox)
async function getTransitionOffset({
  fromRef,
  toBox,
}: {
  fromRef: View
  toBox: Rect
}): Promise<TransitionOffset> {
  const fromBox = await measure(fromRef)

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
export const ImageZoomView =
  // need to do this ref forwarding to expose the `resetZoom` method to consumers
  React.forwardRef<ImageZoomView, ImageZoomViewProps>(({ image, index }, ref) => {
    const screenDimensions = useScreenDimensions()
    const { embeddedImageRefs, dispatch, imageIndex, fullScreenState, lastImageIndex } =
      useContext(ImageCarouselContext)

    imageIndex.useUpdates()
    fullScreenState.useUpdates()
    lastImageIndex.useUpdates()

    const [imageTransitionOffset, setImageTransitionOffset] = useState<TransitionOffset>({
      scale: 1,
      translateX: 0,
      translateY: 0,
    })

    const transition = useAnimatedValue(0)
    const transform = useMemo(
      () => createTransform(transition, imageTransitionOffset),
      [imageTransitionOffset]
    )

    const rawImageSize = image?.deepZoom?.image?.size
    if (!rawImageSize) {
      if (__DEV__) {
        console.error("No image size info found")
      } else {
        captureMessage("No image size info found (see breadcrumbs for artowrk id)")
      }
    }
    const imageSize = {
      width: rawImageSize?.width ?? 0,
      height: rawImageSize?.height ?? 0,
    }
    const imageFittedWithinScreen = fitInside(screenDimensions, imageSize)

    useEffect(() => {
      // animate image transition on mount

      if (
        fullScreenState.current !== "entered" &&
        imageIndex.current === index &&
        embeddedImageRefs[imageIndex.current]
      ) {
        getTransitionOffset({
          fromRef: embeddedImageRefs[imageIndex.current],
          toBox: {
            width: imageFittedWithinScreen.width,
            height: imageFittedWithinScreen.height,
            x: imageFittedWithinScreen.marginHorizontal,
            y: imageFittedWithinScreen.marginVertical,
          },
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
    const scrollViewRef = useRef<ScrollView>(null)
    const zoomScale = useRef<number>(1)
    const contentOffset = useRef<Position>({
      x: -imageFittedWithinScreen.marginHorizontal,
      y: -imageFittedWithinScreen.marginVertical,
    })

    const resetZoom = useCallback(() => {
      if (scrollViewRef.current && zoomScale.current !== 1) {
        ARScrollViewHelpers.smoothZoom(
          findNodeHandle(scrollViewRef.current),
          -imageFittedWithinScreen.marginHorizontal,
          -imageFittedWithinScreen.marginVertical,
          screenDimensions.width,
          screenDimensions.height
        )
      }
    }, [])

    const maxZoomScale = image.deepZoom
      ? calculateMaxZoomViewScale(
          {
            width: imageFittedWithinScreen.width,
            height: imageFittedWithinScreen.height,
          },
          imageSize
        )
      : 2

    // expose resetZoom so that when the user swipes, the off-screen zoom levels can be reset
    useImperativeHandle(ref, () => ({ resetZoom }), [resetZoom])

    const handleDoubleTapToZoom = useDoublePressCallback(
      useCallback(
        (ev: NativeSyntheticEvent<NativeTouchEvent>) => {
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
            const w = screenDimensions.width / newZoomScale
            const h = screenDimensions.height / newZoomScale

            let x = tapX - w / 2
            let y = tapY - h / 2

            if (w > imageFittedWithinScreen.width) {
              // handle centering with margins
              x = -(w - imageFittedWithinScreen.width) / 2
            } else if (x + w > imageFittedWithinScreen.width) {
              // handle constraining right edge
              x = imageFittedWithinScreen.width - w
            } else if (x < 0) {
              // handle constraining left edge
              x = 0
            }

            if (h > imageFittedWithinScreen.height) {
              // handle centering with margins
              y = -(h - imageFittedWithinScreen.height) / 2
            } else if (y + h > imageFittedWithinScreen.height) {
              // handle constraining bottom edge
              y = imageFittedWithinScreen.height - h
            } else if (y < 0) {
              // handle constraining top edge
              y = 0
            }

            ARScrollViewHelpers.smoothZoom(findNodeHandle(scrollViewRef.current), x, y, w, h)
          }
        },
        [screenDimensions]
      )
    )

    useEffect(() => {
      // hack to get a sane starting contentOffset our ScrollView gives some _whack_ values occasionally
      // for it's first onScroll before the user has actually done any scrolling
      contentOffset.current = {
        x: -imageFittedWithinScreen.marginHorizontal,
        y: -imageFittedWithinScreen.marginVertical,
      }

      // opt out of parent scroll events to prevent double transforms while doing vertical dismiss
      if (fullScreenState.current === "entered" && scrollViewRef.current) {
        const tag = findNodeHandle(scrollViewRef.current)
        ARScrollViewHelpers.optOutOfParentScrollEvents(tag)
      }
    }, [fullScreenState.current])

    const viewPortChanges = useNewEventStream<Rect>()

    const $contentOffsetX = useAnimatedValue(-imageFittedWithinScreen.marginHorizontal)
    const $contentOffsetY = useAnimatedValue(-imageFittedWithinScreen.marginVertical)
    const $zoomScale = useAnimatedValue(1)

    const onScroll = useCallback((ev: NativeSyntheticEvent<NativeScrollEvent>) => {
      zoomScale.current = Math.max(ev.nativeEvent.zoomScale, 1)
      contentOffset.current = { ...ev.nativeEvent.contentOffset }
      viewPortChanges.dispatch({
        x: ev.nativeEvent.contentOffset.x / zoomScale.current,
        y: ev.nativeEvent.contentOffset.y / zoomScale.current,
        width: screenDimensions.width / zoomScale.current,
        height: screenDimensions.height / zoomScale.current,
      })
      if (imageIndex.current === index) {
        dispatch({ type: "ZOOM_SCALE_CHANGED", nextZoomScale: zoomScale.current })
      }
    }, [])

    const triggerScrollEvent = useCallback(() => {
      ARScrollViewHelpers.triggerScrollEvent(findNodeHandle(scrollViewRef.current))
    }, [])

    // as a perf optimisation, when doing the 'zoom in' transition, we only render the
    // current zoomable image in place of the other images we just render a blank box
    if (fullScreenState.current !== "entered" && index !== imageIndex.current) {
      return (
        <View
          accessibilityLabel="Full Screen Image Blank Box"
          style={{ width: screenDimensions.width, height: screenDimensions.height }}
        />
      )
    }

    return (
      <>
        <Animated.ScrollView
          ref={scrollViewRef}
          scrollEnabled={fullScreenState.current === "entered"}
          onScroll={Animated.event(
            [
              {
                nativeEvent: {
                  zoomScale: $zoomScale,
                  contentOffset: { x: $contentOffsetX, y: $contentOffsetY },
                },
              },
            ],
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
          accessibilityLabel="Full Screen Image"
          contentContainerStyle={{
            width: imageFittedWithinScreen.width,
            height: imageFittedWithinScreen.height,
          }}
          style={[
            {
              width: screenDimensions.width,
              height: screenDimensions.height,
              // hide this scroll view until the image is ready to start its transition in.
              opacity: fullScreenState.current !== "doing first render" ? 1 : 0,
            },
          ]}
        >
          <TouchableWithoutFeedback accessibilityRole="button" onPress={handleDoubleTapToZoom}>
            {/* wrapper to apply transform to underlying image */}
            <Animated.View
              style={{
                width: imageFittedWithinScreen.width,
                height: imageFittedWithinScreen.height,
                transform,
              }}
            >
              <Image
                // TODO: noAnimation, check if we still need a solution for this
                src={image.resized?.src || image.url || ""}
                performResize={false}
                width={imageFittedWithinScreen.width}
                height={imageFittedWithinScreen.height}
              />
            </Animated.View>
          </TouchableWithoutFeedback>
        </Animated.ScrollView>
        {(fullScreenState.current === "entered" || fullScreenState.current === "exiting") &&
          (imageIndex.current === index || lastImageIndex.current === index) &&
          !!image.deepZoom && (
            <DeepZoomOverlay
              image={image}
              width={imageFittedWithinScreen.width}
              height={imageFittedWithinScreen.height}
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
