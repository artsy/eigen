import { Box, Button, useSpace } from "@artsy/palette-mobile"
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet"
import { ArtworkListsBottomSheetBackdrop } from "app/Scenes/ArtworkLists/components/ArtworkListsBottomSheetBackdrop"
import { CreateNewListBottomSheet } from "app/Scenes/ArtworkLists/components/CreateNewListBottomSheet"
import {
  RecentlyCreatedArtworkList,
  RecentlyCreatedArtworkListEntity,
} from "app/Scenes/ArtworkLists/components/RecentlyCreatedArtworkList"
import { ArtworkListsContent } from "app/Scenes/ArtworkLists/components/ScrollableArtworkLists"
import { FC, useCallback, useMemo, useRef, useState } from "react"

type ArtworkListBottomSheetProps = {
  visible: boolean
  onClose: () => void
}

export const ArtworkListBottomSheet: FC<ArtworkListBottomSheetProps> = ({ visible, onClose }) => {
  const bottomSheetRef = useRef<BottomSheet>(null)
  const snapPoints = useMemo(() => ["50%", "100%"], [])
  const space = useSpace()
  const [visibleCreateList, setVisibleCreateList] = useState(false)
  const [recentlyCreatedArtworkList, setRecentlyCreatedArtworkList] =
    useState<RecentlyCreatedArtworkListEntity | null>(null)

  // callbacks
  const handleSheetChanges = useCallback((index: number) => {
    console.log("handleSheetChanges", index)
  }, [])

  const openCreateListBottomSheet = () => {
    setVisibleCreateList(true)
  }

  const closeCreateListBottomSheet = useCallback(() => {
    setVisibleCreateList(false)
  }, [])

  const contentContainerStyles = useMemo(
    () => ({ paddingHorizontal: space(2), paddingBottom: space(2) }),
    [space]
  )

  if (!visible) {
    return null
  }

  // renders
  return (
    <>
      <BottomSheet
        ref={bottomSheetRef}
        index={0}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        onClose={onClose}
        enablePanDownToClose
        backdropComponent={ArtworkListsBottomSheetBackdrop}
      >
        {!!recentlyCreatedArtworkList && (
          <RecentlyCreatedArtworkList artworkList={recentlyCreatedArtworkList} />
        )}

        <Box m={2}>
          <Button block width="100%" onPress={openCreateListBottomSheet}>
            Create New List
          </Button>
        </Box>

        <BottomSheetScrollView contentContainerStyle={contentContainerStyles}>
          <ArtworkListsContent />
        </BottomSheetScrollView>
      </BottomSheet>

      {visibleCreateList && (
        <CreateNewListBottomSheet
          visible={visibleCreateList}
          onCreate={setRecentlyCreatedArtworkList}
          onClose={closeCreateListBottomSheet}
        />
      )}
    </>
  )
}
