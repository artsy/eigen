import NetInfo from "@react-native-community/netinfo"
import { captureMessage } from "@sentry/react-native"
import { throttle } from "lodash"
import { NativeModules } from "react-native"

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
      const metrics = this.queue
      this.queue = []

      if (__DEV__ && !__TEST__) {
        console.log("DATADOG", metrics)
      }

      const volleyURL = URLS[NativeModules.Emission.env]
      if (!volleyURL) {
        return
      }
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
          if (!__DEV__ && e.status >= 400) {
            captureMessage(`Failed to post metrics to volley (status ${e.status})`)
          }
        })
        .catch(() => {
          if (!__DEV__) {
            captureMessage("Failed to post metrics to volley")
          }
        })
    },
    1000,
    {
      leading: false,
      trailing: true,
    }
  )
  constructor(public readonly serviceName: string) {}
  async send(metric: VolleyMetric) {
    this.queue.push({
      ...metric,
      tags: [...(metric.tags ?? []), getDeviceTag(), ...(await getNetworkTags())],
    })
    this._dispatch()
  }
}

function getDeviceTag() {
  const deviceId = NativeModules.Emission.deviceId
  return `device:${deviceId}`
}

async function getNetworkTags() {
  const info = await NetInfo.fetch()
  if (info.type === "cellular") {
    return [`network:${info.type}`, `effective_network:${info.details.cellularGeneration}`]
  } else {
    return [`network:${info.type}`]
  }
}

export const volleyClient = new VolleyClient(NativeModules.Emission.env === "staging" ? "eigen-staging" : "eigen")
