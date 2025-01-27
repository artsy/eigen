import { useIsStaging } from "app/utils/hooks/useIsStaging"
import { useEffect } from "react"
import Keys from "react-native-keys"
import SiftReactNative from "sift-react-native"

export function useSiftConfig() {
  const isStaging = useIsStaging()

  const accountId =
    __DEV__ || isStaging
      ? Keys.secureFor("SIFT_STAGING_ACCOUNT_ID")
      : Keys.secureFor("SIFT_PRODUCTION_ACCOUNT_ID")
  const beaconKey =
    __DEV__ || isStaging
      ? Keys.secureFor("SIFT_STAGING_BEACON_KEY")
      : Keys.secureFor("SIFT_PRODUCTION_BEACON_KEY")

  useEffect(() => {
    if (!!accountId && !!beaconKey) {
      SiftReactNative.setSiftConfig(accountId, beaconKey, true, "")
    }
  }, [accountId, beaconKey])
}
