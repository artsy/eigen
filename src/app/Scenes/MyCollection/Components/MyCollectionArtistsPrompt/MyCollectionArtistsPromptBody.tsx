import { useBottomSheet } from "@gorhom/bottom-sheet"
import LoadingModal from "app/Components/Modals/LoadingModal"
import { useToast } from "app/Components/Toast/toastHook"
import { MyCollectionArtistsAutosuggest } from "app/Scenes/MyCollection/Components/MyCollectionArtistsPrompt/MyCollectionArtistsAutosuggest"
import { MyCollectionArtistsPromptFooter } from "app/Scenes/MyCollection/Components/MyCollectionArtistsPrompt/MyCollectionArtistsPromptFooter"
import { useSubmitMyCollectionArtists } from "app/Scenes/MyCollection/hooks/useSubmitMyCollectionArtists"
import { refreshMyCollection } from "app/utils/refreshHelpers"
import { FC } from "react"

export const MyCollectionArtistsPromptBody: FC = () => {
  const toast = useToast()
  const { submit, isSubmitting } = useSubmitMyCollectionArtists("MyCollectionArtistsPrompt")
  const { close } = useBottomSheet()

  const handleSubmit = async () => {
    const response = await submit()

    if (response) {
      refreshMyCollection()
      toast.show("Saved.", "bottom", { backgroundColor: "green100" })
      close()
    }
  }

  return (
    <>
      <MyCollectionArtistsAutosuggest />
      <MyCollectionArtistsPromptFooter onPress={handleSubmit} isLoading={isSubmitting} />
      <LoadingModal isVisible={isSubmitting} />
    </>
  )
}
