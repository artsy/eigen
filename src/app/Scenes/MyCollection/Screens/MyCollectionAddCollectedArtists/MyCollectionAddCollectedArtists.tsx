import { Button, Flex, Spacer, Text } from "@artsy/palette-mobile"
import { FancyModalHeader } from "app/Components/FancyModal/FancyModalHeader"
import { LoadingSpinner } from "app/Components/Modals/LoadingModal"
import { MyCollectionAddCollectedArtistsAutosuggest } from "app/Scenes/MyCollection/Screens/MyCollectionAddCollectedArtists/MyCollectionAddCollectedArtistsAutosuggest"
import { MyCollectionAddCollectedArtistsStore } from "app/Scenes/MyCollection/Screens/MyCollectionAddCollectedArtists/MyCollectionAddCollectedArtistsStore"
import { pluralize } from "app/utils/pluralize"
import { Suspense } from "react"

export const MyCollectionAddCollectedArtists: React.FC<{}> = () => {
  const artistIds = MyCollectionAddCollectedArtistsStore.useStoreState((state) => state.artistIds)

  return (
    <Flex flex={1}>
      <FancyModalHeader hideBottomDivider>
        <Text textAlign="center">Add Artists You Collect</Text>
      </FancyModalHeader>
      <Flex flex={1} px={2}>
        <Suspense fallback={<LoadingSpinner />}>
          <MyCollectionAddCollectedArtistsAutosuggest />
        </Suspense>
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
        <Button block disabled={artistIds.size === 0}>
          <Text color="white100">
            Add Selected {pluralize(`Artist`, artistIds.size)} • {artistIds.size}
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
