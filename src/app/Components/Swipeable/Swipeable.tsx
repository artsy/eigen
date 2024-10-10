import { Color, Flex, Touchable } from "@artsy/palette-mobile"
import { forwardRef, useRef } from "react"
import ReanimatedSwipeable, {
  SwipeableMethods,
  SwipeableRef,
} from "react-native-gesture-handler/ReanimatedSwipeable"
import { runOnJS, SharedValue, useAnimatedStyle, useSharedValue } from "react-native-reanimated"

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
}

export const Swipeable = forwardRef((props: SwipeableProps, swipeableRef: SwipeableRef) => {
  const {
    children,
    actionOnPress,
    actionOnSwipe,
    actionComponent,
    actionBackground = "red100",
    enabled = true,
    swipeableProps,
  } = props

  const width = useSharedValue(0)

  const hasSwiped = useRef(false)

  const handleSwipeToInteract = () => {
    hasSwiped.current = true
    actionOnSwipe?.()
  }

  const RightActions = (
    _progress: SharedValue<number>,
    dragX: SharedValue<number>,
    _swipable: SwipeableMethods
  ): React.ReactNode => {
    useAnimatedStyle(() => {
      "worklet"
      // Don't do anything if the action is disabled, if the user has already swiped, or if the width is not yet set (on first render)
      if (!actionOnSwipe || hasSwiped.current || !width.value) return {}

      if (width.value + dragX.value * FRICTION <= SWIPE_TO_INTERACT_THRESHOLD) {
        // TODO: Add haptic feedback

        runOnJS(handleSwipeToInteract)()

        return {}
      }

      return {}
    })

    return (
      <Touchable haptic onPress={actionOnPress}>
        <Flex
          flex={1}
          ml={1}
          p={2}
          bg={actionBackground}
          justifyContent="center"
          border="1px solid"
          borderColor={actionBackground}
          borderRadius={5}
        >
          {actionComponent}
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
