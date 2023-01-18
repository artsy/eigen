import { DeviceInfoModule } from "react-native-device-info/lib/typescript/internal/privateTypes"

export const SystemDeviceInfo: DeviceInfoModule = (() => {
  // @ts-ignore
  const isRemotelyDebugging = !__TEST__ && typeof atob !== "undefined"

  if (!isRemotelyDebugging) {
    const deviceInfo = require("react-native-device-info")
    return deviceInfo

    // This is a workaround for the fact that react-native-device-info uses syncronous methods, which
    // breaks the ability to remotely debug JS in Chrome.
    // See: https://github.com/react-native-device-info/react-native-device-info/issues/776
  } else {
    return {
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
  }
})()
