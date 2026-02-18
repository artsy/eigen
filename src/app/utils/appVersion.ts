import DeviceInfo from 'react-native-device-info'
import { appJson } from './jsonFiles'

/**
 * Get the current app version.
 * Tries DeviceInfo.getVersion() first (works on real devices),
 * falls back to app.json version (works in simulators/development).
 */
export const getAppVersion = (): string => {
  const deviceVersion = DeviceInfo.getVersion()
  return deviceVersion || appJson().version
}

/**
 * Get the current build number from the native app bundle.
 */
export const getBuildNumber = (): string => {
  return DeviceInfo.getBuildNumber()
}