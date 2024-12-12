import { Button, Flex, Screen, Spacer, Text, useScreenDimensions } from "@artsy/palette-mobile"
import LoadingModal from "app/Components/Modals/LoadingModal"
import { useToast } from "app/Components/Toast/toastHook"
import { MyCollectionAddCollectedArtistsAutosuggest } from "app/Scenes/MyCollection/Screens/MyCollectionAddCollectedArtists/MyCollectionAddCollectedArtistsAutosuggest"
import { MyCollectionAddCollectedArtistsStore } from "app/Scenes/MyCollection/Screens/MyCollectionAddCollectedArtists/MyCollectionAddCollectedArtistsStore"
import { useSubmitMyCollectionArtists } from "app/Scenes/MyCollection/hooks/useSubmitMyCollectionArtists"
import { dismissModal, goBack } from "app/system/navigation/navigate"
import { pluralize } from "app/utils/pluralize"
import { refreshMyCollection } from "app/utils/refreshHelpers"
import { Suspense } from "react"

export const MyCollectionAddCollectedArtists: React.FC<{}> = () => {
  const { bottom } = useScreenDimensions().safeAreaInsets

  const toast = useToast()
  const { submit, isSubmitting: isLoading } = useSubmitMyCollectionArtists(
    "MyCollectionAddCollectedArtists"
  )

  const count = MyCollectionAddCollectedArtistsStore.useStoreState((state) => state.count)

  const handleSubmit = async () => {
    const addingUserInterestsSucceeded = await submit()

    // In case no artists were added, we don't want to dismiss the modal
    if (addingUserInterestsSucceeded) {
      refreshMyCollection()
      toast.show("Saved.", "bottom", { backgroundColor: "green100" })
      dismissModal()
      goBack()
    }
  }

  return (
    <Screen>
      <Screen.Body>
        <Flex flex={1} mt={1}>
          <Suspense fallback={() => null}>
            <MyCollectionAddCollectedArtistsAutosuggest />
          </Suspense>

          <Spacer y={4} />

          <Flex
            position="absolute"
            bottom={0}
            alignItems="center"
            alignSelf="center"
            pb={2}
            right={0}
            left={0}
            backgroundColor="white100"
          >
            <Button block disabled={!count || isLoading} onPress={handleSubmit} mb={`${bottom}px`}>
              <Text color="white100">
                Add Selected {pluralize(`Artist`, count)} • {count}
              </Text>
            </Button>
          </Flex>
        </Flex>

        <LoadingModal isVisible={isLoading} dark />
      </Screen.Body>
    </Screen>
  )
}

export const MyCollectionAddCollectedArtistsScreen = () => {
  return (
    <MyCollectionAddCollectedArtistsStore.Provider>
      <MyCollectionAddCollectedArtists />
    </MyCollectionAddCollectedArtistsStore.Provider>
  )
}
