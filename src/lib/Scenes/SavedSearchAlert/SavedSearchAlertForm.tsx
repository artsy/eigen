import { FormikProvider, useFormik } from "formik"
import { Aggregations, FilterArray } from "lib/Components/ArtworkFilter/ArtworkFilterHelpers"
import React from "react"
import { Alert } from "react-native"
import { Form } from "./Components/Form"
import { extractPills } from "./helpers"
import { deleteSavedSearchMutation } from "./mutations/deleteSavedSearchAlert"
import { updateSavedSearchAlert } from "./mutations/updateSavedSearchAlert"
import { SavedSearchAlertFormPropsBase, SavedSearchAlertFormValues } from "./SavedSearchAlertModel"

export interface SavedSearchAlertFormProps extends SavedSearchAlertFormPropsBase {
  initialValues: {
    name: string
  }
  filters: FilterArray
  aggregations: Aggregations
  savedSearchAlertId?: string
  onComplete?: () => void
  onDeleteComplete?: () => void
}

export const SavedSearchAlertForm: React.FC<SavedSearchAlertFormProps> = (props) => {
  const { filters, aggregations, initialValues, savedSearchAlertId, onComplete, onDeleteComplete, ...other } = props
  const isUpdateForm = !!savedSearchAlertId
  const formik = useFormik<SavedSearchAlertFormValues>({
    initialValues,
    initialErrors: {},
    onSubmit: async (values) => {
      try {
        if (isUpdateForm) {
          await updateSavedSearchAlert(savedSearchAlertId!, values)
        }

        onComplete?.()
      } catch (error) {
        console.error(error)
      }
    },
  })

  const onDelete = async () => {
    try {
      await deleteSavedSearchMutation(savedSearchAlertId!)
      onDeleteComplete?.()
    } catch (error) {
      console.error(error)
    }
  }

  const handleDeletePress = () => {
    Alert.alert(
      "Delete Alert",
      "Once you delete this alert, you will have to recreate it to continue receiving alerts on your favorite artworks.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: onDelete },
      ]
    )
  }

  const pills = extractPills(filters, aggregations)

  return (
    <FormikProvider value={formik}>
      <Form pills={pills} isUpdateForm={isUpdateForm} onDeletePress={handleDeletePress} {...other} />
    </FormikProvider>
  )
}
