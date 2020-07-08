import { BottomTabType } from "lib/Scenes/BottomTabs/BottomTabType"
import React, { createContext, useCallback, useContext, useEffect, useState } from "react"
import { NativeEventEmitter, NativeModules } from "react-native"

export const changes = new NativeEventEmitter(NativeModules.ARSelectedTab)

let globalSelectedTab: BottomTabType = NativeModules.ARSelectedTab.name

changes.addListener("selectedTabChanged", nextTab => {
  globalSelectedTab = nextTab
})

export const SelectedTabContext = createContext(globalSelectedTab)

export const ProvideSelectedTab: React.FC = ({ children }) => {
  const [selectedTab, setSelectedTab] = useState(globalSelectedTab)

  const onChange = useCallback(
    (nextTab: BottomTabType) => {
      setSelectedTab(nextTab)
    },
    [selectedTab]
  )

  useEffect(() => {
    changes.addListener("selectedTabChanged", onChange)
    return () => {
      changes.removeListener("selectedTabChanged", onChange)
    }
  }, [onChange])

  return <SelectedTabContext.Provider value={selectedTab}>{children}</SelectedTabContext.Provider>
}

export function useSelectedTab() {
  return useContext(SelectedTabContext)
}
