import { isEqual } from "lodash"
import React, { createContext, useCallback, useContext, useEffect, useState } from "react"
import { NativeEventEmitter, NativeModules } from "react-native"

interface SelectedTab {
  name: string
}

const changes = new NativeEventEmitter(NativeModules.ARSelectedTab)

let initialTab: SelectedTab = {
  name: NativeModules.ARSelectedTab.name,
}

changes.addListener("selectedTabChanged", nextTab => {
  initialTab = {
    name: nextTab.name,
  }
})

export const SelectedTabContext = createContext(initialTab)

export const ProvideSelectedTab: React.FC = ({ children }) => {
  const [selectedTab, setSelectedTab] = useState(initialTab)

  const onChange = useCallback(
    (nextTab: { name: string }) => {
      if (!isEqual(selectedTab, nextTab)) {
        setSelectedTab(nextTab)
      }
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
