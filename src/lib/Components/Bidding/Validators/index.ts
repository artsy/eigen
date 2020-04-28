import { isEmpty } from "lodash"

export const validatePresence = (value: any): string => {
  // @ts-ignore STRICTNESS_MIGRATION
  return isEmpty(value) ? "This field is required" : null
}
