import { isNil } from "lodash"

export function cleanArtworkPayload(payload = {}): any {
  const cleanPayload = Object.entries(payload).reduce((acc, [key, value]) => {
    if (value !== "" && !isNil(value)) {
      return { ...acc, [key]: value }
    }
    return acc
  }, {})
  return cleanPayload
}
