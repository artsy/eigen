import { act } from "@testing-library/react-native"
import { ReactTestInstance } from "react-test-renderer"

/**
 * Presses an action rendered by a `ReanimatedSwipeable` (e.g. a "Clear" button behind a row).
 *
 * Since react-native-gesture-handler 2.33 the actions container has `pointerEvents: "none"` until
 * the row is swiped open, so closed actions no longer intercept touches. Jest can't run the swipe
 * gesture, so `fireEvent.press` correctly refuses to press a closed action. This calls the nearest
 * `onPress` handler directly instead.
 */
export const pressSwipeableAction = (element: ReactTestInstance) => {
  let node: ReactTestInstance | null = element

  while (node && typeof node.props.onPress !== "function") {
    node = node.parent
  }

  if (!node) {
    throw new Error("pressSwipeableAction: no ancestor with an onPress handler was found")
  }

  const handler = node.props.onPress

  act(() => {
    handler()
  })
}
