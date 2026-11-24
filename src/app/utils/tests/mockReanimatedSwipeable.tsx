import { forwardRef, useImperativeHandle, useMemo } from "react"
import { View } from "react-native"
import { useSharedValue } from "react-native-reanimated"
import type {
  SwipeableMethods,
  SwipeableProps,
} from "react-native-gesture-handler/ReanimatedSwipeable"

/**
 * Jest stand-in for `react-native-gesture-handler/ReanimatedSwipeable` that renders the row as if
 * it were swiped open.
 *
 * Since react-native-gesture-handler 2.33 the real actions container has `pointerEvents: "none"`
 * until the row is swiped open. Jest can't run the swipe gesture, so `fireEvent.press` correctly
 * refuses to press a closed action. Here the actions are always pressable, and the swipe callbacks
 * (e.g. `onSwipeableWillOpen`) sit on a host `View` so `fireEvent` can reach them.
 *
 * Usage:
 *   jest.mock("react-native-gesture-handler/ReanimatedSwipeable", () =>
 *     require("app/utils/tests/mockReanimatedSwipeable")
 *   )
 */
const ReanimatedSwipeable = forwardRef<SwipeableMethods, SwipeableProps>(
  // hitSlop is RNGH's (it allows null), not a View prop, so keep it off the View.
  ({ children, renderLeftActions, renderRightActions, hitSlop: _hitSlop, ...rest }, ref) => {
    const progress = useSharedValue(0)
    const translation = useSharedValue(0)

    const methods = useMemo<SwipeableMethods>(
      () => ({ close: jest.fn(), openLeft: jest.fn(), openRight: jest.fn(), reset: jest.fn() }),
      []
    )

    useImperativeHandle(ref, () => methods, [methods])

    return (
      <View {...rest}>
        {renderLeftActions?.(progress, translation, methods)}
        {children}
        {renderRightActions?.(progress, translation, methods)}
      </View>
    )
  }
)

export default ReanimatedSwipeable
