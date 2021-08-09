import { FormikProvider, useFormik } from "formik"
import { Aggregations, FilterArray } from "lib/Components/ArtworkFilter/ArtworkFilterHelpers"
import React from "react"
import { Form } from "./Components/Form"
import { extractPills } from "./helpers"
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
}

export const SavedSearchAlertForm: React.FC<SavedSearchAlertFormProps> = (props) => {
  const { filters, aggregations, initialValues, savedSearchAlertId, onComplete, ...other } = props
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

  const pills = extractPills(filters, aggregations)

  return (
    <FormikProvider value={formik}>
      <Form pills={pills} isUpdateForm={isUpdateForm} {...other} />
    </FormikProvider>
  )
}
