import { NativeModules } from "react-native"
const Emission = NativeModules.Emission || {}

import { metaphysicsURL } from "./relay/config"
import { NetworkError } from "./system/errors"

export function metaphysics<T>(
  payload: { query: string; variables?: object },
  checkStatus: boolean = true
): Promise<T> {
  return fetch(metaphysicsURL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
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
    .then<T>(response => response.json())
}

export default function query<T>(query: string): Promise<T> {
  return metaphysics<{ data: T }>({ query }).then(({ data }) => data)
}
