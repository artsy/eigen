import { Platform, PlatformIOSStatic } from "react-native"

export const isPad = () => {
  const IOSPlatform = Platform as PlatformIOSStatic
  return IOSPlatform.isPad
}

export const osMajorVersion = () => {
  if (typeof (Platform.Version === "string")) {
    return parseInt(Platform.Version as string, 10)
  } else {
    return Platform.Version as number
  }
}

export const truncatedTextLimit = () => (isPad() ? 320 : 140)
