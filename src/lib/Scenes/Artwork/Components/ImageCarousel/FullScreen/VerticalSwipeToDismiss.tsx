import { observer } from "mobx-react"
import { useCallback, useContext, useMemo, useRef } from "react"
import React from "react"
import { Animated, NativeScrollEvent, NativeSyntheticEvent, View } from "react-native"
import { ImageCarouselContext } from "../ImageCarouselContext"
import { useAnimatedValue } from "../useAnimatedValue"
import { screenHeight } from "./screen"

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
export const VerticalSwipeToDismiss: React.FC<{ onClose(): void }> = observer(({ children, onClose }) => {
  // keep track of the scroll view's scrollY value
  const scrollY = useAnimatedValue(screenHeight)

  const opacity = useMemo(
    () =>
      scrollY.interpolate({
        inputRange: [0, screenHeight, screenHeight * 2],
        outputRange: [0, 1, 0],
      }),
    []
  )

  const { state } = useContext(ImageCarouselContext)
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
        state.fullScreenState === "entered" &&
        // if the user ends up scrolling at least half a screen, trigger the 'onClose' callback.
        (y > screenHeight + screenHeight / 2 || y < screenHeight / 2)
      ) {
        onClose()
      }
    },
    [onClose]
  )

  return (
    <Animated.ScrollView
      // prevent tapping the status bar from triggering a scroll in this scroll view
      scrollsToTop={false}
      // don't let the user dismiss until after we've fnished showing the full screen mode
      scollEnabled={state.fullScreenState === "entered"}
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
      scrollEventThrottle={16}
    >
      <View style={{ height: screenHeight * 3, alignItems: "flex-start", justifyContent: "flex-start" }}>
        <View style={{ height: screenHeight, marginTop: screenHeight }}>{children}</View>
      </View>
    </Animated.ScrollView>
  )
})
