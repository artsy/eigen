import { isValidPhoneNumber } from "app/utils/isValidPhoneNumber"
import * as Yup from "yup"

export interface ContactInformationFormModel {
  userName: string
  userEmail: string
  userPhone: string | undefined
}

export const contactInformationValidationSchema = Yup.object().shape({
  userName: Yup.string()
    .required()
    .test(
      "userName",
      "Please enter your full name.",
      (name) => typeof name === "string" && name.length > 1
    ),
  userEmail: Yup.string().required().email("Please enter a valid email address."),
  userPhone: Yup.string()
    .required()
    .test("userPhone", "Please enter a valid phone number.", isValidPhoneNumber),
})
