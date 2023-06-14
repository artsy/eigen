import { Button, Flex, Spacer, Text, useScreenDimensions } from "@artsy/palette-mobile"
import { FancyModalHeader } from "app/Components/FancyModal/FancyModalHeader"
import { MyCollectionAddCollectedArtistsAutosuggest } from "app/Scenes/MyCollection/Screens/MyCollectionAddCollectedArtists/MyCollectionAddCollectedArtistsAutosuggest"
import { MyCollectionAddCollectedArtistsStore } from "app/Scenes/MyCollection/Screens/MyCollectionAddCollectedArtists/MyCollectionAddCollectedArtistsStore"
import { pluralize } from "app/utils/pluralize"

export const MyCollectionAddCollectedArtists: React.FC<{}> = () => {
  const artistIds = MyCollectionAddCollectedArtistsStore.useStoreState((state) => state.artistIds)

  const handleSubmit = () => {
    // Save collected artists
    // Save personal artists
  }

  const { bottom } = useScreenDimensions().safeAreaInsets
  return (
    <Flex flex={1}>
      <FancyModalHeader hideBottomDivider>
        <Text textAlign="center">Add Artists You Collect</Text>
      </FancyModalHeader>
      <Flex flex={1} px={2}>
        <MyCollectionAddCollectedArtistsAutosuggest />
      </Flex>
      <Spacer y={4} />
      <Flex
        position="absolute"
        bottom={0}
        alignItems="center"
        alignSelf="center"
        p={2}
        right={0}
        left={0}
        backgroundColor="white100"
      >
        <Button block disabled={artistIds.length === 0} onPress={handleSubmit} mb={`${bottom}px`}>
          <Text color="white100">
            Add Selected {pluralize(`Artist`, artistIds.length)} • {artistIds.length}
          </Text>
        </Button>
      </Flex>
    </Flex>
  )
}

export const MyCollectionAddCollectedArtistsScreen = () => {
  return (
    <MyCollectionAddCollectedArtistsStore.Provider>
      <MyCollectionAddCollectedArtists />
    </MyCollectionAddCollectedArtistsStore.Provider>
  )
}
