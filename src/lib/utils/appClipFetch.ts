import { stringify } from "querystring"
import Config from "react-native-config"

let xAppToken: string | null
const gravityBaseURL = "https://api.artsy.net"

const getXAppToken = async () => {
  // const xAppToken = context.getState().xAppToken
  if (xAppToken) {
    // TODO: handle expiry
    return Promise.resolve(xAppToken)
  }
  // TODO: get from context
  const tokenURL = `${gravityBaseURL}/api/v1/xapp_token?${stringify({
    // TODO; get from Config
    client_id: Config.ARTSY_API_CLIENT_KEY,
    client_secret: Config.ARTSY_API_CLIENT_SECRET,
  })}`
  const result = await fetch(tokenURL, {
    // headers: {
    //   "User-Agent": getCurrentEmissionState().userAgent,
    // },
  })
  // TODO: check status
  const json = (await result.json()) as {
    xapp_token: string
    expires_in: string
  }
  if (json.xapp_token) {
    xAppToken = json.xapp_token
    return json.xapp_token
  }
  throw new Error("Unable to get x-app-token from " + tokenURL)
}

const doFetch = async (endpoint: string) => {
  const token = await getXAppToken()
  const headers = {
    "X-Xapp-Token": token,
  }
  const res = await fetch(endpoint, { headers })
  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}`)
  }
  const json = await res.json()
  return json
}

export const getArtwork = async (slug: string) => {
  return await doFetch(`https://api.artsy.net/api/v1/artwork/${slug}`)
}
