import { ArtworkIcon, Flex, Separator, Text, UserMultiIcon } from "@artsy/palette-mobile"
import { BottomSheetView } from "@gorhom/bottom-sheet"

import { MenuItem } from "app/Components/MenuItem"

export const MyCollectionBottomSheetModalAdd: React.FC<{}> = () => {
  return (
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
  )
}
