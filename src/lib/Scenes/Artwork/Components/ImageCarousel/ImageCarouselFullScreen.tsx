import OpaqueImageView from "lib/Components/OpaqueImageView"
import { once } from "lodash"
import React, { useCallback, useContext, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react"
import {
  Animated,
  Dimensions,
  FlatList,
  Image,
  Modal,
  NativeScrollEvent,
  NativeSyntheticEvent,
  NativeTouchEvent,
  ScrollView,
  TouchableWithoutFeedback,
  View,
} from "react-native"
import { fitInside } from "./geometry"
import { ImageDescriptor } from "./ImageCarousel"

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

const screenHeight = Dimensions.get("screen").height
const screenWidth = Dimensions.get("screen").width
const screenBoundingBox = { width: screenWidth, height: screenHeight }

const EntryContext = React.createContext<{
  hasEntered: boolean
  isEntering: boolean
  didEnter(): void
  didStartEntering()
}>(null)

export const ImageCarouselFullScreen: React.FC<{
  baseImageRef: Image
  images: ImageDescriptor[]
  imageIndex: number
  setImageIndex(index: number): void
  onClose(): void
}> = ({ baseImageRef, images, onClose, imageIndex, setImageIndex }) => {
  const [hasEntered, setHasEntered] = useState(false)
  const [isEntering, setIsEntering] = useState(false)

  // update the imageIndex on scroll
  const onScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      setImageIndex(Math.round(e.nativeEvent.contentOffset.x / screenWidth))
    },
    [setImageIndex]
  )

  const zoomViewRefs: ImageZoomView[] = useMemo(() => [], [])

  return (
    // on mount we want the modal to be visible instantly and handle transitions elsewhere ourselves
    // on unmount we use it's built-in fade transition
    <Modal transparent animated={hasEntered} animationType="fade">
      {/* This underlay fades in while the image is opaque instantly */}
      <WhiteUnderlay isEntering={isEntering} />
      <EntryContext.Provider
        value={{
          hasEntered,
          isEntering,
          didEnter() {
            setHasEntered(true)
            setIsEntering(true)
          },
          didStartEntering() {
            setIsEntering(true)
          },
        }}
      >
        <VerticalSwipeToDismiss onClose={onClose}>
          <FlatList<ImageDescriptor>
            data={images}
            horizontal
            showsHorizontalScrollIndicator={false}
            scrollEnabled={images.length > 1}
            snapToInterval={screenBoundingBox.width}
            keyExtractor={item => item.url}
            decelerationRate="fast"
            initialScrollIndex={imageIndex}
            getItemLayout={(_, index) => ({
              index,
              offset: index * screenWidth,
              length: screenWidth,
            })}
            onScroll={onScroll}
            onMomentumScrollEnd={() => {
              for (let i = 0; i < images.length; i++) {
                if (i !== imageIndex && zoomViewRefs[i]) {
                  zoomViewRefs[i].resetZoom()
                }
              }
            }}
            initialNumToRender={3}
            windowSize={5}
            maxToRenderPerBatch={3}
            renderItem={({ item, index }) => {
              return (
                <ImageZoomView
                  image={item}
                  baseImageRef={baseImageRef}
                  ref={ref => {
                    zoomViewRefs[index] = ref
                  }}
                />
              )
            }}
          />
        </VerticalSwipeToDismiss>
      </EntryContext.Provider>
    </Modal>
  )
}

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
  const dismiss = useMemo(() => once(() => setTimeout(onClose, 50)), [onClose])

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
  baseImageRef: Image
  ref: React.Ref<ImageZoomView>
}
const ImageZoomView: React.RefForwardingComponent<ImageZoomView, ImageZoomViewProps> = React.forwardRef(
  ({ image, baseImageRef }, ref) => {
    const { hasEntered, isEntering, didEnter, didStartEntering } = useContext(EntryContext)
    const imageWrapperRef = useRef<{ getNode(): View }>(null)

    const [imageTransitionOffset, setImageTransitionOffset] = useState<TransitionOffset | null>(null)

    const transition = useAnimatedValue(0)
    const transform = useMemo(() => (imageTransitionOffset ? createTransform(transition, imageTransitionOffset) : []), [
      imageTransitionOffset,
    ])

    const animateTransition = useCallback(() => {
      didStartEntering()
      Animated.spring(transition, {
        bounciness: 0,
        toValue: 1,
        useNativeDriver: true,
      }).start(didEnter)
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

    const scrollViewRef = useRef<ScrollView>()
    const zoomScaleRef = useRef<number>(0)

    const resetZoom = useCallback(() => {
      if (scrollViewRef.current && zoomScaleRef.current !== 1) {
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
      if (zoomScaleRef.current > 3) {
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

    return (
      // scroll view to allow pinch-to-zoom behaviour
      <ScrollView
        ref={scrollViewRef}
        scrollEnabled={hasEntered}
        onScroll={ev => (zoomScaleRef.current = ev.nativeEvent.zoomScale)}
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
            opacity: hasEntered || isEntering ? 1 : 0,
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
  }
)

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
