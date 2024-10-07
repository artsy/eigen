import { Color, Flex, Touchable } from "@artsy/palette-mobile"
import { forwardRef, useCallback } from "react"
import ReanimatedSwipeable, {
  SwipeableMethods,
  SwipeableRef,
} from "react-native-gesture-handler/ReanimatedSwipeable"
import { SharedValue } from "react-native-reanimated"

const FRICTION = 1.2

export interface SwipeableProps {
  children: React.ReactNode
  actionOnPress: () => void
  actionComponent: React.ReactNode
  actionBackground?: Color
  swipeableProps?: SwipeableProps
  enabled?: boolean
}

export const Swipeable = forwardRef((props: SwipeableProps, swipeableRef: SwipeableRef) => {
  const {
    children,
    actionOnPress,
    actionComponent,
    actionBackground = "red100",
    enabled = true,
    swipeableProps,
  } = props

  const RightActions: (
    progress: SharedValue<number>,
    dragX: SharedValue<number>,
    swipable: SwipeableMethods
  ) => React.ReactNode = useCallback(() => {
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
  }, [actionBackground, actionComponent, actionOnPress])

  return (
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
  )
})
