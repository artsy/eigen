import { BottomSheetModal } from "@gorhom/bottom-sheet"
import { ArtworkListsNavigation } from "app/Scenes/ArtworkLists/ArtworkListsNavigation"
import { ArtworkListsBottomSheetBackdrop } from "app/Scenes/ArtworkLists/components/ArtworkListsBottomSheetBackdrop"
import { FC, useCallback, useEffect, useMemo, useRef } from "react"

type ArtworkListBottomSheetModalNavigationProps = {
  visible: boolean
  onClose: () => void
}

export const ArtworkListBottomSheetModalNavigation: FC<
  ArtworkListBottomSheetModalNavigationProps
> = ({ visible, onClose }) => {
  const bottomSheetRef = useRef<BottomSheetModal>(null)
  const snapPoints = useMemo(() => ["50%", "95%"], [])

  const handleBottomSheetClose = useCallback(() => {
    bottomSheetRef.current?.close()
  }, [])

  useEffect(() => {
    if (visible) {
      bottomSheetRef.current?.present()
    }
  }, [visible])

  // renders
  return (
    <BottomSheetModal
      ref={bottomSheetRef}
      snapPoints={snapPoints}
      onDismiss={onClose}
      enablePanDownToClose
      backdropComponent={ArtworkListsBottomSheetBackdrop}
    >
      <ArtworkListsNavigation useBottomSheetInput onClose={handleBottomSheetClose} />
    </BottomSheetModal>
  )
}
