import {
  ActionType,
  ContextModule,
  OwnerType,
  TappedMyCollectionAddArtworkArtist,
} from "@artsy/cohesion"
import { useBottomSheet } from "@gorhom/bottom-sheet"
import LoadingModal from "app/Components/Modals/LoadingModal"
import { MyCollectionArtistsAutosuggest } from "app/Scenes/MyCollection/Components/MyCollectionArtistsPrompt/MyCollectionArtistsAutosuggest"
import { MyCollectionArtistsPromptFooter } from "app/Scenes/MyCollection/Components/MyCollectionArtistsPrompt/MyCollectionArtistsPromptFooter"
import { useSubmitMyCollectionArtists } from "app/Scenes/MyCollection/hooks/useSubmitMyCollectionArtists"
import { useAnalyticsContext } from "app/system/analytics/AnalyticsContext"
// eslint-disable-next-line no-restricted-imports
import { navigate } from "app/system/navigation/navigate"
import { refreshMyCollection } from "app/utils/refreshHelpers"
import { FC } from "react"
import { useTracking } from "react-tracking"

export const MyCollectionArtistsPromptBody: FC = () => {
  const { trackEvent } = useTracking()
  const { contextScreenOwnerId, contextScreenOwnerSlug } = useAnalyticsContext()
  const { submit, isSubmitting } = useSubmitMyCollectionArtists("MyCollectionArtistsPrompt")
  const { close } = useBottomSheet()

  const handleSubmit = async () => {
    const response = await submit()

    if (response) {
      refreshMyCollection()
      trackEvent(
        tracks.tappedMyCollectionAddArtworkArtist(contextScreenOwnerId, contextScreenOwnerSlug)
      )
      close()
      navigate("my-collection")
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

const tracks = {
  tappedMyCollectionAddArtworkArtist: (
    contextScreenOwnerId: string | undefined,
    contextScreenOwnerSlug: string | undefined
  ): TappedMyCollectionAddArtworkArtist => ({
    action: ActionType.tappedMyCollectionAddArtworkArtist,
    context_screen: OwnerType.myCollectionAddArtworkArtist,
    context_module: ContextModule.myCollectionAddArtworkAddArtist,
    context_screen_owner_id: contextScreenOwnerId,
    context_screen_owner_slug: contextScreenOwnerSlug,
    platform: "mobile",
  }),
}
