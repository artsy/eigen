import { action, createTypedHooks, StoreProvider } from "easy-peasy"
import { createStore } from "easy-peasy"
import React from "react"
import { NativeModules } from "react-native"
import { Action, Middleware } from "redux"
import { AppStoreModel, appStoreModel, AppStoreState } from "./AppStoreModel"
import { EmissionOptions } from "./NativeModel"
import { assignDeep, persistenceMiddleware, unpersist } from "./persistence"

function createAppStore() {
  const middleware: Middleware[] = []

  if (!__TEST__) {
    middleware.push(persistenceMiddleware)
  }

  // At dev time but not test time, let's log out each action that is dispatched
  if (__DEV__ && !__TEST__) {
    middleware.push(_api => next => _action => {
      console.log(_action)
      next(_action)
    })
  }

  // At test time let's keep a log of all dispatched actions so that tests can make assertions based on what
  // has been dispatched
  if (__TEST__ && __appStoreTestUtils__) {
    __appStoreTestUtils__.dispatchedActions = []
    middleware.push(_api => next => _action => {
      __appStoreTestUtils__.dispatchedActions.push(_action)
      next(_action)
    })
  }

  if (__TEST__) {
    ;(appStoreModel as any).__injectState = action((state, injectedState) => {
      assignDeep(state, injectedState)
    })
  }

  const store = createStore<AppStoreModel>(appStoreModel, {
    middleware,
  })

  if (!__TEST__) {
    unpersist().then(state => {
      store.getActions().rehydrate(state)
    })
  }

  return store
}

// tslint:disable-next-line:variable-name
export const __appStoreTestUtils__ = __TEST__
  ? {
      // this can be used to mock the initial state before mounting a test renderer
      // e.g. `__appStoreTestUtils__.injectState({ nativeState: { selectedTab: "sell" } })`
      // takes effect until the next test starts
      injectState(state: DeepPartial<AppStoreState>) {
        ;(AppStore.actions as any).__injectState(state)
      },
      injectEmissionOptions(options: Partial<EmissionOptions>) {
        this.injectState({ native: { sessionState: { options } } })
      },
      getCurrentState: () => appStoreInstance.getState(),
      dispatchedActions: [] as Action[],
      getLastAction() {
        return this.dispatchedActions[this.dispatchedActions.length - 1]
      },
      reset: () => {
        appStoreInstance = createAppStore()
      },
    }
  : null

if (__TEST__) {
  beforeEach(() => {
    __appStoreTestUtils__?.reset()
  })
}

const hooks = createTypedHooks<AppStoreModel>()

export const AppStore = {
  useAppState: hooks.useStoreState,
  get actions() {
    return appStoreInstance.getActions()
  },
}

export const AppStoreProvider: React.FC<{}> = ({ children }) => {
  return <StoreProvider store={appStoreInstance}>{children}</StoreProvider>
}

export function useSelectedTab() {
  return hooks.useStoreState(state => state.native.sessionState.selectedTab)
}

let appStoreInstance = createAppStore()

export function useEmissionOption(key: keyof EmissionOptions) {
  return AppStore.useAppState(state => state.native.sessionState.options[key])
}

export function getCurrentEmissionState() {
  // on initial load appStoreInstance might be undefined
  return appStoreInstance?.getState().native.sessionState ?? NativeModules.ARNotificationsManager.nativeState
}

export function useIsStaging() {
  return AppStore.useAppState(state => state.native.sessionState.env === "staging")
}
