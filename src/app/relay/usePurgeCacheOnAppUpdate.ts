import AsyncStorage from "@react-native-async-storage/async-storage"
import { RelayCache } from "app/relay/RelayCache"
import { useEffect } from "react"
import { getVersion } from "react-native-device-info"

const APP_CURRENT_VERSION_KEY = "EIGEN_APP_CURRENT_VERSION_KEY"

/** Clears the relay cache when a user runs their app for the first time after updating the app */
export const usePurgeCacheOnAppUpdate = () => {
  useEffect(() => {
    const currentVersion = getVersion()
    AsyncStorage.getItem(APP_CURRENT_VERSION_KEY).then((value) => {
      if (value !== currentVersion) {
        RelayCache.clearAll()
        AsyncStorage.setItem(APP_CURRENT_VERSION_KEY, currentVersion)
      }
    })
  }, [])
}
