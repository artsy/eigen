import * as glibphone from "google-libphonenumber"
import { replace } from "lodash"

const phoneUtil = glibphone.PhoneNumberUtil.getInstance()

export const isValidNumber = (number: string, code: string) => {
  try {
    number = replace(number, /[+()-\s]/g, "")
    const parsedNumber = phoneUtil.parse(number, code)
    return phoneUtil.isValidNumber(parsedNumber)
  } catch (err) {
    return false
  }
}
