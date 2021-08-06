import { FormikProvider, useFormik } from "formik"
import { Aggregations, FilterArray } from "lib/Components/ArtworkFilter/ArtworkFilterHelpers"
import React from "react"
import { Form } from "./Components/Form"
import { extractPills } from "./helpers"
import {
  SavedSearchAlertFormMode,
  SavedSearchAlertFormPropsBase,
  SavedSearchAlertFormValues,
} from "./SavedSearchAlertModel"

export interface SavedSearchAlertFormProps extends SavedSearchAlertFormPropsBase {
  initialValues: {
    name: string
  }
  mode: SavedSearchAlertFormMode
  filters: FilterArray
  aggregations: Aggregations
  mutation: (values: SavedSearchAlertFormValues) => Promise<any>
  onDeletePress?: () => void
}

export const SavedSearchAlertForm: React.FC<SavedSearchAlertFormProps> = (props) => {
  const { filters, aggregations, initialValues, mutation, ...other } = props
  const formik = useFormik<SavedSearchAlertFormValues>({
    initialValues,
    initialErrors: {},
    onSubmit: async (values) => {
      try {
        await mutation(values)
      } catch (error) {
        console.error(error)
      }
    },
  })

  const pills = extractPills(filters, aggregations)

  return (
    <FormikProvider value={formik}>
      <Form pills={pills} {...other} />
    </FormikProvider>
  )
}
