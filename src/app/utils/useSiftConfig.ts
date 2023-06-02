import { useIsStaging } from "app/utils/hooks/useIsStaging"
import { useEffect } from "react"
import Config from "react-native-config"
import SiftReactNative from "sift-react-native"

export function useSiftConfig() {
  const isStaging = useIsStaging()

  const accountId =
    __DEV__ || isStaging ? Config.SIFT_STAGING_ACCOUNT_ID : Config.SIFT_PRODUCTION_ACCOUNT_ID
  const beaconKey =
    __DEV__ || isStaging ? Config.SIFT_STAGING_BEACON_KEY : Config.SIFT_PRODUCTION_BEACON_KEY

  useEffect(() => {
    if (!!accountId && !!beaconKey) {
      SiftReactNative.setSiftConfig(accountId, beaconKey, true, "")
    }
  }, [accountId, beaconKey])
}
