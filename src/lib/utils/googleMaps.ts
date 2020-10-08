import { stringify } from "querystring"
import Config from "react-native-config"

export interface GMapsLocation {
  id: string
  name: string
}

/** Expected GMaps API prediction shape */
interface LocationResult {
  place_id: string
  description: string
}

export const queryLocation = async (query: string): Promise<GMapsLocation[]> => {
  const apiKey = Config.GOOGLE_MAPS_API_KEY
  const queryString = stringify({
    key: apiKey,
    language: "en",
    types: "(cities)",
    input: query,
  })

  const response = await fetch("https://maps.googleapis.com/maps/api/place/autocomplete/json?" + queryString)
  const results = await response.json()
  return results.predictions.map(predictionToResult)
}

const predictionToResult = (prediction: LocationResult): GMapsLocation => {
  return { id: prediction.place_id, name: prediction.description }
}
