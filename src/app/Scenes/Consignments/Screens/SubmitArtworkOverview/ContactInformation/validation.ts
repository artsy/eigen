import * as Yup from "yup"

export interface ContactInformationFormModel {
  userName: string
  userEmail: string
  userPhone: string | undefined
}

export const contactInformationValidationSchema = Yup.object().shape({
  userName: Yup.string().required("Please provide a name").trim(),
  userEmail: Yup.string().email().required("Please provide a valid Email").trim(),
  userPhone: Yup.string().required("Please provide a valid phone number").trim(),
})
