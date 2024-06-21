import {
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetModalProps,
} from "@gorhom/bottom-sheet"
import { DefaultBottomSheetBackdrop } from "app/Components/BottomSheet/DefaultBottomSheetBackdrop"
import { FC, useCallback, useEffect, useRef } from "react"

export interface AutomountedBottomSheetModalProps extends BottomSheetModalProps {
  visible: boolean
  closeOnBackdropClick?: boolean
  testID?: string
}

export const AutomountedBottomSheetModal: FC<AutomountedBottomSheetModalProps> = ({
  visible,
  closeOnBackdropClick = true,
  ...rest
}) => {
  const ref = useRef<BottomSheetModal>(null)

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
