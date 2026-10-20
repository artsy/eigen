import { useColor, useScreenDimensions } from "@artsy/palette-mobile"
import {
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetModalProps,
} from "@gorhom/bottom-sheet"
import { DefaultBottomSheetBackdrop } from "app/Components/BottomSheet/DefaultBottomSheetBackdrop"
import { defaultIndicatorHandleStyle } from "app/Components/BottomSheet/defaultIndicatorHandleStyle"
import { usePresentedOverlay } from "app/Components/ProgressiveOnboarding/popoverPresentationContext"
import { useSentryBottomSheetTag } from "app/system/errorReporting/useSentryBottomSheetTag"
import { FC, useCallback, useEffect, useId, useRef, useState } from "react"
import { BackHandler } from "react-native"

export interface AutomountedBottomSheetModalProps extends BottomSheetModalProps {
  /**
   * Should go back to `false` when the sheet is dismissed by pan-down, backdrop tap or the
   * Android back button (set it in `onDismiss`).
   */
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
  const overlayName = sentryName ?? rest.name
  useSentryBottomSheetTag(overlayName, visible)

  // Onboarding popovers are full-screen native Modals; without this they would happily
  // present on top of an open sheet. The id must be unique per instance, not per name:
  // two sheets can share a name, and a shared id means closing one deregisters the others.
  // Unregistered on dismiss too, so a caller that never resets `visible` can't keep every
  // popover suppressed.
  const overlayId = `BottomSheet-${overlayName ?? "anonymous"}-${useId()}`
  const [wasDismissed, setWasDismissed] = useState(false)
  usePresentedOverlay(overlayId, visible && !wasDismissed)

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
    setWasDismissed(true)
    rest.onDismiss?.()
  }

  useEffect(() => {
    if (visible) {
      setWasDismissed(false)
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
      onDismiss={handleDismiss}
    />
  )
}
