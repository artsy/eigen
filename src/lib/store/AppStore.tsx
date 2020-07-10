import { createTypedHooks, StoreProvider } from "easy-peasy"
import React, { useRef } from "react"
import { AppStoreModel } from "./AppStoreModel"
import { listenOnEigenNativeBridge } from "./AppStoreNativeBridge"
import { createAppStore } from "./createAppStore"

const hooks = createTypedHooks<AppStoreModel>()

let appStoreInstance = createAppStore()

export const AppStore = {
  useAppState(mapper: Parameters<typeof hooks.useStoreState>[0]) {
    return hooks.useStoreState(mapper)
  },
  get actions() {
    return appStoreInstance.getActions()
  },
}

export const AppStoreProvider: React.FC<{}> = ({ children }) => {
  if (__TEST__) {
    // generate a new app store for each unique AppStoreProvider at test time
    appStoreInstance = useRef(createAppStore()).current
  }
  return <StoreProvider store={appStoreInstance}>{children}</StoreProvider>
}

listenOnEigenNativeBridge(event => {
  switch (event.type) {
    case "STATE_CHANGED":
      AppStore.actions.nativeState.changed(event.payload)
      return
    case "NOTIFICATION_RECEIVED":
      return
  }
})

export function useSelectedTab() {
  return hooks.useStoreState(state => state.nativeState.selectedTab)
}
