import { Flex } from "@artsy/palette-mobile"
import { ArtworkLists } from "app/Scenes/ArtworkLists/ArtworkLists"

export const SavesTab = () => {
  return (
    <Flex mt={-2}>
      <ArtworkLists isTab={false} isFavorites={true} />
    </Flex>
  )
}
