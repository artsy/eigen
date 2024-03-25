import { BottomSheetView, useBottomSheetDynamicSnapPoints } from "@gorhom/bottom-sheet"
import {
  AutomountedBottomSheetModal,
  AutomountedBottomSheetModalProps,
} from "app/Components/BottomSheet/AutomountedBottomSheetModal"
import { FC, useMemo } from "react"

export type AutoHeightBottomSheetProps = Omit<AutomountedBottomSheetModalProps, "snapPoints">

export const AutoHeightBottomSheet: FC<AutoHeightBottomSheetProps> = ({ children, ...rest }) => {
  const initialSnapPoints = useMemo(() => ["CONTENT_HEIGHT"], [])
  const { animatedHandleHeight, animatedSnapPoints, animatedContentHeight, handleContentLayout } =
    useBottomSheetDynamicSnapPoints(initialSnapPoints)

  return (
    <AutomountedBottomSheetModal
      snapPoints={animatedSnapPoints}
      handleHeight={animatedHandleHeight}
      contentHeight={animatedContentHeight}
      {...rest}
    >
      <BottomSheetView onLayout={handleContentLayout}>{children}</BottomSheetView>
    </AutomountedBottomSheetModal>
  )
}
