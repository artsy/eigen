import Config from "react-native-config"

export interface ConfigModel {
  sessionState: {
    gravityBaseURL: string
    gravitySecret: string
    gravityKey: string
  }
}
export const ConfigModel = {
  sessionState: {
    gravityBaseURL: "https://stagingapi.artsy.net",
    gravityKey: Config.ARTSY_API_CLIENT_KEY,
    gravitySecret: Config.ARTSY_API_CLIENT_SECRET,
  },
}
