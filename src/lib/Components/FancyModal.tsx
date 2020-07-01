import { useScreenDimensions } from "lib/utils/useScreenDimensions"
import React, { useContext, useEffect, useMemo, useRef, useState } from "react"
import { Animated, KeyboardAvoidingView, Modal, TouchableWithoutFeedback, View } from "react-native"

const blackGutterWidth = 20
const borderRadius = 10

const FancyModalContext = React.createContext<{
  readonly entranceProgress: Animated.Value
  showModal(): void
  hideModal(): Promise<void>
}>(
  __TEST__
    ? {
        entranceProgress: new Animated.Value(0),
        showModal() {
          return
        },
        hideModal: async () => {
          return
        },
      }
    : (null as any)
)

export const _FancyModalPageWrapper: React.FC = ({ children }) => {
  const entranceProgress = useMemo(() => {
    return new Animated.Value(0)
  }, [])

  const {
    width,
    safeAreaInsets: { top },
  } = useScreenDimensions()

  const [backdropSize, setBackdropSize] = useState({ width: 1, height: 1 })
  const backdropShrinkageMultiplier = (width - 2 * blackGutterWidth) / width
  const backdropShrinkageVerticalOffset = (backdropSize.height - backdropSize.height * backdropShrinkageMultiplier) / 2
  const shrunkenBackdropTranslateY = top - backdropShrinkageVerticalOffset

  const contentGrowthMultiplier = width / (width - 2 * (blackGutterWidth / 4))

  const showModal = () => {
    Animated.spring(entranceProgress, {
      toValue: 1,
      useNativeDriver: true,
      bounciness: -7,
      speed: 13,
    }).start()
  }

  // hideModal returns a promise because we need to wait for it to finish before hiding the underlying
  // react-native Modal
  const hideModal = async () => {
    await new Promise(r => {
      // use regular ease-in-out because the lack of spring is
      // less noticeable here and `timing` gives nice prompt
      // completion callbacks while `spring` can take a while
      Animated.timing(entranceProgress, {
        toValue: 0,
        useNativeDriver: true,
        duration: 340,
      }).start(r)
    })
  }

  return (
    <View style={{ backgroundColor: "black", flex: 1 }} onLayout={e => setBackdropSize(e.nativeEvent.layout)}>
      {/* This view provides the shrinking, the border radius, and pushing the 'card' down */}
      <Animated.View
        style={{
          flex: 1,
          backgroundColor: "white",
          borderRadius: entranceProgress.interpolate({
            inputRange: [0, 1],
            outputRange: [0, borderRadius],
          }),
          overflow: "hidden",
          transform: [
            {
              scale: entranceProgress.interpolate({
                inputRange: [0, 1],
                outputRange: [1, backdropShrinkageMultiplier],
              }),
            },
            {
              translateY: entranceProgress.interpolate({
                inputRange: [0, 1],
                outputRange: [0, shrunkenBackdropTranslateY],
              }),
            },
          ],
        }}
      >
        {/* This view slightly scales up the main content while it's borders shrink to give an subtle paralax effect */}
        <Animated.View
          style={{
            flex: 1,
            transform: [
              {
                scale: entranceProgress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, contentGrowthMultiplier],
                }),
              },
            ],
          }}
        >
          <FancyModalContext.Provider value={{ showModal, hideModal, entranceProgress }}>
            {children}
          </FancyModalContext.Provider>
        </Animated.View>
      </Animated.View>
    </View>
  )
}

export const FancyModal: React.FC<{ visible: boolean; maxHeight?: number; onBackgroundPressed(): void }> = ({
  visible,
  children,
  onBackgroundPressed,
  maxHeight,
}) => {
  const firstMount = useRef(true)
  const { entranceProgress, showModal, hideModal } = useContext(FancyModalContext)

  const [showingUnderlyingModal, setShowingUnderlyingModal] = useState(visible)

  useEffect(() => {
    if (visible) {
      setShowingUnderlyingModal(true)
      requestAnimationFrame(() => {
        showModal()
      })
    } else {
      if (!firstMount.current) {
        hideModal().then(() => {
          setShowingUnderlyingModal(false)
        })
      }
    }
    firstMount.current = false
  }, [visible])

  const {
    height: screenHeight,
    safeAreaInsets: { top },
  } = useScreenDimensions()

  const actualMaxHeight = screenHeight - (top + 10)
  const sheetHeight = maxHeight ? Math.min(maxHeight, actualMaxHeight) : actualMaxHeight

  return (
    <Modal transparent animated={false} visible={showingUnderlyingModal}>
      {/* this view both darkens the backdrop and provides a touch target for dismissing the modal */}
      <TouchableWithoutFeedback style={{ flex: 1 }} onPress={onBackgroundPressed}>
        <Animated.View
          style={{
            flex: 1,
            backgroundColor: "#353A46",
            opacity: entranceProgress.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 0.2],
            }),
          }}
        ></Animated.View>
      </TouchableWithoutFeedback>
      {/* this view is the modal 'sheet'.
          it starts with it's top edge aligned with the bottom edge of the screen so you can't see it
          then it gets pushed upwards

          TODO: once we move the bottom tabs to react-native we can add a subtle 'scale up' for the entrance transition,
          which feels super cool and 3D. it should still slide down without scaling on exit though.
      */}
      <Animated.View
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: sheetHeight,
          borderTopLeftRadius: borderRadius,
          borderTopRightRadius: borderRadius,
          overflow: "hidden",
          backgroundColor: "white",
          justifyContent: "flex-start",
          transform: [
            {
              translateY: entranceProgress.interpolate({
                inputRange: [0, 1],
                outputRange: [sheetHeight, 0],
              }),
            },
          ],
        }}
      >
        {/* Keyboard Avoiding
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
         */}
        <KeyboardAvoidingView
          behavior="padding"
          style={{ flex: 1 }}
          keyboardVerticalOffset={screenHeight - sheetHeight}
        >
          {children}
        </KeyboardAvoidingView>
      </Animated.View>
    </Modal>
  )
}
