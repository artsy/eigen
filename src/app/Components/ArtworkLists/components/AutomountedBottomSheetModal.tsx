import { BottomSheetModal, BottomSheetModalProps } from "@gorhom/bottom-sheet"
import { DefaultBottomSheetBackdrop } from "app/Components/BottomSheet/DefaultBottomSheetBackdrop"
import { FC, useEffect, useRef } from "react"

export interface AutomountedBottomSheetModalProps extends BottomSheetModalProps {
  visible: boolean
}

export const AutomountedBottomSheetModal: FC<AutomountedBottomSheetModalProps> = ({
  visible,
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

  return (
    <BottomSheetModal
      ref={ref}
      enablePanDownToClose
      keyboardBlurBehavior="restore"
      backdropComponent={DefaultBottomSheetBackdrop}
      {...rest}
    />
  )
}
