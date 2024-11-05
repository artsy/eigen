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
    // TODO: make snapPoints work with new implementation
    <AutomountedBottomSheetModal snapPoints={["CONTENT_HEIGHT"]} enableDynamicSizing {...rest}>
      <BottomSheetView>{children}</BottomSheetView>
    </AutomountedBottomSheetModal>
  )
}
