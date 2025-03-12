import DeviceInfo from "react-native-device-info"
import { version } from "../../../app.json"

export function formatUserAgent(userAgent: string): string {
  return `${userAgent} ${DeviceInfo.getSystemName()}/${DeviceInfo.getSystemVersion()} Artsy-Mobile/${version} Eigen/${DeviceInfo.getBuildNumber()}/${version}`
}
