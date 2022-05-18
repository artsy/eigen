import { stringify } from "querystring"
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

  const response = await fetch(
    "https://maps.googleapis.com/maps/api/place/autocomplete/json?" + queryString
  )
  const results = await response.json()
  return results.predictions.map(predictionToResult)
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
  const cityPlace = address_components.find((comp) => comp.types[0] === "locality")
  const statePlace = address_components.find(
    (comp) => comp.types[0] === "administrative_area_level_1"
  )
  const countryPlace = address_components.find((comp) => comp.types[0] === "country")
  const postalCodePlace = address_components.find((comp) => comp.types[0] === "postal_code")
  const { lat, lng } = geometry.location

  const city = cityPlace && cityPlace.long_name
  const country = countryPlace && countryPlace.long_name
  const countryCode = countryPlace && countryPlace.short_name
  const state = statePlace && statePlace.long_name
  const stateCode = statePlace && statePlace.short_name
  const postalCode = postalCodePlace && postalCodePlace.long_name

  return {
    city,
    coordinates: [lat, lng],
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
  types: string[]
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
