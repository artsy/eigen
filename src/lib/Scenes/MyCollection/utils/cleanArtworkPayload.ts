import { isNil } from "lodash"
import { ArtworkFormValues } from "../State/MyCollectionArtworkModel"

export function cleanArtworkPayload(payload = {}): any {
  const cleanPayload = Object.entries(payload).reduce((acc, [key, value]) => {
    if (value !== "" && !isNil(value)) {
      return { ...acc, [key]: value }
    }
    return acc
  }, {})
  return cleanPayload
}

export function explicitlyClearedFields(
  payload: Partial<ArtworkFormValues> = {},
  previousPayload: ArtworkFormValues
): any {
  const cleanPayload = cleanArtworkPayload(payload)
  const cleanPreviousPayload = cleanArtworkPayload(previousPayload)

  const diffPayload: { [k: string]: any } = {}
  for (const key in cleanPreviousPayload) {
    if (!cleanPayload.hasOwnProperty(key)) {
      diffPayload[key] = null
    }
  }

  // These are provided in update mutation separately so should be ignored here
  delete diffPayload.photos
  delete diffPayload.artistSearchResult
  delete diffPayload.pricePaidDollars
  delete diffPayload.pricePaidCurrency

  const payloadUnion = {
    ...cleanPayload,
    ...diffPayload,
  }
  return payloadUnion
}
