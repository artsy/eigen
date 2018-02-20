import { NativeModules } from "react-native"
const Emission = NativeModules.Emission || {}

import { metaphysicsURL } from "./relay/config"
import { NetworkError } from "./utils/errors"

export function metaphysics<T>(
  payload: { query: string; variables?: object },
  checkStatus: boolean = true
): Promise<T> {
  return fetch(metaphysicsURL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "User-Agent": "Emission",
      "X-USER-ID": Emission.userID,
      "X-ACCESS-TOKEN": Emission.authenticationToken,
    },
    body: JSON.stringify(payload),
  })
    .then(response => {
      if (!checkStatus || (response.status >= 200 && response.status < 300)) {
        return response
      } else {
        const error = new NetworkError(response.statusText)
        error.response = response
        throw error
      }
    })
    .then<T & { errors: any[] }>(response => response.json())
    .then(json => {
      if (json.errors) {
        json.errors.forEach(console.error)
        // Throw here so that our error view gets shown.
        // See https://github.com/facebook/relay/issues/1913
        throw new Error("Server-side error occurred")
      }
      return json
    })
}

export default function query<T>(url: string): Promise<T> {
  return metaphysics<{ data: T }>({ query: url }).then(({ data }) => data)
}
