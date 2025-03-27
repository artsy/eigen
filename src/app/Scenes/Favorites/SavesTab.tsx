import { Flex } from "@artsy/palette-mobile"
import { ArtworkLists } from "app/Scenes/ArtworkLists/ArtworkLists"

export const SavesTab = () => {
  return (
    <Flex flex={1} mt={-2}>
      <ArtworkLists isTab={false} isFavorites={true} />
    </Flex>
  )
}
