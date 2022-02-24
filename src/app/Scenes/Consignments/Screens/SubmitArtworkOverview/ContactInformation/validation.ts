import { isValidPhoneNumber } from "app/utils/isValidPhoneNumber"
import * as Yup from "yup"

export interface ContactInformationFormModel {
  userName: string
  userEmail: string
  userPhone: string | undefined
}

export const contactInformationValidationSchema = Yup.object().shape({
  userName: Yup.string().required().min(2),
  userEmail: Yup.string().required().email(),
  userPhone: Yup.string()
    .required()
    .test("userPhone", "This field is required", isValidPhoneNumber),
})
