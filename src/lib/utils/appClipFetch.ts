import { stringify } from "querystring"
import Config from "react-native-config"

let xAppToken: string | null =
  "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI1ZWQ3OTE4MGQxYmNhODAwMGU5ZWZkOWEiLCJzYWx0X2hhc2giOiJkZTY1MGYwOWE0ZjJhMjY1NGZmNzU3MTIyYjk4ZjAxOSIsInJvbGVzIjoidXNlcix0ZWFtLGFkbWluIiwicGFydG5lcl9pZHMiOltdLCJvdHAiOnRydWUsImV4cCI6MTY0NDc2MTA2NiwiaWF0IjoxNjM5NTc3MDY2LCJhdWQiOiI1ZDQwOTk2ZTZlNjA0OTAwMDc0OTBmYTIiLCJpc3MiOiJHcmF2aXR5IiwianRpIjoiNjFiOWY1ZWFhNGE1ZWMwMDBlNzhhMTFlIn0.iE0Hvhx3agG5yhqakBbXJyjlwN_NXn7TFRRH97PR7TE"
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
    // client_id: "c5f39180f7ef61c906da",
    // client_secret: "d2887833bb41adab291314f4c9bd9f12",
  })}`
  console.log(tokenURL)
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
