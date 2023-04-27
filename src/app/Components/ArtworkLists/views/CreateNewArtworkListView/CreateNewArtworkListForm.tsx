import { Button, Spacer } from "@artsy/palette-mobile"
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
import * as Yup from "yup"

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

export const CreateNewArtworkListForm = () => {
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
        console.log("[debug] data", data)

        const response = data.createCollection?.responseOrError
        const artworkList = response?.collection!
        const result: Result = {
          name: artworkList.name,
          internalID: artworkList.internalID,
        }

        setRecentlyAddedArtworkList(result)
        preselectRecentlyAddedArtworkList(artworkList.internalID)

        requestAnimationFrame(() => {
          closeCurrentView()
          helpers.setSubmitting(false)
        })
      },
      onError: (error) => {
        if (__DEV__) {
          console.error(error)
        } else {
          captureMessage(error?.stack!)
        }

        helpers.setFieldError("name", error.message)
        helpers.setSubmitting(false)
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
        console.log("[debug] formik", JSON.stringify(formik, null, 2))

        return (
          <>
            <BottomSheetInput
              placeholder="Name your list"
              value={formik.values.name}
              onChangeText={formik.handleChange("name")}
              error={formik.errors.name}
            />

            <Button
              width="100%"
              block
              disabled={!formik.isValid}
              loading={formik.isSubmitting}
              onPress={formik.handleSubmit}
            >
              Save
            </Button>

            <Spacer y={2} />

            <Button width="100%" block variant="outline" onPress={closeCurrentView}>
              Back
            </Button>
          </>
        )
      }}
    </Formik>
  )
}
