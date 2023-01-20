import { useColor } from "palette"
import {
  GestureEventPayload,
  HandlerStateChangeEventPayload,
  PanGestureHandler,
  PanGestureHandlerEventPayload,
  State,
} from "react-native-gesture-handler"
import Animated from "react-native-reanimated"
import { useAnimatedValue } from "./reanimatedHelpers"
import { RegisteredListRefs } from "./StickyTabPage"
import { useStickyTabPageContext } from "./StickyTabPageContext"

export const StaticHeaderContainer: React.FC<{
  registeredListRefs: RegisteredListRefs
}> = (props) => {
  const color = useColor()
  const { headerOffsetY, activeTabIndex } = useStickyTabPageContext()
  const isEngaged = useAnimatedValue(0)
  const translationPositionY = useAnimatedValue(0)
  const offsetYBeforeGesture = useAnimatedValue(0)

  activeTabIndex.useUpdates()

  // This keeps the offsetYBeforeGesture updated when we switch tabs or when
  // directly scrolling on the StickyTabFlatlist
  Animated.useCode(
    () => Animated.cond(isEngaged, [], Animated.set(offsetYBeforeGesture, headerOffsetY)),
    [isEngaged, headerOffsetY]
  )

  // Scrolling happens here. As translationY changes, we find the active
  // Flatlist ref and trigger a scroll on it
  Animated.useCode(
    () =>
      Animated.cond(
        isEngaged,
        Animated.call(
          [translationPositionY, offsetYBeforeGesture],
          ([translationY, initialOffset]) => {
            const scrollingUp = 0 >= translationY
            props.registeredListRefs[activeTabIndex.current]?.scrollToOffset({
              animated: false,
              offset: scrollingUp
                ? Math.abs(translationY) - initialOffset
                : Math.abs(initialOffset) - translationY,
            })
          }
        )
      ),
    [translationPositionY]
  )

  const _onGestureEvent = Animated.event(
    [
      {
        nativeEvent: ({ translationY }: GestureEventPayload & PanGestureHandlerEventPayload) =>
          Animated.block([Animated.set(translationPositionY, translationY)]),
      },
    ],
    {
      useNativeDriver: true,
    }
  )

  const _onHandlerStateChange = Animated.event(
    [
      {
        nativeEvent: ({
          state,
          oldState,
        }: HandlerStateChangeEventPayload & PanGestureHandlerEventPayload) =>
          Animated.block([
            Animated.cond(
              Animated.eq(oldState, State.ACTIVE),
              // When the state changes from active to another, we update the offsetYBeforeGesture with the headerOffsetY
              // This way when we resume scrolling the value is not reset or off
              Animated.block([
                Animated.set(isEngaged, 0),
                Animated.set(offsetYBeforeGesture, headerOffsetY),
              ])
            ),
            Animated.cond(Animated.eq(state, State.ACTIVE), Animated.set(isEngaged, 1)),
          ]),
      },
    ],
    {
      useNativeDriver: true,
    }
  )

  return (
    <PanGestureHandler
      onGestureEvent={_onGestureEvent}
      onHandlerStateChange={_onHandlerStateChange}
    >
      <Animated.View style={[{ backgroundColor: color("white100") }]}>
        {props.children}
      </Animated.View>
    </PanGestureHandler>
  )
}
