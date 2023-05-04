import { Flex, Text } from "@artsy/palette-mobile"
import BottomSheet from "@gorhom/bottom-sheet"
import { useCallback, useMemo, useRef } from "react"

export const MyCollectionBottomSheetModalAdd: React.FC<{}> = () => {
  const bottomSheetRef = useRef<BottomSheet>(null)

  // variables
  const snapPoints = useMemo(() => ["25%", "50%"], [])

  // callbacks
  const handleSheetChanges = useCallback((index: number) => {
    console.log("handleSheetChanges", index)
  }, [])

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={1}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
    >
      <Flex>
        <Text>Add to My Collection</Text>
      </Flex>
    </BottomSheet>
  )
}
