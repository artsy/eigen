import { FormikProvider, useFormik } from "formik"
import React from "react"
import { Form } from "./Components/Form"
import { SavedSearchAlertFormValues } from "./SavedSearchAlertModel"

interface SavedSearchAlertFormProps {
  onSaved?: () => void
}

export const SavedSearchAlertForm: React.FC<SavedSearchAlertFormProps> = (props) => {
  const { onSaved } = props
  const formik = useFormik<SavedSearchAlertFormValues>({
    initialValues: { name: "" },
    initialErrors: {},
    onSubmit: async () => {
      onSaved?.()
    },
  })

  return (
    <FormikProvider value={formik}>
      <Form />
    </FormikProvider>
  )
}
