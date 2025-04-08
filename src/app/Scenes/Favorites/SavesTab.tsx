import { Flex } from "@artsy/palette-mobile"
import { ArtworkLists } from "app/Scenes/ArtworkLists/ArtworkLists"

export const SavesTab = () => {
  return (
    <Flex flex={1}>
      <ArtworkLists isTab={false} isFavorites={true} />
    </Flex>
  )
}
