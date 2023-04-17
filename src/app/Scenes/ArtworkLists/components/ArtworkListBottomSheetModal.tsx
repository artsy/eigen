import { Box, Button, useSpace } from "@artsy/palette-mobile"
import { BottomSheetScrollView, BottomSheetModal } from "@gorhom/bottom-sheet"
import { ArtworkListsBottomSheetBackdrop } from "app/Scenes/ArtworkLists/components/ArtworkListsBottomSheetBackdrop"
import { CreateNewListBottomSheetModal } from "app/Scenes/ArtworkLists/components/CreateNewListBottomSheetModal"
import {
  RecentlyCreatedArtworkList,
  RecentlyCreatedArtworkListEntity,
} from "app/Scenes/ArtworkLists/components/RecentlyCreatedArtworkList"
import { ArtworkListsContent } from "app/Scenes/ArtworkLists/components/ScrollableArtworkLists"
import { FC, useCallback, useEffect, useMemo, useRef, useState } from "react"

type ArtworkListBottomSheetModalProps = {
  visible: boolean
  onClose: () => void
}

export const ArtworkListBottomSheetModal: FC<ArtworkListBottomSheetModalProps> = ({
  visible,
  onClose,
}) => {
  const bottomSheetRef = useRef<BottomSheetModal>(null)
  const snapPoints = useMemo(() => ["50%", "95%"], [])
  const space = useSpace()
  const [visibleCreateList, setVisibleCreateList] = useState(false)
  const [recentlyCreatedArtworkList, setRecentlyCreatedArtworkList] =
    useState<RecentlyCreatedArtworkListEntity | null>(null)

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

  useEffect(() => {
    if (visible) {
      bottomSheetRef.current?.present()
    }
  }, [visible])

  // renders
  return (
    <>
      <BottomSheetModal
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        onDismiss={onClose}
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
      </BottomSheetModal>

      {visibleCreateList && (
        <CreateNewListBottomSheetModal
          visible={visibleCreateList}
          onCreate={setRecentlyCreatedArtworkList}
          onClose={closeCreateListBottomSheet}
        />
      )}
    </>
  )
}
