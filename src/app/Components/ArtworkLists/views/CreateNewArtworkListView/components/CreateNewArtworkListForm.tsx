import { Box, BoxProps, Button, Spacer } from "@artsy/palette-mobile"
import { useBottomSheetModal } from "@gorhom/bottom-sheet"
import { captureMessage } from "@sentry/react-native"
import {
  ArtworkListMode,
  useArtworkListsContext,
} from "app/Components/ArtworkLists/ArtworkListsContext"
import { useCreateNewArtworkList } from "app/Components/ArtworkLists/views/CreateNewArtworkListView/useCreateNewArtworkList"
import { ArtworkListsViewName } from "app/Components/ArtworkLists/views/constants"
import { BottomSheetInput } from "app/Components/BottomSheetInput"
import { Formik, FormikHelpers } from "formik"
import { FC } from "react"
import * as Yup from "yup"
import { RemainingCharactersLabel } from "./RemainingCharactersLabel"

export interface CreateNewArtworkListFormValues {
  name: string
}

const MAX_NAME_LENGTH = 40
const INITIAL_FORM_VALUES: CreateNewArtworkListFormValues = {
  name: "",
}

interface Result {
  name: string
  internalID: string
}

export const validationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required").max(MAX_NAME_LENGTH),
})

export const CreateNewArtworkListForm: FC<BoxProps> = (props) => {
  const { dispatch } = useArtworkListsContext()
  const { dismiss } = useBottomSheetModal()
  const [commitMutation] = useCreateNewArtworkList()

  const setRecentlyAddedArtworkList = (result: Result) => {
    dispatch({
      type: "SET_RECENTLY_ADDED_ARTWORK_LIST",
      payload: {
        internalID: result.internalID,
        name: result.name,
      },
    })
  }

  const preselectRecentlyAddedArtworkList = (artworkListID: string) => {
    dispatch({
      type: "ADD_OR_REMOVE_ARTWORK_LIST_ID",
      payload: {
        mode: ArtworkListMode.AddingArtworkListIDs,
        artworkListID,
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
    commitMutation({
      variables: {
        input: {
          name: values.name,
        },
      },
      onCompleted: (data) => {
        const response = data.createCollection?.responseOrError
        const artworkList = response?.collection!
        const result: Result = {
          name: artworkList.name,
          internalID: artworkList.internalID,
        }

        setRecentlyAddedArtworkList(result)
        preselectRecentlyAddedArtworkList(artworkList.internalID)
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
    <Box {...props}>
      <Formik
        initialValues={INITIAL_FORM_VALUES}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {(formik) => {
          const nameLength = formik.values.name.length
          const isSaveButtonDisabled = !formik.isValid || nameLength === 0

          return (
            <>
              <BottomSheetInput
                placeholder="Name your list"
                value={formik.values.name}
                onChangeText={formik.handleChange("name")}
                error={formik.errors.name}
                maxLength={MAX_NAME_LENGTH}
                onBlur={formik.handleBlur("name")}
              />
              <RemainingCharactersLabel currentLength={nameLength} maxLength={MAX_NAME_LENGTH} />

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
            </>
          )
        }}
      </Formik>
    </Box>
  )
}
