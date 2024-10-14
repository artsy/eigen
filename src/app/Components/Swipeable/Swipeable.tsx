import { Color, Flex, Touchable, useColor } from "@artsy/palette-mobile"
import { forwardRef, useRef } from "react"
import ReanimatedSwipeable, {
  SwipeableMethods,
  SwipeableRef,
} from "react-native-gesture-handler/ReanimatedSwipeable"
import Animated, {
  runOnJS,
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated"

const FRICTION = 1.2
const SWIPE_TO_INTERACT_THRESHOLD = 80

export interface SwipeableProps {
  children: React.ReactNode
  actionOnPress?: () => void
  actionOnSwipe?: () => void
  actionComponent: React.ReactNode
  actionBackground?: Color
  swipeableProps?: SwipeableProps
  enabled?: boolean
  /**
   * The width of the action component. We need to set it to make the swipeable animation.\
   * Make sure to consider font scaling when setting this value.
   */
  actionComponentWidth: number
}

export const Swipeable = forwardRef((props: SwipeableProps, swipeableRef: SwipeableRef) => {
  const {
    children,
    actionOnPress,
    actionOnSwipe,
    actionComponent,
    actionComponentWidth,
    actionBackground = "red100",
    enabled = true,
    swipeableProps,
  } = props

  const color = useColor()
  const width = useSharedValue(0)

  const hasSwiped = useRef(false)

  const handleSwipeToInteract = () => {
    hasSwiped.current = true
    actionOnSwipe?.()
  }

  const RightActions = (
    progress: SharedValue<number>,
    dragX: SharedValue<number>,
    _swipable: SwipeableMethods
  ): React.ReactNode => {
    const animatedStyles = useAnimatedStyle(() => {
      "worklet"

      const style = {
        width: progress.value >= 1 ? -dragX.value - 10 : undefined,
      }

      // Don't do anything if the action is disabled, if the user has already swiped, or if the width is not yet set (on first render)
      if (!actionOnSwipe || hasSwiped.current || !width.value) return style

      if (width.value + dragX.value * FRICTION <= SWIPE_TO_INTERACT_THRESHOLD) {
        // TODO: Add haptic feedback

        runOnJS(handleSwipeToInteract)()
      }

      return style
    })

    return (
      <Touchable haptic onPress={actionOnPress}>
        <Flex flex={1} ml={1} flexDirection="column" width={actionComponentWidth}>
          <Animated.View
            style={[
              animatedStyles,
              {
                // Setting the position to absolute to not change the actual width of the action component.
                position: "absolute",
                top: 0,
                right: 0,
                height: "100%",
                backgroundColor: color(actionBackground),
                borderColor: color(actionBackground),
                borderRadius: 5,
                minWidth: actionComponentWidth,
                justifyContent: "center",
                padding: 10,
              },
            ]}
          >
            <Flex m="auto">{actionComponent}</Flex>
          </Animated.View>
        </Flex>
      </Touchable>
    )
  }

  return (
    <Flex
      onLayout={(event) => {
        width.value = event.nativeEvent.layout.width
      }}
    >
      <ReanimatedSwipeable
        testID="swipeable-component"
        ref={swipeableRef}
        enabled={enabled}
        renderRightActions={RightActions}
        friction={FRICTION}
        {...swipeableProps}
      >
        {children}
      </ReanimatedSwipeable>
    </Flex>
  )
})
