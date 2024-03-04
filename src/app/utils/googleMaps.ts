import { captureMessage } from "@sentry/react-native"
import { stringify } from "query-string"
import Config from "react-native-config"

const API_KEY = Config.GOOGLE_MAPS_API_KEY

export interface SimpleLocation {
  id: string
  name: string
}

export interface LocationWithDetails extends SimpleLocation {
  city?: string
  coordinates?: string[]
  country?: string
  countryCode?: string
  postalCode?: string
  state?: string
  stateCode?: string
}

/** Expected GMaps API prediction shape */
interface QueryAutocompletePrediction {
  place_id: string
  description: string
}

export const getLocationPredictions = async (query: string): Promise<SimpleLocation[]> => {
  const queryString = stringify({
    key: API_KEY,
    language: "en",
    types: "(cities)",
    input: query,
  })

  const url = "https://maps.googleapis.com/maps/api/place/autocomplete/json?" + queryString

  let results
  try {
    const response = await fetch(url)
    results = await response.json()
  } catch (error) {
    if (__DEV__) {
      console.warn(error)
    } else {
      captureMessage(`Error fetching location predictions on: ${url} -> Error: ${error}`)
    }
  }

  return results?.predictions?.map(predictionToResult)
}

const predictionToResult = (prediction: QueryAutocompletePrediction): SimpleLocation => {
  return { id: prediction.place_id, name: prediction.description }
}

export const getLocationDetails = async ({
  id,
  name,
}: SimpleLocation): Promise<LocationWithDetails> => {
  const queryString = stringify({
    key: API_KEY,
    placeid: id,
    language: "en",
  })

  const response = await fetch(
    "https://maps.googleapis.com/maps/api/place/details/json?" + queryString
  )
  const data = await response.json()

  // TODO: Add dedicated error handling to the maps response
  const { address_components, geometry } = data.result as PlaceResult
  const cityPlace = address_components.find((comp) => comp.types.includes("locality"))
  const statePlace = address_components.find((comp) =>
    comp.types.includes("administrative_area_level_1")
  )
  const countryPlace = address_components.find((comp) => comp.types.includes("country"))
  const postalCodePlace = address_components.find((comp) => comp.types.includes("postal_code"))
  const { lat, lng } = geometry.location

  const city = cityPlace && cityPlace.long_name
  const country = countryPlace && countryPlace.long_name
  const countryCode = countryPlace && countryPlace.short_name
  const state = statePlace && statePlace.long_name
  const stateCode = statePlace && statePlace.short_name
  const postalCode = postalCodePlace && postalCodePlace.long_name

  return {
    city,
    coordinates: lat && lng ? [lat, lng] : undefined,
    country,
    countryCode,
    state,
    stateCode,
    postalCode,
    id,
    name,
  }
}

interface GeocoderAddressComponent {
  long_name: string
  short_name: string
  types: PlaceType[]
}

interface PlaceResult {
  address_components: GeocoderAddressComponent[]
  geometry: {
    location: {
      lat: string
      lng: string
    }
  }
}

/**
 * A list of place types supported by the Google Maps Places API.
 *
 * This list is not exhaustive, but does cover all types that can be
 * returned as address components in the response of a Place Details request,
 * which is the usage we are interested in.
 *
 * @see https://developers.google.com/maps/documentation/places/web-service/supported_types
 */
type PlaceType =
  | "administrative_area_level_1"
  | "administrative_area_level_2"
  | "administrative_area_level_3"
  | "administrative_area_level_4"
  | "administrative_area_level_5"
  | "administrative_area_level_6"
  | "administrative_area_level_7"
  | "archipelago"
  | "colloquial_area"
  | "continent"
  | "country"
  | "establishment"
  | "finance"
  | "floor"
  | "food"
  | "general_contractor"
  | "geocode"
  | "health"
  | "intersection"
  | "landmark"
  | "locality"
  | "natural_feature"
  | "neighborhood"
  | "place_of_worship"
  | "plus_code"
  | "point_of_interest"
  | "political"
  | "post_box"
  | "postal_code"
  | "postal_code_prefix"
  | "postal_code_suffix"
  | "postal_town"
  | "premise"
  | "room"
  | "route"
  | "street_address"
  | "street_number"
  | "sublocality"
  | "sublocality_level_1"
  | "sublocality_level_2"
  | "sublocality_level_3"
  | "sublocality_level_4"
  | "sublocality_level_5"
  | "subpremise"
  | "town_square"
