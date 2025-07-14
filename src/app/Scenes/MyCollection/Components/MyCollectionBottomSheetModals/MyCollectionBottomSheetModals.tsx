import { useColor } from "@artsy/palette-mobile"
import BottomSheet, { BottomSheetProps } from "@gorhom/bottom-sheet"
import { DefaultBottomSheetBackdrop } from "app/Components/BottomSheet/DefaultBottomSheetBackdrop"
import { defaultIndicatorHandleStyle } from "app/Components/BottomSheet/defaultIndicatorHandleStyle"
import { MyCollectionBottomSheetModalAdd } from "app/Scenes/MyCollection/Components/MyCollectionBottomSheetModals/MyCollectionBottomSheetModalAdd"
import { MyCollectionBottomSheetModal } from "app/Scenes/MyCollection/Components/MyCollectionBottomSheetModals/MyCollectionBottomSheetModalArtistPreview"
import { MyCollectionBottomSheetModalProfile } from "app/Scenes/MyCollection/Components/MyCollectionBottomSheetModals/MyCollectionBottomSheetModalProfile"
import { MyCollectionTabsStore } from "app/Scenes/MyCollection/State/MyCollectionTabsStore"
import { useCallback, useMemo, useRef } from "react"

export type MyCollectionBottomSheetModalKind = "Add" | "Artist" | "Profile" | null

export const MyCollectionBottomSheetModals: React.FC<{}> = () => {
  const color = useColor()
  const bottomSheetRef = useRef<BottomSheet>(null)

  const setViewKind = MyCollectionTabsStore.useStoreActions((actions) => actions.setViewKind)
  const view = MyCollectionTabsStore.useStoreState((state) => state.viewKind)
  const artistId = MyCollectionTabsStore.useStoreState((state) => state.artistId)
  const interestId = MyCollectionTabsStore.useStoreState((state) => state.interestId)

  const snapPoints = useMemo(() => [view === "Artist" ? 410 : 370], [])

  const handleSheetChanges = useCallback((index: number) => {
    if (index === -1) {
      setViewKind({ viewKind: null })
    }
  }, [])

  const hideBottomSheet = () => {
    if (view) {
      bottomSheetRef.current?.close()
      setViewKind({ viewKind: null })
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
        handleIndicatorStyle={defaultIndicatorHandleStyle(color)}
        backgroundStyle={{
          backgroundColor: color("mono0"),
        }}
      >
        {view === "Add" && <MyCollectionBottomSheetModalAdd />}
        {view === "Profile" && (
          <MyCollectionBottomSheetModalProfile isVisible={view === "Profile"} />
        )}
        {view === "Artist" && !!artistId && !!interestId ? (
          <MyCollectionBottomSheetModal
            visible={view === "Artist" && !!artistId && !!interestId}
            artistID={artistId}
            interestId={interestId}
            onDismiss={() => {
              setViewKind({ viewKind: null })
            }}
          />
        ) : null}
      </BottomSheet>
    </>
  )
}
