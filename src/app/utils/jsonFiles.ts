import { Echo } from "app/store/config/EchoModel"
import appJsonFile from "../../../app.json"
import echoLaunchJsonFile from "../../../ios/Artsy/App/EchoNew.json"

type AppConfig = {
  appName: string
  version: string
  isAndroidBeta: boolean
}

export const appJson = () => appJsonFile as AppConfig
export const echoLaunchJson = (): Echo => echoLaunchJsonFile
