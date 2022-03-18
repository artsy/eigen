import AsyncStorage from "@react-native-async-storage/async-storage"
import { useEffect } from "react"
import RNAsyncStorageFlipper from "rn-async-storage-flipper"

export function useDebugging() {
  useEffect(() => {
    RNAsyncStorageFlipper(AsyncStorage)
  }, [])
}
