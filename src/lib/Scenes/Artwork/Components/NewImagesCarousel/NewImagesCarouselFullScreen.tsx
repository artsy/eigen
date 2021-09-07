import { useAnimatedValue } from "lib/utils/useAnimatedValue"
import { Flex } from "palette"
import React, { useCallback, useEffect } from "react"
import { Animated, Easing, Modal, StyleSheet } from "react-native"
import { NewImagesCarouselCloseButton } from "./NewImagesCarouselCloseButton"
import { NewImagesCarouselStore } from "./NewImagesCarouselContext"
import { useSpringFade } from "./useSpringFade"
import { VerticalSwipeToDismiss } from "./VerticalSwipeToDismiss"

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
    <Modal transparent animated={false} statusBarTranslucent hardwareAccelerated onRequestClose={onClose}>
      <Animated.View
        style={{
          ...StyleSheet.absoluteFillObject,
          opacity: modalOpacity,
        }}
      >
        <WhiteUnderlay />
        <VerticalSwipeToDismiss>
          <Flex justifyContent="center" alignItems="center">
            <Flex height={100} width={200} backgroundColor="red" />
            <Flex height={200} width={150} backgroundColor="blue" />
            <Flex height={300} width={180} backgroundColor="green" />
            <Flex height={250} width={250} backgroundColor="yellow" />
            <Flex height={150} width={300} backgroundColor="pink" />
          </Flex>
        </VerticalSwipeToDismiss>

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
