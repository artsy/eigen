import { Platform, PlatformIOSStatic } from "react-native"

export const isPad = () => {
  const IOSPlatform = Platform as PlatformIOSStatic
  return IOSPlatform.isPad
}

export const truncatedTextLimit = () => (isPad() ? 320 : 140)
