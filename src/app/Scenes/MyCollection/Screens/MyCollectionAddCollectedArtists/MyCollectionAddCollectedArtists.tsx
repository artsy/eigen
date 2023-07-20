import { Button, Flex, Spacer, Spinner, Text, useScreenDimensions } from "@artsy/palette-mobile"
import {
  UserInterestCategory,
  UserInterestInterestType,
} from "__generated__/useCreateUserInterestsMutation.graphql"
import { FancyModalHeader } from "app/Components/FancyModal/FancyModalHeader"
import { MyCollectionAddCollectedArtistsAutosuggest } from "app/Scenes/MyCollection/Screens/MyCollectionAddCollectedArtists/MyCollectionAddCollectedArtistsAutosuggest"
import { MyCollectionAddCollectedArtistsStore } from "app/Scenes/MyCollection/Screens/MyCollectionAddCollectedArtists/MyCollectionAddCollectedArtistsStore"
import { createArtist } from "app/Scenes/MyCollection/mutations/createArtist"
import { createUserInterests } from "app/Scenes/MyCollection/mutations/createUserInterests"
import { dismissModal, popToRoot } from "app/system/navigation/navigate"
import { pluralize } from "app/utils/pluralize"
import { Suspense, useState } from "react"
import { Alert } from "react-native"

export const MyCollectionAddCollectedArtists: React.FC<{}> = () => {
  const { bottom } = useScreenDimensions().safeAreaInsets
  const [isLoading, setIsLoading] = useState(false)

  const artistIds = MyCollectionAddCollectedArtistsStore.useStoreState((state) => state.artistIds)
  const customArtists = MyCollectionAddCollectedArtistsStore.useStoreState(
    (state) => state.customArtists
  )

  const addUserInterests = async () => {
    if (!artistIds.length) {
      return
    }

    try {
      const userInterests = artistIds.map((artistId) => {
        return {
          category: "COLLECTED_BEFORE" as UserInterestCategory,
          interestId: artistId,
          interestType: "ARTIST" as UserInterestInterestType,
          private: true,
        }
      })

      await createUserInterests({ userInterests })
    } catch (error) {
      console.error("[MyCollectionAddCollectedArtists]: error creating user interests.", error)

      Alert.alert("Artists could not be added.")
    }
  }

  const addCustomArtists = async () => {
    if (!customArtists.length) {
      return
    }

    await Promise.all(
      customArtists.map(async (customArtist) => {
        try {
          await createArtist({
            displayName: customArtist.name,
            birthday: customArtist.birthYear,
            deathday: customArtist.deathYear,
            nationality: customArtist.nationality,
            isPersonalArtist: true,
          })
        } catch (error) {
          console.error(
            `[MyCollectionAddCollectedArtists]: error creating artist ${customArtist.name}.`,
            error
          )

          Alert.alert(`Artist ${customArtist.name} could not be created.`)
        }
      })
    )
  }

  const handleSubmit = async () => {
    setIsLoading(true)

    await addCustomArtists()

    await addUserInterests()

    setIsLoading(false)

    dismissModal()
    popToRoot()
  }

  const numberOfArtists = artistIds.length + customArtists.length

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
        <Button block disabled={!numberOfArtists} onPress={handleSubmit} mb={`${bottom}px`}>
          <Text color="white100">
            Add Selected {pluralize(`Artist`, numberOfArtists)} • {numberOfArtists}
          </Text>
        </Button>
      </Flex>

      {!!isLoading && (
        <Flex
          position="absolute"
          top="50%"
          left="50%"
          opacity={0.5}
          backgroundColor="black10"
          alignItems="center"
          justifyContent="center"
        >
          <Spinner />
        </Flex>
      )}
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
