import { useScreenDimensions } from "lib/utils/useScreenDimensions"
import React, { useContext, useEffect, useMemo, useRef, useState } from "react"
import { Animated, Modal, TouchableWithoutFeedback, View } from "react-native"

const blackGutterWidth = 10
const borderRadius = 10

const FancyModalContext = React.createContext<{
  readonly entranceProgress: Animated.Value
  showModal(): void
  hideModal(): Promise<void>
}>(null as any)

export const _FancyModalPageWrapper: React.FC = ({ children }) => {
  const entranceProgress = useMemo(() => {
    return new Animated.Value(0)
  }, [])

  const {
    safeAreaInsets: { top },
  } = useScreenDimensions()

  const [roundedDaddyDimensions, setRoundedDaddyDimensions] = useState({ width: 1, height: 1 })

  const roundedDaddyShrinkageMultiplier =
    (roundedDaddyDimensions.width - 2 * borderRadius - blackGutterWidth * 2) / roundedDaddyDimensions.width

  const showModal = () => {
    requestAnimationFrame(() => {
      Animated.spring(entranceProgress, {
        toValue: 1,
        useNativeDriver: true,
        bounciness: -7,
        speed: 9,
      }).start()
    })
  }

  const hideModal = async () => {
    await new Promise(r => requestAnimationFrame(r))
    await new Promise(r => {
      Animated.timing(entranceProgress, {
        toValue: 0,
        useNativeDriver: true,
        duration: 340,
      }).start(r)
    })
  }

  return (
    <View style={{ backgroundColor: "black", flex: 1 }}>
      <Animated.View
        testID="rounded daddy"
        onLayout={(e: any) => {
          setRoundedDaddyDimensions({
            width: e.nativeEvent.layout.width,
            height: e.nativeEvent.layout.height,
          })
        }}
        style={{
          position: "absolute",
          padding: borderRadius,
          left: -borderRadius,
          top: -borderRadius,
          right: -borderRadius,
          bottom: -borderRadius,
          overflow: "hidden",
          borderRadius,
          transform: [
            {
              scale: entranceProgress.interpolate({
                inputRange: [0, 1],
                outputRange: [1, roundedDaddyShrinkageMultiplier],
              }),
            },
            {
              translateY: entranceProgress.interpolate({
                inputRange: [0, 1],
                outputRange: [
                  0,
                  top +
                    10 -
                    (roundedDaddyDimensions.height - roundedDaddyDimensions.height * roundedDaddyShrinkageMultiplier) /
                      2,
                ],
              }),
            },
          ],
        }}
      >
        <Animated.View
          style={{
            flex: 1,
            backgroundColor: "white",
            transform: [
              {
                scale: entranceProgress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 0.95 / roundedDaddyShrinkageMultiplier],
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

export const FancyModal: React.FC<{ visible: boolean; onBackgroundPressed(): void }> = ({
  visible,
  children,
  onBackgroundPressed,
}) => {
  const firstMount = useRef(true)
  const { entranceProgress, showModal, hideModal } = useContext(FancyModalContext)

  const [showingUnderlyingModal, setShowingUnderlyingModal] = useState(visible)

  useEffect(() => {
    if (visible) {
      setShowingUnderlyingModal(true)
      showModal()
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
    height,
    safeAreaInsets: { top },
  } = useScreenDimensions()

  const [sheetHeight, setSheetHeight] = useState(0)

  return (
    <Modal transparent animated={false} visible={showingUnderlyingModal}>
      <TouchableWithoutFeedback style={{ flex: 1 }} onPress={onBackgroundPressed}>
        <Animated.View
          style={{
            flex: 1,
            backgroundColor: "black",
            opacity: entranceProgress.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 0.3],
            }),
          }}
        ></Animated.View>
      </TouchableWithoutFeedback>
      <Animated.View
        onLayout={(e: any) => setSheetHeight(e.nativeEvent.layout.height)}
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          borderRadius,
          overflow: "hidden",
          backgroundColor: "white",
          maxHeight: height - top - 20,
          minHeight: 250,
          transform: [
            {
              translateY: entranceProgress.interpolate({
                inputRange: [0, 1],
                outputRange: [height, height - sheetHeight],
              }),
            },
          ],
        }}
      >
        {children}
      </Animated.View>
    </Modal>
  )
}
