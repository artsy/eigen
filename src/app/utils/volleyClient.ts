import NetInfo from "@react-native-community/netinfo"
import { getCurrentEmissionState, unsafe__getEnvironment } from "app/store/GlobalStore"
import { throttle } from "lodash"
import { logDatadog } from "./loggers"

const URLS = {
  production: "https://volley.artsy.net/report",
  staging: "https://volley-staging.artsy.net/report",
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
  get serviceName() {
    return unsafe__getEnvironment().env === "staging" ? "eigen-staging" : "eigen"
  }
  private _dispatch = throttle(
    () => {
      const metrics = this.queue
      this.queue = []

      if (__DEV__ && !__TEST__ && logDatadog) {
        console.log("DATADOG", metrics)
      }

      const volleyURL = URLS[unsafe__getEnvironment().env]
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
      }).catch(() => {
        console.error("volleyClient.ts", "Failed to post metrics to volley")
      })
    },
    1000,
    {
      leading: false,
      trailing: true,
    }
  )
  async send(metric: VolleyMetric) {
    this.queue.push({
      ...metric,
      tags: [...(metric.tags ?? []), getDeviceTag(), ...(await getNetworkTags())],
    })
    this._dispatch()
  }
}

function getDeviceTag() {
  const deviceId = getCurrentEmissionState().deviceId
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

export const volleyClient = new VolleyClient()
