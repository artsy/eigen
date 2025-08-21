import { BottomSheetView } from "@gorhom/bottom-sheet"
import {
  AutomountedBottomSheetModal,
  AutomountedBottomSheetModalProps,
} from "app/Components/BottomSheet/AutomountedBottomSheetModal"
import { ReactNode } from "react"

export type AutoHeightBottomSheetProps = Omit<AutomountedBottomSheetModalProps, "snapPoints"> & {
  children?: ReactNode
}

export const AutoHeightBottomSheet: React.FC<AutoHeightBottomSheetProps> = ({
  children,
  ...rest
}) => {
  if (!rest.visible) return null

  return (
    <AutomountedBottomSheetModal enableDynamicSizing {...rest}>
      <BottomSheetView>{children}</BottomSheetView>
    </AutomountedBottomSheetModal>
  )
}
