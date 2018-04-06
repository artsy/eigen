import { NativeModules } from "react-native"
const Emission = NativeModules.Emission || {}

import { metaphysicsURL } from "./relay/config"
import { NetworkError } from "./utils/errors"

type Payload = { query: string; variables?: object } | { documentID: string; variables?: object }

export function request(payload: Payload, checkStatus: boolean = true): Promise<Response> {
  return fetch(metaphysicsURL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "User-Agent": Emission.userAgent,
      "X-USER-ID": Emission.userID,
      "X-ACCESS-TOKEN": Emission.authenticationToken,
    },
    body: JSON.stringify(payload),
  }).then(response => {
    if (!checkStatus || (response.status >= 200 && response.status < 300)) {
      return response
    } else {
      const error = new NetworkError(response.statusText)
      error.response = response
      throw error
    }
  })
}

export function metaphysics<T>(payload: Payload, checkStatus: boolean = true): Promise<T> {
  return (
    request(payload, checkStatus)
      .then<T & { errors: any[] }>(response => response.json())
      // TODO: This is here because existing callers may rely on this, but it’s now duplicated here and in fetchQuery.ts
      .then(json => {
        if (json.errors) {
          json.errors.forEach(console.error)
          // Throw here so that our error view gets shown.
          // See https://github.com/facebook/relay/issues/1913
          throw new Error("Server-side error occurred")
        }
        return json
      })
  )
}

export default function query<T>(url: string): Promise<T> {
  return metaphysics<{ data: T }>({ query: url }).then(({ data }) => data)
}
