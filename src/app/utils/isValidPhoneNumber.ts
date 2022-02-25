import * as glibphone from "google-libphonenumber"
import { replace } from "lodash"

/** accepts a phone number with country code and decides if it's valid or not
 *
 * @param {string|null|undefined} number The phone number to check for validity
 * @returns {boolean} A boolean indicating if the number is valid or not
 * @example
 * isValidPhoneNumber("+306945673892") = true
 * isValidPhoneNumber("+30(694)5673892") = true
 * isValidPhoneNumber("+30 (694) 5673892") = true
 * isValidPhoneNumber("0030 (694) 5673892") = true
 * isValidPhoneNumber("+1 (113) 1235") = false
 * isValidPhoneNumber("+1 (113) 123538989888") = false
 */

export const isValidPhoneNumber = (number: string | undefined | null) => {
  const phoneUtil = glibphone.PhoneNumberUtil.getInstance()
  try {
    number = replace(number || "", /[()-\s]/g, "")
    const parsedNumber = phoneUtil.parse(number, "")
    return phoneUtil.isValidNumber(parsedNumber)
  } catch (err) {
    return false
  }
}
