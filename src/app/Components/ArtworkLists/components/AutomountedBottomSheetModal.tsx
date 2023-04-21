import { BottomSheetModal, BottomSheetModalProps } from "@gorhom/bottom-sheet"
import { ArtworkListsBottomSheetBackdrop } from "app/Components/ArtworkLists/components/ArtworkListsBottomSheetBackdrop"
import { FC, useEffect, useRef } from "react"

interface AutomountedBottomSheetModalProps extends BottomSheetModalProps {
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
      backdropComponent={ArtworkListsBottomSheetBackdrop}
      {...rest}
    />
  )
}
