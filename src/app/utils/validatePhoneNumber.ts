import * as glibphone from "google-libphonenumber"
import { replace } from "lodash"

// accepts a phone number with country code eg +1 12312312312 and decides if it's valid or not
export const validatePhoneNumber = (number: string | undefined | null) => {
  const phoneUtil = glibphone.PhoneNumberUtil.getInstance()
  try {
    number = replace(number || "", /[()-\s]/g, "")
    const parsedNumber = phoneUtil.parse(number, "")
    return phoneUtil.isValidNumber(parsedNumber)
  } catch (err) {
    return false
  }
}
