import Config from "react-native-config"
import { TrackingProvider } from "./providers"

export const ConsoleTrackingProvider: TrackingProvider = {
  identify: (userId, traits) => {
    if (!__DEV__) {
      return
    }
    if (Config.ACTION_LOGGERS_ACTIVE === "TRUE") {
      console.log("[Event tracked]", JSON.stringify({ userId, ...traits }, null, 2))
    }
  },

  postEvent: (info) => {
    if (!__DEV__) {
      return
    }

    console.log("[Event tracked]", JSON.stringify(info, null, 2))
  },
}
