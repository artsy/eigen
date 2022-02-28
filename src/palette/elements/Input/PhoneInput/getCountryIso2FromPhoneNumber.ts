import { compact } from "lodash"
import { countries } from "./countries"

export function getCountryIso2FromPhoneNumber(phoneNumber: string) {
  if (!phoneNumber.startsWith("+")) {
    return null
  }
  phoneNumber = phoneNumber.slice(1).replace(/\D/g, "")

  const possibles = compact(
    countries.map((c) => {
      if (!phoneNumber.startsWith(c.dialCode)) {
        return null
      }

      if (c.areaCodes) {
        const rest = phoneNumber.slice(c.dialCode.length)
        if (!c.areaCodes.some((code) => rest.startsWith(code))) {
          return null
        }

        return { code: c.iso2, specificity: 100 + c.dialCode.length }
      }

      return { code: c.iso2, specificity: c.dialCode.length }
    })
  )

  const best = possibles.sort((a, b) => a.specificity - b.specificity).pop()

  return best?.code
}
