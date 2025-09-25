import { Button, Flex, Screen, useScreenDimensions } from "@artsy/palette-mobile"
import LoadingModal from "app/Components/Modals/LoadingModal"
import { useToast } from "app/Components/Toast/toastHook"
import { MyCollectionAddCollectedArtistsAutosuggest } from "app/Scenes/MyCollection/Screens/MyCollectionAddCollectedArtists/MyCollectionAddCollectedArtistsAutosuggest"
import { MyCollectionAddCollectedArtistsStore } from "app/Scenes/MyCollection/Screens/MyCollectionAddCollectedArtists/MyCollectionAddCollectedArtistsStore"
import { useSubmitMyCollectionArtists } from "app/Scenes/MyCollection/hooks/useSubmitMyCollectionArtists"
import { dismissModal } from "app/system/navigation/navigate"
import { pluralize } from "app/utils/pluralize"
import { refreshMyCollection } from "app/utils/refreshHelpers"
import { Suspense } from "react"
import { Platform } from "react-native"

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
    }
  }

  return (
    <Screen safeArea={false}>
      <Screen.Body disableKeyboardAvoidance>
        <Flex flex={1} mt={2}>
          <Suspense fallback={null}>
            <MyCollectionAddCollectedArtistsAutosuggest />
          </Suspense>
        </Flex>

        <Flex pt={2} pb={Platform.OS === "android" ? 2 : 0} backgroundColor="mono0">
          <Button
            disabled={!count || isLoading}
            block
            onPress={handleSubmit}
            haptic
            mb={`${bottom}px`}
          >
            Add Selected {pluralize(`Artist`, count)} • {count}
          </Button>
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
