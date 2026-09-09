import { MyCollectionBottomSheetModalAdd } from "app/Scenes/MyCollection/Components/MyCollectionBottomSheetModals/MyCollectionBottomSheetModalAdd"
import { MyCollectionBottomSheetModal } from "app/Scenes/MyCollection/Components/MyCollectionBottomSheetModals/MyCollectionBottomSheetModalArtistPreview"
import { MyCollectionBottomSheetModalProfile } from "app/Scenes/MyCollection/Components/MyCollectionBottomSheetModals/MyCollectionBottomSheetModalProfile"
import { MyCollectionTabsStore } from "app/Scenes/MyCollection/State/MyCollectionTabsStore"

export type MyCollectionBottomSheetModalKind = "Add" | "Artist" | "Profile" | null

export const MyCollectionBottomSheetModals: React.FC<{}> = () => {
  const setViewKind = MyCollectionTabsStore.useStoreActions((actions) => actions.setViewKind)
  const view = MyCollectionTabsStore.useStoreState((state) => state.viewKind)
  const artistId = MyCollectionTabsStore.useStoreState((state) => state.artistId)
  const interestId = MyCollectionTabsStore.useStoreState((state) => state.interestId)

  return (
    <>
      {view === "Add" && <MyCollectionBottomSheetModalAdd isVisible={view === "Add"} />}
      {view === "Profile" && <MyCollectionBottomSheetModalProfile isVisible={view === "Profile"} />}
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
    </>
  )
}
