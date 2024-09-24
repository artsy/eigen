import {
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetModalProps,
} from "@gorhom/bottom-sheet"
import { DefaultBottomSheetBackdrop } from "app/Components/BottomSheet/DefaultBottomSheetBackdrop"
import { useBackHandler } from "app/utils/hooks/useBackHandler"
import { FC, useCallback, useEffect, useRef } from "react"

export interface AutomountedBottomSheetModalProps extends BottomSheetModalProps {
  visible: boolean
  closeOnBackdropClick?: boolean
}

export const AutomountedBottomSheetModal: FC<AutomountedBottomSheetModalProps> = ({
  visible,
  closeOnBackdropClick = true,
  ...rest
}) => {
  const ref = useRef<BottomSheetModal>(null)

  // dismiss modal on back button press on Android
  useBackHandler(() => {
    ref.current?.dismiss()
    return true
  })

  useEffect(() => {
    if (visible) {
      ref.current?.present()
    } else {
      ref.current?.dismiss()
    }
  }, [visible])

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
      keyboardBlurBehavior="restore"
      backdropComponent={renderBackdrop}
      {...rest}
    />
  )
}
