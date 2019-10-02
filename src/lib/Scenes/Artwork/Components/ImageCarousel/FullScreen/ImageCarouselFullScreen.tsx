import { useScreenDimensions } from "lib/utils/useScreenDimensions"
import React, { useCallback, useContext, useEffect, useMemo, useState } from "react"
import { Animated, Easing, FlatList, Modal, NativeScrollEvent, NativeSyntheticEvent } from "react-native"
import { ImageCarouselContext, ImageDescriptor } from "../ImageCarouselContext"
import { useAnimatedValue } from "../useAnimatedValue"
import { ImageCarouselCloseButton } from "./ImageCarouselCloseButton"
import { ImageZoomView } from "./ImageZoomView"
import { IndexIndicator } from "./IndexIndicator"
import { StatusBarOverlay } from "./StatusBarOverlay"
import { useSpringFade } from "./useSpringFade"
import { VerticalSwipeToDismiss } from "./VerticalSwipeToDismiss"

export const ImageCarouselFullScreen = () => {
  const screenDimensions = useScreenDimensions()
  const { images, dispatch, fullScreenState, imageIndex } = useContext(ImageCarouselContext)
  fullScreenState.useUpdates()
  const initialScrollIndex = useMemo(() => imageIndex.current, [])

  const onClose = useCallback(() => {
    if (fullScreenState.current === "entered") {
      dispatch({ type: "FULL_SCREEN_DISMISSED" })
    }
  }, [])

  // update the imageIndex on scroll
  const onScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const nextImageIndex = Math.round(e.nativeEvent.contentOffset.x / screenDimensions.width)
      if (fullScreenState.current === "entered" && nextImageIndex !== imageIndex.current) {
        dispatch({ type: "IMAGE_INDEX_CHANGED", nextImageIndex })
      }
    },
    [screenDimensions]
  )

  const zoomViewRefs: ImageZoomView[] = useMemo(() => [], [])

  const masterOpacity = useAnimatedValue(1)

  const [ensureNoFlicker, setEnsureNoFlicker] = useState(false)

  useEffect(
    () => {
      if (fullScreenState.current === "exiting") {
        Animated.timing(masterOpacity, {
          duration: 200,
          toValue: 0,
          useNativeDriver: true,
          easing: Easing.ease,
        }).start(() => {
          setEnsureNoFlicker(true)
          setTimeout(() => dispatch({ type: "FULL_SCREEN_FINISHED_EXITING" }), 16)
        })
      }
    },
    [fullScreenState.current]
  )

  return (
    // on mount we want the modal to be visible instantly and handle transitions elsewhere ourselves
    // on unmount we use it's built-in fade transition
    <Modal transparent animated={false} hardwareAccelerated supportedOrientations={["landscape", "portrait"]}>
      <Animated.View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          flex: 1,
          opacity: ensureNoFlicker ? 0 : masterOpacity,
        }}
      >
        <WhiteUnderlay />
        <VerticalSwipeToDismiss onClose={onClose}>
          <FlatList<ImageDescriptor>
            key={screenDimensions.orientation}
            data={images}
            horizontal
            showsHorizontalScrollIndicator={false}
            scrollEnabled={images.length > 1 && fullScreenState.current === "entered"}
            snapToInterval={screenDimensions.width}
            keyExtractor={item => item.url}
            decelerationRate="fast"
            initialScrollIndex={initialScrollIndex}
            getItemLayout={(_, index) => ({
              index,
              offset: index * screenDimensions.width,
              length: screenDimensions.width,
            })}
            onScroll={onScroll}
            onMomentumScrollEnd={() => {
              // reset the zooms of all non-visible zoom views when the horizontal carousel comes to a stop
              for (let i = 0; i < images.length; i++) {
                if (i !== imageIndex.current && zoomViewRefs[i]) {
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
        <ImageCarouselCloseButton onClose={onClose} />
        <IndexIndicator />
      </Animated.View>
    </Modal>
  )
}

/**
 * Used as a backdrop to the full screen image carousel.
 * fades in at the same time as the shared element transition
 * is playing
 */
const WhiteUnderlay: React.FC = () => {
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
}
