import { useColor } from "@artsy/palette-mobile"
import BottomSheet, { BottomSheetProps } from "@gorhom/bottom-sheet"
import { DefaultBottomSheetBackdrop } from "app/Components/BottomSheet/DefaultBottomSheetBackdrop"
import { MyCollectionBottomSheetModalAdd } from "app/Scenes/MyCollection/Components/MyCollectionBottomSheetModals/MyCollectionBottomSheetModalAdd"
import { MyCollectionBottomSheetModalArtistPreviewQueryRenderer } from "app/Scenes/MyCollection/Components/MyCollectionBottomSheetModals/MyCollectionBottomSheetModalArtistPreview"
import { MyCollectionTabsStore } from "app/Scenes/MyCollection/State/MyCollectionTabsStore"
import { useCallback, useMemo, useRef } from "react"

export type MyCollectionBottomSheetModalKind = "Add" | "Artist" | null

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
        handleIndicatorStyle={{
          backgroundColor: color("mono100"),
          width: 40,
          height: 4,
          borderRadius: 2,
        }}
        backgroundStyle={{
          backgroundColor: color("mono0"),
        }}
      >
        {view === "Add" && <MyCollectionBottomSheetModalAdd />}
        {view === "Artist" && !!artistId && !!interestId ? (
          <MyCollectionBottomSheetModalArtistPreviewQueryRenderer
            artistID={artistId}
            interestId={interestId}
          />
        ) : null}
      </BottomSheet>
    </>
  )
}
