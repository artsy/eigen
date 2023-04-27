import { GlobalStore } from "app/store/GlobalStore"
import { useStoreRehydrated } from "easy-peasy"
import { useEffect, useState } from "react"

export const useSystemIsDoneBooting = () => {
  const isHydrated = GlobalStore.useAppState((state) => state.sessionState.isHydrated)
  const isStoreRehydrated = useStoreRehydrated() // from easy-peasy persistence
  const [isDoneBooting, setIsDoneBooting] = useState(__TEST__ ? true : false)

  useEffect(() => {
    if (isStoreRehydrated && isHydrated) {
      console.log("[system]: Booted.")

      setIsDoneBooting(true)
    }
  }, [isStoreRehydrated, setIsDoneBooting])

  return isDoneBooting
}
