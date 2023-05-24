import { Flex, Spacer } from "@artsy/palette-mobile"
import { useBottomSheetModal } from "@gorhom/bottom-sheet"
import { captureMessage } from "@sentry/react-native"
import { ArtworkListsBottomSheetSectionTitle } from "app/Components/ArtworkLists/components/ArtworkListsBottomSheetSectionTitle"
import {
  AutoHeightBottomSheet,
  AutoHeightBottomSheetProps,
} from "app/Components/ArtworkLists/components/AutoHeightBottomSheet"
import {
  CreateOrEditArtworkListFormValues,
  CreateOrEditArtworkListForm,
} from "app/Components/ArtworkLists/components/CreateOrEditArtworkListForm"
import { useArtworkListsBottomOffset } from "app/Components/ArtworkLists/useArtworkListsBottomOffset"
import { useArtworkListToast } from "app/Components/ArtworkLists/useArtworkListsToast"
import { HeaderMenuArtworkListEntity } from "app/Scenes/ArtworkList/types"
import { FormikHelpers } from "formik"
import { FC } from "react"
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
  const bottomOffset = useArtworkListsBottomOffset(2)
  const { dismiss, dismissAll } = useBottomSheetModal()
  const [commit] = useEditArtworkList()

  const closeView = () => {
    dismiss(NAME)
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
        },
      },
      onCompleted: () => {
        helpers.setSubmitting(false)
        toast.changesSaved()
        dismissAll()
      },
      onError: (error) => {
        helpers.setFieldError("name", error.message)
        helpers.setSubmitting(false)

        if (__DEV__) {
          console.error(error)
        } else {
          captureMessage(error?.stack!)
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
          initialValues={{ name: artworkListEntity.title }}
          onSubmit={handleSubmit}
          onBackPress={closeView}
        />
      </Flex>
    </AutoHeightBottomSheet>
  )
}
