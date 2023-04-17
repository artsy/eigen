import BottomSheet from "@gorhom/bottom-sheet"
import { ArtworkListsBottomSheetBackdrop } from "app/Scenes/ArtworkLists/components/ArtworkListsBottomSheetBackdrop"
import {
  CreateNewListForm,
  CreateResult,
} from "app/Scenes/ArtworkLists/components/CreateNewListForm"
import { FC, useRef } from "react"

const SNAP_POINTS = ["50%"]

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
      index={0}
      snapPoints={SNAP_POINTS}
      onClose={onClose}
      enablePanDownToClose
      backdropComponent={ArtworkListsBottomSheetBackdrop}
    >
      <CreateNewListForm onCreatePress={handleCreate} onBackPress={close} />
    </BottomSheet>
  )
}
