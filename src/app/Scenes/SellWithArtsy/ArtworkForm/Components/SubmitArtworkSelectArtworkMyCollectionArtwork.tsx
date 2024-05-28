import { Flex, Text } from "@artsy/palette-mobile"
import { ArtworkAutosuggest } from "app/Scenes/MyCollection/Screens/ArtworkForm/Components/ArtworkAutosuggest"

export const SelectArtworkMyCollectionArtwork: React.FC = ({}) => {
  return (
    <Flex px={2}>
      <Text variant="lg" mb={2}>
        Select artwork from My Collection
      </Text>

      <ArtworkAutosuggest onResultPress={() => {}} onSkipPress={() => {}} />
    </Flex>
  )
}
