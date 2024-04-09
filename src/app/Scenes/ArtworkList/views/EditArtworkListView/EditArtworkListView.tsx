import { ActionType, EditedArtworkList, OwnerType } from "@artsy/cohesion"
import { Flex, Spacer } from "@artsy/palette-mobile"
import { useBottomSheetModal } from "@gorhom/bottom-sheet"
import { captureMessage } from "@sentry/react-native"
import { ArtworkListsBottomSheetSectionTitle } from "app/Components/ArtworkLists/components/ArtworkListsBottomSheetSectionTitle"
import {
  CreateOrEditArtworkListFormValues,
  CreateOrEditArtworkListForm,
} from "app/Components/ArtworkLists/components/CreateOrEditArtworkListForm"
import { useArtworkListsBottomOffset } from "app/Components/ArtworkLists/useArtworkListsBottomOffset"
import { useArtworkListToast } from "app/Components/ArtworkLists/useArtworkListsToast"
import {
  AutoHeightBottomSheet,
  AutoHeightBottomSheetProps,
} from "app/Components/BottomSheet/AutoHeightBottomSheet"
import { HeaderMenuArtworkListEntity } from "app/Scenes/ArtworkList/types"
import { FormikHelpers } from "formik"
import { FC } from "react"
import { useTracking } from "react-tracking"
import { useEditArtworkList } from "./useEditArtworkList"

const NAME = "EditArtworkListView"

interface EditArtworkListViewProps extends Omit<AutoHeightBottomSheetProps, "children"> {
  artworkListEntity: HeaderMenuArtworkListEntity
  onDismiss: () => void
}

export const EditArtworkListView: FC<EditArtworkListViewProps> = ({
  artworkListEntity,
  ...rest
}) => {
  const toast = useArtworkListToast()
  const { trackEvent } = useTracking()
  const bottomOffset = useArtworkListsBottomOffset(2)
  const { dismiss, dismissAll } = useBottomSheetModal()
  const [commit] = useEditArtworkList()

  const closeView = () => {
    dismiss(NAME)
  }

  const trackAnalytics = () => {
    const event: EditedArtworkList = {
      action: ActionType.editedArtworkList,
      context_owner_type: OwnerType.saves,
      owner_id: artworkListEntity.internalID,
    }

    trackEvent(event)
  }

  const handleSubmit = (
    values: CreateOrEditArtworkListFormValues,
    helpers: FormikHelpers<CreateOrEditArtworkListFormValues>
  ) => {
    commit({
      variables: {
        input: {
          id: artworkListEntity.internalID,
          name: values.name,
          shareableWithPartners: values.shareableWithPartners,
        },
      },
      onCompleted: () => {
        helpers.setSubmitting(false)
        toast.changesSaved()
        trackAnalytics()
        dismissAll()
      },
      onError: (error) => {
        helpers.setFieldError("name", error.message)
        helpers.setSubmitting(false)

        if (__DEV__) {
          console.error(error)
        } else {
          captureMessage(`useEditArtworkList ${error?.message}`)
        }
      },
    })
  }

  return (
    <AutoHeightBottomSheet name={NAME} {...rest}>
      <Flex mt={1} mx={2} mb={`${bottomOffset}px`}>
        <ArtworkListsBottomSheetSectionTitle>Edit your list</ArtworkListsBottomSheetSectionTitle>

        <Spacer y={2} />

        <CreateOrEditArtworkListForm
          mode="edit"
          initialValues={{
            name: artworkListEntity.title,
            shareableWithPartners: artworkListEntity.shareableWithPartners,
          }}
          onSubmit={handleSubmit}
          onBackPress={closeView}
        />
      </Flex>
    </AutoHeightBottomSheet>
  )
}
