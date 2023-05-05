import BottomSheet, { BottomSheetProps } from "@gorhom/bottom-sheet"
import { DefaultBottomSheetBackdrop } from "app/Components/BottomSheet/DefaultBottomSheetBackdrop"
import { MyCollectionBottomSheetModalAdd } from "app/Scenes/MyCollection/Components/MyCollectionBottomSheetModals/MyCollectionBottomSheetModalAdd"
import { MyCollectionTabsStore } from "app/Scenes/MyCollection/State/MyCollectionTabsStore"
import { useCallback, useMemo, useRef } from "react"

export type MyCollectionBottomSheetModalView = "Add" | null

export const MyCollectionBottomSheetModals: React.FC<{}> = () => {
  const bottomSheetRef = useRef<BottomSheet>(null)

  const setView = MyCollectionTabsStore.useStoreActions((actions) => actions.setView)
  const view = MyCollectionTabsStore.useStoreState((state) => state.view)

  const snapPoints = useMemo(() => ["50%"], [])

  const handleSheetChanges = useCallback((index: number) => {
    if (index === -1) {
      setView(null)
    }
  }, [])

  const hideBottomSheet = () => {
    if (view) {
      bottomSheetRef.current?.close()
      setView(null)
    }
  }

  const renderBackdrop: BottomSheetProps["backdropComponent"] = (props) => {
    return <DefaultBottomSheetBackdrop pressBehavior="close" onClose={hideBottomSheet} {...props} />
  }

  return (
    <>
      <BottomSheet
        ref={bottomSheetRef}
        index={0}
        onChange={handleSheetChanges}
        snapPoints={snapPoints}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        handleIndicatorStyle={{ backgroundColor: "black", width: 40, height: 4, borderRadius: 2 }}
      >
        {view === "Add" && <MyCollectionBottomSheetModalAdd />}
      </BottomSheet>
    </>
  )
}
