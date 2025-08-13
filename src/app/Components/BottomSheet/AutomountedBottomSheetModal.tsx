import { useColor, useScreenDimensions } from "@artsy/palette-mobile"
import {
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetModalProps,
} from "@gorhom/bottom-sheet"
import { DefaultBottomSheetBackdrop } from "app/Components/BottomSheet/DefaultBottomSheetBackdrop"
import { defaultIndicatorHandleStyle } from "app/Components/BottomSheet/defaultIndicatorHandleStyle"
import { FC, useCallback, useEffect, useRef, useState } from "react"
import { BackHandler } from "react-native"

export interface AutomountedBottomSheetModalProps extends BottomSheetModalProps {
  visible: boolean
  closeOnBackdropClick?: boolean
}

export const AutomountedBottomSheetModal: FC<AutomountedBottomSheetModalProps> = ({
  visible,
  closeOnBackdropClick = true,
  ...rest
}) => {
  const color = useColor()
  const ref = useRef<BottomSheetModal>(null)
  const [modalIsPresented, setModalIsPresented] = useState(false)
  const { height: screenHeight, safeAreaInsets } = useScreenDimensions()

  // dismiss modal on back button press on Android
  const androidBackHandler = useCallback(() => {
    if (ref.current && modalIsPresented && visible) {
      ref.current.dismiss()
      return true
    } else {
      // modal is not presented, let the default back button behavior happen
      return false
    }
  }, [modalIsPresented, visible])

  const handlePresent = () => {
    setModalIsPresented(true)
  }

  const handleDismiss = () => {
    setModalIsPresented(false)
  }

  useEffect(() => {
    if (visible) {
      ref.current?.present()
    } else {
      ref.current?.dismiss()
    }
  }, [visible])

  useEffect(() => {
    const subscription = BackHandler.addEventListener("hardwareBackPress", androidBackHandler)

    return () => subscription.remove()
  }, [androidBackHandler])

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => {
      if (closeOnBackdropClick) {
        return (
          <DefaultBottomSheetBackdrop
            {...props}
            pressBehavior="close"
            onClose={() => {
              ref.current?.dismiss()
            }}
          />
        )
      }

      return <DefaultBottomSheetBackdrop {...props} />
    },
    [closeOnBackdropClick]
  )

  return (
    <BottomSheetModal
      ref={ref}
      enablePanDownToClose
      onDismiss={handleDismiss}
      onAnimate={handlePresent}
      keyboardBlurBehavior="restore"
      backdropComponent={renderBackdrop}
      enableDynamicSizing
      maxDynamicContentSize={screenHeight - safeAreaInsets.top}
      backgroundStyle={{
        ...(rest?.backgroundStyle as any),
        backgroundColor: color("background"),
      }}
      handleIndicatorStyle={defaultIndicatorHandleStyle(color)}
      {...rest}
    />
  )
}
