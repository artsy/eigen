import { useScreenDimensions } from "lib/utils/useScreenDimensions"
import React, { useContext, useEffect, useRef, useState } from "react"
import { KeyboardAvoidingView, Modal } from "react-native"
import { CARD_STACK_OVERLAY_HEIGHT, CARD_STACK_OVERLAY_Y_OFFSET } from "./FancyModalCard"
import { FancyModalContext } from "./FancyModalContext"

export const FancyModal: React.FC<{ visible: boolean; maxHeight?: number; onBackgroundPressed(): void }> = ({
  visible,
  children,
  onBackgroundPressed,
  maxHeight,
}) => {
  const {
    height: screenHeight,
    safeAreaInsets: { top },
  } = useScreenDimensions()

  const actualMaxHeight = screenHeight - (top + CARD_STACK_OVERLAY_HEIGHT + CARD_STACK_OVERLAY_Y_OFFSET)
  const height = maxHeight ? Math.min(maxHeight, actualMaxHeight) : actualMaxHeight

  const firstMount = useRef(true)

  const [showingUnderlyingModal, setShowingUnderlyingModal] = useState(visible)

  const context = useContext(FancyModalContext)
  const card = context.useCard({
    height,
    backgroundShouldShrink: !maxHeight,
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
      <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }} keyboardVerticalOffset={screenHeight - height}>
        {children}
      </KeyboardAvoidingView>
    ) : null,
    onBackgroundPressed,
  })

  useEffect(() => {
    if (visible) {
      setShowingUnderlyingModal(true)
      requestAnimationFrame(card.show)
    } else {
      if (!firstMount.current) {
        card.hide().then(() => {
          setShowingUnderlyingModal(false)
        })
      }
    }
    firstMount.current = false
  }, [visible])

  return (
    <Modal transparent animated={false} visible={showingUnderlyingModal}>
      <FancyModalContext.Provider value={context.nextLevel()}>{card.jsx}</FancyModalContext.Provider>
    </Modal>
  )
}
