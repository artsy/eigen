import BottomSheet from "@gorhom/bottom-sheet"
import { Portal } from "@gorhom/portal"
import { ArtworkListsNavigation } from "app/Scenes/ArtworkLists/ArtworkListsNavigation"
import { ArtworkListsBottomSheetBackdrop } from "app/Scenes/ArtworkLists/components/ArtworkListsBottomSheetBackdrop"
import { FC, useCallback, useMemo, useRef } from "react"

type ArtworkListBottomSheetNavigationProps = {
  visible: boolean
  onClose: () => void
}

export const ArtworkListBottomSheetNavigation: FC<ArtworkListBottomSheetNavigationProps> = ({
  visible,
  onClose,
}) => {
  const bottomSheetRef = useRef<BottomSheet>(null)
  const snapPoints = useMemo(() => ["50%", "95%"], [])

  const handleBottomSheetClose = useCallback(() => {
    bottomSheetRef.current?.close()
  }, [])

  if (!visible) {
    return null
  }

  // renders
  return (
    <Portal>
      <BottomSheet
        ref={bottomSheetRef}
        index={0}
        snapPoints={snapPoints}
        onClose={onClose}
        enablePanDownToClose
        backdropComponent={ArtworkListsBottomSheetBackdrop}
      >
        <ArtworkListsNavigation onClose={handleBottomSheetClose} />
      </BottomSheet>
    </Portal>
  )
}
