import { stringify } from "querystring"
import Config from "react-native-config"

const API_KEY = Config.GOOGLE_MAPS_API_KEY

export interface SimpleLocationAutocomplete {
  id: string
  name: string
}

/** Expected GMaps API prediction shape */
interface LocationResult {
  place_id: string
  description: string
}

export const autocompleteLocation = async (query: string): Promise<SimpleLocationAutocomplete[]> => {
  const queryString = stringify({
    key: API_KEY,
    language: "en",
    types: "(cities)",
    input: query,
  })

  const response = await fetch("https://maps.googleapis.com/maps/api/place/autocomplete/json?" + queryString)
  const results = await response.json()
  return results.predictions.map(predictionToResult)
}

const predictionToResult = (prediction: LocationResult): SimpleLocationAutocomplete => {
  return { id: prediction.place_id, name: prediction.description }
}

export interface LocationDetails extends SimpleLocationAutocomplete {
  city: string
  coordinates?: string[]
  country: string
  postalCode: string
  state: string
  stateCode: string
}

export const getLocationDetails = async ({ id, name }: SimpleLocationAutocomplete): Promise<LocationDetails> => {
  const queryString = stringify({
    key: API_KEY,
    placeid: id,
  })

  const response = await fetch("https://maps.googleapis.com/maps/api/place/details/json?" + queryString)
  const results = await response.json()

  // TODO: Add dedicated error handling to the maps response
  const { address_components, geometry } = results.result
  // @ts-ignore STRICTNESS_MIGRATION
  const cityPlace = address_components.find((comp) => comp.types[0] === "locality")
  // @ts-ignore STRICTNESS_MIGRATION
  const statePlace = address_components.find((comp) => comp.types[0] === "administrative_area_level_1")
  // @ts-ignore STRICTNESS_MIGRATION
  const countryPlace = address_components.find((comp) => comp.types[0] === "country")
  const postalCodePlace = address_components.find((comp) => comp.types[0] === "postal_code")
  const { lat, lng } = geometry.location

  const city = cityPlace && cityPlace.long_name
  const country = countryPlace && countryPlace.long_name
  const state = statePlace && statePlace.long_name
  const stateCode = statePlace && statePlace.short_name
  const postalCode = postalCodePlace && postalCodePlace.long_name

  return {
    city,
    coordinates: [lat, lng],
    country,
    state,
    stateCode,
    postalCode,
    id,
    name,
  }
}
