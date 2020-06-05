import { useEffect, useState } from "react"
import { NativeModules } from "react-native"

const { ARTopMenuModule } = NativeModules

export enum TabName {
  ARHomeTab = "ARHomeTab",
  ARSearchTab = "ARSearchTab",
  ARMessagingTab = "ARMessagingTab",
  ARLocalDiscoveryTab = "ARLocalDiscoveryTab",
  ARFavoritesTab = "ARFavoritesTab",
  ARSalesTab = "ARSalesTab",
  Unknown = "Unknown",
}

export function useSelectedTabName() {
  const [selectedTabName, setSelectedTabName] = useState(TabName.Unknown)

  useEffect(() => {
    async function runEffect() {
      const tabName = await ARTopMenuModule.getSelectedTabName()
      setSelectedTabName(tabName)
    }
    runEffect()
  }, [])

  return selectedTabName
}
