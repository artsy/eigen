import { createTypedHooks, StoreProvider } from "easy-peasy"
import { createStore } from "easy-peasy"
import { defaultsDeep } from "lodash"
import React, { useRef } from "react"
import { Action, Middleware } from "redux"
import { AppStoreModel, appStoreModel, AppStoreState } from "./AppStoreModel"

function createAppStore() {
  const middleware: Middleware[] = []

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
    ? defaultsDeep((__appStoreTestUtils__ && __appStoreTestUtils__.injectInitialState()) ?? {}, appStoreModel)
    : appStoreModel

  return createStore<AppStoreModel>(mergedModel, {
    middleware,
  })
}

// tslint:disable-next-line:variable-name
export const __appStoreTestUtils__ = __TEST__
  ? {
      // this can be used to mock the initial state before mounting a test renderer
      // e.g. `__appStoreTestUtils__.injectInitialState.mockReturnValueOnce({ nativeState: { selectedTab: "sell" } })`
      injectInitialState: jest.fn<DeepPartial<AppStoreState>, void[]>(),
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
  if (__TEST__) {
    // generate a new app store for each unique AppStoreProvider at test time
    appStoreInstance = useRef(createAppStore()).current
  }
  return <StoreProvider store={appStoreInstance}>{children}</StoreProvider>
}

export function useSelectedTab() {
  return hooks.useStoreState(state => state.native.selectedTab)
}

let appStoreInstance = createAppStore()
