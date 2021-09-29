import { Address } from "../types"

// finds out the empty address fields in passed Address type and returns missing values' keys
export const validateAddressFieldsPresence = (address: Address): string[] => {
  const errs = []

  for (const field of Object.entries(address)) {
    if (field[0] === "addressLine2") {
      continue
    }

    if (field[0] === "country" && (!field[1].longName || !field[1].shortName)) {
      errs.push(field[0])
      continue
    }

    if (!field[1]) {
      errs.push(field[0])
    }
  }

  return errs
}
