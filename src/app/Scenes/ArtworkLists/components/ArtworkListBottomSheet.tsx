import { useSpace } from "@artsy/palette-mobile"
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet"
import { ArtworkListsBottomSheetBackdrop } from "app/Scenes/ArtworkLists/components/ArtworkListsBottomSheetBackdrop"
import { ArtworkListsContent } from "app/Scenes/ArtworkLists/components/ScrollableArtworkLists"
import { FC, useCallback, useMemo, useRef } from "react"

type ArtworkListBottomSheetProps = {
  visible: boolean
  onClose: () => void
}

export const ArtworkListBottomSheet: FC<ArtworkListBottomSheetProps> = ({ visible, onClose }) => {
  const bottomSheetRef = useRef<BottomSheet>(null)
  const snapPoints = useMemo(() => ["50%", "100%"], [])
  const space = useSpace()

  // callbacks
  const handleSheetChanges = useCallback((index: number) => {
    console.log("handleSheetChanges", index)
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
    <BottomSheet
      ref={bottomSheetRef}
      index={0}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
      onClose={onClose}
      enablePanDownToClose
      backdropComponent={ArtworkListsBottomSheetBackdrop}
    >
      <BottomSheetScrollView contentContainerStyle={contentContainerStyles}>
        <ArtworkListsContent />
      </BottomSheetScrollView>
    </BottomSheet>
  )
}
