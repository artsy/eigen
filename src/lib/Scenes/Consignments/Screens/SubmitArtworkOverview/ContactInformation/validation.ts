import * as Yup from "yup"

export interface ContactInfoFormModel {
  name: string
  email: string
  phoneNumber: string
}

export const emptyInitialValues = {
  name: "",
  email: "",
  phoneNumber: "",
}

export const validationSchema = Yup.object().shape({
  name: Yup.string().trim(),
  email: Yup.string().trim(),
  phoneNumber: Yup.string().trim(),
})
