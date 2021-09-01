import { useAnimatedValue } from "lib/utils/useAnimatedValue"
import React, { useCallback, useEffect } from "react"
import { Animated, Easing, Modal, StyleSheet } from "react-native"
import { NewImagesCarouselCloseButton } from "./NewImagesCarouselCloseButton"
import { NewImagesCarouselStore } from "./NewImagesCarouselContext"
import { useSpringFade } from "./useSpringFade"

export const NewImagesCarouselFullScreen = () => {
  const fullScreenState = NewImagesCarouselStore.useStoreState((state) => state.fullScreenState)
  const isModalVisible =
    fullScreenState === "entered" || fullScreenState === "entering" || fullScreenState === "closing"
  const setFullScreenState = NewImagesCarouselStore.useStoreActions((actions) => actions.setFullScreenState)

  // const isFullScreenReady = fullScreenState === "entered"

  const modalOpacity = useAnimatedValue(1)

  const onClose = useCallback(() => {
    if (fullScreenState === "entered" || fullScreenState === "entering") {
      setFullScreenState("closing")
    }
  }, [fullScreenState])

  useEffect(() => {
    if (fullScreenState === "closing") {
      Animated.timing(modalOpacity, {
        duration: 200,
        toValue: 0,
        useNativeDriver: true,
        easing: Easing.ease,
      }).start(() => {
        requestAnimationFrame(() => {
          setFullScreenState("closed")
        })
      })
    }
  }, [fullScreenState])

  if (!isModalVisible) {
    return null
  }

  return (
    <Modal transparent animated={false} hardwareAccelerated statusBarTranslucent>
      <Animated.View
        style={{
          ...StyleSheet.absoluteFillObject,
          opacity: modalOpacity,
        }}
      >
        <WhiteUnderlay />
        <NewImagesCarouselCloseButton onClose={onClose} />
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
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "white",
        opacity,
      }}
    />
  )
}
