import BottomSheet, { BottomSheetView, useBottomSheetDynamicSnapPoints } from "@gorhom/bottom-sheet"
import { ArtworkListsBottomSheetBackdrop } from "app/Scenes/ArtworkLists/components/ArtworkListsBottomSheetBackdrop"
import {
  CreateNewListForm,
  CreateResult,
} from "app/Scenes/ArtworkLists/components/CreateNewListForm"
import { FC, useMemo, useRef } from "react"

type CreateNewListBottomSheetProps = {
  visible: boolean
  onClose: () => void
  onCreate: (result: CreateResult) => void
}

export const CreateNewListBottomSheet: FC<CreateNewListBottomSheetProps> = ({
  visible,
  onClose,
  onCreate,
}) => {
  const bottomSheetRef = useRef<BottomSheet>(null)
  const initialSnapPoints = useMemo(() => ["CONTENT_HEIGHT"], [])

  const { animatedHandleHeight, animatedSnapPoints, animatedContentHeight, handleContentLayout } =
    useBottomSheetDynamicSnapPoints(initialSnapPoints)

  const close = () => {
    bottomSheetRef.current?.close()
  }

  const handleCreate = (result: CreateResult) => {
    onCreate(result)
    close()
  }

  if (!visible) {
    return null
  }

  return (
    <BottomSheet
      ref={bottomSheetRef}
      snapPoints={animatedSnapPoints}
      handleHeight={animatedHandleHeight}
      contentHeight={animatedContentHeight}
      onClose={onClose}
      enablePanDownToClose
      backdropComponent={ArtworkListsBottomSheetBackdrop}
      keyboardBlurBehavior="restore"
    >
      <BottomSheetView onLayout={handleContentLayout}>
        <CreateNewListForm useBottomSheetInput onCreatePress={handleCreate} onBackPress={close} />
      </BottomSheetView>
    </BottomSheet>
  )
}
