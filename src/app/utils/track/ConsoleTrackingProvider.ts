import { logEventTracked } from "app/utils/loggers"
import { TrackingProvider } from "./providers"

export const ConsoleTrackingProvider: TrackingProvider = {
  identify: (userId, traits) => {
    if (!__DEV__) {
      return
    }
    if (logEventTracked) {
      console.log("[Event tracked]", JSON.stringify({ userId, ...traits }, null, 2))
    }
  },

  postEvent: (info) => {
    if (!__DEV__) {
      return
    }
    if (logEventTracked) {
      console.log("[Event tracked]", JSON.stringify(info, null, 2))
    }
  },
}
