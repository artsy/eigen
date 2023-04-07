import { getCountry } from "react-native-localize"
import { countryIndex } from "./countries"
import { getCountryIso2FromPhoneNumber } from "./getCountryIso2FromPhoneNumber"

/**
 * In gravity we have a lot of dirty data since ':phone' has been more-or-less a free text field
 *
 * There's huge variability in how people have entered phone numbers, so here we do our best
 * to normalize phone numbers to a country code (iso2, e.g. 'us') and a phone number within that country code
 * so that we can replace the country code with its international dialling prefix.
 *
 * e.g. if this function returns {countryCode: 'gb', phoneNumber: '7825577664'}
 * then to call this number you'd type in '+447825577664'
 */
export function cleanUserPhoneNumber(value: string) {
  // remove anything but numbers and plusses
  let phoneNumber = value.replace(/[^+\d]/g, "").trim()
  const userLocaleCountryCode = getCountry().toLowerCase()

  if (!phoneNumber.startsWith("+")) {
    // check whether the user entered their phone number with the international prefix from their country
    // if so replace it with a "+"
    for (const prefix of countryIndex[userLocaleCountryCode]?.internationalPrefixes ?? []) {
      if (phoneNumber.startsWith(prefix)) {
        phoneNumber = "+" + phoneNumber.slice(prefix.length)
        break
      }
    }
  }

  let countryCode = getCountryIso2FromPhoneNumber(phoneNumber)
  if (!countryCode) {
    // fall back to user's current locale
    countryCode = userLocaleCountryCode
    // handle cases where a user entered their number with their local trunk prefix
    const trunkPrefix = countryIndex[userLocaleCountryCode]?.trunkPrefix
    if (trunkPrefix && phoneNumber.startsWith(trunkPrefix)) {
      phoneNumber = phoneNumber.slice(trunkPrefix.length).trim()
    }
  } else {
    // the phone number starts with a + and we have a valid countryCode so we
    // can remove the dial code
    const dialCode = countryIndex[countryCode]?.dialCode
    if (dialCode && phoneNumber.startsWith("+" + dialCode)) {
      phoneNumber = phoneNumber.slice(dialCode.length + 1).trim()
    }
  }

  return { countryCode, phoneNumber }
}
