import { ActionType, CreatedArtworkList, OwnerType } from "@artsy/cohesion"
import { useBottomSheetModal } from "@gorhom/bottom-sheet"
import { captureMessage } from "@sentry/react-native"
import { ArtworkListsStore } from "app/Components/ArtworkLists/ArtworkListsStore"
import {
  CreateOrEditArtworkListForm,
  CreateOrEditArtworkListFormValues,
} from "app/Components/ArtworkLists/components/CreateOrEditArtworkListForm"
import { ArtworkListEntity, ArtworkListMode } from "app/Components/ArtworkLists/types"
import { useCreateNewArtworkList } from "app/Components/ArtworkLists/views/CreateNewArtworkListView/useCreateNewArtworkList"
import { ArtworkListsViewName } from "app/Components/ArtworkLists/views/constants"
import { useAnalyticsContext } from "app/system/analytics/AnalyticsContext"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { FormikHelpers } from "formik"
import { FC } from "react"
import { useTracking } from "react-tracking"

export const CreateNewArtworkListForm: FC = () => {
  const { setRecentlyAddedArtworkList: _setRecentlyAddedArtworkList, addOrRemoveArtworkList } =
    ArtworkListsStore.useStoreActions((actions) => ({
      setRecentlyAddedArtworkList: actions.setRecentlyAddedArtworkList,
      addOrRemoveArtworkList: actions.addOrRemoveArtworkList,
    }))
  const { dismiss } = useBottomSheetModal()
  const analytics = useAnalyticsContext()
  const { trackEvent } = useTracking()
  const [commitMutation] = useCreateNewArtworkList()
  const AREnableArtworkListOfferability = useFeatureFlag("AREnableArtworkListOfferability")

  const setRecentlyAddedArtworkList = (artworkList: ArtworkListEntity) => {
    _setRecentlyAddedArtworkList({
      name: artworkList.name,
      internalID: artworkList.internalID,
    })
  }

  const preselectRecentlyAddedArtworkList = (artworkList: ArtworkListEntity) => {
    addOrRemoveArtworkList({
      mode: ArtworkListMode.AddingArtworkList,
      artworkList,
    })
  }

  const closeCurrentView = () => {
    dismiss(ArtworkListsViewName.CreateNewArtworkLists)
  }

  const trackAnalyticEvent = (artworkListId: string) => {
    const event: CreatedArtworkList = {
      action: ActionType.createdArtworkList,
      context_owner_id: analytics.contextScreenOwnerId,
      context_owner_slug: analytics.contextScreenOwnerSlug,
      context_owner_type: analytics.contextScreenOwnerType ?? OwnerType.saves,
      owner_id: artworkListId,
    }

    trackEvent(event)
  }

  const handleSubmit = (
    values: CreateOrEditArtworkListFormValues,
    helpers: FormikHelpers<CreateOrEditArtworkListFormValues>
  ) => {
    commitMutation({
      variables: {
        input: {
          name: values.name,
          // add shareableWithPartners to the input only if the feature flag is enabled
          ...(AREnableArtworkListOfferability
            ? { shareableWithPartners: values.shareableWithPartners }
            : {}),
        },
      },
      onCompleted: (data) => {
        const response = data.createCollection?.responseOrError

        if (response?.__typename === "CreateCollectionSuccess" && !!response?.collection) {
          const artworkList = response?.collection
          const result: ArtworkListEntity = {
            name: artworkList.name,
            internalID: artworkList.internalID,
          }

          setRecentlyAddedArtworkList(result)
          preselectRecentlyAddedArtworkList(result)
          closeCurrentView()
          trackAnalyticEvent(artworkList.internalID)

          helpers.setSubmitting(false)
        }
      },
      onError: (error) => {
        helpers.setFieldError("name", error.message)
        helpers.setSubmitting(false)

        if (__DEV__) {
          console.error(error)
        } else {
          captureMessage(`useCreateNewArtworkListMutation ${error?.message}`)
        }
      },
    })
  }

  return <CreateOrEditArtworkListForm mode="create" onSubmit={handleSubmit} />
}
