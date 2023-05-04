import { Button, Flex, FlexProps, Spacer } from "@artsy/palette-mobile"
import { useBottomSheetModal } from "@gorhom/bottom-sheet"
import { captureMessage } from "@sentry/react-native"
import { useArtworkListsContext } from "app/Components/ArtworkLists/ArtworkListsContext"
import { ArtworkListEntity, ArtworkListMode } from "app/Components/ArtworkLists/types"
import { CreateNewArtworkListInput } from "app/Components/ArtworkLists/views/CreateNewArtworkListView/components/CreateNewArtworkListInput"
import { useCreateNewArtworkList } from "app/Components/ArtworkLists/views/CreateNewArtworkListView/useCreateNewArtworkList"
import { ArtworkListsViewName } from "app/Components/ArtworkLists/views/constants"
import { Formik, FormikHelpers } from "formik"
import { FC } from "react"
import * as Yup from "yup"

export interface CreateNewArtworkListFormValues {
  name: string
}

const MAX_NAME_LENGTH = 40
const INITIAL_FORM_VALUES: CreateNewArtworkListFormValues = {
  name: "",
}

export const validationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required").max(MAX_NAME_LENGTH),
})

export const CreateNewArtworkListForm: FC<FlexProps> = (props) => {
  const { dispatch } = useArtworkListsContext()
  const { dismiss } = useBottomSheetModal()
  const [commitMutation] = useCreateNewArtworkList()

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

  const handleSubmit = (
    values: CreateNewArtworkListFormValues,
    helpers: FormikHelpers<CreateNewArtworkListFormValues>
  ) => {
    const formattedValue = values.name.trim()

    commitMutation({
      variables: {
        input: {
          name: formattedValue,
        },
      },
      onCompleted: (data) => {
        const response = data.createCollection?.responseOrError
        const artworkList = response?.collection!
        const result: ArtworkListEntity = {
          name: artworkList.name,
          internalID: artworkList.internalID,
        }

        setRecentlyAddedArtworkList(result)
        preselectRecentlyAddedArtworkList(result)
        closeCurrentView()

        helpers.setSubmitting(false)
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
    <Formik
      initialValues={INITIAL_FORM_VALUES}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {(formik) => {
        const isSaveButtonDisabled = !formik.isValid || formik.values.name.length === 0

        return (
          <Flex {...props}>
            <CreateNewArtworkListInput
              placeholder="Name your list"
              value={formik.values.name}
              error={formik.errors.name}
              maxLength={MAX_NAME_LENGTH}
              onBlur={formik.handleBlur("name")}
              onChangeText={formik.handleChange("name")}
            />

            <Spacer y={4} />

            <Button
              block
              disabled={isSaveButtonDisabled}
              loading={formik.isSubmitting}
              onPress={formik.handleSubmit}
            >
              Save
            </Button>

            <Spacer y={1} />

            <Button block variant="outline" onPress={closeCurrentView}>
              Back
            </Button>
          </Flex>
        )
      }}
    </Formik>
  )
}
