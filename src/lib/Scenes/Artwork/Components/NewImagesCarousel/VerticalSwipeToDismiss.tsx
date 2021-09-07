import { useScreenDimensions } from "lib/utils/useScreenDimensions"
import React, { ReactNode, useCallback } from "react"
import { PanGestureHandler, State } from "react-native-gesture-handler"
import Animated, { add, block, call, cond, eq, greaterThan, set, useCode } from "react-native-reanimated"
import { snapPoint, timing, usePanGestureHandler, useValue } from "react-native-redash/lib/module/v1"
import { NewImagesCarouselStore } from "./NewImagesCarouselContext"

const VERTICAL_SWIPE_THRESHOLD = 100

interface VerticalSwipeToDismissProps {
  children: ReactNode
}

export const VerticalSwipeToDismiss: React.FC<VerticalSwipeToDismissProps> = ({ children }) => {
  const fullScreenState = NewImagesCarouselStore.useStoreState((storeState) => storeState.fullScreenState)

  const offsetY = useValue(0)
  const translateY = useValue(0)

  const screenDimensions = useScreenDimensions()

  const setFullScreenState = NewImagesCarouselStore.useStoreActions((actions) => actions.setFullScreenState)

  const { gestureHandler, translation, state, velocity } = usePanGestureHandler()

  const to = snapPoint(translateY, velocity.y, [screenDimensions.height])

  const closeModal = useCallback(() => {
    if (fullScreenState === "entered" || fullScreenState === "entering") {
      setFullScreenState("closing")
    }
  }, [fullScreenState])

  useCode(
    () => [
      cond(eq(state, State.ACTIVE), [set(translateY, add(offsetY, translation.y))]),
      cond(
        eq(state, State.END),
        cond(
          greaterThan(translateY, VERTICAL_SWIPE_THRESHOLD),
          // Swipe the content the bottom of the screen then close the modal
          block([set(translateY, timing({ from: translateY, to })), call([], closeModal)]),
          // Snap back modal to full screen
          set(translateY, timing({ from: translateY, to: 0 }))
        )
      ),
    ],
    []
  )

  return (
    <PanGestureHandler {...gestureHandler}>
      <Animated.View style={{ transform: [{ translateY }] }}>{children}</Animated.View>
    </PanGestureHandler>
  )
}
