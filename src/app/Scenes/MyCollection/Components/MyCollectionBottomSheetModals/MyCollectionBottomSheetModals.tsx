import { MyCollectionBottomSheetModalAdd } from "app/Scenes/MyCollection/Components/MyCollectionBottomSheetModals/MyCollectionBottomSheetModalAdd"

export type MyCollectionBottomSheetModalView = "Add"

export const MyCollectionBottomSheetModals: React.FC<{
  view: MyCollectionBottomSheetModalView
}> = ({ view }) => {
  if (view === "Add") return <MyCollectionBottomSheetModalAdd />
  return null
}
