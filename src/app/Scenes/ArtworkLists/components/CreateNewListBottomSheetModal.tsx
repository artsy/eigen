import {
  BottomSheetModal,
  BottomSheetView,
  useBottomSheetDynamicSnapPoints,
} from "@gorhom/bottom-sheet"
import { ArtworkListsBottomSheetBackdrop } from "app/Scenes/ArtworkLists/components/ArtworkListsBottomSheetBackdrop"
import {
  CreateNewListForm,
  CreateResult,
} from "app/Scenes/ArtworkLists/components/CreateNewListForm"
import { FC, useEffect, useMemo, useRef } from "react"

type CreateNewListBottomSheetModalProps = {
  visible: boolean
  onClose: () => void
  onCreate: (result: CreateResult) => void
}

export const CreateNewListBottomSheetModal: FC<CreateNewListBottomSheetModalProps> = ({
  visible,
  onClose,
  onCreate,
}) => {
  const bottomSheetRef = useRef<BottomSheetModal>(null)
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

  useEffect(() => {
    if (visible) {
      bottomSheetRef.current?.present()
    }
  }, [visible])

  return (
    <BottomSheetModal
      ref={bottomSheetRef}
      snapPoints={animatedSnapPoints}
      handleHeight={animatedHandleHeight}
      contentHeight={animatedContentHeight}
      onDismiss={onClose}
      backdropComponent={ArtworkListsBottomSheetBackdrop}
      keyboardBlurBehavior="restore"
    >
      <BottomSheetView onLayout={handleContentLayout}>
        <CreateNewListForm useBottomSheetInput onCreatePress={handleCreate} onBackPress={close} />
      </BottomSheetView>
    </BottomSheetModal>
  )
}
