import { createTypedHooks, StoreProvider } from "easy-peasy"
import { createStore } from "easy-peasy"
import { defaultsDeep } from "lodash"
import React from "react"
import { NativeModules } from "react-native"
import { Action, Middleware } from "redux"
import { AppStoreModel, appStoreModel, AppStoreState } from "./AppStoreModel"
import { EmissionOptions } from "./NativeModel"
import { persistenceMiddleware, unpersist } from "./persistence"

function createAppStore() {
  const middleware: Middleware[] = []

  if (!__TEST__) {
    middleware.push(persistenceMiddleware)
  }

  // At dev time but not test time, let's log out each action that is dispatched
  if (__DEV__ && !__TEST__) {
    middleware.push(_api => next => action => {
      console.log(action)
      next(action)
    })
  }

  // At test time let's keep a log of all dispatched actions so that tests can make assertions based on what
  // has been dispatched
  if (__TEST__ && __appStoreTestUtils__) {
    __appStoreTestUtils__.dispatchedActions = []
    middleware.push(_api => next => action => {
      __appStoreTestUtils__.dispatchedActions.push(action)
      next(action)
    })
  }

  // at test time let's allow individual tests to deep-merge an initial state before mounting
  const mergedModel: AppStoreModel = __TEST__
    ? defaultsDeep((__appStoreTestUtils__ && __appStoreTestUtils__.initialStateProvider()) ?? {}, appStoreModel)
    : appStoreModel

  const store = createStore<AppStoreModel>(mergedModel, {
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
      // e.g. `__appStoreTestUtils__.injectInitialState({ nativeState: { selectedTab: "sell" } })`
      // takes effect either the next time you call reset() or the next time a new AppStoreProvider mounts
      injectInitialStateOnce(state: DeepPartial<AppStoreState>) {
        this.initialStateProvider.mockReturnValueOnce(state)
      },
      injectEmissionOptionsOnce(options: Partial<EmissionOptions>) {
        this.injectInitialStateOnce({ native: { sessionState: { options } } })
      },
      initialStateProvider: jest.fn<DeepPartial<AppStoreState>, void[]>(),
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
