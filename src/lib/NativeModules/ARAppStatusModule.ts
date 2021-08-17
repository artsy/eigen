import { LegacyNativeModules } from "lib/NativeModules/LegacyNativeModules"

export const isBetaOrDev = async () => {
  const isBeta = await LegacyNativeModules.ARAppStatusModule.isBeta()
  return isBeta || __DEV__
}
