import { throttle } from "lodash"
import { NativeModules } from "react-native"
import { Sentry } from "react-native-sentry"

const URLS = {
  production: "https://volley.artsy.net/report",
  staging: "https://volley-staging.artsy.net/report",
  test: "fake-volley-url",
}

type Tags = string[]

export type VolleyMetric =
  | {
      type: "timing"
      name: string
      timing: number
      sampleRate?: number
      tags?: Tags
    }
  | {
      type: "increment"
      name: string
      sampleRate?: number
      tags?: Tags
    }
  | {
      type: "incrementBy"
      name: string
      value: number
      tags?: Tags
    }
  | {
      type: "decrement"
      name: string
      sampleRate?: number
      tags?: Tags
    }
  | {
      type: "decrementBy"
      name: string
      value: number
      tags?: Tags
    }
  | {
      type: "gauge"
      name: string
      sampleRate?: number
      value: number
      tags?: Tags
    }
  | {
      type: "histogram"
      name: string
      sampleRate?: number
      value: number
      tags?: Tags
    }
  | {
      type: "set"
      name: string
      sampleRate?: number
      value: number
      tags?: Tags
    }

class VolleyClient {
  queue: VolleyMetric[] = []
  private _dispatch = throttle(
    () => {
      const volleyURL = URLS[NativeModules.Emission.env]
      if (!volleyURL) {
        return
      }
      const metrics = this.queue
      this.queue = []
      fetch(volleyURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          serviceName: this.serviceName,
          metrics,
        }),
      })
        .then(e => {
          if (e.status >= 400) {
            throw e
          }
        })
        .catch(e => {
          console.error("Failed to post metrics to volley")
          console.error(e)
          Sentry.captureMessage(e.stack)
        })
    },
    1000,
    {
      leading: false,
      trailing: true,
    }
  )
  constructor(public readonly serviceName: string) {}
  send(metric: VolleyMetric) {
    this.queue.push(metric)
    this._dispatch()
  }
}

export const volleyClient = new VolleyClient(NativeModules.Emission.env === "staging" ? "eigen-staging" : "eigen")
