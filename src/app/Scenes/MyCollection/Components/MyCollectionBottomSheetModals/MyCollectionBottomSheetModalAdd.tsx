import { ArtworkIcon, Flex, Separator, Text, UserMultiIcon } from "@artsy/palette-mobile"
import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from "@gorhom/bottom-sheet"
import { MenuItem } from "app/Components/MenuItem"
import { useCallback, useMemo, useRef } from "react"

export const MyCollectionBottomSheetModalAdd: React.FC<{}> = () => {
  const bottomSheetRef = useRef<BottomSheet>(null)

  // variables
  const snapPoints = useMemo(() => ["25%", "50%"], [])

  // callbacks
  const handleSheetChanges = useCallback((index: number) => {
    console.log("handleSheetChanges", index)
  }, [])

  const renderBackDropCompoent = useCallback(
    (props) => (
      <BottomSheetBackdrop
        pressBehavior="close"
        style={{ backgroundColor: "black" }}
        {...props}
        opacity={0.4}
      />
    ),
    []
  )
  return (
    <>
      <BottomSheet
        ref={bottomSheetRef}
        index={0}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        enablePanDownToClose
        backdropComponent={renderBackDropCompoent}
      >
        <BottomSheetView>
          <Flex>
            <Text textAlign="center" variant="sm" fontWeight="500" pt={2} pb={4}>
              Add to My Collection
            </Text>
            <Separator />
          </Flex>
          <Flex>
            <MenuItem
              title="Add Artists"
              description="List the artists in your collection."
              onPress={() => {
                console.log("Add Artists")
              }}
              icon={<UserMultiIcon height={24} width={24} />}
              py="40px"
            />
            <Separator />
            <MenuItem
              title="Add Artworks"
              description="Upload images and details of an artwork in your collection."
              onPress={() => {
                console.log("Add Artworks")
              }}
              icon={<ArtworkIcon height={24} width={24} />}
              py="40px"
            />
          </Flex>
        </BottomSheetView>
      </BottomSheet>
    </>
  )
}
