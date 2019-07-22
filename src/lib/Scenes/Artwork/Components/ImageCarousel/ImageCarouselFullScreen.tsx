import { CloseIcon, Sans } from "@artsy/palette"
import OpaqueImageView from "lib/Components/OpaqueImageView"
import { observer } from "mobx-react"
import React, { useCallback, useContext, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react"
import {
  Animated,
  Dimensions,
  FlatList,
  Modal,
  NativeScrollEvent,
  NativeSyntheticEvent,
  NativeTouchEvent,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native"
import { SafeAreaInsetsContext } from "../SafeAreaInsetsContext"
import { fitInside } from "./geometry"
import { ImageDescriptor } from "./ImageCarousel"
import { ImageCarouselContext, useFullScreenState, useImageIndex } from "./ImageCarouselContext"
import { useSpringValue } from "./useSpringValue"

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
async function getTransitionOffset({ fromRef, toBox }: { fromRef: any; toBox: Box }): Promise<TransitionOffset> {
  const fromBox = await measure(fromRef)

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

const screenHeight = Dimensions.get("screen").height
const screenWidth = Dimensions.get("screen").width
const screenBoundingBox = { width: screenWidth, height: screenHeight }

export const ImageCarouselFullScreen = observer(() => {
  const { images, dispatch, state } = useContext(ImageCarouselContext)
  const initialScrollIndex = useMemo(() => state.imageIndex, [])

  const onClose = useCallback(() => {
    if (state.fullScreenState === "entered") {
      dispatch({ type: "FULL_SCREEN_DISMISSED" })
    }
  }, [])

  // update the imageIndex on scroll
  const onScroll = useCallback((e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const nextImageIndex = Math.round(e.nativeEvent.contentOffset.x / screenWidth)
    if (state.fullScreenState === "entered" && nextImageIndex !== state.imageIndex) {
      dispatch({ type: "IMAGE_INDEX_CHANGED", nextImageIndex })
    }
  }, [])

  const zoomViewRefs: ImageZoomView[] = useMemo(() => [], [])

  return (
    // on mount we want the modal to be visible instantly and handle transitions elsewhere ourselves
    // on unmount we use it's built-in fade transition
    <Modal transparent animated={false} animationType="fade">
      {/* This underlay fades in while the image is opaque instantly */}
      <WhiteUnderlay />

      <VerticalSwipeToDismiss onClose={onClose}>
        <FlatList<ImageDescriptor>
          data={images}
          horizontal
          showsHorizontalScrollIndicator={false}
          scrollEnabled={images.length > 1 && state.fullScreenState === "entered"}
          snapToInterval={screenBoundingBox.width}
          keyExtractor={item => item.url}
          decelerationRate="fast"
          initialScrollIndex={initialScrollIndex}
          getItemLayout={(_, index) => ({
            index,
            offset: index * screenWidth,
            length: screenWidth,
          })}
          onScroll={onScroll}
          onMomentumScrollEnd={() => {
            for (let i = 0; i < images.length; i++) {
              if (i !== state.imageIndex && zoomViewRefs[i]) {
                zoomViewRefs[i].resetZoom()
              }
            }
          }}
          renderItem={({ item, index }) => {
            return (
              <ImageZoomView
                image={item}
                index={index}
                ref={ref => {
                  zoomViewRefs[index] = ref
                }}
              />
            )
          }}
        />
      </VerticalSwipeToDismiss>
      <StatusBarOverlay />
      <CloseButton onClose={onClose} />
      <IndexIndicator />
    </Modal>
  )
})

const VerticalSwipeToDismiss: React.FC<{ onClose(): void }> = observer(({ children, onClose }) => {
  const scrollY = useAnimatedValue(screenHeight)
  const { state } = useContext(ImageCarouselContext)

  const scrollOpacity = useMemo(
    () =>
      scrollY.interpolate({
        inputRange: [0, screenHeight, screenHeight * 2],
        outputRange: [0, 1, 0],
      }),
    []
  )

  const isMomentumScrolling = useRef<boolean>(false)
  const onScroll = useCallback(
    (ev: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (!isMomentumScrolling.current) {
        return
      }
      const y = ev.nativeEvent.contentOffset.y
      if (state.fullScreenState === "entered" && (y > screenHeight + screenHeight / 2 || y < screenHeight / 2)) {
        onClose()
      }
    },
    [onClose]
  )

  return (
    <Animated.ScrollView
      scrollsToTop={false}
      scollEnabled={state.fullScreenState === "entered"}
      contentOffset={{ x: 0, y: screenHeight }}
      onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
        useNativeDriver: true,
        listener: onScroll,
      })}
      showsVerticalScrollIndicator={false}
      onMomentumScrollBegin={() => (isMomentumScrolling.current = true)}
      onMomentumScrollEnd={() => (isMomentumScrolling.current = false)}
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
})

function useDoublePressCallback<T extends any[]>(cb: (...t: T) => void) {
  const lastPressTime = useRef(0)
  return useMemo(
    () => (...args: T) => {
      const now = Date.now()
      if (now - lastPressTime.current < 400) {
        lastPressTime.current = 0
        return cb(...args)
      } else {
        lastPressTime.current = now
      }
    },
    []
  )
}

const MAX_ZOOM_SCALE = 4

interface ImageZoomView {
  resetZoom(): void
}
interface ImageZoomViewProps {
  image: ImageDescriptor
  ref: React.Ref<ImageZoomView>
  index: number
}

const ImageZoomView: React.RefForwardingComponent<ImageZoomView, ImageZoomViewProps> = observer(
  React.forwardRef(({ image, index }, ref) => {
    const { state, baseImageRefs, dispatch } = useContext(ImageCarouselContext)

    const imageWrapperRef = useRef<{ getNode(): View }>(null)

    const [imageTransitionOffset, setImageTransitionOffset] = useState<TransitionOffset | null>(null)

    const transition = useAnimatedValue(0)
    const transform = useMemo(() => (imageTransitionOffset ? createTransform(transition, imageTransitionOffset) : []), [
      imageTransitionOffset,
    ])

    useEffect(() => {
      // animate image transition on mount
      if (state.fullScreenState !== "entered" && state.imageIndex === index) {
        const { marginHorizontal, marginVertical, ...dimensions } = fitInside(screenBoundingBox, image)
        getTransitionOffset({
          fromRef: baseImageRefs[state.imageIndex],
          toBox: { ...dimensions, x: marginHorizontal, y: marginVertical },
        })
          .then(setImageTransitionOffset)
          .then(() => {
            dispatch({ type: "FULL_SCREEN_INITIAL_RENDER_COMPLETED" })
            requestAnimationFrame(() => {
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

    // expose resetZoom so that when the user swipes, the off-screen zoom levels are reset
    useImperativeHandle(ref, () => ({ resetZoom }), [])

    const onDoublePress = useDoublePressCallback((ev: NativeSyntheticEvent<NativeTouchEvent>) => {
      const { locationX, locationY } = ev.nativeEvent
      if (zoomScale.current > 3) {
        resetZoom()
      } else {
        // zoom to tapped point
        const w = screenWidth / MAX_ZOOM_SCALE
        const h = screenHeight / MAX_ZOOM_SCALE
        scrollViewRef.current.scrollResponderZoomTo({
          x: locationX - w / 2,
          y: locationY - h / 2,
          width: w,
          height: h,
        })
      }
    })

    // as a perf optimisation, when doing the 'zoom im' transition, we only render the
    // current zoomable image
    // in place of the other images we just render a blank box
    if (state.fullScreenState !== "entered" && index !== state.imageIndex) {
      return <View style={screenBoundingBox} />
    }

    return (
      // scroll view to allow pinch-to-zoom behaviour
      <ScrollView
        ref={scrollViewRef}
        scrollEnabled={state.fullScreenState === "entered"}
        onScroll={ev => {
          zoomScale.current = ev.nativeEvent.zoomScale
          if (state.imageIndex === index) {
            state.isZoomedCompletelyOut = zoomScale.current <= 1
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
            opacity: state.fullScreenState !== "doing first render" ? 1 : 0,
          },
        ]}
      >
        <TouchableWithoutFeedback onPress={onDoublePress}>
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
        </TouchableWithoutFeedback>
      </ScrollView>
    )
  })
)

const useSpringFade = (fade: "in" | "out") => {
  const fullScreenState = useFullScreenState()
  const [from, to] = fade === "in" ? [0, 1] : [1, 0]
  return useSpringValue(fullScreenState === "animating entry transition" || fullScreenState === "entered" ? to : from)
}

const WhiteUnderlay: React.FC = observer(() => {
  const opacity = useSpringFade("in")

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
})

// used to mask the image during initial transition in case the user has scrolled down some
// before tapping the image to open the full screen carousel. Without this there's a nasty
// jarring pop where the area of the image that was behind the status bar becomes fully visible.
const StatusBarOverlay: React.FC = observer(() => {
  const opacity = useSpringFade("out")
  const { top: height } = useContext(SafeAreaInsetsContext)
  return (
    <Animated.View
      style={{
        position: "absolute",
        top: 0,
        right: 0,
        left: 0,
        opacity,
        height,
        backgroundColor: "white",
      }}
    />
  )
})

// taken from https://github.com/ds300/eigen/blob/0831853cb574566415f3bd8b3908b26b61f61eec/Artsy/View_Controllers/Util/ARNavigationController.m#L125
const CLOSE_BUTTON_MARGIN = 12

const CloseButton: React.FC<{ onClose(): void }> = observer(({ onClose }) => {
  const opacity = useSpringFade("in")
  const { top } = useContext(SafeAreaInsetsContext)
  return (
    <View
      style={{
        position: "absolute",
        left: 0,
        top,
        width: 40,
        height: 40,
        paddingLeft: CLOSE_BUTTON_MARGIN,
        paddingTop: CLOSE_BUTTON_MARGIN,
        paddingRight: 20,
        paddingBottom: 20,
      }}
    >
      <TouchableOpacity onPress={onClose}>
        <Animated.View
          style={[
            styles.shadow,
            {
              opacity,
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: "white",
              alignItems: "center",
              justifyContent: "center",
            },
          ]}
        >
          <CloseIcon />
        </Animated.View>
      </TouchableOpacity>
    </View>
  )
})

const IndexIndicator: React.FC = observer(() => {
  const { images, state } = useContext(ImageCarouselContext)

  const imageIndex = useImageIndex()
  const entryOpacity = useSpringFade("in")
  const hideOpacity = useSpringValue(state.isZoomedCompletelyOut ? 1 : 0)
  const opacity = Animated.multiply(entryOpacity, hideOpacity)
  if (images.length === 1) {
    return null
  }
  return (
    <View
      style={{
        position: "absolute",
        bottom: 20,
        right: 0,
        left: 0,
        height: 30,
        alignItems: "center",
      }}
    >
      <Animated.View
        style={[
          styles.shadow,
          {
            borderRadius: 15,
            height: 30,
            backgroundColor: "white",
            justifyContent: "center",
            paddingHorizontal: 10,
            opacity,
          },
        ]}
      >
        <Sans size="3">
          {imageIndex + 1} of {images.length}
        </Sans>
      </Animated.View>
    </View>
  )
})

const styles = StyleSheet.create({
  shadow: {
    shadowColor: "black",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
  },
})
