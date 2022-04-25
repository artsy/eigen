import { useScreenDimensions } from "app/utils/useScreenDimensions"
import React, { useContext, useEffect, useRef, useState } from "react"
import { InteractionManager, Modal, Platform } from "react-native"
import { useSafeAreaFrame } from "react-native-safe-area-context"
import {
  ArtsyKeyboardAvoidingView,
  ArtsyKeyboardAvoidingViewContext,
} from "../ArtsyKeyboardAvoidingView"
import {
  CARD_STACK_OVERLAY_HEIGHT,
  CARD_STACK_OVERLAY_Y_OFFSET,
  FancyModalAnimationPosition,
} from "./FancyModalCard"
import { FancyModalContext } from "./FancyModalContext"

export const FancyModal: React.FC<{
  visible: boolean
  maxHeight?: number
  fullScreen?: boolean
  animationPosition?: FancyModalAnimationPosition
  onBackgroundPressed?(): void
  onModalFinishedClosing?(): void
}> = ({
  visible,
  children,
  maxHeight,
  fullScreen,
  animationPosition,
  onModalFinishedClosing,
  onBackgroundPressed = () => null,
}) => {
  const {
    height: screenHeight,
    safeAreaInsets: { top },
  } = useScreenDimensions()
  const frame = useSafeAreaFrame()

  const actualMaxHeight =
    screenHeight - (top + CARD_STACK_OVERLAY_HEIGHT + CARD_STACK_OVERLAY_Y_OFFSET)
  let height: number

  if (fullScreen) {
    height = Platform.select({
      ios: screenHeight,
      /**
       * Android has a problem when getting window height
       * https://github.com/facebook/react-native/issues/23693
       */
      default: frame.height,
    })
  } else if (maxHeight) {
    height = Math.min(maxHeight, actualMaxHeight)
  } else {
    height = actualMaxHeight
  }

  const firstMount = useRef(true)

  const [showingUnderlyingModal, setShowingUnderlyingModal] = useState(visible)

  const context = useContext(FancyModalContext)
  const card = context.useCard({
    height,
    fullScreen,
    animationPosition,
    // background never shrinks on android
    backgroundShouldShrink: Platform.OS === "ios" && !maxHeight && !fullScreen,
    content: showingUnderlyingModal ? (
      /* Keyboard Avoiding
        This works fine for full-screen fancy modals but a couple of caveats for the future:
        - We might want to allow consumers to turn this off
        - Consumers might have bottom-padding on their modal content that they
          don't want to be pushed up, so we could allow them to subtract that
          from the keyboardVerticalOffset
        - non-full-screen modals with text inputs will require us implementing
          a custom keyboardAvoidingView which is able to combine the 'padding' and
          'position' strategies. When the keyboard opens we'd first want to bring the modal
          up to the maximum 'top' value, and then add padding if the keyboard comes up any more.
          I'd imagine it would have an API like <FancyKeyboardAvoding height={sheetHeighht} maxHeight={screenHeight - (top + 10)}>
      */
      <ArtsyKeyboardAvoidingViewContext.Provider
        value={{ isPresentedModally: true, isVisible: true, bottomOffset: 0 }}
      >
        <ArtsyKeyboardAvoidingView>{children}</ArtsyKeyboardAvoidingView>
      </ArtsyKeyboardAvoidingViewContext.Provider>
    ) : null,
    onBackgroundPressed,
  })

  useEffect(() => {
    let interactionManagerPromise: ReturnType<
      typeof InteractionManager.runAfterInteractions
    > | null = null
    if (visible) {
      setShowingUnderlyingModal(true)
      // We need to wait until the animation is over before showing the underlying modal
      interactionManagerPromise = InteractionManager.runAfterInteractions(card.show)
    } else {
      if (!firstMount.current) {
        card.hide().then(() => {
          setShowingUnderlyingModal(false)
          if (onModalFinishedClosing) {
            interactionManagerPromise =
              // We need to wait until the animation is over before executing the callback
              InteractionManager.runAfterInteractions(onModalFinishedClosing)
          }
        })
      }
    }
    firstMount.current = false
    return interactionManagerPromise?.cancel
  }, [visible])

  return (
    <Modal
      transparent
      animated={false}
      visible={showingUnderlyingModal}
      statusBarTranslucent
      onRequestClose={onBackgroundPressed}
    >
      <FancyModalContext.Provider value={context.nextLevel()}>
        {card.jsx}
      </FancyModalContext.Provider>
    </Modal>
  )
}
