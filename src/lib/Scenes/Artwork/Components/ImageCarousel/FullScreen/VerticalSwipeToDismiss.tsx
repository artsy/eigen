import { useScreenDimensions } from "lib/utils/useScreenDimensions"
import { useCallback, useContext, useEffect, useMemo, useRef } from "react"
import React from "react"
import { Animated, NativeScrollEvent, NativeSyntheticEvent, ScrollView, View } from "react-native"
import { ImageCarouselContext } from "../ImageCarouselContext"
import { useAnimatedValue } from "../useAnimatedValue"

/**
 * Wraps the content in a scroll view which provides a 'vertical swipe' facility.
 *
 * It makes the scroll view 3x the device height and positions the actual content
 * in the middle section.
 *
 *  +-----+
 *  |     |
 *  |     |
 *  |     |
 *  |     |
 *  +-----+
 *  | the |
 *  | con |
 *  | ten |
 *  | t   |
 *  +-----+
 *  |     |
 *  |     |
 *  |     |
 *  |     |
 *  +-----+
 *
 * Everything else is blank space.
 * When the user swipes away from the center of the scroll view, the opacity is decreased.
 * If the user stops scrolling at a large enough threshold, the 'onClose' callback is called.
 *
 */
export const VerticalSwipeToDismiss: React.FC<{ onClose(): void }> = ({ children, onClose }) => {
  // keep track of the scroll view's scrollY value
  const { height: screenHeight, width: screenWidth, orientation } = useScreenDimensions()
  const scrollY = useAnimatedValue(screenHeight)

  const opacity = useMemo(
    () =>
      scrollY.interpolate({
        inputRange: [0, screenHeight, screenHeight * 2],
        outputRange: [0, 1, 0],
      }),
    []
  )

  const { fullScreenState } = useContext(ImageCarouselContext)
  fullScreenState.useUpdates()
  // only want to trigger the onClose call if the user is not still touching
  // and the scroll view is still going with momentum.
  const isMomentumScrolling = useRef<boolean>(false)
  const onScroll = useCallback(
    (ev: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (!isMomentumScrolling.current) {
        return
      }
      const y = ev.nativeEvent.contentOffset.y
      if (
        // this state.fullScreenState check is to prvent some glitchy behaviour that can occur right
        // after mounting. Somehow a momentum scroll is triggered in some situations. :shrug:
        fullScreenState.current === "entered" &&
        // if the user ends up scrolling at least half a screen, trigger the 'onClose' callback.
        (y > screenHeight + screenHeight / 2 || y < screenHeight / 2)
      ) {
        onClose()
      }
    },
    [onClose]
  )

  const ref = useRef<{ getNode(): ScrollView }>()

  // 😭😭😭
  // sometimes in landscape mode the `contentOffset` prop is not respected
  // and the contentOffset ends up being too low.
  // What is this I don't even.
  // So we set it manually after mounting and orientation change to make sure it's always good.
  useEffect(
    () => {
      setTimeout(() => {
        ref.current.getNode().scrollTo({ animated: false, x: 0, y: screenHeight })
      }, 10)
    },
    [screenHeight]
  )

  return (
    <Animated.ScrollView
      ref={ref}
      key={orientation}
      // prevent tapping the status bar from triggering a scroll in this scroll view
      scrollsToTop={false}
      // don't let the user dismiss until after we've fnished showing the full screen mode
      scollEnabled={fullScreenState.current === "entered"}
      contentOffset={{ x: 0, y: screenHeight }}
      onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
        useNativeDriver: true,
        listener: onScroll,
      })}
      showsVerticalScrollIndicator={false}
      onMomentumScrollBegin={() => (isMomentumScrolling.current = true)}
      onMomentumScrollEnd={() => (isMomentumScrolling.current = false)}
      style={[{ opacity }]}
      snapToInterval={screenHeight}
      decelerationRate="fast"
      scrollEventThrottle={0.000000001}
    >
      <View style={{ height: screenHeight * 3, width: screenWidth }}>
        <View style={{ height: screenHeight, width: screenWidth, marginTop: screenHeight }}>{children}</View>
      </View>
    </Animated.ScrollView>
  )
}
