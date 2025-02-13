import { Echo } from "app/store/config/EchoModel"
import appJsonFile from "../../../app.json"
import echoLaunchJsonFile from "../../../ios/Artsy/App/EchoNew.json"

type AppConfig = {
  appName: string
  name: string
  displayName: string
  version: string
  isAndroidBeta: boolean
  nativeCodeVersion: Record<string, string>
  codePushReleaseName: string
  codePushDist: string
}

export const appJson = () => appJsonFile as AppConfig
export const echoLaunchJson = (): Echo => echoLaunchJsonFile
