import { Button, Flex, Spacer, Text, useScreenDimensions } from "@artsy/palette-mobile"
import { FancyModalHeader } from "app/Components/FancyModal/FancyModalHeader"
import { MyCollectionAddCollectedArtistsAutosuggest } from "app/Scenes/MyCollection/Screens/MyCollectionAddCollectedArtists/MyCollectionAddCollectedArtistsAutosuggest"
import { MyCollectionAddCollectedArtistsStore } from "app/Scenes/MyCollection/Screens/MyCollectionAddCollectedArtists/MyCollectionAddCollectedArtistsStore"
import { useCreateUserInterests } from "app/Scenes/MyCollection/mutations/useCreateUserInterests"
import { dismissModal, popToRoot } from "app/system/navigation/navigate"
import { pluralize } from "app/utils/pluralize"
import { Suspense } from "react"
import { Alert } from "react-native"

export const MyCollectionAddCollectedArtists: React.FC<{}> = () => {
  const { bottom } = useScreenDimensions().safeAreaInsets
  const [createUserInterests] = useCreateUserInterests()

  const artistIds = MyCollectionAddCollectedArtistsStore.useStoreState((state) => state.artistIds)

  const handleSubmit = () => {
    // TODO: Save personal artists

    // Save collected artists as user interests

    const userInterests = artistIds.map((artistId) => {
      return {
        category: "COLLECTED_BEFORE",
        interestId: artistId,
        interestType: "ARTIST",
        private: true,
      }
    })

    createUserInterests({
      variables: {
        input: {
          userInterests,
        },
      },
      onCompleted: () => {
        dismissModal()
        popToRoot()
      },
      onError: (error) => {
        console.error("[MyCollectionAddCollectedArtists]: error creating user interests.", error)

        Alert.alert("Artists could not be added.")
      },
    })
  }

  return (
    <Flex flex={1}>
      <FancyModalHeader hideBottomDivider>
        <Text textAlign="center">Add Artists You Collect</Text>
      </FancyModalHeader>
      <Flex flex={1} px={2}>
        <Suspense fallback={() => null}>
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
