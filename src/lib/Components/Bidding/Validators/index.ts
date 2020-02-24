import { isEmpty } from "lodash"

export const validatePresence = (value: any): string => {
  return isEmpty(value) ? "This field is required" : null
}
