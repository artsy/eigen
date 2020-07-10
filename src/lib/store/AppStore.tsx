import { createTypedHooks, StoreProvider } from "easy-peasy"
import React, { useRef } from "react"
import { AppStoreModel, AppStoreState } from "./AppStoreModel"
import { createAppStore } from "./createAppStore"

const hooks = createTypedHooks<AppStoreModel>()

let appStoreInstance = createAppStore()

export const AppStore = {
  useAppState<R>(mapper: (state: AppStoreState) => R): R {
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

export function useSelectedTab() {
  return hooks.useStoreState(state => state.native.selectedTab)
}
