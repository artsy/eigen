import { Color, Flex, Touchable } from "@artsy/palette-mobile"
import { forwardRef, useCallback } from "react"
import ReanimatedSwipeable, {
  SwipeableMethods,
  SwipeableRef,
} from "react-native-gesture-handler/ReanimatedSwipeable"
import { SharedValue } from "react-native-reanimated"

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

  const renderRightActions: (
    progress: SharedValue<number>,
    dragX: SharedValue<number>,
    swipable: SwipeableMethods
  ) => React.ReactNode = useCallback(() => {
    return (
      <Touchable haptic onPress={actionOnPress}>
        <Flex
          ml={1}
          p={1}
          flex={1}
          minWidth={71}
          bg={actionBackground}
          alignItems="center"
          justifyContent="center"
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
      renderRightActions={renderRightActions}
      friction={1.5}
      {...swipeableProps}
    >
      {children}
    </ReanimatedSwipeable>
  )
})
