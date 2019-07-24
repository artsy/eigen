import { observer } from "mobx-react"
import { useCallback, useContext, useMemo, useRef } from "react"
import React from "react"
import { Animated, NativeScrollEvent, NativeSyntheticEvent, View } from "react-native"
import { ImageCarouselContext } from "../ImageCarouselContext"
import { useAnimatedValue } from "../useAnimatedValue"
import { screenHeight } from "./screen"

export const VerticalSwipeToDismiss: React.FC<{ onClose(): void }> = observer(({ children, onClose }) => {
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
