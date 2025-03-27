import AsyncStorage from "@react-native-async-storage/async-storage"
import AppInfo from "app/system/AppInfo"
import { _globalCacheRef } from "app/system/relay/defaultEnvironment"
import { useEffect } from "react"

const APP_CURRENT_VERSION_KEY = "EIGEN_APP_CURRENT_VERSION_KEY"

/** Clears the relay cache when a user runs their app for the first time after updating the app */
export const usePurgeCacheOnAppUpdate = () => {
  useEffect(() => {
    const currentVersion = AppInfo.getVersion()
    AsyncStorage.getItem(APP_CURRENT_VERSION_KEY).then((value) => {
      if (value !== currentVersion) {
        let version = currentVersion

        // In dev, with the debugger open, DeviceInfo is mocked out and returns undefined
        if (__DEV__ && !version) {
          version = value as string
        }

        _globalCacheRef?.clear()
        AsyncStorage.setItem(APP_CURRENT_VERSION_KEY, version)
      }
    })
  }, [])
}
