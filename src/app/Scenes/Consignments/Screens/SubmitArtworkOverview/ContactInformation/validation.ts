import * as glibphone from "google-libphonenumber"
import { replace } from "lodash"
import * as Yup from "yup"

export interface ContactInformationFormModel {
  userName: string
  userEmail: string
  userPhone: string | undefined
}

const phoneUtil = glibphone.PhoneNumberUtil.getInstance()

export const contactInformationValidationSchema = Yup.object().shape({
  userName: Yup.string().required().min(2),
  userEmail: Yup.string().required().email(),
  userPhone: Yup.string().test("userPhone", "This field is required", (number) => {
    try {
      number = replace(number || "", /[()-\s]/g, "")
      const parsedNumber = phoneUtil.parse(number, "")
      return phoneUtil.isValidNumber(parsedNumber)
    } catch (err) {
      return false
    }
  }), // save in app/utils
})

// export const validatePhoneNumber = (number: string) => {
//   const phoneUtil = glibphone.PhoneNumberUtil.getInstance()

//   try {
//     number = replace(number || "", /[()-\s]/g, "")
//     const parsedNumber = phoneUtil.parse(number, "")
//     return phoneUtil.isValidNumber(parsedNumber)
//   } catch (err) {
//     return false
//   }
// }
