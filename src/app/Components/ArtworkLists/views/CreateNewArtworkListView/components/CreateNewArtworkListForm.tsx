import { ActionType, CreatedArtworkList, OwnerType } from "@artsy/cohesion"
import { Flex, FlexProps } from "@artsy/palette-mobile"
import { useBottomSheetModal } from "@gorhom/bottom-sheet"
import { captureMessage } from "@sentry/react-native"
import { useArtworkListsContext } from "app/Components/ArtworkLists/ArtworkListsContext"
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

export const CreateNewArtworkListForm: FC<FlexProps> = (props) => {
  const { dispatch } = useArtworkListsContext()
  const { dismiss } = useBottomSheetModal()
  const analytics = useAnalyticsContext()
  const { trackEvent } = useTracking()
  const [commitMutation] = useCreateNewArtworkList()
  const AREnableArtworkListOfferability = useFeatureFlag("AREnableArtworkListOfferability")

  const setRecentlyAddedArtworkList = (artworkList: ArtworkListEntity) => {
    dispatch({
      type: "SET_RECENTLY_ADDED_ARTWORK_LIST",
      payload: {
        internalID: artworkList.internalID,
        name: artworkList.name,
      },
    })
  }

  const preselectRecentlyAddedArtworkList = (artworkList: ArtworkListEntity) => {
    dispatch({
      type: "ADD_OR_REMOVE_ARTWORK_LIST",
      payload: {
        mode: ArtworkListMode.AddingArtworkList,
        artworkList,
      },
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

  return (
    <Flex {...props}>
      <CreateOrEditArtworkListForm
        mode="create"
        onSubmit={handleSubmit}
        onBackPress={closeCurrentView}
      />
    </Flex>
  )
}
