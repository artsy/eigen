import MapboxGL from "@rnmapbox/maps"
import Keys from "react-native-keys"

export const ArtsyMapStyleURL = "mapbox://styles/artsyit/cjrb59mjb2tsq2tqxl17pfoak"

let isConfigured = false

/** Safe to call from any map module; the token is only set once. */
export const configureMapbox = () => {
  if (isConfigured) return

  MapboxGL.setAccessToken(Keys.secureFor("MAPBOX_API_CLIENT_KEY"))
  isConfigured = true
}
