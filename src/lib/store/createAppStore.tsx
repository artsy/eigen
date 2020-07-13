import { createStore } from "easy-peasy"
import { defaultsDeep } from "lodash"
import { Middleware } from "redux"
import { AppStoreModel, appStoreModel, AppStoreState } from "./AppStoreModel"

// tslint:disable-next-line:variable-name
export const __appStoreTestUtils__ = __TEST__
  ? {
      // this can be used to mock the initial state before mounting a test renderer
      // e.g. `__appStoreTestUtils__.injectInitialState.mockReturnValueOnce({ nativeState: { selectedTab: "sell" } })`
      injectInitialState: jest.fn<DeepPartial<AppStoreState>, void[]>(),
      getCurrentState: () =>
        // actual implementation is injected below
        (null as any) as AppStoreState,
    }
  : null

export function createAppStore() {
  const middleware: Middleware[] = []
  if (__DEV__ && !__TEST__) {
    middleware.push(_api => next => action => {
      console.log(action)
      next(action)
    })
  }

  // allow individual tests to deep-merge an initial state before mounting
  const mergedModel: AppStoreModel = __TEST__
    ? defaultsDeep((__appStoreTestUtils__ && __appStoreTestUtils__.injectInitialState()) ?? {}, appStoreModel)
    : appStoreModel

  const result = createStore<AppStoreModel>(mergedModel, {
    middleware,
  })

  if (__appStoreTestUtils__) {
    __appStoreTestUtils__.getCurrentState = () => result.getState()
  }

  return result
}
