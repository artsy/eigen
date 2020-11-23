import { isEmpty } from "lodash"

export const validatePresence = (value: any): string => {
  // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
  return isEmpty(value) ? "This field is required" : null
}
