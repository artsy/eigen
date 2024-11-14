import { BottomSheetView } from "@gorhom/bottom-sheet"
import {
  AutomountedBottomSheetModal,
  AutomountedBottomSheetModalProps,
} from "app/Components/BottomSheet/AutomountedBottomSheetModal"

export type AutoHeightBottomSheetProps = Omit<AutomountedBottomSheetModalProps, "snapPoints">

export const AutoHeightBottomSheet: React.FC<AutoHeightBottomSheetProps> = ({
  children,
  ...rest
}) => {
  return (
    <AutomountedBottomSheetModal enableDynamicSizing {...rest}>
      <BottomSheetView>{children}</BottomSheetView>
    </AutomountedBottomSheetModal>
  )
}
