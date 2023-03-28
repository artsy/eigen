import DeviceInfo from "react-native-device-info"

export const mockSyncFunctionsWhenDebugging = () => {
  // @ts-ignore - No atob in RN; only relevant when launching browser
  const isRemotelyDebugging = !__TEST__ && typeof atob !== "undefined"

  if (isRemotelyDebugging) {
    console.log("[dev]: In debug mode, mocking sync functions")

    Object.entries(reactNativeDeviceInfo).forEach(([key, value]) => {
      ;(DeviceInfo as any)[key] = value
    })
  }
}

/**
 * This is a workaround for the fact that react-native-device-info uses syncronous methods, which
 * breaks the ability to remotely debug JS in Chrome.
 * See: https://github.com/react-native-device-info/react-native-device-info/issues/776
 */
const reactNativeDeviceInfo = {
  getApplicationName: () => null,
  getBrand: () => null,
  getBuildNumber: () => null,
  getBundleId: () => null,
  getDeviceId: () => null,
  getDeviceType: () => null,
  getManufacturer: () => new Promise((resolve) => resolve("")),
  getManufacturerSync: () => null,
  getModel: () => null,
  getPowerState: () => new Promise((resolve) => resolve(false as any)),
  getPowerStateSync: () => null,
  getReadableVersion: () => null,
  getSystemName: () => null,
  getSystemVersion: () => null,
  getUniqueId: () => new Promise((resolve) => resolve("")),
  getUniqueIdSync: () => null,
  getVersion: () => null,
  hasNotch: () => null,
  hasDynamicIsland: () => null,
  hasSystemFeature: (_feature: string) => new Promise((resolve) => resolve(false)),
  hasSystemFeatureSync: (_feature: string) => null,
  isLandscape: () => new Promise((resolve) => resolve(false)),
  isLandscapeSync: () => null,
  isTablet: () => null,
  supported32BitAbis: () => new Promise((resolve) => resolve([])),
  supported32BitAbisSync: () => [],
  supported64BitAbis: () => new Promise((resolve) => resolve([])),
  supported64BitAbisSync: () => [],
  supportedAbis: () => new Promise((resolve) => resolve([])),
  supportedAbisSync: () => [],
  useBatteryLevel: () => null,
  useBatteryLevelIsLow: () => null,
  useDeviceName: () => null,
  useFirstInstallTime: () => null,
  useHasSystemFeature: (_feature: string) => null,
  useIsEmulator: () => null,
  usePowerState: () => null,
  useManufacturer: () => null,
  useIsHeadphonesConnected: () => null,
  useBrightness: () => null,
}
