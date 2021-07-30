import { FormikProvider, useFormik } from "formik"
import { Aggregations, FilterArray } from "lib/Components/ArtworkFilter/ArtworkFilterHelpers"
import React from "react"
import { Form } from "./Components/Form"
import { extractPills } from "./helpers"
import { SavedSearchAlertFormPropsBase, SavedSearchAlertFormValues } from "./SavedSearchAlertModel"

interface SavedSearchAlertFormProps extends SavedSearchAlertFormPropsBase {
  filters: FilterArray
  aggregations: Aggregations
  onSaved?: () => void
}

export const SavedSearchAlertForm: React.FC<SavedSearchAlertFormProps> = (props) => {
  const { filters, aggregations, onSaved, ...other } = props
  const formik = useFormik<SavedSearchAlertFormValues>({
    initialValues: { name: "" },
    initialErrors: {},
    onSubmit: async () => {
      onSaved?.()
    },
  })

  const pills = extractPills(filters, aggregations)

  return (
    <FormikProvider value={formik}>
      <Form pills={pills} filters={filters} {...other} />
    </FormikProvider>
  )
}
