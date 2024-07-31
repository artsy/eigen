import { Button, Flex, Spacer, Text, useScreenDimensions } from "@artsy/palette-mobile"
import {
  UserInterestCategory,
  UserInterestInterestType,
  useCreateUserInterestsMutation,
} from "__generated__/useCreateUserInterestsMutation.graphql"
import { FancyModalHeader } from "app/Components/FancyModal/FancyModalHeader"
import LoadingModal from "app/Components/Modals/LoadingModal"
import { useToast } from "app/Components/Toast/toastHook"
import { MyCollectionAddCollectedArtistsAutosuggest } from "app/Scenes/MyCollection/Screens/MyCollectionAddCollectedArtists/MyCollectionAddCollectedArtistsAutosuggest"
import { MyCollectionAddCollectedArtistsStore } from "app/Scenes/MyCollection/Screens/MyCollectionAddCollectedArtists/MyCollectionAddCollectedArtistsStore"
import { createArtist } from "app/Scenes/MyCollection/mutations/createArtist"
import { createUserInterests } from "app/Scenes/MyCollection/mutations/createUserInterests"
import { dismissModal, goBack } from "app/system/navigation/navigate"
import { pluralize } from "app/utils/pluralize"
import { refreshMyCollection } from "app/utils/refreshHelpers"
import { Suspense, useState } from "react"

export const MyCollectionAddCollectedArtists: React.FC<{}> = () => {
  const { bottom } = useScreenDimensions().safeAreaInsets
  const toast = useToast()

  const [isLoading, setIsLoading] = useState(false)

  const artistIds = MyCollectionAddCollectedArtistsStore.useStoreState((state) => state.artistIds)
  const customArtists = MyCollectionAddCollectedArtistsStore.useStoreState(
    (state) => state.customArtists
  )

  const addUserInterests = async () => {
    if (!artistIds.length) {
      return true
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

      const result = (await createUserInterests({
        userInterests,
      })) as useCreateUserInterestsMutation["response"]

      const failedResults = result.createUserInterests?.userInterestsOrErrors.filter(
        (result) => result.mutationError
      )

      if (failedResults?.length === userInterests.length) {
        toast.show("Artists could be added.", "bottom", { backgroundColor: "red100" })
        return false
      } else if (failedResults?.length) {
        toast.show("Some artists could not be added.", "bottom", { backgroundColor: "red100" })
        return true
      }
    } catch (error) {
      console.error("[MyCollectionAddCollectedArtists]: error creating user interests.", error)

      toast.show("Artsts could not be added.", "bottom", { backgroundColor: "red100" })
      return false
    }

    return true
  }

  const createCustomArtists = async () => {
    if (!customArtists.length) {
      return
    }

    const results = await Promise.all(
      customArtists.map(async (customArtist) => {
        try {
          return await createArtist({
            displayName: customArtist.name,
            birthday: customArtist.birthYear,
            deathday: customArtist.deathYear,
            nationality: customArtist.nationality,
            isPersonalArtist: true,
          })
        } catch (error) {
          return null
        }
      })
    )

    const numberOfFailedResults = results.filter((result) => !result).length

    if (numberOfFailedResults > 0) {
      toast.show("Some artists could not be created.", "bottom", { backgroundColor: "red100" })
    }
  }

  const handleSubmit = async () => {
    setIsLoading(true)

    await createCustomArtists()

    const addingUserInterestsSucceeded = await addUserInterests()

    setIsLoading(false)

    // In case no artists were added, we don't want to dismiss the modal
    if (addingUserInterestsSucceeded) {
      refreshMyCollection()
      toast.show("Saved.", "bottom", { backgroundColor: "green100" })
      dismissModal()
      goBack()
    }
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
        <Button
          block
          disabled={!numberOfArtists || isLoading}
          onPress={handleSubmit}
          mb={`${bottom}px`}
        >
          <Text color="white100">
            Add Selected {pluralize(`Artist`, numberOfArtists)} • {numberOfArtists}
          </Text>
        </Button>
      </Flex>

      <LoadingModal isVisible={isLoading} dark />
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
