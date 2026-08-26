import { useColor, useScreenDimensions } from "@artsy/palette-mobile"
import {
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetModalProps,
} from "@gorhom/bottom-sheet"
import { DefaultBottomSheetBackdrop } from "app/Components/BottomSheet/DefaultBottomSheetBackdrop"
import { defaultIndicatorHandleStyle } from "app/Components/BottomSheet/defaultIndicatorHandleStyle"
import { useSentryBottomSheetTag } from "app/system/errorReporting/useSentryBottomSheetTag"
import { FC, useCallback, useEffect, useRef, useState } from "react"
import { BackHandler } from "react-native"

export interface AutomountedBottomSheetModalProps extends BottomSheetModalProps {
  visible: boolean
  closeOnBackdropClick?: boolean
  /**
   * Name reported to Sentry as the `bottom_sheet` tag while this sheet is open, so crashes
   * inside it can be attributed to a specific sheet rather than just a route.
   */
  sentryName?: string
}

export const AutomountedBottomSheetModal: FC<AutomountedBottomSheetModalProps> = ({
  visible,
  closeOnBackdropClick = true,
  sentryName,
  ...rest
}) => {
  const color = useColor()
  const ref = useRef<BottomSheetModal>(null)
  const [modalIsPresented, setModalIsPresented] = useState(false)
  const { height: screenHeight, safeAreaInsets } = useScreenDimensions()

  // gorhom's own `name` prop is a good enough identifier when a caller already passes one.
  useSentryBottomSheetTag(sentryName ?? rest.name, visible)

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
