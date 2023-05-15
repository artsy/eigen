import { Flex, Text } from "@artsy/palette-mobile"
import { BottomSheetView } from "@gorhom/bottom-sheet"

export const MyCollectionBottomSheetModalArtist: React.FC<{ artistId: string }> = ({
  artistId,
}) => {
  return (
    <BottomSheetView>
      <Flex>
        <Text textAlign="center" variant="sm" fontWeight="500" pt={2} pb={4}>
          Artist id: {artistId}
        </Text>
      </Flex>
    </BottomSheetView>
  )
}
