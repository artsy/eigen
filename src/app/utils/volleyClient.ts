import NetInfo from "@react-native-community/netinfo"
import { unsafe__getEnvironment } from "app/store/GlobalStore"
import { throttle } from "lodash"
import { Platform } from "react-native"
import DeviceInfo from "react-native-device-info"
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
  private _dispatch = throttle(
    async () => {
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
          serviceName: "eigen",
          metrics,
        }),
      }).catch(() => {
        console.log("volleyClient.ts", "Failed to post metrics to volley")
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
    this._dispatch()?.catch(() => {
      console.log("volleyClient.ts", "Failed to dispatch metrics to volley")
    })
  }
}

function getDeviceTag() {
  const deviceId = `${Platform.OS} ${DeviceInfo.getModel()}`
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
