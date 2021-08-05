import { FormikProvider, useFormik } from "formik"
import { Aggregations, FilterArray } from "lib/Components/ArtworkFilter/ArtworkFilterHelpers"
import React from "react"
import { Form } from "./Components/Form"
import { extractPills } from "./helpers"
import { SavedSearchAlertFormPropsBase, SavedSearchAlertFormValues } from "./SavedSearchAlertModel"

interface SavedSearchAlertFormProps extends SavedSearchAlertFormPropsBase {
  initialValues: {
    name: string
  }
  mode: "create" | "update"
  filters: FilterArray
  aggregations: Aggregations
  mutation: (values: SavedSearchAlertFormValues) => Promise<any>
  onSaved?: () => void
  onDeletePress?: () => void
}

export const SavedSearchAlertForm: React.FC<SavedSearchAlertFormProps> = (props) => {
  const { filters, aggregations, initialValues, mutation, onSaved, ...other } = props
  const formik = useFormik<SavedSearchAlertFormValues>({
    initialValues,
    initialErrors: {},
    onSubmit: async (values) => {
      await mutation(values)
      onSaved?.()
    },
  })

  const pills = extractPills(filters, aggregations)

  return (
    <FormikProvider value={formik}>
      <Form pills={pills} {...other} />
    </FormikProvider>
  )
}
